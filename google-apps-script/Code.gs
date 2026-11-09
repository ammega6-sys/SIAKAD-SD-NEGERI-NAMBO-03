/**
 * ==============================================================================
 * SIAKAD (Sistem Administrasi Sekolah Terpadu)
 * Backend Google Apps Script Web App
 * Spreadsheet ID: 1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs
 * ==============================================================================
 * 
 * PANDUAN DEPLOYMENT:
 * 1. Buka spreadsheet: https://docs.google.com/spreadsheets/d/1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs/edit
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua kode default di file Code.gs, lalu salin dan tempelkan SELURUH isi file ini.
 * 4. Klik tombol "Deploy" (Terapkan) di kanan atas > "Deployment Baru" (New Deployment).
 * 5. Pilih jenis: "Aplikasi Web" (Web App).
 * 6. Deskripsi: "SIAKAD API v1".
 * 7. Jalankan sebagai (Execute as): "Saya" (Me - pemilik spreadsheet).
 * 8. Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone).
 * 9. Klik "Deploy", beri izin (Grant permissions), lalu SALIN URL Aplikasi Web yang diberikan (format: https://script.google.com/macros/s/.../exec).
 * 10. Masukkan URL tersebut pada menu "Sinkronisasi Google Sheets" di aplikasi SIAKAD web Anda!
 */

const SPREADSHEET_ID = "1MIJeoGrXH01kU23vUu5D5UukDGgiZsqt-JDC6H2MrNs";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

// Respon JSON dengan header CORS yang tepat
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Endpoint GET untuk mengecek koneksi dan mengambil data
function doGet(e) {
  try {
    const ss = getSpreadsheet();
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || "ping";

    if (action === "ping") {
      return createJsonResponse({
        status: "success",
        message: "Koneksi ke Google Sheets SIAKAD Berhasil!",
        spreadsheetId: SPREADSHEET_ID,
        spreadsheetName: ss.getName(),
        sheets: ss.getSheets().map(s => s.getName()),
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getAll") {
      const result = {};
      const sheetNames = ["ProfilSekolah", "Guru", "Siswa", "Absensi", "Nilai", "BahanAjar", "Tugas", "Pengumuman", "ForumDiskusi"];
      
      sheetNames.forEach(function(name) {
        const sheet = ss.getSheetByName(name);
        if (!sheet) {
          result[name] = [];
          return;
        }
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) {
          result[name] = [];
          return;
        }
        const headers = data[0];
        const rows = [];
        for (let i = 1; i < data.length; i++) {
          const rowObj = {};
          for (let j = 0; j < headers.length; j++) {
            let val = data[i][j];
            // Format khusus jika objek atau array
            if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
              try { val = JSON.parse(val); } catch(e) {}
            }
            rowObj[headers[j]] = val;
          }
          rows.push(rowObj);
        }
        result[name] = rows;
      });

      return createJsonResponse({
        status: "success",
        data: result,
        timestamp: new Date().toISOString()
      });
    }

    if (action === "initSheets") {
      const initResult = initializeDefaultSheets(ss);
      return createJsonResponse({
        status: "success",
        message: "Struktur sheet berhasil diinisialisasi otomatis!",
        details: initResult
      });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenal: " + action });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

// Endpoint POST untuk menyimpan data dari Web ke Google Sheets
function doPost(e) {
  try {
    const ss = getSpreadsheet();
    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const action = body.action || "saveRecord";

    // 1. Simpan satu record ke sheet tertentu
    if (action === "saveRecord") {
      const sheetName = body.sheet;
      const record = body.data;
      if (!sheetName || !record || !record.id) {
        return createJsonResponse({ status: "error", message: "Parameter sheet atau data.id tidak valid" });
      }

      let sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }

      const rows = sheet.getDataRange().getValues();
      let headers = [];

      if (rows.length === 0 || rows[0].length === 0 || rows[0][0] === "") {
        headers = Object.keys(record);
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
      } else {
        headers = rows[0];
        // Pastikan kolom baru jika ada
        const newKeys = Object.keys(record).filter(k => headers.indexOf(k) === -1);
        if (newKeys.length > 0) {
          headers = headers.concat(newKeys);
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        }
      }

      // Cari baris berdasarkan ID
      let existingRowIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(record.id)) {
          existingRowIndex = i + 1; // 1-indexed
          break;
        }
      }

      const rowValues = headers.map(key => {
        const val = record[key];
        if (typeof val === "object" && val !== null) {
          return JSON.stringify(val);
        }
        return val !== undefined && val !== null ? val : "";
      });

      if (existingRowIndex > 0) {
        sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheet.appendRow(rowValues);
      }

      return createJsonResponse({
        status: "success",
        message: "Data berhasil disimpan di sheet " + sheetName,
        id: record.id
      });
    }

    // 2. Hapus satu record berdasarkan ID
    if (action === "deleteRecord") {
      const sheetName = body.sheet;
      const recordId = body.id;
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        return createJsonResponse({ status: "error", message: "Sheet tidak ditemukan" });
      }

      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(recordId)) {
          sheet.deleteRow(i + 1);
          return createJsonResponse({ status: "success", message: "Data berhasil dihapus dari sheet " + sheetName });
        }
      }
      return createJsonResponse({ status: "error", message: "Record ID tidak ditemukan" });
    }

    // 3. Sinkronisasi massal seluruh modul
    if (action === "syncAll") {
      const payload = body.data || {};
      const updatedSheets = [];

      Object.keys(payload).forEach(function(sheetName) {
        const records = payload[sheetName];
        if (!Array.isArray(records) || records.length === 0) return;

        let sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
        } else {
          sheet.clear();
        }

        const headers = Object.keys(records[0]);
        const matrix = [headers];

        records.forEach(function(rec) {
          const row = headers.map(function(key) {
            const val = rec[key];
            if (typeof val === "object" && val !== null) return JSON.stringify(val);
            return val !== undefined && val !== null ? val : "";
          });
          matrix.push(row);
        });

        sheet.getRange(1, 1, matrix.length, headers.length).setValues(matrix);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
        updatedSheets.push(sheetName);
      });

      return createJsonResponse({
        status: "success",
        message: "Sinkronisasi seluruh data ke Google Sheets berhasil!",
        updatedSheets: updatedSheets
      });
    }

    return createJsonResponse({ status: "error", message: "Aksi POST tidak dikenal" });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

