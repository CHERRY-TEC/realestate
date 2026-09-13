"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { MapPin, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === "sharanya" && password === "sharanya@252") {
        onLogin();
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-navy flex items-center justify-center px-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-navy-light rounded-2xl shadow-2xl p-8 sm:p-10 border border-earth-100 dark:border-white/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-navy" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy dark:text-white">
              Terra<span className="text-gold">Vista</span>
            </h1>
            <p className="text-earth-400 dark:text-white/40 text-sm mt-2">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-white/30" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-navy dark:text-white placeholder:text-earth-300 dark:placeholder:text-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-white/30" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl pl-11 pr-12 py-3 text-navy dark:text-white placeholder:text-earth-300 dark:placeholder:text-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 dark:text-white/30 hover:text-gold transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-navy py-3.5 rounded-xl font-bold text-base hover:bg-gold-glow transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
