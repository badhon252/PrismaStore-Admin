"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/StoreModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //? Prevents SSR issues with modal portal
  //? To avoid hydration mismatch warning
  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};
