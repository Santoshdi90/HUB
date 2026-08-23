'use client';

import { SiteSettings, GalleryItem, Plant } from './types';

const SETTINGS_KEY = 'nursery_settings_v3';
const GALLERY_KEY = 'nursery_gallery_v3';
const PLANTS_KEY = 'nursery_plants_v3';

export const EVENT_STORE_UPDATED = 'nursery_store_updated';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function notifyUpdate() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(EVENT_STORE_UPDATED));
  }
}

// --- SETTINGS STORE ---
export function getStoredSettings(defaultSettings: SiteSettings): SiteSettings {
  if (!isBrowser()) return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...parsed };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }
  return defaultSettings;
}

export function saveStoredSettings(updated: Partial<SiteSettings>, defaultSettings: SiteSettings): SiteSettings {
  const current = getStoredSettings(defaultSettings);
  const merged = { ...current, ...updated };
  if (isBrowser()) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      notifyUpdate();
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
  }
  return merged;
}

// --- GALLERY STORE ---
export function getStoredGallery(): GalleryItem[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (raw) {
      return JSON.parse(raw) as GalleryItem[];
    }
  } catch (e) {
    console.error('Error reading gallery from localStorage:', e);
  }
  return null;
}

export function saveStoredGallery(items: GalleryItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    notifyUpdate();
  } catch (e) {
    console.error('Error saving gallery to localStorage:', e);
  }
}

export function addStoredGalleryItem(item: GalleryItem, defaultItems: GalleryItem[]): GalleryItem[] {
  const current = getStoredGallery() || defaultItems;
  const updated = [item, ...current];
  saveStoredGallery(updated);
  return updated;
}

export function deleteStoredGalleryItem(id: string, defaultItems: GalleryItem[]): GalleryItem[] {
  const current = getStoredGallery() || defaultItems;
  const updated = current.filter((i) => i.id !== id);
  saveStoredGallery(updated);
  return updated;
}

// --- PLANTS STORE ---
export function getStoredPlants(): Plant[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PLANTS_KEY);
    if (raw) {
      return JSON.parse(raw) as Plant[];
    }
  } catch (e) {
    console.error('Error reading plants from localStorage:', e);
  }
  return null;
}

export function saveStoredPlants(plants: Plant[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
    notifyUpdate();
  } catch (e) {
    console.error('Error saving plants to localStorage:', e);
  }
}
