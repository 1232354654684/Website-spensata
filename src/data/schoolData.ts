import { Article, GalleryItem, VideoItem, HeroSlide, ArchiveMonth } from '../types';

/**
 * ============================================================================
 * SMP NEGERI 1 TAMBAK (BANYUMAS, JAWA TENGAH)
 * File Konfigurasi Data Sekolah
 * 
 * CATATAN PENGEMBANG:
 * Bagian yang ditandai dengan [GANTI DENGAN DATA ASLI] dapat diperbarui
 * langsung dengan data resmi dari pihak administrasi SMP Negeri 1 Tambak.
 * ============================================================================
 */

export const SCHOOL_INFO = {
  name: 'SMP Negeri 1 Tambak',
  shortName: 'SPENSATA',
  slogan: 'Berkarakter Kuat Berprestasi Hebat',
  address: 'Jl. Watuagung Desa Kamulyan Kecamatan Tambak, Banyumas, Jawa Tengah',
  postalCode: '53196',
  phone: '(0287) 472657',
  email: 'info@spensata.sch.id',
  website: 'https://spensata.sch.id',
  program: 'Sekolah Penggerak (Digitalisasi Pendidikan)',
  
  // [GANTI DENGAN DATA ASLI]: Data identitas formal sekolah
  npsn: '20301726',
  akreditasi: 'A (Unggul)',
  statusSekolah: 'Negeri',
  waktuBelajar: 'Senin - Jumat (07.00 - 15.30 WIB)',
  
  headmaster: {
    name: 'Sad Diana Puji Hartono, S.Pd., M.Si.',
    role: 'Kepala Sekolah',
    nip: '19700512 199802 1 004',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    welcomeShort:
      'Selamat datang di website resmi SMP Negeri 1 Tambak! Sebagai Sekolah Penggerak di bidang digitalisasi pendidikan, kami hadir dengan komitmen menghadirkan ekosistem pembelajaran yang adaptif, berintegritas, dan mencetak generasi unggul.',
    welcomeSpeech: [
      'Puji syukur kehadirat Allah SWT atas rahmat dan karunia-Nya, website resmi SMP Negeri 1 Tambak kini hadir dalam wajah baru yang lebih modern, cepat, dan transparan bagi seluruh civitas akademika serta masyarakat umum.',
      'Sebagai salah satu Sekolah Penggerak di Kabupaten Banyumas, SMP Negeri 1 Tambak terus berinovasi mengintegrasikan teknologi informasi ke dalam seluruh proses belajar mengajar, administrasi, dan layanan kesiswaan melalui platform terpadu seperti Pijar Sekolah dan aplikasi SPECTRA.',
      'Sesuai dengan semboyan kami, "Berkarakter Kuat Berprestasi Hebat", kami tidak hanya membekali peserta didik dengan kecakapan akademik, namun juga menanamkan nilai-nilai Profil Pelajar Pancasila, budi pekerti luhur, kemandirian, dan semangat gotong royong.',
      'Kami mengundang seluruh orang tua wali, alumni, dan pemangku kepentingan untuk bersinergi bersama memajukan pendidikan generasi penerus bangsa.'
    ]
  },

  socialMedia: {
    instagram: 'https://www.instagram.com/smpn1.tambak/',
    youtube: 'https://www.youtube.com/@spensata',
    facebook: 'https://www.facebook.com/SMPNegeri1TambakBanyumas/?locale=id_ID',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=SMP+Negeri+1+Tambak+Banyumas'
  },

  copyright: 'Copyright © 2020 - 2026 SMP NEGERI 1 TAMBAK. All rights reserved.',
  poweredBy: 'Powered by sekolahku.web.id'
};

