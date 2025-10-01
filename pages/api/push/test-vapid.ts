import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  
  res.status(200).json({
    publicKeySet: !!vapidPublicKey,
    privateKeySet: !!vapidPrivateKey,
    publicKeyLength: vapidPublicKey?.length,
    privateKeyLength: vapidPrivateKey?.length,
  });
}