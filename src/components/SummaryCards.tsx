'use client';

import React from 'react';
import { Coffee, CupSoda, Layers, CalendarDays } from 'lucide-react';

interface SummaryCardsProps {
  totals: {
    tea: number;
    coffee: number;
    grandTotal: number;
    count: number;
  };
  filterDescription: string;
}

export default function SummaryCards({ totals, filterDescription }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 h-full">
      
      {/* 1. Total Tea Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#090e1a]/85 backdrop-blur-md border border-cyan-500/30 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Total Tea
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <CupSoda className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {totals.tea.toLocaleString()}
            </span>
            <span className="text-xs text-cyan-400/80 font-medium">cups</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Daily Chai Count</span>
        </div>
      </div>

      {/* 2. Total Coffee Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#090e1a]/85 backdrop-blur-md border border-lime-500/30 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-lime-400 hover:shadow-[0_0_20px_rgba(57,255,20,0.25)]">
        <div className="absolute top-0 right-0 w-20 h-20 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-300">
              Total Coffee
            </span>
            <div className="w-9 h-9 rounded-xl bg-lime-500/20 border border-lime-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(57,255,20,0.3)]">
              <Coffee className="w-4 h-4 text-lime-300" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {totals.coffee.toLocaleString()}
            </span>
            <span className="text-xs text-lime-400/80 font-medium">cups</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
          <span>Daily Coffee Count</span>
        </div>
      </div>

      {/* 3. Grand Total Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1426] to-[#070f1a] backdrop-blur-md border border-cyan-400/50 p-4 sm:p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 hover:border-lime-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-lime-500/10 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
              Grand Total
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-lime-500/30 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Layers className="w-4 h-4 text-cyan-200" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {totals.grandTotal.toLocaleString()}
            </span>
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400 font-semibold">
              all drinks
            </span>
          </div>
        </div>
        <div className="relative mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-cyan-400 font-mono font-medium">{totals.tea} Tea</span>
          <span>+</span>
          <span className="text-lime-400 font-mono font-medium">{totals.coffee} Coffee</span>
        </div>
      </div>

      {/* 4. Filtered Records Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-[#090e1a]/85 backdrop-blur-md border border-slate-700/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filtered Records
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-200 tracking-tight">
              {totals.count}
            </span>
            <span className="text-xs text-slate-400">entries</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
          Active: <span className="text-cyan-300 font-medium">{filterDescription}</span>
        </div>
      </div>

    </div>
  );
}
