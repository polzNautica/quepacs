if (typeof window !== "undefined" && window.__NEXT_DATA__) {
  const isProd = window.__NEXT_DATA__.env === "production"; 

  if (isProd) {
    import("workbox-precaching").then(({ precacheAndRoute }) => {
      precacheAndRoute(self.__WB_MANIFEST || []);
    }).catch((err) => {
      console.error("Error loading Workbox in production:", err);
    });
  } else {
    console.log("Service Worker in development mode, Workbox not loaded");
  }
}

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installed");
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
});

self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching");
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("push", function (event) {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || "New Notification";
  const body = data.body || "";

  const options = {
    body: body,
    icon: "/icons/web-app-manifest-192x192.png",
    badge: "/icons/favicon-96x96.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(
      hasActiveClients
        .then((activeClients) => {
          if (!activeClients) {
            self.numBadges += 1;
            navigator.setAppBadge(self.numBadges);
          }
        })
        .catch((err) => sendMessage(err))
    )
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      const url = event.notification.data.url || "/";

      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("pushsubscriptionchange", function (event) {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        return fetch("/api/push/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });
      })
      .catch((error) => {
        console.error("Failed to resubscribe or send new subscription:", error);
      })
  );
});
