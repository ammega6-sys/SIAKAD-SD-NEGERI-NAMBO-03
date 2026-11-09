import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { LearningMaterial } from '../types';
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Trash2, 
  CheckCircle,
  Calendar,
  Layers,
  Filter
} from 'lucide-react';

export const LearningMaterialsView: React.FC = () => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => StorageService.getMaterials());
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [targetClass, setTargetClass] = useState(selectedClass);
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'VIDEO' | 'SLIDES' | 'LINK'>('PDF');

  // Filter scoped materials: admin sees all, teacher sees for selected class or all classes
  const filteredMaterials = materials.filter(m => {
    if (isAdmin) return true;
    return m.classId === selectedClass || m.classId === 'Semua Kelas';
  });

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newMat: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title,
      subject,
      classId: targetClass,
      description,
      fileUrl: fileUrl || "https://drive.google.com/sample-material",
      fileType,
      author: currentUser?.name || "Guru Pengajar",
      createdAt: new Date().toISOString().split('T')[0]
    };

    StorageService.saveMaterial(newMat);
    setMaterials(StorageService.getMaterials());
    SheetsSyncService.saveSingleRecord('BahanAjar', newMat);

    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setFileUrl('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus bahan ajar ini?')) {
      StorageService.deleteMaterial(id);
      setMaterials(StorageService.getMaterials());
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4 text-rose-600" />;
      case 'PDF': return <FileText className="w-4 h-4 text-red-600" />;
      default: return <LinkIcon className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Pustaka Modul Pembelajaran</span>
            <span>·</span>
            <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{selectedClass}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bahan & Modul Ajar Digital</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah modul PDF, video instruksional, dan lembar kerja untuk diakses peserta didik.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetClass(selectedClass);
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Modul / Materi Baru</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Modul ajar baru berhasil ditambahkan dan disinkronkan ke Google Sheets!</span>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-red-200 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {getTypeIcon(mat.fileType)}
                  <span>{mat.fileType}</span>
                </span>
                <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  {mat.classId}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug line-clamp-2">
                {mat.title}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 mb-2">
                Mapel: {mat.subject}
              </p>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {mat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[10px] text-slate-400">
                <span>Oleh: <strong className="text-slate-600 font-medium">{mat.author}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka / Unduh</span>
                </a>

                {(isAdmin || currentUser?.name === mat.author) && (
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada modul ajar untuk kelas ini</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol "Unggah Modul / Materi Baru" di atas untuk menambahkan.</p>
          </div>
        )}
      </div>

      {/* MODAL UPLOAD MODUL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Unggah Bahan Ajar / Modul Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMaterial} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Materi / Modul *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Modul Ajar IPAS Bab 2 Ekosistem"
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
                    <option value="Seni & Budaya">Seni Budaya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Kelas</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Semua Kelas">Semua Kelas</option>
                    <option value="Kelas 1A">Kelas 1A</option>
                    <option value="Kelas 2A">Kelas 2A</option>
                    <option value="Kelas 3A">Kelas 3A</option>
                    <option value="Kelas 4A">Kelas 4A</option>
                    <option value="Kelas 5A">Kelas 5A</option>
                    <option value="Kelas 6A">Kelas 6A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe File / Media</label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="PDF">Dokumen PDF</option>
                    <option value="SLIDES">Slide Presentasi</option>
                    <option value="VIDEO">Video YouTube / Drive</option>
                    <option value="DOCX">Word Document</option>
                    <option value="LINK">Tautan Web</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link File / Google Drive</label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Petunjuk Belajar</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ringkasan konsep pokok yang harus dipelajari siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
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
                  Simpan Modul Ajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
