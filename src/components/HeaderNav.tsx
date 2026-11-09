import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { 
  Building2, 
  Database, 
  Printer, 
  LogOut, 
  LogIn, 
  User as UserIcon, 
  ShieldCheck, 
  GraduationCap, 
  Layers,
  ChevronDown,
  Menu,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface HeaderNavProps {
  onOpenSync: () => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
  activeView: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenSync,
  onOpenAuth,
  onToggleSidebar,
  activeView
}) => {
  const { currentUser, isAdmin, isTeacher, allowedClasses, selectedClass, setSelectedClass, logout } = useAuth();
  const profile = StorageService.getProfile();
  const syncState = StorageService.getSyncState();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const isPrintableView = activeView === 'attendance' || activeView === 'grades';

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white shadow-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Zone: Sidebar Hamburger & School Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-red-700 flex items-center justify-center font-black text-base shadow-xs shrink-0 border border-red-200">
              🇮🇩
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white block">
                SIAKAD
              </span>
              <span className="text-[10px] text-red-100 hidden sm:block truncate max-w-[200px] md:max-w-[320px]">
                {profile.schoolName}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Zone: Class Selector (Strictly Scoped for Data Isolation) */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center bg-white/10 backdrop-blur-xs rounded-xl p-1 border border-white/20">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 text-xs text-red-100 shrink-0">
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-medium">Kelas:</span>
              </div>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="bg-transparent text-white text-xs font-bold py-1 px-2 rounded-lg focus:outline-hidden cursor-pointer"
              >
                {allowedClasses.map(cls => (
                  <option key={cls} value={cls} className="text-slate-900 bg-white">
                    {cls}
                  </option>
                ))}
              </select>
              {isTeacher && (
                <span className="hidden lg:inline text-[10px] bg-red-900/40 text-red-200 px-2 py-0.5 rounded-md ml-1 border border-red-400/20">
                  Data Terisolasi
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Zone: Google Sheets Sync, Print Button, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Print Button for Attendance / Grades */}
          {isPrintableView && (
            <button
              onClick={handlePrint}
              title="Cetak Laporan Resmi (Format A4/Folio)"
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          )}

          {/* Google Sheets Sync Pill */}
          <button
            onClick={onOpenSync}
            title={`Database: Google Sheets (${syncState.spreadsheetId})`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">Google Sheets</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-white/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-red-900/60 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <span className="font-semibold block truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-red-200 flex items-center gap-1">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 text-amber-300" />
                        <span>Kepala Sekolah</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-2.5 h-2.5 text-emerald-300" />
                        <span>Guru Pengajar</span>
                      </>
                    )}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-red-200" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-slate-800 text-xs z-50 animate-in fade-in"
                  onClick={() => setProfileDropdown(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-slate-500 text-[11px] font-mono mt-0.5">NIP: {currentUser.nip}</p>
                    <p className="text-red-700 font-semibold text-[11px] mt-1">
                      {isAdmin ? 'Administrator Utama (Kepala Sekolah)' : `Guru: ${currentUser.subject}`}
                    </p>
                  </div>
                  <div className="px-4 py-2 text-[11px] text-slate-600 bg-slate-50 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">Kelas Diampu:</span>{' '}
                    {currentUser.assignedClasses.join(', ')}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-white text-red-800 text-xs font-bold rounded-xl shadow-xs hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
