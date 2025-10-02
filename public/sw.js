self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(self.clients.claim());
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName.startsWith("push-")) {
          return caches.delete(cacheName);
        }
      })
    );
  });
  console.log("[Service Worker] Ready for push notifications!");
});

// Push event handler
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received");

  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    data = {
      title: "New Notification",
      body: "You have a new message",
    };
  }

  const options = {
    body: data.body,
    icon: "/icons/web-app-manifest-192x192.png",
    badge: "/icons/favicon-96x96.png",
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Close" },
    ],
    tag: data.tag,
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const url = event.notification.data?.url || "/";

      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
