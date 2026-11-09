import {
  SchoolProfile,
  User,
  Student,
  AttendanceRecord,
  GradeRecord,
  LearningMaterial,
  Assignment,
  Announcement,
  ForumDiscussion,
  SyncState,
} from '../types';

export const DEFAULT_SPREADSHEET_ID = "1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs";

// Initial Authentic Seed Data
export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  id: "sch-01",
  npsn: "20108745",
  schoolName: "SD NEGERI NUSANTARA MERDEKA",
  principalName: "Drs. H. Ahmad Fauzi, M.Pd.",
  principalNip: "197203151998021001",
  address: "Jl. Pendidikan Nasional No. 45, Kecamatan Cilandak, Jakarta Selatan 12430",
  phone: "(021) 7590-8812",
  email: "admin@sdn-nusantaramerdeka.sch.id",
  accreditation: "A (Unggul) - BAN S/M",
  academicYear: "2026/2027",
  semester: "Ganjil",
  motto: "Cerdas, Berkarakter, Berakhlak Mulia, dan Berbudaya Luhur",
  vision: "Terwujudnya Generasi Emas yang Beriman, Berakhlak Mulia, Berprestasi Global, serta Berwawasan Lingkungan Hidup Berkelanjutan.",
  mission: [
    "Menumbuhkembangkan keimanan dan ketakwaan melalui pembiasaan ibadah dan budi pekerti luhur.",
    "Melaksanakan pembelajaran inovatif, diferensiatif, dan berpusat pada peserta didik berbasis Kurikulum Merdeka.",
    "Mengembangkan potensi minat, bakat, literasi numerasi, dan sains teknologi peserta didik.",
    "Membangun sinergi kolaboratif harmonis antara sekolah, komite, orang tua, dan masyarakat luas.",
    "Mewujudkan budaya sekolah yang ramah anak, bersih, hijau, tertib, dan berwawasan lingkungan."
  ],
  principalSpeech: "Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk kita semua. Selamat datang di portal SIAKAD (Sistem Administrasi Sekolah Terpadu). Melalui digitalisasi administrasi terpadu berbasis Google Workspace & Spreadsheet, kami berkomitmen mewujudkan transparansi, efisiensi kerja guru, penguatan evaluasi pembelajaran, serta monitoring komprehensif bagi seluruh civitas akademika menuju sekolah berprestasi dan berkarakter unggul.",
  bannerImage: "/src/assets/images/school_building_indonesia_1794193480979.jpg",
  principalImage: "/src/assets/images/principal_headshot_1794193495933.jpg",
  headOfAdministration: "Hj. Ratna Sari, S.E."
};

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin",
    name: "Drs. H. Ahmad Fauzi, M.Pd.",
    nip: "197203151998021001",
    role: "ADMIN",
    subject: "Kepala Sekolah",
    assignedClasses: ["Semua Kelas"],
    email: "kepsek@sdn-nusantaramerdeka.sch.id",
    phone: "081298765432",
    gender: "L",
    status: "Aktif",
    avatar: "/src/assets/images/principal_headshot_1794193495933.jpg",
    password: "admin"
  },
  {
    id: "usr-guru-1",
    name: "Siti Rahmawati, S.Pd.",
    nip: "198504122010012015",
    nuptk: "4538763665210032",
    role: "GURU",
    subject: "Guru Kelas & IPAS",
    assignedClasses: ["Kelas 4A"],
    email: "siti.rahmawati@sdn-nusantaramerdeka.sch.id",
    phone: "081345678901",
    gender: "P",
    status: "Aktif",
    password: "guru"
  },
  {
    id: "usr-guru-2",
    name: "Budi Santoso, S.Pd.",
    nip: "198809202014021003",
    nuptk: "6741766668130091",
    role: "GURU",
    subject: "Matematika",
    assignedClasses: ["Kelas 5A"],
    email: "budi.santoso@sdn-nusantaramerdeka.sch.id",
    phone: "081287654321",
    gender: "L",
    status: "Aktif",
    password: "guru"
  },
  {
    id: "usr-guru-3",
    name: "Dewi Anggraeni, S.Pd., M.Hum.",
    nip: "199201052019032008",
    nuptk: "1234769670230044",
    role: "GURU",
    subject: "Bahasa Indonesia",
    assignedClasses: ["Kelas 6A"],
    email: "dewi.anggraeni@sdn-nusantaramerdeka.sch.id",
    phone: "085712345678",
    gender: "P",
    status: "Aktif",
    password: "guru"
  },
  {
    id: "usr-guru-4",
    name: "Hendra Wijaya, S.Pd.",
    nip: "199003182015031002",
    nuptk: "8912768669110055",
    role: "GURU",
    subject: "Pendidikan Jasmani & Kesehatan",
    assignedClasses: ["Kelas 4A", "Kelas 5A"],
    email: "hendra.wijaya@sdn-nusantaramerdeka.sch.id",
    phone: "081299887766",
    gender: "L",
    status: "Aktif",
    password: "guru"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // Kelas 4A
  { id: "std-4a-01", nis: "23240401", nisn: "0134891201", name: "Aditya Pratama Putra", gender: "L", classId: "Kelas 4A", parentName: "Bambang Pratama", phone: "081200112233", status: "Aktif" },
  { id: "std-4a-02", nis: "23240402", nisn: "0134891202", name: "Annisa Tri Putri", gender: "P", classId: "Kelas 4A", parentName: "Hadi Triyono", phone: "081200112234", status: "Aktif" },
  { id: "std-4a-03", nis: "23240403", nisn: "0134891203", name: "Bagas Kurniawan", gender: "L", classId: "Kelas 4A", parentName: "Kurnia Sandi", phone: "081200112235", status: "Aktif" },
  { id: "std-4a-04", nis: "23240404", nisn: "0134891204", name: "Citra Ayu Lestari", gender: "P", classId: "Kelas 4A", parentName: "Agus Lestari", phone: "081200112236", status: "Aktif" },
  { id: "std-4a-05", nis: "23240405", nisn: "0134891205", name: "Daffa Al Ghifari", gender: "L", classId: "Kelas 4A", parentName: "Rudi Hartono", phone: "081200112237", status: "Aktif" },
  { id: "std-4a-06", nis: "23240406", nisn: "0134891206", name: "Eka Rahmadani", gender: "P", classId: "Kelas 4A", parentName: "Rahmat Santoso", phone: "081200112238", status: "Aktif" },
  { id: "std-4a-07", nis: "23240407", nisn: "0134891207", name: "Fikri Ardiansyah", gender: "L", classId: "Kelas 4A", parentName: "Ardiansyah Syah", phone: "081200112239", status: "Aktif" },
  { id: "std-4a-08", nis: "23240408", nisn: "0134891208", name: "Gita Novita Sari", gender: "P", classId: "Kelas 4A", parentName: "Suyanto", phone: "081200112240", status: "Aktif" },
  { id: "std-4a-09", nis: "23240409", nisn: "0134891209", name: "Haikal Ilham Pratama", gender: "L", classId: "Kelas 4A", parentName: "Ilham Ramadhan", phone: "081200112241", status: "Aktif" },
  { id: "std-4a-10", nis: "23240410", nisn: "0134891210", name: "Intan Permata Indah", gender: "P", classId: "Kelas 4A", parentName: "Indra Permadi", phone: "081200112242", status: "Aktif" },

  // Kelas 5A
  { id: "std-5a-01", nis: "22230501", nisn: "0124891301", name: "Joko Susilo", gender: "L", classId: "Kelas 5A", parentName: "Susilo Broto", phone: "081300223344", status: "Aktif" },
  { id: "std-5a-02", nis: "22230502", nisn: "0124891302", name: "Kania Dewi Anggraini", gender: "P", classId: "Kelas 5A", parentName: "Yudi Anggoro", phone: "081300223345", status: "Aktif" },
  { id: "std-5a-03", nis: "22230503", nisn: "0124891303", name: "Lukman Hakim Prasetyo", gender: "L", classId: "Kelas 5A", parentName: "Prasetyo Edi", phone: "081300223346", status: "Aktif" },
  { id: "std-5a-04", nis: "22230504", nisn: "0124891304", name: "Maya Anggraini", gender: "P", classId: "Kelas 5A", parentName: "Budi Utomo", phone: "081300223347", status: "Aktif" },
  { id: "std-5a-05", nis: "22230505", nisn: "0124891305", name: "Nabil Fauzan Azhar", gender: "L", classId: "Kelas 5A", parentName: "Fauzan Azhari", phone: "081300223348", status: "Aktif" },
  { id: "std-5a-06", nis: "22230506", nisn: "0124891306", name: "Olivia Putri Kirana", gender: "P", classId: "Kelas 5A", parentName: "Iwan Setiawan", phone: "081300223349", status: "Aktif" },
  { id: "std-5a-07", nis: "22230507", nisn: "0124891307", name: "Panji Gemilang", gender: "L", classId: "Kelas 5A", parentName: "Gatot Subroto", phone: "081300223350", status: "Aktif" },
  { id: "std-5a-08", nis: "22230508", nisn: "0124891308", name: "Qanita Salsabila", gender: "P", classId: "Kelas 5A", parentName: "M. Rizal", phone: "081300223351", status: "Aktif" },

  // Kelas 6A
  { id: "std-6a-01", nis: "21220601", nisn: "0114891401", name: "Taufik Hidayat", gender: "L", classId: "Kelas 6A", parentName: "Dedy Hidayat", phone: "081400334455", status: "Aktif" },
  { id: "std-6a-02", nis: "21220602", nisn: "0114891402", name: "Ulfa Hasanah", gender: "P", classId: "Kelas 6A", parentName: "Hasan Basri", phone: "081400334456", status: "Aktif" },
  { id: "std-6a-03", nis: "21220603", nisn: "0114891403", name: "Viko Ramadhan Putra", gender: "L", classId: "Kelas 6A", parentName: "Ramadhan Syah", phone: "081400334457", status: "Aktif" },
  { id: "std-6a-04", nis: "21220604", nisn: "0114891404", name: "Widya Astuti", gender: "P", classId: "Kelas 6A", parentName: "Slamet Riyadi", phone: "081400334458", status: "Aktif" },
  { id: "std-6a-05", nis: "21220605", nisn: "0114891405", name: "Yoga Pratama", gender: "L", classId: "Kelas 6A", parentName: "Wawan Kurnia", phone: "081400334459", status: "Aktif" },
  { id: "std-6a-06", nis: "21220606", nisn: "0114891406", name: "Zahra Amelia", gender: "P", classId: "Kelas 6A", parentName: "Amiruddin", phone: "081400334460", status: "Aktif" }
];

