import { useAuthStore } from "@/stores/auth-store";
import AhliLayout from "@/layouts/ahli";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Code,
  Divider,
  Link,
  Tabs,
  Tab,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import PakejFamily from "@/components/content/pakej/pakejFamily";
import PakejIndividual from "@/components/content/pakej/pakejIndividual";
import { useLoadingStore } from "@/lib/useLoadingStore";
import { useEffect, useState } from "react";
import { PwaModal } from "@/components/PwaModal";
import { useDisclosure } from "@heroui/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function DashboardAhli() {
  const { user } = useAuthStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      const handleLoad = () => setLoading(false);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [setLoading]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setPrompt(event);

      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      if (!isStandalone) {
        onOpen();
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (prompt) {
      prompt.prompt();

      prompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setPrompt(null);
        onClose();
      });
    }
  };

  return (
    <AhliLayout>
      <h1 className="font-bold">Dashboard</h1>
      <Divider className="mb-2" />
      <div className="flex flex-col mb-4">
        <p className="text-sm">Selamat datang,</p>
        <Code color="secondary">
          <p className="whitespace-normal">{user?.fullname}</p>
        </Code>
      </div>

      <div className="grid grid-cols-2 gap-2 align-center justify-center mb-4">
        <Link href="/ahli/subkribsi">
          <Card className="dark:bg-default-100/50 w-full p-2 shadown-sm h-full">
            <div className="flex flex-col ml-2 text-sm">
              <div className="flex flex-row items-center">
                <b className="mr-2">Subkribsi</b>
                <Icon icon="line-md:coffee-twotone-loop" />
              </div>
              <p color="secondary" className="text-xs">
                Pengurusan subkribsi anda
              </p>
            </div>
          </Card>
        </Link>
        <Link href={"#"}>
          <Card className="dark:bg-default-100/50 w-full p-2 shadown-sm h-full">
            <div className="flex flex-col ml-2 text-sm">
              <div className="flex flex-row items-center">
                <b className="mr-2">Referral</b>
                <Icon icon="line-md:check-list-3-twotone" />
              </div>
              <p color="secondary" className="text-xs">
                Ajak rakan dan terima ganjaran
              </p>
            </div>
          </Card>
        </Link>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        // navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,
          type: "progressbar",
        }}
        autoplay={{ delay: 2500 }}
        loop={true}
        className="shadow-blue-900/30 shadow-lg"
      >
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 01
            </p>
            <Image
              src="https://picsum.photos/seed/1/500/300"
              alt="Picsum"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 02
            </p>
            <Image
              src="https://picsum.photos/seed/2/500/300"
              alt="Picsum2"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 03
            </p>
            <Image
              src="https://picsum.photos/seed/3/500/300"
              alt="Picsum3"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 04
            </p>
            <Image
              src="https://picsum.photos/seed/4/500/300"
              alt="Picsum4"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 05
            </p>
            <Image
              src="https://picsum.photos/seed/5/500/300"
              alt="Picsum5"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 06
            </p>
            <Image
              src="https://picsum.photos/seed/6/500/300"
              alt="Picsum6"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center">
            <p className="text-xs absolute z-50 text-white bottom-0 left-0 bg-black/50 w-full pl-3">
              Demo 07
            </p>
            <Image
              src="https://picsum.photos/seed/7/500/300"
              alt="Picsum7"
              className="rounded-sm"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      <br />

      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        className="mb-2 w-full"
        fullWidth
      >
        <Tab
          key="Pakej Family"
          title={
            <div className="flex items-center space-x-2">Pakej Keluarga</div>
          }
        >
          <PakejFamily />
        </Tab>
        <Tab
          key="Pakej Individu"
          title={
            <div className="flex items-center space-x-2">Pakej Individu</div>
          }
        >
          <PakejIndividual />
        </Tab>
      </Tabs>
      <PwaModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onInstall={handleInstallClick}
      />
    </AhliLayout>
  );
}
