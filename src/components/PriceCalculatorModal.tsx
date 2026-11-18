'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ITeaCoffeeRecord } from '@/models/Record';
import {
  X,
  Calculator,
  CupSoda,
  Coffee,
  IndianRupee,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Receipt,
  Calendar,
  Sun,
  Sunset,
  Filter,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecords: ITeaCoffeeRecord[];
}

type FilterMode = 'all' | 'single' | 'range' | 'month';

export default function PriceCalculatorModal({
  isOpen,
  onClose,
  initialRecords,
}: PriceCalculatorModalProps) {
  // Price inputs state (temporary, not stored in DB)
  const MAX_PRICE_PER_CUP = 10000;
  const [teaPriceInput, setTeaPriceInput] = useState<string>('');
  const [coffeePriceInput, setCoffeePriceInput] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Sanitized change handler for price inputs (limits typing and pasting to max 10,000)
  const handlePriceInputChange = (
    val: string,
    setter: (v: string) => void
  ) => {
    if (val === '') {
      setter('');
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
      return;
    }

    if (num < 0) {
      setter('0');
      return;
    }

    if (num > MAX_PRICE_PER_CUP) {
      setter(String(MAX_PRICE_PER_CUP));
      return;
    }

    setter(val);
  };

  const handlePricePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    const num = parseFloat(pastedText);
    if (isNaN(num)) return;

    if (num > MAX_PRICE_PER_CUP) {
      setter(String(MAX_PRICE_PER_CUP));
    } else if (num < 0) {
      setter('0');
    } else {
      setter(String(num));
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  // Date Filter State inside the modal
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [singleDate, setSingleDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Records loaded for calculation
  const [records, setRecords] = useState<ITeaCoffeeRecord[]>(initialRecords);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper date generators
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentMonthString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  };

  // Reset or initialize records when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecords(initialRecords);
      // Reset filter mode to 'all' or keep current
    }
  }, [isOpen, initialRecords]);

  // Fetch records dynamically when date filter changes
  const fetchFilteredRecords = useCallback(async () => {
    if (!isOpen) return;

    // If 'all', we can either use initialRecords or fetch all
    if (filterMode === 'all') {
      setRecords(initialRecords);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (filterMode === 'single' && singleDate) {
        params.append('date', singleDate);
      } else if (filterMode === 'range') {
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      } else if (filterMode === 'month' && selectedMonth) {
        params.append('month', selectedMonth);
      }

      const res = await fetch(`/api/records?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Failed to fetch filtered records for calculator:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, filterMode, singleDate, startDate, endDate, selectedMonth, initialRecords]);

  useEffect(() => {
    fetchFilteredRecords();
  }, [fetchFilteredRecords]);

  // Compute total cups from current scoped records
  const { totalTeaCups, totalCoffeeCups, totalCups } = useMemo(() => {
    let teaSum = 0;
    let coffeeSum = 0;

    for (const r of records) {
      teaSum += Number(r.tea) || 0;
      coffeeSum += Number(r.coffee) || 0;
    }

    return {
      totalTeaCups: teaSum,
      totalCoffeeCups: coffeeSum,
      totalCups: teaSum + coffeeSum,
    };
  }, [records]);

  // Numeric rates (capped strictly at MAX_PRICE_PER_CUP = 10,000)
  const teaRate = Math.min(MAX_PRICE_PER_CUP, Math.max(0, parseFloat(teaPriceInput) || 0));
  const coffeeRate = Math.min(MAX_PRICE_PER_CUP, Math.max(0, parseFloat(coffeePriceInput) || 0));

  // Calculations
  const totalTeaAmount = totalTeaCups * teaRate;
  const totalCoffeeAmount = totalCoffeeCups * coffeeRate;
  const grandTotalAmount = totalTeaAmount + totalCoffeeAmount;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    }).format(val);
  };

  const handleResetPrices = () => {
    setTeaPriceInput('');
    setCoffeePriceInput('');
  };

  const handleResetAll = () => {
    setTeaPriceInput('');
    setCoffeePriceInput('');
    setFilterMode('all');
    setSingleDate('');
    setStartDate('');
    setEndDate('');
    setSelectedMonth('');
    setRecords(initialRecords);
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(dateObj);
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-[1.5px] bg-gradient-to-b from-cyan-400 via-teal-500/40 to-lime-400/60 shadow-[0_0_40px_rgba(0,240,255,0.25)] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-[23px] bg-[#090e18] p-5 sm:p-7 text-slate-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-lime-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <Calculator className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>Price Calculator</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Live Estimator
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculate bill by date filter with custom tea &amp; coffee rates
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DATE FILTER SECTION */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex flex-col gap-3 shadow-[0_0_15px_rgba(0,240,255,0.08)]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filter Records by Date</span>
              </span>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Scoped
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('single');
                    if (!singleDate) setSingleDate(getTodayString());
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterMode === 'single'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Single Date
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('range');
                    if (!startDate) setStartDate(getTodayString());
                    if (!endDate) setEndDate(getTodayString());
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterMode === 'range'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Date Range
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('month');
                    if (!selectedMonth) setSelectedMonth(getCurrentMonthString());
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterMode === 'month'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  By Month
                </button>
              </div>
            </div>

            {/* Inputs based on chosen mode */}
            {filterMode === 'single' && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSingleDate(getTodayString())}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  Today
                </button>
              </div>
            )}

            {filterMode === 'range' && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] text-slate-400 mb-1 block">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] text-slate-400 mb-1 block">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            )}

            {filterMode === 'month' && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMonth(getCurrentMonthString())}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  This Month
                </button>
              </div>
            )}

            {/* Current Filter Scope Status */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 text-slate-300 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Scope:</span>
                <span className="font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                  {isLoading ? 'Loading...' : `${records.length} records`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  <CupSoda className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold">{totalTeaCups}</span>
                  <span className="text-[10px] text-cyan-400/80">Tea</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-lime-950/60 text-lime-300 border border-lime-500/30">
                  <Coffee className="w-3 h-3 text-lime-400" />
                  <span className="font-bold">{totalCoffeeCups}</span>
                  <span className="text-[10px] text-lime-400/80">Coffee</span>
                </span>
              </div>
            </div>
          </div>

          {/* Price Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tea Price Input */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/25 flex flex-col gap-3 focus-within:border-cyan-400 transition-colors">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <CupSoda className="w-4 h-4 text-cyan-400" />
                  <span>Tea Price (Per Cup)</span>
                </label>
                <span className="text-[10px] text-cyan-400/80 font-mono font-medium">Max ₹10,000 / Cup</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  max={MAX_PRICE_PER_CUP}
                  step="any"
                  value={teaPriceInput}
                  onChange={(e) => handlePriceInputChange(e.target.value, setTeaPriceInput)}
                  onPaste={(e) => handlePricePaste(e, setTeaPriceInput)}
                  onKeyDown={handlePriceKeyDown}
                  placeholder="Enter tea rate (max 10,000)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-semibold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all placeholder:text-slate-600"
                />
              </div>

              {parseFloat(teaPriceInput) >= MAX_PRICE_PER_CUP && (
                <span className="text-[10px] text-amber-400 font-medium -mt-1.5">
                  ⚠️ Max price limit ₹10,000 per cup reached
                </span>
              )}

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Quick:</span>
                {[10, 12, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTeaPriceInput(String(preset))}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                      teaPriceInput === String(preset)
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                        : 'bg-slate-900/90 text-cyan-300 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Coffee Price Input */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-lime-500/25 flex flex-col gap-3 focus-within:border-lime-400 transition-colors">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-lime-300 flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-lime-400" />
                  <span>Coffee Price (Per Cup)</span>
                </label>
                <span className="text-[10px] text-lime-400/80 font-mono font-medium">Max ₹10,000 / Cup</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-lime-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  max={MAX_PRICE_PER_CUP}
                  step="any"
                  value={coffeePriceInput}
                  onChange={(e) => handlePriceInputChange(e.target.value, setCoffeePriceInput)}
                  onPaste={(e) => handlePricePaste(e, setCoffeePriceInput)}
                  onKeyDown={handlePriceKeyDown}
                  placeholder="Enter coffee rate (max 10,000)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-semibold text-sm focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/40 transition-all placeholder:text-slate-600"
                />
              </div>

              {parseFloat(coffeePriceInput) >= MAX_PRICE_PER_CUP && (
                <span className="text-[10px] text-amber-400 font-medium -mt-1.5">
                  ⚠️ Max price limit ₹10,000 per cup reached
                </span>
              )}

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Quick:</span>
                {[15, 20, 25, 30].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCoffeePriceInput(String(preset))}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                      coffeePriceInput === String(preset)
                        ? 'bg-lime-400 text-slate-950 border-lime-300 shadow-[0_0_8px_rgba(57,255,20,0.4)]'
                        : 'bg-slate-900/90 text-lime-300 border-slate-800 hover:border-lime-500/50 hover:bg-slate-800'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Calculation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Tea Price */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div>
                <span className="text-[11px] font-bold text-cyan-400/90 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CupSoda className="w-3.5 h-3.5" />
                  <span>Total Tea Price</span>
                </span>
                <div className="text-2xl font-black text-cyan-300 tracking-tight flex items-center">
                  <span>₹</span>
                  <span>{formatCurrency(totalTeaAmount)}</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                {totalTeaCups} cups × ₹{teaRate}
              </div>
            </div>

            {/* Total Coffee Price */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-950/40 to-slate-950 border border-lime-500/30 flex flex-col justify-between shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              <div>
                <span className="text-[11px] font-bold text-lime-400/90 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Total Coffee Price</span>
                </span>
                <div className="text-2xl font-black text-lime-300 tracking-tight flex items-center">
                  <span>₹</span>
                  <span>{formatCurrency(totalCoffeeAmount)}</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                {totalCoffeeCups} cups × ₹{coffeeRate}
              </div>
            </div>
          </div>

          {/* Grand Total Price Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-lime-950/70 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-lime-400 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)] shrink-0">
                <Sparkles className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block">
                  Grand Total Price
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Tea (₹{formatCurrency(totalTeaAmount)}) + Coffee (₹{formatCurrency(totalCoffeeAmount)})
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-lime-300 tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                ₹{formatCurrency(grandTotalAmount)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Total Drinks: {totalCups} cups
              </div>
            </div>
          </div>

          {/* Toggle Per-Record Detailed Breakdown */}
          {records.length > 0 && (teaRate > 0 || coffeeRate > 0) && (
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/50">
              <button
                type="button"
                onClick={() => setShowBreakdown((prev) => !prev)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <span>View Record-by-Record Price Breakdown ({records.length} items)</span>
                </span>
                {showBreakdown ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showBreakdown && (
                <div className="max-h-60 overflow-y-auto border-t border-slate-800 divide-y divide-slate-800/60 text-xs">
                  {records.map((r) => {
                    const rTea = Number(r.tea) || 0;
                    const rCoffee = Number(r.coffee) || 0;
                    const rTeaCost = rTea * teaRate;
                    const rCoffeeCost = rCoffee * coffeeRate;
                    const rTotalCost = rTeaCost + rCoffeeCost;
                    const session = r.session || 'Morning';

                    return (
                      <div
                        key={r._id}
                        className="px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-900/40"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium text-slate-200">
                            {formatDate(r.date)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              session === 'Morning'
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                                : 'bg-lime-950/80 text-lime-300 border border-lime-500/30'
                            }`}
                          >
                            {session === 'Morning' ? (
                              <Sun className="w-2.5 h-2.5" />
                            ) : (
                              <Sunset className="w-2.5 h-2.5" />
                            )}
                            {session}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-cyan-300">
                            {rTea}T (₹{formatCurrency(rTeaCost)})
                          </span>
                          <span className="text-lime-300">
                            {rCoffee}C (₹{formatCurrency(rCoffeeCost)})
                          </span>
                          <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            ₹{formatCurrency(rTotalCost)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Footer note & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 text-center sm:text-left flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Temporary calculation only &mdash; rates and totals are not saved in the database.</span>
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-lime-400 hover:from-cyan-300 hover:to-lime-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
