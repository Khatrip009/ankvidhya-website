
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { user, profile, loading, signIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const destination = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (!loading && user && profile?.is_active) {
      navigate(destination, { replace: true });
    }
  }, [loading, user, profile, destination, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const { error: loginError } = await signIn(email, password);

      if (loginError) {
        throw loginError;
      }

      // AuthContext handles session and profile loading.
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#DB1D2D]" />
      </div>
    );
  }

  if (user && profile?.is_active) {
    return <Navigate to={destination} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-5 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src="/Ank_Logo.png"
              alt="Ankvidhya"
              className="mx-auto h-16 w-auto max-w-[220px] object-contain"
            />
          </Link>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">
            Making Math Genius
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">

          <div className="mb-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#DB1D2D]">
              <LockKeyhole size={23} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#182131]">
              Admin Sign In
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage Ankvidhya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  placeholder="admin@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-[#182131] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#DB1D2D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>

        <p className="mt-7 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Ankvidhya · Powered by QMitra
        </p>
      </div>
    </div>
  );
}
