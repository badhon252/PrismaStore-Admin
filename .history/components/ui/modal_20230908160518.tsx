"use client";

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
            if(!open){
                onClose();
            }


    }