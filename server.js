"use strict";
// Rack Builder + HRT Log in one server. Zero dependencies: node:http + node:sqlite + node:crypto + node:zlib.
// One login (scrypt, cookie session) protects everything. Layout:
//   /login.html           shared sign-in / first-time setup
//   /rack/                Rack Builder (state in DATA_DIR/state.json, live NAS stats, weekly prices)
//   /hrt/                 HRT Log (SQLite in DATA_DIR/hrt.db)
//   /api/auth/*           login, logout, setup, status, password
//   /rack/api/*, /hrt/api/*   app APIs (all require a session)
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = +process.env.PORT || 8080;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const SECURE_COOKIE = process.env.COOKIE_SECURE === "1"; // also auto-on behind X-Forwarded-Proto: https
const SESSION_DAYS = 30;
const MAX_BODY = 5 * 1024 * 1024;

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, "hrt.db"));
db.exec(`
PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY CHECK(id=1), username TEXT NOT NULL, pw TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS session(h TEXT PRIMARY KEY, exp INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS entries(date TEXT PRIMARY KEY, time TEXT, note TEXT,
  len REAL, flac REAL, half REAL, erect REAL, tL REAL, tR REAL, bust REAL, under REAL, weight REAL) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS shots(id INTEGER PRIMARY KEY, date TEXT NOT NULL, ml REAL NOT NULL, site TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS labs(id INTEGER PRIMARY KEY, date TEXT NOT NULL, e2 REAL, t REAL, done INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS shots_date ON shots(date);
CREATE INDEX IF NOT EXISTS labs_date ON labs(date);
`);

// =====================================================================================
// HRT Log: validation, data access
// =====================================================================================
const FIELDS = ["len", "flac", "half", "erect", "tL", "tR", "bust", "under", "weight"];
const SITES = ["Thigh L", "Thigh R", "Thigh", "Belly", "Glute", "Arm"];
const DRE = /^\d{4}-\d{2}-\d{2}$/, TRE = /^\d{2}:\d{2}$/;
const okDate = s => typeof s === "string" && DRE.test(s) && isFinite(Date.parse(s + "T00:00:00Z"));
const pos = v => { const n = typeof v === "number" ? v : parseFloat(v); return isFinite(n) && n >= 0 && n < 100000 ? n : null; };
function clean(s) {
  s = s && typeof s === "object" ? s : {};
  const tp = Array.isArray(s.targetPeak) && pos(s.targetPeak[0]) != null && pos(s.targetPeak[1]) != null ? [pos(s.targetPeak[0]), pos(s.targetPeak[1])] : [380, 440];
  const o = { start: okDate(s.start) ? s.start : "", conc: pos(s.conc) || 40, shotEvery: pos(s.shotEvery) || 7, targetPeak: tp, entries: [], shots: [], labs: [] };
  const seen = new Set();
  for (const e of Array.isArray(s.entries) ? s.entries : []) {
    if (!e || !okDate(e.date) || seen.has(e.date)) continue;
    seen.add(e.date);
    const x = { date: e.date };
    for (const f of FIELDS) { const n = pos(e[f]); if (n != null) x[f] = n; }
    if (typeof e.time === "string" && TRE.test(e.time)) x.time = e.time;
    if (typeof e.note === "string" && e.note) x.note = e.note.slice(0, 2000);
    o.entries.push(x);
  }
  for (const e of Array.isArray(s.shots) ? s.shots : []) if (e && okDate(e.date) && pos(e.ml) != null) o.shots.push({ date: e.date, ml: pos(e.ml), site: SITES.includes(e.site) ? e.site : "Thigh" });
  for (const e of Array.isArray(s.labs) ? s.labs : []) {
    if (!e || !okDate(e.date)) continue;
    const x = { date: e.date };
    if (pos(e.e2) != null) x.e2 = pos(e.e2);
    if (pos(e.t) != null) x.t = pos(e.t);
    x.done = x.e2 != null || x.t != null;
    o.labs.push(x);
  }
  for (const k of ["entries", "shots", "labs"]) o[k].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return o;
}