// ============================================================================
// [GANTI DENGAN DATA ASLI]: ANGKA STATISTIK "SEKOLAH DALAM ANGKA"
// Angka berikut merupakan placeholder contoh dari data yang dilampirkan.
// ============================================================================
export const SCHOOL_STATS = [
  {
    id: 'students',
    value: 856,
    label: 'Peserta Didik Aktif',
    sublabel: 'Kelas VII, VIII, dan IX',
    unit: 'Siswa'
  },
  {
    id: 'staff',
    value: 52,
    label: 'Guru & Tenaga Kependidikan',
    sublabel: 'Pendidik Profesional Bersertifikasi',
    unit: 'GTK'
  },
  {
    id: 'classes',
    value: 27,
    label: 'Rombongan Belajar',
    sublabel: 'Ruang Kelas Representatif',
    unit: 'Rombel'
  },
  {
    id: 'extracurricular',
    value: 14,
    label: 'Ekstrakurikuler Aktif',
    sublabel: 'Wadah Bakat, Olahraga & Seni',
    unit: 'Ekskul'
  }
];

// ============================================================================
// [GANTI DENGAN DATA ASLI]: SLIDER BANNER BERANDA
// ============================================================================
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Berkarakter Kuat, Berprestasi Hebat',
    subtitle: 'Membentuk Generasi Pelajar Pancasila yang Unggul dalam Akademik, Tangguh dalam Kepribadian, dan Siap Bersaing Global.',
    badge: 'Sekolah Penggerak Banyumas',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    primaryCtaText: 'Profil Sekolah',
    primaryCtaLink: '#profil',
    secondaryCtaText: 'Hubungi Kami',
    secondaryCtaLink: '#hubungi-kami'
  },
  {
    id: 'slide-2',
    title: 'Transformasi Digital Pembelajaran',
    subtitle: 'Implementasi Kurikulum Merdeka dan Sistem Manajemen Terpadu melalui E-Learning Pijar Sekolah & Aplikasi SPECTRA.',
    badge: 'Digitalisasi Pendidikan',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    primaryCtaText: 'Portal E-Learning',
    primaryCtaLink: '#e-learning',
    secondaryCtaText: 'Visi & Misi',
    secondaryCtaLink: '#visi-misi'
  },
  {
    id: 'slide-3',
    title: 'Pengembangan Bakat & Minat Siswa',
    subtitle: 'Didukung oleh 14 kegiatan ekstrakurikuler unggulan, mulai dari Pramuka Berprestasi, Olahraga, Kesenian Tradisional, hingga Riset Remaja.',
    badge: 'Prestasi & Ekstrakurikuler',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop',
    primaryCtaText: 'Galeri Kegiatan',
    primaryCtaLink: '#galeri-foto',
    secondaryCtaText: 'Profil Sekolah',
    secondaryCtaLink: '#profil'
  }
];

