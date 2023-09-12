"use client";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children