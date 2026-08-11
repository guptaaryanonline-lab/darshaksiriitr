import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

export async function POST(request: Request) {
  await requireAdmin();

  const form = await request.formData();
  const file = form.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json(
      { error: "No file provided. Send form-data with key 'file'" },
      { status: 400 }
    );
  }

  try {
    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}