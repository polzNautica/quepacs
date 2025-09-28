import { Button, Card } from "@heroui/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Background from "@/components/background";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="px-8 py-8 flex space-y-4 flex-col">
          <Icon
            icon="mdi:block-helper"
            className="text-6xl text-danger mx-auto animate-pulse"
          />
          <h1 className="text-4xl font-bold">403 - Akses Ditolak</h1>
          <p className="text-lg text-gray-600 max-w-md">
            Maaf, anda tidak mempunyai kebenaran untuk mengakses halaman ini.
          </p>
          <div className="space-x-4">
            <Button
              color="primary"
              variant="shadow"
              onPress={() => router.push("/")}
            >
              Kembali ke Halaman Utama
            </Button>
          </div>
        </Card>
      </div>
      <Background />
    </>
  );
}