// ============================================================================
// [GANTI DENGAN DATA ASLI]: VISI, MISI, DAN SEJARAH SEKOLAH
// ============================================================================
export const SCHOOL_VISION_MISSION = {
  visi: 'Terwujudnya Lulusan yang Beriman dan Bertakwa, Berkarakter Kuat, Berprestasi Hebat, Berwawasan Lingkungan, serta Terdepan dalam Pemanfaatan Teknologi Digital.',
  visiIndikator: [
    'Terwujudnya penghayatan dan pengamalan nilai-nilai keagamaan dalam kehidupan sehari-hari.',
    'Terbentuknya kepribadian siswa yang berintegritas, mandiri, kritis, dan bergotong royong.',
    'Tercapainya prestasi akademik dan non-akademik di tingkat kabupaten, provinsi, dan nasional.',
    'Terwujudnya lingkungan sekolah yang asri, bersih, sehat, dan ramah anak.',
    'Terlaksananya pembelajaran aktif berbasis digital dan literasi teknologi terpadu.'
  ],
  misi: [
    'Menyelenggarakan kegiatan keagamaan dan pembiasaan ibadah untuk mempertebal keimanan dan ketakwaan peserta didik.',
    'Menerapkan Kurikulum Merdeka dengan pembelajaran berdiferensiasi dan berpusat pada murid.',
    'Mengembangkan potensi, minat, dan bakat siswa secara optimal melalui bimbingan intensif dan ragam ekstrakurikuler.',
    'Memperkuat budaya literasi, numerasi, dan kecakapan digital di seluruh lingkungan satuan pendidikan.',
    'Meningkatkan kompetensi profesional guru dan tenaga kependidikan dalam integrasi teknologi pendidikan masa kini.',
    'Mewujudkan tata kelola sekolah yang transparan, akuntabel, dan mengutamakan pelayanan prima kepada masyarakat.',
    'Membangun jejaring kolaborasi harmonis dengan komite sekolah, paguyuban orang tua, alumni, dan institusi mitra.'
  ],
  tujuan: [
    'Meningkatkan rerata capaian asesmen kompetensi minimum (AKM) siswa di bidang literasi dan numerasi.',
    'Meluluskan 100% peserta didik dengan predikat karakter baik dan terserap di jenjang pendidikan menengah favorit.',
    'Meraih kejuaraan di ajang FTBI (Festival Tunas Bahasa Ibu), O2SN, FLS2N, dan Lomba Tingkat Pramuka.',
    'Mengimplementasikan 100% tata kelola administrasi dan penilaian berbasis digital terintegrasi.'
  ],
  sejarah: {
    npsn: '20301726',
    tahunBerdiri: '1979',
    skPendirian: '030/U/1979',
    akreditasi: 'A (Amat Baik) dengan Nilai 93',
    luasTanah: '12.450 m²',
    uraian: [
      'SMP Negeri 1 Tambak didirikan sebagai wujud komitmen pemerintah dalam memperluas akses pendidikan berkualitas bagi masyarakat di wilayah Banyumas bagian timur, khususnya Kecamatan Tambak dan sekitarnya.',
      'Sejak berdiri, sekolah ini terus mengalami perkembangan pesat dari segi sarana fisik, kualitas tenaga pendidik, maupun prestasi siswa di berbagai bidang. Berlokasi strategis di Jl. Watuagung Desa Kamulyan, kampus sekolah memiliki lingkungan belajar yang nyaman, asri, dan representatif.',
      'Pada era modern, SMP Negeri 1 Tambak terpilih menjadi salah satu Satuan Pendidikan Pelaksana Program Sekolah Penggerak. Sekolah memelopori integrasi digital dalam pembelajaran dan administrasi sekolah melalui sistem e-learning Pijar Sekolah serta pemanfaatan aplikasi SPECTRA, menjadikannya salah satu sekolah rujukan di Kabupaten Banyumas.'
    ]
  },
  saranaPrasarana: [
    { nama: 'Laboratorium Komputer & TIK', jumlah: '3 Ruang Modern (Full AC & Internet Fiber)' },
    { nama: 'Laboratorium IPA', jumlah: '1 Laboratorium Lengkap Standar Nasional' },
    { nama: 'Perpustakaan Digital & Konvensional', jumlah: '1 Gedung Koleksi Lengkap & E-Book' },
    { nama: 'Lapangan Olahraga Multifungsi', jumlah: 'Basket, Voli, Futsal, dan Atletik' },
    { nama: 'Mushola Nurul Ilmi', jumlah: 'Kapasitas 400 Jamaah untuk Sholat Berjamaah' },
    { nama: 'Ruang Keterampilan & Seni Budaya', jumlah: 'Peralatan Karawitan & Sanggar Musik' },
    { nama: 'UKS dan Ruang Konseling BK', jumlah: 'Pelayanan Kesehatan Siswa Terpadu' },
    { nama: 'Kantin Sehat & Ramah Lingkungan', jumlah: 'Sertifikasi Higienitas Dinkes' }
  ]
};

