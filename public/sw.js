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
  var url = (event.notification.data && event.notification.data.url) || "/hrt/";
  // clients.openWindow() isn't restricted to same-origin URLs, so this requires an actual
  // same-origin path even though the server only ever sends "/hrt/" today — belt and suspenders
  // against a future payload change making this attacker-reachable.
  if (typeof url !== "string" || url.charAt(0) !== "/" || url.charAt(1) === "/") url = "/hrt/";
  event.waitUntil(self.clients.openWindow(url));
});
