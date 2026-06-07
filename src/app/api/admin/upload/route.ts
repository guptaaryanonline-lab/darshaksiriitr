import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  await requireAdmin();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      { error: "CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET must be set" },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json(
      { error: "No file provided. Send form-data with key 'file'" },
      { status: 400 },
    );
  }

  const uploadData = new FormData();
  uploadData.append("file", file as any);
  uploadData.append("upload_preset", uploadPreset);
  // place uploads in the preset asset folder
  uploadData.append("folder", "portfolio/darshakbhatt");

  // If API key/secret present, perform a signed upload (avoids Unknown API key errors)
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, string | number> = {
      folder: "portfolio/darshakbhatt",
      timestamp,
    };
    // include upload_preset in signature if present
    if (uploadPreset) paramsToSign.upload_preset = uploadPreset;

    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("signature", signature);
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadData,
  });

  const json = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: json }, { status: res.status });
  }

  return NextResponse.json({ url: json.secure_url || json.url });
}
