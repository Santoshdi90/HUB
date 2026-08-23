'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Maximize2 } from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import { getStoredGallery, saveStoredGallery, EVENT_STORE_UPDATED } from '@/lib/persistentStore';

export default function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    // 1. Hydrate from persistent local store first
    const stored = getStoredGallery();
    if (stored) {
      setGalleryItems(stored);
    }

    // 2. Fetch from API and merge
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const apiData = await res.json();
          const localStored = getStoredGallery();
          if (!localStored || localStored.length === 0) {
            setGalleryItems(apiData);
            saveStoredGallery(apiData);
          } else {
            // Keep localStored as truth if present
            setGalleryItems(localStored);
          }
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      }
    }

    loadGallery();

    const handleUpdate = () => {
      const updated = getStoredGallery();
      if (updated) setGalleryItems(updated);
    };

    window.addEventListener(EVENT_STORE_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_STORE_UPDATED, handleUpdate);
  }, []);

  const categories = ['All', 'Greenhouse', 'Root Trainers', 'Polyhouse', 'Shade Net', 'Farm Delivery'];

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <section className="py-20 bg-gradient-to-b from-warm-50 via-sage-50/40 to-white border-t border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <Camera className="w-4 h-4 text-emerald-700" />
            Infrastructure & Quality Guarantee
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-forest-900">
            Our Greenhouse & Nursery Gallery
          </h2>

          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Take a visual tour of our climate-controlled polyhouses, 50% UV shade net hardening beds, vertical root-trainer propagation units, and bulk farm delivery dispatches at Horti Road, Inchageri.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center overflow-x-auto pb-4 gap-2 no-scrollbar mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-2xl border border-emerald-900/10 cursor-pointer bg-white"
            >
              <div className="relative h-64 w-full overflow-hidden bg-sage-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Category Pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-forest-900/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    {item.category}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Title & Caption */}
                <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                  <h3 className="text-lg font-bold font-serif leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-200/90 line-clamp-2 font-medium">
                    {item.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-forest-950 text-white rounded-3xl overflow-hidden border border-emerald-800/40 shadow-2xl"
            >
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative h-[65vh] w-full bg-black">
                <img
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-gradient-to-r from-forest-950 to-forest-900 space-y-2 border-t border-emerald-800/40">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  {activeLightboxItem.category}
                </span>
                <h3 className="text-2xl font-bold font-serif text-white">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-sm text-emerald-100/90 font-medium">
                  {activeLightboxItem.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
