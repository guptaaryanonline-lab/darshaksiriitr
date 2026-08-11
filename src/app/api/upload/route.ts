import { NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/uploads";

// Writing to local disk requires the Node.js runtime (fs access is not
// available on the edge runtime).
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as Blob | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided. Send form-data with key 'file'" }, { status: 400 });
    }

    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
