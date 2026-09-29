"use client";

import { Briefcase, ChevronLeft, ChevronRight, GraduationCap, Linkedin, Mail, Users } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import type { Student } from "@prisma/client";

export function StudentCarousel({ title, subtitle, students }: { title: string; subtitle?: string; students: Student[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  if (students.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-2 max-w-2xl leading-6 text-slate-600">{subtitle}</p>}
        </div>
        {students.length > 4 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              aria-label={`Scroll ${title} left`}
              className="focus-ring inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label={`Scroll ${title} right`}
              className="focus-ring inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {students.map((student) => (
          <article
            key={student.id}
            className="group flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
          >
            {student.image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200 sm:aspect-square">
                <Image
                  src={student.image}
                  alt={student.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 sm:aspect-square">
                <div className="rounded-full bg-slate-300 p-4">
                  <Users className="h-12 w-12 text-slate-600" />
                </div>
              </div>
            )}

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-ink">{student.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {student.program}
                {student.status && ` • ${student.status}`}
              </p>

              <p className="mt-4 flex-1 leading-6 text-slate-700 text-sm">
                {student.researchStatement || student.topic}
              </p>

              {student.workplace && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{student.workplace}</span>
                </p>
              )}

              {(student.email || student.scholarLink || student.linkedinLink) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      aria-label={`Email ${student.name}`}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-navy"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {student.scholarLink && (
                    <a
                      href={student.scholarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${student.name}'s Google Scholar profile`}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-navy"
                    >
                      <GraduationCap className="h-4 w-4" />
                    </a>
                  )}
                  {student.linkedinLink && (
                    <a
                      href={student.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${student.name}'s LinkedIn profile`}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-navy"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
