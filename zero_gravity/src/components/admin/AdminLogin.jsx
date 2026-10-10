import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adminLogin } from "@/lib/supabase";

export default function AdminLogin({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg("Please enter your username/email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await adminLogin(identifier, password);
      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
      } else if (data?.user) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-theme min-h-screen bg-[#090a0f] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-zinc-100">
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e5a93b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Zero Gravity Store
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#12141c] border border-zinc-800 rounded-2xl p-8 shadow-xl relative">
        {/* Top badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#e5a93b]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Sign in with your admin <span className="text-[#e5a93b]">username</span> or{" "}
            <span className="text-[#e5a93b]">email</span>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin or admin@zerogravity.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-11 pr-11 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
