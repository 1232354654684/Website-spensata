export interface SchoolIdentity {
  nama: string;
  singkatan: string;
  slogan: string;
  alamat: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  program: string;
  npsn: string;
  statusSekolah: string;
  akreditasi: string;
  waktuBelajar: string;
  copyright: string;
  poweredBy: string;
}

export interface Headmaster {
  nama: string;
  jabatan: string;
  nip: string;
  foto: string;
  sambutanSingkat: string;
  sambutanLengkap: string[];
}

export interface SocialMedia {
  instagram: string;
  youtube: string;
  facebook: string;
  tautanPeta: string;
}

export interface VisiMisi {
  visi: string;
  indikatorVisi: string[];
  misi: string[];
  tujuan: string[];
}

export interface Sejarah {
  tahunBerdiri: string;
  nomorSkPendirian: string;
  luasTanah: string;
  uraian: string[];
}

export interface SaranaItem {
  id: string;
  nama: string;
  keterangan: string;
  foto?: string;
  urutan?: number;
}

export interface ELearningPortalItem {
  nama: string;
  tautan: string;
  deskripsi: string;
  label: string;
  fitur: string[];
}

export interface ELearningData {
  guru: ELearningPortalItem;
  siswa: ELearningPortalItem;
}

export interface StatistikItem {
  id: string;
  nilai: number;
  label: string;
  sublabel: string;
  satuan: string;
  urutan?: number;
}

export interface HeroSlideItem {
  id: string;
  judul: string;
  subjudul: string;
  badge?: string;
  gambar: string;
  teksTombolUtama?: string;
  tautanTombolUtama?: string;
  teksTombolKedua?: string;
  tautanTombolKedua?: string;
  urutan?: number;
}

export interface BeritaItem {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string[];
  tanggal: string;
  penulis: string;
  kategori: string;
  tag: string[];
  fotoSampul: string;
  tautanAsli?: string;
  tandaiPopuler?: boolean;
  status: 'Terbit' | 'Draft';
  views?: number;
}

export interface GaleriFotoItem {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  kategori: string;
  foto: string;
  urutan?: number;
}

export interface GaleriVideoItem {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  durasi: string;
  tautanYouTube: string;
  urutan?: number;
}

export interface GaleriAlbumItem {
  id: string;
  judul: string;
  tanggal: string;
  deskripsi?: string;
  linkAlbum: string;
  linkSampul?: string;
  daftarFoto?: string[];
  dibuatPada?: number | string | any;
}

// Aliases for legacy component compatibility where needed
export type Article = BeritaItem;
export type GalleryItem = GaleriFotoItem;
export type VideoItem = GaleriVideoItem;
export type HeroSlide = HeroSlideItem;

export interface ArchiveMonth {
  key: string;
  name: string;
  year: number;
  count: number;
}

export interface SchoolStoreData {
  identitas: SchoolIdentity;
  kepalaSekolah: Headmaster;
  mediaSosial: SocialMedia;
  visiMisi: VisiMisi;
  sejarah: Sejarah;
  elearning: ELearningData;
  sarana: SaranaItem[];
  statistik: StatistikItem[];
  heroSlides: HeroSlideItem[];
  berita: BeritaItem[];
  galeriFoto: GaleriFotoItem[];
  galeriVideo: GaleriVideoItem[];
  galeri: GaleriAlbumItem[];
}
