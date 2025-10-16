import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required.");
    if (!password || password.length < 8) return setError("Use at least 8 characters.");

    setSubmitting(true);
    try {
      await signUp({ email: email.trim(), password });
      navigate("/signin", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid place-items-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Sign Up</h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">At least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-600 text-white font-semibold py-2.5 disabled:opacity-70 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? "Creating…" : "Sign up"}
            </button>

            {error && (
              <p className="text-rose-600 text-sm flex items-center gap-2">
                <span>✗</span> {error}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="text-emerald-700 hover:underline" to="/signin">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
