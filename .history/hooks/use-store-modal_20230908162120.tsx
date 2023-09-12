import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
