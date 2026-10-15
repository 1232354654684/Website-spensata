import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Upload,
  RefreshCw,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Link,
  Sparkles,
  Info,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { auth, loginWithGoogle } from '../services/firebase';
import {
  validateFaviconFile,
  compressFaviconToDataUrl,
  normalizeImageUrl,
  isGooglePhotosWebUrl
} from '../utils/imageHelper';

export const AdminFaviconManager: React.FC = () => {
  const { faviconConfig, saveFavicon, resetFavicon, currentUser } = useSchoolData();
  const [currentUrl, setCurrentUrl] = useState(faviconConfig?.faviconUrl || '');
  const [inputUrl, setInputUrl] = useState(faviconConfig?.faviconUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
    code?: string;
    action?: 'relogin';
  } | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with context updates
  useEffect(() => {
    setCurrentUrl(faviconConfig?.faviconUrl || '');
    setInputUrl(faviconConfig?.faviconUrl || '');
    setImageError(false);
  }, [faviconConfig?.faviconUrl, faviconConfig?.faviconUpdatedAt]);

  const activeFaviconSrc = currentUrl || '/favicon.png?v=2';
  const isAuthActive = Boolean(auth?.currentUser);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);
    setImageError(false);
    setStatusMsg(null);

    // Auto-normalize if Google Drive
    const normalized = normalizeImageUrl(val);
    if (normalized !== val) {
      setInputUrl(normalized);
    }
  };

  const handleGoogleReauth = async () => {
    try {
      setIsProcessing(true);
      setProgressMsg('Menghubungkan ke Akun Google admin...');
      await loginWithGoogle();
      setStatusMsg({
        type: 'success',
        text: `Berhasil terhubung ke Firebase sebagai ${auth?.currentUser?.email}. Anda sekarang dapat menyimpan favicon.`
      });
    } catch (err: any) {
      console.error('Google reauth error:', err);
      setStatusMsg({
        type: 'error',
        code: err?.code || 'AUTH_ERROR',
        text: `Gagal login dengan Google: ${err?.message || err}`
      });
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setStatusMsg(null);
    setImageError(false);

    // 1. Validasi file: PNG/ICO/WEBP, maks 2 MB
    const validation = validateFaviconFile(file);
    if (!validation.valid) {
      setStatusMsg({
        type: 'error',
        code: 'VALIDATION_FAILED',
        text: validation.error || 'Format file tidak didukung. Harap pilih file PNG, ICO, atau WEBP maksimal 2 MB.'
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgressMsg('Mengompres favicon ke 128x128 px transparan murni...');

      // 2. Resize ke 128x128 px via canvas, pertahankan transparansi (image/png), base64 < 100 KB
      const dataUrl = await compressFaviconToDataUrl(file);

      // Verify size strictly under 100 KB
      const sizeKb = Math.round(dataUrl.length / 1024);
      if (dataUrl.length > 100 * 1024) {
        throw new Error(`Ukuran favicon hasil kompresi (${sizeKb} KB) melebihi batas 100 KB.`);
      }

      setInputUrl(dataUrl);
      setCurrentUrl(dataUrl);

      setStatusMsg({
        type: 'success',
        text: `Favicon berhasil diproses (${sizeKb} KB, PNG transparan). Klik tombol "Simpan Favicon" di atas untuk menerapkan ke seluruh situs.`
      });
    } catch (err: any) {
      console.error('Favicon processing error:', {
        code: err?.code,
        message: err?.message,
        raw: err
      });
      setStatusMsg({
        type: 'error',
        code: err?.code || 'FAVICON_PROCESS_ERROR',
        text: err?.message || 'Gagal memproses file favicon. Pastikan gambar tidak rusak dan berukuran wajar.'
      });
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleSave = async () => {
    // 1. Cek sesi login Firebase Auth aktif
    if (!auth?.currentUser) {
      setStatusMsg({
        type: 'error',
        code: 'AUTH_REQUIRED',
        text: 'Sesi login habis, silakan login ulang.',
        action: 'relogin'
      });
      return;
    }

    const trimmed = inputUrl.trim();

    // 2. Validasi tautan jika berupa URL eksternal
    if (trimmed && !trimmed.startsWith('data:')) {
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        setStatusMsg({
          type: 'error',
          code: 'INVALID_URL',
          text: 'URL favicon harus diawali dengan http:// atau https://.'
        });
        return;
      }

      if (isGooglePhotosWebUrl(trimmed)) {
        setStatusMsg({
          type: 'error',
          code: 'INVALID_URL',
          text: 'Tautan Google Photos adalah halaman web, bukan file gambar langsung. Silakan klik kanan pada foto dan pilih "Salin alamat gambar", atau gunakan fitur upload file gambar di bawah.'
        });
        return;
      }
    }

    try {
      setIsProcessing(true);
      setProgressMsg('Menyimpan konfigurasi favicon ke koleksi pengaturan/situs...');

      await saveFavicon(trimmed);

      setStatusMsg({
        type: 'success',
        text: 'Favicon situs berhasil diperbarui dan diterapkan ke seluruh tab browser!'
      });
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      console.error('Gagal menyimpan favicon:', {
        code: err?.code,
        message: err?.message,
        raw: err
      });

      const rawMsg = err?.message || String(err);
      const errCode = err?.code || '';

      if (
        errCode === 'permission-denied' ||
        rawMsg.includes('insufficient permissions') ||
        rawMsg.includes('Missing or insufficient permissions')
      ) {
        if (!auth?.currentUser) {
          setStatusMsg({
            type: 'error',
            code: 'AUTH_REQUIRED',
            text: 'Sesi login habis, silakan login ulang.',
            action: 'relogin'
          });
        } else {
          setStatusMsg({
            type: 'error',
            code: 'PERMISSION_DENIED',
            text: `Izin ditolak oleh Firestore Security Rules. Akun "${auth.currentUser.email}" tidak memiliki wewenang menulis dokumen pengaturan/situs. Gunakan akun admin resmi (ardiansyahroni017@gmail.com / admin@spensata.sch.id).`,
            action: 'relogin'
          });
        }
      } else if (rawMsg.includes('Sesi login habis') || errCode === 'AUTH_REQUIRED') {
        setStatusMsg({
          type: 'error',
          code: 'AUTH_REQUIRED',
          text: 'Sesi login habis, silakan login ulang.',
          action: 'relogin'
        });
      } else if (errCode === 'TIMEOUT' || rawMsg.includes('timeout')) {
        setStatusMsg({
          type: 'error',
          code: 'TIMEOUT',
          text: 'Penyimpanan melebihi batas waktu (20 detik). Periksa koneksi internet Anda dan coba lagi.'
        });
      } else {
        setStatusMsg({
          type: 'error',
          code: errCode || 'SAVE_ERROR',
          text: `Gagal menyimpan favicon: ${rawMsg}`
        });
      }
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleReset = async () => {
    // 1. Cek sesi login Firebase Auth aktif
    if (!auth?.currentUser) {
      setStatusMsg({
        type: 'error',
        code: 'AUTH_REQUIRED',
        text: 'Sesi login habis, silakan login ulang.',
        action: 'relogin'
      });
      return;
    }

    if (!confirm('Apakah Anda yakin ingin mengembalikan favicon ke logo resmi bawaan sekolah (/favicon.png)?')) {
      return;
    }

    try {
      setIsProcessing(true);
      setProgressMsg('Mengembalikan favicon ke bawaan sekolah...');

      await resetFavicon();
      setInputUrl('');
      setCurrentUrl('');
      setImageError(false);

      setStatusMsg({
        type: 'success',
        text: 'Favicon berhasil dikembalikan ke logo resmi default sekolah (/favicon.png).'
      });
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      console.error('Gagal reset favicon:', err);
      const rawMsg = err?.message || String(err);
      if (err?.code === 'permission-denied' || rawMsg.includes('insufficient permissions')) {
        setStatusMsg({
          type: 'error',
          code: 'PERMISSION_DENIED',
          text: 'Izin ditolak. Sesi login habis atau akun Anda tidak memiliki hak akses administrator. Silakan login ulang.',
          action: 'relogin'
        });
      } else {
        setStatusMsg({
          type: 'error',
          code: err?.code || 'RESET_ERROR',
          text: `Gagal mengembalikan favicon: ${rawMsg}`
        });
      }
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#E5A823]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Favicon / Logo Tab Browser</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Atur ikon favicon yang tampil pada tab browser pengunjung, bookmark, dan layar beranda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Kembalikan ke file bawaan /public/favicon.png"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan ke Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E5A823] hover:bg-[#d49818] text-slate-900 transition flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Favicon</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sesi Status Banner jika Belum Login ke Firebase Auth */}
      {!isAuthActive && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block text-white">Sesi Firebase Auth Belum Aktif</span>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                Penyimpanan ke Firestore (koleksi <code>pengaturan/situs</code>) membutuhkan otentikasi admin aktif. Silakan hubungkan akun Google admin resmi Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogleReauth}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl bg-[#E5A823] hover:bg-[#d49818] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer self-start sm:self-auto flex-shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk dengan Google</span>
          </button>
        </div>
      )}

      {/* Status Alerts */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : statusMsg.type === 'warning'
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            )}
            <div className="flex-1">
              {statusMsg.code && (
                <span className="font-mono font-bold mr-1.5 bg-slate-950/80 px-1.5 py-0.5 rounded border border-current text-[10px]">
                  [{statusMsg.code}]
                </span>
              )}
              <span>{statusMsg.text}</span>
            </div>
          </div>

          {statusMsg.action === 'relogin' && (
            <button
              type="button"
              onClick={handleGoogleReauth}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:bg-slate-100 transition cursor-pointer self-start sm:self-auto flex-shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Ulang</span>
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Preview & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live 64x64 Preview with Checkered Background */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-4">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A823]" />
            <span>Pratinjau Favicon Aktif</span>
          </div>

          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            {/* 64x64 Box with Checkered Pattern (to clearly visualize transparency) */}
            <div
              className="w-16 h-16 rounded-xl border-2 border-slate-600 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(45deg, #334155 25%, transparent 25%), linear-gradient(-45deg, #334155 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #334155 75%), linear-gradient(-45deg, transparent 75%, #334155 75%)`,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: '#1e293b'
              }}
              title="Latar bermotif kotak-kotak untuk memperlihatkan transparansi gambar"
            >
              <img
                src={imageError ? '/favicon.png?v=2' : activeFaviconSrc}
                alt="Favicon Aktif"
                referrerPolicy="no-referrer"
                onError={() => {
                  if (!imageError) {
                    console.warn('Favicon gagal dimuat, menggunakan default.');
                    setImageError(true);
                  }
                }}
                className="w-12 h-12 object-contain filter drop-shadow"
              />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-200 block">
                {currentUrl ? (currentUrl.startsWith('data:image/') ? 'Favicon Khusus (Base64)' : 'Favicon Kustom (URL)') : 'Favicon Bawaan (/favicon.png)'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Pratinjau: 64x64 px (Output 128x128 px)
              </span>
            </div>
          </div>

          {/* Browser Tab Simulation Preview */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Simulasi Tab Browser
            </span>
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 max-w-full">
              <img
                src={imageError ? '/favicon.png?v=2' : activeFaviconSrc}
                alt="Favicon"
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain flex-shrink-0"
              />
              <span className="text-xs text-slate-200 truncate font-medium">
                SMP Negeri 1 Tambak - Berkarakter Kuat Berprestasi Hebat
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Upload & URL Configuration */}
        <div className="lg:col-span-8 space-y-5">
          {/* Opsi 1: Upload File */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#E5A823]" />
                <span>Opsi 1: Upload File Gambar</span>
              </label>
              <span className="text-[10px] text-slate-400">PNG / ICO / WEBP (Maks 2 MB)</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Pilih file logo sekolah. Sistem otomatis meresize menjadi <strong>128x128 px</strong>, mempertahankan transparansi (PNG transparan murni tanpa background), dan memastikan ukuran di bawah <strong>100 KB</strong> untuk disimpan aman di Firestore.
            </p>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-200 leading-relaxed">
              <strong>Catatan:</strong> Gambar ini juga dipakai sebagai logo di header, footer, login admin, dan dashboard admin. Gunakan PNG transparan berbentuk persegi, minimal 512x512 px.
            </div>

            <div>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#0E4A6B] hover:bg-[#0b3c57] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5A823]" />
                    <span>{progressMsg || 'Memproses Favicon...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#E5A823]" />
                    <span>Pilih File Favicon (PNG/ICO/WEBP)</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Opsi 2: Input URL Langsung */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-sky-400" />
                <span>Opsi 2: Masukkan URL Gambar Langsung</span>
              </label>
              <span className="text-[10px] text-slate-400">HTTP / HTTPS</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Atau tempelkan tautan gambar online langsung (misal: <code>https://.../logo.png</code> atau link Google Drive yang otomatis dikonversi).
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={handleUrlChange}
                  placeholder="https://... atau tempel tautan file gambar"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputUrl('');
                      setImageError(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer border border-slate-700"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {inputUrl && (
                <div className="text-[11px] text-slate-400">
                  {inputUrl.startsWith('data:image/') ? (
                    <span className="text-emerald-400 font-mono text-[10px]">
                      ✓ Menggunakan data favicon terkompresi lokal ({Math.round(inputUrl.length / 1024)} KB)
                    </span>
                  ) : (
                    <span>URL aktif saat ini: <code className="text-slate-300 font-mono text-[10px] truncate max-w-xs">{inputUrl}</code></span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Catatan Teknis */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#E5A823] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-300">Sinkronisasi Realtime Seluruh Situs</span>
              <p>
                Setelah menekan tombol <strong>Simpan Favicon</strong>, konfigurasi disimpan ke Firestore dokumen <code>pengaturan/situs</code> via <code>setDoc</code> merge. Komponen <code>FaviconManager</code> di root aplikasi secara realtime memperbarui tag <code>&lt;link rel="icon"&gt;</code> dan <code>&lt;link rel="apple-touch-icon"&gt;</code> di seluruh halaman (publik, halaman login, dan dashboard).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
