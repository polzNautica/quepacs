import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "3289235de9a14ca3dfa6658bdfcb6a44";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { nric, password } = req.body;

    console.log("LOGIN API: ", nric, password);

    if (!nric || !password) {
      return res
        .status(400)
        .json({ error: "Username atau kata laluan tidak sah" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { nric },
        include: { role: true },
      });

      if (!user) {
        return res.status(401).json({ error: "Pengguna tidak dijumpai" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Kata laluan tidak sah" });
      }

      if (user.status !== "ACTIVE") {
        return res.status(401).json({ error: "Account is not active" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role.name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await prisma.jwt_token.create({
        data: {
          token,
          user_id: user.id,
          expires_at: expiresAt,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { updated_at: new Date() },
      });

      const userData = {
        id: user.id,
        nric: user.nric,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        role: user.role.name,
        role_id: user.role_id,
      };

      return res
        .status(200)
        .json({ message: "Log masuk berjaya", token, user: userData });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
