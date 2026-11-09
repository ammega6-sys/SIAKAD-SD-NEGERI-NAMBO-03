import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { 
  UserCheck2, 
  Award, 
  FileCheck, 
  Calendar, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  CheckCircle,
  Building,
  GraduationCap,
  ShieldCheck,
  Quote
} from 'lucide-react';

export const PrincipalProfileView: React.FC = () => {
  const { isAdmin } = useAuth();
  const profile = StorageService.getProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [speech, setSpeech] = useState(profile.principalSpeech);
  const [motto, setMotto] = useState(profile.motto);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const updated = {
      ...profile,
      principalSpeech: speech,
      motto: motto
    };
    StorageService.saveProfile(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Pimpinan Lembaga</span>
            <span>·</span>
            <span>Administrasi Manajerial</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data & Profil Kepala Sekolah</h1>
        </div>

        {isAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-xl shadow-xs hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-2 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Sambutan & Kebijakan</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profil dan Sambutan Kepala Sekolah berhasil disimpan!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border-4 border-red-100 shadow-sm mx-auto md:mx-0">
            <img
              src={profile.principalImage || "/images/principal_headshot.jpg"}
              alt={profile.principalName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                Pimpinan Satuan Pendidikan
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{profile.principalName}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">NIP: {profile.principalNip}</p>
            </div>

            {/* Credential Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Pangkat / Golongan:</span>
                  <span className="font-semibold">Pembina Utama Muda, IV/c</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Pendidikan Terakhir:</span>
                  <span className="font-semibold">Magister Manajemen Pendidikan (S2)</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">SK Pengangkatan:</span>
                  <span className="font-semibold font-mono">821.2/KEP/432-DISDIK/2021</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">TMT Tugas Kepala Sekolah:</span>
                  <span className="font-semibold">01 Juli 2021 (Periode II)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs pt-2 text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sambutan & Kebijakan Strategis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Sambutan Resmi Kepala Sekolah</h3>
            <p className="text-xs text-slate-500">Amanat dan Arahan Mutu Pendidikan</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Sambutan Kepala Sekolah:
              </label>
              <textarea
                rows={6}
                value={speech}
                onChange={e => setSpeech(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semboyan / Motto Sekolah:
              </label>
              <input
                type="text"
                value={motto}
                onChange={e => setMotto(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic whitespace-pre-line">
              "{profile.principalSpeech}"
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-800">{profile.principalName}</span>
              <span className="font-mono">Kepala {profile.schoolName}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Pilar Kebijakan Manajerial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            1. Transparansi & Tata Kelola Digital
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pemanfaatan SIAKAD berbasis Google Sheets menjamin data absensi harian dan ledger nilai siswa dapat dipantau secara akurat, terstruktur, dan akuntabel.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            2. Penguatan Asesmen Kurikulum Merdeka
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluasi pembelajaran mencakup Ulangan Harian (formatif berkelanjutan), Asesmen Sumatif Tengah Semester (ASTS), dan Asesmen Sumatif Akhir Semester (ASAS).
          </p>
        </div>
      </div>
    </div>
  );
};