const getSetting = k => { const r = db.prepare("SELECT v FROM settings WHERE k=?").get(k); return r ? JSON.parse(r.v) : null; };
const setSetting = (k, v) => db.prepare("INSERT INTO settings(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(k, JSON.stringify(v));
const getRev = () => getSetting("rev") || 0;

function readState() {
  const entries = db.prepare("SELECT * FROM entries ORDER BY date").all().map(r => {
    const x = {}; for (const k in r) if (r[k] != null) x[k] = r[k]; return x;
  });
  const shots = db.prepare("SELECT date,ml,site FROM shots ORDER BY date,id").all();
  const labs = db.prepare("SELECT date,e2,t,done FROM labs ORDER BY date,id").all().map(r => {
    const x = { date: r.date }; if (r.e2 != null) x.e2 = r.e2; if (r.t != null) x.t = r.t; x.done = !!r.done; return x;
  });
  const m = getSetting("meta") || {};
  return clean({ start: m.start, conc: m.conc, shotEvery: m.shotEvery, targetPeak: m.targetPeak, entries, shots, labs });
}
function writeState(raw) {
  const s = clean(raw);
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec("DELETE FROM entries; DELETE FROM shots; DELETE FROM labs");
    const ie = db.prepare(`INSERT INTO entries(date,time,note,${FIELDS.join(",")}) VALUES(?,?,?,${FIELDS.map(() => "?").join(",")})`);
    for (const e of s.entries) ie.run(e.date, e.time ?? null, e.note ?? null, ...FIELDS.map(f => e[f] ?? null));
    const is = db.prepare("INSERT INTO shots(date,ml,site) VALUES(?,?,?)");
    for (const x of s.shots) is.run(x.date, x.ml, x.site);
    const il = db.prepare("INSERT INTO labs(date,e2,t,done) VALUES(?,?,?,?)");
    for (const x of s.labs) il.run(x.date, x.e2 ?? null, x.t ?? null, x.done ? 1 : 0);
    setSetting("meta", { start: s.start, conc: s.conc, shotEvery: s.shotEvery, targetPeak: s.targetPeak });
    const rev = getRev() + 1; setSetting("rev", rev);
    db.exec("COMMIT");
    return rev;
  } catch (e) { db.exec("ROLLBACK"); throw e; }
}

// =====================================================================================
// Rack Builder: documents in state.json (kept compatible with the old Python server)
// =====================================================================================
const RB_STATE = path.join(DATA_DIR, "state.json");
const RB_PATH_RE = /^[A-Za-z0-9_\-.]{1,64}\/[A-Za-z0-9_\-.:@+~]{1,200}$/;
const KEY_RE = /^[A-Za-z0-9_\-.]{1,64}$/;
let RB = { ver: 0, docs: {} };
try {
  const d = JSON.parse(fs.readFileSync(RB_STATE, "utf8"));
  if (d && typeof d.docs === "object" && d.docs && !Array.isArray(d.docs)) RB = d;
} catch {}
function saveRb() {
  const tmp = RB_STATE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(RB));
  fs.renameSync(tmp, RB_STATE);
}

// ---------- live NAS stats ----------
const DOCKER = process.env.DOCKER_HOST_PROXY || ""; // e.g. socket-proxy:2375
const INTERVAL = Math.max(1, parseInt(process.env.LIVE_INTERVAL || "1", 10) || 1);
const HIST_LEN = 120; // samples kept per app (2 minutes at 1 s)
const LIVE = { ts: 0, docker: false, host: {}, containers: [], apps: [], interval: INTERVAL };
let prevCpu = null;
const prevCtr = new Map(), prevIo = new Map(), inspected = new Map(), HIST = new Map();

function hostStats() {
  const out = {};
  try {
    const p = fs.readFileSync("/proc/stat", "utf8").split("\n")[0].trim().split(/\s+/).slice(1).map(Number);
    const idle = p[3] + (p.length > 4 ? p[4] : 0), total = p.reduce((a, b) => a + b, 0);
    if (prevCpu) {
      const dt = total - prevCpu[1], di = idle - prevCpu[0];
      out.cpu = dt > 0 ? Math.round(1000 * (dt - di) / dt) / 10 : 0;
    }
    prevCpu = [idle, total];
  } catch {}
  try {
    const m = {};
    for (const line of fs.readFileSync("/proc/meminfo", "utf8").split("\n")) {
      const i = line.indexOf(":"); if (i < 0) continue;
      m[line.slice(0, i)] = parseInt(line.slice(i + 1).trim().split(/\s+/)[0], 10) * 1024;
    }
    let arc = null;
    try {
      for (const line of fs.readFileSync("/proc/spl/kstat/zfs/arcstats", "utf8").split("\n")) {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 3 && parts[0] === "size") arc = parseInt(parts[2], 10);
      }
    } catch {}
    out.memTotal = m.MemTotal;
    let used = (m.MemTotal || 0) - (m.MemAvailable || 0);
    if (arc != null) { out.arc = arc; if (used > arc) used = Math.max(0, used - arc); } // ZFS cache counts as used by Linux; show apps+system separately
    out.memUsed = used;
  } catch {}
  return out;
}

