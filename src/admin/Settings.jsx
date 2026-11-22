import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff, Plus, RefreshCw, Save, Settings as SettingsIcon, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

function prettyValue(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "null");
  }
}

function shortValue(value) {
  const text = typeof value === "string" ? value : prettyValue(value);
  return text.length > 100 ? `${text.slice(0, 100)}…` : text;
}

export default function Settings() {
  const { profile } = useAuth();
  const canManage = ["admin", "manager"].includes(profile?.role);
  const isAdmin = profile?.role === "admin";

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [form, setForm] = useState({ key: "", valueJson: '""', is_public: false, description: "" });

  const loadSettings = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await supabase
        .from("site_settings")
        .select("key, value, is_public, description, updated_at")
        .order("key", { ascending: true });
      if (queryError) throw queryError;
      setSettings(data || []);
    } catch (queryError) {
      console.error("Settings loading error:", queryError);
      setError(queryError.message || "Unable to load site settings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) void loadSettings();
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [loadSettings]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openCreate() {
    setEditingKey(null);
    setForm({ key: "", valueJson: '""', is_public: false, description: "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(setting) {
    setEditingKey(setting.key);
    setForm({
      key: setting.key,
      valueJson: prettyValue(setting.value),
      is_public: Boolean(setting.is_public),
      description: setting.description || "",
    });
    setError("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingKey(null);
  }

  async function saveSetting(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const key = form.key.trim().toLowerCase().replace(/\s+/g, "_");
    if (!/^[a-z0-9_]+$/.test(key)) {
      setError("Use only lowercase English letters, numbers and underscores for the setting key.");
      return;
    }
    let parsedValue;
    try {
      parsedValue = JSON.parse(form.valueJson);
    } catch {
      setError("The Value must be valid JSON. Text values need double quotes, for example: \"+91 63577 85778\".");
      return;
    }

    if (!canManage) {
      setError("Your role does not have permission to update site settings.");
      return;
    }

    setSaving(true);
    try {
      if (editingKey && key !== editingKey) {
        setError("Setting keys cannot be renamed. Create a new setting with the new key instead.");
        setSaving(false);
        return;
      }

      const payload = {
        key,
        value: parsedValue,
        is_public: Boolean(form.is_public),
        description: form.description.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });
      if (saveError) throw saveError;

      setNotice(editingKey ? "Setting updated." : "Setting created.");
      setModalOpen(false);
      setEditingKey(null);
      await loadSettings(true);
    } catch (saveError) {
      console.error("Settings save error:", saveError);
      setError(saveError.message || "Unable to save the setting.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSetting(setting) {
    if (!isAdmin) return;
    const confirmed = window.confirm(`Delete the setting “${setting.key}”? This cannot be undone.`);
    if (!confirmed) return;
    setError("");
    try {
      const { error: deleteError } = await supabase.from("site_settings").delete().eq("key", setting.key);
      if (deleteError) throw deleteError;
      setSettings((current) => current.filter((item) => item.key !== setting.key));
      setNotice(`Deleted setting: ${setting.key}`);
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete the setting.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Website configuration</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">Site Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage public contact information and other website configuration values stored in Supabase.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadSettings(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh</button>
          {canManage && <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624]"><Plus size={17} /> Add setting</button>}
        </div>
      </div>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span className="break-words">{error}</span></div>}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <p className="font-bold">Keep secrets out of Site Settings</p>
        <p className="mt-1">Only mark information as Public when it is safe to display on the website. Never store passwords, API keys, Supabase service-role keys or payment secrets here.</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-[#182131]">Configuration records</h2><p className="mt-1 text-xs text-slate-400">{settings.length} settings visible to your account</p></div><div className="flex items-center gap-1.5 text-xs text-slate-400"><SettingsIcon size={15} /> Supabase</div></div>
        {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-slate-400"><RefreshCw size={17} className="mr-2 animate-spin" /> Loading settings...</div> : settings.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><SettingsIcon size={22} /></div><h3 className="mt-4 font-bold text-[#182131]">No settings found</h3><p className="mt-1 max-w-md text-sm text-slate-500">The site_settings table is empty, or your account can only see public settings. Add your first website setting to get started.</p>{canManage && <button type="button" onClick={openCreate} className="mt-4 rounded-xl bg-[#182131] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#DB1D2D]">Add first setting</button>}</div>
        ) : (
          <div className="divide-y divide-slate-100">{settings.map((setting) => <div key={setting.key} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:px-5"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><code className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-[#182131]">{setting.key}</code>{setting.is_public ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700"><Eye size={12} /> Public</span> : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"><EyeOff size={12} /> Private</span>}</div><p className="mt-2 break-words text-sm text-slate-700">{shortValue(setting.value)}</p>{setting.description && <p className="mt-1 text-xs text-slate-400">{setting.description}</p>}<p className="mt-1 text-[10px] text-slate-400">Updated: {setting.updated_at ? new Date(setting.updated_at).toLocaleString("en-IN") : "—"}</p></div>{canManage && <div className="flex shrink-0 gap-2"><button type="button" onClick={() => openEdit(setting)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Edit</button>{isAdmin && <button type="button" onClick={() => void deleteSetting(setting)} aria-label={`Delete ${setting.key}`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>}</div>}</div>)}</div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#101827]/60 p-3 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div className="my-8 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">Website configuration</p><h2 className="mt-1 text-xl font-extrabold text-[#182131]">{editingKey ? "Edit setting" : "Add setting"}</h2></div><button type="button" onClick={closeModal} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={19} /></button></div>
            <form onSubmit={saveSetting} className="space-y-4 p-5">
              <div><label className={labelClass}>Setting key *</label><input name="key" value={form.key} onChange={updateField} disabled={Boolean(editingKey)} required className={inputClass} placeholder="e.g. contact_phone, contact_email, whatsapp_url" /><p className="mt-1 text-[11px] text-slate-400">Use lowercase letters, numbers and underscores.</p></div>
              <div><label className={labelClass}>Value (JSON) *</label><textarea name="valueJson" rows={6} value={form.valueJson} onChange={updateField} required spellCheck={false} className={inputClass + " resize-y font-mono text-xs"} placeholder={'"+91 63577 85778"'} /><p className="mt-1 text-[11px] text-slate-400">Text must be inside double quotes. Objects and arrays are also supported.</p></div>
              <div><label className={labelClass}>Description</label><input name="description" value={form.description} onChange={updateField} className={inputClass} placeholder="What is this setting used for?" /></div>
              <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><input type="checkbox" name="is_public" checked={form.is_public} onChange={updateField} className="mt-0.5 h-4 w-4 accent-[#DB1D2D]" /><span><span className="font-semibold">Public setting</span><span className="mt-0.5 block text-xs text-slate-500">Allow the public website to read this value. Do not enable for confidential information.</span></span></label>
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row"><button type="button" onClick={closeModal} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-60"><Save size={15} /> {saving ? "Saving..." : "Save setting"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
