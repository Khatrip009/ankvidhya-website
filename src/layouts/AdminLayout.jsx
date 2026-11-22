
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Users,
  School,
  Building2,
  Globe,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Inquiries", path: "/admin/inquiries", icon: Inbox },
  { label: "CRM", path: "/admin/crm", icon: Users },
  { label: "School Partnerships", path: "/admin/schools", icon: School },
  { label: "Franchise Applications", path: "/admin/franchises", icon: Building2 },
  { label: "Website Content", path: "/admin/content", icon: Globe },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">

          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Ank_Logo.png"
              alt="Ankvidhya"
              className="h-10 w-auto max-w-[150px] object-contain"
            />

            <span className="hidden border-l border-slate-200 pl-3 text-xs font-bold uppercase tracking-wider text-slate-400 sm:block">
              Administration
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#182131]">
                {profile?.full_name || profile?.email || "Administrator"}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-wider text-[#DB1D2D]">
                {profile?.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DB1D2D]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">

        <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">

          <p className="mb-4 px-3 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Management
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-red-50 text-[#DB1D2D]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#182131]"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl bg-[#182131] p-4 text-white">
            <p className="text-sm font-bold">Ankvidhya</p>
            <p className="mt-1 text-xs text-slate-300">
              Making Math Genius
            </p>
            <p className="mt-4 text-[10px] text-slate-400">
              Powered by QMitra
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">

          <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                      isActive
                        ? "bg-red-50 text-[#DB1D2D]"
                        : "text-slate-600"
                    }`
                  }
                >
                  <Icon size={15} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-5 sm:p-8">
            <Outlet />
          </div>

        </div>
      </div>

    </div>
  );
}
