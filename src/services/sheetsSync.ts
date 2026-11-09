import { StorageService } from './storage';
import { SyncState } from '../types';

export class SheetsSyncService {
  /**
   * Menguji koneksi ke endpoint Google Apps Script
   */
  static async testConnection(endpointUrl: string): Promise<{ success: boolean; message: string; details?: any }> {
    if (!endpointUrl || !endpointUrl.startsWith("http")) {
      return {
        success: false,
        message: "URL Endpoint Apps Script belum diisi dengan benar (harus diawali https://script.google.com/...)."
      };
    }

    try {
      const url = `${endpointUrl}${endpointUrl.includes('?') ? '&' : '?'}action=ping&t=${Date.now()}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        return {
          success: false,
          message: `Server merespon dengan status ${res.status}: ${res.statusText}`
        };
      }

      const json = await res.json();
      if (json.status === 'success') {
        return {
          success: true,
          message: json.message || "Koneksi ke Google Sheets berhasil terhubung!",
          details: json
        };
      } else {
        return {
          success: false,
          message: json.message || "Gagal menghubungi Google Sheets."
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Terjadi kendala jaringan: ${err.message || err}. Pastikan Web App di-deploy dengan akses 'Anyone' (Siapa saja).`
      };
    }
  }

  /**
   * Mengambil seluruh data dari Google Sheets dan memperbarui cache lokal
   */
  static async pullAllFromSheets(endpointUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${endpointUrl}${endpointUrl.includes('?') ? '&' : '?'}action=getAll&t=${Date.now()}`;
      const res = await fetch(url, { method: 'GET' });
      const json = await res.json();

      if (json.status !== 'success' || !json.data) {
        return { success: false, message: json.message || "Format data tidak sesuai." };
      }

      const data = json.data;
      if (data.ProfilSekolah && data.ProfilSekolah.length > 0) {
        StorageService.saveProfile(data.ProfilSekolah[0]);
      }
      if (data.Guru && data.Guru.length > 0) {
        StorageService.saveUsers(data.Guru);
      }
      if (data.Siswa && data.Siswa.length > 0) {
        StorageService.saveStudents(data.Siswa);
      }
      if (data.Absensi && data.Absensi.length > 0) {
        StorageService.saveAttendance(data.Absensi);
      }
      if (data.Nilai && data.Nilai.length > 0) {
        StorageService.saveGrades(data.Nilai);
      }
      if (data.BahanAjar && data.BahanAjar.length > 0) {
        StorageService.saveMaterials(data.BahanAjar);
      }
      if (data.Tugas && data.Tugas.length > 0) {
        StorageService.saveAssignments(data.Tugas);
      }
      if (data.Pengumuman && data.Pengumuman.length > 0) {
        StorageService.saveAnnouncements(data.Pengumuman);
      }
      if (data.ForumDiskusi && data.ForumDiskusi.length > 0) {
        StorageService.saveDiscussions(data.ForumDiskusi);
      }

      const syncState: SyncState = StorageService.getSyncState();
      syncState.lastSyncedAt = new Date().toLocaleString('id-ID');
      syncState.status = 'connected';
      StorageService.saveSyncState(syncState);

      return { success: true, message: "Berhasil menyinkronkan seluruh data dari Google Sheets!" };
    } catch (err: any) {
      return { success: false, message: `Gagal menarik data: ${err.message}` };
    }
  }

  /**
   * Mendorong seluruh data lokal ke Google Sheets (Inisialisasi / Backup Massal)
   */
  static async pushAllToSheets(endpointUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      const payload = {
        action: "syncAll",
        data: {
          ProfilSekolah: [StorageService.getProfile()],
          Guru: StorageService.getUsers(),
          Siswa: StorageService.getStudents(),
          Absensi: StorageService.getAttendance(),
          Nilai: StorageService.getGrades(),
          BahanAjar: StorageService.getMaterials(),
          Tugas: StorageService.getAssignments(),
          Pengumuman: StorageService.getAnnouncements(),
          ForumDiskusi: StorageService.getDiscussions()
        }
      };

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Hindari preflight CORS ketat pada Google Apps Script
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.status === 'success') {
        const syncState: SyncState = StorageService.getSyncState();
        syncState.lastSyncedAt = new Date().toLocaleString('id-ID');
        syncState.status = 'connected';
        StorageService.saveSyncState(syncState);
        return { success: true, message: "Berhasil mengunggah seluruh data ke Google Sheets!" };
      } else {
        return { success: false, message: json.message || "Gagal mengunggah data." };
      }
    } catch (err: any) {
      return { success: false, message: `Gagal mengirim data ke Sheets: ${err.message}` };
    }
  }

  /**
   * Menyimpan satu record ke Google Sheets secara asinkron
   */
  static async saveSingleRecord(sheetName: string, record: any): Promise<void> {
    const syncState = StorageService.getSyncState();
    if (!syncState.endpointUrl) return;

    try {
      await fetch(syncState.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'saveRecord',
          sheet: sheetName,
          data: record
        })
      });
    } catch (err) {
      console.warn("Background sync warning:", err);
    }
  }
}
