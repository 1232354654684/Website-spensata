import rawSeedData from '../../seed-data.json';

/**
 * Helper to parse any representation of a date (string, timestamp, Date object, Firestore Timestamp)
 * into a millisecond epoch timestamp.
 */
export function parseAnyToTimestamp(val: any): number {
  if (val === null || val === undefined || val === '') {
    return 0;
  }

  // 1. JavaScript Date object
  if (val instanceof Date) {
    const time = val.getTime();
    return isNaN(time) ? 0 : time;
  }

  // 2. Numeric timestamp (milliseconds or seconds)
  if (typeof val === 'number') {
    if (isNaN(val) || val <= 0) return 0;
    // If greater than 10^11, it is already milliseconds (e.g. 1729500000000)
    if (val > 100000000000) return val;
    // If between 10^9 and 10^11, it is likely seconds
    if (val > 1000000000) return val * 1000;
    return val;
  }

  // 3. Firestore Timestamp object
  if (typeof val === 'object') {
    if (typeof val.toMillis === 'function') {
      try {
        return val.toMillis();
      } catch {
        // ignore
      }
    }
    if (typeof val.toDate === 'function') {
      try {
        return val.toDate().getTime();
      } catch {
        // ignore
      }
    }
    if (typeof val.seconds === 'number') {
      const nanos = typeof val.nanoseconds === 'number' ? Math.floor(val.nanoseconds / 1000000) : 0;
      return val.seconds * 1000 + nanos;
    }
  }

  // 4. String parsing
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return 0;

    // Pattern 4A: ISO format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const isoMatch = trimmed.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
    );
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const hour = isoMatch[4] ? parseInt(isoMatch[4], 10) : 0;
      const min = isoMatch[5] ? parseInt(isoMatch[5], 10) : 0;
      const sec = isoMatch[6] ? parseInt(isoMatch[6], 10) : 0;
      return new Date(year, month, day, hour, min, sec).getTime();
    }

    // Pattern 4B: Slash format DD/MM/YYYY or DD/MM/YYYY HH:mm
    const slashMatch = trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
    );
    if (slashMatch) {
      const day = parseInt(slashMatch[1], 10);
      const month = parseInt(slashMatch[2], 10) - 1;
      const year = parseInt(slashMatch[3], 10);
      const hour = slashMatch[4] ? parseInt(slashMatch[4], 10) : 0;
      const min = slashMatch[5] ? parseInt(slashMatch[5], 10) : 0;
      const sec = slashMatch[6] ? parseInt(slashMatch[6], 10) : 0;
      return new Date(year, month, day, hour, min, sec).getTime();
    }

    // Pattern 4C: Dash format DD-MM-YYYY
    const dashMatch = trimmed.match(
      /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
    );
    if (dashMatch) {
      const day = parseInt(dashMatch[1], 10);
      const month = parseInt(dashMatch[2], 10) - 1;
      const year = parseInt(dashMatch[3], 10);
      const hour = dashMatch[4] ? parseInt(dashMatch[4], 10) : 0;
      const min = dashMatch[5] ? parseInt(dashMatch[5], 10) : 0;
      const sec = dashMatch[6] ? parseInt(dashMatch[6], 10) : 0;
      return new Date(year, month, day, hour, min, sec).getTime();
    }

    // Pattern 4D: Text with Indonesian or English month name
    const monthMap: Record<string, number> = {
      jan: 0, januari: 0, january: 0,
      feb: 1, februari: 1, february: 1,
      mar: 2, maret: 2, march: 2,
      apr: 3, april: 3,
      mei: 4, may: 4,
      jun: 5, juni: 5, june: 5,
      jul: 6, juli: 6, july: 6,
      agu: 7, agustus: 7, aug: 7, august: 7,
      sep: 8, september: 8,
      okt: 9, oktober: 9, oct: 9, october: 9,
      nov: 10, november: 10,
      des: 11, desember: 11, dec: 11, december: 11
    };

    const tokens = trimmed.toLowerCase().split(/[\s,/-]+/);
    if (tokens.length >= 3) {
      let day = parseInt(tokens[0], 10);
      let monthToken = tokens[1];
      let year = parseInt(tokens[2], 10);

      if (day > 1900) {
        year = parseInt(tokens[0], 10);
        day = parseInt(tokens[2], 10);
      } else if (isNaN(day)) {
        monthToken = tokens[0];
        day = parseInt(tokens[1], 10);
        year = parseInt(tokens[2], 10);
      }

      const monthIndex = monthMap[monthToken];
      if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
        return new Date(year, monthIndex, day).getTime();
      }
    }

    // Direct Date.parse fallback
    const direct = Date.parse(trimmed);
    if (!isNaN(direct)) return direct;

    // Year match fallback
    const yearMatch = trimmed.match(/\b(20\d\d)\b/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1], 10), 0, 1).getTime();
    }
  }

  return 0;
}

