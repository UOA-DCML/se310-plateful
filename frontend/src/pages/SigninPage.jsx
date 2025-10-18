import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext"; // adjust path if needed
import toast from "react-hot-toast";

export default function SigninPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      toast.success(`Welcome back, ${email.split("@")[0]}!`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed");
      toast.error(err.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <div
        className={`min-h-[calc(100vh-6rem)] grid place-items-center ${
          isDark
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-b from-slate-50 to-white"
        } px-4`}
      >
        <div className="w-full max-w-md">
          <div
            className={`${
              isDark ? "bg-gray-800/80" : "bg-white/80"
            } backdrop-blur rounded-2xl shadow-lg ring-1 ${
              isDark ? "ring-gray-700" : "ring-slate-200"
            } p-6 sm:p-8`}
          >
            <h1
              className={`text-2xl font-bold text-center ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              You’re already signed in
            </h1>
            <p
              className={`mt-2 text-center ${
                isDark ? "text-gray-300" : "text-slate-600"
              }`}
            >
              Signed in as{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                {user.username || user.email}
              </span>
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/")}
                className={`flex-1 rounded-xl font-semibold py-2.5 transition cursor-pointer ${
                  isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                Go home
              </button>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    toast.success("Signed out successfully!");
                  } catch (err) {
                    toast.error("Failed to sign out. Please try again.");
                  }
                }}
                className={`flex-1 rounded-xl font-semibold py-2.5 transition cursor-pointer ${
                  isDark
                    ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[calc(100vh-6rem)] grid place-items-center ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-slate-50 to-white"
      } px-4`}
    >
      <div className="w-full max-w-md">
        <div
          className={`${
            isDark ? "bg-gray-800/80" : "bg-white/80"
          } backdrop-blur rounded-2xl shadow-lg ring-1 ${
            isDark ? "ring-gray-700" : "ring-slate-200"
          } p-6 sm:p-8`}
        >
          <h1
            className={`text-2xl font-bold text-center ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Sign in
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
                autoComplete="email"
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
                autoComplete="current-password"
                className={`w-full rounded-xl px-3 py-2 outline-none transition border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-emerald-200 focus:border-emerald-400"
                    : "bg-white border-slate-300 text-gray-900 focus:ring-emerald-100 focus:border-emerald-500"
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            {error && (
              <div className="flex items-start gap-2 text-rose-600 text-sm">
                <span className="mt-0.5">✗</span>
                <span> {error} </span>
              </div>
            )}
          </form>

          <p
            className={`mt-6 text-center text-sm ${
              isDark ? "text-gray-300" : "text-slate-600"
            }`}
          >
            No account yet?{" "}
            <Link className="text-emerald-700 hover:underline" to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
