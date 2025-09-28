import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '3289235de9a14ca3dfa6658bdfcb6a44';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token signature
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if token exists in database and is not revoked
    const tokenRecord = await prisma.jwt_token.findFirst({
      where: { 
        token,
        user_id: decoded.userId,
        is_revoked: false,
        expires_at: { gt: new Date() }
      },
      include: { user: { include: { role: true } } }
    });

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Return user data
    const userData = {
      id: tokenRecord.user.id,
      email: tokenRecord.user.email,
      username: tokenRecord.user.username,
      fullname: tokenRecord.user.fullname,
      role: tokenRecord.user.role.name,
      role_id: tokenRecord.user.role_id,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}