import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const JWT_SECRET = process.env.JWT_SECRET || "3289235de9a14ca3dfa6658bdfcb6a44";

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as any;
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
