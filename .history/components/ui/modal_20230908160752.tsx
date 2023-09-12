"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const onChnage = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
