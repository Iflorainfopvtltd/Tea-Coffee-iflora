'use client';

import React from 'react';
import { Calendar, Filter, RotateCcw, Search, SlidersHorizontal, FileSpreadsheet } from 'lucide-react';

interface FilterBarProps {
  selectedDate: string;
  onChangeDate: (date: string) => void;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  onClearFilters: () => void;
  onSetPreset: (preset: 'today' | 'thisMonth' | 'all') => void;
  activePreset: 'today' | 'thisMonth' | 'all' | 'custom';
  onExportExcel: () => void;
  recordsCount: number;
}

export default function FilterBar({
  selectedDate,
  onChangeDate,
  selectedMonth,
  onChangeMonth,
  searchQuery,
  onChangeSearch,
  onClearFilters,
  onSetPreset,
  activePreset,
  onExportExcel,
  recordsCount,
}: FilterBarProps) {
  return (
    <div className="bg-[#090e1a]/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 sm:p-5 h-full flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      
      <div>
        {/* Panel Header & Quick Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Filters &amp; Search
            </span>
          </div>

          {/* Quick Filter Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-0.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Presets:
            </span>

            <button
              type="button"
              onClick={() => onSetPreset('today')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activePreset === 'today'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => onSetPreset('thisMonth')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activePreset === 'thisMonth'
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              This Month
            </button>

            <button
              type="button"
              onClick={() => onSetPreset('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activePreset === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              All Records
            </button>
          </div>
        </div>

        {/* Date & Month Filters in 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          
          {/* Date Filter */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filter by Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer [color-scheme:dark]"
            />
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-xs font-semibold text-lime-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-lime-400" />
              <span>Filter by Month</span>
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all cursor-pointer [color-scheme:dark]"
            />
          </div>

        </div>

        {/* Search Remarks / Note */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Remarks / Note</span>
          </label>
          <input
            type="text"
            placeholder="Search notes (e.g. morning, meeting)..."
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Bottom Actions: Reset Filters & Download in Excel Button */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          disabled={recordsCount === 0}
          title={recordsCount === 0 ? 'No records to download' : 'Download filtered records as Excel (.xlsx)'}
          className="w-full sm:w-2/3 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-400 hover:from-emerald-300 hover:to-lime-200 border border-lime-400/50 shadow-[0_0_15px_rgba(57,255,20,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Download in Excel</span>
          {recordsCount > 0 && (
            <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded-md font-mono">
              {recordsCount}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
