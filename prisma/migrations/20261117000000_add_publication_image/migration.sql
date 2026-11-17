-- Additive, nullable column: existing publications are kept unchanged.
ALTER TABLE "Publication" ADD COLUMN IF NOT EXISTS "image" TEXT;
