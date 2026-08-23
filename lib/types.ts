export type PlantCategory = 
  | 'Vegetables & Commercial Saplings'
  | 'Horticulture & Fruits'
  | 'Floriculture';

export type SunlightNeed = 'Full Sun' | 'Partial Sun' | 'Low Light';
export type WaterNeed = 'Low' | 'Moderate' | 'Frequent';
export type StockStatus = 'In Stock' | 'Out of Stock' | 'Pre-Booking';

export interface PlantVariety {
  id: string;
  plantId: string;
  varietyName: string;
  price: number;
  unit: string; // e.g., 'per sapling' or 'per 104-cavity tray'
  stockStatus: StockStatus;
  imageUrl: string;
  yieldTraits: string;
  daysToMaturity: string;
  careGuidelines: string;
  sunlight?: SunlightNeed;
  watering?: WaterNeed;
  isPopular?: boolean;
}

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  category: PlantCategory;
  imageUrl: string;
  description: string;
  isFeatured?: boolean;
  varieties: PlantVariety[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Greenhouse' | 'Root Trainers' | 'Polyhouse' | 'Shade Net' | 'Farm Delivery';
  imageUrl: string;
  caption: string;
  uploadedAt: string;
}

export interface SiteSettings {
  logoUrl: string;
  nurseryName: string;
  locationTagline: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  address: string;
  timings: string;
  googleMapsUrl?: string;
  passwordHash?: string;
  cloudinaryPreset?: string;
  cloudinaryCloudName?: string;
}
