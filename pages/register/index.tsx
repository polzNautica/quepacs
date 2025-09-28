// pages/register.tsx
import { useState } from "react";
import {
  registerFieldValidator,
  createConfirmPasswordValidator,
} from "@/lib/validationSchemas";
import { useRouter } from "next/router";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Form,
  addToast,
  Input,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  CardFooter,
  Link,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export const nationalityOptions = [
  { value: "Malaysian", label: "Warganegara" },
  { value: "NonMalaysian", label: "Bukan Warganegara" },
];

export const genderOptions = [
  { value: "Male", label: "Lelaki" },
  { value: "Female", label: "Perempuan" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState("Malaysian");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      console.log("RESDATA: ", responseData);

      if (!res.ok) {
        addToast({
          title: "Gagal!",
          description: "Pendaftaran tidak berjaya: " + responseData?.error,
          color: "danger",
        });
        console.error(responseData.error);
      } else {
        addToast({
          title: "Berjaya!",
          description: "Pendaftaran berjaya! Sila log masuk.",
          color: "success",
        });
        // //RESET FORM
        // (e.currentTarget as HTMLFormElement).reset();
        // setNationality("Malaysian");
        // setGender("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      // addToast({
      //   title: "Gagal!",
      //   description: "Pendaftaran tidak berjaya: Punca tidak diketahui",
      //   color: "danger",
      // });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isMalaysian = nationality === "Malaysian";
  const idLabel = isMalaysian ? "NRIC" : "Passport";
  const idPlaceholder = isMalaysian ? "Masukkan NRIC" : "Masukkan Passport";

  const PasswordVisibilityIcon = ({ isVisible }: { isVisible: boolean }) => (
    <Icon icon={isVisible ? "oui:eye" : "oui:eye-closed"} />
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-2">
        <Card className="p-4 max-w-md">
          <CardHeader className="flex flex-col">
            <Image
              alt="mykasih logo"
              className="w-full h-15 object-contain"
              radius="none"
              src="https://mykasih.com.my/wp-content/themes/mykasih/images/logo.png"
            />
            <div className="flex flex-col items-center text-center">
              <h2 className={title()}>QuepacsKasih</h2>
              <p className="text-small text-default-500">Cipta Akaun Baru</p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody>
            <Form className="w-full space-y-4 mt-2" onSubmit={handleSubmit}>
              <Input
                isRequired
                name="fullname"
                type="text"
                label="Nama Penuh"
                placeholder="Masukkan Nama Penuh"
                startContent={
                  <Icon icon="mdi:account" className="text-default-400" />
                }
                validate={registerFieldValidator("fullname")}
              />

              <Input
                isRequired
                name="email"
                type="email"
                label="Email"
                placeholder="Masukkan email"
                startContent={
                  <Icon
                    icon="material-symbols:alternate-email-rounded"
                    className="text-default-400"
                  />
                }
                validate={registerFieldValidator("email")}
              />

              <Input
                isRequired
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                label="Kata Laluan"
                placeholder="Masukkan kata laluan"
                value={password}
                onValueChange={setPassword}
                startContent={
                  <Icon icon="mdi:lock" className="text-default-400" />
                }
                endContent={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none p-1"
                    aria-label={
                      isPasswordVisible
                        ? "Sembunyikan kata laluan"
                        : "Tunjukkan kata laluan"
                    }
                  >
                    <PasswordVisibilityIcon isVisible={isPasswordVisible} />
                  </button>
                }
                validate={registerFieldValidator("password")}
              />

              <Input
                isRequired
                name="confirmPassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                label="Sahkan Kata Laluan"
                placeholder="Sahkan kata laluan"
                startContent={
                  <Icon icon="mdi:lock-check" className="text-default-400" />
                }
                endContent={
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="focus:outline-none p-1"
                    aria-label={
                      isConfirmPasswordVisible
                        ? "Sembunyikan kata laluan"
                        : "Tunjukkan kata laluan"
                    }
                  >
                    <PasswordVisibilityIcon
                      isVisible={isConfirmPasswordVisible}
                    />
                  </button>
                }
                validate={createConfirmPasswordValidator(password)}
              />

              <Select
                name="nationality"
                label="Kewarganegaraan"
                selectedKeys={[nationality]}
                onSelectionChange={(keys) =>
                  setNationality(Array.from(keys)[0] as string)
                }
                isRequired
                validate={registerFieldValidator("nationality")}
              >
                {nationalityOptions.map((item) => (
                  <SelectItem key={item.value} textValue={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                isRequired
                name="nric"
                type={isMalaysian ? "text" : "text"}
                label={idLabel}
                placeholder={idPlaceholder}
                inputMode={isMalaysian ? "numeric" : "text"}
                pattern="^[0-9]{6,12}$"
                description={<span className="text-xs">NRIC tanpa -</span>}
                startContent={
                  <Icon
                    icon="material-symbols:badge"
                    className="text-default-400"
                  />
                }
                validate={(value) => {
                  // Custom validation for NRIC/Passport based on nationality
                  if (isMalaysian) {
                    return /^[0-9]{6,12}$/.test(value)
                      ? null
                      : "Format NRIC tidak sah";
                  } else {
                    return /^[a-zA-Z0-9]{6,20}$/.test(value)
                      ? null
                      : "Format Passport tidak sah";
                  }
                }}
              />

              <Input
                isRequired
                name="phone"
                type="tel"
                label="No. Telefon"
                placeholder="Masukkan No. Telefon"
                startContent={
                  <span className="text-sm text-default-500">+6</span>
                }
                validate={registerFieldValidator("phone")}
              />

              <Select
                name="gender"
                label="Jantina"
                placeholder="Pilih jantina"
                selectedKeys={gender ? [gender] : []}
                onSelectionChange={(keys) =>
                  setGender(Array.from(keys)[0] as string)
                }
                isRequired
                validate={registerFieldValidator("gender")}
              >
                {genderOptions.map((item) => (
                  <SelectItem key={item.value} textValue={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                name="referralCode"
                type="text"
                label="Kod Rujukan (Pilihan)"
                placeholder="Masukkan kod rujukan"
              />

              <Checkbox name="tnc" isRequired>
                <p className="text-sm text-default-500">
                  Sila terima{" "}
                  <Link className="text-sm text-secondary" href="/tnc">
                    Terma & Syarat
                  </Link>{" "}
                  yang ditetapkan.
                </p>
              </Checkbox>

              <Button
                color="primary"
                className="w-full mt-4"
                variant="shadow"
                type="submit"
                isLoading={loading}
                isDisabled={loading}
              >
                {loading ? "Mendaftar..." : "Daftar"}
              </Button>
            </Form>
          </CardBody>

          <Divider />

          <CardFooter className="flex flex-col items-center gap-2">
            <p className="text-small text-default-500">
              Sudah mempunyai akaun?
            </p>
            <Link href="/login" className="text-primary text-sm">
              Log masuk di sini
            </Link>
          </CardFooter>
        </Card>
      </section>
    </DefaultLayout>
  );
}
