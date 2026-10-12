import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface FooterProps {
  onNavigate: (pageId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A3550] dark:bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 3 Column Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Kolom 1: Identitas Sekolah (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#E5A823]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {SCHOOL_INFO.name}
                </h3>
                <p className="text-xs text-[#E5A823] font-medium tracking-wide">
                  "{SCHOOL_INFO.slogan}"
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              SMP Negeri 1 Tambak merupakan Satuan Pendidikan Pelaksana Program Sekolah Penggerak di
              Kabupaten Banyumas. Kami berkomitmen menyelenggarakan pendidikan bermutu berbasis
              karakter dan transformasi digital.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#E5A823]" />
              <span>Akreditasi {SCHOOL_INFO.akreditasi} · NPSN: {SCHOOL_INFO.npsn}</span>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Beranda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profil')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Profil & Sejarah Sekolah</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('visi-misi')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Visi dan Misi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('galeri-foto')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Galeri Dokumentasi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('e-learning')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Portal E-Learning Pijar</span>
                </button>
              </li>
              <li>
                <a
                  href="https://sim.pijarsekolah.id/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pijar Guru (SIM)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://siswa.pijarsekolah.id/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pijar Siswa</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hubungi-kami')}
                  className="hover:text-[#E5A823] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hubungi Kami</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Media Sosial (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Kontak & Layanan
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E5A823] flex-shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#E5A823] flex-shrink-0" />
                <a
                  href={`tel:${SCHOOL_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="hover:text-white hover:underline transition-colors"
                >
                  {SCHOOL_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#E5A823] flex-shrink-0" />
                <a
                  href={`mailto:${SCHOOL_INFO.email}`}
                  className="hover:text-white hover:underline transition-colors"
                >
                  {SCHOOL_INFO.email}
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Ikuti Media Sosial Resmi:
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={SCHOOL_INFO.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram SMP Negeri 1 Tambak"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E5A823] hover:text-slate-950 text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={SCHOOL_INFO.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube SMP Negeri 1 Tambak"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E5A823] hover:text-slate-950 text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                <a
                  href={SCHOOL_INFO.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook SMP Negeri 1 Tambak"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E5A823] hover:text-slate-950 text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Credit Bar */}
      <div className="border-t border-white/10 bg-[#072437] dark:bg-black/40 py-4 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span>{SCHOOL_INFO.copyright}</span>
          </div>
          <div>
            <span className="opacity-90">{SCHOOL_INFO.poweredBy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
