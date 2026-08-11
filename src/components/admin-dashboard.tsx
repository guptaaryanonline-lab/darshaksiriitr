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
  patents: {
    title: "",
    inventors: "",
    status: "Filed",
    year: new Date().getFullYear(),
    description: "",
    link: "",
    sortOrder: 0,
  },
  students: {
    name: "",
    program: "",
    topic: "",
    status: "Current",
    category: "Current",
    email: "",
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
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const dangerButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-red-700 active:scale-[0.98]";

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
  }

  function openNewForm() {
    setEditingId(null);
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setFormOpen(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setEditingId(null);
    setFormOpen(false);
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setMessage("");
  }

  function edit(item: Item) {
    setEditingId(String(item.id));
    setFormOpen(true);
    setDraft(toDraft(active, item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateDraft(resource: ResourceName, draft: Item) {
    const requiredFields = new Set(["title", "name", "status", "description", "program", "topic", "email", "year", "category", "targetYear", "code", "term", "level"]);
    const missing = [] as string[];

    for (const field of resources[resource].fields) {
      if (!requiredFields.has(field)) continue;
      const value = draft[field];
      if (value === undefined || value === null || String(value).trim() === "") {
        missing.push(field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()));
      }
    }

    return missing;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const missingFields = validateDraft(active, draft);
    if (missingFields.length > 0) {
      const message = `Required field${missingFields.length > 1 ? "s" : ""} missing: ${missingFields.join(", ")}`;
      setMessage(message);
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
    toast.success("Saved successfully.");
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/${active}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete this entry.");
      toast.error("Could not delete this entry.");
      return;
    }
    setData((current) => ({ ...current, [active]: current[active].filter((item) => item.id !== id) }));
    setMessage("Deleted successfully.");
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div>
            <h1 className="text-xl font-semibold text-ink sm:text-2xl">Content Admin</h1>
            <p className="mt-0.5 text-sm text-slate-500">Signed in as {email}</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className={secondaryButton}>
              View site
            </a>
            <button onClick={logout} className={primaryButton}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[240px_1fr] lg:px-10">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-soft lg:sticky lg:top-24">
          <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {(Object.keys(resources) as ResourceName[]).map((resource) => (
              <button
                key={resource}
                onClick={() => changeResource(resource)}
                className={`flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition duration-150 lg:w-full ${
                  active === resource ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                {resources[resource].label}
                <span className={active === resource ? "text-white/70" : "text-slate-400"}>{data[resource]?.length || 0}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="grid gap-6">
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
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{resources[active].label} content is stored in the database.</p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className={`${secondaryButton} shrink-0`}
                  aria-label={`Close ${resources[active].label} form`}
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
              <fieldset disabled={isSaving} aria-busy={isSaving}>
                <div className="grid gap-4 md:grid-cols-2">
                  {fields.map((field) => (
                    <FieldInput
                      key={field}
                      field={field}
                      active={active}
                      value={draft[field]}
                      onChange={(value) => setDraft((current) => ({ ...current, [field]: value }))}
                    />
                  ))}
                </div>

                {message ? <p className="mt-4 rounded-lg bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-700">{message}</p> : null}
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
                      <h3 className="truncate font-semibold text-ink">{String(item.title || item.name || "Untitled")}</h3>
                      <p className="mt-0.5 line-clamp-1 text-sm leading-6 text-slate-500">
                        {String(item.description || item.topic || item.status || "")}
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

function FieldInput({ field, value, onChange, active }: { field: string; value: unknown; onChange: (value: string) => void; active: ResourceName }) {
  const isLong = ["description", "objectives", "topics"].includes(field);
  const label = field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
  const normalized = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  const isStatusSelect = active === "projects" && field === "status";
  const isCategorySelect = active === "students" && field === "category";
  const requiredFields = new Set(["title", "status", "description", "name", "program", "topic", "email", "year", "category", "targetYear", "code", "term", "level"]);
  const isRequired = requiredFields.has(field) && !["image", "link", "objectives", "publications", "impact", "sortOrder"].includes(field);
  const isImageField = field === "image";

  if (isImageField) {
    return (
      <label className="block">
        <span className="block text-sm font-semibold text-slate-700">{label}</span>
        <ImageField value={normalized} onChange={onChange} />
      </label>
    );
  }

  return (
    <label className={isLong ? "md:col-span-2" : ""}>
      <span className="block text-sm font-semibold text-slate-700">{label}{isRequired ? " *" : ""}</span>
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
          <option>Current</option>
          <option>Placed</option>
        </select>
      ) : (
        <input
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type={["year", "sortOrder", "publications"].includes(field) ? "number" : "text"}
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
