import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {}
