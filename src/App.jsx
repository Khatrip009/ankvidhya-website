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

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-5xl font-extrabold text-[#182131]">404</h1>
      <p className="mt-3 text-slate-500">The page you're looking for does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/school-partnership" element={<SchoolPartnership />} />
        <Route path="/center" element={<Center />} />
        <Route path="/online-courses" element={<OnlineCourses />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="crm" element={<CRM />} />
        <Route path="schools" element={<Schools />} />
        <Route path="franchises" element={<Franchises />} />
        <Route path="events" element={<Events />} />
        <Route path="event-leads" element={<EventLeads />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}