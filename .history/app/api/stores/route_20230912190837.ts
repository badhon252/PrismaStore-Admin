export async function POST(res: Request) {
  try {
  } catch (error) {
    console.log("[STORES_POST_ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
  }
}
