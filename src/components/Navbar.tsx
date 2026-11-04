'use client';

import React from 'react';
import { Coffee, LogOut, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  adminName: string;
  onLogout: () => void;
}

export default function Navbar({ adminName, onLogout }: NavbarProps) {
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-500/20 bg-[#080d1a]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-lime-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Coffee className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-lime-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                Tea-Coffee
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Daily Tea &amp; Coffee Management System
            </p>
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Today Date pill */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span suppressHydrationWarning>{todayFormatted}</span>
          </div>

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-sm">
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                <UserCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_6px_#39ff14]"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {adminName || 'Iflora'}
              </div>
              <div className="text-[10px] font-medium text-lime-400 tracking-wide leading-tight">
                Admin
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            title="Log out"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-red-300 bg-slate-900/80 hover:bg-red-950/30 border border-slate-700/60 hover:border-red-500/50 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

