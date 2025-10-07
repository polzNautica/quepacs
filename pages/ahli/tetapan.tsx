import { usePushNotifications } from "@/hooks/usePushNotifications";
import AhliLayout from "@/layouts/ahli";
import { Card, CardBody } from "@heroui/card";
import { addToast } from "@heroui/react";
import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

const Tetapan = () => {
  const { subscribe, unsubscribe, isSubscribed } = usePushNotifications();
  const [isSelected, setIsSelected] = useState(Boolean);
  const [isSelectedTheme, setIsSelectedTheme] = useState(Boolean);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsSelected(isSubscribed);
  }, [isSubscribed]);

  useEffect(() => {
    setIsSelectedTheme(theme === "light");
  }, [theme]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isSelected) {
      subscribe();
      addToast({
        description: "Notifikasi aktif.",
        color: "success",
      })
    } else {
      unsubscribe();
      addToast({
        description: "Notifikasi tidak aktif.",
        color: "danger",
      })
    }
  }, [isSelected]);

  useEffect(() => {
    if (isSelectedTheme && theme !== "light") {
      setTheme("light");
    } else if (!isSelectedTheme && theme !== "dark") {
      setTheme("dark");
    }
  }, [isSelectedTheme]);

  if (!mounted) return null;
  else {
    return (
      <AhliLayout>
        <div className="flex justify-center">
          <Card className="max-w-md w-full p-4">
            <CardBody>
              <Switch
                isSelected={isSelected}
                onValueChange={setIsSelected}
                endContent={<Icon icon="material-symbols:notifications-off" />}
                startContent={<Icon icon="material-symbols:notifications" />}
              >
                <div className="text-sm gap-2 flex flex-row items-center">
                  <p>Aktifkan Notifikasi</p>
                </div>
              </Switch>
              <br />
              <Switch
                isSelected={isSelectedTheme}
                onValueChange={setIsSelectedTheme}
                endContent={<Icon icon="material-symbols:dark-mode" />}
                startContent={<Icon icon="material-symbols:light-mode" />}
              >
                <p className="text-sm">Ubah Tema</p>
              </Switch>
            </CardBody>
          </Card>
        </div>
      </AhliLayout>
    );
  }
};

export default Tetapan;
