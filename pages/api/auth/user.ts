import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "GET") {
		const user = await prisma.user.findMany({
			include: {
				role: true,
			},
		});
		return res.status(200).json(user);
	}

	return res.status(405).json({ error: "Method not allowed" });
}
