import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';
import { 
  CalendarCheck, 
  Printer, 
  Save, 
  CheckCircle, 
  CheckCircle2, 
  Layers, 
  Calendar as CalendarIcon, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  Filter
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const profile = StorageService.getProfile();
  const allStudents = StorageService.getStudents();
  
  // Scoped students based on selectedClass
  const students = allStudents.filter(s => s.classId === selectedClass);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthlyRecap'>('daily');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');

  // Load existing records or default to Hadir
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get records for selectedDate and selectedClass
  const currentDayMap = React.useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceList
      .filter(a => a.date === selectedDate && a.classId === selectedClass)
      .forEach(a => map.set(a.studentId, a));
    return map;
  }, [attendanceList, selectedDate, selectedClass]);

  // Current working state for students on this date
  const [workingStatus, setWorkingStatus] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});

  // Sync working status when date or class changes
  React.useEffect(() => {
    const initial: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach(s => {
      const rec = currentDayMap.get(s.id);
      initial[s.id] = {
        status: rec ? rec.status : 'H',
        note: rec ? rec.note || '' : ''
      };
    });
    setWorkingStatus(initial);
  }, [selectedDate, selectedClass, students, currentDayMap]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setWorkingStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setWorkingStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach(s => {
      updated[s.id] = { status: 'H', note: workingStatus[s.id]?.note || '' };
    });
    setWorkingStatus(updated);
  };

  const handleSaveAttendance = () => {
    const newRecords: AttendanceRecord[] = students.map(s => {
      const item = workingStatus[s.id] || { status: 'H', note: '' };
      return {
        id: `att-${selectedClass}-${s.id}-${selectedDate}`,
        date: selectedDate,
        classId: selectedClass,
        studentId: s.id,
        studentName: s.name,
        status: item.status,
        note: item.note,
        recordedBy: currentUser?.name || 'Guru Pengampu',
        updatedAt: new Date().toISOString()
      };
    });

    StorageService.recordAttendanceBatch(newRecords);
    setAttendanceList(StorageService.getAttendance());

    // Asynchronously push to Google Sheets
    newRecords.forEach(rec => SheetsSyncService.saveSingleRecord('Absensi', rec));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate Monthly Statistics for Recap Table
  const monthlyRecords = React.useMemo(() => {
    return attendanceList.filter(a => a.classId === selectedClass && a.date.startsWith(selectedMonth));
  }, [attendanceList, selectedClass, selectedMonth]);

  const studentRecap = React.useMemo(() => {
    return students.map(st => {
      const stRecords = monthlyRecords.filter(r => r.studentId === st.id);
      const hCount = stRecords.filter(r => r.status === 'H').length;
      const sCount = stRecords.filter(r => r.status === 'S').length;
      const iCount = stRecords.filter(r => r.status === 'I').length;
      const aCount = stRecords.filter(r => r.status === 'A').length;
      const tCount = stRecords.filter(r => r.status === 'T').length;
      const total = stRecords.length;
      const percentage = total > 0 ? Math.round(((hCount + tCount) / total) * 100) : 100;

      return {
        ...st,
        hCount,
        sCount,
        iCount,
        aCount,
        tCount,
        total,
        percentage
      };
    });
  }, [students, monthlyRecords]);

  // Status colors helper
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'H': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'I': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'S': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'A': return 'bg-red-100 text-red-800 border-red-300';
      case 'T': return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          OFFICIAL PRINT VIEW (Visible ONLY when printing - @media print)
      ========================================================================= */}
      <div className="print-only">
        {/* Kop Surat Resmi */}
        <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">
            PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA
          </h2>
          <h1 className="text-lg font-black uppercase tracking-tight text-slate-950">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </h1>
          <h2 className="text-base font-extrabold text-slate-900">
            {profile.schoolName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {profile.address} | Telp: {profile.phone} | Email: {profile.email}
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            NPSN: {profile.npsn} · Terakreditasi: {profile.accreditation}
          </p>
        </div>

        {/* Judul Laporan Cetak */}
        <div className="text-center mb-6">
          <h3 className="text-base font-black underline uppercase text-slate-900">
            LAPORAN REKAPITULASI PRESENSI KEHADIRAN SISWA
          </h3>
          <p className="text-xs text-slate-700 mt-1">
            Rombongan Belajar: <strong className="font-bold">{selectedClass}</strong> | Semester: <strong className="font-bold">{profile.semester}</strong> | Tahun Ajaran: <strong className="font-bold">{profile.academicYear}</strong>
          </p>
          <p className="text-xs text-slate-600">
            Periode: Bulan {selectedMonth} (Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })})
          </p>
        </div>

        {/* Tabel Cetak Presensi */}
        <table className="w-full text-xs border border-slate-900 mb-8">
          <thead>
            <tr className="bg-slate-200 text-slate-950 font-bold text-center">
              <th className="border border-slate-900 py-1.5 px-2 w-10">No</th>
              <th className="border border-slate-900 py-1.5 px-3 w-28">NIS / NISN</th>
              <th className="border border-slate-900 py-1.5 px-4 text-left">Nama Peserta Didik</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">L/P</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">Hadir (H)</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">Sakit (S)</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">Izin (I)</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">Alpa (A)</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12">Terlambat (T)</th>
              <th className="border border-slate-900 py-1.5 px-2 w-20">% Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            {studentRecap.map((st, idx) => (
              <tr key={st.id} className="text-center">
                <td className="border border-slate-900 py-1 px-2">{idx + 1}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono text-[10px]">{st.nisn || st.nis}</td>
                <td className="border border-slate-900 py-1 px-4 text-left font-bold">{st.name}</td>
                <td className="border border-slate-900 py-1 px-2">{st.gender}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{st.hCount}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{st.sCount}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{st.iCount}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{st.aCount}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{st.tCount}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono font-bold">{st.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tanda Tangan Cetak Resmi */}
        <div className="grid grid-cols-2 pt-6 text-xs text-center">
          <div>
            <p className="mb-16">
              Mengetahui,<br />
              <strong>Kepala {profile.schoolName}</strong>
            </p>
            <p className="font-bold underline uppercase">{profile.principalName}</p>
            <p className="font-mono text-[10px]">NIP. {profile.principalNip}</p>
          </div>
          <div>
            <p className="mb-16">
              Jakarta, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br />
              <strong>Guru Kelas / Wali Kelas {selectedClass}</strong>
            </p>
            <p className="font-bold underline uppercase">{currentUser?.name || 'Siti Rahmawati, S.Pd.'}</p>
            <p className="font-mono text-[10px]">NIP. {currentUser?.nip || '198504122010012015'}</p>
          </div>
        </div>
      </div>


      {/* =========================================================================
          INTERACTIVE SCREEN VIEW (Web App)
      ========================================================================= */}
      <div className="no-print space-y-6">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck className="w-4 h-4 text-amber-500" />
              <span>Modul Presensi Siswa</span>
              <span>·</span>
              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{selectedClass}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Presensi & Rekapitulasi Kehadiran</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan harian, kalkulasi otomatis persentase kehadiran bulanan, dan ekspor cetak KOP resmi.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-red-600" />
              <span>Cetak Laporan Presensi</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Presensi kelas <strong>{selectedClass}</strong> tanggal <strong>{selectedDate}</strong> berhasil disimpan dan disinkronkan ke Google Sheets!</span>
          </div>
        )}

        {/* Tab Controls: Harian vs Rekap Bulanan */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'daily'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Input Presensi Harian
            </button>
            <button
              onClick={() => setActiveTab('monthlyRecap')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'monthlyRecap'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekapitulasi Bulanan
            </button>
          </div>

          {activeTab === 'daily' ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-600">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="font-mono text-xs font-bold text-slate-800 focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
              >
                Tandai Semua Hadir (H)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-600">Pilih Bulan:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="font-mono text-xs font-bold text-slate-800 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* TAB 1: INPUT PRESENSI HARIAN */}
        {activeTab === 'daily' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Daftar Presensi {selectedClass} — {selectedDate}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Klik status kehadiran untuk setiap siswa, lalu klik "Simpan Presensi".
                </p>
              </div>

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Presensi Hari Ini</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-32">NIS / NISN</th>
                    <th className="py-3 px-4">Nama Peserta Didik</th>
                    <th className="py-3 px-4 w-16 text-center">L/P</th>
                    <th className="py-3 px-4 text-center">Status Kehadiran</th>
                    <th className="py-3 px-4 w-52">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, idx) => {
                    const currentStatus = workingStatus[student.id]?.status || 'H';
                    const currentNote = workingStatus[student.id]?.note || '';

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{student.nisn || student.nis}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{student.name}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{student.gender}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {(['H', 'S', 'I', 'A', 'T'] as AttendanceStatus[]).map(st => {
                              const isSelected = currentStatus === st;
                              let label = 'Hadir';
                              if (st === 'S') label = 'Sakit';
                              if (st === 'I') label = 'Izin';
                              if (st === 'A') label = 'Alpa';
                              if (st === 'T') label = 'Telat';

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, st)}
                                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                                    isSelected
                                      ? `${getStatusBadge(st)} shadow-xs scale-105`
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  {st} <span className="hidden sm:inline font-normal text-[10px]">({label})</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={currentNote}
                            onChange={e => handleNoteChange(student.id, e.target.value)}
                            placeholder="Catatan izin/alpa/terlambat..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Total Siswa: <strong className="text-slate-800 font-mono">{students.length}</strong></span>
                <span>Hadir: <strong className="text-emerald-700 font-mono">{Object.values(workingStatus).filter(s => s.status === 'H').length}</strong></span>
                <span>Sakit: <strong className="text-amber-700 font-mono">{Object.values(workingStatus).filter(s => s.status === 'S').length}</strong></span>
                <span>Izin: <strong className="text-blue-700 font-mono">{Object.values(workingStatus).filter(s => s.status === 'I').length}</strong></span>
                <span>Alpa: <strong className="text-red-700 font-mono">{Object.values(workingStatus).filter(s => s.status === 'A').length}</strong></span>
              </div>

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REKAPITULASI BULANAN */}
        {activeTab === 'monthlyRecap' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Rekapitulasi Kehadiran Siswa {selectedClass} — Periode {selectedMonth}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Perhitungan akumulasi kehadiran per siswa untuk bahan rapor dan laporan bulanan.
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap Ini</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-32">NIS / NISN</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 text-center">Hadir</th>
                    <th className="py-3 px-3 text-center">Sakit</th>
                    <th className="py-3 px-3 text-center">Izin</th>
                    <th className="py-3 px-3 text-center">Alpa</th>
                    <th className="py-3 px-3 text-center">Terlambat</th>
                    <th className="py-3 px-4 text-center font-bold text-slate-900">% Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentRecap.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{st.nisn || st.nis}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{st.name}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-emerald-700">{st.hCount}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-amber-700">{st.sCount}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-blue-700">{st.iCount}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-red-700">{st.aCount}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-purple-700">{st.tCount}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                          st.percentage >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          st.percentage >= 75 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {st.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
