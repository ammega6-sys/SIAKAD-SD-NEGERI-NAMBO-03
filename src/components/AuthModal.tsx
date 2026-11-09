import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, UserCheck, UserPlus, X, Shield, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, registerTeacher, allAvailableClasses } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginRoleTab, setLoginRoleTab] = useState<'GURU' | 'ADMIN'>('GURU');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regNuptk, setRegNuptk] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regClasses, setRegClasses] = useState<string[]>(['Kelas 4A']);
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<'L' | 'P'>('L');
  const [regPassword, setRegPassword] = useState('');

  // Status state
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = login(identifier, password);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 700);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = registerTeacher({
      name: regName,
      nip: regNip,
      nuptk: regNuptk,
      subject: regSubject,
      assignedClasses: regClasses,
      email: regEmail,
      phone: regPhone,
      gender: regGender,
      password: regPassword || 'guru'
    });

    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 900);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const setDemoLogin = (type: 'admin' | 'guru4a' | 'guru5a') => {
    if (type === 'admin') {
      setLoginRoleTab('ADMIN');
      setIdentifier('197203151998021001');
      setPassword('admin');
    } else if (type === 'guru4a') {
      setLoginRoleTab('GURU');
      setIdentifier('198504122010012015');
      setPassword('guru');
    } else if (type === 'guru5a') {
      setLoginRoleTab('GURU');
      setIdentifier('198809202014021003');
      setPassword('guru');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Autentikasi SIAKAD Terpadu</h3>
              <p className="text-red-100 text-xs">Akses Berbasis Peran & Isolasi Kelas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setMessage(null); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'login'
                ? 'bg-white text-red-700 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            onClick={() => { setMode('register'); setMessage(null); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'register'
                ? 'bg-white text-red-700 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Akun Guru Baru
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              {/* Quick Preset Buttons for Evaluation */}
              <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">Akses Cepat Pengujian Akun:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoLogin('admin')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Kepala Sekolah (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoLogin('guru4a')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
                  >
                    Guru Kelas 4A (Siti R.)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoLogin('guru5a')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
                  >
                    Guru Kelas 5A (Budi S.)
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Contoh: 198504122010012015 atau admin"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    *Password bawaan: <code className="font-mono text-slate-600">admin</code> untuk Kepala Sekolah, <code className="font-mono text-slate-600">guru</code> untuk Guru.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Masuk ke Sistem SIAKAD
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Contoh: Tri Wahyuni, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pegawai *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNip}
                    onChange={e => setRegNip(e.target.value)}
                    placeholder="18 digit NIP"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NUPTK (Opsional)
                  </label>
                  <input
                    type="text"
                    value={regNuptk}
                    onChange={e => setRegNuptk(e.target.value)}
                    placeholder="16 digit NUPTK"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran Diampu
                  </label>
                  <input
                    type="text"
                    value={regSubject}
                    onChange={e => setRegSubject(e.target.value)}
                    placeholder="Contoh: Guru Kelas / IPAS"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas yang Diampu (Hak Akses Data Terisolasi) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allAvailableClasses.map(cls => (
                    <label key={cls} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regClasses.includes(cls)}
                        onChange={e => {
                          if (e.target.checked) {
                            setRegClasses([...regClasses, cls]);
                          } else {
                            if (regClasses.length > 1) {
                              setRegClasses(regClasses.filter(c => c !== cls));
                            }
                          }
                        }}
                        className="rounded-sm text-red-600 focus:ring-red-500"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Guru hanya dapat melihat dan menginput data siswa pada kelas yang dipilih.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Handphone/WA
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Daftarkan Akun Guru
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
