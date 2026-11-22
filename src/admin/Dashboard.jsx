
import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Building2,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const initialStats = {
  courses: 0,
  leads: 0,
  centers: 0,
};

export default function Dashboard() {
  const { profile } = useAuth();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [
        coursesResult,
        leadsResult,
        centersResult,
      ] = await Promise.all([
        supabase
          .from("courses")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("leads")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("centers")
          .select("id", { count: "exact", head: true }),
      ]);

      const failedResult = [
        coursesResult,
        leadsResult,
        centersResult,
      ].find((result) => result.error);

      if (failedResult) {
        throw failedResult.error;
      }

      setStats({
        courses: coursesResult.count ?? 0,
        leads: leadsResult.count ?? 0,
        centers: centersResult.count ?? 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) void loadDashboard();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const cards = [
    {
      title: "Courses",
      value: stats.courses,
      description: "Courses visible to your account",
      icon: BookOpen,
    },
    {
      title: "Inquiries / Leads",
      value: stats.leads,
      description: "Leads accessible to your account",
      icon: Users,
    },
    {
      title: "Learning Centers",
      value: stats.centers,
      description: "Registered learning centers",
      icon: Building2,
    },
  ];

  return (
    <div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back, {profile?.full_name || "Administrator"}.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                  <Icon size={22} />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overview
                </span>
              </div>

              <p className="mt-6 text-3xl font-extrabold text-[#182131]">
                {loading ? "—" : card.value}
              </p>

              <p className="mt-2 text-sm font-bold text-slate-700">
                {card.title}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}

      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">

        <h2 className="text-lg font-bold text-[#182131]">
          Application Status
        </h2>

        <div className="mt-5 space-y-4">

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              Supabase database
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              Authentication
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Authenticated
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              Account role
            </span>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase text-[#DB1D2D]">
              {profile?.role || "Unknown"}
            </span>
          </div>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-[#182131] p-7 text-white">
        <h2 className="text-xl font-bold">
          Ankvidhya Management System
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Your administration foundation is ready. Course
          management, inquiries, CRM and website content
          modules will be developed next.
        </p>

        <p className="mt-5 text-xs font-semibold text-[#F04452]">
          MAKING MATH GENIUS
        </p>
      </div>

    </div>
  );
}
