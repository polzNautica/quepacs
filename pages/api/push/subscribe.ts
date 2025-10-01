import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma-client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '3289235de9a14ca3dfa6658bdfcb6a44';

function getUserIdFromToken(req: NextApiRequest): number {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  return decoded.userId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserIdFromToken(req); // This will throw if no token
    const { subscription, userAgent } = req.body;

    if (!subscription?.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    // Store subscription in database - userId is always required now
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        keys: subscription.keys,
        userId: userId,
        userAgent,
      },
      create: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userId: userId,
        userAgent,
      },
    });

    res.status(200).json({ success: true, id: pushSubscription.id });
  } catch (error) {
    console.error('Subscription error:', error);
    if (error instanceof Error && error.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}