'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import PlantCatalog from '@/components/PlantCatalog';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Plant, SiteSettings } from '@/lib/types';
import { getStoredSettings, getStoredPlants, saveStoredPlants, EVENT_STORE_UPDATED } from '@/lib/persistentStore';

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

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Hydrate from persistent store before API fetch
    setSettings(getStoredSettings(defaultSettings));
    const cachedPlants = getStoredPlants();
    if (cachedPlants) {
      setPlants(cachedPlants);
    }

    // 2. Fetch fresh data from API and sync
    async function loadInitialData() {
      try {
        const [plantsRes, settingsRes] = await Promise.all([
          fetch('/api/plants'),
          fetch('/api/settings'),
        ]);

        if (plantsRes.ok) {
          const plantsData = await plantsRes.json();
          const localPlants = getStoredPlants();
          if (!localPlants || localPlants.length === 0) {
            setPlants(plantsData);
            saveStoredPlants(plantsData);
          } else {
            setPlants(localPlants);
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(getStoredSettings({ ...defaultSettings, ...settingsData }));
        }
      } catch (err) {
        console.error('Failed loading page data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();

    // 3. Listen for store updates
    const handleStoreUpdate = () => {
      setSettings(getStoredSettings(defaultSettings));
      const p = getStoredPlants();
      if (p) setPlants(p);
    };

    window.addEventListener(EVENT_STORE_UPDATED, handleStoreUpdate);
    return () => window.removeEventListener(EVENT_STORE_UPDATED, handleStoreUpdate);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-warm-50">
      
      {/* Floating Intro Splash Screen */}
      {showSplash && (
        <SplashScreen
          settings={settings}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {/* Sticky Header Navbar */}
      <Navbar
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner with Value Proposition Badges */}
      <HeroBanner
        settings={settings}
        onExploreClick={scrollToCatalog}
      />

      {/* 2-Tier Crop & Variety Interactive Catalog */}
      <PlantCatalog
        plants={plants}
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Nursery Infrastructure Gallery Section */}
      <GallerySection />

      {/* Contact & Map Section */}
      <ContactSection settings={settings} />

      {/* Footer */}
      <Footer settings={settings} />

    </main>
  );
}
