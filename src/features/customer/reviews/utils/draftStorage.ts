const STORAGE_KEY = 'review:draft';

export function saveDraft(data: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDraft<T = Record<string, unknown>>(): T | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
