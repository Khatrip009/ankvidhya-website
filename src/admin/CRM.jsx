import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const STAGES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const TYPES = [
  { value: "online_course", label: "Online course" },
  { value: "school_partnership", label: "School partnership" },
  { value: "franchise", label: "Franchise" },
  { value: "general", label: "General inquiry" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const ACTIVITY_TYPES = [
  { value: "call", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "task", label: "Task" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#182131] outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

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

function formatDateTime(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function optionLabel(options, value) {
  return options.find((item) => item.value === value)?.label || value || "—";
}

function stageClass(stage) {
  const styles = {
    new: "bg-blue-50 text-blue-700",
    contacted: "bg-violet-50 text-violet-700",
    follow_up: "bg-amber-50 text-amber-700",
    qualified: "bg-cyan-50 text-cyan-700",
    converted: "bg-emerald-50 text-emerald-700",
    closed: "bg-slate-100 text-slate-600",
  };
  return styles[stage] || "bg-slate-100 text-slate-600";
}

function priorityClass(priority) {
  const styles = {
    urgent: "bg-red-100 text-red-700",
    high: "bg-orange-50 text-orange-700",
    normal: "bg-slate-100 text-slate-600",
    low: "bg-slate-50 text-slate-500",
  };
  return styles[priority] || styles.normal;
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function CRM({ onlyNew = false }) {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState(onlyNew ? "new" : "all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [creatingLead, setCreatingLead] = useState(false);
  const [newLead, setNewLead] = useState({
    full_name: "",
    phone: "",
    email: "",
    inquiry_type: "general",
    organization_name: "",
    city: "",
    state: "",
    source: "phone",
    message: "",
    consent_to_contact: false,
  });
  const [draft, setDraft] = useState({
    stage: "new",
    priority: "normal",
    assigned_to: "",
    follow_up_at: "",
    lost_reason: "",
  });
  const [details, setDetails] = useState({ notes: [], activities: [], history: [], schoolRecord: null, franchiseRecord: null });
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activityForm, setActivityForm] = useState({
    activity_type: "call",
    subject: "",
    description: "",
    scheduled_at: "",
  });

  const canManage = ["admin", "manager"].includes(profile?.role);

  const loadLeads = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setPageError("");

      try {
        let leadQuery = supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);

        if (onlyNew) leadQuery = leadQuery.eq("stage", "new");

        const [leadResult, profileResult] = await Promise.all([
          leadQuery,
          supabase
            .from("profiles")
            .select("id, full_name, email, role, is_active")
            .eq("is_active", true)
            .order("full_name"),
        ]);

        if (leadResult.error) throw leadResult.error;
        setLeads(leadResult.data || []);
        if (!profileResult.error) setStaff(profileResult.data || []);
      } catch (error) {
        console.error("Lead loading error:", error);
        setPageError(error.message || "Unable to load leads.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [onlyNew],
  );

  const loadDetails = useCallback(async (leadId) => {
    setDetailLoading(true);
    try {
      const [notesResult, activityResult, historyResult, schoolResult, franchiseResult] = await Promise.all([
        supabase
          .from("lead_notes")
          .select("*")
          .eq("lead_id", leadId)
          .order("created_at", { ascending: false }),
        supabase
          .from("lead_activities")
          .select("*")
          .eq("lead_id", leadId)
          .order("created_at", { ascending: false }),
        supabase
          .from("lead_assignment_history")
          .select("*")
          .eq("lead_id", leadId)
          .order("assigned_at", { ascending: false }),
        supabase
          .from("school_partnerships")
          .select("id, lead_id, school_name, status")
          .eq("lead_id", leadId)
          .maybeSingle(),
        supabase
          .from("franchise_applications")
          .select("id, lead_id, applicant_name, status")
          .eq("lead_id", leadId)
          .maybeSingle(),
      ]);

      const failed = [notesResult, activityResult, historyResult].find(
        (result) => result.error,
      );
      if (failed) throw failed.error;

      setDetails({
        notes: notesResult.data || [],
        activities: activityResult.data || [],
        history: historyResult.data || [],
        schoolRecord: schoolResult.error ? null : schoolResult.data,
        franchiseRecord: franchiseResult.error ? null : franchiseResult.data,
      });
    } catch (error) {
      console.error("Lead details error:", error);
      setNotice(error.message || "Some lead history could not be loaded.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLeads();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadLeads]);

  // FIX: defer setState so it isn't called synchronously inside the effect body.
  useEffect(() => {
    const requestedId = searchParams.get("lead");
    if (!requestedId || !leads.length) return;

    const requestedLead = leads.find((lead) => lead.id === requestedId);
    if (!requestedLead || selected?.id === requestedLead.id) return;

    const timer = window.setTimeout(() => {
      setSelected(requestedLead);
      setDraft({
        stage: requestedLead.stage || "new",
        priority: requestedLead.priority || "normal",
        assigned_to: requestedLead.assigned_to || "",
        follow_up_at: toLocalDateTime(requestedLead.follow_up_at),
        lost_reason: requestedLead.lost_reason || "",
      });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchParams, leads, selected?.id]);

  useEffect(() => {
    if (!selected?.id) return;

    const timer = window.setTimeout(() => {
      void loadDetails(selected.id);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [selected?.id, loadDetails]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
      const matchesType = typeFilter === "all" || lead.inquiry_type === typeFilter;
      const matchesPriority =
        priorityFilter === "all" || lead.priority === priorityFilter;
      const haystack = [
        lead.full_name,
        lead.email,
        lead.phone,
        lead.organization_name,
        lead.city,
        lead.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        matchesStage &&
        matchesType &&
        matchesPriority &&
        (!term || haystack.includes(term))
      );
    });
  }, [leads, query, stageFilter, typeFilter, priorityFilter]);

  function chooseLead(lead) {
    setDetails({ notes: [], activities: [], history: [], schoolRecord: null, franchiseRecord: null });
    setSelected(lead);
    setDraft({
      stage: lead.stage || "new",
      priority: lead.priority || "normal",
      assigned_to: lead.assigned_to || "",
      follow_up_at: toLocalDateTime(lead.follow_up_at),
      lost_reason: lead.lost_reason || "",
    });
    const next = new URLSearchParams(searchParams);
    next.set("lead", lead.id);
    setSearchParams(next);
  }

  function closeLead() {
    setSelected(null);
    const next = new URLSearchParams(searchParams);
    next.delete("lead");
    setSearchParams(next);
  }

  async function saveLead(event) {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setNotice("");

    const now = new Date().toISOString();
    const payload = {
      stage: draft.stage,
      priority: draft.priority,
      follow_up_at: draft.follow_up_at
        ? new Date(draft.follow_up_at).toISOString()
        : null,
      lost_reason:
        draft.stage === "closed" ? draft.lost_reason.trim() || null : null,
      converted_at:
        draft.stage === "converted" ? selected.converted_at || now : null,
      closed_at: draft.stage === "closed" ? selected.closed_at || now : null,
      last_contacted_at: ["contacted", "follow_up"].includes(draft.stage)
        ? selected.last_contacted_at || now
        : selected.last_contacted_at || null,
    };

    if (canManage) payload.assigned_to = draft.assigned_to || null;

    try {
      const { data, error } = await supabase
        .from("leads")
        .update(payload)
        .eq("id", selected.id)
        .select("*")
        .single();
      if (error) throw error;

      setLeads((current) =>
        current.map((lead) => (lead.id === data.id ? data : lead)),
      );
      setSelected(data);
      setNotice("Lead details saved.");
      if (onlyNew && data.stage !== "new") closeLead();
    } catch (error) {
      console.error("Lead update error:", error);
      setNotice(error.message || "Unable to save this lead.");
    } finally {
      setSaving(false);
    }
  }


  async function createLead(event) {
    event.preventDefault();
    if (!user?.id) return;
    if (!newLead.phone.trim() && !newLead.email.trim()) {
      setNotice("Enter at least a phone number or email address.");
      return;
    }
    if (!newLead.consent_to_contact) {
      setNotice("Please confirm that the contact has agreed to be contacted.");
      return;
    }

    setCreatingLead(true);
    setNotice("");
    try {
      const payload = {
        full_name: newLead.full_name.trim(),
        phone: newLead.phone.trim() || null,
        email: newLead.email.trim() || null,
        inquiry_type: newLead.inquiry_type,
        organization_name: newLead.organization_name.trim() || null,
        city: newLead.city.trim() || null,
        state: newLead.state.trim() || null,
        country: "India",
        source: newLead.source,
        message: newLead.message.trim() || null,
        consent_to_contact: true,
        stage: "new",
        priority: "normal",
        assigned_to: null,
        created_by: user.id,
      };
      const { data, error } = await supabase.from("leads").insert(payload).select("*").single();
      if (error) throw error;
      setLeads((current) => [data, ...current.filter((lead) => lead.id !== data.id)]);
      setShowAddLead(false);
      setNewLead({
        full_name: "", phone: "", email: "", inquiry_type: "general",
        organization_name: "", city: "", state: "", source: "phone",
        message: "", consent_to_contact: false,
      });
      setNotice("Lead created successfully.");
    } catch (error) {
      console.error("Manual lead creation error:", error);
      setNotice(error.message || "Unable to create this lead.");
    } finally {
      setCreatingLead(false);
    }
  }

  async function createApplicationRecord() {
    if (!selected || !canManage || !user?.id) return;
    const custom = selected.custom_fields || {};
    const isSchool = selected.inquiry_type === "school_partnership";
    const isFranchise = selected.inquiry_type === "franchise";
    if (!isSchool && !isFranchise) return;
    if (isSchool && details.schoolRecord) {
      setNotice("A school partnership record already exists for this lead.");
      return;
    }
    if (isFranchise && details.franchiseRecord) {
      setNotice("A franchise application record already exists for this lead.");
      return;
    }

    setSaving(true);
    setNotice("");
    try {
      if (isSchool) {
        const rawStrength = custom.student_strength;
        const studentStrength = rawStrength === null || rawStrength === undefined || rawStrength === ""
          ? null
          : Number(rawStrength);
        if (studentStrength !== null && (!Number.isInteger(studentStrength) || studentStrength < 0)) {
          throw new Error("The student strength value on this inquiry is invalid. Please review the source details first.");
        }

        const { error } = await supabase.from("school_partnerships").insert({
          lead_id: selected.id,
          school_name: selected.organization_name || selected.full_name,
          school_website: custom.school_website || null,
          school_type: custom.school_type || null,
          contact_person: selected.full_name,
          address: custom.school_address || null,
          city: selected.city || null,
          state: selected.state || null,
          pincode: custom.pincode || null,
          student_strength: studentStrength,
          partnership_model: custom.partnership_model || null,
          proposed_start_date: custom.proposed_start_date || null,
          status: "new",
          assigned_to: selected.assigned_to || null,
          created_by: user.id,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("franchise_applications").insert({
          lead_id: selected.id,
          applicant_name: selected.full_name,
          proposed_center_name: custom.proposed_center_name || selected.organization_name || null,
          city: selected.city || null,
          state: selected.state || null,
          full_address: custom.full_address || null,
          premises_available: typeof custom.premises_available === "boolean" ? custom.premises_available : null,
          education_experience: custom.education_experience || null,
          investment_capacity: custom.investment_capacity || null,
          expected_start_date: custom.expected_start_date || null,
          status: "new",
          assigned_to: selected.assigned_to || null,
          created_by: user.id,
        });
        if (error) throw error;
      }

      await loadDetails(selected.id);
      setNotice(isSchool ? "School partnership record created." : "Franchise application record created.");
    } catch (error) {
      console.error("Application conversion error:", error);
      setNotice(error.message || "Unable to create the application record.");
    } finally {
      setSaving(false);
    }
  }

  async function addNote(event) {
    event.preventDefault();
    if (!selected || !noteText.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("lead_notes").insert({
        lead_id: selected.id,
        note: noteText.trim(),
        created_by: user.id,
      });
      if (error) throw error;
      setNoteText("");
      await loadDetails(selected.id);
      setNotice("Note added.");
    } catch (error) {
      setNotice(error.message || "Unable to add note.");
    } finally {
      setSaving(false);
    }
  }

  async function addActivity(event) {
    event.preventDefault();
    if (!selected || !activityForm.subject.trim()) return;
    setSaving(true);
    try {
      const payload = {
        lead_id: selected.id,
        activity_type: activityForm.activity_type,
        subject: activityForm.subject.trim(),
        description: activityForm.description.trim() || null,
        scheduled_at: activityForm.scheduled_at
          ? new Date(activityForm.scheduled_at).toISOString()
          : null,
        created_by: user.id,
      };
      const { error } = await supabase.from("lead_activities").insert(payload);
      if (error) throw error;
      setActivityForm({
        activity_type: "call",
        subject: "",
        description: "",
        scheduled_at: "",
      });
      await loadDetails(selected.id);
      setNotice("Activity added.");
    } catch (error) {
      setNotice(error.message || "Unable to create activity.");
    } finally {
      setSaving(false);
    }
  }

  async function completeActivity(activity) {
    try {
      const { error } = await supabase
        .from("lead_activities")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", activity.id);
      if (error) throw error;
      await loadDetails(selected.id);
      setNotice("Activity marked complete.");
    } catch (error) {
      setNotice(error.message || "Unable to update activity.");
    }
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Inquiry type",
      "Organization",
      "City",
      "Stage",
      "Priority",
      "Source",
      "Assigned to",
      "Created at",
      "Follow-up at",
    ];
    const rows = filteredLeads.map((lead) => [
      lead.full_name,
      lead.email,
      lead.phone,
      optionLabel(TYPES, lead.inquiry_type),
      lead.organization_name,
      lead.city,
      lead.stage,
      lead.priority,
      lead.source,
      staff.find((person) => person.id === lead.assigned_to)?.full_name || "",
      lead.created_at,
      lead.follow_up_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = onlyNew
      ? "ankvidhya-new-inquiries.csv"
      : "ankvidhya-leads.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  const pageTitle = onlyNew ? "New Inquiries" : "Lead CRM";
  const subtitle = onlyNew
    ? "Review incoming website enquiries and move them into your follow-up pipeline."
    : "Track every enquiry, manage ownership, record conversations and close opportunities.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">
            Relationship management
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddLead(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b91624]"
          >
            <Plus size={16} /> Add lead
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <ArrowDownToLine size={16} /> Export CSV
          </button>
          <button
            onClick={() => void loadLeads(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-[#182131] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#DB1D2D] disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}
      {pageError && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Unable to load CRM records</p>
            <p className="mt-1 break-words">{pageError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Visible leads", leads.length, "Accessible records"],
          ["New", leads.filter((lead) => lead.stage === "new").length, "Awaiting first contact"],
          ["Follow-up", leads.filter((lead) => lead.stage === "follow_up").length, "Need another touchpoint"],
          ["Converted", leads.filter((lead) => lead.stage === "converted").length, "Successfully converted"],
        ].map(([label, value, hint]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-2xl font-extrabold text-[#182131]">
              {loading ? "—" : value}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
            <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, phone, email, organization or city"
                className={inputClass + " pl-10"}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <select
                aria-label="Filter by stage"
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className={inputClass}
              >
                <option value="all">All stages</option>
                {STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by inquiry type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={inputClass}
              >
                <option value="all">All inquiry types</option>
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className={inputClass + " col-span-2 sm:col-span-1"}
              >
                <option value="all">All priorities</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <SlidersHorizontal size={13} /> {filteredLeads.length} matching records
            </span>
            <button
              onClick={() => {
                setQuery("");
                setStageFilter(onlyNew ? "new" : "all");
                setTypeFilter("all");
                setPriorityFilter("all");
              }}
              className="font-semibold text-[#DB1D2D] hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-slate-400">
            <RefreshCw size={17} className="mr-2 animate-spin" /> Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={22} />
            </div>
            <h3 className="mt-4 font-bold text-[#182131]">No matching leads</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try changing your filters or wait for the next website enquiry.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[920px] text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Inquiry</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Assigned to</th>
                    <th className="px-5 py-3">Received</th>
                    <th className="px-5 py-3 text-right"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <button onClick={() => chooseLead(lead)} className="text-left">
                          <p className="font-bold text-[#182131] hover:text-[#DB1D2D]">
                            {lead.full_name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {lead.phone || lead.email || "No contact details"}
                          </p>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {optionLabel(TYPES, lead.inquiry_type)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {lead.organization_name ||
                            [lead.city, lead.state].filter(Boolean).join(", ") ||
                            "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${stageClass(lead.stage)}`}
                        >
                          {optionLabel(STAGES, lead.stage)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${priorityClass(lead.priority)}`}
                        >
                          {lead.priority || "normal"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {staff.find((person) => person.id === lead.assigned_to)?.full_name ||
                          "Unassigned"}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => chooseLead(lead)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-[#DB1D2D]"
                          aria-label={`Open ${lead.full_name}`}
                        >
                          <ArrowRight size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => chooseLead(lead)}
                  className="block w-full p-4 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#182131]">
                        {lead.full_name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {lead.phone || lead.email || "No contact details"}
                      </p>
                    </div>
                    <ArrowRight size={17} className="mt-1 shrink-0 text-slate-400" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${stageClass(lead.stage)}`}
                    >
                      {optionLabel(STAGES, lead.stage)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${priorityClass(lead.priority)}`}
                    >
                      {lead.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {optionLabel(TYPES, lead.inquiry_type)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {lead.organization_name ||
                      [lead.city, lead.state].filter(Boolean).join(", ") ||
                      "—"}
                  </p>
                  </button>
                ))}
            </div>
          </>
        )}
      </section>

      {showAddLead && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#101827]/55 p-3 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddLead(false); }}>
          <section className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">New CRM record</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#182131]">Add a lead</h2>
                <p className="mt-1 text-xs text-slate-400">For phone, walk-in, referral and other enquiries.</p>
              </div>
              <button type="button" onClick={() => setShowAddLead(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Close add lead form"><X size={18} /></button>
            </div>
            <form onSubmit={createLead} className="space-y-4 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className={labelClass}>Full name *</label><input required value={newLead.full_name} onChange={(event) => setNewLead((current) => ({ ...current, full_name: event.target.value }))} className={inputClass} placeholder="Contact person's name" /></div>
                <div><label className={labelClass}>Phone</label><input type="tel" value={newLead.phone} onChange={(event) => setNewLead((current) => ({ ...current, phone: event.target.value }))} className={inputClass} placeholder="Mobile number" /></div>
                <div><label className={labelClass}>Email</label><input type="email" value={newLead.email} onChange={(event) => setNewLead((current) => ({ ...current, email: event.target.value }))} className={inputClass} placeholder="Email address" /></div>
                <div><label className={labelClass}>Inquiry type</label><select value={newLead.inquiry_type} onChange={(event) => setNewLead((current) => ({ ...current, inquiry_type: event.target.value }))} className={inputClass}>{TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></div>
                <div><label className={labelClass}>Source</label><select value={newLead.source} onChange={(event) => setNewLead((current) => ({ ...current, source: event.target.value }))} className={inputClass}>{["website", "whatsapp", "phone", "walk_in", "referral", "social_media", "imported"].map((source) => <option key={source} value={source}>{source.replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase())}</option>)}</select></div>
                <div><label className={labelClass}>Organization / school / center</label><input value={newLead.organization_name} onChange={(event) => setNewLead((current) => ({ ...current, organization_name: event.target.value }))} className={inputClass} placeholder="Optional" /></div>
                <div className="grid grid-cols-2 gap-2"><div><label className={labelClass}>City</label><input value={newLead.city} onChange={(event) => setNewLead((current) => ({ ...current, city: event.target.value }))} className={inputClass} /></div><div><label className={labelClass}>State</label><input value={newLead.state} onChange={(event) => setNewLead((current) => ({ ...current, state: event.target.value }))} className={inputClass} /></div></div>
                <div className="sm:col-span-2"><label className={labelClass}>Initial enquiry / notes</label><textarea rows={3} value={newLead.message} onChange={(event) => setNewLead((current) => ({ ...current, message: event.target.value }))} className={inputClass + " resize-y"} placeholder="What is the person interested in?" /></div>
              </div>
              <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><input type="checkbox" checked={newLead.consent_to_contact} onChange={(event) => setNewLead((current) => ({ ...current, consent_to_contact: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-[#DB1D2D]" /><span>I confirm that this contact has agreed to be contacted by Ankvidhya. *</span></label>
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row"><button type="button" onClick={() => setShowAddLead(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={creatingLead} className="rounded-xl bg-[#DB1D2D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-60">{creatingLead ? "Creating..." : "Create lead"}</button></div>
            </form>
          </section>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex justify-end bg-[#101827]/50 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLead();
          }}
        >
          <aside className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-[#F7F8FA] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">
                  Lead record
                </p>
                <h2 className="mt-1 truncate text-xl font-extrabold text-[#182131]">
                  {selected.full_name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {optionLabel(TYPES, selected.inquiry_type)} · Added {formatDate(selected.created_at)}
                </p>
              </div>
              <button
                onClick={closeLead}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
                aria-label="Close lead details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact information
                  </p>
                  <div className="mt-3 space-y-3">
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-2 text-sm font-semibold text-[#182131] hover:text-[#DB1D2D]"
                      >
                        <Phone size={15} className="text-slate-400" /> {selected.phone}
                      </a>
                    )}
                    {selected.email && (
                      <a
                        href={`mailto:${selected.email}`}
                        className="flex min-w-0 items-center gap-2 break-all text-sm font-semibold text-[#182131] hover:text-[#DB1D2D]"
                      >
                        <Mail size={15} className="shrink-0 text-slate-400" /> {selected.email}
                      </a>
                    )}
                    {(selected.city || selected.state) && (
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={15} className="text-slate-400" />
                        {[selected.city, selected.state, selected.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {!selected.phone && !selected.email && (
                      <p className="text-sm text-slate-400">
                        No contact details provided.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Enquiry summary
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#182131]">
                    {selected.organization_name || "Individual inquiry"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Source: <span className="capitalize">{String(selected.source || "website").replace(/_/g, " ")}</span>
                  </p>
                  {selected.course_id && (
                    <p className="mt-1 break-all text-xs text-slate-400">
                      Course reference: {selected.course_id}
                    </p>
                  )}
                  {selected.message && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {selected.message}
                    </p>
                  )}
                  {selected.custom_fields && Object.keys(selected.custom_fields).length > 0 && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Additional details
                      </p>
                      <div className="space-y-1.5">
                        {Object.entries(selected.custom_fields).map(([key, value]) => (
                          <p key={key} className="break-words text-xs text-slate-600">
                            <span className="font-semibold capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                            {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {canManage && (selected.inquiry_type === "school_partnership" || selected.inquiry_type === "franchise") && (
                <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#DB1D2D]">Application workflow</p>
                      <h3 className="mt-1 font-bold text-[#182131]">
                        {selected.inquiry_type === "school_partnership" ? "School partnership record" : "Franchise application record"}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {selected.inquiry_type === "school_partnership"
                          ? "Create a structured school partnership record from the information submitted in this enquiry."
                          : "Create a structured franchise application from the information submitted in this enquiry."}
                      </p>
                    </div>
                    {selected.inquiry_type === "school_partnership" ? (
                      details.schoolRecord ? (
                        <Link to="/admin/schools" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle2 size={15} /> View application
                        </Link>
                      ) : (
                        <button type="button" onClick={() => void createApplicationRecord()} disabled={saving || detailLoading || !["qualified", "converted"].includes(selected.stage)} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b91624] disabled:cursor-not-allowed disabled:opacity-50">
                          <Plus size={15} /> {saving ? "Creating..." : "Create school record"}
                        </button>
                      )
                    ) : details.franchiseRecord ? (
                      <Link to="/admin/franchises" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
                        <CheckCircle2 size={15} /> View application
                      </Link>
                    ) : (
                      <button type="button" onClick={() => void createApplicationRecord()} disabled={saving || detailLoading || !["qualified", "converted"].includes(selected.stage)} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b91624] disabled:cursor-not-allowed disabled:opacity-50">
                        <Plus size={15} /> {saving ? "Creating..." : "Create franchise record"}
                      </button>
                    )}
                  </div>
                  {!details.schoolRecord && !details.franchiseRecord && !["qualified", "converted"].includes(selected.stage) && (
                    <p className="mt-3 text-[11px] text-amber-700">Move this lead to Qualified or Converted before creating its application record.</p>
                  )}
                  {(details.schoolRecord || details.franchiseRecord) && (
                    <p className="mt-2 text-[11px] text-emerald-700">The related application record has already been created.</p>
                  )}
                </section>
              )}

              <form
                onSubmit={saveLead}
                className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#DB1D2D]" />
                  <h3 className="font-bold text-[#182131]">Manage lead</h3>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Pipeline stage</label>
                    <select
                      value={draft.stage}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, stage: event.target.value }))
                      }
                      className={inputClass}
                    >
                      {STAGES.map((stage) => (
                        <option key={stage.value} value={stage.value}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Priority</label>
                    <select
                      value={draft.priority}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, priority: event.target.value }))
                      }
                      className={inputClass}
                    >
                      {PRIORITIES.map((priority) => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  {canManage && (
                    <div>
                      <label className={labelClass}>Assign to</label>
                      <select
                        value={draft.assigned_to}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, assigned_to: event.target.value }))
                        }
                        className={inputClass}
                      >
                        <option value="">Unassigned</option>
                        {staff.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.full_name || person.email || person.id.slice(0, 8)} · {person.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Next follow-up</label>
                    <input
                      type="datetime-local"
                      value={draft.follow_up_at}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, follow_up_at: event.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  {draft.stage === "closed" && (
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Reason for closing (optional)</label>
                      <input
                        value={draft.lost_reason}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, lost_reason: event.target.value }))
                        }
                        placeholder="e.g. Not interested, budget constraints..."
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400">
                    Changes are saved to the lead record.
                  </p>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91624] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#DB1D2D]" />
                    <h3 className="font-bold text-[#182131]">Notes</h3>
                  </div>
                  <form onSubmit={addNote} className="mt-3">
                    <textarea
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                      rows={3}
                      placeholder="Record a conversation or important detail..."
                      className={inputClass + " resize-y"}
                    />
                    <button
                      type="submit"
                      disabled={saving || !noteText.trim()}
                      className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#182131] px-3 py-2 text-xs font-bold text-white hover:bg-[#DB1D2D] disabled:opacity-50"
                    >
                      <Plus size={14} /> Add note
                    </button>
                  </form>
                  <div className="mt-4 space-y-3">
                    {detailLoading ? (
                      <p className="text-xs text-slate-400">Loading notes...</p>
                    ) : details.notes.length === 0 ? (
                      <p className="text-xs text-slate-400">No notes recorded yet.</p>
                    ) : (
                      details.notes.map((note) => (
                        <div key={note.id} className="border-t border-slate-100 pt-3">
                          <p className="whitespace-pre-wrap text-sm leading-5 text-slate-700">
                            {note.note}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {formatDateTime(note.created_at)} ·{" "}
                            {staff.find((person) => person.id === note.created_by)?.full_name || "Team member"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={16} className="text-[#DB1D2D]" />
                    <h3 className="font-bold text-[#182131]">Activities & follow-ups</h3>
                  </div>
                  <form onSubmit={addActivity} className="mt-3 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={activityForm.activity_type}
                        onChange={(event) =>
                          setActivityForm((current) => ({ ...current, activity_type: event.target.value }))
                        }
                        className={inputClass}
                      >
                        {ACTIVITY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <input
                        type="datetime-local"
                        aria-label="Schedule date"
                        value={activityForm.scheduled_at}
                        onChange={(event) =>
                          setActivityForm((current) => ({ ...current, scheduled_at: event.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <input
                      value={activityForm.subject}
                      onChange={(event) =>
                        setActivityForm((current) => ({ ...current, subject: event.target.value }))
                      }
                      placeholder="Activity subject"
                      required
                      className={inputClass}
                    />
                    <textarea
                      value={activityForm.description}
                      onChange={(event) =>
                        setActivityForm((current) => ({ ...current, description: event.target.value }))
                      }
                      rows={2}
                      placeholder="Optional notes"
                      className={inputClass + " resize-y"}
                    />
                    <button
                      type="submit"
                      disabled={saving || !activityForm.subject.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#182131] px-3 py-2 text-xs font-bold text-white hover:bg-[#DB1D2D] disabled:opacity-50"
                    >
                      <Plus size={14} /> Add activity
                    </button>
                  </form>
                  <div className="mt-4 space-y-3">
                    {detailLoading ? (
                      <p className="text-xs text-slate-400">Loading activities...</p>
                    ) : details.activities.length === 0 ? (
                      <p className="text-xs text-slate-400">No activities scheduled yet.</p>
                    ) : (
                      details.activities.map((activity) => (
                        <div key={activity.id} className="flex gap-2 border-t border-slate-100 pt-3">
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activity.completed_at ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            {activity.completed_at ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold ${activity.completed_at ? "text-slate-400 line-through" : "text-slate-700"}`}>
                              {activity.subject}
                            </p>
                            <p className="mt-0.5 text-[10px] capitalize text-slate-400">
                              {activity.activity_type.replace(/_/g, " ")} · {formatDateTime(activity.scheduled_at)}
                            </p>
                            {activity.description && (
                              <p className="mt-1 whitespace-pre-wrap text-xs text-slate-500">
                                {activity.description}
                              </p>
                            )}
                            {!activity.completed_at && (
                              <button
                                onClick={() => void completeActivity(activity)}
                                className="mt-1 text-[11px] font-bold text-emerald-700 hover:underline"
                              >
                                Mark complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {canManage && (
                <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="text-[#DB1D2D]" />
                    <h3 className="font-bold text-[#182131]">Assignment history</h3>
                  </div>
                  <div className="mt-3 space-y-2">
                    {detailLoading ? (
                      <p className="text-xs text-slate-400">Loading history...</p>
                    ) : details.history.length === 0 ? (
                      <p className="text-xs text-slate-400">No assignment changes recorded.</p>
                    ) : (
                      details.history.map((item) => (
                        <div key={item.id} className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                          <span className="text-slate-600">
                            {staff.find((person) => person.id === item.assigned_to)?.full_name || "Unassigned"}
                          </span>
                          <span className="text-slate-400">{formatDateTime(item.assigned_at)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}
            </div>
            <div className="border-t border-slate-200 bg-white px-5 py-3 text-[11px] text-slate-400 sm:px-7">
              Lead ID: <span className="font-mono">{selected.id}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}