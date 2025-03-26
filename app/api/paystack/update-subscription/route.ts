// app/api/paystack/update-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, subscriptionCode, subscriptionStatus } = await request.json();
    if (!userId || !subscriptionCode || !subscriptionStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: userId },
      data: {
        subscriptionCode,
        subscriptionStatus,
        onPaid: subscriptionStatus === "active",
      },
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}