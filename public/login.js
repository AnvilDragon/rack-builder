(function () {
  var $ = function (id) { return document.getElementById(id); };
  var setup = false;
  // Only same-site paths: never follow ?next=//evil.com or ?next=https://...
  function nextUrl() {
    var n = new URLSearchParams(location.search).get("next") || "";
    var bs = String.fromCharCode(92); // backslash
    return n.charAt(0) === "/" && n.charAt(1) !== "/" && n.charAt(1) !== bs ? n : "/rack/";
  }
  function show(isSetup) {
    setup = isSetup;
    $("title").textContent = isSetup ? "Create your login" : "Sign in";
    $("sub").textContent = isSetup ? "This one login will protect Rack Builder and HRT Log." : "Rack Builder and HRT Log share this login.";
    $("go").textContent = isSetup ? "Create account" : "Sign in";
    $("hint").hidden = !isSetup;
    $("p2row").hidden = !isSetup;
    $("coderow").hidden = !isSetup;
    $("code").required = isSetup;
    $("p2").required = isSetup;
    $("p").autocomplete = isSetup ? "new-password" : "current-password";
    $("p").minLength = isSetup ? 10 : 1;
  }
  function fail(m) { $("err").textContent = m; $("go").disabled = false; }

  fetch("/api/auth/status", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (s) {
    if (s.authed) { location.replace(nextUrl()); return; }
    show(!s.setup);
  }).catch(function () { fail("Couldn't reach the server."); });

  $("auth").addEventListener("submit", function (ev) {
    ev.preventDefault();
    $("err").textContent = "";
    var u = $("u").value, p = $("p").value;
    if (setup && p !== $("p2").value) return fail("Passwords don't match.");
    $("go").disabled = true;
    fetch(setup ? "/api/auth/setup" : "/api/auth/login", {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(setup ? { username: u, password: p, code: $("code").value } : { username: u, password: p })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, data: j }; }); })
      .then(function (r) { if (r.ok) location.replace(nextUrl()); else fail(r.data.error || "Couldn't sign in."); })
      .catch(function () { fail("Couldn't reach the server."); });
  });
})();
