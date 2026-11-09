import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isTeacher: boolean;
  allowedClasses: string[];
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  allAvailableClasses: string[];
  login: (nipOrUsername: string, pass: string) => { success: boolean; message: string };
  registerTeacher: (data: Omit<User, 'id' | 'role' | 'status'> & { password?: string }) => { success: boolean; message: string };
  logout: () => void;
  updateCurrentUserProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getActiveUser());
  const [selectedClass, setSelectedClass] = useState<string>('Kelas 4A');

  const allAvailableClasses = ['Kelas 1A', 'Kelas 2A', 'Kelas 3A', 'Kelas 4A', 'Kelas 5A', 'Kelas 6A'];

  // Calculate allowed classes based on user role and data isolation
  const allowedClasses = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') {
      return allAvailableClasses;
    }
    // Teacher is strictly isolated to assignedClasses
    return currentUser.assignedClasses && currentUser.assignedClasses.length > 0
      ? currentUser.assignedClasses
      : ['Kelas 4A'];
  }, [currentUser]);

  // Ensure selectedClass is always inside allowedClasses
  useEffect(() => {
    if (currentUser?.role === 'GURU') {
      if (!allowedClasses.includes(selectedClass)) {
        setSelectedClass(allowedClasses[0] || 'Kelas 4A');
      }
    }
  }, [currentUser, allowedClasses, selectedClass]);

  const login = (nipOrUsername: string, pass: string): { success: boolean; message: string } => {
    const cleanId = nipOrUsername.trim().toLowerCase();
    const cleanPass = pass.trim();

    const users = StorageService.getUsers();

    // 1. Check for Admin Master credentials
    if (
      (cleanId === 'admin' || cleanId === 'admin_kepsek' || cleanId === '197203151998021001') &&
      (cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === 'kepsek123')
    ) {
      const adminUser = users.find(u => u.role === 'ADMIN') || users[0];
      setCurrentUser(adminUser);
      StorageService.setActiveUser(adminUser);
      return { success: true, message: `Selamat datang, ${adminUser.name} (Kepala Sekolah)` };
    }

    // 2. Check general users (Teachers and Staff)
    const found = users.find(u => 
      u.nip.toLowerCase() === cleanId || 
      (u.nuptk && u.nuptk.toLowerCase() === cleanId) || 
      u.email.toLowerCase() === cleanId
    );

    if (!found) {
      return { success: false, message: "NIP, NUPTK, atau Email tidak terdaftar di sistem SIAKAD." };
    }

    if (found.status !== 'Aktif') {
      return { success: false, message: `Akun Anda berstatus "${found.status}". Harap hubungi Kepala Sekolah.` };
    }

    // If user has a password configured, verify it (default fallback to 'guru' or 'admin')
    if (found.password && found.password !== cleanPass && cleanPass !== 'guru' && cleanPass !== 'admin') {
      return { success: false, message: "Kata sandi yang Anda masukkan salah." };
    }

    setCurrentUser(found);
    StorageService.setActiveUser(found);

    // Set default class
    if (found.assignedClasses && found.assignedClasses.length > 0) {
      setSelectedClass(found.assignedClasses[0]);
    }

    return { 
      success: true, 
      message: `Login berhasil! Selamat bertugas, ${found.name}` 
    };
  };

  const registerTeacher = (data: Omit<User, 'id' | 'role' | 'status'> & { password?: string }): { success: boolean; message: string } => {
    if (!data.name || !data.nip || !data.assignedClasses || data.assignedClasses.length === 0) {
      return { success: false, message: "Nama, NIP/NUPTK, dan Kelas yang diampu wajib diisi!" };
    }

    const users = StorageService.getUsers();
    const duplicate = users.find(u => u.nip === data.nip || (data.nuptk && u.nuptk === data.nuptk));
    if (duplicate) {
      return { success: false, message: "NIP atau NUPTK ini sudah terdaftar sebelumnya." };
    }

    const newTeacher: User = {
      id: `usr-guru-${Date.now()}`,
      name: data.name,
      nip: data.nip,
      nuptk: data.nuptk || "",
      role: 'GURU',
      subject: data.subject || "Guru Kelas",
      assignedClasses: data.assignedClasses,
      email: data.email || `${data.nip}@sdn-nusantaramerdeka.sch.id`,
      phone: data.phone || "",
      gender: data.gender || 'L',
      status: 'Aktif',
      password: data.password || 'guru'
    };

    StorageService.saveUser(newTeacher);
    setCurrentUser(newTeacher);
    StorageService.setActiveUser(newTeacher);
    setSelectedClass(newTeacher.assignedClasses[0]);

    return { success: true, message: "Pendaftaran Guru berhasil! Anda telah langsung masuk ke sistem." };
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.setActiveUser(null);
  };

  const updateCurrentUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const merged: User = { ...currentUser, ...updated };
    setCurrentUser(merged);
    StorageService.saveUser(merged);
    StorageService.setActiveUser(merged);
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'GURU';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isTeacher,
        allowedClasses,
        selectedClass,
        setSelectedClass,
        allAvailableClasses,
        login,
        registerTeacher,
        logout,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
