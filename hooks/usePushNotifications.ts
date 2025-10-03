import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  isSubscribed: boolean;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setPermission(Notification.permission);
    if (isAuthenticated) {
      checkSubscription();
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    }
  };

  const subscribe = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported");
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    setPermission(permission);

    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    // let registration: ServiceWorkerRegistration;
    let registration = await navigator.serviceWorker.getRegistration();
    try {
      registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      if (registration.installing) {
        await new Promise<void>((resolve) => {
          const worker = registration?.installing!;
          worker.addEventListener("statechange", () => {
            if (worker.state === "activated") {
              console.log("Service Worker activated");
              resolve();
            }
          });
        });
      }

      // Ensure service worker is ready
      registration = await navigator.serviceWorker.ready;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw new Error("Service Worker registration failed: " + error);
    }

    // Get VAPID public key
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error("VAPID public key is not configured");
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    console.log("Subscribing with applicationServerKey:", applicationServerKey);

    // Subscribe to push notifications - FIXED: Properly convert VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    console.log('Subscription created:', subscription);

    // Send subscription to server with authentication
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        subscription,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save subscription");
    }

    setIsSubscribed(true);
  }, [token]);

  const unsubscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();

      // Remove from server
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setIsSubscribed(false);
    }
  }, [token]);

  return {
    isSupported: "serviceWorker" in navigator && "PushManager" in window,
    permission,
    subscribe,
    unsubscribe,
    isSubscribed,
  };
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
