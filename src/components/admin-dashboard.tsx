"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, LogOut, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { resources, type ResourceName } from "@/lib/admin-resources";
import { toast } from "sonner";
import { Toaster } from "@/legacy/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/legacy/components/ui/alert-dialog";

type Item = Record<string, unknown> & { id?: string };
type DataMap = Record<ResourceName, Item[]>;

const emptyItem: Record<ResourceName, Item> = {
  hero: {
    image: "",
    caption: "",
    position: "center",
    sortOrder: 0,
  },
  projects: {
    title: "",
    status: "Active",
    duration: "",
    image: "",
    description: "",
    objectives: "",
    publications: 0,
    impact: "",
    sortOrder: 0,
  },
  research: {
    title: "",
    description: "",
    topics: "",
    sortOrder: 0,
  },
  publications: {
    title: "",
    authors: "",
    type: "Journal",
    year: new Date().getFullYear(),
    journal: "",
    conference: "",
    volume: "",
    pages: "",
    doi: "",
    link: "",
    sortOrder: 0,
  },
  students: {
    name: "",
    program: "PhD",
    topic: "",
    researchStatement: "",
    status: "Currently Pursuing",
    category: "Current",
    joiningYear: "",
    email: "",
    scholarLink: "",
    linkedinLink: "",
    workplace: "",
    image: "",
    sortOrder: 0,
  },
  goals: {
    title: "",
    category: "",
    description: "",
    targetYear: "",
    status: "Active",
    sortOrder: 0,
  },
  courses: {
    code: "",
    title: "",
    term: "",
    level: "",
    description: "",
    topics: "",
    sortOrder: 0,
  },
};

const primaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const dangerButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 active:scale-[0.98]";

