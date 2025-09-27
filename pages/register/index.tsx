import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { title } from "@/components/primitives";
import { Form } from "@heroui/form";
import LoginLayout from "@/layouts/login";
import { useState } from "react";
import { addToast } from "@heroui/react";
import RowSteps from "@/components/row-steps";
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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata laluan tidak sepadan.");
      addToast({
        title: "Gagal",
        description: "Kata laluan tidak sepadan.",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Pendaftaran gagal!");
      }

      addToast({
        title: "Berjaya",
        description: "Pendaftaran berjaya! Sila log masuk.",
        color: "success",
      });
      // You can redirect here, e.g., router.push("/login");
    } catch (err: any) {
      setError(err.message);
      addToast({
        title: "Gagal",
        description: err.message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="p-4 max-w-md">
          <CardHeader className="flex flex-col">
            <Image
              alt="mykasih logo"
              className="w-full h-15"
              radius="none"
              src="https://mykasih.com.my/wp-content/themes/mykasih/images/logo.png"
            />
            <div className="flex flex-col md:gap-2 items-center">
              <h2 className={title()}>QuepacsKasih</h2>
              <p className="text-small text-default-500">Cipta Akaun Baru</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center">
            <Form className="w-full max-w-xs mt-2" onSubmit={handleSubmit}>
              <Input
                isRequired
                type="text"
                label="Username"
                placeholder="Masukkan username"
                onChange={(e) => setUsername(e.target.value)}
                startContent={
                  <Icon icon="mdi:account" className="text-default-400" />
                }
                isInvalid={!!error}
              />
              <Input
                isRequired
                type="email"
                label="Email"
                placeholder="Masukkan email"
                onChange={(e) => setEmail(e.target.value)}
                startContent={
                  <Icon
                    icon="material-symbols:alternate-email-rounded"
                    className="text-default-400"
                  />
                }
                isInvalid={!!error}
              />
              <Input
                isRequired
                type={isPasswordVisible ? "text" : "password"}
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
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <Icon icon="oui:eye" />
                    ) : (
                      <Icon icon="oui:eye-closed" />
                    )}
                  </button>
                }
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!error}
              />
              <Input
                isRequired
                type={isConfirmPasswordVisible ? "text" : "password"}
                label="Sahkan Kata Laluan"
                placeholder="Sahkan kata laluan"
                startContent={
                  <Icon
                    icon="material-symbols:lock-check"
                    className="text-default-400"
                  />
                }
                endContent={
                  <button
                    aria-label="toggle confirm password visibility"
                    className="focus:outline-solid outline-transparent"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <Icon icon="oui:eye" />
                    ) : (
                      <Icon icon="oui:eye-closed" />
                    )}
                  </button>
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!error}
                errorMessage={error}
              />
              <Button
                color="primary"
                className="w-full mt-4"
                variant="shadow"
                type="submit"
                disabled={loading}
              >
                {loading ? "Mendaftar..." : "Daftar"}
              </Button>
            </Form>
          </CardBody>
          <Divider />
          <CardFooter className="flex items-center justify-center gap-1 flex-col">
            <p className="text-small text-default-500">
              Sudah mempunyai akaun?
            </p>
            <Link className="text-primary text-sm" href="/login">
              Log masuk di sini
            </Link>
          </CardFooter>
        </Card>
      </section>
    </LoginLayout>
  );
}
