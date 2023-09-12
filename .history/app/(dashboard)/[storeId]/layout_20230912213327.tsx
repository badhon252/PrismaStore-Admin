import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
}
