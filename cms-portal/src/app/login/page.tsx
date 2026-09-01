"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid matric number/email or password. Please try again.");
      } else {
        router.push("/portal");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-gradient relative">
      <div className="absolute inset-0 grain-overlay" />

      {/* Decorative glows */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <GraduationCap size={22} className="text-bg-primary" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-lg font-bold text-text-primary">
                COLMANS
              </span>
              <span className="text-[10px] text-text-muted leading-none">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-bg-secondary/80 backdrop-blur-xl border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign in with your matric number or email
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-sm text-error"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-text-secondary"
              >
                Matric Number or Email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. BU/20A/0001 or student@email.com"
                required
                className="w-full rounded-lg bg-bg-tertiary border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg bg-bg-tertiary border border-border px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-gold-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
