import { SavedPattern, InputMode, ErrorCorrectionLevel, BeadSizeSpec } from '../types';

const STORAGE_KEY = 'scanbeads_saved_patterns_v1';

export function getSavedPatterns(): SavedPattern[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load saved patterns', err);
    return [];
  }
}

export function savePattern(pattern: Omit<SavedPattern, 'id' | 'createdAt'>): SavedPattern {
  const current = getSavedPatterns();
  const newRecord: SavedPattern = {
    ...pattern,
    id: `pattern_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: Date.now()
  };

  const updated = [newRecord, ...current.slice(0, 49)]; // keep up to 50 patterns
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save pattern to localStorage', err);
  }
  return newRecord;
}

export function deleteSavedPattern(id: string): SavedPattern[] {
  const current = getSavedPatterns();
  const updated = current.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete pattern from localStorage', err);
  }
  return updated;
}

export function exportPatternsJson(): string {
  const patterns = getSavedPatterns();
  return JSON.stringify({
    app: 'ScanBeads',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    patterns
  }, null, 2);
}

export function importPatternsJson(jsonString: string): { success: boolean; count: number } {
  try {
    const parsed = JSON.parse(jsonString);
    const list: SavedPattern[] = Array.isArray(parsed.patterns)
      ? parsed.patterns
      : Array.isArray(parsed)
      ? parsed
      : [];

    if (list.length === 0) return { success: false, count: 0 };

    const current = getSavedPatterns();
    const existingIds = new Set(current.map(p => p.id));
    const merged = [...current];

    let added = 0;
    for (const item of list) {
      if (item.title && (item.urlText || item.wifi || item.vcard)) {
        if (!existingIds.has(item.id)) {
          merged.unshift(item);
          added++;
        }
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged.slice(0, 50)));
    return { success: true, count: added };
  } catch (err) {
    console.error('Failed to import patterns JSON', err);
    return { success: false, count: 0 };
  }
}

/**
 * Encodes pattern configuration into URL search parameters for quick sharing
 */
export function buildShareUrl(params: {
  mode: InputMode;
  urlText?: string;
  ecl?: ErrorCorrectionLevel;
  darkBeadId?: string;
  beadSize?: BeadSizeSpec;
  isMirrored?: boolean;
}): string {
  if (typeof window === 'undefined') return '';

  const url = new URL(window.location.href);
  url.searchParams.set('m', params.mode);
  if (params.urlText) url.searchParams.set('q', params.urlText);
  if (params.ecl) url.searchParams.set('ecl', params.ecl);
  if (params.darkBeadId) url.searchParams.set('c', params.darkBeadId);
  if (params.beadSize) url.searchParams.set('s', params.beadSize);
  if (params.isMirrored) url.searchParams.set('mir', '1');
  else url.searchParams.delete('mir');

  return url.toString();
}

/**
 * Parses shared URL parameters if available
 */
export function parseShareUrl(): {
  mode?: InputMode;
  urlText?: string;
  ecl?: ErrorCorrectionLevel;
  darkBeadId?: string;
  beadSize?: BeadSizeSpec;
  isMirrored?: boolean;
} | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('m') as InputMode | null;
    const q = params.get('q');
    const ecl = params.get('ecl') as ErrorCorrectionLevel | null;
    const c = params.get('c');
    const s = params.get('s') as BeadSizeSpec | null;
    const mir = params.get('mir');

    if (!m && !q && !c) return null;

    return {
      mode: m || 'url',
      urlText: q || undefined,
      ecl: ecl || undefined,
      darkBeadId: c || undefined,
      beadSize: s || undefined,
      isMirrored: mir === '1'
    };
  } catch {
    return null;
  }
}
