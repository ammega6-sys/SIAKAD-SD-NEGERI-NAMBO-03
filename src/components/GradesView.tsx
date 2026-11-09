import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService, calculateGrade } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { GradeRecord, Student } from '../types';
import { 
  FileSpreadsheet, 
  Printer, 
  Save, 
  CheckCircle, 
  Layers, 
  BookOpen, 
  Edit3, 
  Award,
  Filter,
  Sparkles
} from 'lucide-react';

export const GradesView: React.FC = () => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const profile = StorageService.getProfile();
  const allStudents = StorageService.getStudents();
  
  // Scoped students based on selectedClass
  const students = allStudents.filter(s => s.classId === selectedClass);

  const subjects = [
    "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    "Matematika",
    "Bahasa Indonesia",
    "Pendidikan Pancasila",
    "Pendidikan Jasmani & Kesehatan",
    "Seni & Budaya"
  ];

  // Default to teacher's subject if applicable
  const defaultSubject = (currentUser?.subject && subjects.includes(currentUser.subject))
    ? currentUser.subject
    : subjects[0];

  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [allGrades, setAllGrades] = useState<GradeRecord[]>(() => StorageService.getGrades());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active editable row modal
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    studentName: string;
    uh1: number;
    uh2: number;
    uh3: number;
    uh4: number;
    uh5: number;
    asts: number;
    asas: number;
  } | null>(null);

  // Compute table rows for all students in this class for the selectedSubject
  const classSubjectGrades = React.useMemo(() => {
    return students.map(student => {
      const existing = allGrades.find(g => g.classId === selectedClass && g.subject === selectedSubject && g.studentId === student.id);
      if (existing) return existing;

      // Default baseline values
      const defaultCalculated = calculateGrade(80, 80, 80, 80, 80, 80, 80);
      return {
        id: `grd-${selectedClass}-${selectedSubject}-${student.id}`,
        classId: selectedClass,
        subject: selectedSubject,
        studentId: student.id,
        studentName: student.name,
        uh1: 80,
        uh2: 80,
        uh3: 80,
        uh4: 80,
        uh5: 80,
        asts: 80,
        asas: 80,
        finalScore: defaultCalculated.finalScore,
        predicate: defaultCalculated.predicate,
        status: defaultCalculated.status,
        updatedAt: new Date().toISOString()
      } as GradeRecord;
    });
  }, [students, allGrades, selectedClass, selectedSubject]);

  const handleEditClick = (record: GradeRecord) => {
    setEditingGrade({
      studentId: record.studentId,
      studentName: record.studentName,
      uh1: record.uh1,
      uh2: record.uh2,
      uh3: record.uh3,
      uh4: record.uh4,
      uh5: record.uh5,
      asts: record.asts,
      asas: record.asas
    });
  };

  const handleSaveModalGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    const calc = calculateGrade(
      Number(editingGrade.uh1),
      Number(editingGrade.uh2),
      Number(editingGrade.uh3),
      Number(editingGrade.uh4),
      Number(editingGrade.uh5),
      Number(editingGrade.asts),
      Number(editingGrade.asas)
    );

    const updatedRecord: GradeRecord = {
      id: `grd-${selectedClass}-${selectedSubject}-${editingGrade.studentId}`,
      classId: selectedClass,
      subject: selectedSubject,
      studentId: editingGrade.studentId,
      studentName: editingGrade.studentName,
      uh1: Number(editingGrade.uh1),
      uh2: Number(editingGrade.uh2),
      uh3: Number(editingGrade.uh3),
      uh4: Number(editingGrade.uh4),
      uh5: Number(editingGrade.uh5),
      asts: Number(editingGrade.asts),
      asas: Number(editingGrade.asas),
      finalScore: calc.finalScore,
      predicate: calc.predicate,
      status: calc.status,
      updatedAt: new Date().toISOString()
    };

    StorageService.saveGrade(updatedRecord);
    setAllGrades(StorageService.getGrades());
    SheetsSyncService.saveSingleRecord('Nilai', updatedRecord);

    setEditingGrade(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Class Statistics
  const avgClassScore = classSubjectGrades.length > 0
    ? (classSubjectGrades.reduce((sum, g) => sum + g.finalScore, 0) / classSubjectGrades.length).toFixed(1)
    : "0";
  const passedCount = classSubjectGrades.filter(g => g.status === 'Tuntas').length;

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

        {/* Judul Laporan Ledger Nilai */}
        <div className="text-center mb-6">
          <h3 className="text-base font-black underline uppercase text-slate-900">
            LEDGER PENILAIAN HASIL BELAJAR (KURIKULUM MERDEKA)
          </h3>
          <p className="text-xs text-slate-800 mt-1">
            Mata Pelajaran: <strong className="font-bold">{selectedSubject}</strong> | Kelas: <strong className="font-bold">{selectedClass}</strong>
          </p>
          <p className="text-xs text-slate-600">
            Semester: {profile.semester} | Tahun Pelajaran: {profile.academicYear} | Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
        </div>

        {/* Tabel Ledger Nilai */}
        <table className="w-full text-xs border border-slate-900 mb-8">
          <thead>
            <tr className="bg-slate-200 text-slate-950 font-bold text-center">
              <th className="border border-slate-900 py-1.5 px-2 w-10">No</th>
              <th className="border border-slate-900 py-1.5 px-4 text-left">Nama Peserta Didik</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">UH 1</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">UH 2</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">UH 3</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">UH 4</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">UH 5</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12 bg-slate-300">ASTS</th>
              <th className="border border-slate-900 py-1.5 px-2 w-12 bg-slate-300">ASAS</th>
              <th className="border border-slate-900 py-1.5 px-2 w-14 font-black">Nilai Akhir</th>
              <th className="border border-slate-900 py-1.5 px-2 w-10">Predikat</th>
              <th className="border border-slate-900 py-1.5 px-3 w-28">Ketercapaian</th>
            </tr>
          </thead>
          <tbody>
            {classSubjectGrades.map((g, idx) => (
              <tr key={g.id} className="text-center">
                <td className="border border-slate-900 py-1 px-2">{idx + 1}</td>
                <td className="border border-slate-900 py-1 px-4 text-left font-bold">{g.studentName}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{g.uh1}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{g.uh2}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{g.uh3}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{g.uh4}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono">{g.uh5}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono font-bold bg-slate-100">{g.asts}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono font-bold bg-slate-100">{g.asas}</td>
                <td className="border border-slate-900 py-1 px-2 font-mono font-black">{g.finalScore}</td>
                <td className="border border-slate-900 py-1 px-2 font-bold">{g.predicate}</td>
                <td className="border border-slate-900 py-1 px-2 font-semibold">
                  {g.status}
                </td>
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
              <strong>Guru Pengampu Mata Pelajaran</strong>
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
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span>Buku Ledger Nilai</span>
              <span>·</span>
              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{selectedClass}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ledger Nilai Siswa Terpadu</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekap Ulangan Harian (UH 1–5), ASTS, ASAS, dan kalkulasi otomatis Nilai Akhir Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-red-600" />
              <span>Cetak Ledger Resmi</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Nilai siswa berhasil disimpan dan disinkronkan ke Google Sheets!</span>
          </div>
        )}

        {/* Subject Filter Bar & Summary Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700 shrink-0">Mata Pelajaran:</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            >
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div>
              Rata-rata Kelas: <strong className="font-mono text-slate-900 text-sm">{avgClassScore}</strong>
            </div>
            <div>
              Ketuntasan: <strong className="font-mono text-emerald-700 text-sm">{passedCount}/{classSubjectGrades.length} Siswa</strong> ({Math.round((passedCount/Math.max(1, classSubjectGrades.length))*100)}%)
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">No</th>
                  <th className="py-3 px-4">Nama Peserta Didik</th>
                  <th className="py-3 px-2 text-center w-12">UH 1</th>
                  <th className="py-3 px-2 text-center w-12">UH 2</th>
                  <th className="py-3 px-2 text-center w-12">UH 3</th>
                  <th className="py-3 px-2 text-center w-12">UH 4</th>
                  <th className="py-3 px-2 text-center w-12">UH 5</th>
                  <th className="py-3 px-3 text-center w-14 bg-red-50/60 text-red-900">ASTS</th>
                  <th className="py-3 px-3 text-center w-14 bg-red-50/60 text-red-900">ASAS</th>
                  <th className="py-3 px-3 text-center w-16 font-black text-slate-900">Nilai Akhir</th>
                  <th className="py-3 px-2 text-center w-10">Predikat</th>
                  <th className="py-3 px-3 text-center w-28">Status</th>
                  <th className="py-3 px-3 text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classSubjectGrades.map((grade, idx) => (
                  <tr key={grade.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{grade.studentName}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{grade.uh1}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{grade.uh2}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{grade.uh3}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{grade.uh4}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{grade.uh5}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold bg-slate-50/50">{grade.asts}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold bg-slate-50/50">{grade.asas}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-slate-950 text-sm">
                      {grade.finalScore}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold">
                      <span className={`inline-block w-6 h-6 rounded-md text-xs leading-6 ${
                        grade.predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        grade.predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                        grade.predicate === 'C' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {grade.predicate}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        grade.status === 'Tuntas'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {grade.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleEditClick(grade)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Edit Nilai Siswa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL INPUT / EDIT NILAI */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Input & Edit Nilai Asesmen</h3>
                <p className="text-[11px] text-red-100">{editingGrade.studentName} — {selectedSubject}</p>
              </div>
              <button onClick={() => setEditingGrade(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveModalGrade} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                Formula Kurikulum Merdeka: Nilai Akhir dihitung dari Rata-rata UH (40%) + ASTS (30%) + ASAS (30%).
              </div>

              {/* UH 1-5 Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Ulangan Harian (UH 1 sampai UH 5):</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(n => {
                    const key = `uh${n}` as keyof typeof editingGrade;
                    return (
                      <div key={n}>
                        <span className="block text-[10px] text-slate-400 font-bold mb-1 text-center">UH {n}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          required
                          value={editingGrade[key] as number}
                          onChange={e => setEditingGrade({ ...editingGrade, [key]: Number(e.target.value) })}
                          className="w-full p-2 text-center font-mono font-bold text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sumatif Tengah & Akhir Semester */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ASTS (Sumatif Tengah Smt)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.asts}
                    onChange={e => setEditingGrade({ ...editingGrade, asts: Number(e.target.value) })}
                    className="w-full p-2.5 text-center font-mono font-bold text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ASAS (Sumatif Akhir Smt)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.asas}
                    onChange={e => setEditingGrade({ ...editingGrade, asas: Number(e.target.value) })}
                    className="w-full p-2.5 text-center font-mono font-bold text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation Preview */}
              {(() => {
                const preview = calculateGrade(
                  Number(editingGrade.uh1),
                  Number(editingGrade.uh2),
                  Number(editingGrade.uh3),
                  Number(editingGrade.uh4),
                  Number(editingGrade.uh5),
                  Number(editingGrade.asts),
                  Number(editingGrade.asas)
                );
                return (
                  <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Estimasi Nilai Akhir:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-red-700 text-base">{preview.finalScore}</span>
                      <span className="font-bold bg-white px-2 py-0.5 rounded-md border border-red-200">
                        Predikat: {preview.predicate}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
