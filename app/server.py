# Rack Builder server for TrueNAS: serves the page, stores its data in /app/state.json,
# and (optionally) reports live CPU, RAM, ZFS cache and per-app usage.
import json, os, re, threading, time, http.client
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(os.environ.get("DATA_DIR", ROOT), "state.json")
PORT = int(os.environ.get("PORT", "8080"))
DOCKER = os.environ.get("DOCKER_HOST_PROXY", "")          # e.g. socket-proxy:2375
INTERVAL = max(5, int(os.environ.get("LIVE_INTERVAL", "10")))
PATH_RE = re.compile(r"^[A-Za-z0-9_\-.]{1,64}/[A-Za-z0-9_\-.:@+~]{1,200}$")

lock = threading.Lock()
try:
    with open(STATE) as f:
        DATA = json.load(f)
    assert isinstance(DATA.get("docs"), dict)
except Exception:
    DATA = {"ver": 0, "docs": {}}

def save_state():
    tmp = STATE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(DATA, f)
    os.replace(tmp, STATE)

# ---------- live stats ----------
LIVE = {"ts": 0, "docker": False, "host": {}, "containers": []}
_prev_cpu = None
_prev_ctr = {}

def host_stats():
    global _prev_cpu
    out = {}
    try:
        with open("/proc/stat") as f:
            p = [int(x) for x in f.readline().split()[1:]]
        idle, total = p[3] + (p[4] if len(p) > 4 else 0), sum(p)
        if _prev_cpu:
            dt, di = total - _prev_cpu[1], idle - _prev_cpu[0]
            out["cpu"] = round(100.0 * (dt - di) / dt, 1) if dt > 0 else 0.0
        _prev_cpu = (idle, total)
    except Exception:
        pass
    try:
        m = {}
        with open("/proc/meminfo") as f:
            for line in f:
                k, v = line.split(":", 1)
                m[k] = int(v.split()[0]) * 1024
        arc = None
        try:
            with open("/proc/spl/kstat/zfs/arcstats") as f:
                for line in f:
                    parts = line.split()
                    if len(parts) == 3 and parts[0] == "size":
                        arc = int(parts[2])
        except Exception:
            pass
        out["memTotal"] = m.get("MemTotal")
        used = m.get("MemTotal", 0) - m.get("MemAvailable", 0)
        if arc is not None:
            out["arc"] = arc
            used = max(0, used - arc) if used > arc else used   # ZFS cache counts as used by Linux; show apps+system separately
        out["memUsed"] = used
    except Exception:
        pass
    return out

def docker_get(path):
    host, _, port = DOCKER.partition(":")
    c = http.client.HTTPConnection(host, int(port or 2375), timeout=10)
    try:
        c.request("GET", path)
        r = c.getresponse()
        if r.status != 200:
            raise OSError("docker api %s" % r.status)
        return json.loads(r.read())
    finally:
        c.close()

def container_stats():
    out = []
    for ct in docker_get("/containers/json"):
        cid = ct["Id"]
        try:
            st = docker_get("/containers/%s/stats?stream=false&one-shot=true" % cid)
        except Exception:
            continue
        ms = st.get("memory_stats", {}) or {}
        mem = ms.get("usage", 0) - (ms.get("stats", {}) or {}).get("inactive_file", 0)
        cs = st.get("cpu_stats", {}) or {}
        cpu_t = (cs.get("cpu_usage", {}) or {}).get("total_usage", 0)
        sys_t = cs.get("system_cpu_usage", 0)
        ncpu = cs.get("online_cpus") or 1
        cpu = 0.0
        prev = _prev_ctr.get(cid)
        if prev and sys_t > prev[1]:
            cpu = round(100.0 * (cpu_t - prev[0]) / (sys_t - prev[1]) * ncpu, 2)
        _prev_ctr[cid] = (cpu_t, sys_t)
        labels = ct.get("Labels", {}) or {}
        out.append({"name": (ct.get("Names") or ["?"])[0].lstrip("/"),
                    "project": labels.get("com.docker.compose.project", ""),
                    "cpu": max(cpu, 0.0), "mem": max(mem, 0), "limit": ms.get("limit", 0)})
    return out

def collector():
    while True:
        h = host_stats()
        ctrs, ok = [], False
        if DOCKER:
            try:
                ctrs, ok = container_stats(), True
            except Exception:
                ok = False
        with lock:
            LIVE.update({"ts": int(time.time()), "docker": ok, "host": h, "containers": ctrs})
        time.sleep(INTERVAL)

# ---------- http ----------
class H(BaseHTTPRequestHandler):
    def send(self, code, body, ctype="application/json"):
        if isinstance(body, (dict, list)):
            body = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = self.path.split("?")[0]
        if p in ("/", "/index.html"):
            with open(os.path.join(ROOT, "index.html"), "rb") as f:
                return self.send(200, f.read(), "text/html; charset=utf-8")
        if p == "/api/ping":
            return self.send(200, {"app": "rack-builder", "docker": bool(DOCKER)})
        if p == "/api/state":
            with lock:
                return self.send(200, DATA)
        if p == "/api/live":
            with lock:
                return self.send(200, LIVE)
        self.send(404, b"not found", "text/plain")

    def do_PUT(self):
        p = self.path.split("?")[0]
        if not p.startswith("/api/doc/") or not PATH_RE.match(p[9:]):
            return self.send(404, b"not found", "text/plain")
        n = int(self.headers.get("Content-Length", 0) or 0)
        if n > 1_000_000:
            return self.send(413, b"too large", "text/plain")
        try:
            doc = json.loads(self.rfile.read(n))
            assert isinstance(doc, dict)
        except Exception:
            return self.send(400, b"bad json", "text/plain")
        with lock:
            DATA["docs"][p[9:]] = doc
            DATA["ver"] = DATA.get("ver", 0) + 1
            save_state()
            return self.send(200, {"ver": DATA["ver"]})

    def log_message(self, *a):
        pass

threading.Thread(target=collector, daemon=True).start()
ThreadingHTTPServer(("0.0.0.0", PORT), H).serve_forever()
