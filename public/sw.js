self.addEventListener('push', function (event) {
  console.log('Push event received:', event);
  
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log('Push data:', data);
  } catch (error) {
    console.log('Error parsing push data:', error);
    // Fallback: show a basic notification
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: '/icons/web-app-manifest-192x192.png',
        badge: '/icons/favicon-96x96.png'
      })
    );
    return;
  }

  const options = {
    body: data.body || 'No content',
    icon: data.icon || '/icons/web-app-manifest-192x192.png',
    badge: data.badge || '/icons/favicon-96x96.png',
    image: data.image,
    data: data.data || { url: data.url || '/' },
    tag: data.tag || 'default-notification',
    requireInteraction: data.requireInteraction || true,
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/web-app-manifest-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/web-app-manifest-192x192.png'
      }
    ],
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Default Title',
      options
    )
  );
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received:', event);
  
  event.notification.close();

  const url = event.notification.data?.url || '/';

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function (clientList) {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  }
});