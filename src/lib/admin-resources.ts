export const resources = {
  projects: {
    label: "Projects",
    fields: ["title", "status", "duration", "image", "description", "objectives", "publications", "impact", "sortOrder"]
  },
  research: {
    label: "Research",
    fields: ["title", "description", "topics", "sortOrder"]
  },
  patents: {
    label: "Patents",
    fields: ["title", "inventors", "status", "year", "description", "link", "sortOrder"]
  },
  students: {
    label: "Students",
    fields: ["name", "program", "topic", "status", "category", "email", "image", "sortOrder"]
  },
  goals: {
    label: "Goals",
    fields: ["title", "category", "description", "targetYear", "status", "sortOrder"]
  },
  courses: {
    label: "Courses",
    fields: ["code", "title", "term", "level", "description", "topics", "sortOrder"]
  }
} as const;

export type ResourceName = keyof typeof resources;

export function isResourceName(value: string): value is ResourceName {
  return value in resources;
}
