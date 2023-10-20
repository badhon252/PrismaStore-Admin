import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  try {
    // Verify the Stripe webhook event
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // Handle the event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const address = session?.customer_details?.address;

      const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
      ];

      const addressString: string = addressComponents
        .filter((c) => c !== null)
        .join(", ");

      //? Update the order details in the database
      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product quantities and set isArchived status
      for (const orderItem of order.orderItems) {
        const productId = orderItem.product.id;
        const purchasedQuantity = orderItem.quantity;

        const product = await prismadb.product.findUnique({
          where: { id: productId },
        });

        if (product) {
          const remainingQuantity = Math.max(
            product.quantity - purchasedQuantity,
            0,
          );

          // console.log("Purchase quantity: ", purchasedQuantity);
          const isArchived = remainingQuantity === 0 ? true : false;
          // console.log("isArchived webhooks: ", isArchived, remainingQuantity);

          // Update the product in the database
          await prismadb.product.update({
            where: {
              id: productId,
            },
            data: {
              // quantity: remainingQuantity,
              isArchived,
            },
          });
        }
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
