import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    if (session.user.email !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const images = await prisma.behindImage.findMany({
      where: { user: { email: userId } },
      orderBy: { createdAt: "desc" },
      select: { id: true, imageUrl: true, createdAt: true }, // Select specific fields
    });

    const user = await prisma.user.findUnique({
      where: { email: userId },
      select: { onPaid: true },
    });

    return NextResponse.json({
      images,
      onPaid: user?.onPaid ?? false, // Use nullish coalescing for safety
    });
  } catch (error) {
    console.error("GET /api/images error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, userId } = await request.json();
    if (!imageUrl || !userId) {
      return NextResponse.json(
        { error: "Image URL and user ID are required" },
        { status: 400 }
      );
    }

    if (session.user.email !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newImage = await prisma.behindImage.create({
      data: {
        imageUrl,
        userid: userId, // Match the schema field name
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("POST /api/images error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}