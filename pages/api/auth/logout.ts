import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import jwt from "jsonwebtoken";
import { useLoadingStore } from "@/lib/useLoadingStore";

const JWT_SECRET = process.env.JWT_SECRET || "3289235de9a14ca3dfa6658bdfcb6a44";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode token to get userId
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Mark token as revoked
    await prisma.jwt_token.updateMany({
      where: {
        token,
        user_id: decoded.userId,
      },
      data: {
        is_revoked: true,
      },
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
