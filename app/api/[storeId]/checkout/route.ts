import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { productIds, quantities } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  productIds.forEach((productId: string, index: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      line_items.push({
        quantity: quantities[index],
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: Number(product.price) * 100,
        },
      });
    }
  });

  const orderItems = {
    create: productIds.map((productId: string, index: number) => ({
      product: {
        connect: {
          id: productId,
        },
      },
      quantity: quantities[index], // Use the corresponding quantity
    })),
  };

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  // Update product quantities after successful purchase and set isArchived status
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const purchasedQuantity = quantities[i];

    try {
      const product = await prismadb.product.findUnique({
        where: { id: productId },
      });

      if (product) {
        const remainingQuantity = Math.max(
          product.quantity - purchasedQuantity,
          0,
        );
        // console.log("Remaining Quantity:", remainingQuantity);

        const isArchived = remainingQuantity === 0 ? true : false;
        // console.log("Is Archived (checkout):", isArchived);

        await prismadb.product.update({
          where: { id: productId },
          data: {
            // quantity: remainingQuantity,
            isArchived,
          },
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      // Handle the error as needed, e.g., log it, send a notification, etc.
    }
  }

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    },
  );
}
