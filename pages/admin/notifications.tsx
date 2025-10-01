import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export default function AdminNotifications() {
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: '',
    userId: '',
    broadcast: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Notification sent successfully! (Sent: ${data.sent}, Failed: ${data.failed})`);
        setFormData({ title: '', body: '', url: '', userId: '', broadcast: false });
      } else {
        setResult(`❌ Failed: ${data.error}`);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Notification Panel</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Notification title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <Input
            required
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Notification message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL (optional)</label>
          <Input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="/some-page"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">User ID (optional)</label>
            <Input
              type="number"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Send to specific user"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <Input
                type="checkbox"
                checked={formData.broadcast}
                onChange={(e) => setFormData({ ...formData, broadcast: e.target.checked })}
                className="mr-2"
              />
              Broadcast to all users
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send Notification'}
        </Button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded ${
          result.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
}