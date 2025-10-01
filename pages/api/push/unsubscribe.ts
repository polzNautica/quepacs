import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }

    // Remove subscription from database
    await prisma.pushSubscription.delete({
      where: { endpoint },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    // If subscription not found, still return success
    res.status(200).json({ success: true });
  }
}