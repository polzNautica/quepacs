import AhliLayout from "@/layouts/ahli";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";

const ProfilAhli = () => {
  const [ahliData, setAhliData] = useState(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/ahli/profil");
      const data = await response.json();
      setAhliData(data);
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <AhliLayout>
      <div className="flex justify-center items-start min-h-screen w-full p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="font-bold flex items-center">
            <Icon icon="mdi:account" className="mr-2" />
            Kemaskini Profil
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Profil {ahliData?.fullname || "Loading..."}</p>
          </CardBody>
          <CardFooter>
            <Button className="w-full" color="primary" variant="shadow">
              Kemaskini
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AhliLayout>
  );
};

export default ProfilAhli;