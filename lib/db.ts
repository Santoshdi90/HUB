import fs from 'fs';
import path from 'path';
import { Plant, PlantVariety, SiteSettings, GalleryItem } from './types';

const dataDir = path.join(process.cwd(), 'data');
const plantsFile = path.join(dataDir, 'plants.json');
const settingsFile = path.join(dataDir, 'settings.json');
const galleryFile = path.join(dataDir, 'gallery.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function getPlants(): Plant[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(plantsFile)) return [];
    const content = fs.readFileSync(plantsFile, 'utf8');
    return JSON.parse(content) as Plant[];
  } catch (error) {
    console.error('Error reading plants.json:', error);
    return [];
  }
}

export function savePlants(plants: Plant[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(plantsFile, JSON.stringify(plants, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing plants.json:', error);
    return false;
  }
}

export function getGalleryItems(): GalleryItem[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(galleryFile)) return [];
    const content = fs.readFileSync(galleryFile, 'utf8');
    return JSON.parse(content) as GalleryItem[];
  } catch (error) {
    console.error('Error reading gallery.json:', error);
    return [];
  }
}

export function saveGalleryItems(items: GalleryItem[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(galleryFile, JSON.stringify(items, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing gallery.json:', error);
    return false;
  }
}

export function getSettings(): SiteSettings {
  try {
    ensureDataDir();
    if (!fs.existsSync(settingsFile)) {
      return {
        logoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&auto=format&fit=crop&q=80',
        nurseryName: 'Rani Channamma Hitech Nursery',
        locationTagline: 'Inchageri, Vijayapura',
        phone1: '+91 9611710898',
        phone2: '+91 7353509658',
        whatsappNumber: '919611710898',
        address: 'Horti Road, Inchageri, Vijayapura, Karnataka - 586117',
        timings: 'Monday - Sunday: 7:00 AM - 7:00 PM',
      };
    }
    const content = fs.readFileSync(settingsFile, 'utf8');
    return JSON.parse(content) as SiteSettings;
  } catch (error) {
    console.error('Error reading settings.json:', error);
    return {
      logoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&auto=format&fit=crop&q=80',
      nurseryName: 'Rani Channamma Hitech Nursery',
      locationTagline: 'Inchageri, Vijayapura',
      phone1: '+91 9611710898',
      phone2: '+91 7353509658',
      whatsappNumber: '919611710898',
      address: 'Horti Road, Inchageri, Vijayapura, Karnataka - 586117',
      timings: 'Monday - Sunday: 7:00 AM - 7:00 PM',
    };
  }
}

export function saveSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  try {
    ensureDataDir();
    fs.writeFileSync(settingsFile, JSON.stringify(updated, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving settings.json:', error);
  }
  return updated;
}
