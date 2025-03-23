import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json();

    if (!reference || !userId) {
      return NextResponse.json({ error: "Reference and userId are required" }, { status: 400 });
    }

    // Verify the transaction with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    if (data.status && data.data.status === "success") {
      // Update the user's payment status in the database
      const prisma = (await import("@/lib/db")).default;
      await prisma.user.update({
        where: { id: userId },
        data: { onPaid: true },
      });

      return NextResponse.json({ status: "success", message: "Payment verified" });
    } else {
      return NextResponse.json({ status: "failed", message: "Payment verification failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}