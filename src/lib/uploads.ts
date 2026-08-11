import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Files are written under public/uploads so Next.js serves them directly as
// static assets at /uploads/<name>. In Docker this directory is backed by
// the "app-uploads" named volume, so uploads survive container restarts
// and rebuilds.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg"
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function saveUploadedImage(file: Blob): Promise<string> {
  const type = (file as File).type || "application/octet-stream";
  const extension = ALLOWED_EXTENSIONS[type];
  if (!extension) {
    throw new Error(`Unsupported file type: ${type}. Allowed: ${Object.keys(ALLOWED_EXTENSIONS).join(", ")}`);
  }

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large. Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await writeFile(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${filename}`;
}
