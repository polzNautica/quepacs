import webpush from "web-push";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:gtppower00@gmail.com", 
    vapidPublicKey,
    vapidPrivateKey
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: {
    title: string;
    body: string;
    url?: string;
    data?: any;
  }
) {
  try {
    // Create the notification payload that the service worker expects
    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: "/icons/web-app-manifest-192x192.png",
      badge: "/icons/favicon-96x96.png",
      // image: "/icons/web-app-manifest-192x192.png",
      url: payload.url || "/",
      data: {
        url: payload.url || "/",
        ...payload.data,
      },
      // Add these for better notification display
      tag: `notification-${Date.now()}`, // Prevents duplicate notifications
      requireInteraction: true, // Keeps notification visible until dismissed
      actions: [
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
      ]
    });

    const result = await webpush.sendNotification(subscription, pushPayload);
    return result;
  } catch (error: any) {
    console.error("Push notification error details:", {
      statusCode: error.statusCode,
      body: error.body,
      endpoint: subscription.endpoint,
    });
    
    // If subscription is invalid, you might want to remove it from database
    if (error.statusCode === 410) { // Gone - subscription no longer valid
      console.log(`Subscription expired: ${subscription.endpoint}`);
      // You could add logic here to delete the subscription from your database
    }
    
    throw error;
  }
}