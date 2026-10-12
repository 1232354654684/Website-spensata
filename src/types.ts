export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  author: string;
  views: number;
  commentsCount?: number;
  category: string;
  tags: string[];
  coverImage: string;
  originalUrl?: string;
  isPopular?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  youtubeUrl: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface ArchiveMonth {
  key: string;
  name: string;
  year: number;
  count: number;
}
