import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Plus, RefreshCw, Search, Users, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["planned", "active", "completed", "archived"];
const blankEvent = { name: "", slug: "", description: "", starts_on: "", ends_on: "", location: "", status: "planned" };
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function dateLabel(value) {
  if (!value) return "Date not set";
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(parsed);
}

function statusStyle(status) {
  const style = {
    planned: "bg-blue-50 text-blue-700",
    active: "bg-emerald-50 text-emerald-700",
    completed: "bg-slate-100 text-slate-600",
    archived: "bg-amber-50 text-amber-700",
  };
  return style[status] || "bg-slate-100 text-slate-600";
}

export default function Events() {
  const { user, profile } = useAuth();
  const canManage = ["admin", "manager"].includes(profile?.role);
  const [events, setEvents] = useState([]);
  const [leadCounts, setLeadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankEvent);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("events")
      .select("id, name, slug, description, starts_on, ends_on, location, status, created_at, updated_at")
      .order("starts_on", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message || "Unable to load events.");
      setEvents([]);
      setLoading(false);
      return;
    }

    const rows = data || [];
    setEvents(rows);

    if (canManage && rows.length) {
      const { data: leadRows, error: countError } = await supabase
        .from("event_leads")
        .select("event_id");
      if (!countError) {
        const counts = {};
        (leadRows || []).forEach((row) => { counts[row.event_id] = (counts[row.event_id] || 0) + 1; });
        setLeadCounts(counts);
      }
    }
    setLoading(false);
  }, [canManage]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadEvents(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesSearch = !term || [event.name, event.slug, event.location, event.description].filter(Boolean).join(" ").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [events, search, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(blankEvent);
    setSlugTouched(false);
    setEditorOpen(true);
  }

  function openEdit(event) {
    setEditingId(event.id);
    setForm({
      name: event.name || "",
      slug: event.slug || "",
      description: event.description || "",
      starts_on: event.starts_on || "",
      ends_on: event.ends_on || "",
      location: event.location || "",
      status: event.status || "planned",
    });
    setSlugTouched(true);
    setEditorOpen(true);
  }

  function changeName(value) {
    setForm((current) => ({ ...current, name: value, slug: slugTouched ? current.slug : makeSlug(value) }));
  }

  async function saveEvent(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    const name = form.name.trim();
    const slug = makeSlug(form.slug);
    if (!name || !slug) {
      setError("Enter an event name and URL slug.");
      return;
    }
    if (form.starts_on && form.ends_on && form.ends_on < form.starts_on) {
      setError("The event end date cannot be before the start date.");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      slug,
      description: form.description.trim() || null,
      starts_on: form.starts_on || null,
      ends_on: form.ends_on || null,
      location: form.location.trim() || null,
      status: form.status,
    };

    const result = editingId
      ? await supabase.from("events").update(payload).eq("id", editingId).select().single()
      : await supabase.from("events").insert({ ...payload, created_by: user?.id || null }).select().single();

    if (result.error) {
      setError(result.error.message || "Unable to save event.");
    } else {
      setNotice(editingId ? "Event updated successfully." : "Event created successfully.");
      setEditorOpen(false);
      await loadEvents();
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Event operations</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">Special Events</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Create and manage Ankvidhya workshops, stalls, exhibitions and other special events. Each event keeps its enquiries linked to the event record.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void loadEvents()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
          {canManage && <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624]"><Plus size={16} /> Create event</button>}
        </div>
      </div>

      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total events", events.length],
          ["Active", events.filter((item) => item.status === "active").length],
          ["Planned", events.filter((item) => item.status === "planned").length],
          ["Event enquiries", Object.values(leadCounts).reduce((sum, count) => sum + count, 0)],
        ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-[#182131]">{loading ? "—" : value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event name, location or slug" className={`${inputClass} pl-10`} /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}><option value="all">All statuses</option>{STATUSES.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select>
        </div>
      </div>

      {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-slate-400"><RefreshCw size={17} className="mr-2 animate-spin" /> Loading events...</div> : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><CalendarDays size={30} className="mx-auto text-slate-300" /><h2 className="mt-3 font-bold text-[#182131]">No events found</h2><p className="mt-1 text-sm text-slate-500">Create your first special event to start collecting event enquiries.</p>{canManage && <button onClick={openCreate} className="mt-4 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white">Create event</button>}</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredEvents.map((event) => (
            <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0"><h2 className="break-words text-lg font-extrabold text-[#182131]">{event.name}</h2><p className="mt-1 text-xs text-slate-400">/{event.slug}</p></div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${statusStyle(event.status)}`}>{event.status}</span>
              </div>
              {event.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{event.description}</p>}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{dateLabel(event.starts_on)}{event.ends_on && event.ends_on !== event.starts_on ? ` – ${dateLabel(event.ends_on)}` : ""}</span>
                {event.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{event.location}</span>}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Link to={`/admin/event-leads?event=${event.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#DB1D2D] hover:underline"><Users size={16} /> {leadCounts[event.id] ?? "View"} enquiries</Link>
                {canManage && <button onClick={() => openEdit(event)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Edit event</button>}
              </div>
            </article>
          ))}
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-[#101827]/50" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
          <form onSubmit={saveEvent} className="flex h-full w-full max-w-xl flex-col bg-[#F7F8FA] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#DB1D2D]">Event details</p><h2 className="mt-1 text-xl font-extrabold text-[#182131]">{editingId ? "Edit event" : "Create event"}</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500" aria-label="Close"><X size={18} /></button></div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div><label className={labelClass}>Event name *</label><input required value={form.name} onChange={(event) => changeName(event.target.value)} className={inputClass} placeholder="e.g. Ankvidhya Mathematics Workshop" /></div>
              <div><label className={labelClass}>URL slug *</label><input required value={form.slug} onChange={(event) => { setSlugTouched(true); setForm((current) => ({ ...current, slug: event.target.value })); }} className={inputClass} placeholder="ankvidhya-mathematics-workshop" /><p className="mt-1 text-[11px] text-slate-400">Used as a unique event identifier in URLs.</p></div>
              <div><label className={labelClass}>Description</label><textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="Describe this event..." /></div>
              <div className="grid gap-3 sm:grid-cols-2"><div><label className={labelClass}>Starts on</label><input type="date" value={form.starts_on} onChange={(event) => setForm((current) => ({ ...current, starts_on: event.target.value }))} className={inputClass} /></div><div><label className={labelClass}>Ends on</label><input type="date" min={form.starts_on || undefined} value={form.ends_on} onChange={(event) => setForm((current) => ({ ...current, ends_on: event.target.value }))} className={inputClass} /></div></div>
              <div><label className={labelClass}>Location</label><input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className={inputClass} placeholder="City, venue or online" /></div>
              <div><label className={labelClass}>Status</label><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className={inputClass}>{STATUSES.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></div>
            </div>
            <div className="border-t border-slate-200 bg-white p-5"><button type="submit" disabled={saving || !canManage} className="w-full rounded-xl bg-[#DB1D2D] px-4 py-3 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save event changes" : "Create event"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
