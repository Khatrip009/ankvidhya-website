import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, profile, loading, error } = useAuth();
  const location = useLocation();
  const isPasswordChangePage = location.pathname === "/admin/change-password";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#DB1D2D]" />
          <p className="mt-4 text-sm text-slate-500">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] p-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#182131]">Profile unavailable</h2>
          <p className="mt-3 text-sm text-slate-500">Your account is authenticated, but its Ankvidhya profile could not be loaded. Please contact an administrator.</p>
          {error && <p className="mt-3 break-words text-xs text-red-600">{error}</p>}
        </div>
      </div>
    );
  }

  if (!profile.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] p-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#182131]">Account deactivated</h2>
          <p className="mt-3 text-sm text-slate-500">Your Ankvidhya account is currently inactive. Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  if (profile.must_change_password && !isPasswordChangePage) {
    return <Navigate to="/admin/change-password" replace />;
  }

  if (!profile.must_change_password && isPasswordChangePage) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
