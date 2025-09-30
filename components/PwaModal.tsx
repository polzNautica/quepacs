"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

interface PwaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInstall?: () => void;
}

export const PwaModal = ({ isOpen, onOpenChange, onInstall }: PwaModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center">
              PWA
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">Install this app as PWA?</div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onInstall}>
                Install
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
