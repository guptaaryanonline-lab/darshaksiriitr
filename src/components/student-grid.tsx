import { Briefcase, GraduationCap, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import type { Student } from "@prisma/client";

export function StudentGrid({ title, subtitle, students }: { title: string; subtitle?: string; students: Student[] }) {
  if (students.length === 0) return null;

  return (
    <section>
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-slate-600">{students.length}</span>
      </div>
      {subtitle && <p className="mt-2 max-w-2xl leading-6 text-slate-600">{subtitle}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </section>
  );
}

function StudentCard({ student }: { student: Student }) {
  const hasLinks = Boolean(student.linkedinLink || student.scholarLink || student.email);

  return (
    <article className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:aspect-[4/5] sm:h-auto sm:w-full sm:rounded-none">
        {student.image ? (
          <Image
            src={student.image}
            alt={student.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 96px"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-teal">
            <span className="text-2xl font-semibold tracking-wide text-white/90 sm:text-4xl">{initials(student.name)}</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {student.program && (
            <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold text-navy">{student.program}</span>
          )}
          {student.joiningYear && <span className="text-xs font-medium text-slate-500">Since {student.joiningYear}</span>}
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug text-ink sm:text-lg">{student.name}</h3>
        {student.topic && <p className="mt-1 text-sm font-medium leading-5 text-teal">{student.topic}</p>}

        {student.researchStatement && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{student.researchStatement}</p>
        )}

        {student.workplace && (
          <p className="mt-3 flex items-start gap-1.5 text-sm font-medium text-slate-700">
            <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span className="line-clamp-2">{student.workplace}</span>
          </p>
        )}

        {hasLinks && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {student.linkedinLink && (
              <a
                href={student.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${student.name} on LinkedIn`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0a66c2]/10 px-3 text-sm font-semibold text-[#0a66c2] transition duration-200 hover:bg-[#0a66c2] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
            {student.scholarLink && (
              <a
                href={student.scholarLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${student.name} on Google Scholar`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-200 hover:text-ink"
              >
                <GraduationCap className="h-4 w-4" />
                Scholar
              </a>
            )}
            {student.email && (
              <a
                href={`mailto:${student.email}`}
                aria-label={`Email ${student.name}`}
                title={student.email}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition duration-200 hover:bg-slate-200 hover:text-ink"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
