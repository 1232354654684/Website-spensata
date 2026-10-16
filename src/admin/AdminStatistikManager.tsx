import React, { useState } from 'react';
import {
  BarChart3,
  Plus,
  Search,
  Copy,
  Check,
  Lock,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Lightbulb,
  Hash,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { StatistikItem } from '../types';

interface PresetStatistik {
  id: string;
  label: string;
  sublabel: string;
  satuan: string;
}

const PRESET_SUGGESTIONS: PresetStatistik[] = [
  {
    id: 'students',
    label: 'Murid Aktif',
    sublabel: 'Kelas VII, VIII, dan IX',
    satuan: 'Murid'
  },
  {
    id: 'staff',
    label: 'Tenaga Kependidikan',
    sublabel: 'Pegawai & Tata Usaha',
    satuan: 'Orang'
  },
  {
    id: 'classes',
    label: 'Rombongan Belajar',
    sublabel: 'Ruang Kelas Representatif',
    satuan: 'Rombel'
  },
  {
    id: 'extracurricular',
    label: 'Ekstrakurikuler Aktif',
    sublabel: 'Wadah Bakat, Olahraga & Seni',
    satuan: 'Ekskul'
  },
  {
    id: 'teachers',
    label: 'Guru Pendidik',
    sublabel: 'Pendidik Profesional Bersertifikasi',
    satuan: 'Guru'
  },
  {
    id: 'achievements',
    label: 'Prestasi Kejuaraan',
    sublabel: 'Tingkat Kabupaten & Nasional',
    satuan: 'Prestasi'
  },
  {
    id: 'alumni',
    label: 'Alumni Berprestasi',
    sublabel: 'Terserap di Sekolah Favorit',
    satuan: 'Alumni'
  },
  {
    id: 'labs',
    label: 'Laboratorium Pembelajaran',
    sublabel: 'TIK, IPA, dan Bahasa',
    satuan: 'Ruang'
  },
  {
    id: 'library',
    label: 'Koleksi Perpustakaan',
    sublabel: 'Buku Cetak & Digital',
    satuan: 'Judul'
  }
];

interface AdminStatistikManagerProps {
  items: StatistikItem[];
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const AdminStatistikManager: React.FC<AdminStatistikManagerProps> = ({
  items,
  onSuccess,
  onError
}) => {
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    id: string;
    nilai: number;
    label: string;
    sublabel: string;
    satuan: string;
    urutan: number;
  }>({
    id: '',
    nilai: 0,
    label: '',
    sublabel: '',
    satuan: '',
    urutan: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<StatistikItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Used IDs in current dataset
  const usedIds = items.map((it) => it.id.toLowerCase().trim());
  const availableSuggestions = PRESET_SUGGESTIONS.filter(
    (p) => !usedIds.includes(p.id.toLowerCase())
  );

  // Filter items for "Daftar ID Unik" panel
  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      String(item.nilai).includes(q) ||
      (item.satuan || '').toLowerCase().includes(q) ||
      (item.sublabel || '').toLowerCase().includes(q)
    );
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setActiveItemId(null);
    setFormError(null);
    setFormData({
      id: '',
      nilai: 0,
      label: '',
      sublabel: '',
      satuan: 'Murid',
      urutan: items.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: StatistikItem) => {
    setIsEditing(true);
    setActiveItemId(item.id);
    setFormError(null);
    setFormData({
      id: item.id,
      nilai: item.nilai ?? 0,
      label: item.label ?? '',
      sublabel: item.sublabel ?? '',
      satuan: item.satuan ?? '',
      urutan: item.urutan ?? 1
    });
    setModalOpen(true);
  };

  const handleSelectSuggestion = (preset: PresetStatistik) => {
    setFormData((prev) => ({
      ...prev,
      id: preset.id,
      label: preset.label,
      sublabel: preset.sublabel,
      satuan: preset.satuan
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (isEditing && activeItemId) {
        // Mode Edit: ID tidak dapat diubah (read-only)
        await dataService.update('statistik', activeItemId, {
          nilai: Number(formData.nilai),
          label: formData.label.trim(),
          sublabel: formData.sublabel.trim(),
          satuan: formData.satuan.trim(),
          urutan: Number(formData.urutan) || 1
        });
        onSuccess(`Statistik "${formData.label}" berhasil diperbarui.`);
        setModalOpen(false);
      } else {
        // Mode Tambah: Jika ID kosong, buat otomatis dari label
        let finalId = formData.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        if (!finalId) {
          finalId = formData.label
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
        }

        if (!finalId) {
          finalId = `stat_${Date.now()}`;
        }

        await dataService.add('statistik', {
          id: finalId,
          nilai: Number(formData.nilai),
          label: formData.label.trim(),
          sublabel: formData.sublabel.trim(),
          satuan: formData.satuan.trim(),
          urutan: Number(formData.urutan) || 1
        });
        onSuccess(`Statistik "${formData.label}" (${finalId}) berhasil ditambahkan.`);
        setModalOpen(false);
      }
    } catch (err: any) {
      console.error('Submit statistik error:', err);
      setFormError(err?.message || 'Gagal menyimpan statistik ke database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      // Hapus menggunakan ID dokumen Firestore yang tepat
      await dataService.delete('statistik', itemToDelete.id);
      onSuccess(`Statistik "${itemToDelete.label}" (${itemToDelete.id}) berhasil dihapus.`);
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Delete statistik error:', err);
      onError(err?.message || 'Gagal menghapus statistik dari database.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSyncInitial = async () => {
    setIsSyncing(true);
    try {
      const res = await dataService.syncInitialStatistik(false);
      onSuccess(res.message);
    } catch (err: any) {
      console.error('Sync statistik error:', err);
      onError(err?.message || 'Gagal menyinkronkan data statistik awal.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Statistik Sekolah (Sekolah dalam Angka)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola indikator angka murid, pendidik, rombel, dan prestasi yang tampil di beranda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Sinkronkan Data Awal */}
          <button
            onClick={handleSyncInitial}
            disabled={isSyncing}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2 cursor-pointer border border-slate-600/70 disabled:opacity-50"
            title="Salin data statistik awal (students, staff, classes, extracurricular) ke Firestore jika belum ada"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#E5A823]' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data Awal'}</span>
          </button>

          {/* Tombol Tambah Item Baru */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#E5A823] text-slate-900 hover:bg-[#d49818] transition flex items-center gap-1.5 shadow cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Statistik Baru</span>
          </button>
        </div>
      </div>

      {/* PANEL DAFTAR ID UNIK */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#E5A823]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Daftar ID Unik Statistik
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {items.length} ID Terdaftar
            </span>
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari label, ID unik, atau nilai..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid Kartu ID Unik */}
        {filteredItems.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 italic">
            Tidak ada ID statistik yang cocok dengan &quot;{searchTerm}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenEdit(item)}
                  className="group relative p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-[#E5A823]/50 transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs hover:shadow-md"
                  title="Klik untuk langsung mengedit data statistik ini"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-[#E5A823] transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.sublabel || 'Tanpa keterangan'}
                      </div>
                    </div>

                    {/* Tombol Salin ID */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyId(item.id, e)}
                      className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex-shrink-0 cursor-pointer"
                      title={isCopied ? 'ID telah disalin!' : `Salin ID "${item.id}"`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-750 text-xs">
                    <span className="font-mono text-[11px] font-semibold text-[#E5A823] bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-750">
                      #{item.id}
                    </span>
                    <span className="font-extrabold text-white font-mono">
                      {item.nilai} <span className="font-sans font-normal text-[11px] text-slate-400">{item.satuan}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TABEL DATA STATISTIK */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
          <p>Belum ada data statistik di database.</p>
          <p className="text-[11px] text-slate-500">
            Klik tombol &quot;Sinkronkan Data Awal&quot; di atas untuk memasukkan 4 data statistik bawaan, atau klik &quot;Tambah Statistik Baru&quot;.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5">No</th>
                <th className="px-4 py-3.5">ID Dokumen (Unik)</th>
                <th className="px-4 py-3.5">Label Utama</th>
                <th className="px-4 py-3.5">Nilai Angka</th>
                <th className="px-4 py-3.5">Satuan</th>
                <th className="px-4 py-3.5">Keterangan (Sublabel)</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
              {items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#E5A823]">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-750">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{item.label}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                    {item.nilai}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="bg-slate-700/60 px-2 py-0.5 rounded text-[11px]">
                      {item.satuan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {item.sublabel || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition cursor-pointer"
                        title="Edit Data Statistik"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
                        title="Hapus Data Statistik"
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

      {/* MODAL TAMBAH / EDIT STATISTIK */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#E5A823]" />
                <h3 className="text-lg font-bold text-white">
                  {isEditing ? 'Ubah Data Statistik' : 'Tambah Statistik Baru'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FIELD ID UNIK */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ID Unik Dokumen <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={isEditing}
                    readOnly={isEditing}
                    disabled={isEditing}
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                      })
                    }
                    placeholder="contoh: students, teachers, alumni, labs..."
                    className={`w-full px-3.5 py-2.5 rounded-xl font-mono text-xs sm:text-sm text-white focus:outline-none transition ${
                      isEditing
                        ? 'bg-slate-850 border border-slate-750 text-slate-400 cursor-not-allowed pl-9'
                        : 'bg-slate-800 border border-slate-700 focus:border-[#E5A823]'
                    }`}
                  />
                  {isEditing && (
                    <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {isEditing ? (
                  <p className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>ID unik dikunci pada mode edit untuk menjaga integritas dokumen database.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gunakan huruf kecil, angka, atau underscore. Jika dikosongkan, ID akan dibuat otomatis dari label.
                  </p>
                )}
              </div>

              {/* DAFTAR SARAN ID (HANYA MUNCUL DI FORM TAMBAH) */}
              {!isEditing && (
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <Lightbulb className="w-3.5 h-3.5 text-[#E5A823]" />
                    <span>Saran ID Statistik (Klik untuk mengisi otomatis):</span>
                  </div>

                  {availableSuggestions.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">
                      Semua ID bawaan sudah digunakan dalam data statistik Anda. Anda dapat mengetikkan ID kustom baru.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {availableSuggestions.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectSuggestion(preset)}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 hover:bg-[#E5A823]/20 hover:text-[#E5A823] text-slate-300 border border-slate-700 hover:border-[#E5A823]/40 transition cursor-pointer flex items-center gap-1"
                          title={`Gunakan template: ${preset.label} (${preset.satuan})`}
                        >
                          <Plus className="w-3 h-3 text-[#E5A823]" />
                          <span>{preset.id}</span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            ({preset.label})
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Daftar ID yang sudah terpakai */}
                  {usedIds.length > 0 && (
                    <div className="pt-2 border-t border-slate-750 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400 font-medium">ID Terpakai:</span>
                      {usedIds.map((uid) => (
                        <span
                          key={uid}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          {uid}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FIELD LABEL UTAMA & NILAI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Label Utama <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Contoh: Murid Aktif, Guru & Tenaga Kependidikan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nilai Angka <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.nilai}
                    onChange={(e) =>
                      setFormData({ ...formData, nilai: Number(e.target.value) })
                    }
                    placeholder="Contoh: 856"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                  />
                </div>
              </div>

              {/* FIELD SATUAN & URUTAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Satuan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    placeholder="Contoh: Murid, GTK, Rombel, Ekskul, Prestasi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.urutan}
                    onChange={(e) =>
                      setFormData({ ...formData, urutan: Number(e.target.value) })
                    }
                    placeholder="1, 2, 3..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                  />
                </div>
              </div>

              {/* FIELD SUBLABEL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Keterangan / Sublabel (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.sublabel}
                  onChange={(e) => setFormData({ ...formData, sublabel: e.target.value })}
                  placeholder="Contoh: Kelas VII, VIII, dan IX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5A823]"
                />
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
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Statistik'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS STATISTIK */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Hapus Data Statistik?
              </h4>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>Apakah Anda yakin ingin menghapus data statistik ini?</p>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <div className="font-bold text-white text-sm">{itemToDelete.label}</div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>ID Dokumen: <strong className="font-mono text-[#E5A823]">{itemToDelete.id}</strong></span>
                  <span className="font-mono font-bold text-emerald-400">
                    {itemToDelete.nilai} {itemToDelete.satuan}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-rose-300/80">
                Tindakan ini akan menghapus dokumen dari koleksi &quot;statistik&quot; di database Firestore secara permanen.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Statistik</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
