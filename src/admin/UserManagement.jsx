import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  KeyRound,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

function roleLabel(role) {
  return ROLE_OPTIONS.find((item) => item.value === role)?.label || role || "Unknown";
}

function StatusPill({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

async function callUserFunction(body) {
  const { data, error } = await supabase.functions.invoke("user-management", { body });

  if (error) {
    let message = error.message || "The user-management request failed.";
    try {
      const responseBody = await error.context?.json?.();
      if (responseBody?.error) message = responseBody.error;
    } catch {
      // The Functions client may return a non-JSON error response.
    }
    throw new Error(message);
  }

  if (data?.error) throw new Error(data.error);
  return data;
}

export default function UserManagement() {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({ fullName: "", email: "", role: "staff" });
  const [passwordResult, setPasswordResult] = useState(null);
  const [busyUserId, setBusyUserId] = useState("");
  const [copied, setCopied] = useState(false);

  const isAdmin = profile?.role === "admin";

  const loadUsers = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setPageError("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, is_active, must_change_password")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("User list error:", error);
      setPageError(error.message || "Unable to load user accounts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadUsers(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((person) => {
      const matchesSearch = !term || [person.full_name, person.email, person.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesRole = roleFilter === "all" || person.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? person.is_active : !person.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((person) => person.is_active).length,
    admins: users.filter((person) => person.role === "admin" && person.is_active).length,
    team: users.filter((person) => ["staff", "manager"].includes(person.role) && person.is_active).length,
  }), [users]);

  async function handleCreate(event) {
    event.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const result = await callUserFunction({
        action: "create-user",
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim().toLowerCase(),
        role: createForm.role,
      });
      setCreateOpen(false);
      setCreateForm({ fullName: "", email: "", role: "staff" });
      setPasswordResult({
        title: "User account created",
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim().toLowerCase(),
        password: result.tempPassword,
      });
      await loadUsers(true);
    } catch (error) {
      setCreateError(error.message || "Unable to create this account.");
    } finally {
      setCreating(false);
    }
  }

  async function handleResetPassword(person) {
    const confirmed = window.confirm(`Generate a new temporary password for ${person.full_name || person.email}? Their next sign-in will require a password change.`);
    if (!confirmed) return;

    setBusyUserId(person.id);
    setPageError("");
    try {
      const result = await callUserFunction({ action: "reset-password", userId: person.id });
      setPasswordResult({
        title: "Temporary password generated",
        fullName: person.full_name,
        email: person.email,
        password: result.tempPassword,
      });
      await loadUsers(true);
    } catch (error) {
      setPageError(error.message || "Unable to reset this password.");
    } finally {
      setBusyUserId("");
    }
  }

  async function handleRoleChange(person, nextRole) {
    if (!nextRole || nextRole === person.role) return;
    const confirmed = window.confirm(`Change ${person.full_name || person.email} from ${roleLabel(person.role)} to ${roleLabel(nextRole)}?`);
    if (!confirmed) return;

    setBusyUserId(person.id);
    setPageError("");
    try {
      await callUserFunction({ action: "set-role", userId: person.id, role: nextRole });
      await loadUsers(true);
    } catch (error) {
      setPageError(error.message || "Unable to update this user's role.");
    } finally {
      setBusyUserId("");
    }
  }

  async function handleActiveToggle(person) {
    const nextActive = !person.is_active;
    const actionText = nextActive ? "reactivate" : "deactivate";
    const confirmed = window.confirm(`${actionText[0].toUpperCase()}${actionText.slice(1)} ${person.full_name || person.email}? ${nextActive ? "They will be able to sign in again." : "They will lose access to the Ankvidhya admin area."}`);
    if (!confirmed) return;

    setBusyUserId(person.id);
    setPageError("");
    try {
      await callUserFunction({ action: "set-active", userId: person.id, isActive: nextActive });
      await loadUsers(true);
    } catch (error) {
      setPageError(error.message || `Unable to ${actionText} this account.`);
    } finally {
      setBusyUserId("");
    }
  }

  async function copyTemporaryPassword() {
    if (!passwordResult?.password) return;
    try {
      await navigator.clipboard.writeText(passwordResult.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setPageError("Clipboard access was blocked. Select and copy the temporary password manually.");
    }
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <ShieldCheck className="mx-auto text-amber-600" size={32} />
        <h1 className="mt-3 text-xl font-bold text-slate-900">Administrator access required</h1>
        <p className="mt-2 text-sm text-slate-600">Only an active admin can create accounts or manage user roles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DB1D2D]">Administration</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#182131] sm:text-3xl">User Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Create team accounts, assign access roles, issue temporary passwords and control account access.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => loadUsers(true)} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button type="button" onClick={() => { setCreateError(""); setCreateOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#bd1725]">
            <Plus size={17} /> Create User
          </button>
        </div>
      </div>

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{pageError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total accounts", value: stats.total, icon: UserRound },
          { label: "Active accounts", value: stats.active, icon: UserCheck },
          { label: "Active admins", value: stats.admins, icon: ShieldCheck },
          { label: "Active team", value: stats.team, icon: UserCog },
        ].map((item) => {
          const Icon = item.icon;
          return <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500 sm:text-sm">{item.label}</p><Icon size={18} className="text-slate-400" /></div><p className="mt-3 text-2xl font-extrabold text-[#182131]">{item.value}</p></div>;
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-[#182131]">Team accounts</h2>
            <p className="mt-1 text-xs text-slate-500">{filteredUsers.length} of {users.length} accounts</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(180px,1fr)_130px_130px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100" />
            </div>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-300">
              <option value="all">All roles</option>
              {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-300">
              <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" /> Loading accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-5 py-16 text-center"><UserRound size={30} className="mx-auto text-slate-300" /><p className="mt-3 font-semibold text-slate-700">No matching accounts</p><p className="mt-1 text-sm text-slate-500">Try changing the search or filters.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Password setup</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((person) => {
                  const isSelf = person.id === user?.id;
                  const isBusy = busyUserId === person.id;
                  return (
                    <tr key={person.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#182131]">{person.full_name || "Unnamed user"}{isSelf && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#DB1D2D]">You</span>}</div>
                        <div className="mt-1 text-xs text-slate-500">{person.email || "No email on profile"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <select aria-label={`Role for ${person.full_name || person.email}`} disabled={isSelf || isBusy} value={person.role || "staff"} onChange={(event) => handleRoleChange(person, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100">
                          {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-4"><StatusPill active={person.is_active} /></td>
                      <td className="px-4 py-4">
                        {person.must_change_password ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><KeyRound size={13} /> Change required</span> : <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><Check size={14} /> Set</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" disabled={isSelf || isBusy} onClick={() => handleResetPassword(person)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40" title="Issue a new temporary password">
                            {isBusy ? <LoaderCircle size={14} className="animate-spin" /> : <KeyRound size={14} />} Reset password
                          </button>
                          <button type="button" disabled={isSelf || isBusy} onClick={() => handleActiveToggle(person)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${person.is_active ? "border-red-200 text-red-700 hover:bg-red-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
                            {person.is_active ? <UserX size={14} /> : <UserCheck size={14} />}{person.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
        <div className="flex items-start gap-2"><ShieldCheck size={18} className="mt-0.5 shrink-0" /><div><p className="font-bold">Access and password security</p><p className="mt-1 text-xs leading-5 text-blue-800">Temporary passwords are shown only after creation or reset. Share them directly with the intended user. They must choose a new password at their next login. Deactivated accounts are blocked from signing in and from the admin area.</p></div></div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="create-user-title">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><h2 id="create-user-title" className="text-lg font-extrabold text-[#182131]">Create team account</h2><p className="mt-1 text-xs text-slate-500">A secure temporary password will be generated automatically.</p></div><button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close"><X size={19} /></button></div>
            <form onSubmit={handleCreate} className="space-y-4 p-6">
              {createError && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{createError}</div>}
              <div><label htmlFor="new-user-name" className="mb-1.5 block text-xs font-bold text-slate-600">Full name</label><input id="new-user-name" required maxLength={100} value={createForm.fullName} onChange={(event) => setCreateForm((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100" placeholder="Enter staff member's name" /></div>
              <div><label htmlFor="new-user-email" className="mb-1.5 block text-xs font-bold text-slate-600">Email address</label><input id="new-user-email" required type="email" maxLength={254} autoComplete="off" value={createForm.email} onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100" placeholder="name@example.com" /></div>
              <div><label htmlFor="new-user-role" className="mb-1.5 block text-xs font-bold text-slate-600">Access role</label><select id="new-user-role" value={createForm.role} onChange={(event) => setCreateForm((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-red-300"><option value="staff">Staff — day-to-day operations</option><option value="manager">Manager — team and lead management</option><option value="admin">Admin — full administration</option></select></div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">The account will be created as active with a confirmed email. The temporary password will appear once after creation; it is not emailed automatically.</div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setCreateOpen(false)} disabled={creating} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={creating || !createForm.fullName.trim() || !createForm.email.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#DB1D2D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#bd1725] disabled:opacity-60">{creating ? <LoaderCircle size={16} className="animate-spin" /> : <UserPlus size={16} />} Create account</button></div>
            </form>
          </div>
        </div>
      )}

      {passwordResult && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="temporary-password-title">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Check size={25} /></div>
            <h2 id="temporary-password-title" className="mt-4 text-xl font-extrabold text-[#182131]">{passwordResult.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{passwordResult.fullName || "User"} · {passwordResult.email}</p>
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-800">Temporary password — show once</p><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 break-all rounded-lg bg-white px-3 py-3 font-mono text-sm font-bold text-slate-900">{passwordResult.password}</code><button type="button" onClick={copyTemporaryPassword} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#182131] px-3 py-3 text-xs font-bold text-white hover:bg-slate-700">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button></div></div>
            <p className="mt-4 text-xs leading-5 text-slate-600">Copy this password now and share it securely with the user. It will not be available to view again. The user will be required to set a new password on first sign-in.</p>
            <button type="button" onClick={() => setPasswordResult(null)} className="mt-6 w-full rounded-xl bg-[#DB1D2D] px-4 py-3 text-sm font-bold text-white hover:bg-[#bd1725]">I have saved the password</button>
          </div>
        </div>
      )}
    </div>
  );
}
