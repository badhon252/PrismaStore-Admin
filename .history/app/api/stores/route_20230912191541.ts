import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { create } from "zustand";

export async function POST(res: Request) {
  try {
    const { userId } = auth();
    const body = await res.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
  } catch (error) {
    console.log("[STORES_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
