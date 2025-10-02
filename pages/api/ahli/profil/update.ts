import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma-client";
import { getUserFromRequest } from "@/lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return res
      .status(401)
      .json({ error: "Gagal memuatkan maklumat ahli. Sila log masuk semula." });
  }

  if (req.method === "POST") {
    const data = req.body;
    console.log("Data received: ", data);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        updated_at: new Date(),
      },
    });

    try {
      const checkUserDetail = await prisma.userDetail.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (checkUserDetail) {
        await prisma.userDetail.update({
          where: {
            id: checkUserDetail.id,
          },
          data: {
            address1: data.address1,
            address2: data.address2,
            address3: data.address3,
            postcode: data.postcode,
            city: data.city,
            state: data.state,
            country: data.country,
            phoneHome: data.phoneHome,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            maritalStatus: data.maritalStatus,
          },
        });
      } else {
        await prisma.userDetail.create({
          data: {
            userId: user.id,
            address1: data.address1,
            address2: data.address2,
            address3: data.address3,
            postcode: data.postcode,
            city: data.city,
            state: data.state,
            country: data.country,
            phoneHome: data.phoneHome,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            maritalStatus: data.maritalStatus,
          },
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", JSON.stringify(error, null, 2));
      return res
        .status(500)
        .json({ error: "Gagal mengemaskini maklumat ahli." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
