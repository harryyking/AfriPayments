// app/api/check-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const utApi = new UTApi();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get("fileKey");

    if (!fileKey) {
      return NextResponse.json({ error: "fileKey is required" }, { status: 400 });
    }

    const fileList = await utApi.listFiles({ limit: 50 });
    const fileExists = fileList.files.some((f) => f.key === fileKey);

    return NextResponse.json({ exists: fileExists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check file" }, { status: 500 });
  }
}