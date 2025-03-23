import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("Paystack secret key is not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await request.text();
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    const signature = request.headers.get("x-paystack-signature");
    if (hash !== signature) {
      console.warn("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Paystack Webhook Event:", event);

    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      const userId = metadata?.userId;

      if (userId) {
        const prisma = (await import("@/lib/db")).default;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user && !user.onPaid) {
          await prisma.user.update({
            where: { id: userId },
            data: { onPaid: true },
          });
          console.log(`Updated payment status for user ${userId}, reference ${reference}`);
        } else {
          console.log(`User ${userId} already paid or not found, reference ${reference}`);
        }
      } else {
        console.warn("No userId in metadata", event.data);
      }
    } else {
      console.log(`Unhandled Paystack event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}