// ============================================================================
// DATA ARTIKEL DAN BERITA SEKOLAH (DARI LAMPIRAN HTML RESMI)
// ============================================================================
export const ARTICLES: Article[] = [
  {
    id: 'post-59',
    slug: 'maklumat-pelayanan-smp-negeri-1-tambak',
    title: 'Maklumat Pelayanan SMP Negeri 1 Tambak',
    excerpt: 'Maklumat Pelayanan SMP Negeri 1 Tambak merupakan pernyataan komitmen sekolah dalam memberikan pelayanan publik yang profesional, cepat, tepat, transparan dan akuntabel kepada seluruh pemangku kepentingan.',
    content: [
      'Maklumat Pelayanan SMP Negeri 1 Tambak merupakan pernyataan kesanggupan dan komitmen segenap pimpinan, tenaga pendidik, dan tenaga kependidikan dalam memberikan pelayanan publik yang prima sesuai standar operasional prosedur yang telah ditetapkan.',
      'Kami berkomitmen memberikan pelayanan pendidikan, administrasi kesiswaan, legalisasi dokumen, serta konsultasi wali murid secara profesional, ramah, bebas dari pungutan liar, dan tepat waktu.',
      'Apabila dalam penyelenggaraan pelayanan terdapat ketidaksesuaian atau keluhan, masyarakat dapat menyampaikan pengaduan resmi melalui meja pengaduan terpadu di kantor tata usaha sekolah maupun melalui kanal kontak daring di website ini.'
    ],
    date: '24/07/2026 09:19',
    author: 'Vira Trianna Putri, S.Kom',
    views: 91,
    category: 'Maklumat & Pelayanan',
    tags: ['#spensata', '#sekilas-info'],
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/59/maklumat-pelayanan-smp-negeri-1-tambak'
  },
  {
    id: 'post-58',
    slug: 'smp-negeri-1-tambak-gelar-workshop-optimalisasi-manajemen-sekolah-terintegrasi-melalui-pemanfaatan-aplikasi-spectra',
    title: 'SMP Negeri 1 Tambak Gelar Workshop Optimalisasi Manajemen Sekolah Terintegrasi melalui Pemanfaatan Aplikasi SPECTRA',
    excerpt: 'Dalam rangka meningkatkan kualitas tata kelola dan manajemen sekolah berbasis teknologi digital, SMP Negeri 1 Tambak melaksanakan kegiatan Workshop Optimalisasi Manajemen Sekolah Terintegrasi melalui pemanfaatan aplikasi SPECTRA.',
    content: [
      'Dalam rangka meningkatkan kualitas tata kelola dan manajemen sekolah berbasis teknologi digital, SMP Negeri 1 Tambak menyelenggarakan Workshop Optimalisasi Manajemen Sekolah Terintegrasi yang berfokus pada pemanfaatan aplikasi SPECTRA.',
      'Kegiatan workshop dibuka secara langsung oleh Kepala Sekolah, Bapak Sad Diana Puji Hartono, S.Pd., M.Si., dan diikuti oleh seluruh jajaran dewan guru serta staf tata usaha. Aplikasi SPECTRA dirancang untuk mempermudah monitoring perkembangan belajar siswa, manajemen presensi daring, pencatatan capaian akademik, dan integrasi modul asesmen Kurikulum Merdeka.',
      'Melalui pelatihan intensif ini, diharapkan seluruh tenaga pendidik semakin cakap dalam mengoperasikan platform digital sehingga administrasi kelas menjadi semakin efisien dan waktu guru lebih banyak terfokus pada pendampingan murid.'
    ],
    date: '22/07/2026 09:46',
    author: 'Vira Trianna Putri, S.Kom',
    views: 113,
    category: 'Akademik & Teknologi',
    tags: ['#spensata', '#sekilas-info', '#TKAD'],
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/58/smp-negeri-1-tambak-gelar-workshop-optimalisasi-manajemen-sekolah-terintegrasi-melalui-pemanfaatan-aplikasi-spectra'
  },
  {
    id: 'post-57',
    slug: 'smp-negeri-1-tambak-sukses-melaksanakan-rangkaian-seleksi-penerimaan-murid-baru-tahun-2026',
    title: 'SMP Negeri 1 Tambak Sukses Melaksanakan Rangkaian Seleksi Penerimaan Murid Baru Tahun 2026',
    excerpt: 'SMP Negeri 1 Tambak kembali melaksanakan rangkaian kegiatan Seleksi Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2026/2027. Kegiatan ini dilaksanakan sebagai bagian dari pemenuhan hak belajar anak secara transparan dan berkeadilan.',
    content: [
      'SMP Negeri 1 Tambak kembali sukses merampungkan seluruh tahapan Seleksi Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2026/2027 secara lancar, tertib, dan transparan.',
      'Proses pendaftaran mengakomodasi berbagai jalur, meliputi jalur zonasi, jalur afirmasi, jalur perpindahan tugas orang tua, serta jalur prestasi akademik dan non-akademik.',
      'Antusiasme pendaftar dari sekolah dasar di wilayah Tambak dan kecamatan sekitar sangat tinggi. Panitia SPMB memastikan seluruh proses verifikasi berkas dan pengumuman hasil seleksi dilakukan secara akurat demi menjamin keadilan bagi seluruh calon murid.'
    ],
    date: '22/07/2026 09:22',
    author: 'Vira Trianna Putri, S.Kom',
    views: 106,
    category: 'Kesiswaan & SPMB',
    tags: ['#spensata', '#sekilas-info'],
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/57/smp-negeri-1-tambak-sukses-melaksanakan-rangkaian-seleksi-penerimaan-murid-baru-tahun-2026'
  },
  {
    id: 'post-56',
    slug: 'pengumuman-dan-pelepasan-siswa-kelas-ix-smp-negeri-1-tambak-tahun-pelajaran-20252026',
    title: 'Pengumuman dan Pelepasan Siswa Kelas IX SMP Negeri 1 Tambak Tahun Pelajaran 2025/2026',
    excerpt: 'SMP Negeri 1 Tambak melaksanakan kegiatan Pengumuman dan Pelepasan Siswa Kelas IX Tahun Pelajaran 2025/2026. Kegiatan berlangsung dengan penuh haru dan kebanggaan atas kelulusan seluruh siswa.',
    content: [
      'SMP Negeri 1 Tambak menggelar agenda Pelepasan Siswa Kelas IX Tahun Pelajaran 2025/2026 yang dihadiri oleh jajaran komite sekolah, dewan guru, orang tua murid, dan tokoh masyarakat setempat.',
      'Suasana khidmat dan penuh haru menyelimuti saat pengumuman kelulusan 100% dibacakan. Kepala sekolah menyampaikan apresiasi setinggi-tingginya kepada para siswa yang telah berjuang dan menorehkan prestasi membanggakan selama tiga tahun menuntut ilmu di SPENSATA.',
      'Acara dimeriahkan dengan penampilan seni tari tradisional, paduan suara siswa, serta pengalungan medali kelulusan bagi para wisudawan.'
    ],
    date: '22/07/2026 09:12',
    author: 'Vira Trianna Putri, S.Kom',
    views: 76,
    category: 'Kegiatan Sekolah',
    tags: ['#spensata', '#sekilas-info'],
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/56/pengumuman-dan-pelepasan-siswa-kelas-ix-smp-negeri-1-tambak-tahun-pelajaran-20252026'
  },
  {
    id: 'post-55',
    slug: 'rapat-paguyuban-wali-murid-kelas-8-dan-sosialisasi-pencegahan-penyalahgunaan-narkoba-bersama-bnn',
    title: 'Rapat Paguyuban Wali Murid Kelas 8 dan Sosialisasi Pencegahan Penyalahgunaan Narkoba Bersama BNN',
    excerpt: 'SMP Negeri 1 Tambak melaksanakan kegiatan Rapat Paguyuban Wali Murid Kelas 8 yang dirangkaikan dengan sosialisasi pencegahan bahaya narkoba bersama BNN Kabupaten Banyumas.',
    content: [
      'SMP Negeri 1 Tambak menggelar pertemuan akbar Paguyuban Wali Murid Kelas 8 yang dirangkaikan dengan seminar sosialisasi pencegahan bahaya penyalahgunaan narkotika bersama Badan Narkotika Nasional (BNN) Kabupaten Banyumas.',
      'Kegiatan ini bertujuan mempererat komunikasi antara pihak sekolah dan orang tua dalam memantau tumbuh kembang remaja, membentengi generasi muda dari pengaruh negatif pergaulan bebas, dan menciptakan lingkungan sekolah yang sehat tanpa narkoba.',
      'Orang tua menyambut positif paparan narasumber BNN dan berkomitmen aktif mendukung program-program pembinaan karakter yang dicanangkan pihak sekolah.'
    ],
    date: '22/07/2026 08:55',
    author: 'Vira Trianna Putri, S.Kom',
    views: 104,
    category: 'Paguyuban & Parenting',
    tags: ['#spensata', '#kesehatan', '#sekilas-info'],
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/55/rapat-paguyuban-wali-murid-kelas-8-dan-sosialisasi-pencegahan-penyalahgunaan-narkoba-bersama-bnn'
  },
  {
    id: 'post-31',
    slug: 'paguyuban-bersemarak-kemerdekaan-dari-smp-negeri-1-tambak',
    title: 'Paguyuban Bersemarak Kemerdekaan dari SMP Negeri 1 Tambak',
    excerpt: 'Semarak perayaan HUT Kemerdekaan Republik Indonesia di SMP Negeri 1 Tambak berlangsung meriah dengan partisipasi aktif paguyuban orang tua, siswa, dan dewan guru dalam berbagai lomba kebersamaan.',
    content: [
      'Menyambut peringatan Hari Ulang Tahun Kemerdekaan Republik Indonesia, SMP Negeri 1 Tambak menggelar festival semarak kemerdekaan yang digerakkan bersama oleh Paguyuban Wali Murid dan Pengurus OSIS.',
      'Berbagai perlombaan edukatif dan tradisional digelar, mulai dari pawai kostum nusantara, lomba kreasi tumpeng kemerdekaan, tarik tambang persaudaraan, hingga pertandingan olahraga gembira antar kelas.',
      'Kebersamaan yang terjalin erat membuktikan bahwa kemitraan tripusat pendidikan—sekolah, keluarga, dan masyarakat—di SMP Negeri 1 Tambak berjalan solid dan harmonis.'
    ],
    date: '12/08/2025 18:22',
    author: 'Vira Trianna Putri, S.Kom',
    views: 281,
    category: 'Kegiatan & Paguyuban',
    tags: ['#spensata', '#kelaskhususolahraga', '#sekilas-info'],
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop',
    originalUrl: 'https://spensata.sch.id/read/31/paguyuban-bersemarak-kemerdekaan-dari-smp-negeri-1-tambak',
    isPopular: true
  }
];

