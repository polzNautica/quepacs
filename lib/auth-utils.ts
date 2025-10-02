import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma-client";

const JWT_SECRET = process.env.JWT_SECRET || "3289235de9a14ca3dfa6658bdfcb6a44";

export interface UserSession {
  id: number;
  email: string;
  username: string | null;
  fullname: string;
  role: string;
  role_id: number;
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return req.cookies.token || null;
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

// NEW: Enhanced function that also checks database validity
export async function verifyAndGetUser(token: string): Promise<UserSession | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Check if token exists in database and is not revoked
    const tokenRecord = await prisma.jwt_token.findFirst({
      where: { 
        token,
        user_id: decoded.userId,
        is_revoked: false,
        expires_at: { gt: new Date() }
      },
      include: { 
        user: { 
          include: { role: true } 
        } 
      }
    });

    if (!tokenRecord) {
      return null;
    }

    return {
      id: tokenRecord.user.id,
      email: tokenRecord.user.email,
      username: tokenRecord.user.username,
      fullname: tokenRecord.user.fullname,
      role: tokenRecord.user.role.name,
      role_id: tokenRecord.user.role_id,
    };
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req: NextApiRequest): Promise<UserSession | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  return await verifyAndGetUser(token);
}