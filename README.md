# SIAKAD — Sistem Administrasi Sekolah Terpadu 🇮🇩
**Berbasis Web Modern (React + TypeScript + Vite + Tailwind CSS) & Database Google Sheets**

Aplikasi sistem administrasi sekolah terintegrasi dengan standar Kurikulum Merdeka, dirancang untuk sekolah tingkat SD, SMP, maupun SMA di Indonesia. Sistem ini menggunakan **Google Sheets** sebagai database utama (Spreadsheet ID: `1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs`) yang terhubung melalui endpoint Google Apps Script Web App.

---

## 🌟 Fitur Utama Aplikasi

### 1. Sistem Autentikasi & Hak Akses (Role-Based Access Control)
* **Role Admin (Kepala Sekolah):**
  * Akses audit menyeluruh ke seluruh data kelas, rombel, rekapitulasi kehadiran, ledger nilai, dan direktori dewan guru.
  * Kredensial default: NIP `197203151998021001` / Password: `admin` (atau username `admin`).
* **Role Guru:**
  * Login menggunakan NIP, NUPTK, atau melakukan Pendaftaran Akun Guru Baru (Register) lengkap dengan Nama, NIP/NUPTK, Mata Pelajaran, dan Kelas yang diampu.
  * **Restriksi Kelas (Data Isolation):** Guru hanya berhak mengakses, melihat, dan menginput data siswa serta administrasi pada kelas yang diampunya saja. Sistem memblokir akses ke data rombel lain secara ketat.

### 2. Modul Akademik & Administrasi
* **🏛️ Dashboard & Profil Sekolah:** Profil lembaga (NPSN, Akreditasi A Unggul, Alamat, Kontak), Visi-Misi, statistik ringkas kehadiran, dan banner sekolah.
* **📜 Data Kepala Sekolah:** Profil pejabat, riwayat SK, amanat/sambutan resmi, dan 4 pilar kebijakan mutu sekolah.
* **👨‍🏫 Direktori & Data Guru:** Manajemen dewan guru, penugasan mata pelajaran, dan distribusi rombel.
* **📅 Modul Absensi Kehadiran:**
  * Pencatatan presensi harian siswa (Hadir, Sakit, Izin, Alpa, Terlambat).
  * Rekapitulasi kehadiran bulanan otomatis.
  * Fitur cetak laporan resmi berformat KOP SURAT DINAS PENDIDIKAN dengan tanda tangan Kepala Sekolah & Guru Kelas (Print-friendly A4/Folio).
* **📝 Modul Penilaian / Ledger Nilai:**
  * Input dan rekap nilai Ulangan Harian (UH 1 sampai UH 5).
  * Input nilai Asesmen Sumatif Tengah Semester (ASTS).
  * Input nilai Asesmen Sumatif Akhir Semester (ASAS).
  * Perhitungan Nilai Akhir (NA), Predikat (A/B/C/D), dan status kelulusan/ketercapaian otomatis berbasis standar Kurikulum Merdeka.
  * Fitur cetak buku ledger nilai resmi.
* **📚 Modul Bahan Belajar:** Unggah dan distribusi modul ajar digital, presentasi slides, materi video, dan file panduan siswa.
* **📋 Modul Tugas Belajar:** Pembuatan tugas mandiri/kelompok, pemantauan status pengumpulan siswa, penilaian terstruktur, dan feedback guru.
* **🎮 Game Edukasi Interaktif:**
  * Kuis Juara Sains & Kebangsaan (5 soal Kurikulum Merdeka + timer + pembahasan).
  * Tantangan Matematika Kilat 30 Detik (kecepatan berhitung + combo streak).
  * Tebak Kata Kosakata Nusantara.
* **📢 Papan Pengumuman Resmi:** Publikasi surat edaran dan informasi penting dari pimpinan sekolah.
* **💬 Forum Diskusi Akademik:** Ruang konsultasi dan kolaborasi pedagogik antar sesama dewan guru.

---

## 🚀 Panduan Deployment ke Vercel & GitHub

### Langkah 1: Push Repositori ke GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi aplikasi SIAKAD terpadu"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/siakad-sekolah.git
git push -u origin main
```

### Langkah 2: Deploy ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik tombol **"Add New..."** > **"Project"**.
3. Import repositori GitHub Anda (`siakad-sekolah`).
4. Pada bagian **Framework Preset**, pilih **Vite**.
5. Konfigurasi Environment Variables (opsional jika sudah memiliki URL Apps Script):
   * `VITE_GAS_ENDPOINT`: URL Google Apps Script Web App Anda.
6. Klik **"Deploy"**. Vercel akan otomatis membangun aplikasi dalam waktu kurang dari 1 menit! File `vercel.json` sudah disediakan untuk memastikan routing SPA berfungsi sempurna.

---

## 📊 Panduan Menghubungkan Google Sheets

Aplikasi ini telah disiapkan untuk Spreadsheet ID: `1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs`.

1. Buka spreadsheet Google Sheets Anda:
   👉 [https://docs.google.com/spreadsheets/d/1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs/edit](https://docs.google.com/spreadsheets/d/1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs/edit)
2. Pada menu atas spreadsheet, klik **Ekstensi (Extensions)** &gt; **Apps Script**.
3. Buka file `/google-apps-script/Code.gs` dari proyek ini (atau klik tombol **"Salin Kode Script"** di dalam menu *Google Sheets DB* pada aplikasi).
4. Tempelkan seluruh kode ke editor Apps Script dan klik **Simpan (Save)**.
5. Klik tombol biru **Deploy (Terapkan)** di kanan atas &gt; **Deployment Baru (New Deployment)**.
6. Pilih jenis: **Aplikasi Web (Web App)**:
   * **Deskripsi**: `SIAKAD API v1`
   * **Jalankan sebagai (Execute as)**: `Saya (Me)`
   * **Siapa yang memiliki akses (Who has access)**: `Siapa saja (Anyone)` *(Penting agar aplikasi web dapat berkomunikasi tanpa kendala izin)*.
7. Klik **Deploy** dan berikan otorisasi izin akses akun Google Anda.
8. Salin URL Aplikasi Web yang diberikan (contoh format: `https://script.google.com/macros/s/AKfycb.../exec`).
9. Masuk ke aplikasi SIAKAD, klik menu **"Google Sheets DB"**, tempelkan URL tersebut, lalu klik **"Simpan URL"** dan **"Unggah Data (Push)"** untuk menginisialisasi spreadsheet Anda!

---

## 💻 Menjalankan di Komputer Lokal (Local Development)

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan development server
npm run dev

# 3. Build aplikasi untuk produksi
npm run build
```

---

## 🛡️ Hak Cipta & Lisensi
Dikembangkan untuk mendukung digitalisasi tata kelola administrasi pendidikan sekolah di seluruh Indonesia. Berbasis standar Kurikulum Merdeka.
