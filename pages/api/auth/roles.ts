import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const roles = await prisma.role.findMany();
    return res.status(200).json(roles);
  }

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Role name is required" });

    try {
      const newRole = await prisma.role.create({
        data: { name },
      });
      return res.status(201).json(newRole);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
