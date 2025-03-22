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
    if (session.user.email !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const images = await prisma.behindImage.findMany({
      where: { userid: userId! },
      orderBy: { createdAt: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId! },
      select: { onPaid: true },
    });

    return NextResponse.json({
      images,
      onPaid: user?.onPaid || false,
    });
  } catch (error) {
    console.error(error);
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
      return NextResponse.json({ error: "Image URL and user ID are required" }, { status: 400 });
    }

    if (session.user.email !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newImage = await prisma.behindImage.create({
      data: {
        imageUrl,
        userid: userId,
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}