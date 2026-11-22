import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDownToLine, ArrowRight, CheckCircle2, ExternalLink, Filter, RefreshCw, Search, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const PRIORITIES = ["Hot", "Warm", "Nurture", "Feedback only"];
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

function dateLabel(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function priorityStyle(value) {
  const styles = {
    Hot: "bg-red-100 text-red-700",
    Warm: "bg-orange-50 text-orange-700",
    Nurture: "bg-blue-50 text-blue-700",
    "Feedback only": "bg-slate-100 text-slate-600",
  };
  return styles[value] || "bg-slate-100 text-slate-600";
}

function valueLabel(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  if (value === true) return "Yes";
  if (value === false) return "No";
  return value == null || value === "" ? "—" : String(value);
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function EventLeads() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(searchParams.get("event") || "all");
  const [formFilter, setFormFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [confirmContact, setConfirmContact] = useState(false);
  const [converting, setConverting] = useState(false);
  const canConvert = ["admin", "manager"].includes(profile?.role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    const [eventResult, leadResult] = await Promise.all([
      supabase.from("events").select("id, name, slug, starts_on, status").order("starts_on", { ascending: false, nullsFirst: false }),
      supabase.from("event_leads").select("*").order("submitted_at", { ascending: false }).limit(1000),
    ]);
    if (eventResult.error || leadResult.error) {
      const failure = eventResult.error || leadResult.error;
      setError(failure.message || "Unable to load event enquiries.");
      setEvents(eventResult.data || []);
      setRows([]);
    } else {
      setEvents(eventResult.data || []);
      setRows(leadResult.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const eventById = useMemo(() => Object.fromEntries(events.map((event) => [event.id, event])), [events]);
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const event = eventById[row.event_id];
      const matchesEvent = eventFilter === "all" || row.event_id === eventFilter;
      const matchesForm = formFilter === "all" || row.form_type === formFilter;
      const matchesPriority = priorityFilter === "all" || row.lead_priority === priorityFilter;
      const searchable = [row.full_name, row.email, row.phone, row.city, row.organisation, row.role, row.lead_type, event?.name].filter(Boolean).join(" ").toLowerCase();
      return matchesEvent && matchesForm && matchesPriority && (!term || searchable.includes(term));
    });
  }, [rows, eventById, search, eventFilter, formFilter, priorityFilter]);

  function selectLead(row) {
    setSelected(row);
    setConfirmContact(false);
    const next = new URLSearchParams(searchParams);
    next.set("lead", row.id);
    if (row.event_id) next.set("event", row.event_id);
    setSearchParams(next);
  }

  function closeDetail() {
    setSelected(null);
    setConfirmContact(false);
    const next = new URLSearchParams(searchParams);
    next.delete("lead");
    setSearchParams(next);
  }

  async function convertToCrm() {
    if (!selected || !confirmContact || !canConvert) return;
    setConverting(true);
    setNotice("");
    const { data, error: convertError } = await supabase.rpc("convert_event_lead_to_crm", {
      p_event_lead_id: selected.id,
      p_confirm_contact: true,
    });
    if (convertError) {
      setNotice(convertError.message || "Unable to convert this event enquiry.");
    } else {
      const updated = { ...selected, converted_lead_id: data, converted_at: new Date().toISOString() };
      setSelected(updated);
      setRows((current) => current.map((row) => row.id === selected.id ? updated : row));
      setNotice("Event enquiry converted to the main CRM.");
    }
    setConverting(false);
  }

  function exportCsv() {
    const headers = ["Event", "Form type", "Name", "Email", "Phone", "City", "Organisation", "Role", "Lead priority", "Lead type", "Submitted", "Converted"];
    const values = filteredRows.map((row) => [eventById[row.event_id]?.name, row.form_type, row.full_name, row.email, row.phone, row.city, row.organisation, row.role, row.lead_priority, row.lead_type, row.submitted_at, row.converted_at]);
    const csv = [headers, ...values].map((line) => line.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ankvidhya-event-enquiries.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  const unconvertedCount = rows.filter((row) => !row.converted_lead_id && row.lead_priority !== "Feedback only").length;
  const convertedCount = rows.filter((row) => row.converted_lead_id).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Event engagement</p><h1 className="mt-2 text-3xl font-extrabold text-[#182131]">Event Leads & Enquiries</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review workshop and stall submissions, inspect attendee responses and move consented prospects into the main CRM.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><ArrowDownToLine size={16} /> Export CSV</button><button onClick={() => void loadData()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#182131] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#DB1D2D] disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>
      </div>
      {notice && <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button></div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Total event responses", rows.length], ["Not yet converted", unconvertedCount], ["Converted to CRM", convertedCount], ["Feedback only", rows.filter((row) => row.lead_priority === "Feedback only").length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-[#182131]">{loading ? "—" : value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="grid gap-2 lg:grid-cols-[1fr_190px_160px_180px]">
            <div className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, contact, city, role or event" className={`${inputClass} pl-10`} /></div>
            <select value={eventFilter} onChange={(event) => { setEventFilter(event.target.value); const next = new URLSearchParams(searchParams); if (event.target.value === "all") next.delete("event"); else next.set("event", event.target.value); setSearchParams(next); }} className={inputClass}><option value="all">All events</option>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select>
            <select value={formFilter} onChange={(event) => setFormFilter(event.target.value)} className={inputClass}><option value="all">All forms</option><option value="workshop">Workshop</option><option value="stall">Stall</option></select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className={inputClass}><option value="all">All priorities</option>{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><Filter size={13} /> {filteredRows.length} matching responses</span><button onClick={() => { setSearch(""); setEventFilter("all"); setFormFilter("all"); setPriorityFilter("all"); setSearchParams({}); }} className="font-bold text-[#DB1D2D] hover:underline">Clear filters</button></div>
        </div>

        {loading ? <div className="flex min-h-52 items-center justify-center text-sm text-slate-400"><RefreshCw size={16} className="mr-2 animate-spin" /> Loading event leads...</div> : filteredRows.length === 0 ? <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center"><Search size={28} className="text-slate-300" /><h2 className="mt-3 font-bold text-[#182131]">No event enquiries found</h2><p className="mt-1 text-sm text-slate-500">Responses will appear here when they are submitted for your events.</p></div> : (
          <>
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Attendee</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Form</th><th className="px-5 py-3">Priority</th><th className="px-5 py-3">Submitted</th><th className="px-5 py-3">CRM</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{filteredRows.map((row) => <tr key={row.id} className="hover:bg-slate-50"><td className="px-5 py-4"><button onClick={() => selectLead(row)} className="text-left"><p className="font-bold text-[#182131] hover:text-[#DB1D2D]">{row.full_name}</p><p className="mt-1 text-xs text-slate-400">{row.phone || row.email || "No contact detail"}</p></button></td><td className="px-5 py-4 text-sm text-slate-600">{eventById[row.event_id]?.name || "Unknown event"}</td><td className="px-5 py-4 text-xs capitalize text-slate-500">{row.form_type}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityStyle(row.lead_priority)}`}>{row.lead_priority}</span></td><td className="px-5 py-4 text-xs text-slate-500">{dateLabel(row.submitted_at)}</td><td className="px-5 py-4">{row.converted_lead_id ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><CheckCircle2 size={14} /> Converted</span> : <span className="text-xs text-slate-400">Not converted</span>}</td><td className="px-5 py-4 text-right"><button onClick={() => selectLead(row)} aria-label={`View ${row.full_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-[#DB1D2D]"><ArrowRight size={17} /></button></td></tr>)}</tbody></table></div>
            <div className="divide-y divide-slate-100 md:hidden">{filteredRows.map((row) => <button key={row.id} onClick={() => selectLead(row)} className="block w-full p-4 text-left hover:bg-slate-50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-bold text-[#182131]">{row.full_name}</p><p className="mt-1 truncate text-xs text-slate-400">{row.phone || row.email || "No contact detail"}</p></div><ArrowRight size={16} className="mt-1 shrink-0 text-slate-400" /></div><p className="mt-2 text-xs text-slate-500">{eventById[row.event_id]?.name || "Unknown event"} · {row.form_type}</p><div className="mt-2 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${priorityStyle(row.lead_priority)}`}>{row.lead_priority}</span>{row.converted_lead_id && <span className="text-[10px] font-bold text-emerald-700">Converted</span>}</div></button>)}</div>
          </>
        )}
      </section>

      {selected && <div className="fixed inset-0 z-[80] flex justify-end bg-[#101827]/50" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail(); }}><aside className="flex h-full w-full max-w-2xl flex-col bg-[#F7F8FA] shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-[#DB1D2D]">Event response · {selected.form_type}</p><h2 className="mt-1 truncate text-xl font-extrabold text-[#182131]">{selected.full_name}</h2><p className="mt-1 text-xs text-slate-400">{eventById[selected.event_id]?.name || "Unknown event"} · Submitted {dateLabel(selected.submitted_at)}</p></div><button onClick={closeDetail} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500" aria-label="Close"><X size={18} /></button></div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</p><div className="mt-3 space-y-2 text-sm text-slate-700">{selected.phone && <p>{selected.phone}</p>}{selected.email && <p className="break-all">{selected.email}</p>}<p>{[selected.city, selected.organisation].filter(Boolean).join(" · ") || "—"}</p></div></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile</p><div className="mt-3 space-y-2 text-sm text-slate-700"><p>Role: {valueLabel(selected.role)}{selected.role_other ? ` (${selected.role_other})` : ""}</p><p>Lead type: {valueLabel(selected.lead_type)}</p><p>Priority: <span className={`rounded-full px-2 py-1 text-xs font-bold ${priorityStyle(selected.lead_priority)}`}>{selected.lead_priority}</span></p><p>Rating: {valueLabel(selected.q7_rating)} / 5</p></div></div></div>
          <section className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="font-bold text-[#182131]">Workshop / stall responses</h3><dl className="mt-3 grid gap-3 sm:grid-cols-2">{[["Usefulness", selected.q8_usefulness], ["Valued most", selected.q9_valued], ["Recommendation", selected.q10_recommend], ["Interest", selected.q11_interest], ["School enquiry", selected.q12a_school], ["Centre enquiry", selected.q12b_centre], ["Online enquiry", selected.q12c_online], ["Contact preference", selected.q13_contact], ["Explore options", selected.q8_explore], ["Child grade", selected.child_grade], ["Second child grade", selected.child_grade_2], ["Source", selected.source]].map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-2"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{valueLabel(value)}</dd></div>)}</dl></section>
          {selected.raw_payload && <details className="rounded-2xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer text-sm font-bold text-[#182131]">Raw submitted payload</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">{JSON.stringify(selected.raw_payload, null, 2)}</pre></details>}
          <section className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="font-bold text-[#182131]">CRM conversion</h3>{selected.converted_lead_id ? <div className="mt-3 rounded-xl bg-emerald-50 p-3"><p className="flex items-center gap-2 text-sm font-bold text-emerald-800"><CheckCircle2 size={16} /> Already converted</p><p className="mt-1 break-all text-xs text-emerald-700">CRM lead ID: {selected.converted_lead_id}</p><button onClick={() => navigate(`/admin/crm?lead=${selected.converted_lead_id}`)} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline">Open CRM record <ExternalLink size={14} /></button></div> : selected.lead_priority === "Feedback only" ? <p className="mt-2 text-sm text-slate-500">This response is marked as feedback only, so it is not offered for sales-lead conversion.</p> : <><p className="mt-2 text-sm leading-6 text-slate-500">Convert this response into the central CRM so your team can assign an owner, record notes and schedule follow-ups. The original event response will remain linked and unchanged.</p><label className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-600"><input type="checkbox" checked={confirmContact} onChange={(event) => setConfirmContact(event.target.checked)} className="mt-0.5" /><span>I confirm that the attendee has given permission for Ankvidhya to contact them about this enquiry. This is required before adding the contact to the CRM.</span></label><button onClick={() => void convertToCrm()} disabled={!confirmContact || converting || !canConvert || (!selected.email && !selected.phone)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:cursor-not-allowed disabled:opacity-50">{converting ? "Converting..." : "Convert to CRM"} <ArrowRight size={15} /></button>{!selected.email && !selected.phone && <p className="mt-2 text-xs text-red-600">A phone number or email address is required to create a CRM lead.</p>}</>}</section>
        </div><div className="border-t border-slate-200 bg-white px-5 py-3 text-[10px] text-slate-400">Event response ID: <span className="font-mono">{selected.id}</span></div></aside></div>}
    </div>
  );
}
