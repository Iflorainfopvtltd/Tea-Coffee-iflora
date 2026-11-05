'use client';

import React, { useState } from 'react';
import { Coffee, Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginViewProps {
  onSuccess: (admin: { name: string; email: string }) => void;
}

export default function LoginView({ onSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      onSuccess(data.admin);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#05070d]">
      {/* Background neon ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0e172a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glowing border wrapper */}
        <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-b from-cyan-500/60 via-slate-800 to-lime-500/50 shadow-[0_0_35px_rgba(0,240,255,0.2)]">
          <div className="rounded-2xl bg-[#090e18]/90 backdrop-blur-xl p-6 sm:p-8">
            
            {/* Header with Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-slate-800 to-lime-500/20 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-4">
                <Coffee className="w-9 h-9 text-cyan-400" />
              </div>
              
              <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-lime-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                Tea-Coffee
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Admin Portal • Daily Counting &amp; Analytics
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-lime-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 focus:border-lime-400 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-400 hover:from-cyan-300 hover:to-lime-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-slate-950" />
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-slate-800/90" />
            </div>

            {/* Made with ❤️ by Darshan */}
            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <span>Made with</span>
              <span className="text-red-500 text-sm inline-block animate-pulse">❤️</span>
              <span>by</span>
              <a
                href="https://darshanrami-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400 hover:from-cyan-300 hover:to-lime-300 underline decoration-cyan-400/50 hover:decoration-lime-400 transition-all cursor-pointer"
              >
                Darshan
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
