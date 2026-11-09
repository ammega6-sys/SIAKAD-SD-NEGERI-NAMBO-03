export type UserRole = 'ADMIN' | 'GURU';

export interface User {
  id: string;
  name: string;
  nip: string;
  nuptk?: string;
  role: UserRole;
  subject?: string;
  assignedClasses: string[]; // e.g. ['Kelas 4A', 'Kelas 4B']
  email: string;
  phone?: string;
  gender?: 'L' | 'P';
  status: 'Aktif' | 'Nonaktif' | 'Menunggu Persetujuan';
  avatar?: string;
  password?: string;
}

export interface SchoolProfile {
  id: string;
  npsn: string;
  schoolName: string;
  principalName: string;
  principalNip: string;
  address: string;
  phone: string;
  email: string;
  accreditation: string;
  vision: string;
  mission: string[];
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  motto: string;
  principalSpeech: string;
  bannerImage?: string;
  principalImage?: string;
  headOfAdministration?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  birthPlace?: string;
  birthDate?: string;
  parentName?: string;
  phone?: string;
  status: 'Aktif' | 'Mutasi' | 'Lulus';
}

export type AttendanceStatus = 'H' | 'I' | 'S' | 'A' | 'T'; // Hadir, Izin, Sakit, Alpa, Terlambat

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
  recordedBy: string;
  updatedAt: string;
}

export interface GradeRecord {
  id: string;
  classId: string;
  subject: string;
  studentId: string;
  studentName: string;
  uh1: number;
  uh2: number;
  uh3: number;
  uh4: number;
  uh5: number;
  asts: number; // Asesmen Sumatif Tengah Semester
  asas: number; // Asesmen Sumatif Akhir Semester
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  status: 'Tuntas' | 'Perlu Bimbingan';
  updatedAt: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  classId: string;
  description: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'VIDEO' | 'SLIDES' | 'LINK';
  author: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  note?: string;
  score?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  classId: string;
  deadline: string;
  instructions: string;
  fileUrl?: string;
  author: string;
  createdAt: string;
  submissions: AssignmentSubmission[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'Biasa' | 'Penting' | 'Mendesak';
  category: 'Akademik' | 'Administrasi' | 'Kegiatan' | 'Libur' | 'Ujian';
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ForumDiscussion {
  id: string;
  title: string;
  category: string;
  authorName: string;
  authorRole: UserRole;
  classScope: string;
  content: string;
  createdAt: string;
  replies: ForumReply[];
}

export interface SyncState {
  spreadsheetId: string;
  endpointUrl: string;
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'connected' | 'error';
  errorMessage?: string;
}
