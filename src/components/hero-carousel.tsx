"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlideInput = { image: string; position?: string | null; caption?: string | null };

// Slides are managed from the admin panel ("Hero Slides"). With none, the
// hero falls back to a plain brand gradient.
export function HeroCarousel({ slides: images }: { slides: HeroSlideInput[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % images.length), 5200);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-navy via-ink to-teal">
      {images.map((slide, index) => (
        <Image
          key={`${slide.image}-${index}`}
          src={slide.image}
          alt={slide.caption || "RISHI Lab research environment"}
          fill
          priority={index === 0}
          sizes="100vw"
          style={{ objectPosition: slide.position || "center" }}
          className={`object-cover transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/58 to-ink/86" />
    </div>
  );
}
