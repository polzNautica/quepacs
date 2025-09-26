self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installed");
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

