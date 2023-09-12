"use client";

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

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
