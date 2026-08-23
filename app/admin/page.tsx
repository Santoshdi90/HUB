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

const defaultSettings: SiteSettings = {
  logoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&auto=format&fit=crop&q=80',
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
    // 1. Try local cache
    try {
      const cachedSettings = localStorage.getItem('nursery_settings_v2');
      if (cachedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(cachedSettings) }));
      }
      const cachedPlants = localStorage.getItem('nursery_plants_v2');
      if (cachedPlants) {
        setPlants(JSON.parse(cachedPlants));
      }
    } catch (e) {}

    // 2. Fetch from API
    try {
      const [plantsRes, settingsRes] = await Promise.all([
        fetch('/api/plants'),
        fetch('/api/settings'),
      ]);

      if (plantsRes.ok) {
        const p = await plantsRes.json();
        setPlants(p);
        try { localStorage.setItem('nursery_plants_v2', JSON.stringify(p)); } catch (e) {}
      }
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettings((prev) => {
          const merged = { ...prev, ...s };
          try { localStorage.setItem('nursery_settings_v2', JSON.stringify(merged)); } catch (e) {}
          return merged;
        });
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
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  // Crop CRUD Handlers
  const handleAddPlant = async (plantData: Partial<Plant>) => {
    const res = await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plantData),
    });
    if (res.ok) fetchAdminData();
  };

  const handleUpdatePlant = async (id: string, plantData: Partial<Plant>) => {
    const res = await fetch(`/api/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plantData),
    });
    if (res.ok) fetchAdminData();
  };

  const handleDeletePlant = async (id: string) => {
    const res = await fetch(`/api/plants/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAdminData();
  };

  // Variety CRUD Handlers
  const handleAddVariety = async (varietyData: Partial<PlantVariety>) => {
    const res = await fetch('/api/varieties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(varietyData),
    });
    if (res.ok) fetchAdminData();
  };

  const handleUpdateVariety = async (id: string, varietyData: Partial<PlantVariety>) => {
    const res = await fetch(`/api/varieties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(varietyData),
    });
    if (res.ok) fetchAdminData();
  };

  const handleToggleVarietyStock = async (id: string, stockStatus: StockStatus) => {
    const res = await fetch(`/api/varieties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockStatus }),
    });
    if (res.ok) fetchAdminData();
  };

  const handleDeleteVariety = async (id: string) => {
    const res = await fetch(`/api/varieties/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAdminData();
  };

  // Settings Handler (Logo, phone, address, timings)
  const handleSaveSettings = async (updatedSettings: Partial<SiteSettings>) => {
    // Optimistic update to state & localStorage
    setSettings((prev) => {
      const merged = { ...prev, ...updatedSettings };
      try { localStorage.setItem('nursery_settings_v2', JSON.stringify(merged)); } catch (e) {}
      return merged;
    });

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings),
    });

    if (res.ok) {
      const data = await res.json();
      setSettings((prev) => {
        const merged = { ...prev, ...data };
        try { localStorage.setItem('nursery_settings_v2', JSON.stringify(merged)); } catch (e) {}
        return merged;
      });
    }
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
