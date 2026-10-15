import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  UserCheck,
  Share2,
  Target,
  History,
  Laptop,
  BarChart3,
  Boxes,
  Sliders,
  Newspaper,
  Camera,
  Video,
  LogOut,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Eye,
  FileText,
  Database,
  Globe,
  Users
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { dataService } from '../services/dataService';
import { isFirebaseConfigured } from '../services/firebase';
import { AdminLogin } from './AdminLogin';
import { AdminImageUploadField } from './AdminImageUploadField';
import { AdminFaviconManager } from './AdminFaviconManager';
import { AdminAccountsManager } from './AdminAccountsManager';
import { SchoolLogo } from '../components/SchoolLogo';
import { validateImageFile, compressImageClientSide } from '../utils/imageHelper';
import {
  SchoolIdentity,
  Headmaster,
  SocialMedia,
  VisiMisi,
  Sejarah,
  ELearningData,
  StatistikItem,
  SaranaItem,
  HeroSlideItem,
  BeritaItem,
  GaleriFotoItem,
  GaleriVideoItem,
  GaleriAlbumItem
} from '../types';

type AdminTab =
  | 'ringkasan'
  | 'identitas'
  | 'kepalaSekolah'
  | 'mediaSosial'
  | 'visiMisi'
  | 'sejarah'
  | 'elearning'
  | 'statistik'
  | 'sarana'
  | 'heroSlides'
  | 'berita'
  | 'kelolaGaleri'
  | 'galeriFoto'
  | 'galeriVideo'
  | 'favicon'
  | 'akunAdmin';