// Inisialisasi struktur sheet standar jika kosong
function initializeDefaultSheets(ss) {
  const schemas = {
    ProfilSekolah: ["id", "npsn", "schoolName", "principalName", "principalNip", "address", "phone", "email", "accreditation", "vision", "mission", "academicYear", "semester", "motto"],
    Guru: ["id", "name", "nip", "nuptk", "role", "subject", "assignedClasses", "email", "phone", "gender", "status", "avatar"],
    Siswa: ["id", "nis", "nisn", "name", "gender", "classId", "birthPlace", "birthDate", "parentName", "phone", "status"],
    Absensi: ["id", "date", "classId", "studentId", "studentName", "status", "note", "recordedBy", "updatedAt"],
    Nilai: ["id", "classId", "subject", "studentId", "studentName", "uh1", "uh2", "uh3", "uh4", "uh5", "asts", "asas", "finalScore", "predicate", "status", "updatedAt"],
    BahanAjar: ["id", "title", "subject", "classId", "description", "fileUrl", "fileType", "author", "createdAt"],
    Tugas: ["id", "title", "subject", "classId", "deadline", "instructions", "fileUrl", "author", "submissions", "createdAt"],
    Pengumuman: ["id", "title", "content", "author", "date", "priority", "category", "isPinned"],
    ForumDiskusi: ["id", "title", "category", "authorName", "authorRole", "classScope", "content", "createdAt", "replies"]
  };

  const created = [];
  Object.keys(schemas).forEach(function(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      const headers = schemas[name];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
      created.push(name);
    }
  });

  return { created: created };
}

