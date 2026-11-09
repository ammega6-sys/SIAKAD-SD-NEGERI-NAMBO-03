import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { Announcement } from '../types';
import { 
  BellRing, 
  Plus, 
  Pin, 
  Calendar, 
  User, 
  Trash2, 
  CheckCircle,
  Tag,
  AlertTriangle
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Akademik');
  const [priority, setPriority] = useState<Announcement['priority']>('Penting');
  const [isPinned, setIsPinned] = useState(false);

  const filtered = announcements.filter(a => {
    if (filterCategory === 'Semua') return true;
    return a.category === filterCategory;
  });

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      author: currentUser?.name ? `${currentUser.name} (${isAdmin ? 'Kepala Sekolah' : 'Guru'})` : 'Pihak Sekolah',
      date: new Date().toISOString().split('T')[0],
      priority,
      category,
      isPinned
    };

    StorageService.saveAnnouncement(newAnn);
    setAnnouncements(StorageService.getAnnouncements());
    SheetsSyncService.saveSingleRecord('Pengumuman', newAnn);

    setShowAddModal(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      StorageService.deleteAnnouncement(id);
      setAnnouncements(StorageService.getAnnouncements());
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Mendesak': return 'bg-red-100 text-red-800 border-red-300';
      case 'Penting': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4 text-amber-500" />
            <span>Papan Informasi Kedinasan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengumuman & Surat Edaran</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi resmi dari Kepala Sekolah, agenda akademik, supervisi, dan edaran dinas pendidikan.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Pengumuman berhasil diterbitkan dan disinkronkan ke Google Sheets!</span>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto text-xs font-medium">
        {['Semua', 'Akademik', 'Administrasi', 'Kegiatan', 'Libur', 'Ujian'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterCategory === cat
                ? 'bg-white text-red-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map(ann => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-5 md:p-6 shadow-xs transition-all ${
              ann.isPinned ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {ann.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                    <Pin className="w-3 h-3 fill-red-600" />
                    Dipin
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${getPriorityStyle(ann.priority)}`}>
                  {ann.priority}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {ann.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.date}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{ann.title}</h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {ann.content}
            </p>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              <span>Diterbitkan oleh: <strong className="text-slate-700">{ann.author}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL BUAT PENGUMUMAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Terbitkan Pengumuman Resmi Sekolah</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAnnouncement} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Pelaksanaan Asesmen Sumatif Akhir Semester"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Kegiatan">Kegiatan Sekolah</option>
                    <option value="Libur">Libur & Cuti</option>
                    <option value="Ujian">Ujian / Asesmen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Mendesak">Mendesak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap Edaran / Pengumuman *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Ketik teks pengumuman..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="rounded-sm text-red-600 focus:ring-red-500"
                />
                <span>Sematkan di bagian paling atas (Pin Pengumuman)</span>
              </label>

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
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
