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

//? old code
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

  // Ensure correct order of line_items based on productIds
  productIds.forEach((productId, index) => {
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

  return NextResponse.json(
    { url: session.url, line_items }, // For debugging purposes, include line_items in the response
    {
      headers: corsHeaders,
    },
  );
}
