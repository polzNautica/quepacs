import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { title } from "@/components/primitives";
import { Form } from "@heroui/form";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  CardFooter,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/router";
import { useLoadingStore } from "@/lib/useLoadingStore";

export default function loginCard() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
    const {loading, setLoading} = useLoadingStore();

    const {
    login,
    isAuthenticated,
    getDashboardRoute,
    initializeAuth,
    isInitialized,
  } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      nric: formData.get("nric") as string,
      password: formData.get("password") as string,
    };

    try {
      const res = await login(data); 
      
      if (res.success || !res.error) {
        addToast({
          title: "Berjaya",
          description: "Log masuk berjaya!",
          color: "success",
        });
        router.push(getDashboardRoute());
      }
      else if (!res.success || res.error) {
        addToast({
          title: "Gagal",
          description: "Log masuk tidak berjaya: " + res.error,
          color: "danger",
        });
        console.error("Login failed:", res.error);
        return;
      } 
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description:
          "Log masuk tidak berjaya: " + (err.message || "Sila cuba lagi"),
        color: "danger",
      });
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-2">
      <Card className="p-4 max-w-md overflow-hidden">
        <CardHeader className="flex flex-col">
          <Image
            alt="mykasih logo"
            className="w-full h-15"
            radius="none"
            src="https://mykasih.com.my/wp-content/themes/mykasih/images/logo.png"
          />
          <div className="flex flex-col md:gap-2 items-center">
            <h2 className={title()}>QuepacsKasih</h2>
            <p className="text-small text-default-500">Selamat Kembali</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col items-center justify-center overflow-hidden">
          <Form className="w-full max-w-xs mt-2" onSubmit={handleSubmit}>
            <Input
              isRequired
              name="nric"
              type="text"
              label="NRIC/Passport"
              placeholder="Masukkan NRIC/Passport"
              startContent={
                <Icon
                  icon="material-symbols:person"
                  className="text-default-400"
                />
              }
            />
            <Input
              isRequired
              name="password"
              type={isVisible ? "text" : "password"}
              label="Kata Laluan"
              placeholder="Masukkan kata laluan"
              startContent={
                <Icon
                  icon="material-symbols:lock"
                  className="text-default-400"
                />
              }
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-solid outline-transparent"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <Icon icon="oui:eye" />
                  ) : (
                    <Icon icon="oui:eye-closed" />
                  )}
                </button>
              }
            />
            <Link className="text-sm self-end" href="/register">
              Lupa Kata Laluan?
            </Link>
            <Button
              color="primary"
              className="w-full mt-2 mb-4"
              variant="shadow"
              type="submit"
              isLoading={loading}
              isDisabled={loading}
            >
              Log Masuk
            </Button>
          </Form>
        </CardBody>
        <Divider />
        <CardFooter className="flex items-center justify-center gap-1 flex-col overflow-hidden">
          <p className="text-small text-default-500">Belum mempunyai akaun?</p>
          <Link className="text-primary text-sm" href="/register">
            Daftar di sini
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