/**
 * ==============================================================================
 * FUNGSI 1-KLIK: INISIALISASI & ISI SELURUH DATA SPREADSHEET OTOMATIS
 * ==============================================================================
 * Cara Pakai Langsung di Editor Google Apps Script:
 * 1. Di bagian atas toolbar Apps Script, pilih fungsi: "inisialisasiDanIsiDataAwal"
 * 2. Klik tombol "Jalankan" (Run).
 * 3. Buka spreadsheet Anda, seluruh 9 lembar sheet beserta data lengkap SIAKAD
 *    langsung otomatis terisi rapi!
 */
function inisialisasiDanIsiDataAwal() {
  const ss = getSpreadsheet();
  const today = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  const seedData = {
    ProfilSekolah: [
      {
        id: "sch-01",
        npsn: "20108745",
        schoolName: "SD NEGERI NUSANTARA MERDEKA",
        principalName: "Drs. H. Ahmad Fauzi, M.Pd.",
        principalNip: "197203151998021001",
        address: "Jl. Pendidikan Nasional No. 45, Kecamatan Cilandak, Jakarta Selatan 12430",
        phone: "(021) 7590-8812",
        email: "admin@sdn-nusantaramerdeka.sch.id",
        accreditation: "A (Unggul) - BAN S/M",
        vision: "Terwujudnya Generasi Emas yang Beriman, Berakhlak Mulia, Berprestasi Global, serta Berwawasan Lingkungan Hidup Berkelanjutan.",
        mission: JSON.stringify([
          "Menumbuhkembangkan keimanan dan ketakwaan melalui pembiasaan ibadah dan budi pekerti luhur.",
          "Melaksanakan pembelajaran inovatif dan berpusat pada peserta didik berbasis Kurikulum Merdeka.",
          "Mengembangkan potensi minat, bakat, literasi numerasi, dan sains teknologi.",
          "Mewujudkan budaya sekolah yang ramah anak, bersih, hijau, dan berwawasan lingkungan."
        ]),
        academicYear: "2026/2027",
        semester: "Ganjil",
        motto: "Cerdas, Berkarakter, Berakhlak Mulia, dan Berbudaya Luhur"
      }
    ],
    Guru: [
      {
        id: "usr-admin",
        name: "Drs. H. Ahmad Fauzi, M.Pd.",
        nip: "197203151998021001",
        nuptk: "197203151998021001",
        role: "ADMIN",
        subject: "Kepala Sekolah",
        assignedClasses: JSON.stringify(["Semua Kelas"]),
        email: "kepsek@sdn-nusantaramerdeka.sch.id",
        phone: "081298765432",
        gender: "L",
        status: "Aktif",
        avatar: ""
      },
      {
        id: "usr-guru-1",
        name: "Siti Rahmawati, S.Pd.",
        nip: "198504122010012015",
        nuptk: "4538763665210032",
        role: "GURU",
        subject: "Guru Kelas & IPAS",
        assignedClasses: JSON.stringify(["Kelas 4A"]),
        email: "siti.rahmawati@sdn-nusantaramerdeka.sch.id",
        phone: "081345678901",
        gender: "P",
        status: "Aktif",
        avatar: ""
      },
      {
        id: "usr-guru-2",
        name: "Budi Santoso, S.Pd.",
        nip: "198809202014021003",
        nuptk: "6741766668130091",
        role: "GURU",
        subject: "Matematika",
        assignedClasses: JSON.stringify(["Kelas 5A"]),
        email: "budi.santoso@sdn-nusantaramerdeka.sch.id",
        phone: "081287654321",
        gender: "L",
        status: "Aktif",
        avatar: ""
      },
      {
        id: "usr-guru-3",
        name: "Dewi Anggraeni, S.Pd., M.Hum.",
        nip: "199201052019032008",
        nuptk: "1234769670230044",
        role: "GURU",
        subject: "Bahasa Indonesia",
        assignedClasses: JSON.stringify(["Kelas 6A"]),
        email: "dewi.anggraeni@sdn-nusantaramerdeka.sch.id",
        phone: "085712345678",
        gender: "P",
        status: "Aktif",
        avatar: ""
      }
    ],
    Siswa: [
      { id: "std-4a-01", nis: "23240401", nisn: "0134891201", name: "Aditya Pratama Putra", gender: "L", classId: "Kelas 4A", birthPlace: "Jakarta", birthDate: "2015-05-12", parentName: "Bambang Pratama", phone: "081200112233", status: "Aktif" },
      { id: "std-4a-02", nis: "23240402", nisn: "0134891202", name: "Annisa Tri Putri", gender: "P", classId: "Kelas 4A", birthPlace: "Bandung", birthDate: "2015-07-21", parentName: "Hadi Triyono", phone: "081200112234", status: "Aktif" },
      { id: "std-4a-03", nis: "23240403", nisn: "0134891203", name: "Bagas Kurniawan", gender: "L", classId: "Kelas 4A", birthPlace: "Jakarta", birthDate: "2015-02-18", parentName: "Kurnia Sandi", phone: "081200112235", status: "Aktif" },
      { id: "std-4a-04", nis: "23240404", nisn: "0134891204", name: "Citra Ayu Lestari", gender: "P", classId: "Kelas 4A", birthPlace: "Semarang", birthDate: "2015-09-04", parentName: "Agus Lestari", phone: "081200112236", status: "Aktif" },
      { id: "std-4a-05", nis: "23240405", nisn: "0134891205", name: "Daffa Al Ghifari", gender: "L", classId: "Kelas 4A", birthPlace: "Surabaya", birthDate: "2015-11-15", parentName: "Rudi Hartono", phone: "081200112237", status: "Aktif" },
      { id: "std-5a-01", nis: "22230501", nisn: "0124891301", name: "Joko Susilo", gender: "L", classId: "Kelas 5A", birthPlace: "Solo", birthDate: "2014-03-10", parentName: "Susilo Broto", phone: "081300223344", status: "Aktif" },
      { id: "std-5a-02", nis: "22230502", nisn: "0124891302", name: "Kania Dewi Anggraini", gender: "P", classId: "Kelas 5A", birthPlace: "Jakarta", birthDate: "2014-06-25", parentName: "Yudi Anggoro", phone: "081300223345", status: "Aktif" },
      { id: "std-6a-01", nis: "21220601", nisn: "0114891401", name: "Taufik Hidayat", gender: "L", classId: "Kelas 6A", birthPlace: "Bandung", birthDate: "2013-08-14", parentName: "Dedy Hidayat", phone: "081400334455", status: "Aktif" },
      { id: "std-6a-02", nis: "21220602", nisn: "0114891402", name: "Ulfa Hasanah", gender: "P", classId: "Kelas 6A", birthPlace: "Jakarta", birthDate: "2013-10-30", parentName: "Hasan Basri", phone: "081400334456", status: "Aktif" }
    ],
    Absensi: [
      { id: "att-4a-01", date: today, classId: "Kelas 4A", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today },
      { id: "att-4a-02", date: today, classId: "Kelas 4A", studentId: "std-4a-02", studentName: "Annisa Tri Putri", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today },
      { id: "att-4a-03", date: today, classId: "Kelas 4A", studentId: "std-4a-03", studentName: "Bagas Kurniawan", status: "S", note: "Sakit demam", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today },
      { id: "att-4a-04", date: today, classId: "Kelas 4A", studentId: "std-4a-04", studentName: "Citra Ayu Lestari", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today },
      { id: "att-4a-05", date: today, classId: "Kelas 4A", studentId: "std-4a-05", studentName: "Daffa Al Ghifari", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today }
    ],
    Nilai: [
      { id: "grd-4a-01", classId: "Kelas 4A", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", uh1: 88, uh2: 90, uh3: 85, uh4: 92, uh5: 86, asts: 88, asas: 90, finalScore: 89, predicate: "B", status: "Tuntas", updatedAt: today },
      { id: "grd-4a-02", classId: "Kelas 4A", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", studentId: "std-4a-02", studentName: "Annisa Tri Putri", uh1: 95, uh2: 92, uh3: 94, uh4: 96, uh5: 90, asts: 92, asas: 95, finalScore: 94, predicate: "A", status: "Tuntas", updatedAt: today },
      { id: "grd-4a-03", classId: "Kelas 4A", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", studentId: "std-4a-03", studentName: "Bagas Kurniawan", uh1: 72, uh2: 70, uh3: 75, uh4: 68, uh5: 74, asts: 70, asas: 72, finalScore: 71, predicate: "C", status: "Perlu Bimbingan", updatedAt: today }
    ],
    BahanAjar: [
      { id: "mat-01", title: "Modul Ajar IPAS: Rantai Makanan & Ekosistem", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", classId: "Kelas 4A", description: "Panduan interaktif jaring-jaring makanan Kurikulum Merdeka.", fileUrl: "https://drive.google.com/sample", fileType: "PDF", author: "Siti Rahmawati, S.Pd.", createdAt: today },
      { id: "mat-02", title: "Video Operasi Hitung Pecahan", subject: "Matematika", classId: "Kelas 5A", description: "Penjumlahan dan perkalian bilangan pecahan.", fileUrl: "https://youtube.com/sample", fileType: "VIDEO", author: "Budi Santoso, S.Pd.", createdAt: today }
    ],
    Tugas: [
      { id: "asg-01", title: "Proyek Diorama Ekosistem", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", classId: "Kelas 4A", deadline: "2026-11-20", instructions: "Buatlah diorama jaring makanan dari bahan kardus bekas.", fileUrl: "", author: "Siti Rahmawati, S.Pd.", createdAt: today, submissions: JSON.stringify([{ id: "sub-01", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", submittedAt: today, score: 90, feedback: "Bagus sekali!" }]) }
    ],
    Pengumuman: [
      { id: "ann-01", title: "Pelaksanaan Supervisi Kurikulum & Asesmen", content: "Diberitahukan kepada seluruh dewan guru bahwa supervisi Kurikulum Merdeka akan dilaksanakan mulai pekan depan.", author: "Drs. H. Ahmad Fauzi, M.Pd.", date: today, priority: "Penting", category: "Akademik", isPinned: true }
    ],
    ForumDiskusi: [
      { id: "dsc-01", title: "Diferensiasi Pembelajaran Gaya Belajar Kinestetik", category: "Pedagogik & Metode Ajar", authorName: "Siti Rahmawati, S.Pd.", authorRole: "GURU", classScope: "Semua Kelas", content: "Bagaimana asesmen formatif yang tepat untuk siswa gaya belajar kinestetik?", createdAt: today, replies: JSON.stringify([{ id: "rep-01", authorName: "Drs. H. Ahmad Fauzi, M.Pd.", authorRole: "ADMIN", content: "Gunakan rubrik unjuk kerja praktikum langsung.", createdAt: today }]) }
    ]
  };

  Object.keys(seedData).forEach(function(sheetName) {
    const records = seedData[sheetName];
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clear();
    }

    const headers = Object.keys(records[0]);
    const matrix = [headers];

    records.forEach(function(rec) {
      const row = headers.map(function(key) {
        const val = rec[key];
        return val !== undefined && val !== null ? val : "";
      });
      matrix.push(row);
    });

    sheet.getRange(1, 1, matrix.length, headers.length).setValues(matrix);
    // Header Style: Merah Putih
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#DC2626")
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center");
      
    sheet.autoResizeColumns(1, headers.length);
  });

  // Hapus 'Sheet1' default jika ada
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  Logger.log("✅ Berhasil menginisialisasi dan mengisi data ke Spreadsheet: " + ss.getName());
}

