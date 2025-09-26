import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/prisma-client";

// /api/users
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "GET") {
		// Fetch all users with their roles
		const users = await prisma.users.findMany({
			include: {
				user_roles: {
					include: {
						roles: true,
					},
				},
			},
		});
		return res.status(200).json(users);
	}

	if (req.method === "POST") {
		const { email, username, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		try {
			const newUser = await prisma.users.create({
				data: {
					email,
					username,
					password_hash: password, // Normally you'd hash this first!
				},
			});
			return res.status(201).json(newUser);
		} catch (error: any) {
			return res.status(400).json({ error: error.message });
		}
	}

	return res.status(405).json({ error: "Method not allowed" });
}
