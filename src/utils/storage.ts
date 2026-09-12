import type { AppState } from '../types';
import { EMPTY_STATE } from '../types';

const STORAGE_KEY = 'gate2027.appState.v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY_STATE);
    const parsed = JSON.parse(raw);
    // shallow-merge with defaults so new fields added later don't break old saves
    return { ...structuredClone(EMPTY_STATE), ...parsed };
  } catch (e) {
    console.error('Failed to load saved progress, starting fresh.', e);
    return structuredClone(EMPTY_STATE);
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function exportStateAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function downloadJSON(filename: string, data: string) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(text: string): AppState | null {
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return { ...structuredClone(EMPTY_STATE), ...parsed };
  } catch {
    return null;
  }
}
