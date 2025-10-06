// pages/test-push-notifications.tsx
import { useState, useEffect, useRef } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuthStore } from "@/stores/auth-store";
import { addToast, Button, Card, Divider } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import AdminLayout from "@/layouts/admin";
import SubscriptionsTable from "@/components/table/subscriptions";

export default function PushNotificationTest() {
  const { isSupported, permission, subscribe, unsubscribe, isSubscribed } =
    usePushNotifications();

  const tableRef = useRef<any>(null);
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // const checkSubscriptions = async () => {
  //   try {
  //     const response = await fetch("/api/push/debug");
  //     const data = await response.json();
  //     setDebugInfo(data);
  //   } catch (error) {
  //     console.error("Failed to fetch debug info:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (user) {
  //     checkSubscriptions();
  //   }
  // }, [user]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setTestResult("");
    try {
      await subscribe();
      setTestResult("✅ Successfully subscribed to push notifications!");
      // setTimeout(checkSubscriptions, 1000); // Refresh debug info
      if (tableRef.current) {
        tableRef.current.refreshSubscriptions();
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
      console.error("Subscribe error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setTestResult("");
    try {
      await unsubscribe();
      setTestResult("✅ Successfully unsubscribed from push notifications!");
      // setTimeout(checkSubscriptions, 1000);
      if (tableRef.current) {
        tableRef.current.refreshSubscriptions();
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    setIsLoading(true);
    setTestResult("");
    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Test Notification 🎉",
          body: `Hello ${user?.fullname}! This is a test push notification from our app.`,
          url: "/test-push-notifications",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult(
          `✅ Test notification sent! (Sent: ${data.sent}, Failed: ${data.failed})`
        );

        // If no subscriptions found, guide the user
        if (data.sent === 0) {
          setTestResult(
            (prev) =>
              prev +
              "\n⚠️ No active subscriptions found. Make sure you are subscribed first."
          );
        }
      } else {
        setTestResult(`❌ Failed to send notification: ${data.error}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBrowserSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          alert(
            `✅ Browser has active subscription!\nEndpoint: ${subscription.endpoint}`
          );
        } else {
          alert("❌ No active subscription found in browser.");
        }
      } catch (error) {
        alert("❌ Error checking browser subscription.");
      }
    }
  };

  const sendDetailedTestNotification = async () => {
    setIsLoading(true);
    setTestResult("");
    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Test Notification 🎉",
          body: `Hello ${user?.fullname}! This is a test push notification.`,
          url: "/test-push-notifications",
          // Add debug flag
          debug: true,
        }),
      });

      const data = await response.json();
      console.log("Full API response:", data); // Check browser console

      if (data.success) {
        setTestResult(
          `✅ Test notification sent!\nSent: ${data.sent}, Failed: ${data.failed}\nNotification ID: ${data.notificationId}`
        );

        if (data.failed > 0) {
          setTestResult(
            (prev) =>
              prev +
              `\n❌ ${data.failed} notification(s) failed to send. Check server logs.`
          );
        }
      } else {
        setTestResult(`❌ API Error: ${data.error}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Network Error: ${error.message}`);
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Push Notification Test</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please log in to test push notifications.
        </div>
      </div>
    );
  }

  return (
    <AdminLayout breadcrumbLabel="Push Notification Test">
      <div className="w-full mx-auto">
        <h1 className="font-bold mb-2">Push Notification Test</h1>

        <Card className="mb-4 p-4" radius="sm">
          {/* System Status */}
          <h2 className="font-semibold">System Status</h2>
          <Divider />
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm font-semibold">
            <div>
              <p>Push Support:</p>
              <p className={isSupported ? "text-green-600" : "text-red-600"}>
                {isSupported ? "Available" : "Not Supported"}
              </p>
            </div>
            <div>
              <p>Permission:</p>
              <p
                className={
                  permission === "granted"
                    ? "text-green-600"
                    : permission === "denied"
                      ? "text-red-600"
                      : "text-yellow-600"
                }
              >
                {permission}
              </p>
            </div>
            <div>
              <p>Subscription:</p>
              <p className={isSubscribed ? "text-green-600" : "text-red-600"}>
                {isSubscribed ? "Subscribed" : "Not Subscribed"}
              </p>
            </div>
            <div>
              <p>Role:</p>
              <p className="text-blue-600">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-4 mb-6">
          {!isSubscribed ? (
            <Button
              onPress={handleSubscribe}
              isDisabled={isLoading || !isSupported || permission === "denied"}
              variant="shadow"
              color="primary"
              className="w-full"
            >
              {isLoading ? "Subscribing..." : "Subscribe to Push Notifications"}
            </Button>
          ) : (
            <Button
              onPress={handleUnsubscribe}
              isDisabled={isLoading}
              variant="shadow"
              color="danger"
              fullWidth
            >
              {isLoading
                ? "Unsubscribing..."
                : "Unsubscribe from Push Notifications"}
            </Button>
          )}

          {isSubscribed && (
            <Button
              onPress={sendTestNotification}
              isDisabled={isLoading}
              variant="shadow"
              color="success"
              fullWidth
            >
              <p className="text-white">
                {isLoading ? "Sending..." : "Send Test Notification"}
              </p>
            </Button>
          )}

          <Button
            onPress={checkBrowserSubscription}
            variant="shadow"
            color="warning"
            className="w-full text-white"
          >
            Check Browser Subscription
          </Button>

          {/* <Button
            onPress={checkSubscriptions}
            variant="shadow"
            color="secondary"
            fullWidth
          >
            Refresh Debug Info
          </Button> */}

          {/* <Button
            onPress={sendDetailedTestNotification}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            Send Detailed Test Notification
          </Button> */}
        </div>

        {/* Test Results */}
        {testResult && (
          <div
            className={`mt-4 p-4 mb-4 text-sm rounded whitespace-pre-line ${
              testResult.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {testResult}
          </div>
        )}

        {/* Debug Information */}
        {/* {debugInfo && (
          <Card className="mb-4 p-4" radius="sm">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <div className="text-sm">
              <div>
                Total Subscriptions in DB:
                <strong>{debugInfo.totalSubscriptions}</strong>
              </div>
              {debugInfo.subscriptions.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Active Subscriptions:</h4>
                  <ul className="list-disc list-inside mt-1">
                    {debugInfo.subscriptions.map((sub: any) => (
                      <li key={sub.id}>
                        User: {sub.userEmail} (ID: {sub.userId})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )} */}

        <SubscriptionsTable ref={tableRef} />
        <br />

        {/* Common Issues */}
        <Card className="mb-4 p-4">
          <div>
            <h3 className="font-semibold mb-2">Common Issues & Solutions:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>No subscriptions found:</strong> Click "Subscribe" first
              </li>
              <li>
                <strong>Permission denied:</strong> Allow notifications in
                browser settings
              </li>
              <li>
                <strong>Not supported:</strong> Use Chrome/Firefox and ensure
                HTTPS
              </li>
              <li>
                <strong>Sent: 0:</strong> No active subscriptions for the
                current user
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