// Seed attendance for current dates
const TODAY = new Date().toISOString().split('T')[0];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-4a-01", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-02", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-02", studentName: "Annisa Tri Putri", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-03", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-03", studentName: "Bagas Kurniawan", status: "S", note: "Demam ringan", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-04", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-04", studentName: "Citra Ayu Lestari", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-05", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-05", studentName: "Daffa Al Ghifari", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-06", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-06", studentName: "Eka Rahmadani", status: "I", note: "Acara keluarga", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-07", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-07", studentName: "Fikri Ardiansyah", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-08", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-08", studentName: "Gita Novita Sari", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-09", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-09", studentName: "Haikal Ilham Pratama", status: "T", note: "Terlambat 10 menit macet", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },
  { id: "att-4a-10", date: TODAY, classId: "Kelas 4A", studentId: "std-4a-10", studentName: "Intan Permata Indah", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: TODAY },

  // Kelas 5A
  { id: "att-5a-01", date: TODAY, classId: "Kelas 5A", studentId: "std-5a-01", studentName: "Joko Susilo", status: "H", note: "", recordedBy: "Budi Santoso, S.Pd.", updatedAt: TODAY },
  { id: "att-5a-02", date: TODAY, classId: "Kelas 5A", studentId: "std-5a-02", studentName: "Kania Dewi Anggraini", status: "H", note: "", recordedBy: "Budi Santoso, S.Pd.", updatedAt: TODAY },
  { id: "att-5a-03", date: TODAY, classId: "Kelas 5A", studentId: "std-5a-03", studentName: "Lukman Hakim Prasetyo", status: "H", note: "", recordedBy: "Budi Santoso, S.Pd.", updatedAt: TODAY },
  { id: "att-5a-04", date: TODAY, classId: "Kelas 5A", studentId: "std-5a-04", studentName: "Maya Anggraini", status: "H", note: "", recordedBy: "Budi Santoso, S.Pd.", updatedAt: TODAY }
];

