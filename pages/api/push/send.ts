import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma-client";
import jwt from "jsonwebtoken";
import { sendPushNotification } from "../../../lib/push";

const JWT_SECRET = process.env.JWT_SECRET || "3289235de9a14ca3dfa6658bdfcb6a44";

function getUserIdFromToken(req: NextApiRequest): number | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = getUserIdFromToken(req);

    // Add authentication/authorization as needed
    // Remove this if you want to allow unauthenticated requests for broadcasting
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, body, url, targetUserId, broadcast = false } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    let subscriptions = [];

    if (broadcast) {
      // Send to all subscribed users (admin only feature)
      // You might want to add role checking here
      subscriptions = await prisma.pushSubscription.findMany();
    } else if (targetUserId) {
      // Send to specific user (admin feature)
      subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: targetUserId },
      });
    } else {
      // Send to current user (or for user-specific notifications)
      subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });
    }

    // Store notification in database
    const notification = await prisma.notification.create({
      data: {
        title,
        body,
        data: { url },
        userId: targetUserId || userId,
      },
    });

    // Send push notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub:any) => {
        try {
          const result = await sendPushNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as any,
            },
            { title, body, url, data: { notificationId: notification.id } }
          );

          // Log successful sends
          console.log(
            `✅ Notification sent to user ${sub.userId}:`,
            sub.endpoint
          );
          return result;
        } catch (error: any) {
          // Log detailed error information
          console.error(`❌ Failed to send to user ${sub.userId}:`, {
            endpoint: sub.endpoint,
            error: error.message,
            status: error.response?.status,
            userId: sub.userId,
          });
          throw error;
        }
      })
    );

    const failed = results.filter((r) => r.status === "rejected").length;

    res.status(200).json({
      success: true,
      sent: results.length - failed,
      failed,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
