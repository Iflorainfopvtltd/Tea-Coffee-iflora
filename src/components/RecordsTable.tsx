'use client';

import React from 'react';
import { ITeaCoffeeRecord } from '@/models/Record';
import { Edit3, Trash2, CupSoda, Coffee, FileText, Calendar, Plus, Sun, Sunset } from 'lucide-react';

interface RecordsTableProps {
  records: ITeaCoffeeRecord[];
  isLoading: boolean;
  onEdit: (record: ITeaCoffeeRecord) => void;
  onDelete: (record: ITeaCoffeeRecord) => void;
  onOpenAddModal: () => void;
}

export default function RecordsTable({
  records,
  isLoading,
  onEdit,
  onDelete,
  onOpenAddModal,
}: RecordsTableProps) {
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

  return (
    <div className="bg-[#090e1a]/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.6)]">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></span>
          <h2 className="text-base font-bold text-slate-100 tracking-wide">
            Tea &amp; Coffee Log
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {records.length} records
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4 text-center">Session</th>
              <th className="py-3.5 px-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-cyan-300">
                  <CupSoda className="w-3.5 h-3.5 text-cyan-400" /> Tea Count
                </span>
              </th>
              <th className="py-3.5 px-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-lime-300">
                  <Coffee className="w-3.5 h-3.5 text-lime-400" /> Coffee Count
                </span>
              </th>
              <th className="py-3.5 px-4 text-center">Total Cups</th>
              <th className="py-3.5 px-4">Notes / Remarks</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="inline-flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-cyan-300">Loading records from database...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-200 mb-1">
                      (No Records Found)
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 text-center">
                      There are no tea &amp; coffee records matching your current filter. Click below to add one!
                    </p>
                    <button
                      onClick={onOpenAddModal}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-lime-400 hover:from-cyan-300 hover:to-lime-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Tea-Coffee Entry</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const teaCount = Number(record.tea) || 0;
                const coffeeCount = Number(record.coffee) || 0;
                const rowTotal = teaCount + coffeeCount;
                const session = record.session || 'Morning';

                return (
                  <tr
                    key={record._id}
                    className="hover:bg-slate-900/60 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                          <Calendar className="w-4 h-4 text-slate-300 group-hover:text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 text-sm">
                            {formatDate(record.date)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Session (Morning / Evening) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {session === 'Morning' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.15)]">
                          <Sun className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Morning</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-lime-950/60 text-lime-300 border border-lime-500/40 shadow-[0_0_8px_rgba(57,255,20,0.15)]">
                          <Sunset className="w-3.5 h-3.5 text-lime-400" />
                          <span>Evening</span>
                        </span>
                      )}
                    </td>

                    {/* Tea Count */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[54px] px-3 py-1 rounded-xl text-xs font-black bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                        {teaCount}
                      </span>
                    </td>

                    {/* Coffee Count */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[54px] px-3 py-1 rounded-xl text-xs font-black bg-lime-950/60 text-lime-300 border border-lime-500/40 shadow-[0_0_8px_rgba(57,255,20,0.2)]">
                        {coffeeCount}
                      </span>
                    </td>

                    {/* Total Cups */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[46px] px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-slate-100 border border-slate-700">
                        {rowTotal}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {record.note ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate" title={record.note}>
                            {record.note}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">No notes</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(record)}
                          title="Edit Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/40 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(record)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-500/40 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
