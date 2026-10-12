import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SCHOOL_INFO } from '../data/schoolData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!formData.email.trim()) {
      errs.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Format email tidak valid.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Pesan atau pertanyaan wajib diisi.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Pesan minimal 10 karakter.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: 'Hubungi Kami' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Pelayanan Informasi & Pengaduan Terpadu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Hubungi SMP Negeri 1 Tambak
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Pintu komunikasi terbuka bagi orang tua wali, siswa, alumni, dan masyarakat. Kami siap memberikan informasi yang Anda butuhkan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Kontak & Jam Layanan (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Informasi Kontak Resmi
            </h2>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">
                    Alamat Sekolah
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {SCHOOL_INFO.address}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Kode Pos: {SCHOOL_INFO.postalCode}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">
                    Telepon Kantor
                  </span>
                  <a
                    href={`tel:${SCHOOL_INFO.phone.replace(/[^0-9]/g, '')}`}
                    className="font-semibold text-[#0E4A6B] dark:text-[#E5A823] hover:underline"
                  >
                    {SCHOOL_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">
                    Surat Elektronik (Email)
                  </span>
                  <a
                    href={`mailto:${SCHOOL_INFO.email}`}
                    className="font-semibold text-[#0E4A6B] dark:text-[#E5A823] hover:underline"
                  >
                    {SCHOOL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">
                    Jam Layanan Tata Usaha
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Senin - Kamis: 07.00 - 15.30 WIB
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Jumat: 07.00 - 11.30 WIB
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={SCHOOL_INFO.socialMedia.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#0E4A6B] dark:border-[#E5A823] text-[#0E4A6B] dark:text-[#E5A823] hover:bg-[#0E4A6B] hover:text-white dark:hover:bg-[#E5A823] dark:hover:text-slate-950 font-bold text-xs transition-colors"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Formulir Pesan (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Kirim Pesan atau Pertanyaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Silakan isi formulir di bawah ini. Tim administrasi sekolah akan membalas melalui email Anda.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Terima kasih telah menghubungi SMP Negeri 1 Tambak. Kami akan segera menindaklanjuti pesan Anda.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama Anda..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]"
                  />
                </div>
              </div>

              {/* Subjek */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Subjek / Kategori Pesan
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]"
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="Informasi SPMB">Informasi Penerimaan Siswa Baru (SPMB)</option>
                  <option value="Administrasi & Nilai">Layanan Administrasi / Legalisir Ijazah</option>
                  <option value="Akademik & E-Learning">Bantuan Akun E-Learning Pijar</option>
                  <option value="Komite & Paguyuban">Paguyuban Wali Murid</option>
                  <option value="Lainnya">Lainnya / Umum</option>
                </select>
              </div>

              {/* Pesan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Pesan Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan, masukan, atau informasi yang Anda butuhkan..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0E4A6B] hover:bg-[#0a3550] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Mengirimkan...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Embed Google Maps Card */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Peta Lokasi SMP Negeri 1 Tambak
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desa Kamulyan, Kecamatan Tambak, Kabupaten Banyumas, Jawa Tengah
            </p>
          </div>
          <a
            href={SCHOOL_INFO.socialMedia.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors self-start sm:self-auto"
          >
            <span>Buka Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Interactive Map */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
          <iframe
            src="https://maps.google.com/maps?q=SMP%20Negeri%201%20Tambak%20Banyumas&t=&z=15&ie=UTF8&iwloc=&output=embed"
            title="Lokasi SMP Negeri 1 Tambak di Google Maps"
            loading="lazy"
            className="w-full h-full border-0"
          />
        </div>
      </section>
    </div>
  );
};
