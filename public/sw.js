self.addEventListener("push", function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  event.waitUntil(self.registration.showNotification(data.title || "HRT Log", {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    tag: "hrt-reminder",
    data: { url: data.url || "/hrt/" },
  }));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var raw = (event.notification.data && event.notification.data.url) || "/hrt/";
  // clients.openWindow() isn't restricted to same-origin URLs, so this requires an actual
  // same-origin path even though the server only ever sends "/hrt/" today — belt and suspenders
  // against a future payload change making this attacker-reachable. Checking the raw string's
  // prefix isn't enough: browsers treat a leading backslash as slash-equivalent for special
  // schemes, so "/\\evil.example/" looks like a safe path by a charAt() check but resolves to
  // a different origin entirely. Resolving it the same way the browser will and checking the
  // actual resulting origin closes that (and anything else shaped like it) in one step.
  var url = "/hrt/";
  try {
    var resolved = new URL(raw, self.location.origin);
    if (resolved.origin === self.location.origin) url = resolved.href;
  } catch (e) {}
  event.waitUntil(self.clients.openWindow(url));
});
