import fs from 'fs';
import path from 'path';
import { Plant, SiteSettings, GalleryItem } from './types';

// Root data directory
const rootDataDir = path.join(process.cwd(), 'data');
const tmpDataDir = path.join('/tmp', 'nursery_data');

// In-memory runtime cache for serverless fallback
let memoryPlants: Plant[] | null = null;
let memorySettings: SiteSettings | null = null;
let memoryGallery: GalleryItem[] | null = null;

function ensureDataDir(targetDir: string) {
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  } catch (err) {
    // ignore if read-only
  }
}

function safeWriteJSON(filename: string, data: any): boolean {
  const rootPath = path.join(rootDataDir, filename);
  const tmpPath = path.join(tmpDataDir, filename);

  // Try writing to root data directory
  try {
    ensureDataDir(rootDataDir);
    fs.writeFileSync(rootPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error: any) {
    // If read-only filesystem (Vercel serverless), fallback to /tmp/
    try {
      ensureDataDir(tmpDataDir);
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (tmpError) {
      console.error(`Failed to write ${filename} to /tmp:`, tmpError);
      return false;
    }
  }
}

function safeReadJSON<T>(filename: string, defaultData: T): T {
  const rootPath = path.join(rootDataDir, filename);
  const tmpPath = path.join(tmpDataDir, filename);

  // 1. Check /tmp first (in case updated at runtime in serverless)
  try {
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, 'utf8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    // ignore
  }

  // 2. Read from root data directory
  try {
    if (fs.existsSync(rootPath)) {
      const content = fs.readFileSync(rootPath, 'utf8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filename} from root data dir:`, err);
  }

  return defaultData;
}

export function getPlants(): Plant[] {
  if (memoryPlants) return memoryPlants;
  const plants = safeReadJSON<Plant[]>('plants.json', []);
  memoryPlants = plants;
  return plants;
}

export function savePlants(plants: Plant[]): boolean {
  memoryPlants = plants;
  return safeWriteJSON('plants.json', plants);
}

export function getGalleryItems(): GalleryItem[] {
  if (memoryGallery) return memoryGallery;
  const items = safeReadJSON<GalleryItem[]>('gallery.json', []);
  memoryGallery = items;
  return items;
}

export function saveGalleryItems(items: GalleryItem[]): boolean {
  memoryGallery = items;
  return safeWriteJSON('gallery.json', items);
}

const defaultSettings: SiteSettings = {
  logoUrl: '/logo.png',
  nurseryName: 'Rani Channamma Hitech Nursery',
  locationTagline: 'Inchageri, Vijayapura',
  phone1: '+91 9611710898',
  phone2: '+91 7353509658',
  whatsappNumber: '919611710898',
  address: 'Horti Road, Inchageri, Vijayapura, Karnataka - 586117',
  timings: 'Monday - Sunday: 7:00 AM - 7:00 PM',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15254.567223841123!2d75.8341!3d17.2023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDEyJzA4LjMiTiA3NcKwNTAnMDIuOCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

export function getSettings(): SiteSettings {
  if (memorySettings) return memorySettings;
  const settings = safeReadJSON<SiteSettings>('settings.json', defaultSettings);
  memorySettings = { ...defaultSettings, ...settings };
  return memorySettings;
}

export function saveSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  memorySettings = updated;
  safeWriteJSON('settings.json', updated);
  return updated;
}
