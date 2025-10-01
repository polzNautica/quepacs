import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export function getTokenFromRequest(req: NextApiRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Fallback to cookie
  return req.cookies.token || null;
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
  } catch (error) {
    return null;
  }
}