export function calculateGrade(uh1: number, uh2: number, uh3: number, uh4: number, uh5: number, asts: number, asas: number): { finalScore: number; predicate: 'A' | 'B' | 'C' | 'D'; status: 'Tuntas' | 'Perlu Bimbingan' } {
  const uhValues = [uh1, uh2, uh3, uh4, uh5].filter(v => v > 0);
  const avgUH = uhValues.length > 0 ? uhValues.reduce((a, b) => a + b, 0) / uhValues.length : 0;
  
  // Bobot Kurikulum Merdeka standar: UH (40%) + ASTS (30%) + ASAS (30%)
  const finalScore = Math.round((avgUH * 0.4) + (asts * 0.3) + (asas * 0.3));

  let predicate: 'A' | 'B' | 'C' | 'D' = 'D';
  if (finalScore >= 90) predicate = 'A';
  else if (finalScore >= 80) predicate = 'B';
  else if (finalScore >= 70) predicate = 'C';
  else predicate = 'D';

  const status = finalScore >= 75 ? 'Tuntas' : 'Perlu Bimbingan';

  return { finalScore, predicate, status };
}

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: "grd-4a-01",
    classId: "Kelas 4A",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    studentId: "std-4a-01",
    studentName: "Aditya Pratama Putra",
    uh1: 88,
    uh2: 90,
    uh3: 85,
    uh4: 92,
    uh5: 86,
    asts: 88,
    asas: 90,
    finalScore: 89,
    predicate: "B",
    status: "Tuntas",
    updatedAt: TODAY
  },
  {
    id: "grd-4a-02",
    classId: "Kelas 4A",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    studentId: "std-4a-02",
    studentName: "Annisa Tri Putri",
    uh1: 95,
    uh2: 92,
    uh3: 94,
    uh4: 96,
    uh5: 90,
    asts: 92,
    asas: 95,
    finalScore: 94,
    predicate: "A",
    status: "Tuntas",
    updatedAt: TODAY
  },
  {
    id: "grd-4a-03",
    classId: "Kelas 4A",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    studentId: "std-4a-03",
    studentName: "Bagas Kurniawan",
    uh1: 72,
    uh2: 70,
    uh3: 75,
    uh4: 68,
    uh5: 74,
    asts: 70,
    asas: 72,
    finalScore: 71,
    predicate: "C",
    status: "Perlu Bimbingan",
    updatedAt: TODAY
  },
  {
    id: "grd-4a-04",
    classId: "Kelas 4A",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    studentId: "std-4a-04",
    studentName: "Citra Ayu Lestari",
    uh1: 85,
    uh2: 88,
    uh3: 86,
    uh4: 87,
    uh5: 89,
    asts: 86,
    asas: 88,
    finalScore: 87,
    predicate: "B",
    status: "Tuntas",
    updatedAt: TODAY
  },
  {
    id: "grd-4a-05",
    classId: "Kelas 4A",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    studentId: "std-4a-05",
    studentName: "Daffa Al Ghifari",
    uh1: 80,
    uh2: 82,
    uh3: 78,
    uh4: 85,
    uh5: 80,
    asts: 82,
    asas: 84,
    finalScore: 82,
    predicate: "B",
    status: "Tuntas",
    updatedAt: TODAY
  },
  // Kelas 5A Matematika
  {
    id: "grd-5a-01",
    classId: "Kelas 5A",
    subject: "Matematika",
    studentId: "std-5a-01",
    studentName: "Joko Susilo",
    uh1: 85,
    uh2: 82,
    uh3: 88,
    uh4: 80,
    uh5: 84,
    asts: 85,
    asas: 88,
    finalScore: 85,
    predicate: "B",
    status: "Tuntas",
    updatedAt: TODAY
  },
  {
    id: "grd-5a-02",
    classId: "Kelas 5A",
    subject: "Matematika",
    studentId: "std-5a-02",
    studentName: "Kania Dewi Anggraini",
    uh1: 94,
    uh2: 96,
    uh3: 92,
    uh4: 95,
    uh5: 98,
    asts: 95,
    asas: 96,
    finalScore: 95,
    predicate: "A",
    status: "Tuntas",
    updatedAt: TODAY
  }
];