// ============================================================================
// DATA GALERI FOTO (JUDUL WAJIB SESUAI LAMPIRAN)
// ============================================================================
export const PHOTO_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Workshop Aplikasi SPECTRA',
    description: 'Pelatihan dewan guru dan tenaga kependidikan mengenai sistem tata kelola manajemen sekolah digital berbasis platform SPECTRA.',
    date: 'Juli 2026',
    category: 'Akademik',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gal-2',
    title: 'Seleksi Penerimaan Murid Baru 2026',
    description: 'Rangkaian verifikasi berkas, pelayanan ramah panitia, dan orientasi calon peserta didik baru tahun ajaran 2026/2027.',
    date: 'Juli 2026',
    category: 'Kesiswaan',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gal-3',
    title: 'Pelepasan Siswa Kelas IX',
    description: 'Prosesi wisuda dan pelepasan kelulusan angkatan kelas IX dengan pengalungan samir dan pementasan seni tradisi.',
    date: 'Juni 2026',
    category: 'Wisuda',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gal-4',
    title: 'Rapat Paguyuban Wali Murid dan Sosialisasi BNN',
    description: 'Pertemuan sinergis orang tua siswa dan penyuluhan edukasi pencegahan narkoba bersama narasumber BNN Kabupaten Banyumas.',
    date: 'Juli 2026',
    category: 'Paguyuban',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gal-5',
    title: 'Paguyuban Bersemarak Kemerdekaan',
    description: 'Karnaval budaya dan festival lomba gembira memperingati HUT Kemerdekaan Republik Indonesia bersama keluarga besar SPENSATA.',
    date: 'Agustus 2025',
    category: 'Kebangsaan',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gal-6',
    title: 'Kegiatan Pramuka',
    description: 'Latihan baris-berbaris tongkat (PBB Tongkat), perkemahan sabtu minggu, dan penempaan jiwa kepemimpinan dasa darma.',
    date: 'Mei 2026',
    category: 'Ekstrakurikuler',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop'
  }
];

