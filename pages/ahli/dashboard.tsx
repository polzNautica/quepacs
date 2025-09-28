import { useAuthStore } from "@/stores/auth-store";
import AhliLayout from "@/layouts/ahli";
import { Button, Card, CardBody } from "@heroui/react";

export default function DashboardAhli() {
  const { user, logout } = useAuthStore();

  return (
    <AhliLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Ahli</h1>
        
        <Card>
          <CardBody>
            <p className="text-lg">Selamat datang, {user?.fullname}!</p>
            <p className="text-default-500">Anda log masuk sebagai Ahli</p>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <h3 className="font-semibold">Profil Saya</h3>
              <p className="text-sm text-default-500">Kemaskini maklumat peribadi</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-semibold">Aktiviti Terkini</h3>
              <p className="text-sm text-default-500">Lihat aktiviti terbaru</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-semibold">Bantuan</h3>
              <p className="text-sm text-default-500">Dapatkan bantuan dan sokongan</p>
            </CardBody>
          </Card>
        </div>

        <Button color="danger" onPress={logout}>
          Log Keluar
        </Button>
      </div>
    </AhliLayout>
  );
}