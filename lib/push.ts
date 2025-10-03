import webpush from "web-push";

// Initialize web-push with your VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:gtppower00@gmail.com", // Change this to your email
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
  // const response = await fetch(subscription.endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     title: payload.title,
  //     body: payload.body,
  //     url: payload.url,
  //     data: payload.data,
  //   }),
  // });

  // if (!response.ok) {
  //   throw new Error(`Push notification failed: ${response.statusText}`);
  // }

  // return response;
  try {
    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: "/icons/web-app-manifest-192x192.png",
      badge: "/icons/favicon-96x96.png",
      data: {
        url: payload.url || "/",
        ...payload.data,
      },
    });

    const result = await webpush.sendNotification(subscription, pushPayload);

    return result;
  } catch (error: any) {
    console.error("Push notification error details:", {
      statusCode: error.statusCode,
      body: error.body,
      endpoint: subscription.endpoint,
    });
    throw error;
  }
}
