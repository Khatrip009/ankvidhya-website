import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_ROLES = new Set(["admin", "manager", "staff"]);
const TEMP_PASSWORD_LENGTH = 20;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getKeyFromEnv(pluralName: string, legacyName: string): string | null {
  const pluralValue = Deno.env.get(pluralName);
  if (pluralValue) {
    try {
      const parsed = JSON.parse(pluralValue) as Record<string, string>;
      const defaultKey = parsed.default || Object.values(parsed)[0];
      if (defaultKey) return defaultKey;
    } catch {
      // Fall through to the legacy variable in case this project still uses legacy keys.
    }
  }
  return Deno.env.get(legacyName) || null;
}

function randomCharacter(chars: string): string {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return chars[value[0] % chars.length];
}

function generateTemporaryPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%*-_+";
  const all = upper + lower + digits + symbols;
  const characters = [
    randomCharacter(upper),
    randomCharacter(lower),
    randomCharacter(digits),
    randomCharacter(symbols),
  ];
  while (characters.length < TEMP_PASSWORD_LENGTH) {
    characters.push(randomCharacter(all));
  }

  // Cryptographically shuffle the required character groups with the remaining characters.
  for (let i = characters.length - 1; i > 0; i -= 1) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    const j = value[0] % (i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join("");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = getKeyFromEnv("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  const secretKey = getKeyFromEnv("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !publishableKey || !secretKey) {
    console.error("Supabase function environment is missing a required URL or API key.");
    return jsonResponse({ error: "User-management service is not configured. Check the Edge Function environment." }, 500);
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "You must be signed in to manage users." }, 401);
  }

  const callerClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { data: callerData, error: callerAuthError } = await callerClient.auth.getUser();
  if (callerAuthError || !callerData.user) {
    return jsonResponse({ error: "Your session is invalid or has expired. Please sign in again." }, 401);
  }

  const { data: callerProfile, error: callerProfileError } = await adminClient
    .from("profiles")
    .select("role, is_active, must_change_password")
    .eq("id", callerData.user.id)
    .maybeSingle();

  if (callerProfileError || !callerProfile || callerProfile.role !== "admin" || callerProfile.is_active !== true || callerProfile.must_change_password === true) {
    return jsonResponse({ error: "Only an active admin can manage user accounts." }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  const action = body.action;

  async function findTarget(userId: unknown) {
    if (typeof userId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return { target: null, response: jsonResponse({ error: "A valid user ID is required." }, 400) };
    }
    const { data, error } = await adminClient
      .from("profiles")
      .select("id, full_name, email, role, is_active, must_change_password")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Target profile lookup failed:", error.message);
      return { target: null, response: jsonResponse({ error: "Unable to find that user account." }, 500) };
    }
    if (!data) return { target: null, response: jsonResponse({ error: "User account not found." }, 404) };
    return { target: data, response: null };
  }

  async function activeAdminCount(): Promise<number | null> {
    const { count, error } = await adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("is_active", true);
    if (error) {
      console.error("Active admin count failed:", error.message);
      return null;
    }
    return count ?? 0;
  }

  if (action === "create-user") {
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = typeof body.role === "string" ? body.role : "staff";

    if (fullName.length < 2 || fullName.length > 100) {
      return jsonResponse({ error: "Full name must contain between 2 and 100 characters." }, 400);
    }
    if (email.length > 254 || !isValidEmail(email)) {
      return jsonResponse({ error: "Enter a valid email address." }, 400);
    }
    if (!ALLOWED_ROLES.has(role)) {
      return jsonResponse({ error: "Role must be admin, manager or staff." }, 400);
    }

    const temporaryPassword = generateTemporaryPassword();
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createError || !created.user) {
      console.error("Auth user creation failed:", createError?.message);
      return jsonResponse({ error: createError?.message || "Unable to create the authentication account." }, 400);
    }

    const { error: profileUpsertError } = await adminClient.from("profiles").upsert({
      id: created.user.id,
      full_name: fullName,
      email,
      role,
      is_active: true,
      must_change_password: true,
    }, { onConflict: "id" });

    if (profileUpsertError) {
      console.error("Profile creation failed; removing the Auth user:", profileUpsertError.message);
      await adminClient.auth.admin.deleteUser(created.user.id);
      return jsonResponse({ error: "The login account was created, but its Ankvidhya profile could not be saved. The incomplete account has been rolled back." }, 500);
    }

    return jsonResponse({ ok: true, userId: created.user.id, tempPassword: temporaryPassword });
  }

  if (action === "reset-password") {
    const { target, response } = await findTarget(body.userId);
    if (response) return response;
    if (target.id === callerData.user.id) {
      return jsonResponse({ error: "You cannot reset your own password from User Management. Use your account password-change flow instead." }, 400);
    }

    const temporaryPassword = generateTemporaryPassword();
    const { error: profileFlagError } = await adminClient
      .from("profiles")
      .update({ must_change_password: true })
      .eq("id", target.id);
    if (profileFlagError) {
      console.error("Could not set the password-change flag:", profileFlagError.message);
      return jsonResponse({ error: "Unable to prepare this account for a password reset." }, 500);
    }

    const { data: authUserData, error: authUserError } = await adminClient.auth.admin.getUserById(target.id);
    if (authUserError || !authUserData.user) {
      await adminClient.from("profiles").update({ must_change_password: target.must_change_password === true }).eq("id", target.id);
      return jsonResponse({ error: "Could not locate this user's login account." }, 404);
    }

    const nextMetadata = { ...(authUserData.user.user_metadata || {}), full_name: target.full_name || authUserData.user.user_metadata?.full_name || "" };
    const { error: passwordUpdateError } = await adminClient.auth.admin.updateUserById(target.id, {
      password: temporaryPassword,
      user_metadata: nextMetadata,
    });
    if (passwordUpdateError) {
      await adminClient.from("profiles").update({ must_change_password: target.must_change_password === true }).eq("id", target.id);
      console.error("Temporary password update failed:", passwordUpdateError.message);
      return jsonResponse({ error: "Unable to issue a new temporary password." }, 500);
    }

    return jsonResponse({ ok: true, tempPassword: temporaryPassword });
  }

  if (action === "set-role") {
    const { target, response } = await findTarget(body.userId);
    if (response) return response;
    const role = typeof body.role === "string" ? body.role : "";
    if (!ALLOWED_ROLES.has(role)) {
      return jsonResponse({ error: "Role must be admin, manager or staff." }, 400);
    }
    if (target.id === callerData.user.id) {
      return jsonResponse({ error: "You cannot change your own administrator role." }, 400);
    }
    if (target.role === "admin" && target.is_active && role !== "admin") {
      const adminCount = await activeAdminCount();
      if (adminCount === null) return jsonResponse({ error: "Could not verify the active administrator count." }, 500);
      if (adminCount <= 1) return jsonResponse({ error: "You cannot remove the last active administrator." }, 409);
    }

    const { error } = await adminClient.from("profiles").update({ role }).eq("id", target.id);
    if (error) {
      console.error("Role update failed:", error.message);
      return jsonResponse({ error: "Unable to update this user's role." }, 500);
    }
    return jsonResponse({ ok: true });
  }

  if (action === "set-active") {
    const { target, response } = await findTarget(body.userId);
    if (response) return response;
    if (typeof body.isActive !== "boolean") {
      return jsonResponse({ error: "isActive must be true or false." }, 400);
    }
    const isActive = body.isActive;
    if (target.id === callerData.user.id && !isActive) {
      return jsonResponse({ error: "You cannot deactivate your own administrator account." }, 400);
    }
    if (!isActive && target.role === "admin" && target.is_active) {
      const adminCount = await activeAdminCount();
      if (adminCount === null) return jsonResponse({ error: "Could not verify the active administrator count." }, 500);
      if (adminCount <= 1) return jsonResponse({ error: "You cannot deactivate the last active administrator." }, 409);
    }

    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(target.id, {
      ban_duration: isActive ? "none" : "876000h",
    });
    if (authUpdateError) {
      console.error("Auth ban status update failed:", authUpdateError.message);
      return jsonResponse({ error: "Could not change the sign-in status for this account." }, 500);
    }

    const { error: profileUpdateError } = await adminClient
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", target.id);
    if (profileUpdateError) {
      // Best-effort rollback so the Auth ban and the application profile stay aligned.
      await adminClient.auth.admin.updateUserById(target.id, {
        ban_duration: isActive ? "876000h" : "none",
      });
      console.error("Profile status update failed:", profileUpdateError.message);
      return jsonResponse({ error: "The sign-in status changed, but the Ankvidhya profile could not be updated. Please retry or inspect this account." }, 500);
    }

    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Unknown user-management action." }, 400);
});