function dockerGet(p) {
  const [host, port] = DOCKER.split(":");
  return new Promise((resolve, reject) => {
    const req = http.request({ host, port: +port || 2375, path: p, method: "GET", timeout: 10000 }, res => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        if (res.statusCode !== 200) return reject(new Error("docker api " + res.statusCode));
        try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch (e) { reject(e); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("docker timeout")));
    req.on("error", reject);
    req.end();
  });
}

async function oneContainer(ct) {
  const cid = ct.Id;
  let st;
  try { st = await dockerGet(`/containers/${cid}/stats?stream=false&one-shot=true`); } catch { return null; }
  if (!inspected.has(cid)) {
    try { const hc = (await dockerGet(`/containers/${cid}/json`)).HostConfig || {}; inspected.set(cid, (hc.NanoCpus || 0) / 1e9); }
    catch { inspected.set(cid, 0); }
  }
  const ms = st.memory_stats || {};
  const mem = (ms.usage || 0) - ((ms.stats || {}).inactive_file || 0);
  const cs = st.cpu_stats || {};
  const cpuT = (cs.cpu_usage || {}).total_usage || 0, sysT = cs.system_cpu_usage || 0, ncpu = cs.online_cpus || 1;
  let cpu = 0;
  const prev = prevCtr.get(cid);
  if (prev && sysT > prev[1]) cpu = Math.round(10000 * (cpuT - prev[0]) / (sysT - prev[1]) * ncpu) / 100;
  prevCtr.set(cid, [cpuT, sysT]);
  let rx = 0, tx = 0, rd = 0, wr = 0;
  for (const n of Object.values(st.networks || {})) { rx += (n || {}).rx_bytes || 0; tx += (n || {}).tx_bytes || 0; }
  for (const e of (st.blkio_stats || {}).io_service_bytes_recursive || []) {
    const op = String(e.op || "").toLowerCase();
    if (op === "read") rd += e.value || 0; else if (op === "write") wr += e.value || 0;
  }
  const now = Date.now() / 1000;
  let rates = [0, 0, 0, 0];
  const pv = prevIo.get(cid);
  if (pv && now > pv[0]) { const dt = now - pv[0]; rates = [rx, tx, rd, wr].map((v, i) => Math.max(0, (v - pv[i + 1]) / dt)); }
  prevIo.set(cid, [now, rx, tx, rd, wr]);
  const labels = ct.Labels || {};
  const ports = new Set(); let ip = "";
  for (const pt of ct.Ports || []) if (pt.PublicPort) { ports.add(String(pt.PublicPort)); if (pt.IP && pt.IP !== "0.0.0.0" && pt.IP !== "::") ip = pt.IP; }
  return { id: cid.slice(0, 12), name: ((ct.Names || ["?"])[0] || "?").replace(/^\//, ""), project: labels["com.docker.compose.project"] || "",
    cpu: Math.max(cpu, 0), mem: Math.max(mem, 0), limit: ms.limit || 0, cpus: inspected.get(cid) || 0, rx: rates[0], tx: rates[1], rd: rates[2], wr: rates[3],
    state: ct.State || "", health: ct.Status || "", ports: [...ports].sort((a, b) => a - b), ip };
}

async function containerStats() {
  const cts = await dockerGet("/containers/json");
  const live = new Set(cts.map(c => c.Id));
  for (const m of [inspected, prevCtr, prevIo]) for (const k of [...m.keys()]) if (!live.has(k)) m.delete(k);
  const out = [];
  for (let i = 0; i < cts.length; i += 8) out.push(...(await Promise.all(cts.slice(i, i + 8).map(oneContainer))).filter(Boolean));
  return out;
}

async function collect() {
  const h = hostStats();
  let ctrs = [], ok = false;
  if (DOCKER) { try { ctrs = await containerStats(); ok = true; } catch { ok = false; } }
  const apps = new Map();
  for (const c of ctrs) {
    const key = c.project || c.name;
    let a = apps.get(key);
    if (!a) apps.set(key, a = { project: key, cpu: 0, mem: 0, limit: 0, cpus: 0, rx: 0, tx: 0, rd: 0, wr: 0, n: 0, health: "" });
    for (const f of ["cpu", "mem", "limit", "cpus", "rx", "tx", "rd", "wr"]) a[f] += c[f] || 0;
    a.n++;
    if ((c.health || "").includes("unhealthy") || !a.health) a.health = c.health || "";
  }
  const ts = Math.floor(Date.now() / 1000);
  for (const [key, a] of apps) {
    let hq = HIST.get(key); if (!hq) HIST.set(key, hq = []);
    hq.push([ts, Math.round(a.cpu * 100) / 100, a.mem, Math.round(a.rx), Math.round(a.tx), Math.round(a.rd), Math.round(a.wr)]);
    if (hq.length > HIST_LEN) hq.shift();
    a.hist = hq.slice();
  }
  for (const key of [...HIST.keys()]) if (!apps.has(key)) HIST.delete(key);
  Object.assign(LIVE, { ts, docker: ok, host: h, containers: ctrs, apps: [...apps.values()], interval: INTERVAL });
}
(async function loop() {
  for (;;) {
    const t0 = Date.now();
    try { await collect(); } catch {}
    await new Promise(r => setTimeout(r, Math.max(50, INTERVAL * 1000 - (Date.now() - t0))));
  }
})();

// ---------- weekly prices from the GitHub repo ----------
const PRICES_REPO = process.env.PRICES_REPO || "AnvilDragon/rack-builder";
const PRICES_TOKEN = process.env.PRICES_TOKEN || "";
const PRICES_EVERY = Math.max(1, parseInt(process.env.PRICES_EVERY_HOURS || "6", 10) || 6) * 3600e3;
const PRICES = { last: 0, ok: false, count: 0 };

async function fetchPrices() {
  const r = await fetch(`https://api.github.com/repos/${PRICES_REPO}/contents/prices.json`, {
    headers: { Accept: "application/vnd.github.raw+json", Authorization: "Bearer " + PRICES_TOKEN, "User-Agent": "rack-builder", "X-GitHub-Api-Version": "2022-11-28" },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error("github " + r.status);
  const data = await r.json();
  let changed = 0;
  for (const [k, v] of Object.entries(data)) {
    if (KEY_RE.test(k) && v && typeof v === "object" && !Array.isArray(v) && typeof v.price === "number") {
      const key = "prices/" + k;
      if (JSON.stringify(RB.docs[key]) !== JSON.stringify(v)) { RB.docs[key] = v; changed++; }
    }
  }
  if (changed) { RB.ver = (RB.ver || 0) + 1; saveRb(); }
  Object.assign(PRICES, { last: Math.floor(Date.now() / 1000), ok: true, count: Object.keys(data).length });
}
(async function priceLoop() {
  for (;;) {
    if (PRICES_TOKEN && !PRICES_TOKEN.startsWith("paste-")) {
      try { await fetchPrices(); } catch { Object.assign(PRICES, { last: Math.floor(Date.now() / 1000), ok: false }); }
    }
    await new Promise(r => setTimeout(r, PRICES_EVERY));
  }
})();

// =====================================================================================
// Auth (shared by both apps)
// =====================================================================================
const hasUser = () => !!db.prepare("SELECT 1 FROM user WHERE id=1").get();
// First-time setup is protected by a one-time code printed in the container log, so whoever
// reaches the port first on the network cannot claim the login. Set SETUP_CODE to choose your own.
const SETUP_CODE = hasUser() ? "" : (process.env.SETUP_CODE || crypto.randomBytes(6).toString("hex"));
if (SETUP_CODE) console.log(`First-time setup: enter this setup code on the sign-in page: ${SETUP_CODE}`);
const FIRST_USER = (() => { try { return (fs.readFileSync(path.join(DATA_DIR, "first-user.txt"), "utf8") || process.env.FIRST_USER || "").trim().toLowerCase(); } catch { return (process.env.FIRST_USER || "").trim().toLowerCase(); } })();
const sameSecret =(a, b) => { const x = crypto.createHash("sha256").update(String(a)).digest(), y = crypto.createHash("sha256").update(String(b)).digest(); return crypto.timingSafeEqual(x, y); };
const SCRYPT = { N: 16384, r: 8, p: 1 };
function hashPw(pw) {
  const salt = crypto.randomBytes(16);
  const h = crypto.scryptSync(pw, salt, 32, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${h.toString("base64")}`;
}
function checkPw(pw, stored) {
  const [, s, h] = stored.split("$");
  const want = Buffer.from(h, "base64");
  const got = crypto.scryptSync(pw, Buffer.from(s, "base64"), want.length, SCRYPT);
  return crypto.timingSafeEqual(got, want);
}
const sha = t => crypto.createHash("sha256").update(t).digest("hex");
const DUMMY_PW = hashPw(crypto.randomBytes(16).toString("hex"));
function newSession() {
  const t = crypto.randomBytes(32).toString("base64url");
  db.prepare("INSERT INTO session(h,exp) VALUES(?,?)").run(sha(t), Date.now() + SESSION_DAYS * 864e5);
  return t;
}
// The cookie keeps the name "hrt" so sessions of an existing HRT Log database stay valid.
const COOKIE = "hrt";
function parseCookies(req) {
  const o = {}; for (const p of (req.headers.cookie || "").split(";")) { const i = p.indexOf("="); if (i > 0) o[p.slice(0, i).trim()] = p.slice(i + 1).trim(); } return o;
}
function sessionHash(req) {
  const t = parseCookies(req)[COOKIE]; if (!t) return null;
  const h = sha(t), r = db.prepare("SELECT exp FROM session WHERE h=?").get(h);
  return r && r.exp > Date.now() ? h : null;
}
const isHttps = req => SECURE_COOKIE || req.headers["x-forwarded-proto"] === "https";
const cookie = (req, v, maxAge) => `${COOKIE}=${v}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${isHttps(req) ? "; Secure" : ""}`;
const authed = req => hasUser() && !!sessionHash(req);

// brute-force protection: 5 failures => 15 min lock, per client IP and globally (single user)
const fails = new Map();
const ipOf = req => req.socket.remoteAddress || "?";
function locked(keys) { const now = Date.now(); return keys.some(k => { const f = fails.get(k); return f && f.until > now; }); }
function failed(keys) { for (const k of keys) { const f = fails.get(k) || { n: 0, until: 0 }; if (++f.n >= (k === "*" ? 20 : 5)) { f.until = Date.now() + 15 * 60e3; f.n = 0; } fails.set(k, f); } }
const cleared = keys => keys.forEach(k => fails.delete(k));

// =====================================================================================
// HTTP helpers
// =====================================================================================
const SEC = {
  // Everything is same-origin: no third-party fonts, scripts, images or trackers.
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'",
  "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", "Cross-Origin-Opener-Policy": "same-origin",
};
function send(res, code, body, headers = {}) {
  res.writeHead(code, { ...SEC, "Cache-Control": "no-store", ...headers });
  res.end(body);
}
const json = (res, code, obj, h) => send(res, code, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8", ...h });
const redirect = (res, to) => send(res, 302, "", { Location: to });
function readBody(req, max = MAX_BODY) {
  // A moderately oversized body is drained (not buffered) and gets a clean 413.
  // Only a wildly oversized one — someone actually trying to flood us — cuts the
  // connection outright, so a normal client never sees a dropped connection instead
  // of an error it can understand.
  const HARD_CAP = Math.max(max * 4, 2 * 1024 * 1024);
  return new Promise((resolve, reject) => {
    let n = 0, tooLarge = false; const chunks = [];
    req.on("data", c => {
      n += c.length;
      if (n > HARD_CAP) { reject(Object.assign(new Error("too large"), { code: 413 })); req.destroy(); return; }
      if (n > max) { tooLarge = true; return; }
      chunks.push(c);
    });
    req.on("end", () => {
      if (tooLarge) return reject(Object.assign(new Error("too large"), { code: 413 }));
      try {
        const v = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
        if (!v || typeof v !== "object" || Array.isArray(v)) throw 0; // every handler expects a plain object
        resolve(v);
      } catch { reject(Object.assign(new Error("bad json"), { code: 400 })); }
    });
    req.on("error", reject);
  });
}

// ---------- static files (loaded once, pre-gzipped, ETag revalidation) ----------
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const statics = new Map();
(function loadStatics(dir, base = "") {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name), url = base + "/" + f.name;
    if (f.isDirectory()) { loadStatics(p, url); continue; }
    const buf = fs.readFileSync(p), type = TYPES[path.extname(f.name)];
    if (!type) continue;
    const text = /^(text|image\/svg|application\/manifest)|javascript/.test(type);
    statics.set(url, { type, buf, gz: text ? zlib.gzipSync(buf, { level: 9 }) : null, etag: '"' + sha(buf.toString("base64")).slice(0, 20) + '"' });
  }
})(path.join(__dirname, "public"));
function serveStatic(req, res, url) {
  const f = statics.get(url);
  if (!f) return send(res, 404, "Not found", { "Content-Type": "text/plain" });
  const h = { "Content-Type": f.type, ETag: f.etag, "Cache-Control": "private, no-cache", Vary: "Accept-Encoding" };
  if (req.headers["if-none-match"] === f.etag) return send(res, 304, "", h);
  if (f.gz && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) return send(res, 200, f.gz, { ...h, "Content-Encoding": "gzip", "Content-Length": f.gz.length });
  send(res, 200, f.buf, { ...h, "Content-Length": f.buf.length });
}
// Files anyone may fetch before signing in. Everything else under /rack/ and /hrt/ needs a session.
const PUBLIC_FILES = new Set(["/login.html", "/login.js", "/login.css", "/manifest.webmanifest"]);
const isPublic = p => PUBLIC_FILES.has(p) || p.startsWith("/icons/");

// ---------- HRT export ----------
const CSV_COLS = ["type", "date", "time", ...FIELDS, "note", "ml", "site", "e2", "t"];
const csvCell = v => { if (v == null) return ""; const s = String(v).replace(/^([=+\-@\t\r])/, "'$1"); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
function toCsv(s) {
  const rows = [CSV_COLS.join(",")];
  for (const [type, list] of [["entry", s.entries], ["shot", s.shots], ["lab", s.labs]]) for (const x of list) rows.push(CSV_COLS.map(c => (c === "type" ? type : csvCell(x[c]))).join(","));
  return "﻿" + rows.join("\r\n") + "\r\n";
}
const stamp = () => new Date().toISOString().slice(0, 10);

// =====================================================================================
// Routes
// =====================================================================================
async function authApi(req, res, url) {
  const m = req.method;
  if (url === "/api/auth/status" && m === "GET") return json(res, 200, { setup: hasUser(), authed: authed(req) });

  if (url === "/api/auth/setup" && m === "POST") {
    if (hasUser()) return json(res, 409, { error: "already set up" });
    const keys = [ipOf(req), "*"];
    if (locked(keys)) return json(res, 429, { error: "Too many attempts. Try again in 15 minutes." });
    const b = await readBody(req), u = String(b.username || "").trim(), p = String(b.password || "");
    const codeOk = !!SETUP_CODE && sameSecret(String(b.code || "").trim().toLowerCase(), SETUP_CODE.toLowerCase());
    const nameOk = !FIRST_USER || u.toLowerCase() === FIRST_USER;
    if (!codeOk || !nameOk) { failed(keys); return json(res, 403, { error: "Couldn't create the account. Check the setup code." }); }
    if (u.length < 1 || u.length > 64) return json(res, 400, { error: "Enter a username." });
    if (p.length < 10 || p.length > 256) return json(res, 400, { error: "Password must be at least 10 characters." });
    db.prepare("INSERT INTO user(id,username,pw) VALUES(1,?,?)").run(u, hashPw(p));
    if (!db.prepare("SELECT 1 FROM entries LIMIT 1").get() && !db.prepare("SELECT 1 FROM shots LIMIT 1").get()) {
      try { writeState(JSON.parse(fs.readFileSync(path.join(DATA_DIR, "hrt-seed.json"), "utf8"))); } catch {}
    }
    return json(res, 200, { ok: true }, { "Set-Cookie": cookie(req, newSession(), SESSION_DAYS * 86400) });
  }

  if (url === "/api/auth/login" && m === "POST") {
    const keys = [ipOf(req), "*"];
    if (locked(keys)) return json(res, 429, { error: "Too many attempts. Try again in 15 minutes." });
    const b = await readBody(req), u = db.prepare("SELECT username,pw FROM user WHERE id=1").get();
    // Always run the password hash so a wrong username takes as long as a wrong password.
    const nameOk = !!u && String(b.username || "").trim().toLowerCase() === u.username.toLowerCase();
    const pwOk = checkPw(String(b.password || ""), u ? u.pw : DUMMY_PW);
    const ok = nameOk && pwOk;
    if (!ok) { failed(keys); return json(res, 401, { error: "Wrong username or password." }); }
    cleared(keys);
    db.prepare("DELETE FROM session WHERE exp<?").run(Date.now());
    return json(res, 200, { ok: true }, { "Set-Cookie": cookie(req, newSession(), SESSION_DAYS * 86400) });
  }

  const sh = hasUser() ? sessionHash(req) : null;
  if (!sh) return json(res, 401, { error: "auth" });

  if (url === "/api/auth/logout" && m === "POST") {
    db.prepare("DELETE FROM session WHERE h=?").run(sh);
    return json(res, 200, { ok: true }, { "Set-Cookie": cookie(req, "", 0) });
  }
  if (url === "/api/auth/password" && m === "POST") {
    const b = await readBody(req), u = db.prepare("SELECT pw FROM user WHERE id=1").get(), p = String(b.next || "");
    const keys = [ipOf(req), "*"];
    if (locked(keys)) return json(res, 429, { error: "Too many attempts. Try again in 15 minutes." });
    if (!checkPw(String(b.current || ""), u.pw)) { failed(keys); return json(res, 401, { error: "Current password is wrong." }); }
    if (p.length < 10 || p.length > 256) return json(res, 400, { error: "New password must be at least 10 characters." });
    db.prepare("UPDATE user SET pw=? WHERE id=1").run(hashPw(p));
    db.prepare("DELETE FROM session WHERE h<>?").run(sh); // sign out other devices
    return json(res, 200, { ok: true });
  }
  return json(res, 404, { error: "not found" });
}

async function hrtApi(req, res, url, q) {
  const m = req.method;
  if (url === "/hrt/api/state" && m === "GET") return json(res, 200, { rev: getRev(), state: readState() });
  if (url === "/hrt/api/state" && m === "PUT") {
    const b = await readBody(req);
    if (!b.state || typeof b.state !== "object" || Array.isArray(b.state)) return json(res, 400, { error: "bad state" }); // never wipe the log on a malformed save
    if (b.rev !== getRev()) return json(res, 409, { error: "stale", rev: getRev() });
    return json(res, 200, { rev: writeState(b.state) });
  }
  if (url === "/hrt/api/import" && m === "POST") {
    const b = await readBody(req), s = b.state || b;
    if (!s || !Array.isArray(s.entries) || !Array.isArray(s.shots) || !Array.isArray(s.labs)) return json(res, 400, { error: "That file isn't an HRT Log export." });
    return json(res, 200, { rev: writeState(s) });
  }
  if (url === "/hrt/api/export" && m === "GET") {
    const f = q.get("format") || "json";
    if (f === "csv") return send(res, 200, toCsv(readState()), { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="hrt-log-${stamp()}.csv"` });
    if (f === "sqlite") {
      // Backup contains the login hash and sessions too: strip them from the copy.
      const tmp = path.join(DATA_DIR, `backup-${crypto.randomBytes(8).toString("hex")}.tmp`); // unique, so two exports cannot collide
      try {
        fs.rmSync(tmp, { force: true }); db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}'`);
        const bk = new DatabaseSync(tmp); bk.exec("DELETE FROM session; DELETE FROM user; VACUUM"); bk.close();
        return send(res, 200, fs.readFileSync(tmp), { "Content-Type": "application/vnd.sqlite3", "Content-Disposition": `attachment; filename="hrt-log-${stamp()}.db"` });
      } finally { fs.rmSync(tmp, { force: true }); }
    }
    return send(res, 200, JSON.stringify({ app: "hrt-log", version: 1, exported: new Date().toISOString(), state: readState() }, null, 2), { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="hrt-log-${stamp()}.json"` });
  }
  return json(res, 404, { error: "not found" });
}

// Rack docs are stored verbatim and re-serialized (JSON.stringify) on every future save AND
// every GET /rack/api/state. V8's JSON.stringify is recursive, so a tiny but deeply-nested
// body (trivial to fit under the 1MB cap — "[[[[...]]]]" is 2 bytes per level) can blow its
// call stack and 500 on every read from then on, not just the one request that stored it.
// Reject anything too deep before it's ever stored. The walk itself uses an explicit stack,
// not recursion, so it can't be turned into the same problem it's checking for.
function tooDeep(v, limit = 64) {
  const stack = [[v, 0]];
  while (stack.length) {
    const [node, depth] = stack.pop();
    if (depth > limit) return true;
    if (node && typeof node === "object") for (const k in node) stack.push([node[k], depth + 1]);
  }
  return false;
}

async function rackApi(req, res, url) {
  const m = req.method;
  if (url === "/rack/api/ping" && m === "GET") return json(res, 200, { app: "rack-builder", docker: !!DOCKER, prices: PRICES });
  if (url === "/rack/api/state" && m === "GET") return json(res, 200, RB);
  if (url === "/rack/api/live" && m === "GET") return json(res, 200, LIVE);
  if (url.startsWith("/rack/api/doc/") && m === "PUT") {
    const key = url.slice("/rack/api/doc/".length);
    if (!RB_PATH_RE.test(key)) return json(res, 404, { error: "not found" });
    const doc = await readBody(req, 1_000_000);
    if (!doc || typeof doc !== "object" || Array.isArray(doc) || tooDeep(doc)) return json(res, 400, { error: "bad json" });
    RB.docs[key] = doc; RB.ver = (RB.ver || 0) + 1; saveRb();
    return json(res, 200, { ver: RB.ver });
  }
  return json(res, 404, { error: "not found" });
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://x"), p = u.pathname, m = req.method;
    if (p === "/healthz") return send(res, 200, "ok", { "Content-Type": "text/plain" });

    if (p.startsWith("/api/") || p.startsWith("/rack/api/") || p.startsWith("/hrt/api/")) {
      if (m !== "GET" && m !== "HEAD") {
        // CSRF: same-origin only (plus SameSite=Strict cookie)
        const o = req.headers.origin;
        if (o && new URL(o).host !== req.headers.host) return json(res, 403, { error: "bad origin" });
        if (!(req.headers["content-type"] || "").startsWith("application/json")) return json(res, 415, { error: "json only" });
      }
      if (p.startsWith("/api/auth/")) return await authApi(req, res, p);
      if (!authed(req)) return json(res, 401, { error: "auth" });
      if (p.startsWith("/rack/api/")) return await rackApi(req, res, p);
      if (p.startsWith("/hrt/api/")) return await hrtApi(req, res, p, u.searchParams);
      return json(res, 404, { error: "not found" });
    }

    if (m !== "GET" && m !== "HEAD") return send(res, 405, "Method not allowed");
    if (isPublic(p)) return serveStatic(req, res, p);
    if (!authed(req)) {
      // Not signed in (or not set up yet): send the browser to the shared login page.
      const next = p === "/" ? "" : "?next=" + encodeURIComponent(p + u.search);
      return redirect(res, "/login.html" + next);
    }
    if (p === "/") return redirect(res, "/rack/");
    if (p === "/rack" || p === "/hrt") return redirect(res, p + "/");
    return serveStatic(req, res, p.endsWith("/") ? p + "index.html" : p);
  } catch (e) {
    if (e.code === 413 || e.code === 400) return json(res, e.code, { error: e.message });
    console.error(e); if (!res.headersSent) json(res, 500, { error: "server error" });
  }
});
server.keepAliveTimeout = 65e3; server.headersTimeout = 20e3; server.requestTimeout = 30e3;
server.listen(PORT, "0.0.0.0", () => console.log(`Rack Builder + HRT Log listening on :${PORT}, data in ${DATA_DIR}`));
const stop = () => { server.close(() => { try { db.exec("PRAGMA wal_checkpoint(TRUNCATE)"); db.close(); } catch {} process.exit(0); }); setTimeout(() => process.exit(0), 5000).unref(); };
process.on("SIGTERM", stop); process.on("SIGINT", stop);
