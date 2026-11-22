/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const loadSession = useCallback(async (session) => {
    if (!session?.user) {
      setAuthState({
        session: null,
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
      return;
    }

    setAuthState({
      session,
      user: session.user,
      profile: null,
      loading: true,
      error: null,
    });

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile loading error:", error);

      setAuthState({
        session,
        user: session.user,
        profile: null,
        loading: false,
        error: error.message,
      });

      return;
    }

    setAuthState({
      session,
      user: session.user,
      profile: data,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncSession = async (session) => {
      if (!mounted) return;

      await loadSession(session);
    };

    // Listen for authentication changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer database access until after the auth callback.
      window.setTimeout(() => {
        if (mounted) {
          void syncSession(session);
        }
      }, 0);
    });

    // Load existing session.
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        return syncSession(data.session);
      })
      .catch((error) => {
        console.error("Session initialization error:", error);

        if (mounted) {
          setAuthState({
            session: null,
            user: null,
            profile: null,
            loading: false,
            error: error.message,
          });
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadSession]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = useMemo(
    () => ({
      ...authState,
      signIn,
      signOut,
    }),
    [authState]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
