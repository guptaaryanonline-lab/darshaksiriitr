export const resources = {
  hero: {
    label: "Hero Slides",
    fields: ["image", "caption", "position", "sortOrder"]
  },
  projects: {
    label: "Projects",
    fields: ["title", "status", "duration", "image", "description", "objectives", "publications", "impact", "sortOrder"]
  },
  research: {
    label: "Research",
    fields: ["title", "description", "topics", "sortOrder"]
  },
  publications: {
    label: "Publications",
    fields: ["title", "authors", "type", "year", "journal", "conference", "volume", "pages", "doi", "link", "sortOrder"]
  },
  students: {
    label: "Students",
    fields: [
      "name",
      "program",
      "topic",
      "researchStatement",
      "status",
      "category",
      "joiningYear",
      "email",
      "scholarLink",
      "linkedinLink",
      "workplace",
      "image",
      "sortOrder"
    ]
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
