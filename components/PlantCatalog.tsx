'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sprout, Apple, Flower2, Layers } from 'lucide-react';
import { Plant, PlantCategory, SiteSettings } from '@/lib/types';
import PlantCard from './PlantCard';
import VarietyModal from './VarietyModal';

interface PlantCatalogProps {
  plants: Plant[];
  settings: SiteSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES: { label: string; value: PlantCategory | 'All'; icon: any }[] = [
  { label: 'All Crops', value: 'All', icon: Sprout },
  { label: 'Vegetables & Commercial Saplings', value: 'Vegetables & Commercial Saplings', icon: Sprout },
  { label: 'Horticulture & Fruits', value: 'Horticulture & Fruits', icon: Apple },
  { label: 'Floriculture', value: 'Floriculture', icon: Flower2 },
];

export default function PlantCatalog({
  plants,
  settings,
  searchQuery,
  onSearchChange,
}: PlantCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'All'>('All');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesCategory =
        selectedCategory === 'All' || plant.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        plant.commonName.toLowerCase().includes(q) ||
        plant.scientificName.toLowerCase().includes(q) ||
        plant.category.toLowerCase().includes(q) ||
        plant.description.toLowerCase().includes(q) ||
        plant.varieties?.some(v => v.varietyName.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [plants, selectedCategory, searchQuery]);

  return (
    <section id="catalog-section" className="py-16 bg-warm-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-sage-200/60 px-3 py-1 rounded-full border border-emerald-300/40">
              Certified Pro-Tray Saplings & Hybrids
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-forest-900 mt-2">
              Nursery Crops & Varieties
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              Select a crop below to view specific hybrid seed varieties, rates, yield traits, and direct WhatsApp booking options.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-900/10 shadow-sm text-xs font-semibold text-forest-800 self-start md:self-auto">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Showing {filteredPlants.length} Main Crops</span>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-forest-900 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-sage-100 border border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-700'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Plant Cards Grid */}
        {filteredPlants.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  settings={settings}
                  onSelect={setSelectedPlant}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-emerald-900/10 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center text-emerald-700">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">
              No matching nursery crops found
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              We couldn't find any crops matching "{searchQuery}". Try searching for Tomato, Chilly, Mango, Coconut, Marigold, or Rose.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Selected Plant 2-Tier Variety Showcase Modal */}
      <VarietyModal
        plant={selectedPlant}
        settings={settings}
        onClose={() => setSelectedPlant(null)}
      />
    </section>
  );
}
