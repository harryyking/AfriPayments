// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-paystack-signature");
    const body = await request.text();
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "subscription.create") {
      const { customer, subscription_code, status } = event.data;
      await prisma.user.update({
        where: { email: customer.email },
        data: {
          subscriptionCode: subscription_code,
          subscriptionStatus: status,
          onPaid: status === "active",
        },
      });
    } else if (event.event === "subscription.disable") {
      const { customer } = event.data;
      await prisma.user.update({
        where: { email: customer.email },
        data: {
          subscriptionStatus: "canceled",
          onPaid: false,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}