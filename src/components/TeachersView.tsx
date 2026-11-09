import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { User } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  GraduationCap, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Filter,
  UserCheck,
  Edit2
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { currentUser, isAdmin, allAvailableClasses } = useAuth();
  const [teachers, setTeachers] = useState<User[]>(() => StorageService.getUsers().filter(u => u.role === 'GURU'));
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // New teacher form state
  const [newName, setNewName] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newNuptk, setNewNuptk] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newClasses, setNewClasses] = useState<string[]>(['Kelas 4A']);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.nip.includes(searchQuery) ||
                          (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = classFilter === 'Semua' || t.assignedClasses.includes(classFilter);
    return matchesSearch && matchesClass;
  });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNip) return;

    const newTeacher: User = {
      id: `usr-guru-${Date.now()}`,
      name: newName,
      nip: newNip,
      nuptk: newNuptk,
      role: 'GURU',
      subject: newSubject || 'Guru Kelas',
      assignedClasses: newClasses,
      email: newEmail || `${newNip}@sdn-nusantaramerdeka.sch.id`,
      phone: newPhone || '0812xxxxxxxx',
      gender: newGender,
      status: 'Aktif',
      password: 'guru'
    };

    StorageService.saveUser(newTeacher);
    setTeachers(StorageService.getUsers().filter(u => u.role === 'GURU'));
    setShowAddModal(false);

    // Reset form
    setNewName('');
    setNewNip('');
    setNewNuptk('');
    setNewSubject('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Pendidik & Tenaga Kependidikan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAdmin ? 'Direktori & Manajemen Dewan Guru' : 'Profil Guru Pengajar'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin 
              ? 'Monitoring seluruh pengampu kelas, NIP/NUPTK, dan distribusi rombel belajar.'
              : 'Informasi identitas kedinasan dan kelas yang Anda ampu saat ini.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Guru</span>
          </button>
        )}
      </div>

      {/* For GURU: Show their personal profile prominently */}
      {!isAdmin && currentUser && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-3xl shadow-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  Status: {currentUser.status}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{currentUser.name}</h2>
                <p className="text-xs text-slate-500 font-mono">NIP: {currentUser.nip}</p>
                {currentUser.nuptk && (
                  <p className="text-xs text-slate-400 font-mono">NUPTK: {currentUser.nuptk}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Mata Pelajaran:</span>
                  <span className="font-semibold text-slate-800">{currentUser.subject || 'Guru Kelas'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kelas yang Diampu:</span>
                  <span className="font-semibold text-red-700">{currentUser.assignedClasses.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Kedinasan:</span>
                  <span className="font-semibold text-slate-800">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">No. Telepon:</span>
                  <span className="font-semibold text-slate-800">{currentUser.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directory view (Admin sees all, Teacher sees colleagues list) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, mapel..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Filter Kelas:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden"
            >
              <option value="Semua">Semua Rombel</option>
              {allAvailableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Kelas Diampu</th>
                <th className="py-3 px-4">Kontak / Email</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{teacher.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">NIP: {teacher.nip}</span>
                        {teacher.nuptk && (
                          <span className="text-[10px] text-slate-400 font-mono block">NUPTK: {teacher.nuptk}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {teacher.subject || 'Guru Kelas'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.assignedClasses.map(cls => (
                        <span key={cls} className="bg-red-50 text-red-700 font-semibold px-2 py-0.5 rounded-md text-[10px] border border-red-200">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="space-y-0.5">
                      <span className="block truncate max-w-[180px]">{teacher.email}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{teacher.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {teacher.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Teacher (Admin only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Data Guru Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTeacher} className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Ratna Ningsih, M.Pd."
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP Pegawai *</label>
                  <input
                    type="text"
                    required
                    value={newNip}
                    onChange={e => setNewNip(e.target.value)}
                    placeholder="18 digit NIP"
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={newNuptk}
                    onChange={e => setNewNuptk(e.target.value)}
                    placeholder="16 digit NUPTK"
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    placeholder="Contoh: Pendidikan Pancasila"
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as 'L' | 'P')}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas yang Diampu *</label>
                <div className="grid grid-cols-3 gap-2">
                  {allAvailableClasses.map(cls => (
                    <label key={cls} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={newClasses.includes(cls)}
                        onChange={e => {
                          if (e.target.checked) setNewClasses([...newClasses, cls]);
                          else if (newClasses.length > 1) setNewClasses(newClasses.filter(c => c !== cls));
                        }}
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Handphone/WA</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
