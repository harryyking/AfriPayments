import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


interface ImageRequestBody {
  imageUrl: string;
  userId: string; // This is the email from the client, not the DB id
}

interface User {
  id: string;
  email?: string | null;
}

interface BehindImage {
  id: string;
  url: string;
  userid: string;
  fileKey: string;
  customId: string;
}

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
      select: { id: true, url: true, fileKey: true, customId: true, createdAt: true}, // Select specific fields
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
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request body
    const { imageUrl, fileKey, customId, userId } = await request.json();

    if (!imageUrl || !fileKey || !customId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    // Ensure the client-provided userId (email) matches the session user’s email
    if (session.user.email !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch the user’s actual ID from the database using their email
    const user: User | null = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create the BehindImage record with the user’s actual ID
    const newImage: BehindImage = await prisma.behindImage.create({
      data: {
          url: imageUrl,
          fileKey: fileKey,
          customId: customId,
        userid: user.id, // Use the fetched user.id, not email
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('POST /api/images error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}