export const AdminDashboard: React.FC = () => {
  const { data, isAdmin, currentUser, logoutAdmin, seedData, firebaseInfo } = useSchoolData();
  const [activeTab, setActiveTab] = useState<AdminTab>('ringkasan');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-sync initial berita items (like post-58) to Firestore if not yet present
  useEffect(() => {
    if (isAdmin && isFirebaseConfigured()) {
      dataService.syncInitialBerita(false).catch((err) => {
        console.warn('Initial berita background sync check:', err);
      });
    }
  }, [isAdmin]);

  // Modals state for collection items
  const [editingItem, setEditingItem] = useState<{
    collection: AdminTab;
    item: any;
    isNew: boolean;
  } | null>(null);

  if (!isAdmin) {
    return <AdminLogin onBackToSite={() => (window.location.hash = '')} />;
  }

  const showSuccess = (msg: string) => {
    setSaveStatus(msg);
    setSaveError(null);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const showError = (msg: string) => {
    setSaveError(msg);
    setSaveStatus(null);
    setTimeout(() => setSaveError(null), 5000);
  };

  // Upload handler helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrlReady: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error || 'Format file tidak valid.');
      return;
    }
    try {
      setIsSaving(true);
      const compressed = await compressImageClientSide(file, 800, 0.8);
      const url = await dataService.uploadFile(compressed.blob, 'images', file.name);
      onUrlReady(url);
      showSuccess('Gambar berhasil diunggah!');
    } catch (err: any) {
      console.error('Upload image error:', err);
      showError(`Gagal mengunggah gambar: [${err?.code || 'ERROR'}] ${err?.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Single doc save helper
  const handleSaveDoc = async (col: string, docData: any) => {
    try {
      setIsSaving(true);
      await dataService.set(col, 'info', docData);
      showSuccess(`Data ${col} berhasil disimpan ke Firestore!`);
    } catch (err: any) {
      console.error(`Gagal menyimpan dokumen ${col}:`, {
        code: err?.code,
        message: err?.message,
        stack: err?.stack,
        raw: err
      });
      showError(`Gagal menyimpan ${col}: [${err?.code || 'SAVE_ERROR'}] ${err?.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <SchoolLogo className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Admin Dashboard</h2>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {data.identitas.singkatan || 'SPENSATA'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'ringkasan'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#E5A823]" />
              <span>Ringkasan & Status</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dokumen Tunggal
            </div>

            <button
              onClick={() => setActiveTab('identitas')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'identitas'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Identitas Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('kepalaSekolah')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'kepalaSekolah'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Kepala Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('mediaSosial')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'mediaSosial'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>Media Sosial & Peta</span>
            </button>

            <button
              onClick={() => setActiveTab('visiMisi')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'visiMisi'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Visi dan Misi</span>
            </button>

            <button
              onClick={() => setActiveTab('sejarah')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'sejarah'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>Sejarah Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('elearning')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'elearning'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Portal E-Learning</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Koleksi Data
            </div>

            <button
              onClick={() => setActiveTab('statistik')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'statistik'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Statistik Sekolah</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {data.statistik.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sarana')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'sarana'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Boxes className="w-4 h-4 text-purple-400" />
              <span>Sarana & Fasilitas</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {data.sarana.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('heroSlides')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'heroSlides'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Slide Hero Beranda</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {data.heroSlides.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('berita')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'berita'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Newspaper className="w-4 h-4 text-blue-400" />
              <span>Berita & Publikasi</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {data.berita.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kelolaGaleri')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'kelolaGaleri'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-4 h-4 text-[#E5A823]" />
              <span>Kelola Galeri</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {(data.galeri || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('galeriVideo')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'galeriVideo'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-4 h-4 text-red-400" />
              <span>Galeri Video</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {data.galeriVideo.length}
              </span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pengaturan Situs
            </div>

            <button
              onClick={() => setActiveTab('favicon')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'favicon'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-[#E5A823]" />
              <span>Favicon Tab Browser</span>
            </button>

            <button
              onClick={() => setActiveTab('akunAdmin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'akunAdmin'
                  ? 'bg-[#0E4A6B] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Akun Admin</span>
            </button>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 truncate">
            {currentUser?.email || 'admin@spensata.sch.id'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.location.hash = '';
              }}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="py-1.5 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-1 cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {/* Banner Koneksi Firebase & Akun Login (User Request 5) */}
        <div className="mb-6 p-4.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#E5A823]/15 border border-[#E5A823]/30 flex items-center justify-center text-[#E5A823] flex-shrink-0 shadow-inner">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Database Firebase Firestore
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terhubung & Aktif</span>
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-5 gap-y-1 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">Project ID:</span>
                    <code className="text-[#E5A823] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {firebaseInfo.projectId}
                    </code>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">Database ID:</span>
                    <code className="text-sky-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {firebaseInfo.firestoreDatabaseId}
                    </code>
                  </span>
                </div>
              </div>
            </div>

            {/* Email yang sedang login */}
            <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800/80 self-start lg:self-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="text-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Email Admin Login:
                </div>
                <div className="font-mono font-bold text-white truncate max-w-xs sm:max-w-md">
                  {currentUser?.email || (isAdmin ? 'ardiansyahroni017@gmail.com' : 'Belum Login')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Alerts */}
        {saveStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{saveStatus}</span>
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span className="font-semibold">{saveError}</span>
          </div>
        )}

        {/* TAB 1: RINGKASAN */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Ringkasan Sistem</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Pusat kendali konten sekolah SMP Negeri 1 Tambak terintegrasi Firebase.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    const res = await seedData(true);
                    setIsSaving(false);
                    if (res.success) {
                      showSuccess(res.message);
                    } else {
                      showError(res.message);
                    }
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center gap-2 shadow cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>Sinkron / Muat Data Awal (Seed)</span>
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-xs font-semibold text-slate-400">Total Berita</div>
                <div className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">
                  {data.berita.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {data.berita.filter((b) => b.status === 'Terbit').length} Terbit,{' '}
                  {data.berita.filter((b) => b.status === 'Draft').length} Draft
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-xs font-semibold text-slate-400">Album Galeri</div>
                <div className="text-3xl font-extrabold text-[#E5A823] mt-2 font-mono">
                  {(data.galeri || []).length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Album Google Foto</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-xs font-semibold text-slate-400">Galeri Video</div>
                <div className="text-3xl font-extrabold text-red-400 mt-2 font-mono">
                  {data.galeriVideo.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Tayangan YouTube</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-xs font-semibold text-slate-400">Sarana & Prasarana</div>
                <div className="text-3xl font-extrabold text-purple-400 mt-2 font-mono">
                  {data.sarana.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Fasilitas terdaftar</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5A823]" />
                <span>Petunjuk Penggunaan Panel Admin</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Setiap perubahan yang Anda simpan pada form dokumen tunggal maupun koleksi langsung tersinkronisasi secara real-time via <code>dataService</code>.
                </li>
                <li>
                  Berita dengan status <strong>Draft</strong> disimpan di basis data namun tidak akan tampil kepada pengunjung publik sampai Anda mengubah statusnya menjadi <strong>Terbit</strong>.
                </li>
                <li>
                  Gunakan tombol <strong>Sinkron / Muat Data Awal (Seed)</strong> jika ingin mengunggah struktur data bawaan resmi SMP Negeri 1 Tambak ke Firebase Firestore sekaligus.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: IDENTITAS SEKOLAH */}
        {activeTab === 'identitas' && (
          <DocEditForm
            title="Identitas Sekolah"
            description="Informasi resmi nama, akreditasi, NPSN, dan kontak SMP Negeri 1 Tambak."
            initialData={data.identitas}
            fields={[
              { key: 'nama', label: 'Nama Sekolah', type: 'text', required: true },
              { key: 'singkatan', label: 'Singkatan Nama', type: 'text' },
              { key: 'slogan', label: 'Slogan / Motto', type: 'text', required: true },
              { key: 'program', label: 'Program Unggulan', type: 'text' },
              { key: 'npsn', label: 'Nomor Pokok Sekolah Nasional (NPSN)', type: 'text' },
              { key: 'statusSekolah', label: 'Status Sekolah', type: 'text' },
              { key: 'akreditasi', label: 'Akreditasi', type: 'text' },
              { key: 'alamat', label: 'Alamat Lengkap', type: 'textarea', required: true },
              { key: 'kodePos', label: 'Kode Pos', type: 'text' },
              { key: 'telepon', label: 'Nomor Telepon', type: 'text', required: true },
              { key: 'email', label: 'Email Resmi', type: 'email', required: true },
              { key: 'website', label: 'Alamat Website', type: 'text' },
              { key: 'waktuBelajar', label: 'Waktu Belajar', type: 'text' },
              { key: 'copyright', label: 'Teks Copyright', type: 'text' },
              { key: 'poweredBy', label: 'Teks Powered By', type: 'text' }
            ]}
            onSave={(updated) => handleSaveDoc('identitas', updated)}
            isSaving={isSaving}
          />
        )}

        {/* TAB 3: KEPALA SEKOLAH */}
        {activeTab === 'kepalaSekolah' && (
          <DocEditForm
            title="Kepala Sekolah"
            description="Profil, foto resmi, dan kata sambutan kepala sekolah."
            initialData={data.kepalaSekolah}
            fields={[
              { key: 'nama', label: 'Nama Kepala Sekolah', type: 'text', required: true },
              { key: 'jabatan', label: 'Jabatan', type: 'text', required: true },
              { key: 'nip', label: 'NIP', type: 'text' },
              { key: 'foto', label: 'Foto Kepala Sekolah (URL)', type: 'image', required: true },
              { key: 'sambutanSingkat', label: 'Sambutan Singkat (Beranda)', type: 'textarea', required: true },
              { key: 'sambutanLengkap', label: 'Sambutan Lengkap (Paragraf, Pisahkan Baris Baru)', type: 'paragraphList' }
            ]}
            onSave={(updated) => handleSaveDoc('kepalaSekolah', updated)}
            isSaving={isSaving}
          />
        )}

        {/* TAB 4: MEDIA SOSIAL & PETA */}
        {activeTab === 'mediaSosial' && (
          <DocEditForm
            title="Media Sosial & Tautan Peta"
            description="Tautan akun resmi Instagram, YouTube, Facebook, serta peta lokasi."
            initialData={data.mediaSosial}
            fields={[
              { key: 'instagram', label: 'URL Instagram', type: 'text' },
              { key: 'youtube', label: 'URL Kanal YouTube', type: 'text' },
              { key: 'facebook', label: 'URL Halaman Facebook', type: 'text' },
              { key: 'tautanPeta', label: 'URL Google Maps Lokasi', type: 'text' }
            ]}
            onSave={(updated) => handleSaveDoc('mediaSosial', updated)}
            isSaving={isSaving}
          />
        )}

        {/* TAB 5: VISI & MISI */}
        {activeTab === 'visiMisi' && (
          <DocEditForm
            title="Visi dan Misi"
            description="Rumusan visi strategis, indikator ketercapaian, misi, dan tujuan sekolah."
            initialData={data.visiMisi}
            fields={[
              { key: 'visi', label: 'Kalimat Visi Sekolah', type: 'textarea', required: true },
              { key: 'indikatorVisi', label: 'Indikator Ketercapaian Visi (Satu per baris)', type: 'paragraphList' },
              { key: 'misi', label: 'Daftar Misi Sekolah (Satu per baris)', type: 'paragraphList' },
              { key: 'tujuan', label: 'Tujuan Sekolah (Satu per baris)', type: 'paragraphList' }
            ]}
            onSave={(updated) => handleSaveDoc('visiMisi', updated)}
            isSaving={isSaving}
          />
        )}

        {/* TAB 6: SEJARAH SEKOLAH */}
        {activeTab === 'sejarah' && (
          <DocEditForm
            title="Sejarah Sekolah"
            description="Tahun pendirian, legalitas SK, luas wilayah, dan narasi sejarah perkembangan."
            initialData={data.sejarah}
            fields={[
              { key: 'tahunBerdiri', label: 'Tahun Berdiri', type: 'text' },
              { key: 'nomorSkPendirian', label: 'Nomor SK Pendirian', type: 'text' },
              { key: 'luasTanah', label: 'Luas Tanah / Kampus', type: 'text' },
              { key: 'uraian', label: 'Narasi Sejarah (Paragraf, Satu per baris)', type: 'paragraphList' }
            ]}
            onSave={(updated) => handleSaveDoc('sejarah', updated)}
            isSaving={isSaving}
          />
        )}

        {/* TAB 7: E-LEARNING */}
        {activeTab === 'elearning' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Portal E-Learning</h1>
              <p className="text-xs text-slate-400 mt-1">
                Kelola tautan dan deskripsi akses Pijar Guru & Pijar Siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Pijar Guru */}
              <DocEditForm
                title="Pijar Guru (SIM Sekolah)"
                description="Akses untuk guru dan tenaga kependidikan."
                initialData={data.elearning.guru}
                fields={[
                  { key: 'nama', label: 'Nama Portal', type: 'text', required: true },
                  { key: 'label', label: 'Label Akses', type: 'text' },
                  { key: 'tautan', label: 'URL Login', type: 'text', required: true },
                  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
                  { key: 'fitur', label: 'Fitur Utama (Satu per baris)', type: 'paragraphList' }
                ]}
                onSave={async (updatedGuru) => {
                  const newElearning = { ...data.elearning, guru: updatedGuru };
                  await handleSaveDoc('elearning', newElearning);
                }}
                isSaving={isSaving}
              />

              {/* Form Pijar Siswa */}
              <DocEditForm
                title="Pijar Siswa"
                description="Platform belajar mandiri murid."
                initialData={data.elearning.siswa}
                fields={[
                  { key: 'nama', label: 'Nama Portal', type: 'text', required: true },
                  { key: 'label', label: 'Label Akses', type: 'text' },
                  { key: 'tautan', label: 'URL Login', type: 'text', required: true },
                  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
                  { key: 'fitur', label: 'Fitur Utama (Satu per baris)', type: 'paragraphList' }
                ]}
                onSave={async (updatedSiswa) => {
                  const newElearning = { ...data.elearning, siswa: updatedSiswa };
                  await handleSaveDoc('elearning', newElearning);
                }}
                isSaving={isSaving}
              />
            </div>
          </div>
        )}

        {/* TAB 8: STATISTIK (KOLEKSI) */}
        {activeTab === 'statistik' && (
          <CollectionManager<StatistikItem>
            collectionName="statistik"
            title="Statistik Sekolah (Sekolah dalam Angka)"
            description="Angka murid, GTK, rombel, dan ekstrakurikuler."
            items={data.statistik}
            columns={[
              { key: 'label', label: 'Label' },
              { key: 'nilai', label: 'Nilai (Angka)' },
              { key: 'satuan', label: 'Satuan' },
              { key: 'sublabel', label: 'Keterangan Tambahan' }
            ]}
            formFields={[
              { key: 'id', label: 'ID Unik', type: 'text', required: true },
              { key: 'nilai', label: 'Nilai Angka', type: 'number', required: true },
              { key: 'label', label: 'Label Utama', type: 'text', required: true },
              { key: 'sublabel', label: 'Sublabel / Keterangan', type: 'text' },
              { key: 'satuan', label: 'Satuan (misal: Murid, GTK, Rombel)', type: 'text', required: true },
              { key: 'urutan', label: 'Urutan Tampil', type: 'number' }
            ]}
            onAdd={async (item) => {
              try {
                await dataService.add('statistik', item);
                showSuccess('Statistik berhasil ditambahkan ke database!');
              } catch (err: any) {
                showError(`Gagal menambahkan statistik: ${err?.message || err}`);
                throw err;
              }
            }}
            onUpdate={async (id, item) => {
              try {
                await dataService.update('statistik', id, item);
                showSuccess('Statistik berhasil diperbarui di database!');
              } catch (err: any) {
                showError(`Gagal memperbarui statistik: ${err?.message || err}`);
                throw err;
              }
            }}
            onDelete={async (id) => {
              try {
                await dataService.delete('statistik', id);
                showSuccess('Statistik berhasil dihapus dari database!');
              } catch (err: any) {
                showError(`Gagal menghapus statistik: ${err?.message || err}`);
                throw err;
              }
            }}
          />
        )}

        {/* TAB 9: SARANA & FASILITAS (KOLEKSI) */}
        {activeTab === 'sarana' && (
          <CollectionManager<SaranaItem>
            collectionName="sarana"
            title="Sarana & Prasarana"
            description="Fasilitas penunjang belajar, laboratorium, dan ruang pendukung."
            items={data.sarana}
            columns={[
              { key: 'nama', label: 'Nama Sarana / Fasilitas' },
              { key: 'keterangan', label: 'Keterangan & Spesifikasi' }
            ]}
            formFields={[
              { key: 'nama', label: 'Nama Sarana', type: 'text', required: true },
              { key: 'keterangan', label: 'Keterangan / Kapasitas', type: 'textarea', required: true },
              { key: 'foto', label: 'Foto Sarana (Opsional)', type: 'image' },
              { key: 'urutan', label: 'Urutan Tampil', type: 'number' }
            ]}
            onAdd={async (item) => {
              try {
                await dataService.add('sarana', item);
                showSuccess('Sarana berhasil ditambahkan ke database!');
              } catch (err: any) {
                showError(`Gagal menambahkan sarana: ${err?.message || err}`);
                throw err;
              }
            }}
            onUpdate={async (id, item) => {
              try {
                await dataService.update('sarana', id, item);
                showSuccess('Sarana berhasil diperbarui di database!');
              } catch (err: any) {
                showError(`Gagal memperbarui sarana: ${err?.message || err}`);
                throw err;
              }
            }}
            onDelete={async (id) => {
              try {
                await dataService.delete('sarana', id);
                showSuccess('Sarana berhasil dihapus dari database!');
              } catch (err: any) {
                showError(`Gagal menghapus sarana: ${err?.message || err}`);
                throw err;
              }
            }}
          />
        )}

        {/* TAB 10: HERO SLIDES (KOLEKSI) */}
        {activeTab === 'heroSlides' && (
          <CollectionManager<HeroSlideItem>
            collectionName="heroSlides"
            title="Slide Hero Beranda"
            description="Banner gambar slider utama di bagian teratas beranda."
            items={data.heroSlides}
            columns={[
              { key: 'judul', label: 'Judul Banner' },
              { key: 'badge', label: 'Badge' },
              { key: 'teksTombolUtama', label: 'Tombol Utama' }
            ]}
            formFields={[
              { key: 'judul', label: 'Judul Banner', type: 'text', required: true },
              { key: 'subjudul', label: 'Subjudul / Deskripsi Singkat', type: 'textarea', required: true },
              { key: 'badge', label: 'Teks Badge (Contoh: Sekolah Penggerak)', type: 'text' },
              { key: 'gambar', label: 'Gambar Banner (URL / Upload)', type: 'image', required: true },
              { key: 'teksTombolUtama', label: 'Teks Tombol Utama', type: 'text' },
              { key: 'tautanTombolUtama', label: 'Tautan Tombol Utama (misal: #profil)', type: 'text' },
              { key: 'teksTombolKedua', label: 'Teks Tombol Kedua', type: 'text' },
              { key: 'tautanTombolKedua', label: 'Tautan Tombol Kedua (misal: #hubungi-kami)', type: 'text' },
              { key: 'urutan', label: 'Urutan Tampil', type: 'number' }
            ]}
            onAdd={async (item) => {
              try {
                await dataService.add('heroSlides', item);
                showSuccess('Slide banner berhasil ditambahkan ke database!');
              } catch (err: any) {
                showError(`Gagal menambahkan banner: ${err?.message || err}`);
                throw err;
              }
            }}
            onUpdate={async (id, item) => {
              try {
                await dataService.update('heroSlides', id, item);
                showSuccess('Slide banner berhasil diperbarui di database!');
              } catch (err: any) {
                showError(`Gagal memperbarui banner: ${err?.message || err}`);
                throw err;
              }
            }}
            onDelete={async (id) => {
              try {
                await dataService.delete('heroSlides', id);
                showSuccess('Slide banner berhasil dihapus dari database!');
              } catch (err: any) {
                showError(`Gagal menghapus banner: ${err?.message || err}`);
                throw err;
              }
            }}
          />
        )}

        {/* TAB 11: BERITA & PUBLIKASI (KOLEKSI) */}
        {activeTab === 'berita' && (
          <CollectionManager<BeritaItem>
            collectionName="berita"
            title="Berita & Artikel Publikasi"
            description="Kelola warta, pengumuman, dan artikel sekolah. Terhubung langsung dengan Firestore realtime."
            items={data.berita}
            extraAction={
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsSaving(true);
                    const res = await dataService.syncInitialBerita(true);
                    showSuccess(res.message);
                  } catch (err: any) {
                    showError(`Gagal menyinkronkan: ${err?.message || err}`);
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
                title="Tulis ulang atau lengkapi seluruh data berita awal (post-58, post-57, dll) ke database Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#E5A823] ${isSaving ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Berita Awal (post-58, dll)</span>
              </button>
            }
            columns={[
              { key: 'judul', label: 'Judul Berita' },
              { key: 'tanggal', label: 'Tanggal' },
              { key: 'kategori', label: 'Kategori' },
              {
                key: 'status',
                label: 'Status',
                render: (val) => (
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      val === 'Terbit'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {val}
                  </span>
                )
              }
            ]}
            formFields={[
              { key: 'judul', label: 'Judul Berita', type: 'text', required: true },
              { key: 'slug', label: 'Slug / URL Bersih (opsional)', type: 'text' },
              {
                key: 'status',
                label: 'Status Publikasi',
                type: 'select',
                options: ['Terbit', 'Draft'],
                required: true
              },
              { key: 'tanggal', label: 'Tanggal (contoh: 24/07/2026 09:19)', type: 'text', required: true },
              { key: 'penulis', label: 'Nama Penulis', type: 'text', required: true },
              { key: 'kategori', label: 'Kategori', type: 'text', required: true },
              { key: 'ringkasan', label: 'Cuplikan Singkat (Excerpt)', type: 'textarea', required: true },
              { key: 'isi', label: 'Isi Lengkap Berita (Satu paragraf per baris)', type: 'paragraphList', required: true },
              { key: 'tag', label: 'Tag Topik (Satu per baris atau pisahkan koma)', type: 'paragraphList' },
              { key: 'fotoSampul', label: 'Foto Sampul (URL / Upload)', type: 'image', required: true },
              { key: 'tautanAsli', label: 'Tautan Asli (Opsional)', type: 'text' },
              { key: 'tandaiPopuler', label: 'Tandai sebagai Tulisan Populer', type: 'checkbox' }
            ]}
            onAdd={async (item) => {
              try {
                const slug =
                  item.slug ||
                  item.judul
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                await dataService.add('berita', { ...item, slug });
                showSuccess('Berita berhasil ditambahkan ke database!');
              } catch (err: any) {
                showError(`Gagal menyimpan berita: ${err?.message || err}`);
                throw err;
              }
            }}
            onUpdate={async (id, item) => {
              try {
                await dataService.update('berita', id, item);
                showSuccess('Berita berhasil diperbarui di database!');
              } catch (err: any) {
                showError(`Gagal memperbarui berita: ${err?.message || err}`);
                throw err;
              }
            }}
            onDelete={async (id) => {
              try {
                await dataService.delete('berita', id);
                showSuccess('Berita berhasil dihapus dari database!');
              } catch (err: any) {
                showError(`Gagal menghapus berita: ${err?.message || err}`);
                throw err;
              }
            }}
          />
        )}

        {/* TAB 12: KELOLA GALERI (ALBUM GOOGLE FOTO) */}
        {activeTab === 'kelolaGaleri' && (
          <KelolaGaleriSection
            albums={data.galeri || []}
            onShowSuccess={showSuccess}
            onShowError={showError}
          />
        )}

        {/* TAB 13: GALERI VIDEO (KOLEKSI) */}
        {activeTab === 'galeriVideo' && (
          <CollectionManager<GaleriVideoItem>
            collectionName="galeriVideo"
            title="Galeri Video"
            description="Tayangan video kegiatan sekolah dari YouTube."
            items={data.galeriVideo}
            columns={[
              { key: 'judul', label: 'Judul Video' },
              { key: 'durasi', label: 'Durasi' },
              { key: 'tanggal', label: 'Tahun / Tanggal' }
            ]}
            formFields={[
              { key: 'judul', label: 'Judul Video', type: 'text', required: true },
              { key: 'deskripsi', label: 'Deskripsi Singkat', type: 'textarea' },
              { key: 'tautanYouTube', label: 'Tautan YouTube (contoh: https://www.youtube.com/watch?v=...)', type: 'text', required: true },
              { key: 'durasi', label: 'Durasi (contoh: 04:15)', type: 'text' },
              { key: 'tanggal', label: 'Tahun / Tanggal', type: 'text' },
              { key: 'urutan', label: 'Urutan Tampil', type: 'number' }
            ]}
            onAdd={async (item) => {
              try {
                await dataService.add('galeriVideo', item);
                showSuccess('Video galeri berhasil ditambahkan ke database!');
              } catch (err: any) {
                showError(`Gagal menambahkan video: ${err?.message || err}`);
                throw err;
              }
            }}
            onUpdate={async (id, item) => {
              try {
                await dataService.update('galeriVideo', id, item);
                showSuccess('Video galeri berhasil diperbarui di database!');
              } catch (err: any) {
                showError(`Gagal memperbarui video: ${err?.message || err}`);
                throw err;
              }
            }}
            onDelete={async (id) => {
              try {
                await dataService.delete('galeriVideo', id);
                showSuccess('Video galeri berhasil dihapus dari database!');
              } catch (err: any) {
                showError(`Gagal menghapus video: ${err?.message || err}`);
                throw err;
              }
            }}
          />
        )}

        {/* TAB 14: PENGATURAN FAVICON SITUS */}
        {activeTab === 'favicon' && <AdminFaviconManager />}

        {/* TAB 15: KELOLA AKUN ADMINISTRATOR */}
        {activeTab === 'akunAdmin' && <AdminAccountsManager />}
      </main>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENT: FORM EDITOR DOKUMEN TUNGGAL
// ============================================================================
interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'image' | 'paragraphList';
  required?: boolean;
}

const DocEditForm: React.FC<{
  title: string;
  description: string;
  initialData: any;
  fields: FormFieldConfig[];
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}> = ({ title, description, initialData, fields, onSave, isSaving }) => {
  const [formData, setFormData] = useState<any>({ ...initialData });

  // Update when initialData updates from Firestore snapshot
  React.useEffect(() => {
    setFormData({ ...initialData });
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleParagraphChange = (key: string, textValue: string) => {
    const list = textValue
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev: any) => ({ ...prev, [key]: list }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => {
            const isFullWidth = f.type === 'textarea' || f.type === 'paragraphList' || f.type === 'image';

            return (
              <div key={f.key} className={isFullWidth ? 'md:col-span-2' : ''}>
                {f.type !== 'image' && (
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {f.label} {f.required && <span className="text-rose-400">*</span>}
                  </label>
                )}

                {f.type === 'text' || f.type === 'email' || f.type === 'number' ? (
                  <input
                    type={f.type}
                    required={f.required}
                    value={formData[f.key] ?? ''}
                    onChange={(e) =>
                      handleChange(
                        f.key,
                        f.type === 'number' ? Number(e.target.value) : e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                  />
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    required={f.required}
                    value={formData[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                  />
                ) : f.type === 'paragraphList' ? (
                  <div>
                    <textarea
                      rows={6}
                      value={Array.isArray(formData[f.key]) ? formData[f.key].join('\n') : ''}
                      onChange={(e) => handleParagraphChange(f.key, e.target.value)}
                      placeholder="Masukkan setiap butir/paragraf pada baris baru..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] font-mono leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pisahkan setiap item atau paragraf dengan menekan tombol Enter (baris baru).
                    </p>
                  </div>
                ) : f.type === 'image' ? (
                  <AdminImageUploadField
                    label={f.label}
                    value={formData[f.key] ?? ''}
                    onChange={(newUrl) => handleChange(f.key, newUrl)}
                    required={f.required}
                    folder={f.key === 'foto' ? 'kepalaSekolah' : 'images'}
                    isKepalaSekolah={f.key === 'foto'}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENT: MANAGER KOLEKSI (TABEL + MODAL TAMBAH/EDIT)
// ============================================================================
interface CollectionColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (val: any, item: T) => React.ReactNode;
}

interface CollectionFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'paragraphList' | 'checkbox' | 'select';
  options?: string[];
  required?: boolean;
}

function CollectionManager<T extends { id?: string }>({
  title,
  description,
  items,
  columns,
  formFields,
  onAdd,
  onUpdate,
  onDelete,
  collectionName,
  extraAction
}: {
  title: string;
  description: string;
  items: T[];
  columns: CollectionColumn<T>[];
  formFields: CollectionFieldConfig[];
  onAdd: (item: any) => Promise<void>;
  onUpdate: (id: string, item: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  collectionName?: string;
  extraAction?: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [docNotFoundModal, setDocNotFoundModal] = useState<{
    id: string;
    data: any;
  } | null>(null);

  const handleOpenAdd = () => {
    const empty: any = {};
    formFields.forEach((f) => {
      if (f.type === 'number') empty[f.key] = 0;
      else if (f.type === 'paragraphList') empty[f.key] = [];
      else if (f.type === 'checkbox') empty[f.key] = false;
      else if (f.type === 'select') empty[f.key] = f.options?.[0] || '';
      else empty[f.key] = '';
    });
    setFormData(empty);
    setIsEditing(false);
    setActiveItemId(null);
    setFormError(null);
    setDocNotFoundModal(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setFormData({ ...item });
    setIsEditing(true);
    setActiveItemId((item as any).id);
    setFormError(null);
    setDocNotFoundModal(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (isEditing && activeItemId) {
        // Requirement 4: Check if document exists before saving update
        if (collectionName) {
          const docExists = await dataService.exists(collectionName, activeItemId);
          if (!docExists) {
            setDocNotFoundModal({
              id: activeItemId,
              data: { ...formData }
            });
            setSubmitting(false);
            return;
          }
        }
        await onUpdate(activeItemId, formData);
      } else {
        await onAdd(formData);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Gagal menyimpan data ke database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {extraAction}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Baru</span>
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-dashed border-slate-700">
          Belum ada data pada koleksi ini. Silakan klik tombol "Tambah Item Baru" di atas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5">No</th>
                {columns.map((c, i) => (
                  <th key={i} className="px-4 py-3.5">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
              {items.map((item, index) => (
                <tr key={(item as any).id || index} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                  {columns.map((c, i) => (
                    <td key={i} className="px-4 py-3 text-slate-200">
                      {c.render
                        ? c.render((item as any)[c.key], item)
                        : String((item as any)[c.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
                            onDelete((item as any).id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
                        title="Hapus Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Ubah Data Item' : 'Tambah Data Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {f.label} {f.required && <span className="text-rose-400">*</span>}
                  </label>

                  {f.type === 'text' || f.type === 'number' ? (
                    <input
                      type={f.type}
                      required={f.required}
                      value={formData[f.key] ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                    />
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={f.required}
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={formData[f.key] ?? f.options?.[0]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                    >
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[f.key])}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                        className="rounded border-slate-700 text-[#E5A823] focus:ring-[#E5A823]"
                      />
                      <span className="text-xs text-slate-300">Aktifkan opsi ini</span>
                    </label>
                  ) : f.type === 'paragraphList' ? (
                    <textarea
                      rows={4}
                      value={
                        Array.isArray(formData[f.key])
                          ? formData[f.key].join('\n')
                          : String(formData[f.key] || '')
                      }
                      onChange={(e) => {
                        const list = e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFormData({ ...formData, [f.key]: list });
                      }}
                      placeholder="Pisahkan tiap butir atau tag dengan baris baru (Enter)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823] font-mono"
                    />
                  ) : f.type === 'image' ? (
                    <AdminImageUploadField
                      label={f.label}
                      value={formData[f.key] ?? ''}
                      onChange={(newUrl) => setFormData({ ...formData, [f.key]: newUrl })}
                      required={f.required}
                      folder={collectionName || 'koleksi'}
                      placeholder="https://... atau tempel tautan Google Drive"
                    />
                  ) : null}
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Penanganan Dokumen yang Sudah Dihapus (Requirement 4) */}
      {docNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                {title.includes('Berita') ? 'Berita' : title} Tidak Ditemukan di Database
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Dokumen dengan ID <code className="text-[#E5A823] font-mono bg-slate-800 px-1.5 py-0.5 rounded">{docNotFoundModal.id}</code> tidak ditemukan di database Firestore (kemungkinan telah dihapus dari sesi lain atau belum tersimpan).
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Simpan sebagai {title.includes('Berita') ? 'berita' : 'data'} baru?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDocNotFoundModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    await onAdd(docNotFoundModal.data);
                    setDocNotFoundModal(null);
                    setModalOpen(false);
                  } catch (err: any) {
                    setFormError(`Gagal membuat data baru: ${err?.message || err}`);
                    setDocNotFoundModal(null);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[#E5A823] hover:bg-[#d49818] text-xs font-bold text-slate-900 transition flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan sebagai {title.includes('Berita') ? 'Berita' : 'Data'} Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT: KELOLA GALERI (ALBUM GOOGLE FOTO)
// ============================================================================
interface KelolaGaleriSectionProps {
  albums: GaleriAlbumItem[];
  onShowSuccess: (msg: string) => void;
  onShowError: (msg: string) => void;
}

const KelolaGaleriSection: React.FC<KelolaGaleriSectionProps> = ({
  albums,
  onShowSuccess,
  onShowError
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form states
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkAlbum, setLinkAlbum] = useState('');
  const [linkSampul, setLinkSampul] = useState('');
  const [daftarFotoText, setDaftarFotoText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setJudul('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setDeskripsi('');
    setLinkAlbum('');
    setLinkSampul('');
    setDaftarFotoText('');
    setErrorMsg(null);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (alb: GaleriAlbumItem) => {
    setEditingId(alb.id);
    setJudul(alb.judul || '');
    setTanggal(alb.tanggal || '');
    setDeskripsi(alb.deskripsi || '');
    setLinkAlbum(alb.linkAlbum || '');
    setLinkSampul(alb.linkSampul || '');
    setDaftarFotoText((alb.daftarFoto || []).join('\n'));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedAlbum = linkAlbum.trim();
    if (!trimmedAlbum) {
      setErrorMsg('Tautan album Google Foto wajib diisi.');
      return;
    }

    // Validasi: linkAlbum harus diawali https://photos.app.goo.gl/ atau https://photos.google.com/
    if (
      !trimmedAlbum.startsWith('https://photos.app.goo.gl/') &&
      !trimmedAlbum.startsWith('https://photos.google.com/')
    ) {
      setErrorMsg(
        'Tautan album tidak valid. Tautan harus diawali dengan https://photos.app.goo.gl/ atau https://photos.google.com/'
      );
      return;
    }

    if (!judul.trim()) {
      setErrorMsg('Judul album kegiatan wajib diisi.');
      return;
    }

    if (!tanggal.trim()) {
      setErrorMsg('Tanggal kegiatan wajib diisi.');
      return;
    }

    const photosList = daftarFotoText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      judul: judul.trim(),
      tanggal: tanggal.trim(),
      deskripsi: deskripsi.trim(),
      linkAlbum: trimmedAlbum,
      linkSampul: linkSampul.trim(),
      daftarFoto: photosList,
      dibuatPada: Date.now()
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await dataService.update('galeri', editingId, payload);
        onShowSuccess('Album galeri berhasil diperbarui!');
      } else {
        await dataService.add('galeri', payload);
        onShowSuccess('Album galeri baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      resetForm();
    } catch (err: any) {
      onShowError(`Gagal menyimpan data album: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (alb: GaleriAlbumItem) => {
    const ok = window.confirm(
      `Apakah Anda yakin ingin menghapus album "${alb.judul}"?\n\nTindakan ini hanya menghapus data link di Firestore, bukan foto di Google Foto Anda.`
    );
    if (!ok) return;

    try {
      await dataService.delete('galeri', alb.id);
      onShowSuccess('Album galeri berhasil dihapus dari website!');
    } catch (err: any) {
      onShowError(`Gagal menghapus album: ${err?.message || err}`);
    }
  };

  const filteredAlbums = albums.filter((a) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      a.judul.toLowerCase().includes(q) ||
      (a.deskripsi && a.deskripsi.toLowerCase().includes(q)) ||
      (a.tanggal && a.tanggal.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#E5A823]" />
            <span>Kelola Galeri (Album Google Foto)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simpan tautan album Google Foto resmi sekolah. Seluruh foto tersimpan di Google Foto, website hanya menyimpan linknya.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Album Baru</span>
        </button>
      </div>

      {/* Guide Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#E5A823] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">Petunjuk Tautan Google Foto:</div>
            <div className="text-amber-300 font-medium">
              Buka Google Foto → pilih album → Bagikan → Buat link → salin dan tempel di sini.
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 sm:text-right">
          Total: <strong className="text-white">{albums.length} Album</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Cari album berdasarkan judul atau tanggal..."
          className="w-full sm:w-80 px-3.5 py-2 rounded-xl text-xs bg-slate-900/60 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="text-xs text-slate-400 hover:text-white"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table Data */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
          <p>
            {searchFilter
              ? 'Tidak ada album yang cocok dengan pencarian.'
              : 'Belum ada data album Google Foto. Klik tombol "Tambah Album Baru" di atas untuk menambahkan.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5">No</th>
                <th className="px-4 py-3.5">Sampul</th>
                <th className="px-4 py-3.5">Judul Kegiatan</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Tautan Album Google Foto</th>
                <th className="px-4 py-3.5 text-center">Foto Pratinjau</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
              {filteredAlbums.map((alb, index) => (
                <tr key={alb.id || index} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                  <td className="px-4 py-3">
                    {alb.linkSampul ? (
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                        <img
                          src={alb.linkSampul}
                          alt={alb.judul}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-10 rounded-lg bg-[#0E4A6B]/80 flex items-center justify-center text-[10px] font-bold text-white">
                        SPENSATA
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{alb.judul}</div>
                    {alb.deskripsi && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {alb.deskripsi}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {alb.tanggal || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={alb.linkAlbum}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#E5A823] hover:underline font-mono text-[11px] max-w-xs truncate"
                      title={alb.linkAlbum}
                    >
                      <span>Buka Album</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                      {alb.daftarFoto?.length || 0} Foto
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(alb)}
                        className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition cursor-pointer"
                        title="Edit Album"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(alb)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
                        title="Hapus Album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Tambah / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E5A823]" />
                <span>{editingId ? 'Edit Album Google Foto' : 'Tambah Album Google Foto Baru'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Petunjuk Singkat Form */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#E5A823]" />
                <span>Petunjuk Singkat:</span>
              </div>
              <p className="font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-amber-300 select-all">
                Buka Google Foto → pilih album → Bagikan → Buat link → salin dan tempel di sini.
              </p>
              <p className="text-[11px] text-slate-400">
                Data foto tidak disimpan di website, website hanya menyimpan link albumnya.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Judul */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Judul Kegiatan / Album <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Seleksi Penerimaan Murid Baru 2026"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tanggal Kegiatan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  placeholder="Contoh: 2026-07-12 atau Juli 2026"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                />
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Penjelasan singkat mengenai dokumentasi kegiatan ini..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
                />
              </div>

              {/* Link Album Google Foto (Wajib) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Link Album Google Foto <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  value={linkAlbum}
                  onChange={(e) => setLinkAlbum(e.target.value)}
                  placeholder="https://photos.app.goo.gl/... atau https://photos.google.com/..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Wajib diawali dengan <code className="text-[#E5A823]">https://photos.app.goo.gl/</code> atau <code className="text-[#E5A823]">https://photos.google.com/</code>
                </p>
              </div>

              {/* Link Sampul (Opsional) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Link Sampul (URL Gambar Langsung, Opsional)
                </label>
                <input
                  type="url"
                  value={linkSampul}
                  onChange={(e) => setLinkSampul(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau https://lh3.googleusercontent.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Jika dikosongkan, kartu akan menampilkan placeholder resmi berlogo SPENSATA.
                </p>
                {linkSampul && (
                  <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    <img
                      src={linkSampul}
                      alt="Pratinjau Sampul"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Kolom Menempelkan Beberapa URL Foto (daftarFoto) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Daftar URL Foto Langsung (Satu URL per baris, Opsional)
                </label>
                <textarea
                  value={daftarFotoText}
                  onChange={(e) => setDaftarFotoText(e.target.value)}
                  placeholder="https://lh3.googleusercontent.com/...&#10;https://lh3.googleusercontent.com/..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] font-mono text-xs leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tempelkan URL gambar langsung dari Google Foto (misal https://lh3.googleusercontent.com/...). Pisahkan setiap foto dengan baris baru (Enter). Foto-foto ini akan muncul pada galeri grid dengan lightbox interaktif.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Album'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
