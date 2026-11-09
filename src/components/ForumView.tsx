import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { ForumDiscussion, ForumReply } from '../types';
import { 
  MessagesSquare, 
  Plus, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  GraduationCap, 
  Layers, 
  Clock, 
  User,
  CheckCircle
} from 'lucide-react';

export const ForumView: React.FC = () => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const [discussions, setDiscussions] = useState<ForumDiscussion[]>(() => StorageService.getDiscussions());
  const [activeDiscussion, setActiveDiscussion] = useState<ForumDiscussion | null>(() => discussions[0] || null);
  const [replyInput, setReplyInput] = useState('');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New topic form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCategory, setTopicCategory] = useState('Pedagogik & Metode Ajar');
  const [topicClassScope, setTopicClassScope] = useState('Semua Kelas');
  const [topicContent, setTopicContent] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeDiscussion || !currentUser) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: replyInput.trim(),
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };

    StorageService.addReply(activeDiscussion.id, newReply);
    const updated = StorageService.getDiscussions();
    setDiscussions(updated);
    const found = updated.find(d => d.id === activeDiscussion.id) || null;
    setActiveDiscussion(found);
    SheetsSyncService.saveSingleRecord('ForumDiskusi', found);

    setReplyInput('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle || !topicContent || !currentUser) return;

    const newDisc: ForumDiscussion = {
      id: `dsc-${Date.now()}`,
      title: topicTitle,
      category: topicCategory,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      classScope: topicClassScope,
      content: topicContent,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      replies: []
    };

    StorageService.saveDiscussion(newDisc);
    const updated = StorageService.getDiscussions();
    setDiscussions(updated);
    setActiveDiscussion(newDisc);
    SheetsSyncService.saveSingleRecord('ForumDiskusi', newDisc);

    setShowNewTopicModal(false);
    setTopicTitle('');
    setTopicContent('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <MessagesSquare className="w-4 h-4 text-amber-500" />
            <span>Kolaborasi Pendidik</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forum Diskusi Akademik</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ruang komunikasi kolegial dewan guru, diskusi capaian belajar siswa, dan konsultasi kurikulum.
          </p>
        </div>

        <button
          onClick={() => setShowNewTopicModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buka Topik Diskusi Baru</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Topik diskusi berhasil diterbitkan dan disinkronkan ke Google Sheets!</span>
        </div>
      )}

      {/* Main Split View: Topic list on Left, Discussion thread on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Topics List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Topik Pembahasan ({discussions.length})
          </h2>

          <div className="space-y-2">
            {discussions.map(disc => {
              const isSelected = activeDiscussion?.id === disc.id;

              return (
                <div
                  key={disc.id}
                  onClick={() => setActiveDiscussion(disc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/70 border-red-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                    <span className="font-bold text-red-700 bg-red-100/60 px-2 py-0.5 rounded-md">
                      {disc.category}
                    </span>
                    <span>{disc.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 leading-snug mb-1 line-clamp-2">
                    {disc.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[140px] font-medium">{disc.authorName}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <MessageCircle className="w-3 h-3 text-slate-400" />
                      {disc.replies?.length || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Discussion Details & Reply Thread */}
        <div className="lg:col-span-2">
          {activeDiscussion ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full min-h-[500px]">
              
              {/* Header Topic */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {activeDiscussion.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Ruang Lingkup: {activeDiscussion.classScope}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                  {activeDiscussion.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  {activeDiscussion.authorRole === 'ADMIN' ? (
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="font-semibold text-slate-800">{activeDiscussion.authorName}</span>
                  <span>·</span>
                  <span className="text-[11px]">{activeDiscussion.createdAt}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeDiscussion.content}
                </div>
              </div>

              {/* Replies Thread */}
              <div className="p-6 flex-1 space-y-4 overflow-y-auto max-h-[380px]">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Tanggapan & Diskusi ({activeDiscussion.replies?.length || 0})
                </h3>

                {activeDiscussion.replies && activeDiscussion.replies.length > 0 ? (
                  activeDiscussion.replies.map(rep => (
                    <div key={rep.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {rep.authorRole === 'ADMIN' ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Kepala Sekolah</span>
                          ) : (
                            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Guru</span>
                          )}
                          <span className="font-bold text-slate-900">{rep.authorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{rep.createdAt}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-1">{rep.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada tanggapan pada topik ini. Jadilah yang pertama memberikan masukan!</p>
                )}
              </div>

              {/* Reply Input Box */}
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyInput}
                    onChange={e => setReplyInput(e.target.value)}
                    placeholder="Tuliskan tanggapan atau masukan pedagogik Anda..."
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <MessagesSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Pilih topik diskusi di kolom kiri</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL TOPIK BARU */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-red-700 to-rose-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Buka Topik Diskusi Baru</h3>
              <button onClick={() => setShowNewTopicModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Topik Pembahasan *</label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={e => setTopicTitle(e.target.value)}
                  placeholder="Contoh: Optimalisasi P5 Tema Kewirausahaan Cilik"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={topicCategory}
                    onChange={e => setTopicCategory(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Pedagogik & Metode Ajar">Pedagogik & Metode Ajar</option>
                    <option value="Teknologi Pembelajaran">Teknologi Pembelajaran</option>
                    <option value="Proyek P5 Merdeka">Proyek P5 Merdeka</option>
                    <option value="Evaluasi & Asesmen">Evaluasi & Asesmen</option>
                    <option value="Koordinasi Kelas">Koordinasi Kelas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ruang Lingkup</label>
                  <select
                    value={topicClassScope}
                    onChange={e => setTopicClassScope(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Semua Kelas">Semua Kelas</option>
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Topik & Poin Diskusi *</label>
                <textarea
                  rows={4}
                  required
                  value={topicContent}
                  onChange={e => setTopicContent(e.target.value)}
                  placeholder="Kemukakan permasalahan atau gagasan yang ingin dibahas bersama dewan guru..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Publikasikan Topik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
