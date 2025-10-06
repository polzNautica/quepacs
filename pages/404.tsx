import { Button, Divider } from "@heroui/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Background from "@/components/background";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="px-8 py-8 flex space-y-4 flex-col">
          <div className="flex flex-row items-center">
            <h1 className="text-4xl font-bold">404</h1>
            <Icon
              icon="line-md:question"
              className="text-3xl text-danger animate-pulse ml-4"
            />
          </div>
          <Divider />
          <p className="text-sm text-gray-600 max-w-md">
            Maaf, halaman yang anda cari tidak ditemukan.
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
        </div>
      </div>
      <Background />
    </>
  );
}
