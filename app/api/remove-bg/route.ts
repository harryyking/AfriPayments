import { NextRequest, NextResponse } from "next/server";
import { UTApi, UTFile } from "uploadthing/server";

// Initialize UTApi
const utApi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userId } = await request.json();

    if (!imageUrl || !userId) {
      return NextResponse.json({ error: "Image URL and userId are required" }, { status: 400 });
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

    const file = new UTFile(
      [resultBuffer], // File content as a Buffer or ArrayBuffer
      `processed-image-${Date.now()}.png`, // File name
      {
        type: "image/png", // MIME type
        customId: userId, // Attach userId as customId for filtering later
      }
    );

    // Upload to UploadThing using utApi.uploadFiles
    let uploadedFiles;
    try {
      uploadedFiles = await utApi.uploadFiles([file]); // No metadata option needed

      if (!uploadedFiles || uploadedFiles.length === 0 || !uploadedFiles[0].data) {
        throw new Error("Upload to UploadThing failed: " + (uploadedFiles[0]?.error?.message || "Unknown error"));
      }
    } catch (uploadError) {
      console.error("UploadThing error:", uploadError);
      throw new Error("Failed to upload to UploadThing");
    }

    const processedUrl = uploadedFiles[0].data.url;
    const processedFileKey = uploadedFiles[0].data.key; // Extract the fileKey


    return NextResponse.json({ result: processedUrl, fileKey: processedFileKey });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}