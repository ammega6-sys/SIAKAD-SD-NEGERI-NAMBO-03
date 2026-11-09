import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck2,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  BookOpen,
  ClipboardList,
  Gamepad2,
  BellRing,
  MessagesSquare,
  Sheet,
  X,
  Shield,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  onClose
}) => {
  const { currentUser, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Profil Sekolah', icon: LayoutDashboard, section: 'Utama' },
    { id: 'principal', label: 'Data Kepala Sekolah', icon: UserCheck2, section: 'Manajemen' },
    { id: 'teachers', label: isAdmin ? 'Direktori & Data Guru' : 'Profil Guru Pengajar', icon: Users, section: 'Manajemen' },
    { id: 'attendance', label: 'Absensi Kehadiran', icon: CalendarCheck, section: 'Akademik' },
    { id: 'grades', label: 'Ledger Nilai Siswa', icon: FileSpreadsheet, section: 'Akademik' },
    { id: 'materials', label: 'Bahan Belajar / Modul', icon: BookOpen, section: 'Pembelajaran' },
    { id: 'assignments', label: 'Tugas Belajar Siswa', icon: ClipboardList, section: 'Pembelajaran' },
    { id: 'games', label: 'Game Edukasi Siswa', icon: Gamepad2, section: 'Interaktif' },
    { id: 'announcements', label: 'Papan Pengumuman', icon: BellRing, section: 'Informasi' },
    { id: 'forum', label: 'Forum Diskusi Guru', icon: MessagesSquare, section: 'Informasi' },
    { id: 'sync', label: 'Google Sheets DB', icon: Sheet, section: 'Sistem' }
  ];

  const handleSelect = (id: string) => {
    setActiveView(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800">Menu Navigasi</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User Role Notice */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-red-600" />
              ) : (
                <GraduationCap className="w-4 h-4 text-rose-600" />
              )}
              <span className="font-bold text-xs text-red-900">
                {isAdmin ? 'Akses: Kepala Sekolah' : 'Akses: Guru Pengajar'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              {isAdmin
                ? 'Hak akses penuh mengaudit seluruh kelas dan data guru.'
                : 'Data administrasi terisolasi khusus kelas yang diampu.'}
            </p>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-red-700 hover:bg-red-50/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-red-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500">
          <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
            <span>Kurikulum Merdeka</span>
            <span className="font-mono text-[10px] text-slate-500">v2.4</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400">
            Terhubung ke Google Sheets ID: <span className="font-mono text-slate-600">1MIJeo...rNs</span>
          </p>
        </div>
      </aside>
    </>
  );
};
