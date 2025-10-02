import { GetServerSideProps } from "next";
import AhliLayout from "@/layouts/ahli";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Input,
  Button,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { prisma } from "@/lib/prisma-client";
import { getUserFromRequest } from "@/lib/auth-utils";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { registerFieldValidator } from "@/lib/validationSchemas";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromRequest(context.req as any);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!userData) {
    return {
      notFound: true,
    };
  }

  const userDetails = await prisma.userDetail.findUnique({
    where: { userId: user.id },
  });

  const mappedUserData = {
    fullname: userData.fullname,
    email: userData.email,
    username: userData.username,
    nationality: userData.nationality,
    nric: userData.nric,
    phone: userData.phone,
    gender: userData.gender,
    referral_code: userData.referral_code,
    status: userData.status,
    created_at: userData.created_at?.toISOString(),
    updated_at: userData.updated_at?.toISOString(),
    address1: userDetails?.address1 || null,
    address2: userDetails?.address2 || null,
    address3: userDetails?.address3 || null,
    postcode: userDetails?.postcode || null,
    city: userDetails?.city || null,
    state: userDetails?.state || null,
    country: userDetails?.country || null,
    phoneHome: userDetails?.phoneHome || null,
    emergencyContactName: userDetails?.emergencyContactName || null,
    emergencyContactPhone: userDetails?.emergencyContactPhone || null,
    dateOfBirth: userDetails?.dateOfBirth?.toISOString() || null,
  };

  return {
    props: {
      ahliData: {
        ...mappedUserData,
      },
    },
  };
};

interface AhliData {
  fullname: string;
  email: string;
  username: string;
  nationality: string;
  nric: string;
  phone: string;
  gender: string;
  referral_code: string;
  status: string;
  created_at: string;
  updated_at: string;
  address1: string;
  address2: string;
  address3: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  phoneHome: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  photo: string;
  maritalStatus: string;
}

interface ProfilAhliProps {
  ahliData: AhliData;
}

export default function ProfilAhli({ ahliData }: ProfilAhliProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const data = Object.fromEntries(formData);

      const response = await fetch("/api/ahli/profil/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        addToast({
          title: "Berjaya",
          description: "Profil ahli berjaya dikemaskini.",
          color: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        addToast({
          title: "Gagal",
          description: "Profil ahli tidak berjaya dikemaskini: " + result.error,
          color: "danger",
        });
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AhliLayout>
      <div className="flex justify-center items-start min-h-screen w-full p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="font-bold flex items-center">
            <Icon icon="mdi:account" className="mr-2" />
            Kemaskini Profil
          </CardHeader>
          <Divider />
          <CardBody>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <Form onSubmit={handleSubmit} className="gap-0">
              <div className="space-y-8 w-full mb-2">
                <Input
                  label="Nama Penuh"
                  name="fullname"
                  defaultValue={ahliData.fullname}
                  labelPlacement="outside"
                  validate={registerFieldValidator("fullname")}
                />
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  defaultValue={ahliData.email}
                  labelPlacement="outside"
                  validate={registerFieldValidator("email")}
                />
                <Input
                  label="No. Tel"
                  name="phone"
                  defaultValue={ahliData.phone}
                  labelPlacement="outside"
                  validate={registerFieldValidator("phone")}
                />
              </div>
              <Input
                type="text"
                label="Alamat"
                name="address1"
                placeholder="Alamat 1"
                defaultValue={ahliData.address1}
                labelPlacement="outside"
                classNames={{ inputWrapper: "rounded-b-none" }}
              />
              <Input
                type="text"
                name="address2"
                placeholder="Alamat 2"
                defaultValue={ahliData.address2}
                classNames={{ inputWrapper: "rounded-none" }}
              />
              <Input
                type="text"
                name="address3"
                placeholder="Alamat 3"
                defaultValue={ahliData.address3}
                classNames={{ inputWrapper: "rounded-t-none" }}
              />
              <div className="space-y-8 w-full mb-4 mt-2">
                <Input
                  type="number"
                  label="Poskod"
                  name="postcode"
                  defaultValue={ahliData.postcode}
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Bandar"
                  name="city"
                  defaultValue={ahliData.city}
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Negeri"
                  name="state"
                  defaultValue={ahliData.state}
                  labelPlacement="outside"
                />
              </div>

              <Button
                className="w-full"
                color="primary"
                variant="shadow"
                type="submit"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Mengemaskini..." : "Kemaskini"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </AhliLayout>
  );
}
