"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type HeroSlideInput = { image: string; position?: string | null; caption?: string | null };

const SLIDE_MS = 6000;

// Full-height hero with a swipeable photo slider behind `children`.
// Slides are managed from the admin panel ("Hero Slides"); with none, the
// hero shows a plain brand gradient.
export function HeroCarousel({ slides, children }: { slides: HeroSlideInput[]; children: ReactNode }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  // Once a visitor picks a slide themselves (dot, arrow, swipe, keyboard),
  // autoplay stops for good — that is the way to stop the motion.
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => setActive(((index % count) + count) % count), [count]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const choose = useCallback(
    (index: number) => {
      setStopped(true);
      goTo(index);
    },
    [goTo]
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // The active dot's progress animation is the timer: when it finishes, the
  // next slide shows. Pausing the animation pauses the slider.
  const autoplay = count > 1 && !reducedMotion && !stopped;
  const playing = autoplay && !hovered && !focused && !tabHidden;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative flex min-h-[calc(100dvh-65px)] touch-pan-y touch-pinch-zoom items-center overflow-hidden bg-gradient-to-br from-navy via-ink to-teal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(event) => {
        // Only keyboard focus pauses; a mouse click on a dot shouldn't freeze the slider.
        if ((event.target as HTMLElement).matches?.(":focus-visible")) setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start || count < 2) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(active + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => (pointerStart.current = null)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <Image
            key={`${slide.image}-${index}`}
            src={slide.image}
            alt={slide.caption || "RISHI Lab highlight"}
            aria-hidden={index !== active}
            fill
            priority={index === 0}
            sizes="100vw"
            draggable={false}
            className="select-none object-cover"
            style={{
              objectPosition: slide.position || "center",
              opacity: index === active ? 1 : 0,
              transform: !reducedMotion && index === active ? "scale(1.06)" : "scale(1)",
              transition: reducedMotion ? "opacity 0.6s ease" : "opacity 1.1s ease, transform 7s ease-out"
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/90" />
      </div>

      {children}

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div
            className="mx-auto flex max-w-7xl items-center justify-between px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") choose(active + 1);
              if (event.key === "ArrowLeft") choose(active - 1);
            }}
          >
            <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
              {slides.map((slide, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => choose(index)}
                  aria-label={`Slide ${index + 1} of ${count}${slide.caption ? `: ${slide.caption}` : ""}`}
                  aria-current={index === active}
                  className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ${
                    index === active ? "w-10 bg-white/30" : "w-2 bg-white/45 hover:bg-white/80"
                  }`}
                >
                  {index === active && (
                    <span
                      key={`progress-${active}`}
                      className={`absolute inset-0 origin-left rounded-full bg-white ${autoplay ? "animate-[hero-progress_6s_linear_forwards]" : ""}`}
                      style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                      onAnimationEnd={next}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => choose(active - 1)}
                aria-label="Previous slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => choose(active + 1)}
                aria-label="Next slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
