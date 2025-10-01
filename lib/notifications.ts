import { prisma } from './prisma-client'; // Adjust path as needed
import { sendPushNotification } from './push';

export async function sendNotificationToUser(
  userId: number, // Changed from string to number to match your schema
  title: string,
  body: string,
  url?: string
) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub: any) =>
      sendPushNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as any,
        },
        { title, body, url }
      )
    )
  );

  // Store notification in database
  await prisma.notification.create({
    data: {
      title,
      body,
      data: { url },
      userId,
    },
  });

  return results;
}

export async function broadcastNotification(
  title: string,
  body: string,
  url?: string
) {
  const subscriptions = await prisma.pushSubscription.findMany();

  const results = await Promise.allSettled(
    subscriptions.map((sub: any) =>
      sendPushNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as any,
        },
        { title, body, url }
      )
    )
  );

  // Store notification for all users or just log it
  // You might want to create individual notification records for each user
  console.log(`Broadcast notification sent to ${subscriptions.length} users`);

  return results;
}