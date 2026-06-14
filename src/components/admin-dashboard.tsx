"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, UploadCloud, X } from "lucide-react";
import { resources, type ResourceName } from "@/lib/admin-resources";
import { toast } from "sonner";
import { Toaster } from "@/legacy/components/ui/sonner";
import CopyableUrl from "@/components/CopyableUrl";
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
type AdminTab = ResourceName | "upload";

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
};

export function AdminDashboard({ email, initialData }: { email: string; initialData: DataMap }) {
  const router = useRouter();
  const [active, setActive] = useState<AdminTab>("projects");
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
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const activeItems = active === "upload" ? [] : data[active] || [];
  const fields = active === "upload" ? [] : resources[active].fields;

  const title = useMemo(() => (editingId ? "Edit entry" : "Add entry"), [editingId]);

  function changeResource(resource: ResourceName) {
    setActive(resource);
    setEditingId(null);
    setFormOpen(false);
    setDraft({ ...emptyItem[resource], sortOrder: getNextSortOrder(resource) });
    setMessage("");
  }

  function showUploadTab() {
    setActive("upload");
    setEditingId(null);
    setFormOpen(false);
    setMessage("");
  }

  function openNewForm() {
    if (active === "upload") return;
    const resource = active as ResourceName;
    setEditingId(null);
    setDraft({ ...emptyItem[resource], sortOrder: getNextSortOrder(resource) });
    setFormOpen(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    if (active === "upload") {
      setUploadFile(null);
      setUploadUrl("");
      setUploadError("");
      setActive("projects");
      setDraft({ ...emptyItem.projects, sortOrder: getNextSortOrder("projects") });
      return;
    }

    setEditingId(null);
    setFormOpen(false);
    setDraft({ ...emptyItem[active], sortOrder: getNextSortOrder(active) });
    setMessage("");
  }

  function edit(item: Item) {
    setEditingId(String(item.id));
    setFormOpen(true);
    if (active === "upload") return;
    setDraft(toDraft(active, item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateDraft(resource: ResourceName, draft: Item) {
    const requiredFields = new Set(["title", "name", "status", "description", "program", "topic", "email", "year", "category", "targetYear"]);
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

    if (active === "upload") return;

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
    setMessage("Saved successfully.");
    toast.success("Saved successfully.");
    router.refresh();
  }

  async function remove(id: string) {
    if (active === "upload") return;

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

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploadFile) {
      setUploadError("Please choose a file to upload.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        const message =
          (json && json.error && (json.error.message || json.error.error?.message)) ||
          (json && json.error?.message) ||
          JSON.stringify(json.error ?? json) ||
          "Upload failed";
        throw new Error(message);
      }
      setUploadUrl(json.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Content Admin</h1>
            <p className="mt-1 text-sm text-slate-600">Signed in as {email}</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">View site</a>
            <button onClick={logout} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr] lg:px-10">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
            {(Object.keys(resources) as ResourceName[]).map((resource) => (
              <button
                key={resource}
                onClick={() => changeResource(resource)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold ${
                  active === resource ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {resources[resource].label}
                <span className={active === resource ? "text-white/75" : "text-slate-400"}>{data[resource]?.length || 0}</span>
              </button>
            ))}
            <button
              onClick={showUploadTab}
              className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold ${
                active === "upload" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>Image Upload</span>
              <span className={active === "upload" ? "text-white/75" : "text-slate-400"}>+</span>
            </button>
          </aside>
        <section className="grid gap-6">
          {active === "upload" ? (
            <form onSubmit={uploadImage} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <Toaster />
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-teal" />
                  <h2 className="text-lg font-semibold text-ink">Dedicated Image Upload</h2>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Close image upload form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-3 text-sm text-slate-600">
                This is a standalone image upload tab. Upload an image here and copy the returned URL into any item&apos;s image field.
              </p>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="block w-full">
                  <span className="text-sm font-semibold text-slate-700">Image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload image"}
                </button>
              </div>
              {uploadError ? <p className="mt-3 text-sm text-red-600">{uploadError}</p> : null}
              {uploadUrl ? (
                <div className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-800">
                  <p className="font-semibold">Upload completed</p>
                  <p className="text-slate-700">Copy this URL into your image field:</p>
                  <CopyableUrl url={uploadUrl} label="Uploaded image URL" />
                </div>
              ) : null}
            </form>
          ) : (
            <>
              {!formOpen && !editingId ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-ink">{resources[active].label}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        The create form is hidden until you click Add New. This keeps each tab focused and avoids an overwhelming dashboard experience.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openNewForm}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
                  <Toaster />
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-ink">{title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{resources[active].label} content is stored in the database.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={openNewForm}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                        New
                      </button>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        aria-label={`Close ${resources[active].label} form`}
                      >
                        <X className="h-4 w-4" />
                        Close
                      </button>
                    </div>
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

                    {message ? <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{message}</p> : null}
                    <button
                      type="submit"
                      className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </fieldset>
                </form>
              )}

              <div className="rounded-lg border border-slate-200 bg-white shadow-soft">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-xl font-semibold text-ink">{resources[active].label}</h2>
                </div>
                <div className="divide-y divide-slate-200">
                  {activeItems.map((item) => (
                    <article key={String(item.id)} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                      <div>
                        <h3 className="font-semibold text-ink">{String(item.title || item.name || "Untitled")}</h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                          {String(item.description || item.topic || item.status || "")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => edit(item)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                          Edit
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setDeleteTarget(String(item.id))}
                              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                            >
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
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function FieldInput({ field, value, onChange, active }: { field: string; value: unknown; onChange: (value: string) => void; active: ResourceName }) {
  const isLong = ["description", "objectives", "topics"].includes(field);
  const label = field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
  const normalized = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  const isStatusSelect = active === "projects" && field === "status";
  const requiredFields = new Set(["title", "status", "description", "name", "program", "topic", "email", "year", "category", "targetYear"]);
  const isRequired = requiredFields.has(field) && !["image", "link", "objectives", "publications", "impact", "sortOrder"].includes(field);
  const isImageField = field === "image";
  const imagePattern = isImageField ? "(^/.*|https?://.*)" : undefined;
  const imageTitle = isImageField ? "Use a relative path starting with / or an absolute URL starting with http:// or https://" : undefined;

  return (
    <label className={isLong ? "md:col-span-2" : ""}>
      <span className="block text-sm font-semibold text-slate-700">{label}{isRequired ? " *" : ""}</span>
      {isLong ? (
        <textarea
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          rows={field === "description" ? 4 : 5}
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder={field === "objectives" || field === "topics" ? "One item per line" : undefined}
          required={isRequired}
        />
      ) : isStatusSelect ? (
        <select
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          required={isRequired}
        >
          <option>Active</option>
          <option>In Progress</option>
          <option>Published</option>
          <option>Completed</option>
        </select>
      ) : (
        <input
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type={["year", "sortOrder", "publications"].includes(field) ? "number" : "text"}
          required={isRequired}
          min={field === "year" || field === "sortOrder" || field === "publications" ? 0 : undefined}
          pattern={imagePattern}
          title={imageTitle}
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