export function AdminDashboard({ email, initialData }: { email: string; initialData: DataMap }) {
  const router = useRouter();
  const [active, setActive] = useState<ResourceName>("projects");
  const [data, setData] = useState<DataMap>(initialData);
  const getNextSortOrder = (resource: ResourceName) => {
    const currentItems = data[resource] || [];
    const maxOrder = currentItems.reduce((max, item) => {
      const order = Number(item.sortOrder ?? item.sortorder ?? 0);
      return Number.isFinite(order) ? Math.max(max, order) : max;
    }, 0);
    return maxOrder + 1;
  };
  const [draft, setDraft] = useState<Item>(() => ({ ...emptyItem.projects, sortOrder: getNextSortOrder("projects") }));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const activeItems = data[active] || [];
  const fields = resources[active].fields;

  const title = useMemo(() => (editingId ? "Edit entry" : "Add entry"), [editingId]);

  function changeResource(resource: ResourceName) {
    setActive(resource);
    setEditingId(null);
    setFormOpen(false);
    setDraft({ ...emptyItem[resource], sortOrder: getNextSortOrder(resource) });
    setMessage("");
    setIsError(false);
  }

  function openNewForm() {
    setEditingId(null);
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setFormOpen(true);
    setMessage("");
    setIsError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setEditingId(null);
    setFormOpen(false);
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setMessage("");
    setIsError(false);
  }

  function edit(item: Item) {
    setEditingId(String(item.id));
    setFormOpen(true);
    setDraft(toDraft(active, item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField(field: string, value: string) {
    setDraft((current) => {
      const next: Item = { ...current, [field]: value };
      // Keep "Show under" in step with the student's status.
      if (active === "students" && field === "status") {
        if (/graduat|alumn|placed/i.test(value)) next.category = "Placed";
        else if (/current|pursu/i.test(value)) next.category = "Current";
      }
      return next;
    });
  }

  function validateDraft(resource: ResourceName, draft: Item) {
    const requiredFields = new Set(["title", "name", "status", "description", "program", "topic", "researchStatement", "year", "category", "targetYear", "code", "term", "level", "authors", "type"]);
    const missing = [] as string[];

    if (resource === "hero") requiredFields.add("image");

    for (const field of resources[resource].fields) {
      if (!requiredFields.has(field)) continue;
      const value = draft[field];
      if (value === undefined || value === null || String(value).trim() === "") {
        missing.push(fieldLabel(resource, field));
      }
    }

    return missing;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const missingFields = validateDraft(active, draft);
    if (missingFields.length > 0) {
      const message = `Required field${missingFields.length > 1 ? "s" : ""} missing: ${missingFields.join(", ")}`;
      setMessage(message);
      setIsError(true);
      toast.error(message);
      return;
    }

    setIsSaving(true);
    toast.dismiss();
    const response = await fetch(`/api/admin/${active}${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setIsSaving(false);
    if (!response.ok) {
      setMessage("Could not save. Please check required fields.");
      setIsError(true);
      toast.error("Could not save. Please check required fields.");
      return;
    }
    const saved = await response.json();
    setData((current) => ({
      ...current,
      [active]: editingId ? current[active].map((item) => (item.id === editingId ? saved : item)) : [saved, ...current[active]],
    }));
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setEditingId(null);
    setFormOpen(false);
    setMessage("Saved successfully.");
    setIsError(false);
    toast.success("Saved successfully.");
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/${active}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete this entry.");
      setIsError(true);
      toast.error("Could not delete this entry.");
      return;
    }
    setData((current) => ({ ...current, [active]: current[active].filter((item) => item.id !== id) }));
    setMessage("Deleted successfully.");
    setIsError(false);
    toast.success("Deleted successfully.");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Toaster />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-ink sm:text-xl lg:text-2xl">Content Admin</h1>
            <p className="mt-0.5 truncate text-sm text-slate-500">Signed in as {email}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <a href="/" className={`${secondaryButton} flex-1 sm:flex-none`}>
              View site
            </a>
            <button onClick={logout} className={`${primaryButton} flex-1 sm:flex-none`}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* minmax(0, …) stops the scrollable tab row from stretching the page wider than the screen on phones. */}
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-4 px-4 py-5 sm:gap-6 sm:px-8 sm:py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-soft lg:sticky lg:top-24">
          <nav className="-mx-2 flex snap-x gap-1.5 overflow-x-auto scroll-px-2 px-2 pb-1 lg:mx-0 lg:snap-none lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {(Object.keys(resources) as ResourceName[]).map((resource) => (
              <button
                key={resource}
                onClick={() => changeResource(resource)}
                className={`flex shrink-0 cursor-pointer snap-start items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition duration-150 lg:w-full ${
                  active === resource ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                {resources[resource].label}
                <span className={active === resource ? "text-white/70" : "text-slate-400"}>{data[resource]?.length || 0}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
          {!formOpen ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink sm:text-xl">{resources[active].label}</h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                    The form stays hidden until you add a new entry, keeping this tab focused.
                  </p>
                </div>
                <button type="button" onClick={openNewForm} className={`${primaryButton} shrink-0`}>
                  <Plus className="h-4 w-4" />
                  Add new
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{resources[active].label} content is stored in the database.</p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className={`${secondaryButton} shrink-0 !px-3.5 sm:!px-4`}
                  aria-label={`Close ${resources[active].label} form`}
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>

              {message ? (
                <p
                  role="alert"
                  className={`mb-4 rounded-lg border px-3.5 py-2.5 text-sm font-medium ${
                    isError
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <fieldset disabled={isSaving} aria-busy={isSaving}>
                {formSections[active] ? (
                  <div className="space-y-4">
                    {formSections[active]!.map((section) => (
                      <section key={section.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{section.title}</h3>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {section.fields.map((field) => (
                            <FieldInput key={field} field={field} active={active} value={draft[field]} onChange={(value) => updateField(field, value)} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {fields.map((field) => (
                      <FieldInput key={field} field={field} active={active} value={draft[field]} onChange={(value) => updateField(field, value)} />
                    ))}
                  </div>
                )}

                <button type="submit" className={`${primaryButton} mt-5 w-full sm:w-auto`}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </fieldset>
            </form>
          )}

          <div className="rounded-xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">{resources[active].label}</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {activeItems.map((item) => (
                <article key={String(item.id)} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    {typeof item.image === "string" && item.image ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={item.image} alt="" fill className="object-cover" />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-ink">{String(item.title || item.name || item.caption || (active === "hero" ? "Hero slide" : "Untitled"))}</h3>
                      <p className="mt-0.5 line-clamp-1 text-sm leading-6 text-slate-500">
                        {String(item.description || item.topic || item.status || (active === "hero" ? `Focus: ${item.position || "center"} · Order ${item.sortOrder ?? 0}` : ""))}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => edit(item)} className={secondaryButton}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setDeleteTarget(String(item.id))} className={dangerButton}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete this entry? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (!deleteTarget) return;
                              await remove(deleteTarget);
                              setDeleteTarget(null);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </article>
              ))}
              {activeItems.length === 0 ? <p className="p-5 text-sm text-slate-500">No entries yet.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        const msg = (json && json.error && (json.error.message || json.error.error?.message)) || "Upload failed";
        throw new Error(msg);
      }
      onChange(json.url);
      toast.success("Image uploaded.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {value ? (
          <Image src={value} alt="" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          className="hidden"
          id={`image-upload-${value.length}`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={secondaryButton}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          {value ? (
            <button type="button" onClick={() => onChange("")} className="cursor-pointer text-sm font-medium text-slate-500 hover:text-red-600">
              Remove
            </button>
          ) : null}
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste an image URL"
          pattern="(^/.*|https?://.*)"
          title="Use a relative path starting with / or an absolute URL starting with http:// or https://"
          className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-500"
        />
        {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}

// Human-friendly labels and hints. "resource.field" entries win over plain
// "field" entries; anything unlisted falls back to a title-cased field name.
const fieldCopy: Record<string, { label: string; hint?: string }> = {
  sortOrder: { label: "Display order", hint: "Lower numbers show first." },
  "hero.image": { label: "Slide image", hint: "Use a wide landscape photo (at least 1920×1080). Text sits on top, so busy areas get darkened." },
  "hero.caption": { label: "Caption", hint: "Short description of the photo, used for accessibility and search engines." },
  "hero.position": { label: "Focus", hint: "Which part of the photo stays visible when it is cropped." },
  "students.name": { label: "Full name" },
  "students.program": { label: "Program / Degree" },
  "students.topic": { label: "Research domain / area" },
  "students.researchStatement": { label: "Research statement", hint: "2–3 sentences shown on the student's card." },
  "students.image": { label: "Photograph", hint: "A clear portrait works best; it is cropped to a 4:5 frame." },
  "students.status": { label: "Status" },
  "students.category": { label: "Show under", hint: "Picks the section on the Students page." },
  "students.joiningYear": { label: "Joining year / month" },
  "students.workplace": { label: "Current workplace / position", hint: "For placed alumni, e.g. \"RFIC Engineer, Qualcomm\"." },
  "students.linkedinLink": { label: "LinkedIn profile URL" },
  "students.scholarLink": { label: "Google Scholar profile URL" },
  "students.email": { label: "Email" },
  "publications.doi": { label: "DOI", hint: "Only the identifier, e.g. 10.1109/ISCAS.2023.1234. Leave empty if unsure." }
};

function fieldLabel(resource: ResourceName, field: string) {
  return (
    fieldCopy[`${resource}.${field}`]?.label ??
    fieldCopy[field]?.label ??
    field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())
  );
}

function fieldHint(resource: ResourceName, field: string) {
  return fieldCopy[`${resource}.${field}`]?.hint ?? fieldCopy[field]?.hint;
}

// Resources whose form is split into titled sections (mirrors the student
// intake Google Form). Every field listed in admin-resources must appear here.
const formSections: Partial<Record<ResourceName, { title: string; fields: string[] }[]>> = {
  students: [
    { title: "Basic info", fields: ["name", "program", "topic", "researchStatement", "image"] },
    { title: "Status", fields: ["status", "category", "joiningYear", "workplace"] },
    { title: "Profiles & contact", fields: ["linkedinLink", "scholarLink", "email"] },
    { title: "Display", fields: ["sortOrder"] }
  ]
};

function FieldInput({ field, value, onChange, active }: { field: string; value: unknown; onChange: (value: string) => void; active: ResourceName }) {
  const isLong = ["description", "objectives", "topics", "researchStatement"].includes(field);
  const label = fieldLabel(active, field);
  const hint = fieldHint(active, field);
  const normalized = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  const isStatusSelect = active === "projects" && field === "status";
  const isCategorySelect = active === "students" && field === "category";
  const isTypeSelect = active === "publications" && field === "type";
  const isProgramSelect = active === "students" && field === "program";
  const isStudentStatus = active === "students" && field === "status";
  const isPositionSelect = active === "hero" && field === "position";
  const isProfileLink = ["scholarLink", "linkedinLink", "link"].includes(field);
  const requiredFields = new Set(["title", "status", "description", "name", "program", "topic", "researchStatement", "year", "category", "targetYear", "code", "term", "level", "authors", "type"]);
  const isRequired = requiredFields.has(field) && !["image", "link", "objectives", "publications", "impact", "sortOrder"].includes(field);
  const isImageField = field === "image";
  const hintNode = hint ? <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span> : null;

  if (isImageField) {
    const isHero = active === "hero";
    return (
      <label className={`block ${isHero || active === "students" ? "md:col-span-2" : ""}`}>
        <span className="block text-sm font-semibold text-slate-700">{label}{isHero ? " *" : ""}</span>
        {hintNode}
        <ImageField value={normalized} onChange={onChange} />
      </label>
    );
  }

  if (isPositionSelect) {
    return (
      <label>
        <span className="block text-sm font-semibold text-slate-700">{label}</span>
        {hintNode}
        <select
          value={normalized || "center"}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="center top">Top (faces near the top)</option>
          <option value="center 25%">Upper third</option>
          <option value="center">Center</option>
          <option value="center 75%">Lower third</option>
          <option value="center bottom">Bottom</option>
        </select>
      </label>
    );
  }

  return (
    <label className={isLong ? "md:col-span-2" : ""}>
      <span className="block text-sm font-semibold text-slate-700">{label}{isRequired ? " *" : ""}</span>
      {hintNode}
      {isLong ? (
        <textarea
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          rows={field === "description" ? 4 : 5}
          className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder={field === "objectives" || field === "topics" ? "One item per line" : undefined}
          required={isRequired}
        />
      ) : isStatusSelect ? (
        <select
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm"
          required={isRequired}
        >
          <option>Active</option>
          <option>In Progress</option>
          <option>Published</option>
          <option>Completed</option>
        </select>
      ) : isCategorySelect ? (
        <select
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm"
          required={isRequired}
        >
          <option value="Current">Current students</option>
          <option value="Placed">Placed alumni</option>
        </select>
      ) : isTypeSelect ? (
        <select
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm"
          required={isRequired}
        >
          <option>Journal</option>
          <option>Conference</option>
          <option>Thesis</option>
        </select>
      ) : isStudentStatus ? (
        <>
          <input
            value={normalized}
            onChange={(event) => onChange(event.target.value)}
            list="student-status-options"
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Currently Pursuing or Graduated"
            required={isRequired}
          />
          <datalist id="student-status-options">
            <option value="Currently Pursuing" />
            <option value="Graduated" />
          </datalist>
        </>
      ) : isProgramSelect ? (
        <>
          <input
            value={normalized}
            onChange={(event) => onChange(event.target.value)}
            list="program-options"
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="PhD, MTech, MS (Research), or other"
            required={isRequired}
          />
          <datalist id="program-options">
            <option value="PhD" />
            <option value="MTech" />
            <option value="MS (Research)" />
          </datalist>
        </>
      ) : (
        <input
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type={["year", "sortOrder", "publications"].includes(field) ? "number" : field === "email" ? "email" : "text"}
          inputMode={isProfileLink ? "url" : undefined}
          autoCapitalize={isProfileLink || field === "email" ? "off" : undefined}
          placeholder={
            field === "scholarLink"
              ? "scholar.google.com/citations?user=…"
              : field === "linkedinLink"
                ? "linkedin.com/in/username"
                : field === "joiningYear"
                  ? "e.g. 2023 or Aug 2023"
                  : field === "workplace"
                    ? "Only if placed"
                    : undefined
          }
          required={isRequired}
          min={field === "year" || field === "sortOrder" || field === "publications" ? 0 : undefined}
        />
      )}
    </label>
  );
}

function toDraft(resource: ResourceName, item: Item) {
  const draft: Item = {};
  for (const field of resources[resource].fields) {
    draft[field] = Array.isArray(item[field]) ? (item[field] as unknown[]).join("\n") : item[field] ?? "";
  }
  return draft;
}
