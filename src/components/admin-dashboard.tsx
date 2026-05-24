"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { resources, type ResourceName } from "@/lib/admin-resources";

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
    sortOrder: 0
  },
  research: {
    title: "",
    description: "",
    topics: "",
    sortOrder: 0
  },
  patents: {
    title: "",
    inventors: "",
    status: "Filed",
    year: new Date().getFullYear(),
    description: "",
    link: "",
    sortOrder: 0
  },
  students: {
    name: "",
    program: "",
    topic: "",
    status: "Current",
    email: "",
    image: "",
    sortOrder: 0
  },
  goals: {
    title: "",
    category: "",
    description: "",
    targetYear: "",
    status: "Active",
    sortOrder: 0
  }
};

export function AdminDashboard({ email, initialData }: { email: string; initialData: DataMap }) {
  const router = useRouter();
  const [active, setActive] = useState<ResourceName>("projects");
  const [data, setData] = useState<DataMap>(initialData);
  const [draft, setDraft] = useState<Item>(emptyItem.projects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const activeItems = data[active] || [];
  const fields = resources[active].fields;

  const title = useMemo(() => (editingId ? "Edit entry" : "Add entry"), [editingId]);

  function changeResource(resource: ResourceName) {
    setActive(resource);
    setEditingId(null);
    setDraft(emptyItem[resource]);
    setMessage("");
  }

  function edit(item: Item) {
    setEditingId(String(item.id));
    setDraft(toDraft(active, item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`/api/admin/${active}${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (!response.ok) {
      setMessage("Could not save. Please check required fields.");
      return;
    }
    const saved = await response.json();
    setData((current) => ({
      ...current,
      [active]: editingId ? current[active].map((item) => (item.id === editingId ? saved : item)) : [saved, ...current[active]]
    }));
    setDraft(emptyItem[active]);
    setEditingId(null);
    setMessage("Saved successfully.");
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/${active}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete this entry.");
      return;
    }
    setData((current) => ({ ...current, [active]: current[active].filter((item) => item.id !== id) }));
    setMessage("Deleted successfully.");
    router.refresh();
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
            <a href="/" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View site</a>
            <button onClick={logout} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Logout</button>
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
                active === resource ? "bg-navy text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {resources[resource].label}
              <span className={active === resource ? "text-white/75" : "text-slate-400"}>{data[resource]?.length || 0}</span>
            </button>
          ))}
        </aside>

        <section className="grid gap-6">
          <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">{title}</h2>
                <p className="mt-1 text-sm text-slate-600">{resources[active].label} content is stored in the database.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyItem[active]);
                }}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <FieldInput
                  key={field}
                  field={field}
                  value={draft[field]}
                  onChange={(value) => setDraft((current) => ({ ...current, [field]: value }))}
                />
              ))}
            </div>

            {message ? <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{message}</p> : null}
            <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d5557]">
              <Save className="h-4 w-4" />
              Save
            </button>
          </form>

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
                    <button onClick={() => remove(String(item.id))} className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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

function FieldInput({ field, value, onChange }: { field: string; value: unknown; onChange: (value: string) => void }) {
  const isLong = ["description", "objectives", "topics"].includes(field);
  const label = field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
  const normalized = Array.isArray(value) ? value.join("\n") : String(value ?? "");

  return (
    <label className={isLong ? "md:col-span-2" : ""}>
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      {isLong ? (
        <textarea
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          rows={field === "description" ? 4 : 5}
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder={field === "objectives" || field === "topics" ? "One item per line" : undefined}
        />
      ) : (
        <input
          value={normalized}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type={["year", "sortOrder", "publications"].includes(field) ? "number" : "text"}
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
