import { NextRequest, NextResponse } from "next/server";
import { UTApi, UTFile } from "uploadthing/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const utApi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user?.email;
    if (!userId) {
      return NextResponse.json({ error: "User email not found in session" }, { status: 401 });
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Process with remove.bg
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`remove.bg API error: ${errorText}`);
    }

    const resultBuffer = await response.arrayBuffer();

    // Generate a unique identifier for this upload attempt
    const uploadId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create a UTFile with a unique customId for this specific upload
    const file = new UTFile(
      [resultBuffer],
      `processed-image-${Date.now()}.png`,
      {
        type: "image/png",
        customId: uploadId, // Use a unique customId for each upload
      }
    );

    // Check for existing files with the same customId (uploadId)
    const fileList = await utApi.listFiles({ limit: 50 });
    const existingFiles = fileList.files.filter((f) => f.customId === uploadId);

    if (existingFiles.length > 0) {
      // Delete existing files to avoid duplicate entry errors
      const filesToDelete = existingFiles.map((f) => f.key);
      await utApi.deleteFiles(filesToDelete);
      console.log(`Deleted ${filesToDelete.length} existing files with customId ${uploadId}`);
    }

    // Upload to UploadThing
    let uploadedFiles;
    try {
      uploadedFiles = await utApi.uploadFiles([file]);

      if (!uploadedFiles || uploadedFiles.length === 0 || !uploadedFiles[0].data) {
        throw new Error("Upload to UploadThing failed: " + (uploadedFiles[0]?.error?.message || "Unknown error"));
      }
    } catch (uploadError) {
      console.error("UploadThing error:", uploadError);
      throw new Error("Failed to upload to UploadThing");
    }

    const processedUrl = uploadedFiles[0].data.url;
    const processedFileKey = uploadedFiles[0].data.key;

    // Enforce a limit (e.g., keep only the latest 10 images for a user)
    const userFileList = await utApi.listFiles({ limit: 50 });
    const userFiles = userFileList.files.filter((f) => f.customId?.startsWith(`${userId}-`));

    if (userFiles.length > 10) {
      const filesToDelete = userFiles
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(10)
        .map((f) => f.key);

      if (filesToDelete.length > 0) {
        await utApi.deleteFiles(filesToDelete);
        console.log(`Deleted ${filesToDelete.length} old files for user ${userId}`);
      }
    }

    return NextResponse.json({ result: processedUrl, fileKey: processedFileKey });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}