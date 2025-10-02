import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import { getUserFromRequest } from "@/lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (req.method === "GET") {
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