// ============================================================================
// DATA GALERI VIDEO (SESUAI LAMPIRAN YOUTUBE SPENSATA)
// ============================================================================
export const VIDEO_GALLERY: VideoItem[] = [
  {
    id: 'vid-1',
    youtubeId: 'TosdustSLFg',
    title: 'Profil dan Semarak Aktivitas SMP Negeri 1 Tambak',
    description: 'Dokumentasi visual lingkungan sekolah, fasilitas laboratorium digital, dan dinamika pembelajaran aktif peserta didik.',
    date: '2026',
    duration: '04:15',
    youtubeUrl: 'https://www.youtube.com/watch?v=TosdustSLFg',
    thumbnailUrl: 'https://img.youtube.com/vi/TosdustSLFg/hqdefault.jpg'
  },
  {
    id: 'vid-2',
    youtubeId: 'eD3bW3zsxjY',
    title: 'Gelar Karya P5 & Pentas Kreasi Siswa SPENSATA',
    description: 'Pameran proyek penguatan profil pelajar pancasila serta penampilan bakat seni dan budaya siswa SMP Negeri 1 Tambak.',
    date: '2026',
    duration: '05:40',
    youtubeUrl: 'https://www.youtube.com/watch?v=eD3bW3zsxjY',
    thumbnailUrl: 'https://img.youtube.com/vi/eD3bW3zsxjY/hqdefault.jpg'
  },
  {
    id: 'vid-3',
    youtubeId: 'kJQP7kiw5Fk', // [GANTI DENGAN DATA ASLI]: Video contoh
    title: 'Latihan PBB Tongkat & Kemah Bakti Pramuka SPENSATA',
    description: 'Dokumentasi ketangkasan baris-berbaris tongkat dan pembinaan karakter kepramukaan pangkalan SMP Negeri 1 Tambak.',
    date: '2026',
    duration: '03:30',
    youtubeUrl: 'https://www.youtube.com/@spensata',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop',
    isSample: true
  }
];

