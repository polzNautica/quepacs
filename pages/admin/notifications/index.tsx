import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import AdminLayout from "@/layouts/admin";
import {
  addToast,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Form,
} from "@heroui/react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function AdminNotifications() {
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    url: "",
    userId: "",
    broadcast: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(
          `✅ Notification sent successfully! (Sent: ${data.sent}, Failed: ${data.failed})`
        );
        addToast({
          title: "Notification Sent",
          description: `Notification sent successfully! (Sent: ${data.sent})`,
          color: "success",
        });
        setFormData({
          title: "",
          body: "",
          url: "",
          userId: "",
          broadcast: false,
        });
      } else {
        addToast({
          title: "Notification Sent",
          description: `Failed: ${data.failed})`,
          color: "danger",
        });
        setResult(`❌ Failed: ${data.error}`);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-end mb-2">
        <Link href="/admin/notifications/push-test">
        <Button size="sm" variant="flat" color="success">
          Push Testing <Icon icon="ion:arrow-redo-outline" />
        </Button>
      </Link>
      </div>
      <div className="flex flex-col mx-auto items-center justify-center">
        <Card className="p-4 w-full max-w-md">
          <CardHeader className="font-bold p-0 flex flex-col items-start mb-4">
            <h1>Admin Notification Panel</h1>
            <Divider />
          </CardHeader>

          <Form onSubmit={handleSubmit}>
            <Input
              label="Title"
              isRequired
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Notification title"
            />

            <Input
              label="Message"
              isRequired
              type="text"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Notification message"
            />

            <Input
              label="URL (optional)"
              type="text"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="/some-page"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                label="User ID (optional)"
                type="number"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                placeholder="Send to specific user"
              />

              <Checkbox
                type="checkbox"
                checked={formData.broadcast}
                onChange={(e) =>
                  setFormData({ ...formData, broadcast: e.target.checked })
                }
                className="mr-2"
              >
                <p className="text-sm">Broadcast to all users</p>
              </Checkbox>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="shadow"
              color="primary"
              className="w-full mt-4"
            >
              {isLoading ? "Sending..." : "Send Notification"}
            </Button>
          </Form>
        </Card>

        {result && (
          <div
            className={`mt-4 p-3 rounded ${
              result.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
