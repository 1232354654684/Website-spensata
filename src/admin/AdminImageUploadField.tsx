import React, { useState, useEffect, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, Image as ImageIcon, Loader2, X, Link, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  normalizeImageUrl,
  isGooglePhotosWebUrl,
  validateKepsekImageFile,
  compressKepsekImageToDataUrl,
  DEFAULT_KEPSEK_PLACEHOLDER
} from '../utils/imageHelper';

interface AdminImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  folder?: string;
  isKepalaSekolah?: boolean;
  placeholder?: string;
}

export const AdminImageUploadField: React.FC<AdminImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  isKepalaSekolah = false,
  placeholder = 'https://... atau tempel tautan Google Drive'
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [urlWarning, setUrlWarning] = useState<string | null>(null);
  const [googlePhotosWarning, setGooglePhotosWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ code?: string; message: string } | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isDriveConverted, setIsDriveConverted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if external value changes
  useEffect(() => {
    setInputValue(value || '');
    setImageLoadError(false);
    checkUrlIssues(value || '');
  }, [value]);

  const checkUrlIssues = (url: string) => {
    if (!url) {
      setUrlWarning(null);
      setGooglePhotosWarning(null);
      return;
    }
    const trimmed = url.trim();

    // Check Google Photos webpage album link
    if (isGooglePhotosWebUrl(trimmed)) {
      setGooglePhotosWarning(
        'Tautan ini adalah halaman web album Google Photos, bukan alamat file gambar langsung. Silakan buka fotonya, klik kanan pada gambar > pilih "Salin alamat gambar" (link yang berawalan lh3.googleusercontent.com), lalu tempel di sini; atau gunakan tombol "Upload File".'
      );
    } else {
      setGooglePhotosWarning(null);
    }

    // Check protocol
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUrlWarning('URL gambar harus diawali dengan http:// atau https://');
    } else {
      setUrlWarning(null);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);
    setUploadError(null);
    setImageLoadError(false);

    // Auto convert Google Drive links
    const normalized = normalizeImageUrl(rawVal);
    if (normalized !== rawVal && normalized !== '') {
      setIsDriveConverted(true);
      setTimeout(() => setIsDriveConverted(false), 4500);
      setInputValue(normalized);
      checkUrlIssues(normalized);
      onChange(normalized);
    } else {
      checkUrlIssues(rawVal);
      onChange(rawVal);
    }
  };

  const handleManualNormalize = () => {
    const normalized = normalizeImageUrl(inputValue);
    if (normalized) {
      setInputValue(normalized);
      checkUrlIssues(normalized);
      onChange(normalized);
      setIsDriveConverted(true);
      setTimeout(() => setIsDriveConverted(false), 4500);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input element so selecting same file works again
    e.target.value = '';
    setUploadError(null);
    setUploadSuccess(null);
    setImageLoadError(false);

    // 1. Validasi JPG/PNG/WEBP maks 10 MB
    const validation = validateKepsekImageFile(file);
    if (!validation.valid) {
      const errMsg = validation.error || 'Format file tidak valid.';
      console.error('File validation failed:', errMsg);
      setUploadError({
        code: 'VALIDATION_FAILED',
        message: errMsg
      });
      return;
    }

    // 2. Kompresi Canvas (maks 600px, JPEG, 0.8, Base64 < 500 KB, timeout 20 detik)
    // JANGAN pakai Firebase Storage. Hapus kode uploadBytes/Storage.
    setIsProcessing(true);
    setProgressStatus('Mengompres foto ke resolusi optimal (lebar maks. 600 px)...');

    try {
      const dataUrl = await compressKepsekImageToDataUrl(file);

      // Verify size strictly under 500 KB (512,000 bytes)
      const sizeKb = Math.round(dataUrl.length / 1024);
      if (dataUrl.length > 500 * 1024) {
        throw new Error(`Hasil kompresi (${sizeKb} KB) melebihi batas 500 KB. Harap pilih foto lain.`);
      }

      setInputValue(dataUrl);
      checkUrlIssues(dataUrl);
      onChange(dataUrl);

      setUploadSuccess(`Foto berhasil dikompres & siap disimpan (${sizeKb} KB, JPEG)!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      const errCode = err?.code || 'COMPRESSION_ERROR';
      const errMsg = err?.message || 'Gagal memproses gambar.';
      console.error('Error proses upload foto kepala sekolah:', {
        code: errCode,
        message: errMsg,
        raw: err
      });
      setUploadError({
        code: errCode,
        message: errMsg
      });
    } finally {
      // Pastikan loading selalu dimatikan di finally
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  const handleClearImage = () => {
    setInputValue('');
    setUrlWarning(null);
    setGooglePhotosWarning(null);
    setUploadError(null);
    setImageLoadError(false);
    onChange('');
  };

  const previewSource = inputValue || (isKepalaSekolah ? DEFAULT_KEPSEK_PLACEHOLDER : '');

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-200">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {isKepalaSekolah && (
          <span className="text-[10px] font-medium text-[#E5A823] bg-[#E5A823]/10 border border-[#E5A823]/30 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            Canvas Maks 600px • JPEG 0.8 • Base64 &lt; 500 KB
          </span>
        )}
      </div>

      {/* URL Input Bar + Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Link className="w-4 h-4" />
          </div>
          <input
            type="text"
            required={required && !inputValue}
            value={inputValue}
            onChange={handleUrlInputChange}
            placeholder={placeholder}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
          />
        </div>

        {/* Upload File Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0E4A6B] hover:bg-[#0b3c57] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E5A823]" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#E5A823]" />
                <span>Upload File</span>
              </>
            )}
          </button>

          {inputValue && (
            <button
              type="button"
              onClick={handleClearImage}
              title="Hapus foto"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Helper text & file validation note */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
        <span>Format diterima: JPG, PNG, WEBP (maks. 10 MB, dikompres canvas &lt; 500 KB).</span>
        {/drive\.google\.com/i.test(inputValue) && (
          <button
            type="button"
            onClick={handleManualNormalize}
            className="text-[#E5A823] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Konversi Link Google Drive</span>
          </button>
        )}
      </div>

      {/* Processing Loader Indicator */}
      {isProcessing && (
        <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-200 text-xs flex items-center gap-2.5 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 text-sky-400" />
          <span>{progressStatus || 'Sedang memproses gambar (maks 20 detik)...'}</span>
        </div>
      )}

      {/* Success Notification */}
      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Google Drive Link Converted Hint */}
      {isDriveConverted && (
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>Tautan Google Drive otomatis dikonversi ke tautan langsung gambar (lh3.googleusercontent.com)!</span>
        </div>
      )}

      {/* Google Photos Warning (photos.app.goo.gl or share link) */}
      {googlePhotosWarning && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold text-amber-300">Peringatan Tautan Google Photos:</strong>
            <p className="mt-1">{googlePhotosWarning}</p>
          </div>
        </div>
      )}

      {/* URL Protocol Warning */}
      {urlWarning && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{urlWarning}</span>
        </div>
      )}

      {/* Error Alert with error.code & error.message */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-rose-200">Gagal Memproses / Mengunggah Foto</div>
            <div className="font-mono text-[11px] bg-slate-950/80 px-2 py-1 rounded border border-rose-500/30 text-rose-300">
              [{uploadError.code || 'ERROR'}]: {uploadError.message}
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex-shrink-0 shadow-inner flex items-center justify-center">
          {previewSource ? (
            <img
              src={imageLoadError ? DEFAULT_KEPSEK_PLACEHOLDER : previewSource}
              alt="Pratinjau Foto"
              referrerPolicy="no-referrer"
              loading="lazy"
              onLoad={() => setImageLoadError(false)}
              onError={() => {
                if (inputValue && !imageLoadError) {
                  setImageLoadError(true);
                  console.warn('Gagal memuat pratinjau gambar dari URL:', inputValue);
                }
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-600 gap-1 p-2 text-center">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[10px]">Belum Ada Foto</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#E5A823] animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1.5 text-center sm:text-left">
          <div className="text-xs font-semibold text-slate-300">Pratinjau Tampilan</div>
          {imageLoadError ? (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed">
              ⚠️ <strong>Link tidak bisa ditampilkan:</strong> Browser gagal memuat file gambar dari tautan ini. Gunakan link langsung ke file gambar (berawalan <code>lh3.googleusercontent.com</code> atau berakhiran <code>.jpg</code>) atau gunakan tombol <strong>Upload File</strong>.
            </div>
          ) : inputValue ? (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pratinjau sebelum disimpan. Klik tombol <strong>Simpan Perubahan</strong> di atas untuk menyimpan ke Firestore.
              {inputValue.startsWith('data:image/') && (
                <span className="block text-emerald-400 font-mono text-[10px] mt-0.5">
                  ✓ Foto terkompresi & siap disimpan ke Firestore (tanpa Storage)
                </span>
              )}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Jika dikosongkan, halaman publik akan otomatis menggunakan avatar placeholder resmi kepala sekolah.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
