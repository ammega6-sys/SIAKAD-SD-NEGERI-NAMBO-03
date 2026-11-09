import React, { useState } from 'react';
import { StorageService, DEFAULT_SPREADSHEET_ID } from '../services/storage';
import { SheetsSyncService } from '../services/sheetsSync';
import { SyncState } from '../types';
import { 
  Database, 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  FileCode,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SyncSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncSettingsModal: React.FC<SyncSettingsModalProps> = ({ isOpen, onClose }) => {
  const [syncConfig, setSyncConfig] = useState<SyncState>(() => StorageService.getSyncState());
  const [endpointInput, setEndpointInput] = useState(syncConfig.endpointUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  if (!isOpen) return null;

  const handleSaveEndpoint = () => {
    const updated: SyncState = {
      ...syncConfig,
      endpointUrl: endpointInput.trim()
    };
    StorageService.saveSyncState(updated);
    setSyncConfig(updated);
    setStatusMessage({ type: 'success', text: "URL Endpoint Apps Script berhasil disimpan!" });
  };

  const handleTestConnection = async () => {
    if (!endpointInput.trim()) {
      setStatusMessage({ type: 'error', text: "Harap isi URL Endpoint Apps Script terlebih dahulu." });
      return;
    }
    setLoading(true);
    setStatusMessage({ type: 'info', text: "Sedang menguji koneksi ke Google Apps Script..." });

    const result = await SheetsSyncService.testConnection(endpointInput.trim());
    setLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      const updated: SyncState = {
        ...syncConfig,
        endpointUrl: endpointInput.trim(),
        status: 'connected',
        lastSyncedAt: new Date().toLocaleString('id-ID')
      };
      StorageService.saveSyncState(updated);
      setSyncConfig(updated);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handlePullFromSheets = async () => {
    if (!endpointInput.trim()) {
      setStatusMessage({ type: 'error', text: "Harap isi URL Endpoint Apps Script terlebih dahulu." });
      return;
    }
    setLoading(true);
    setStatusMessage({ type: 'info', text: "Sedang mengambil data terbaru dari Google Sheets..." });

    const result = await SheetsSyncService.pullAllFromSheets(endpointInput.trim());
    setLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      window.dispatchEvent(new Event('siakad_storage_updated'));
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handlePushToSheets = async () => {
    if (!endpointInput.trim()) {
      setStatusMessage({ type: 'error', text: "Harap isi URL Endpoint Apps Script terlebih dahulu." });
      return;
    }
    setLoading(true);
    setStatusMessage({ type: 'info', text: "Sedang mengunggah seluruh data lokal ke Google Sheets..." });

    const result = await SheetsSyncService.pushAllToSheets(endpointInput.trim());
    setLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleCopyCode = () => {
    // Read the exact full content from Code.gs
    const code = `/**
 * SIAKAD Google Apps Script Endpoint
 * Spreadsheet ID: ${DEFAULT_SPREADSHEET_ID}
 */
const SPREADSHEET_ID = "${DEFAULT_SPREADSHEET_ID}";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

function doGet(e) {
  const ss = getSpreadsheet();
  const action = (e && e.parameter && e.parameter.action) || "ping";
  if (action === "ping") {
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Koneksi Google Sheets Aktif!",
      sheets: ss.getSheets().map(s => s.getName())
    })).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === "getAll") {
    const result = {};
    const sheetNames = ["ProfilSekolah", "Guru", "Siswa", "Absensi", "Nilai", "BahanAjar", "Tugas", "Pengumuman", "ForumDiskusi"];
    sheetNames.forEach(function(name) {
      const sheet = ss.getSheetByName(name);
      if (!sheet) { result[name] = []; return; }
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) { result[name] = []; return; }
      const headers = data[0];
      const rows = [];
      for (let i = 1; i < data.length; i++) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let val = data[i][j];
          if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
            try { val = JSON.parse(val); } catch(err) {}
          }
          obj[headers[j]] = val;
        }
        rows.push(obj);
      }
      result[name] = rows;
    });
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action tidak dikenal" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = getSpreadsheet();
  const body = JSON.parse(e.postData.contents);
  if (body.action === "saveRecord") {
    const sheetName = body.sheet;
    const record = body.data;
    let sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const rows = sheet.getDataRange().getValues();
    let headers = rows.length > 0 && rows[0][0] !== "" ? rows[0] : [];
    if (headers.length === 0) {
      headers = Object.keys(record);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
    }
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(record.id)) { rowIndex = i + 1; break; }
    }
    const rowVals = headers.map(k => {
      const v = record[k];
      return typeof v === "object" && v !== null ? JSON.stringify(v) : (v !== undefined ? v : "");
    });
    if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, rowVals.length).setValues([rowVals]);
    else sheet.appendRow(rowVals);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: record.id })).setMimeType(ContentService.MimeType.JSON);
  }
  if (body.action === "syncAll") {
    Object.keys(body.data).forEach(sheetName => {
      const records = body.data[sheetName];
      if (!Array.isArray(records) || records.length === 0) return;
      let sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
      sheet.clear();
      const headers = Object.keys(records[0]);
      const matrix = [headers];
      records.forEach(r => {
        matrix.push(headers.map(k => {
          const v = r[k];
          return typeof v === "object" && v !== null ? JSON.stringify(v) : (v !== undefined ? v : "");
        }));
      });
      sheet.getRange(1, 1, matrix.length, headers.length).setValues(matrix);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
    });
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Sinkronisasi berhasil!" })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error" })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * JALANKAN FUNGSI INI LANGSUNG DI APPS SCRIPT UNTUK MENGISI SPREADSHEET SECARA OTOMATIS
 */
function inisialisasiDanIsiDataAwal() {
  const ss = getSpreadsheet();
  const today = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  const seed = {
    ProfilSekolah: [{
      id: "sch-01", npsn: "20108745", schoolName: "SD NEGERI NUSANTARA MERDEKA",
      principalName: "Drs. H. Ahmad Fauzi, M.Pd.", principalNip: "197203151998021001",
      address: "Jl. Pendidikan Nasional No. 45, Jakarta Selatan", phone: "(021) 7590-8812",
      email: "admin@sdn-nusantaramerdeka.sch.id", accreditation: "A (Unggul) - BAN S/M",
      academicYear: "2026/2027", semester: "Ganjil", motto: "Cerdas, Berkarakter, Berakhlak Mulia",
      vision: "Terwujudnya Generasi Emas yang Beriman, Berakhlak Mulia, Berprestasi Global.",
      mission: JSON.stringify(["Membina keimanan dan ketakwaan.", "Melaksanakan pembelajaran inovatif Kurikulum Merdeka."])
    }],
    Guru: [
      { id: "usr-admin", name: "Drs. H. Ahmad Fauzi, M.Pd.", nip: "197203151998021001", role: "ADMIN", subject: "Kepala Sekolah", assignedClasses: JSON.stringify(["Semua Kelas"]), email: "kepsek@sekolah.sch.id", status: "Aktif" },
      { id: "usr-guru-1", name: "Siti Rahmawati, S.Pd.", nip: "198504122010012015", role: "GURU", subject: "Guru Kelas & IPAS", assignedClasses: JSON.stringify(["Kelas 4A"]), email: "siti@sekolah.sch.id", status: "Aktif" },
      { id: "usr-guru-2", name: "Budi Santoso, S.Pd.", nip: "198809202014021003", role: "GURU", subject: "Matematika", assignedClasses: JSON.stringify(["Kelas 5A"]), email: "budi@sekolah.sch.id", status: "Aktif" }
    ],
    Siswa: [
      { id: "std-4a-01", nis: "23240401", nisn: "0134891201", name: "Aditya Pratama Putra", gender: "L", classId: "Kelas 4A", status: "Aktif" },
      { id: "std-4a-02", nis: "23240402", nisn: "0134891202", name: "Annisa Tri Putri", gender: "P", classId: "Kelas 4A", status: "Aktif" },
      { id: "std-5a-01", nis: "22230501", nisn: "0124891301", name: "Joko Susilo", gender: "L", classId: "Kelas 5A", status: "Aktif" }
    ],
    Absensi: [
      { id: "att-4a-01", date: today, classId: "Kelas 4A", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", status: "H", note: "", recordedBy: "Siti Rahmawati, S.Pd.", updatedAt: today }
    ],
    Nilai: [
      { id: "grd-4a-01", classId: "Kelas 4A", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", studentId: "std-4a-01", studentName: "Aditya Pratama Putra", uh1: 88, uh2: 90, uh3: 85, uh4: 92, uh5: 86, asts: 88, asas: 90, finalScore: 89, predicate: "B", status: "Tuntas", updatedAt: today }
    ],
    BahanAjar: [
      { id: "mat-01", title: "Modul Ajar IPAS: Rantai Makanan & Ekosistem", subject: "IPAS", classId: "Kelas 4A", description: "Panduan interaktif jaring-jaring makanan.", fileUrl: "https://drive.google.com/sample", fileType: "PDF", author: "Siti Rahmawati, S.Pd.", createdAt: today }
    ],
    Tugas: [
      { id: "asg-01", title: "Proyek Diorama Ekosistem", subject: "IPAS", classId: "Kelas 4A", deadline: "2026-11-20", instructions: "Buatlah diorama jaring makanan dari bahan kardus.", author: "Siti Rahmawati, S.Pd.", createdAt: today, submissions: "[]" }
    ],
    Pengumuman: [
      { id: "ann-01", title: "Pelaksanaan Supervisi Kurikulum & Asesmen", content: "Supervisi akademik dimulai pekan depan.", author: "Drs. H. Ahmad Fauzi, M.Pd.", date: today, priority: "Penting", category: "Akademik", isPinned: true }
    ],
    ForumDiskusi: [
      { id: "dsc-01", title: "Penerapan Diferensiasi Pembelajaran", category: "Pedagogik", authorName: "Siti Rahmawati, S.Pd.", authorRole: "GURU", classScope: "Semua Kelas", content: "Bagaimana asesmen yang tepat untuk siswa kinestetik?", createdAt: today, replies: "[]" }
    ]
  };

  Object.keys(seed).forEach(name => {
    const list = seed[name];
    let sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.clear();
    const h = Object.keys(list[0]);
    const matrix = [h];
    list.forEach(r => matrix.push(h.map(k => r[k] !== undefined ? r[k] : "")));
    sh.getRange(1, 1, matrix.length, h.length).setValues(matrix);
    sh.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#DC2626").setFontColor("#FFFFFF");
    sh.autoResizeColumns(1, h.length);
  });

  const def = ss.getSheetByName("Sheet1");
  if (def && ss.getSheets().length > 1) { try { ss.deleteSheet(def); } catch(e) {} }
  Logger.log("Inisialisasi selesai!");
}`;

    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Kembalikan seluruh data lokal ke seed bawaan lengkap (semua kelas, guru, dan nilai)?")) {
      StorageService.resetAllToDefault();
      window.dispatchEvent(new Event('siakad_storage_updated'));
      setStatusMessage({ type: 'success', text: "Data lokal berhasil dikembalikan ke kondisi bawaan!" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Integrasi Database Google Sheets</h3>
              <p className="text-red-100 text-xs">Spreadsheet ID: {DEFAULT_SPREADSHEET_ID}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Spreadsheet Target Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Target Google Sheets Terhubung:</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`}
                target="_blank"
                rel="noreferrer"
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <span>Buka Spreadsheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="font-mono text-slate-600 text-[11px] break-all bg-white p-2 rounded-lg border border-slate-200">
              {DEFAULT_SPREADSHEET_ID}
            </p>
          </div>

          {/* Input Endpoint Web App */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Apps Script Web App Endpoint URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={endpointInput}
                onChange={e => setEndpointInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={handleSaveEndpoint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Simpan URL
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              *Didapatkan setelah melakukan Deployment "Web App" di menu Apps Script spreadsheet.
            </p>
          </div>

          {/* Action Buttons: Test, Pull, Push */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={handleTestConnection}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Uji Koneksi (Ping)</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handlePullFromSheets}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Tarik Data (Pull)</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handlePushToSheets}
              className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Unggah Data (Push)</span>
            </button>
          </div>

          {/* 4 Langkah Mudah Deploy Apps Script */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Langkah Cepat Menghubungkan Google Sheets:
              </h4>
              <button
                onClick={handleCopyCode}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script (Code.gs)'}</span>
              </button>
            </div>

            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-100">
              <li>Buka spreadsheet Google Sheets Anda (atau klik tombol "Buka Spreadsheet" di atas).</li>
              <li>Klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.</li>
              <li>Klik tombol <strong>"Salin Kode Script (Code.gs)"</strong> di atas, lalu tempelkan ke editor Apps Script.</li>
              <li>Klik <strong>Deploy (Terapkan)</strong> &gt; <strong>New Deployment (Deployment Baru)</strong> &gt; Pilih <strong>Web App</strong>.</li>
              <li>Set <em>Execute as</em>: <strong>Me (Saya)</strong>, dan <em>Who has access</em>: <strong>Anyone (Siapa saja)</strong>.</li>
              <li>Salin URL Web App yang muncul dan tempelkan pada kolom URL di atas!</li>
            </ol>
          </div>

          {/* Reset seed data */}
          <div className="flex justify-between items-center pt-2 text-xs border-t border-slate-100">
            <span className="text-slate-400 text-[11px]">Butuh reset data pengujian?</span>
            <button
              onClick={handleResetData}
              className="text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Lokal ke Bawaan</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
