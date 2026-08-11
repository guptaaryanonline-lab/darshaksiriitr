"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "/images/20230827_142636.jpg", position: "center 30%" },
  { src: "/images/20231110_210617.jpg", position: "center 30%" },
  { src: "/images/20240721_174225.jpg", position: "center 25%" },
  { src: "/images/WhatsApp_Image_2025-04-09_at_16.20.24_d80d446b.jpg", position: "center top" },
  { src: "/images/20230703_143246.jpg", position: "center 20%" }
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((value) => (value + 1) % images.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt="RISHI Lab research environment"
          fill
          priority={index === 0}
          sizes="100vw"
          style={{ objectPosition: image.position }}
          className={`object-cover transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/58 to-ink/86" />
    </div>
  );
}
