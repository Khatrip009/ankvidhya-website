import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarClock,
  Clock3,
  RefreshCw,
  School,
  Users,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

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

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    leads: 0,
    newLeads: 0,
    followUps: 0,
    schools: 0,
    franchises: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [dueActivities, setDueActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const now = new Date().toISOString();
      const [
        coursesResult,
        leadsResult,
        newLeadsResult,
        followUpsResult,
        schoolsResult,
        franchisesResult,
        recentResult,
        dueResult,
      ] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("stage", "new"),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("stage", "follow_up"),
        supabase.from("school_partnerships").select("id", { count: "exact", head: true }),
        supabase.from("franchise_applications").select("id", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("id, full_name, phone, email, inquiry_type, stage, created_at, city")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("lead_activities")
          .select("id, lead_id, subject, activity_type, scheduled_at, completed_at")
          .is("completed_at", null)
          .not("scheduled_at", "is", null)
          .lte("scheduled_at", now)
          .order("scheduled_at", { ascending: true })
          .limit(6),
      ]);

      const failed = [
        coursesResult,
        leadsResult,
        newLeadsResult,
        followUpsResult,
        schoolsResult,
        franchisesResult,
        recentResult,
        dueResult,
      ].find((result) => result.error);
      if (failed) throw failed.error;

      setStats({
        courses: coursesResult.count ?? 0,
        leads: leadsResult.count ?? 0,
        newLeads: newLeadsResult.count ?? 0,
        followUps: followUpsResult.count ?? 0,
        schools: schoolsResult.count ?? 0,
        franchises: franchisesResult.count ?? 0,
      });
      setRecentLeads(recentResult.data || []);
      setDueActivities(dueResult.data || []);
    } catch (loadError) {
      console.error("Admin dashboard error:", loadError);
      setError(loadError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadDashboard();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadDashboard]);

  const cards = [
    { title: "Total leads", value: stats.leads, hint: "All accessible enquiries", icon: Users, link: "/admin/crm" },
    { title: "New inquiries", value: stats.newLeads, hint: "Awaiting first contact", icon: Clock3, link: "/admin/inquiries" },
    { title: "Follow-up pipeline", value: stats.followUps, hint: "Leads awaiting follow-up", icon: CalendarClock, link: "/admin/crm" },
    { title: "Franchise applications", value: stats.franchises, hint: "Center partnership requests", icon: Building2, link: "/admin/franchises" },
    { title: "School partnerships", value: stats.schools, hint: "Partnership records", icon: School, link: "/admin/schools" },
    { title: "Courses", value: stats.courses, hint: "Programs in the catalog", icon: BookOpen, link: "/admin/courses" },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">Administration overview</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back, {profile?.full_name || "Administrator"}. Here is your Ankvidhya activity overview.
          </p>
        </div>
        <button
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                  <Icon size={21} />
                </div>
                <ArrowRight size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#DB1D2D]" />
              </div>
              <p className="mt-5 text-3xl font-extrabold text-[#182131]">
                {loading ? "—" : card.value}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">{card.title}</p>
              <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#182131]">Recent inquiries</h2>
              <p className="mt-0.5 text-xs text-slate-400">Latest contacts received through Ankvidhya</p>
            </div>
            <Link to="/admin/crm" className="text-xs font-bold text-[#DB1D2D] hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading inquiries...</div>
          ) : recentLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No inquiries received yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <Link key={lead.id} to={`/admin/crm?lead=${lead.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#182131]">{lead.full_name}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{lead.phone || lead.email || "No contact details"} · {lead.city || "Location not shared"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${stageClass(lead.stage)}`}>{String(lead.stage || "new").replace(/_/g, " ")}</span>
                    <p className="mt-1.5 text-[10px] text-slate-400">{formatDate(lead.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-[#182131]">Overdue activities</h2>
            <p className="mt-0.5 text-xs text-slate-400">Follow-ups scheduled for now or earlier</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading activities...</div>
          ) : dueActivities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CalendarClock size={20} /></div>
              <p className="mt-3 text-sm font-semibold text-[#182131]">You're up to date</p>
              <p className="mt-1 text-xs text-slate-400">No overdue activities are currently visible.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dueActivities.map((activity) => (
                <Link key={activity.id} to={`/admin/crm?lead=${activity.lead_id}`} className="flex gap-3 px-5 py-4 transition hover:bg-slate-50">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock3 size={16} /></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#182131]">{activity.subject}</p>
                    <p className="mt-1 text-xs capitalize text-slate-400">{activity.activity_type} · {formatDate(activity.scheduled_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 rounded-2xl bg-[#182131] p-6 text-white sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F04452]">Ankvidhya management system</p>
        <h2 className="mt-2 text-xl font-bold">Every enquiry deserves a thoughtful follow-up.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Keep conversations, ownership, notes and next actions together so your team can nurture each school, family and franchise opportunity.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/admin/crm" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#182131] hover:bg-slate-100">Open CRM</Link>
          <Link to="/admin/inquiries" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">Review new inquiries</Link>
        </div>
      </div>
    </div>
  );
}
