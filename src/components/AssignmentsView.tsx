import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { Assignment, AssignmentSubmission } from '../types';
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Award, 
  Users, 
  ChevronRight, 
  Edit3, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const allStudents = StorageService.getStudents().filter(s => s.classId === selectedClass);
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New assignment form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');

  // Grading submission form
  const [evalModal, setEvalModal] = useState<{
    assignmentId: string;
    studentId: string;
    studentName: string;
    score: number;
    feedback: string;
  } | null>(null);

  // Scoped assignments
  const filteredAssignments = assignments.filter(a => {
    if (isAdmin) return true;
    return a.classId === selectedClass;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title,
      subject,
      classId: selectedClass,
      deadline,
      instructions,
      author: currentUser?.name || 'Guru Pengajar',
      createdAt: new Date().toISOString().split('T')[0],
      submissions: []
    };

    StorageService.saveAssignment(newAsg);
    setAssignments(StorageService.getAssignments());
    SheetsSyncService.saveSingleRecord('Tugas', newAsg);

    setShowCreateModal(false);
    setTitle('');
    setInstructions('');
    setDeadline('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalModal || !selectedAssignment) return;

    const updatedSubmissions = [...selectedAssignment.submissions];
    const subIdx = updatedSubmissions.findIndex(s => s.studentId === evalModal.studentId);

    if (subIdx >= 0) {
      updatedSubmissions[subIdx] = {
        ...updatedSubmissions[subIdx],
        score: evalModal.score,
        feedback: evalModal.feedback
      };
    } else {
      updatedSubmissions.push({
        id: `sub-${Date.now()}`,
        studentId: evalModal.studentId,
        studentName: evalModal.studentName,
        submittedAt: new Date().toLocaleString('id-ID'),
        score: evalModal.score,
        feedback: evalModal.feedback
      });
    }

    const updatedAssignment = {
      ...selectedAssignment,
      submissions: updatedSubmissions
    };

    StorageService.saveAssignment(updatedAssignment);
    setAssignments(StorageService.getAssignments());
    setSelectedAssignment(updatedAssignment);
    SheetsSyncService.saveSingleRecord('Tugas', updatedAssignment);

    setEvalModal(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            <span>Manajemen Tugas Belajar</span>
            <span>·</span>
            <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{selectedClass}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tugas & Lembar Kerja Siswa</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemberian penugasan berbasis proyek, pemantauan pengumpulan, dan pemberian nilai & umpan balik.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Perubahan data tugas berhasil disimpan dan disinkronkan ke Google Sheets!</span>
        </div>
      )}

      {/* Main Split: Assignments List vs Detail Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assignments Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Daftar Tugas Aktif ({filteredAssignments.length})
          </h2>

          {filteredAssignments.map(asg => {
            const isSelected = selectedAssignment?.id === asg.id;
            const submittedCount = asg.submissions ? asg.submissions.length : 0;

            return (
              <div
                key={asg.id}
                onClick={() => setSelectedAssignment(asg)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-50/70 border-red-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-red-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-red-700 bg-red-100/60 px-2 py-0.5 rounded-md">
                    {asg.classId}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {asg.deadline}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {asg.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mb-3">
                  {asg.subject}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong className="font-mono text-slate-800">{submittedCount}</strong> dikumpulkan
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}

          {filteredAssignments.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">Belum ada tugas dibuat</p>
            </div>
          )}
        </div>

        {/* Right Column: Selected Assignment Details & Student Submissions */}
        <div className="lg:col-span-2">
          {selectedAssignment ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-bold text-red-700">{selectedAssignment.subject}</span>
                  <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Batas Waktu: {selectedAssignment.deadline}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedAssignment.title}</h2>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Instruksi Tugas:</span>
                  {selectedAssignment.instructions}
                </div>
              </div>

              {/* Submissions Table */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-900">
                    Status Pengumpulan Siswa {selectedClass}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Total Siswa: <strong className="font-mono text-slate-800">{allStudents.length}</strong>
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">No</th>
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">Waktu Pengumpulan</th>
                        <th className="py-2.5 px-3 text-center">Nilai</th>
                        <th className="py-2.5 px-3">Feedback Guru</th>
                        <th className="py-2.5 px-3 text-center w-24">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allStudents.map((st, idx) => {
                        const sub = selectedAssignment.submissions?.find(s => s.studentId === st.id);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-3 font-bold text-slate-900">{st.name}</td>
                            <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                              {sub ? (
                                <span className="text-emerald-700 font-medium">✓ {sub.submittedAt}</span>
                              ) : (
                                <span className="text-slate-400 italic">Belum mengumpulkan</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold">
                              {sub && sub.score !== undefined ? (
                                <span className="text-red-700 font-black">{sub.score}</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                              {sub?.feedback || '-'}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => setEvalModal({
                                  assignmentId: selectedAssignment.id,
                                  studentId: st.id,
                                  studentName: st.name,
                                  score: sub?.score || 85,
                                  feedback: sub?.feedback || ''
                                })}
                                className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg transition-colors"
                              >
                                {sub?.score ? 'Ubah Nilai' : 'Beri Nilai'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Pilih tugas pada daftar di sebelah kiri</p>
              <p className="text-xs mt-1">Untuk melihat lembar pengumpulan dan menginput nilai siswa.</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL BUAT TUGAS BARU */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Buat Tugas Belajar Baru ({selectedClass})</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Tugas Proyek Mini Ekosistem"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="IPAS (Ilmu Pengetahuan Alam & Sosial)">IPAS</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="Pendidikan Jasmani & Kesehatan">PJOK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batas Waktu (Deadline) *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instruksi & Kriteria Penilaian</label>
                <textarea
                  rows={4}
                  required
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Tuliskan petunjuk langkah pengerjaan tugas secara rinci untuk siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT NILAI & FEEDBACK */}
      {evalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Penilaian Tugas Siswa</h3>
              <button onClick={() => setEvalModal(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block">Nama Peserta Didik:</span>
                <span className="text-base font-bold text-slate-900 block">{evalModal.studentName}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Tugas (Skala 0 - 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={evalModal.score}
                  onChange={e => setEvalModal({ ...evalModal, score: Number(e.target.value) })}
                  className="w-full p-2.5 text-center font-mono font-bold text-lg rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Umpan Balik & Catatan Penguatan Guru
                </label>
                <textarea
                  rows={3}
                  value={evalModal.feedback}
                  onChange={e => setEvalModal({ ...evalModal, feedback: e.target.value })}
                  placeholder="Catatan apresiasi dan saran perbaikan..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvalModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
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
