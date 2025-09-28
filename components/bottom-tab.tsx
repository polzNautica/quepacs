import { Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function BottomTab() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:image-multiple" />
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:music" />
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:video" />
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
