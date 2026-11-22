import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category_id: "",
  short_description: "",
  description: "",
  delivery_mode: "both",
  age_min: "",
  age_max: "",
  duration_label: "",
  fee_amount: "",
  currency: "INR",
  is_featured: false,
  is_published: false,
  display_order: "0",
  meta_title: "",
  meta_description: "",
};

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value, currency = "INR") {
  if (value === null || value === undefined || value === "") return "Not set";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "INR"} ${amount}`;
  }
}

function courseToForm(course) {
  return {
    ...EMPTY_FORM,
    ...course,
    category_id: course.category_id || "",
    age_min: course.age_min ?? "",
    age_max: course.age_max ?? "",
    fee_amount: course.fee_amount ?? "",
    display_order: course.display_order ?? 0,
  };
}

export default function Courses() {
  const { user, profile } = useAuth();
  const canManage = ["admin", "manager"].includes(profile?.role);

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadCourses = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [courseResult, categoryResult] = await Promise.all([
        supabase.from("courses").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }),
        supabase.from("course_categories").select("id, name, is_active").order("display_order", { ascending: true }),
      ]);

      if (courseResult.error) throw courseResult.error;
      if (categoryResult.error) throw categoryResult.error;

      setCourses(courseResult.data || []);
      setCategories(categoryResult.data || []);
    } catch (loadError) {
      console.error("Course loading error:", loadError);
      setError(loadError.message || "Unable to load courses.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) void loadCourses();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [loadCourses]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((course) => {
      const category = categories.find((item) => item.id === course.category_id);
      const matchesSearch = !term || [course.title, course.slug, course.short_description, category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
      const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? course.is_published : !course.is_published);
      const matchesMode = modeFilter === "all" || course.delivery_mode === modeFilter;
      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [courses, categories, search, statusFilter, modeFilter]);

  function openCreate() {
    setEditingCourse(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(course) {
    setEditingCourse(course);
    setForm(courseToForm(course));
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingCourse(null);
    setForm(EMPTY_FORM);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveCourse(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const title = form.title.trim();
    const slug = makeSlug(form.slug || title);
    if (!title) {
      setError("Please enter a course title.");
      return;
    }
    if (!slug) {
      setError("Please enter a valid course URL slug using English letters or numbers.");
      return;
    }

    const ageMin = form.age_min === "" ? null : Number(form.age_min);
    const ageMax = form.age_max === "" ? null : Number(form.age_max);
    const feeAmount = form.fee_amount === "" ? null : Number(form.fee_amount);
    if ((ageMin !== null && (!Number.isInteger(ageMin) || ageMin < 0)) || (ageMax !== null && (!Number.isInteger(ageMax) || ageMax < 0))) {
      setError("Minimum and maximum ages must be non-negative whole numbers.");
      return;
    }
    if (ageMin !== null && ageMax !== null && ageMax < ageMin) {
      setError("Maximum age cannot be lower than minimum age.");
      return;
    }
    if (feeAmount !== null && (!Number.isFinite(feeAmount) || feeAmount < 0)) {
      setError("Please enter a valid non-negative course fee.");
      return;
    }

    const payload = {
      title,
      slug,
      category_id: form.category_id || null,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      delivery_mode: form.delivery_mode,
      age_min: ageMin,
      age_max: ageMax,
      duration_label: form.duration_label.trim() || null,
      fee_amount: feeAmount,
      currency: (form.currency || "INR").toUpperCase(),
      is_featured: Boolean(form.is_featured),
      is_published: Boolean(form.is_published),
      display_order: Number.isInteger(Number(form.display_order)) ? Number(form.display_order) : 0,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
    };

    setSaving(true);
    try {
      let result;
      if (editingCourse) {
        result = await supabase.from("courses").update(payload).eq("id", editingCourse.id).select("*").single();
      } else {
        result = await supabase.from("courses").insert({ ...payload, created_by: user?.id || null }).select("*").single();
      }
      if (result.error) throw result.error;

      if (editingCourse) {
        setCourses((current) => current.map((course) => course.id === result.data.id ? result.data : course));
        setNotice("Course updated successfully.");
      } else {
        setCourses((current) => [result.data, ...current]);
        setNotice("Course created successfully.");
      }
      setModalOpen(false);
      setEditingCourse(null);
      setForm(EMPTY_FORM);
    } catch (saveError) {
      console.error("Course save error:", saveError);
      setError(saveError.message || "Unable to save the course. Check permissions and required fields.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(course) {
    if (!canManage) return;
    const nextValue = !course.is_published;
    try {
      const { data, error: updateError } = await supabase
        .from("courses")
        .update({ is_published: nextValue })
        .eq("id", course.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setCourses((current) => current.map((item) => item.id === data.id ? data : item));
      setNotice(nextValue ? "Course published." : "Course unpublished.");
    } catch (updateError) {
      setError(updateError.message || "Unable to change publishing status.");
    }
  }

  const publishedCount = courses.filter((course) => course.is_published).length;
  const draftCount = courses.length - publishedCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Academic catalogue</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">Course Management</h1>
          <p className="mt-2 text-sm text-slate-500">Create, update and publish Ankvidhya learning programs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadCourses(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          {canManage && <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624]">
            <Plus size={17} /> Add course
          </button>}
        </div>
      </div>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span className="break-words">{error}</span></div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-[#182131]">{loading ? "—" : courses.length}</p><p className="mt-1 text-sm font-semibold text-slate-600">Total courses</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-emerald-700">{loading ? "—" : publishedCount}</p><p className="mt-1 text-sm font-semibold text-slate-600">Published</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-amber-700">{loading ? "—" : draftCount}</p><p className="mt-1 text-sm font-semibold text-slate-600">Drafts</p></div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_190px_170px]">
          <div className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search course title, slug or description" className={inputClass + " pl-10"} /></div>
          <select aria-label="Filter course status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select>
          <select aria-label="Filter delivery mode" value={modeFilter} onChange={(event) => setModeFilter(event.target.value)} className={inputClass}><option value="all">All delivery modes</option><option value="online">Online</option><option value="offline">Offline</option><option value="both">Online & offline</option></select>
        </div>

        {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-slate-400"><RefreshCw size={17} className="mr-2 animate-spin" /> Loading courses...</div> : filteredCourses.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><BookOpen size={22} /></div><h2 className="mt-4 font-bold text-[#182131]">No courses found</h2><p className="mt-1 text-sm text-slate-500">There are no courses matching these filters.</p>{canManage && <button onClick={openCreate} className="mt-4 rounded-xl bg-[#182131] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#DB1D2D]">Create your first course</button>}</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[850px] text-left"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Course</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Delivery</th><th className="px-5 py-3">Fee</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredCourses.map((course) => <tr key={course.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-bold text-[#182131]">{course.title}</p><p className="mt-1 text-xs text-slate-400">/{course.slug}</p></td><td className="px-5 py-4 text-sm text-slate-600">{categories.find((category) => category.id === course.category_id)?.name || "Uncategorised"}</td><td className="px-5 py-4 text-sm capitalize text-slate-600">{String(course.delivery_mode || "both").replace(/_/g, " ")}</td><td className="px-5 py-4 text-sm text-slate-600">{formatPrice(course.fee_amount, course.currency)}</td><td className="px-5 py-4"><span className={"rounded-full px-2.5 py-1 text-[11px] font-bold " + (course.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{course.is_published ? "Published" : "Draft"}</span>{course.is_featured && <span className="ml-1.5 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">Featured</span>}</td><td className="px-5 py-4"><div className="flex justify-end gap-1.5">{canManage && <><button type="button" onClick={() => void togglePublished(course)} title={course.is_published ? "Unpublish" : "Publish"} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">{course.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button><button type="button" onClick={() => openEdit(course)} title="Edit course" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-[#DB1D2D]"><Edit3 size={16} /></button></>}</div></td></tr>)}</tbody></table></div>
            <div className="divide-y divide-slate-100 md:hidden">{filteredCourses.map((course) => <div key={course.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold text-[#182131]">{course.title}</p><p className="mt-1 text-xs text-slate-400">{categories.find((category) => category.id === course.category_id)?.name || "Uncategorised"} · {String(course.delivery_mode || "both").replace(/_/g, " ")}</p></div><span className={"shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold " + (course.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{course.is_published ? "Published" : "Draft"}</span></div><div className="mt-3 flex items-center justify-between"><p className="text-sm font-semibold text-slate-600">{formatPrice(course.fee_amount, course.currency)}</p>{canManage && <div className="flex gap-2"><button type="button" onClick={() => void togglePublished(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600">{course.is_published ? <EyeOff size={15} /> : <Eye size={15} />}</button><button type="button" onClick={() => openEdit(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600"><Edit3 size={15} /></button></div>}</div></div>)}</div>
          </>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#101827]/60 p-3 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">Course catalogue</p><h2 className="mt-1 text-xl font-extrabold text-[#182131]">{editingCourse ? "Edit course" : "Add new course"}</h2></div><button type="button" onClick={closeModal} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close form"><X size={19} /></button></div>
            <form onSubmit={saveCourse} className="space-y-5 p-5 sm:p-6">
              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className={labelClass}>Course title *</label><input name="title" value={form.title} onChange={updateField} required className={inputClass} placeholder="e.g. Ank Aryabhatta" /></div>
                <div><label className={labelClass}>URL slug</label><input name="slug" value={form.slug} onChange={updateField} className={inputClass} placeholder="ank-aryabhatta (auto from title)" /></div>
                <div><label className={labelClass}>Category</label><select name="category_id" value={form.category_id} onChange={updateField} className={inputClass}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.is_active === false ? " (inactive)" : ""}</option>)}</select></div>
                <div><label className={labelClass}>Delivery mode</label><select name="delivery_mode" value={form.delivery_mode} onChange={updateField} className={inputClass}><option value="online">Online</option><option value="offline">Offline</option><option value="both">Online & offline</option></select></div>
                <div><label className={labelClass}>Duration label</label><input name="duration_label" value={form.duration_label} onChange={updateField} className={inputClass} placeholder="e.g. 12 months" /></div>
                <div><label className={labelClass}>Minimum age</label><input name="age_min" type="number" min="0" step="1" value={form.age_min} onChange={updateField} className={inputClass} /></div>
                <div><label className={labelClass}>Maximum age</label><input name="age_max" type="number" min="0" step="1" value={form.age_max} onChange={updateField} className={inputClass} /></div>
                <div><label className={labelClass}>Course fee</label><input name="fee_amount" type="number" min="0" step="0.01" value={form.fee_amount} onChange={updateField} className={inputClass} placeholder="Leave blank if not decided" /></div>
                <div><label className={labelClass}>Currency</label><input name="currency" maxLength="3" value={form.currency} onChange={updateField} className={inputClass} /></div>
                <div><label className={labelClass}>Display order</label><input name="display_order" type="number" step="1" value={form.display_order} onChange={updateField} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Short description</label><textarea name="short_description" rows={2} value={form.short_description} onChange={updateField} className={inputClass + " resize-y"} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Full description</label><textarea name="description" rows={4} value={form.description} onChange={updateField} className={inputClass + " resize-y"} /></div>
                <div className="sm:col-span-2 rounded-xl bg-slate-50 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Website visibility</p><div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="is_featured" checked={Boolean(form.is_featured)} onChange={updateField} className="h-4 w-4 accent-[#DB1D2D]" /> Featured course</label><label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="is_published" checked={Boolean(form.is_published)} onChange={updateField} className="h-4 w-4 accent-[#DB1D2D]" /> Published on website</label></div></div>
                <div><label className={labelClass}>SEO title</label><input name="meta_title" value={form.meta_title} onChange={updateField} className={inputClass} /></div>
                <div><label className={labelClass}>SEO description</label><textarea name="meta_description" rows={2} value={form.meta_description} onChange={updateField} className={inputClass + " resize-y"} /></div>
              </div>
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row"><button type="button" onClick={closeModal} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-[#DB1D2D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-60">{saving ? "Saving..." : editingCourse ? "Save changes" : "Create course"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
