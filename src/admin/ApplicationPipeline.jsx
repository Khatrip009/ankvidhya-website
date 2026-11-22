import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ApplicationPipeline({ config }) {
  const { profile } = useAuth();
  const canManage = ["admin", "manager"].includes(profile?.role);
  const [records, setRecords] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ status: "new", assigned_to: "", internal_notes: "" });

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [recordResult, staffResult] = await Promise.all([
        supabase.from(config.table).select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("profiles").select("id, full_name, email, role, is_active").eq("is_active", true).order("full_name"),
      ]);
      if (recordResult.error) throw recordResult.error;
      setRecords(recordResult.data || []);
      if (!staffResult.error) setStaff(staffResult.data || []);
    } catch (loadError) {
      console.error(`${config.title} loading error:`, loadError);
      setError(loadError.message || `Unable to load ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [config.table, config.title]);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadRecords();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      config.searchFields
        .map((field) => record[field])
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [records, search, config.searchFields]);

  function openRecord(record) {
    setSelected(record);
    setDraft({
      status: record.status || config.statuses[0].value,
      assigned_to: record.assigned_to || "",
      internal_notes: record.internal_notes || "",
    });
  }

  async function saveRecord(event) {
    event.preventDefault();
    if (!selected || !canManage) return;
    setSaving(true);
    setNotice("");
    try {
      const { data, error: updateError } = await supabase
        .from(config.table)
        .update({
          status: draft.status,
          assigned_to: draft.assigned_to || null,
          internal_notes: draft.internal_notes.trim() || null,
        })
        .eq("id", selected.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setRecords((current) => current.map((record) => (record.id === data.id ? data : record)));
      setSelected(data);
      setNotice("Record updated successfully.");
    } catch (updateError) {
      console.error(`${config.title} update error:`, updateError);
      setNotice(updateError.message || "Unable to update this record.");
    } finally {
      setSaving(false);
    }
  }

  const counts = config.statuses.map((status) => ({
    ...status,
    count: records.filter((record) => record.status === status.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Partnership pipeline</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">{config.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{config.description}</p>
        </div>
        <button
          onClick={() => void loadRecords()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{notice}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-extrabold text-[#182131]">{loading ? "—" : records.length}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Total records</p>
        </div>
        {counts.map((item) => (
          <div key={item.value} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-2xl font-extrabold text-[#182131]">{loading ? "—" : item.count}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="relative max-w-xl">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={config.searchPlaceholder} className={inputClass + " pl-10"} />
          </div>
          <p className="mt-3 text-xs text-slate-400">Showing {filteredRecords.length} records</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={25} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-[#182131]">No records found</p>
            <p className="mt-1 text-sm text-slate-400">New records will appear here when a matching enquiry is qualified.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    {config.columns.map((column) => <th key={column.field} className="px-5 py-3">{column.label}</th>)}
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Assigned to</th>
                    <th className="px-5 py-3">Received</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80">
                      {config.columns.map((column) => <td key={column.field} className="px-5 py-4 text-sm text-slate-600">{record[column.field] || "—"}</td>)}
                      <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">{String(record.status || "new").replace(/_/g, " ")}</span></td>
                      <td className="px-5 py-4 text-sm text-slate-500">{staff.find((person) => person.id === record.assigned_to)?.full_name || "Unassigned"}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{formatDate(record.created_at)}</td>
                      <td className="px-5 py-4 text-right"><button onClick={() => openRecord(record)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-[#DB1D2D]" aria-label="Open record"><ArrowRight size={17} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredRecords.map((record) => (
                <button key={record.id} onClick={() => openRecord(record)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#182131]">{record[config.columns[0].field] || "Unnamed record"}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{record[config.columns[1]?.field] || "—"}</p>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-600">{String(record.status || "new").replace(/_/g, " ")}</span>
                  </div>
                  <ArrowRight size={17} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-[#101827]/50 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <aside className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#F7F8FA] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">Application record</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#182131]">{selected[config.columns[0].field] || config.title}</h2>
                <p className="mt-1 text-xs text-slate-400">Received {formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50" aria-label="Close details"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application details</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {config.detailFields.map((field) => (
                    <div key={field.field}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{field.label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-700">{selected[field.field] == null || selected[field.field] === "" ? "—" : typeof selected[field.field] === "boolean" ? (selected[field.field] ? "Yes" : "No") : String(selected[field.field])}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={saveRecord} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-[#182131]">Manage application</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Pipeline status</label>
                    <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} disabled={!canManage} className={inputClass}>
                      {config.statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Assigned to</label>
                    <select value={draft.assigned_to} onChange={(event) => setDraft((current) => ({ ...current, assigned_to: event.target.value }))} disabled={!canManage} className={inputClass}>
                      <option value="">Unassigned</option>
                      {staff.map((person) => <option key={person.id} value={person.id}>{person.full_name || person.email || person.id.slice(0, 8)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Internal notes</label>
                    <textarea rows={4} value={draft.internal_notes} onChange={(event) => setDraft((current) => ({ ...current, internal_notes: event.target.value }))} disabled={!canManage} placeholder="Record internal discussion or next steps..." className={inputClass + " resize-y disabled:bg-slate-50"} />
                  </div>
                </div>
                {canManage ? (
                  <button type="submit" disabled={saving} className="mt-4 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-60">{saving ? "Saving..." : "Save application"}</button>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">Your account can view this application but cannot change it.</p>
                )}
              </form>

              {selected.lead_id && (
                <Link to={`/admin/crm?lead=${selected.lead_id}`} onClick={() => setSelected(null)} className="flex items-center justify-between rounded-2xl bg-[#182131] p-4 text-sm font-bold text-white hover:bg-[#DB1D2D]">
                  <span className="inline-flex items-center gap-2"><UserRound size={16} /> Open linked CRM lead</span>
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
