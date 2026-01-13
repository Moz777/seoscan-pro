"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
} from "@/lib/firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setState((prev) => ({ ...prev, user, loading: false }));
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { user, error } = await signInWithEmail(email, password);

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error }));
        return { success: false, error };
      }

      setState((prev) => ({ ...prev, user, loading: false }));
      router.push("/dashboard");
      return { success: true, error: null };
    },
    [router]
  );

  // Sign up with email
  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { user, error } = await signUpWithEmail(email, password, displayName);

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error }));
        return { success: false, error };
      }

      setState((prev) => ({ ...prev, user, loading: false }));
      router.push("/dashboard");
      return { success: true, error: null };
    },
    [router]
  );

  // Sign in with Google
  const loginWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { user, error } = await signInWithGoogle();

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setState((prev) => ({ ...prev, user, loading: false }));
    router.push("/dashboard");
    return { success: true, error: null };
  }, [router]);

  // Sign out
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await signOut();

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setState({ user: null, loading: false, error: null });
    router.push("/");
    return { success: true, error: null };
  }, [router]);

  // Reset password
  const forgotPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await resetPassword(email);

    setState((prev) => ({ ...prev, loading: false, error }));
    return { success: !error, error };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    clearError,
  };
}
