import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

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
    const resultBase64 = Buffer.from(resultBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${resultBase64}`;

    return NextResponse.json({ result: dataUrl });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}