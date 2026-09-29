-- Move the previously hardcoded homepage hero photos into the HeroSlide
-- table so they can be edited, reordered or deleted from the admin panel.
-- Fixed ids + ON CONFLICT make this safe to run more than once.
INSERT INTO "HeroSlide" ("id", "image", "caption", "position", "sortOrder", "updatedAt") VALUES
  ('default-hero-1', '/images/20231110_210617.jpg', 'RISHI Lab team', 'center 25%', 1, CURRENT_TIMESTAMP),
  ('default-hero-2', '/images/20240721_174225.jpg', 'Technology Innovators award', 'center 25%', 2, CURRENT_TIMESTAMP),
  ('default-hero-3', '/images/WhatsApp_Image_2025-04-09_at_16.20.24_d80d446b.jpg', 'Technology Innovators felicitation', 'center top', 3, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
