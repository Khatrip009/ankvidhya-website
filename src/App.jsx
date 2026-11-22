
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import SchoolPartnership from "./pages/SchoolPartnership";
import Center from "./pages/Center";
import OnlineCourses from "./pages/OnlineCourses";
import Founder from "./pages/Founder";
import Contact from "./pages/Contact";

import { AdminModulePlaceholder } from "./pages/ModulePlaceholder";

import Dashboard from "./admin/Dashboard";
import Courses from "./admin/Courses";
import CRM from "./admin/CRM";
import Inquiries from "./admin/Inquiries";
import Schools from "./admin/Schools";
import Franchises from "./admin/Franchises";
import Events from "./admin/Events";
import EventLeads from "./admin/EventLeads";
import Settings from "./admin/Settings";
import UserManagement from "./admin/UserManagement";
import ForcePasswordChange from "./admin/ForcePasswordChange";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-5xl font-extrabold text-[#182131]">
        404
      </h1>

      <p className="mt-3 text-slate-500">
        The page you're looking for does not exist.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/school-partnership"
          element={<SchoolPartnership />}
        />
        <Route path="/center" element={<Center />} />
        <Route
          path="/online-courses"
          element={<OnlineCourses />}
        />
        <Route path="/founder" element={<Founder />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Mandatory Temporary Password Change */}
      {/* Standalone page - does not use AdminLayout */}
      <Route
        path="/admin/change-password"
        element={
          <ProtectedRoute>
            <ForcePasswordChange />
          </ProtectedRoute>
        }
      />

      {/* Protected Administration */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Academic Management */}
        <Route path="courses" element={<Courses />} />

        {/* CRM Management */}
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="crm" element={<CRM />} />

        {/* Partnerships */}
        <Route path="schools" element={<Schools />} />
        <Route path="franchises" element={<Franchises />} />

        {/* Special Events */}
        <Route path="events" element={<Events />} />
        <Route path="event-leads" element={<EventLeads />} />

        {/* User Management */}
        <Route path="users" element={<UserManagement />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

        {/* Website Content */}
        <Route
          path="content"
          element={
            <AdminModulePlaceholder
              title="Website Content"
              description="Manage website sections and testimonials."
            />
          }
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}
