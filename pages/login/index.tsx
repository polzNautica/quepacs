import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { title } from "@/components/primitives";
import { Form } from "@heroui/form";
import LoginLayout from "@/layouts/login";
import { useState } from "react";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast({
          title: "Gagal",
          description: data.message || "Log masuk gagal!",
          color: "danger",
        });
        throw new Error(data.message || "Login failed");
      }

      addToast({
        title: "Berjaya",
        description: "Log masuk berjaya!",
        color: "success",
      });
      // You can redirect here, e.g., router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      addToast({
        title: "Gagal",
        description: "Log masuk gagal!",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-2@">
        <Card className="p-4 max-w-md">
          <CardHeader className="flex flex-col">
            <Image
              alt="mykasih logo"
              className="w-full h-15"
              radius="none"
              src="	https://mykasih.com.my/wp-content/themes/mykasih/images/logo.png"
            />
            <div className="flex flex-col md:gap-2 items-center">
              <h2 className={title()}>QuepacsKasih</h2>
              <p className="text-small text-default-500">Selamat Kembali</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center">
            <Form className="w-full max-w-xs mt-2" onSubmit={handleSubmit}>
              <Input
                isRequired
                type="text"
                label="Username"
                placeholder="Masukkan username atau email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUsername(e.target.value);
                }}
                startContent={
                  <Icon icon="material-symbols:alternate-email-rounded" className="text-default-400" />
                }
              />
              <Input
                isRequired
                type={isVisible ? "text" : "password"}
                label="Kata Laluan"
                placeholder="Masukkan kata laluan"
                startContent={<Icon icon="material-symbols:lock" className="text-default-400" />}
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
                onChange={(e) => setPassword(e.target.value)}
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
              >
                Log Masuk
              </Button>
            </Form>
          </CardBody>
          <Divider />
          <CardFooter className="flex items-center justify-center gap-1 flex-col">
            <p className="text-small text-default-500">
              Belum mempunyai akaun?
            </p>
            <Link className="text-primary text-sm" href="/register">
              Daftar di sini
            </Link>
          </CardFooter>
        </Card>
      </section>
    </LoginLayout>
  );
}
