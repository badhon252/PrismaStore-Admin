"use client";
import { Modal } from "@/components/ui/modal";

export default function SetupPage() {
  return (
    <div>
      <Modal title="Test" description="Setup" isOpen onClose={() => {}}>
        Children
      </Modal>
    </div>
  );
}
