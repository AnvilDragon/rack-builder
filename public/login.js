(function () {
  var $ = function (id) { return document.getElementById(id); };
  var mode = "login"; // "login" | "setup" | "reset"
  // Only same-site paths: never follow ?next=//evil.com or ?next=https://...
  function nextUrl() {
    var n = new URLSearchParams(location.search).get("next") || "";
    var bs = String.fromCharCode(92); // backslash
    return n.charAt(0) === "/" && n.charAt(1) !== "/" && n.charAt(1) !== bs ? n : "/rack/";
  }
  function show(m) {
    mode = m;
    var isSetup = m === "setup", isReset = m === "reset", extra = isSetup || isReset;
    $("title").textContent = isSetup ? "Create your login" : isReset ? "Reset password" : "Sign in";
    $("sub").textContent = isSetup ? "This one login will protect Rack Builder and HRT Log." : isReset ? "Check the container log for a one-time reset code, then set a new password." : "Rack Builder and HRT Log share this login.";
    $("go").textContent = isSetup ? "Create account" : isReset ? "Reset password" : "Sign in";
    $("urow").hidden = isReset;
    $("u").required = !isReset;
    $("hint").hidden = !extra;
    $("p2row").hidden = !extra;
    $("coderow").hidden = !extra;
    $("codelabel").textContent = isReset ? "Reset code" : "Setup code";
    $("code").required = extra;
    $("p2").required = extra;
    $("p").autocomplete = extra ? "new-password" : "current-password";
    $("p").minLength = extra ? 10 : 1;
    $("forgot").hidden = extra;
    $("back").hidden = !isReset;
  }
  function fail(m) { $("err").textContent = m; $("go").disabled = false; }

  fetch("/api/auth/status", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (s) {
    if (s.authed) { location.replace(nextUrl()); return; }
    show(s.setup ? "login" : "setup");
  }).catch(function () { fail("Couldn't reach the server."); });

  $("forgot").addEventListener("click", function () {
    $("err").textContent = ""; $("forgot").disabled = true;
    fetch("/api/auth/reset/request", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, data: j }; }); })
      .then(function (r) { $("forgot").disabled = false; if (r.ok) show("reset"); else fail(r.data.error || "Couldn't request a reset code."); })
      .catch(function () { $("forgot").disabled = false; fail("Couldn't reach the server."); });
  });
  $("back").addEventListener("click", function () { $("err").textContent = ""; show("login"); });

  $("auth").addEventListener("submit", function (ev) {
    ev.preventDefault();
    $("err").textContent = "";
    var u = $("u").value, p = $("p").value;
    if ((mode === "setup" || mode === "reset") && p !== $("p2").value) return fail("Passwords don't match.");
    $("go").disabled = true;
    var url = mode === "setup" ? "/api/auth/setup" : mode === "reset" ? "/api/auth/reset/confirm" : "/api/auth/login";
    var body = mode === "setup" ? { username: u, password: p, code: $("code").value }
      : mode === "reset" ? { password: p, code: $("code").value }
      : { username: u, password: p };
    fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, data: j }; }); })
      .then(function (r) {
        if (!r.ok) return fail(r.data.error || (mode === "reset" ? "Couldn't reset the password." : "Couldn't sign in."));
        if (mode === "reset") { $("auth").reset(); show("login"); $("sub").textContent = "Password changed. Sign in with your new password."; $("go").disabled = false; return; }
        location.replace(nextUrl());
      })
      .catch(function () { fail("Couldn't reach the server."); });
  });
})();
