import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      email,
      fullname,
      password,
      nationality,
      nric,
      phone,
      gender,
      referralCode,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !fullname ||
      !password ||
      !nationality ||
      !nric ||
      !phone ||
      !gender
    ) {
      return res.status(400).json({
        error: "Semua medan wajib diisi kecuali kod rujukan",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format email tidak sah" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Kata laluan mesti sekurang-kurangnya 6 aksara" });
    }

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email.toLowerCase().trim() }, { nric: nric.trim() }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase().trim()) {
          return res.status(400).json({ error: "Email sudah digunakan" });
        }
        if (existingUser.nric === nric.trim()) {
          return res
            .status(400)
            .json({ error: "NRIC/Passport sudah didaftarkan" });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ralat semasa menyemak pengguna sedia ada" });
    }

    // Hash password with bcrypt (simple and secure)
    const hashedPassword = await bcrypt.hash(password, 12);

    const role = await prisma.role.findFirst({
      where: {
        name: {
          in: ["User", "Member"],
        },
      },
    });

    if (!role) {
      return res.status(500).json({ error: "Gagal mendapatkan maklumat ahli." });
    }

    try {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          username: email.toLowerCase().trim(),
          fullname: fullname.trim(),
          password_hash: hashedPassword,
          nationality: nationality.trim(),
          nric: nric.trim(),
          phone: phone.trim(),
          gender: gender.trim(),
          referral_code: referralCode?.trim() || null,
          email_verified: null,
          status: "ACTIVE",
          created_at: new Date(),
          updated_at: new Date(),
          role_id: role.id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          fullname: true,
          nationality: true,
          phone: true,
          gender: true,
          status: true,
          created_at: true,
        },
      });

      return res.status(201).json({
        message: "Pendaftaran berjaya!",
        user: newUser,
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.code === "P2002") {
        const target = error.meta?.target;
        if (target?.includes("email")) {
          return res.status(400).json({ error: "Email sudah digunakan" });
        }
        if (target?.includes("nric")) {
          return res
            .status(400)
            .json({ error: "NRIC/Passport sudah didaftarkan" });
        }
      }

      return res.status(500).json({
        error: "Ralat server dalaman. Sila cuba lagi.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
