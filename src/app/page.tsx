'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import LoginView from '@/components/LoginView';
import SummaryCards from '@/components/SummaryCards';
import FilterBar from '@/components/FilterBar';
import RecordsTable from '@/components/RecordsTable';
import RecordModal from '@/components/RecordModal';
import DeleteModal from '@/components/DeleteModal';
import { ITeaCoffeeRecord } from '@/models/Record';
import { Sparkles, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [admin, setAdmin] = useState<{ name: string; email: string }>({
    name: 'Iflora',
    email: 'iflora@gmail.com',
  });

  // Records state
  const [records, setRecords] = useState<ITeaCoffeeRecord[]>([]);
  const [totals, setTotals] = useState({
    tea: 0,
    coffee: 0,
    grandTotal: 0,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filters state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreset, setActivePreset] = useState<'today' | 'thisMonth' | 'all' | 'custom'>('thisMonth');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ITeaCoffeeRecord | null>(null);
  const [deleteRecordTarget, setDeleteRecordTarget] = useState<ITeaCoffeeRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

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

  // Check auth session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.admin) {
          setIsAuthenticated(true);
          setAdmin(data.admin);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  // Set default initial preset to 'thisMonth'
  useEffect(() => {
    setSelectedMonth(getCurrentMonthString());
  }, []);

  // Fetch records
  const fetchRecords = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      if (selectedMonth && !selectedDate) params.append('month', selectedMonth);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/records?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.records);
        setTotals(data.totals);
      } else {
        showToast(data.message || 'Error fetching records', 'error');
      }
    } catch {
      showToast('Could not load records from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, selectedMonth, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated, fetchRecords]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Handle Presets
  const handleSetPreset = (preset: 'today' | 'thisMonth' | 'all') => {
    setActivePreset(preset);
    if (preset === 'today') {
      const today = getTodayString();
      setSelectedDate(today);
      setSelectedMonth('');
    } else if (preset === 'thisMonth') {
      setSelectedDate('');
      setSelectedMonth(getCurrentMonthString());
    } else if (preset === 'all') {
      setSelectedDate('');
      setSelectedMonth('');
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date) {
      setSelectedMonth('');
      setActivePreset(date === getTodayString() ? 'today' : 'custom');
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSelectedDate('');
    if (month) {
      setActivePreset(month === getCurrentMonthString() ? 'thisMonth' : 'custom');
    }
  };

  const handleClearFilters = () => {
    setSelectedDate('');
    setSelectedMonth('');
    setSearchQuery('');
    setActivePreset('all');
  };

  // Save Record (Add or Update)
  const handleSaveRecord = async (recordData: {
    date: string;
    session: 'Morning' | 'Evening';
    tea: number;
    coffee: number;
    note: string;
  }) => {
    if (editRecord) {
      // Update
      const res = await fetch(`/api/records/${editRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update record');
      }
      showToast('Record updated successfully');
    } else {
      // Add
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add record');
      }
      showToast('New record added successfully');
    }

    fetchRecords();
  };

  // Delete Record
  const handleConfirmDelete = async () => {
    if (!deleteRecordTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/records/${deleteRecordTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete record');
      }
      showToast('Record deleted successfully');
      setDeleteRecordTarget(null);
      fetchRecords();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine human-readable filter description
  const getFilterDescription = () => {
    if (selectedDate) return `Single Date (${selectedDate})`;
    if (selectedMonth) return `Month (${selectedMonth})`;
    if (searchQuery) return `Search: "${searchQuery}"`;
    return 'All Records';
  };

  // Export filtered records to Excel spreadsheet
  const handleExportExcel = () => {
    if (records.length === 0) {
      showToast('No records to download', 'error');
      return;
    }

    try {
      type ExcelRow = {
        'Sr No': number | string;
        'Date': string;
        'Session': string;
        'Tea Count (Cups)': number;
        'Coffee Count (Cups)': number;
        'Total Cups': number;
        'Notes / Remarks': string;
      };

      // Format rows for Excel
      const dataForExcel: ExcelRow[] = records.map((record, index) => ({
        'Sr No': index + 1,
        'Date': record.date,
        'Session': record.session || 'Morning',
        'Tea Count (Cups)': Number(record.tea) || 0,
        'Coffee Count (Cups)': Number(record.coffee) || 0,
        'Total Cups': (Number(record.tea) || 0) + (Number(record.coffee) || 0),
        'Notes / Remarks': record.note || '',
      }));

      // Add a summary row at the bottom
      const totalTea = records.reduce((acc, curr) => acc + (Number(curr.tea) || 0), 0);
      const totalCoffee = records.reduce((acc, curr) => acc + (Number(curr.coffee) || 0), 0);
      const grandTotal = totalTea + totalCoffee;

      dataForExcel.push({
        'Sr No': '',
        'Date': 'TOTAL',
        'Session': '',
        'Tea Count (Cups)': totalTea,
        'Coffee Count (Cups)': totalCoffee,
        'Total Cups': grandTotal,
        'Notes / Remarks': `Filter: ${getFilterDescription()}`,
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

      // Auto-fit column widths
      worksheet['!cols'] = [
        { wch: 8 },  // Sr No
        { wch: 14 }, // Date
        { wch: 12 }, // Session
        { wch: 18 }, // Tea Count
        { wch: 20 }, // Coffee Count
        { wch: 14 }, // Total Cups
        { wch: 35 }, // Notes
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tea & Coffee Log');

      // Create dynamic filename based on filter
      const dateSuffix = selectedDate || selectedMonth || new Date().toISOString().slice(0, 10);
      const filename = `Tea_Coffee_Records_${dateSuffix}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      showToast(`Excel file downloaded successfully! (${filename})`);
    } catch (err: unknown) {
      console.error(err);
      showToast('Failed to export Excel file', 'error');
    }
  };

  // Show loading spinner while determining authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06080e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-cyan-300 tracking-wider">
            Loading Tea-Coffee System...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, show user the requested login screen
  if (!isAuthenticated) {
    return (
      <LoginView
        onSuccess={(adminData) => {
          setAdmin(adminData);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 relative">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-xs font-medium text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar adminName={admin.name} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        
        {/* Page Title & Status with Add Button on Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Daily Counter &amp; Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Manage everyday tea &amp; coffee cups, analyze trends with date &amp; month filters.
            </p>
          </div>

          {/* Add Tea-Coffee Button in row of "Daily Counter & Tracker" right side */}
          <button
            type="button"
            onClick={() => {
              setEditRecord(null);
              setIsModalOpen(true);
            }}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-400 hover:from-cyan-300 hover:to-lime-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-slate-950/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            </div>
            <span>Add Tea-Coffee</span>
          </button>
        </div>

        {/* Two-Column Section: Left (2x2 Summary Cards) & Right (Filter & Search Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 items-stretch">
          {/* Left Side: Summary Cards in 2x2 grid */}
          <div className="w-full h-full">
            <SummaryCards totals={totals} filterDescription={getFilterDescription()} />
          </div>

          {/* Right Side: All Filter Buttons and Fields */}
          <div className="w-full h-full">
            <FilterBar
              selectedDate={selectedDate}
              onChangeDate={handleDateChange}
              selectedMonth={selectedMonth}
              onChangeMonth={handleMonthChange}
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
              onClearFilters={handleClearFilters}
              onSetPreset={handleSetPreset}
              activePreset={activePreset}
              onExportExcel={handleExportExcel}
              recordsCount={records.length}
            />
          </div>
        </div>

        {/* Table View of existing and newly added records */}
        <RecordsTable
          records={records}
          isLoading={isLoading}
          onOpenAddModal={() => {
            setEditRecord(null);
            setIsModalOpen(true);
          }}
          onEdit={(record) => {
            setEditRecord(record);
            setIsModalOpen(true);
          }}
          onDelete={(record) => {
            setDeleteRecordTarget(record);
          }}
        />

      </main>

      {/* Add / Edit Record Modal */}
      <RecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditRecord(null);
        }}
        onSave={handleSaveRecord}
        editRecord={editRecord}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteRecordTarget}
        record={deleteRecordTarget}
        onClose={() => setDeleteRecordTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
}