export const INITIAL_MATERIALS: LearningMaterial[] = [
  {
    id: "mat-01",
    title: "Modul Ajar IPAS: Rantai Makanan & Keseimbangan Ekosistem",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    classId: "Kelas 4A",
    description: "Panduan pembelajaran interaktif mengenai produsen, konsumen, dekomposer, serta dinamika jaring-jaring makanan dalam ekosistem darat dan perairan.",
    fileUrl: "https://drive.google.com/file/d/sample-modul-ipas-ekosistem/view",
    fileType: "PDF",
    author: "Siti Rahmawati, S.Pd.",
    createdAt: "2026-11-01"
  },
  {
    id: "mat-02",
    title: "Materi & Video: Operasi Hitung Pecahan Campuran & Desimal",
    subject: "Matematika",
    classId: "Kelas 5A",
    description: "Penjelasan konsep penyederhanaan pecahan dan operasi penjumlahan serta perkalian bilangan desimal dengan studi kasus kontekstual.",
    fileUrl: "https://youtube.com/watch?v=sample-matematika-pecahan",
    fileType: "VIDEO",
    author: "Budi Santoso, S.Pd.",
    createdAt: "2026-11-03"
  },
  {
    id: "mat-03",
    title: "Modul Literasi: Mengenal Cerita Rakyat Nusantara & Amanat Moral",
    subject: "Bahasa Indonesia",
    classId: "Kelas 6A",
    description: "Kumpulan cerita rakyat dari Sabang sampai Merauke dilengkapi dengan lembar kerja analisis unsur intrinsik dan ekstrinsik.",
    fileUrl: "https://drive.google.com/file/d/sample-cerita-rakyat/view",
    fileType: "SLIDES",
    author: "Dewi Anggraeni, S.Pd., M.Hum.",
    createdAt: "2026-11-05"
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-01",
    title: "Tugas Proyek Mini: Diorama Jaring-Jaring Makanan",
    subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    classId: "Kelas 4A",
    deadline: "2026-11-20",
    instructions: "Buatlah diorama sederhana menggunakan bahan kardus bekas atau gambar karton yang menggambarkan interaksi rantai makanan di hutan hujan tropis. Foto hasil karya dan unggah deskripsinya.",
    fileUrl: "https://drive.google.com/file/d/panduan-proyek-diorama/view",
    author: "Siti Rahmawati, S.Pd.",
    createdAt: "2026-11-06",
    submissions: [
      { id: "sub-01", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", submittedAt: "2026-11-07 14:30", note: "Sudah selesai Bu, saya membuat ekosistem savana.", score: 92, feedback: "Kreatif sekali susunan produsen dan predatornya!" },
      { id: "sub-02", studentId: "std-4a-02", studentName: "Annisa Tri Putri", submittedAt: "2026-11-07 16:15", note: "Diorama ekosistem hutan mangrove selesai.", score: 95, feedback: "Penjelasan peran dekomposer sangat mendalam." }
    ]
  },
  {
    id: "asg-02",
    title: "Lembar Kerja Siswa: Pemecahan Masalah Bilangan Pecahan",
    subject: "Matematika",
    classId: "Kelas 5A",
    deadline: "2026-11-18",
    instructions: "Kerjakan 10 soal cerita kontekstual pada halaman 42 Buku Matematika Kemdikbud. Tuliskan langkah pengerjaan 'Diketahui, Ditanya, Dijawab'.",
    author: "Budi Santoso, S.Pd.",
    createdAt: "2026-11-05",
    submissions: [
      { id: "sub-03", studentId: "std-5a-02", studentName: "Kania Dewi Anggraini", submittedAt: "2026-11-06 18:20", score: 98, feedback: "Langkah terstruktur dan sangat rapi." }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Pelaksanaan Asesmen Bakat & Minat (ABM) serta Supervisi Akademik",
    content: "Diberitahukan kepada seluruh Bapak/Ibu Dewan Guru bahwa supervisi kurikulum dan tindak lanjut asesmen capaian belajar semester ganjil akan dijadwalkan mulai pekan depan. Mohon administrasi modul ajar dan rekap nilai UH sudah lengkap di SIAKAD.",
    author: "Drs. H. Ahmad Fauzi, M.Pd. (Kepala Sekolah)",
    date: "2026-11-07",
    priority: "Penting",
    category: "Akademik",
    isPinned: true
  },
  {
    id: "ann-02",
    title: "Agenda Rapat Pleno Dewan Guru & Sosialisasi P5 Kurikulum Merdeka",
    content: "Rapat koordinasi dewan guru dan tim fasilitator P5 tema 'Kearifan Lokal dan Kewirausahaan Cilik' akan diselenggarakan pada hari Kamis pukul 13.00 WIB bertempat di Ruang Multimedia.",
    author: "Drs. H. Ahmad Fauzi, M.Pd. (Kepala Sekolah)",
    date: "2026-11-05",
    priority: "Biasa",
    category: "Administrasi",
    isPinned: false
  },
  {
    id: "ann-03",
    title: "Informasi Libur Nasional & Kegiatan Belajar Mandiri di Rumah",
    content: "Sehubungan dengan peringatan hari libur nasional, kegiatan tatap muka ditiadakan. Peserta didik diharapkan menyelesaikan penugasan literasi dan proyek belajar mandiri melalui portal SIAKAD.",
    author: "Drs. H. Ahmad Fauzi, M.Pd. (Kepala Sekolah)",
    date: "2026-11-02",
    priority: "Biasa",
    category: "Libur",
    isPinned: false
  }
];

export const INITIAL_DISCUSSIONS: ForumDiscussion[] = [
  {
    id: "dsc-01",
    title: "Penerapan Diferensiasi Pembelajaran Berbasis Gaya Belajar Visual & Kinestetik",
    category: "Pedagogik & Metode Ajar",
    authorName: "Siti Rahmawati, S.Pd.",
    authorRole: "GURU",
    classScope: "Semua Kelas",
    content: "Bapak/Ibu sekalian, bagaimana pendekatan yang efektif dalam menyusun asesmen formatif bagi siswa dengan gaya belajar kinestetik pada mata pelajaran sains/IPAS agar tetap objektif?",
    createdAt: "2026-11-06 10:15",
    replies: [
      {
        id: "rep-01",
        authorName: "Drs. H. Ahmad Fauzi, M.Pd.",
        authorRole: "ADMIN",
        content: "Sangat baik Bu Siti. Bisa menggunakan rubrik unjuk kerja praktikum langsung atau permainan peran (role-playing), dilengkapi lembar observasi kriteria ketercapaian tujuan pembelajaran (KKTP).",
        createdAt: "2026-11-06 11:20"
      },
      {
        id: "rep-02",
        authorName: "Budi Santoso, S.Pd.",
        authorRole: "GURU",
        content: "Sepakat Pak Kepsek. Di Matematika saya coba padukan dengan mini-game kartu pecahan dan terbukti sangat meningkatkan antusiasme.",
        createdAt: "2026-11-06 13:00"
      }
    ]
  },
  {
    id: "dsc-02",
    title: "Pemanfaatan Mini Game Edukasi di Kelas 5A untuk Literasi Numerasi",
    category: "Teknologi Pembelajaran",
    authorName: "Budi Santoso, S.Pd.",
    authorRole: "GURU",
    classScope: "Kelas 5A",
    content: "Fitur game edukasi di SIAKAD sangat membantu siswa saat ice breaking maupun refleksi materi. Ada rekomendasi topik tambahan untuk game berikutnya?",
    createdAt: "2026-11-07 09:30",
    replies: [
      {
        id: "rep-03",
        authorName: "Dewi Anggraeni, S.Pd., M.Hum.",
        authorRole: "GURU",
        content: "Mungkin bisa ditambahkan tebak kosakata baku dan idiom bahasa daerah Nusantara Pak Budi!",
        createdAt: "2026-11-07 10:10"
      }
    ]
  }
];

// Local Storage Helper
const STORAGE_KEYS = {
  PROFILE: 'siakad_school_profile',
  USERS: 'siakad_users',
  STUDENTS: 'siakad_students',
  ATTENDANCE: 'siakad_attendance',
  GRADES: 'siakad_grades',
  MATERIALS: 'siakad_materials',
  ASSIGNMENTS: 'siakad_assignments',
  ANNOUNCEMENTS: 'siakad_announcements',
  DISCUSSIONS: 'siakad_discussions',
  SYNC_CONFIG: 'siakad_sync_config',
  ACTIVE_USER: 'siakad_active_user',
};

export class StorageService {
  private static getStored<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private static setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('siakad_storage_updated'));
    } catch (err) {
      console.error("Storage error:", err);
    }
  }

  // School Profile
  static getProfile(): SchoolProfile {
    return this.getStored<SchoolProfile>(STORAGE_KEYS.PROFILE, INITIAL_SCHOOL_PROFILE);
  }
  static saveProfile(profile: SchoolProfile): void {
    this.setStored(STORAGE_KEYS.PROFILE, profile);
  }

  // Users
  static getUsers(): User[] {
    return this.getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  static saveUsers(users: User[]): void {
    this.setStored(STORAGE_KEYS.USERS, users);
  }
  static saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
  }

  // Active Session
  static getActiveUser(): User | null {
    return this.getStored<User | null>(STORAGE_KEYS.ACTIVE_USER, INITIAL_USERS[0]);
  }
  static setActiveUser(user: User | null): void {
    this.setStored(STORAGE_KEYS.ACTIVE_USER, user);
  }

  // Students
  static getStudents(): Student[] {
    return this.getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }
  static saveStudents(students: Student[]): void {
    this.setStored(STORAGE_KEYS.STUDENTS, students);
  }
  static saveStudent(student: Student): void {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) list[idx] = student;
    else list.push(student);
    this.saveStudents(list);
  }
  static deleteStudent(id: string): void {
    const list = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(list);
  }

  // Attendance
  static getAttendance(): AttendanceRecord[] {
    return this.getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }
  static saveAttendance(records: AttendanceRecord[]): void {
    this.setStored(STORAGE_KEYS.ATTENDANCE, records);
  }
  static recordAttendanceBatch(batch: AttendanceRecord[]): void {
    const current = this.getAttendance();
    const map = new Map<string, AttendanceRecord>();
    current.forEach(r => map.set(`${r.date}_${r.studentId}`, r));
    batch.forEach(r => map.set(`${r.date}_${r.studentId}`, r));
    this.saveAttendance(Array.from(map.values()));
  }

  // Grades
  static getGrades(): GradeRecord[] {
    return this.getStored<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
  }
  static saveGrades(grades: GradeRecord[]): void {
    this.setStored(STORAGE_KEYS.GRADES, grades);
  }
  static saveGrade(grade: GradeRecord): void {
    const list = this.getGrades();
    const idx = list.findIndex(g => g.id === grade.id || (g.studentId === grade.studentId && g.subject === grade.subject));
    if (idx >= 0) list[idx] = grade;
    else list.push(grade);
    this.saveGrades(list);
  }

  // Learning Materials
  static getMaterials(): LearningMaterial[] {
    return this.getStored<LearningMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  }
  static saveMaterials(materials: LearningMaterial[]): void {
    this.setStored(STORAGE_KEYS.MATERIALS, materials);
  }
  static saveMaterial(material: LearningMaterial): void {
    const list = this.getMaterials();
    const idx = list.findIndex(m => m.id === material.id);
    if (idx >= 0) list[idx] = material;
    else list.unshift(material);
    this.saveMaterials(list);
  }
  static deleteMaterial(id: string): void {
    const list = this.getMaterials().filter(m => m.id !== id);
    this.saveMaterials(list);
  }

  // Assignments
  static getAssignments(): Assignment[] {
    return this.getStored<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }
  static saveAssignments(assignments: Assignment[]): void {
    this.setStored(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }
  static saveAssignment(assignment: Assignment): void {
    const list = this.getAssignments();
    const idx = list.findIndex(a => a.id === assignment.id);
    if (idx >= 0) list[idx] = assignment;
    else list.unshift(assignment);
    this.saveAssignments(list);
  }
  static deleteAssignment(id: string): void {
    const list = this.getAssignments().filter(a => a.id !== id);
    this.saveAssignments(list);
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return this.getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }
  static saveAnnouncements(announcements: Announcement[]): void {
    this.setStored(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }
  static saveAnnouncement(announcement: Announcement): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === announcement.id);
    if (idx >= 0) list[idx] = announcement;
    else list.unshift(announcement);
    this.saveAnnouncements(list);
  }
  static deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    this.saveAnnouncements(list);
  }

  // Forum Discussions
  static getDiscussions(): ForumDiscussion[] {
    return this.getStored<ForumDiscussion[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
  }
  static saveDiscussions(discussions: ForumDiscussion[]): void {
    this.setStored(STORAGE_KEYS.DISCUSSIONS, discussions);
  }
  static saveDiscussion(discussion: ForumDiscussion): void {
    const list = this.getDiscussions();
    const idx = list.findIndex(d => d.id === discussion.id);
    if (idx >= 0) list[idx] = discussion;
    else list.unshift(discussion);
    this.saveDiscussions(list);
  }
  static addReply(discussionId: string, reply: ForumDiscussion['replies'][0]): void {
    const list = this.getDiscussions();
    const disc = list.find(d => d.id === discussionId);
    if (disc) {
      disc.replies.push(reply);
      this.saveDiscussions(list);
    }
  }

  // Sync Settings
  static getSyncState(): SyncState {
    const fallback: SyncState = {
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      endpointUrl: (import.meta as any).env?.VITE_GAS_ENDPOINT || "",
      lastSyncedAt: null,
      status: 'idle'
    };
    return this.getStored<SyncState>(STORAGE_KEYS.SYNC_CONFIG, fallback);
  }
  static saveSyncState(state: SyncState): void {
    this.setStored(STORAGE_KEYS.SYNC_CONFIG, state);
  }

  // Reset to default seed data
  static resetAllToDefault(): void {
    this.saveProfile(INITIAL_SCHOOL_PROFILE);
    this.saveUsers(INITIAL_USERS);
    this.saveStudents(INITIAL_STUDENTS);
    this.saveAttendance(INITIAL_ATTENDANCE);
    this.saveGrades(INITIAL_GRADES);
    this.saveMaterials(INITIAL_MATERIALS);
    this.saveAssignments(INITIAL_ASSIGNMENTS);
    this.saveAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.saveDiscussions(INITIAL_DISCUSSIONS);
    this.setActiveUser(INITIAL_USERS[0]);
  }
}
