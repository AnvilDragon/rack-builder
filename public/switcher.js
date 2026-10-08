// Shared by Rack Builder and HRT Log: a slim bar to switch apps / sign out, and
// a global "session ended" redirect to the shared login page.
(function () {
  var f = window.fetch;
  window.fetch = function (input, init) {
    return f.call(this, input, init).then(function (r) {
      try {
        var u = new URL(typeof input === "string" ? input : input.url, location.href);
        if (r.status === 401 && u.origin === location.origin && u.pathname.indexOf("/api/auth/") !== 0)
          location.replace("/login.html?next=" + encodeURIComponent(location.pathname));
      } catch (e) {}
      return r;
    });
  };

  var apps = [["/rack/", "Rack Builder"], ["/hrt/", "HRT Log"]];
  // A literal trans-flag stripe under the nav bar — present in both themes as a fixed brand mark.
  var css = ".appnav{position:relative;display:flex;align-items:center;gap:4px;padding:6px 12px;font:600 13px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;" +
    "background:Canvas;color:CanvasText;border-bottom:1px solid rgba(128,128,128,.35)}" +
    ".appnav::after{content:'';position:absolute;left:0;right:0;bottom:-4px;height:4px;" +
    "background:linear-gradient(90deg,#5bcefa 0 20%,#f5a9b8 20% 40%,#fff 40% 60%,#f5a9b8 60% 80%,#5bcefa 80% 100%)}" +
    ".appnav a,.appnav button{font:inherit;color:inherit;text-decoration:none;background:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;opacity:.7}" +
    ".appnav a:hover,.appnav button:hover{opacity:1;background:rgba(128,128,128,.18)}" +
    ".appnav a[aria-current]{opacity:1;background:rgba(128,128,128,.25)}" +
    ".appnav a:focus-visible,.appnav button:focus-visible{outline:2px solid currentColor;outline-offset:1px}" +
    ".appnav .sp{flex:1}";
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var nav = document.createElement("nav"); nav.className = "appnav"; nav.setAttribute("aria-label", "Apps");
    apps.forEach(function (a) {
      var l = document.createElement("a"); l.href = a[0]; l.textContent = a[1];
      if (location.pathname.indexOf(a[0]) === 0) l.setAttribute("aria-current", "page");
      nav.appendChild(l);
    });
    var sp = document.createElement("span"); sp.className = "sp"; nav.appendChild(sp);
    var out = document.createElement("button"); out.type = "button"; out.textContent = "Sign out";
    out.onclick = function () {
      f("/api/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}" })
        .then(function () { location.replace("/login.html"); });
    };
    nav.appendChild(out);
    document.body.insertBefore(nav, document.body.firstChild);
  }
  if (location.hash === "#live") return; // full-screen dashboard view stays clean
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
