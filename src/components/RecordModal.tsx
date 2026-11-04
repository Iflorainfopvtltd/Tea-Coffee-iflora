'use client';

import React, { useState, useEffect } from 'react';
import { ITeaCoffeeRecord } from '@/models/Record';
import { X, CupSoda, Coffee, Calendar, FileText, Check, Sun, Sunset } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recordData: {
    date: string;
    session: 'Morning' | 'Evening';
    tea: number;
    coffee: number;
    note: string;
  }) => Promise<void>;
  editRecord: ITeaCoffeeRecord | null;
}

export default function RecordModal({
  isOpen,
  onClose,
  onSave,
  editRecord,
}: RecordModalProps) {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getTodayDateString());
  const [session, setSession] = useState<'Morning' | 'Evening'>('Morning');
  const [tea, setTea] = useState<number>(0);
  const [coffee, setCoffee] = useState<number>(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editRecord) {
      setDate(editRecord.date || getTodayDateString());
      setSession(editRecord.session === 'Evening' ? 'Evening' : 'Morning');
      setTea(Number(editRecord.tea) || 0);
      setCoffee(Number(editRecord.coffee) || 0);
      setNote(editRecord.note || '');
    } else {
      setDate(getTodayDateString());
      setSession('Morning');
      setTea(0);
      setCoffee(0);
      setNote('');
    }
    setError(null);
  }, [editRecord, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a valid date');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave({
        date,
        session,
        tea: Number(tea) || 0,
        coffee: Number(coffee) || 0,
        note: note.trim(),
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving record';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl p-[1.5px] bg-gradient-to-b from-cyan-400 via-slate-800 to-lime-400 shadow-[0_0_35px_rgba(0,240,255,0.25)]">
        <div className="rounded-2xl bg-[#090e18] p-6 sm:p-7">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {editRecord ? 'Edit Tea & Coffee Entry' : 'Add New Daily Entry'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editRecord ? 'Update cups count and session' : 'Enter today or specific date counts'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Date Field (Default Today) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Date</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">(default: today)</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Session Field: Radio Button Options (Morning or Evening) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-lime-300 mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-lime-400" />
                <span>Session / Time</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">• Select Morning or Evening</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Morning Option */}
                <button
                  type="button"
                  onClick={() => setSession('Morning')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    session === 'Morning'
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.35)] ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-700/80 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      session === 'Morning' ? 'border-cyan-400' : 'border-slate-600'
                    }`}
                  >
                    {session === 'Morning' && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                      <Sun className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">Morning</div>
                      <div className="text-[10px] text-cyan-400 font-medium">સવાર</div>
                    </div>
                  </div>
                </button>

                {/* Evening Option */}
                <button
                  type="button"
                  onClick={() => setSession('Evening')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    session === 'Evening'
                      ? 'bg-lime-950/70 border-lime-400 shadow-[0_0_15px_rgba(57,255,20,0.35)] ring-1 ring-lime-400'
                      : 'bg-slate-950/60 border-slate-700/80 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      session === 'Evening' ? 'border-lime-400' : 'border-slate-600'
                    }`}
                  >
                    {session === 'Evening' && (
                      <div className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_6px_#39ff14]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-lime-500/20 border border-lime-400/40 flex items-center justify-center">
                      <Sunset className="w-4 h-4 text-lime-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">Evening</div>
                      <div className="text-[10px] text-lime-400 font-medium">સાંજ</div>
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Counts Grid: Tea & Coffee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Tea Field */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/30">
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CupSoda className="w-4 h-4 text-cyan-400" /> Tea
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Cups</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTea(Math.max(0, tea - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={tea}
                    onChange={(e) => setTea(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full py-2 text-center bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-slate-100 font-black text-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTea(tea + 1)}
                    className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Coffee Field */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-lime-500/30">
                <label className="block text-xs font-bold uppercase tracking-wider text-lime-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-lime-400" /> Coffee
                  </span>
                  <span className="text-[10px] text-lime-400 font-mono">Cups</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCoffee(Math.max(0, coffee - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-lime-400 text-slate-200 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={coffee}
                    onChange={(e) => setCoffee(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full py-2 text-center bg-slate-900 border border-slate-700 focus:border-lime-400 rounded-lg text-slate-100 font-black text-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCoffee(coffee + 1)}
                    className="w-9 h-9 rounded-lg bg-lime-950 border border-lime-500/50 hover:border-lime-400 text-lime-300 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Note / Remarks Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Remarks / Notes (optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Morning batch, evening snacks, guest visit"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Total Preview */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400">Total Cups for this entry ({session}):</span>
              <span className="font-extrabold text-cyan-300 text-sm">
                {(Number(tea) || 0) + (Number(coffee) || 0)} cups
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-400 hover:from-cyan-300 hover:to-lime-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{editRecord ? 'Update Record' : 'Save Record'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
