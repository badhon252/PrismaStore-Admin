import { NextResponse } from "next/server";

export async function POST(res: Request) {
  try {
    const { userId } = auth();
  } catch (error) {
    console.log("[STORES_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
