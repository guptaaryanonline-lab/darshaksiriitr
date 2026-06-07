import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET must be set" }, { status: 500 });
    }

    const form = await request.formData();
    const file = form.get("file") as Blob | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided. Send form-data with key 'file'" }, { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append("file", file as any);
    uploadData.append("upload_preset", uploadPreset);
    // place uploads in the preset asset folder
    uploadData.append("folder", "portfolio/darshakbhatt");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadData,
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json }, { status: res.status });
    }

    return NextResponse.json({ url: json.secure_url || json.url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
