// app/api/reset-image-count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Parse the request body to get the userId
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Step 3: Verify the user exists
    const user = await prisma.user.findUnique({
      where: { email: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 4: Delete all images associated with the user
    await prisma.image.deleteMany({
      where: { userId },
    });

    // Step 5: Update the last reset timestamp for the user
    await prisma.user.update({
      where: { email: userId },
      data: { lastReset: new Date() },
    });

    return NextResponse.json({ success: true, message: "Image count reset successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Reset image count error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}