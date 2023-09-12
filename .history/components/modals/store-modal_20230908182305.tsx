"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { FormField } from "../ui/form";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    //TODO: Create store
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}></form>
            <FormField />
          </Form>
        </div>
      </div>
    </Modal>
  );
};