/**
 * Extracts a numeric timestamp from a news/article item for robust descending sorting.
 * Checks multiple possible fields in priority order, with fallback to seed data.
 */
export function parseNewsTimestamp(item: any): number {
  if (!item) return 0;

  // Check candidate fields on the item itself
  const candidates = [
    item.tanggal,
    item.date,
    item.publishedAt,
    item.createdAt,
    item.dibuatPada,
    item.timestamp,
    item.updatedAt
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      const ts = parseAnyToTimestamp(candidate);
      if (ts > 0) return ts;
    }
  }

  // Fallback to seed data if item matches an existing seed article
  const seedArticles: any[] = (rawSeedData as any).berita || [];
  const seedMatch = seedArticles.find(
    (b) =>
      (item.id && b.id === item.id) ||
      (item.slug && b.slug === item.slug) ||
      (item.judul && b.judul === item.judul)
  );

  if (seedMatch && seedMatch.tanggal) {
    const ts = parseAnyToTimestamp(seedMatch.tanggal);
    if (ts > 0) return ts;
  }

  return 0;
}

/**
 * Returns a guaranteed valid DD/MM/YYYY date string for displaying on news cards and details.
 * Never returns empty or undefined.
 */
export function formatNewsDisplayDate(itemOrDate: any): string {
  if (!itemOrDate) return '22/07/2026';

  let raw: any =
    typeof itemOrDate === 'string' ||
    typeof itemOrDate === 'number' ||
    itemOrDate instanceof Date ||
    itemOrDate?.toDate ||
    itemOrDate?.toMillis ||
    itemOrDate?.seconds
      ? itemOrDate
      : itemOrDate.tanggal ||
        itemOrDate.date ||
        itemOrDate.publishedAt ||
        itemOrDate.createdAt ||
        itemOrDate.dibuatPada ||
        itemOrDate.timestamp ||
        itemOrDate.updatedAt;

  // Fallback to seed data if object has id or title
  if (!raw && typeof itemOrDate === 'object') {
    const seedArticles: any[] = (rawSeedData as any).berita || [];
    const seedMatch = seedArticles.find(
      (b) =>
        (itemOrDate.id && b.id === itemOrDate.id) ||
        (itemOrDate.slug && b.slug === itemOrDate.slug) ||
        (itemOrDate.judul && b.judul === itemOrDate.judul)
    );
    if (seedMatch && seedMatch.tanggal) {
      raw = seedMatch.tanggal;
    }
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();

    // Already DD/MM/YYYY
    const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (ddmmyyyyMatch) {
      const d = ddmmyyyyMatch[1].padStart(2, '0');
      const m = ddmmyyyyMatch[2].padStart(2, '0');
      const y = ddmmyyyyMatch[3];
      return `${d}/${m}/${y}`;
    }

    // ISO format YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const y = isoMatch[1];
      const m = isoMatch[2].padStart(2, '0');
      const d = isoMatch[3].padStart(2, '0');
      return `${d}/${m}/${y}`;
    }

    // Dash format DD-MM-YYYY
    const dashMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (dashMatch) {
      const d = dashMatch[1].padStart(2, '0');
      const m = dashMatch[2].padStart(2, '0');
      const y = dashMatch[3];
      return `${d}/${m}/${y}`;
    }
  }

  // Parse to timestamp and format
  const ts = parseAnyToTimestamp(raw);
  if (ts > 0) {
    const dateObj = new Date(ts);
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // Ultimate fallback date for SMP Negeri 1 Tambak articles
  return '22/07/2026';
}

/**
 * Sorts news articles strictly from newest to oldest (descending) based on publication date / timestamp.
 * Articles without a valid date are placed at the end.
 */
export function sortNewsByNewest<T extends { id?: string; status?: string }>(articles: T[]): T[] {
  return [...articles].sort((a, b) => {
    const timeA = parseNewsTimestamp(a);
    const timeB = parseNewsTimestamp(b);
    if (timeA !== timeB) {
      return timeB - timeA; // Descending: newest first
    }
    return (b.id || '').localeCompare(a.id || '');
  });
}
