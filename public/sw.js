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
  event.waitUntil(self.clients.openWindow(url));
});
