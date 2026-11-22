
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./admin/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SchoolPartnership from "./pages/SchoolPartnership";
import Center from "./pages/Center";
import OnlineCourses from "./pages/OnlineCourses";
import Founder from "./pages/Founder";
import Contact from "./pages/Contact";

import { AdminModulePlaceholder } from "./pages/ModulePlaceholder";


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

      {/* PUBLIC WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route
  path="/school-partnership"
  element={<SchoolPartnership />}
  
/>
<Route
  path="/center"
  element={<Center />}
/>

<Route
  path="/online-courses"
  element={<OnlineCourses />}
/>
<Route
  path="/founder"
  element={<Founder />}
/>

<Route
  path="/contact"
  element={<Contact />}
/>
      </Route>

      {/* ADMIN LOGIN */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* PROTECTED ADMIN APPLICATION */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="courses"
          element={
            <AdminModulePlaceholder
              title="Course Management"
              description="Create, edit and manage Ankvidhya courses."
            />
          }
        />

        <Route
          path="inquiries"
          element={
            <AdminModulePlaceholder
              title="Inquiry Management"
              description="Review website inquiries and incoming requests."
            />
          }
        />

        <Route
          path="crm"
          element={
            <AdminModulePlaceholder
              title="Education CRM"
              description="Manage leads, assignments, notes and follow-ups."
            />
          }
        />

        <Route
          path="schools"
          element={
            <AdminModulePlaceholder
              title="School Partnerships"
              description="Manage school partnership inquiries and applications."
            />
          }
        />

        <Route
          path="franchises"
          element={
            <AdminModulePlaceholder
              title="Franchise Applications"
              description="Manage franchise requests and center applications."
            />
          }
        />

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

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}
