/**
 * Helper utility for creating clean, URL-safe slugs for news and articles.
 *
 * Rules:
 * - Lowercase
 * - Remove accents / diacritics
 * - Replace all non-alphanumeric characters with a single hyphen (-)
 * - Trim hyphens from start and end
 * - Maximum length 80 characters (cleanly trimmed)
 * - Unique slug generation with -2, -3, ... suffix when collisions occur
 */

export function generateSlug(title: string): string {
  if (!title) return '';

  const cleaned = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric to hyphen
    .replace(/^-+|-+$/g, '') // trim hyphens
    .slice(0, 80) // max 80 chars
    .replace(/-+$/, ''); // clean trailing hyphen if cut in middle

  return cleaned || 'berita';
}

export function generateUniqueSlug(
  title: string,
  existingSlugs: string[] = [],
  currentSlug?: string
): string {
  // If currentSlug is already provided and valid, prioritize keeping it
  if (currentSlug && currentSlug.trim()) {
    return currentSlug.trim();
  }

  const base = generateSlug(title);
  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}
