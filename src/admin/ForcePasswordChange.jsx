import { useState } from "react";
import { KeyRound, LoaderCircle, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function ForcePasswordChange() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 12) {
      setError("Choose a password with at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) throw passwordError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Reload the app so AuthContext fetches the updated profile flag.
      window.location.assign("/admin");
    } catch (submitError) {
      setError(submitError.message || "Unable to update the password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#DB1D2D]"><KeyRound size={26} /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">Secure your account</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#182131]">Create your new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">You are signing in with a temporary password. Before continuing to Ankvidhya, set a new password that only you know.</p>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div><label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-slate-600">New password</label><input id="new-password" type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100" placeholder="At least 12 characters" /></div>
          <div><label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-slate-600">Confirm new password</label><input id="confirm-password" type="password" required minLength={12} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100" placeholder="Enter the same password again" /></div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><div className="flex items-start gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" /><span>Use at least 12 characters. A mix of uppercase and lowercase letters, numbers and symbols is recommended.</span></div></div>
          <button type="submit" disabled={saving || password.length < 12 || password !== confirmPassword} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-3 text-sm font-bold text-white hover:bg-[#bd1725] disabled:cursor-not-allowed disabled:opacity-50">{saving ? <LoaderCircle size={17} className="animate-spin" /> : <ShieldCheck size={17} />} Save new password</button>
        </form>

        <button type="button" onClick={handleLogout} className="mt-5 flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"><LogOut size={14} /> Sign out</button>
      </div>
    </div>
  );
}
