import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma-client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '3289235de9a14ca3dfa6658bdfcb6a44';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      include: {
        user: {
          select: { email: true, id: true }
        }
      }
    });

    res.status(200).json({
      totalSubscriptions: subscriptions.length,
      subscriptions: subscriptions.map((sub:any) => ({
        id: sub.id,
        endpoint: sub.endpoint.substring(0, 50) + '...', // Truncate for security
        userId: sub.userId,
        userEmail: sub.user?.email,
        createdAt: sub.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}