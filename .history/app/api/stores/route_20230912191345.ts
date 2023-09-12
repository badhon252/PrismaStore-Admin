import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(res: Request) {
  try {
    const { userId } = auth();
    const body = await res.json();
    const { name } = body;
  } catch (error) {
    console.log("[STORES_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
