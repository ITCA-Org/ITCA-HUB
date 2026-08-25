/**
 * Academic year helpers (e.g. 2025/2026) — calendar spans two years.
 */

const ACADEMIC_YEAR_RE = /^(\d{4})\s*[/–-]\s*(\d{4})$/;

/** Current academic year label, assuming an Aug–Jul calendar. */
export function getCurrentAcademicYear(now = new Date()): string {
  const calendarYear = now.getFullYear();
  const month = now.getMonth(); // 0-based; Aug = 7
  const start = month >= 7 ? calendarYear : calendarYear - 1;
  return `${start}/${start + 1}`;
}

/** Recent academic years for filters/forms, newest first. */
export function getAcademicYearOptions(count = 15, now = new Date()): string[] {
  const current = getCurrentAcademicYear(now);
  const start = Number(current.split('/')[0]);
  return Array.from({ length: count }, (_, i) => {
    const y = start - i;
    return `${y}/${y + 1}`;
  });
}

/**
 * Accepts `2025/2026`, `2025-2026`, or a legacy single year `2025` → `2025/2026`.
 * Returns null if invalid.
 */
export function parseAcademicYear(input: string | number): string | null {
  const raw = String(input ?? '').trim();
  if (!raw) return null;

  if (/^\d{4}$/.test(raw)) {
    const y = Number(raw);
    if (y < 1990 || y > 2100) return null;
    return `${y}/${y + 1}`;
  }

  const match = raw.match(ACADEMIC_YEAR_RE);
  if (!match) return null;

  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start < 1990 || start > 2100 || end < 1990 || end > 2100) return null;
  if (end !== start + 1) return null;

  return `${start}/${end}`;
}

/** Display helper — normalizes legacy numeric years. */
export function formatAcademicYear(year: string | number): string {
  return parseAcademicYear(year) ?? String(year);
}
