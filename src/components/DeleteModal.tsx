'use client';

import React from 'react';
import { ITeaCoffeeRecord } from '@/models/Record';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  record: ITeaCoffeeRecord | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteModal({
  isOpen,
  record,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl p-[1.5px] bg-gradient-to-b from-red-500/80 via-slate-800 to-amber-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
        <div className="rounded-2xl bg-[#090e18] p-6">
          
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1">
            Delete Record?
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Are you sure you want to delete the tea-coffee entry for{' '}
            <span className="font-semibold text-cyan-300">{record.date}</span>? This action cannot be undone.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mb-5">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Session:</span>
              <span className="font-bold text-cyan-300">{record.session || 'Morning'}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Tea:</span>
              <span className="font-bold text-cyan-400">{record.tea} cups</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Coffee:</span>
              <span className="font-bold text-lime-400">{record.coffee} cups</span>
            </div>
            {record.note && (
              <div className="flex justify-between py-0.5 border-t border-slate-800/80 mt-1 pt-1">
                <span className="text-slate-500">Note:</span>
                <span className="text-slate-300 truncate max-w-[200px]">{record.note}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