// ============================================================================
// DATA ARSIP TAHUN 2026 (SESUAI LAMPIRAN)
// ============================================================================
export const ARCHIVES_2026: ArchiveMonth[] = [
  { key: '2026-07', name: 'Juli', year: 2026, count: 12 },
  { key: '2026-01', name: 'Januari', year: 2026, count: 7 }
];

// ============================================================================
// TAGS RESMI
// ============================================================================
export const TAGS = [
  '#spensata',
  '#FTBI',
  '#sekilas-info',
  '#wcd',
  '#TKAD',
  '#kesehatan',
  '#pramukaspensata',
  '#kelaskhususolahraga',
  '#spensataberbagizakat',
  '#pbbtongkat'
];

// ============================================================================
// PORTAL E-LEARNING RESMI
// ============================================================================
export const E_LEARNING_PORTALS = {
  guru: {
    name: 'Pijar Guru (SIM Sekolah)',
    targetUrl: 'https://sim.pijarsekolah.id/login',
    description: 'Portal bagi bapak/ibu pendidik untuk pengelolaan modul ajar digital, input nilai rapor kurikulum merdeka, presensi harian, dan monitoring tugas siswa.',
    badge: 'Akses Pendidik & Tenaga Kependidikan',
    features: [
      'Manajemen RPP / Modul Ajar Digital',
      'Bank Soal dan Pembuatan Asesmen Online',
      'Input Capaian Pembelajaran & Nilai Rapor',
      'Presensi Kehadiran Siswa Real-time'
    ]
  },
  siswa: {
    name: 'Pijar Siswa',
    targetUrl: 'https://siswa.pijarsekolah.id/login',
    description: 'Platform belajar daring bagi peserta didik SPENSATA untuk mengakses materi interaktif, mengerjakan penugasan, mengikuti kuis, dan melihat evaluasi belajar.',
    badge: 'Akses Peserta Didik',
    features: [
      'Akses Materi & Modul Pelajaran Kapan Saja',
      'Pengerjaan Tugas & Ulangan Harian Daring',
      'Jadwal Pelajaran & Kalender Akademik',
      'Riwayat Nilai & Evaluasi Pembelajaran Mandiri'
    ]
  }
};
