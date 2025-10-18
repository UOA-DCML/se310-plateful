import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext"; // adjust path if needed

export default function SignupPage() {
  const { isDark } = useTheme();
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
    <div
      className={`min-h-[calc(100vh-6rem)] grid place-items-center px-4 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-slate-50 to-white"
      }`}
    >
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl shadow-lg ring-1 p-6 sm:p-8 backdrop-blur ${
            isDark ? "bg-gray-800/80 ring-gray-700" : "bg-white ring-slate-200"
          }`}
        >
          <h1
            className={`text-2xl font-bold text-center mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Sign Up
          </h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                className={`w-full rounded-xl px-3 py-2 outline-none transition border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-emerald-200 focus:border-emerald-400"
                    : "bg-white border-slate-300 text-gray-900 focus:ring-emerald-100 focus:border-emerald-500"
                }`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                className={`w-full rounded-xl px-3 py-2 outline-none transition border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-emerald-200 focus:border-emerald-400"
                    : "bg-white border-slate-300 text-gray-900 focus:ring-emerald-100 focus:border-emerald-500"
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                At least 8 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-xl font-semibold py-2.5 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-100"
              }`}
            >
              {submitting ? "Creating…" : "Sign up"}
            </button>

            {error && (
              <p className="text-rose-600 text-sm flex items-center gap-2">
                <span>✗</span> {error}
              </p>
            )}
          </form>

          <p
            className={`mt-6 text-center text-sm ${
              isDark ? "text-gray-300" : "text-slate-600"
            }`}
          >
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
