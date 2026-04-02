export type StoredListKind = "favorites" | "watchLater";

const STORAGE_KEYS: Record<StoredListKind, string> = {
  favorites: "vio:favorites",
  watchLater: "vio:watch-later",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function sanitizeIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map(Number).filter((value) => Number.isInteger(value) && value > 0))];
}

export function getStoredMovieIds(kind: StoredListKind): number[] {
  if (!isBrowser()) return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS[kind]);
    if (!saved) return [];
    return sanitizeIds(JSON.parse(saved));
  } catch {
    return [];
  }
}

export function saveStoredMovieIds(kind: StoredListKind, ids: number[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS[kind], JSON.stringify(sanitizeIds(ids)));
}

export function addStoredMovieId(kind: StoredListKind, id: number): number[] {
  const next = [...new Set([...getStoredMovieIds(kind), id])];
  saveStoredMovieIds(kind, next);
  return next;
}

export function removeStoredMovieId(kind: StoredListKind, id: number): number[] {
  const next = getStoredMovieIds(kind).filter((movieId) => movieId !== id);
  saveStoredMovieIds(kind, next);
  return next;
}
