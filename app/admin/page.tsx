'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sprout, 
  Camera, 
  Settings, 
  LogOut, 
  Home, 
  ExternalLink,
  Lock
} from 'lucide-react';
import LoginForm from '@/components/admin/LoginForm';
import InventoryTable from '@/components/admin/InventoryTable';
import GalleryManager from '@/components/admin/GalleryManager';
import BrandingSettings from '@/components/admin/BrandingSettings';
import SecuritySettings from '@/components/admin/SecuritySettings';
import { Plant, PlantVariety, SiteSettings, StockStatus } from '@/lib/types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredPlants,
  saveStoredPlants,
  EVENT_STORE_UPDATED,
} from '@/lib/persistentStore';

const defaultSettings: SiteSettings = {
  logoUrl: '/logo.png',
  nurseryName: 'Rani Channamma Hitech Nursery',
  locationTagline: 'Inchageri, Vijayapura',
  phone1: '+91 9611710898',
  phone2: '+91 7353509658',
  whatsappNumber: '919611710898',
  address: 'Horti Road, Inchageri, Vijayapura, Karnataka - 586117',
  timings: 'Monday - Sunday: 7:00 AM - 7:00 PM',
};

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'gallery' | 'branding' | 'security'>('inventory');
  
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Check Auth Session
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      setAuthenticated(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    // 1. Hydrate from persistent store
    setSettings(getStoredSettings(defaultSettings));
    const cachedPlants = getStoredPlants();
    if (cachedPlants) setPlants(cachedPlants);

    // 2. Fetch API
    try {
      const [plantsRes, settingsRes] = await Promise.all([
        fetch('/api/plants'),
        fetch('/api/settings'),
      ]);

      if (plantsRes.ok) {
        const p = await plantsRes.json();
        setPlants(p);
        saveStoredPlants(p);
      }

      if (settingsRes.ok) {
        const s = await settingsRes.json();
        const mergedSettings = { ...defaultSettings, ...s };
        setSettings(mergedSettings);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchAdminData();

    const handleUpdate = () => {
      setSettings(getStoredSettings(defaultSettings));
      const p = getStoredPlants();
      if (p) setPlants(p);
    };

    window.addEventListener(EVENT_STORE_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_STORE_UPDATED, handleUpdate);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  // Crop CRUD Handlers
  const handleAddPlant = async (plantData: Partial<Plant>) => {
    const newPlant: Plant = {
      id: `crop-${Date.now()}`,
      commonName: plantData.commonName || '',
      scientificName: plantData.scientificName || '',
      category: plantData.category || 'Vegetables & Commercial Saplings',
      imageUrl: plantData.imageUrl || '',
      description: plantData.description || '',
      varieties: plantData.varieties || [],
    };
    const updatedPlants = [newPlant, ...plants];
    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData),
      });
    } catch (e) {}
  };

  const handleUpdatePlant = async (id: string, plantData: Partial<Plant>) => {
    const updatedPlants = plants.map((p) => (p.id === id ? { ...p, ...plantData } : p));
    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch(`/api/plants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData),
      });
    } catch (e) {}
  };

  const handleDeletePlant = async (id: string) => {
    const updatedPlants = plants.filter((p) => p.id !== id);
    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch(`/api/plants/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Variety CRUD Handlers
  const handleAddVariety = async (varietyData: Partial<PlantVariety>) => {
    const plantId = varietyData.plantId;
    if (!plantId) return;

    const newVar: PlantVariety = {
      id: `var-${Date.now()}`,
      plantId,
      varietyName: varietyData.varietyName || '',
      price: Number(varietyData.price) || 1.0,
      unit: varietyData.unit || 'per sapling',
      stockStatus: varietyData.stockStatus || 'In Stock',
      imageUrl: varietyData.imageUrl || '',
      yieldTraits: varietyData.yieldTraits || '',
      daysToMaturity: varietyData.daysToMaturity || '60 days',
      careGuidelines: varietyData.careGuidelines || '',
      isPopular: Boolean(varietyData.isPopular),
    };

    const updatedPlants = plants.map((p) => {
      if (p.id === plantId) {
        return { ...p, varieties: [newVar, ...(p.varieties || [])] };
      }
      return p;
    });

    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch('/api/varieties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(varietyData),
      });
    } catch (e) {}
  };

  const handleUpdateVariety = async (id: string, varietyData: Partial<PlantVariety>) => {
    const updatedPlants = plants.map((p) => {
      if (!p.varieties) return p;
      const vIndex = p.varieties.findIndex((v) => v.id === id);
      if (vIndex !== -1) {
        const updatedVars = [...p.varieties];
        updatedVars[vIndex] = { ...updatedVars[vIndex], ...varietyData };
        return { ...p, varieties: updatedVars };
      }
      return p;
    });

    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch(`/api/varieties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(varietyData),
      });
    } catch (e) {}
  };

  const handleToggleVarietyStock = async (id: string, stockStatus: StockStatus) => {
    const updatedPlants = plants.map((p) => {
      if (!p.varieties) return p;
      const vIndex = p.varieties.findIndex((v) => v.id === id);
      if (vIndex !== -1) {
        const updatedVars = [...p.varieties];
        updatedVars[vIndex] = { ...updatedVars[vIndex], stockStatus };
        return { ...p, varieties: updatedVars };
      }
      return p;
    });

    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch(`/api/varieties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockStatus }),
      });
    } catch (e) {}
  };

  const handleDeleteVariety = async (id: string) => {
    const updatedPlants = plants.map((p) => {
      if (!p.varieties) return p;
      return { ...p, varieties: p.varieties.filter((v) => v.id !== id) };
    });

    setPlants(updatedPlants);
    saveStoredPlants(updatedPlants);

    try {
      await fetch(`/api/varieties/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Settings Handler
  const handleSaveSettings = async (updatedSettings: Partial<SiteSettings>) => {
    const updated = saveStoredSettings(updatedSettings, defaultSettings);
    setSettings(updated);

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
    } catch (e) {}
  };

  if (authenticated === false) {
    return (
      <LoginForm
        logoUrl={settings.logoUrl}
        nurseryName={settings.nurseryName}
        onSuccess={() => {
          setAuthenticated(true);
          fetchAdminData();
        }}
      />
    );
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 text-forest-900 font-bold">
        Verifying secure admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      
      {/* Admin Header Bar */}
      <header className="bg-[#1B4332] text-white border-b border-emerald-800/40 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-400 bg-white">
              <Image
                src={settings.logoUrl}
                alt={settings.nurseryName}
                fill
                className="object-cover p-0.5"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold font-serif text-white">
                  {settings.nurseryName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Single-Admin Portal
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {settings.locationTagline} • Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
            >
              <Home className="w-3.5 h-3.5" /> View Live Public Site <ExternalLink className="w-3 h-3 text-emerald-300" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              Crops & Variety Inventory ({plants.length})
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Greenhouse Gallery Manager
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              Logo & Site Branding
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              Admin Profile & Security
            </button>
          </div>
        </div>

        {/* Tab 1: 2-Tier Crops & Variety Inventory CRUD */}
        {activeTab === 'inventory' && (
          <InventoryTable
            plants={plants}
            onRefresh={fetchAdminData}
            onAddPlant={handleAddPlant}
            onUpdatePlant={handleUpdatePlant}
            onDeletePlant={handleDeletePlant}
            onAddVariety={handleAddVariety}
            onUpdateVariety={handleUpdateVariety}
            onToggleVarietyStock={handleToggleVarietyStock}
            onDeleteVariety={handleDeleteVariety}
          />
        )}

        {/* Tab 2: Greenhouse Infrastructure Gallery Manager */}
        {activeTab === 'gallery' && (
          <GalleryManager />
        )}

        {/* Tab 3: Site Branding & Settings */}
        {activeTab === 'branding' && (
          <BrandingSettings
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {/* Tab 4: Admin Security Settings (Change Password) */}
        {activeTab === 'security' && (
          <SecuritySettings />
        )}

      </main>

    </div>
  );
}
