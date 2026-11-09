import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { 
  Building2, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  BellRing
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, selectedClass } = useAuth();
  const profile = StorageService.getProfile();
  const students = StorageService.getStudents();
  const teachers = StorageService.getUsers().filter(u => u.role === 'GURU');
  const attendance = StorageService.getAttendance();
  const grades = StorageService.getGrades();
  const announcements = StorageService.getAnnouncements();

  // Filter scoped data
  const classStudents = isAdmin 
    ? students 
    : students.filter(s => currentUser?.assignedClasses.includes(s.classId));

  // Today's attendance calculation
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter(a => a.date === today && (isAdmin || currentUser?.assignedClasses.includes(a.classId)));
  const presentCount = todayRecords.filter(a => a.status === 'H').length;
  const attendanceRate = todayRecords.length > 0 ? Math.round((presentCount / todayRecords.length) * 100) : 96;

  // Average final grades
  const classGrades = isAdmin 
    ? grades 
    : grades.filter(g => currentUser?.assignedClasses.includes(g.classId));
  const avgGrade = classGrades.length > 0 
    ? (classGrades.reduce((sum, g) => sum + g.finalScore, 0) / classGrades.length).toFixed(1)
    : "86.4";

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src={profile.bannerImage || "/images/school_building.jpg"}
            alt={profile.schoolName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to styled gradient if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-black/30" />
        </div>

        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>NPSN: {profile.npsn}</span>
            <span>·</span>
            <span>Akreditasi: {profile.accreditation}</span>
            <span>·</span>
            <span>Tahun Ajaran {profile.academicYear} ({profile.semester})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
            {profile.schoolName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl line-clamp-2 italic">
            "{profile.motto}"
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span className="truncate max-w-[280px]">{profile.address}</span>
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{profile.phone}</span>
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span>{profile.email}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {isAdmin ? 'Total Peserta Didik' : `Siswa (${selectedClass})`}
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {classStudents.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Siswa Terdaftar Aktif</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Guru & Pendidik</span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {teachers.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Semua Rombel</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Kehadiran Hari Ini</span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Presensi Berjalan</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Rata-rata Nilai Akhir</span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {avgGrade}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Kurikulum Merdeka</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visi-Misi + Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visi & Misi */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wide mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pedoman Lembaga</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Visi & Misi Sekolah</h2>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-1">Visi Sekolah</h3>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              "{profile.vision}"
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Misi Sekolah</h3>
            <div className="space-y-2.5">
              {profile.mission.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 mb-3">Akses Cepat Modul Administrasi:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('attendance')}
                className="p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-red-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Presensi Siswa</span>
                <span className="text-[10px] text-slate-500">Rekap harian & cetak</span>
              </button>

              <button
                onClick={() => onNavigate('grades')}
                className="p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Ledger Nilai</span>
                <span className="text-[10px] text-slate-500">UH 1-5, ASTS, ASAS</span>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-amber-600 mb-1">
                  <Gamepad2 className="w-4 h-4" />
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Game Edukasi</span>
                <span className="text-[10px] text-slate-500">Kuis & matematika kilat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sambutan Singkat Kepala Sekolah & Pengumuman Terbaru */}
        <div className="space-y-6">
          {/* Kepala Sekolah Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.principalImage || "/images/principal_headshot.jpg"}
                alt={profile.principalName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>';
                }}
                className="w-16 h-16 rounded-xl object-cover border-2 border-red-200 shadow-xs"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Kepala Sekolah
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{profile.principalName}</h3>
                <p className="text-[11px] font-mono text-slate-500">NIP: {profile.principalNip}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              "{profile.principalSpeech}"
            </p>

            <button
              onClick={() => onNavigate('principal')}
              className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lihat Profil & Sambutan Lengkap</span>
            </button>
          </div>

          {/* Pengumuman Terbaru */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm text-slate-900">Pengumuman Terkini</h3>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Semua
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-red-700">{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{ann.title}</h4>
                  <p className="text-slate-600 line-clamp-2 mt-1 text-[11px] leading-tight">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
