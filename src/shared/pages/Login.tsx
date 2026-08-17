import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { useLogin } from "../../api/hooks/useAuth";
import useAuthStore from "../../store/authStore";
import { ApiError } from "../../lib/http/ApiError";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  // Already signed in — bounce straight to the app instead of showing the form.
  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/employee";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/employee";
      navigate(redirectTo, { replace: true });
    } catch {
      // Surfaced below via login.error — nothing else to do here.
    }
  }

  const error = login.error as ApiError | null;

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-green rounded-2xl flex items-center justify-center text-2xl mb-4">
            🌱
          </div>
          <h1 className="text-xl font-bold text-dark">Terra Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your employee account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 space-y-4"
          noValidate
        >
          {error && (
            <div
              role="alert"
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm"
            >
              {error.isValidation ? error.fieldError("email") ?? error.message : error.message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-gray-500 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-gray-500 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                aria-hidden="true"
              />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {login.isPending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {login.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
