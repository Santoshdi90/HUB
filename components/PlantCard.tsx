'use client';

import { motion } from 'framer-motion';
import { Layers, ChevronRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Plant, SiteSettings } from '@/lib/types';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';

interface PlantCardProps {
  plant: Plant;
  settings: SiteSettings;
  onSelect: (plant: Plant) => void;
}

export default function PlantCard({ plant, settings, onSelect }: PlantCardProps) {
  const varietyCount = plant.varieties ? plant.varieties.length : 0;
  
  // Calculate starting price
  const minPrice = plant.varieties && plant.varieties.length > 0
    ? Math.min(...plant.varieties.map(v => v.price))
    : 0;

  const defaultVariety = plant.varieties && plant.varieties[0] ? plant.varieties[0] : undefined;
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber, defaultVariety, plant.commonName);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Plant Crop Image */}
        <div className="relative h-56 w-full overflow-hidden bg-sage-100 cursor-pointer" onClick={() => onSelect(plant)}>
          <img
            src={plant.imageUrl}
            alt={plant.commonName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Category Badge Top Left */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-forest-900/90 backdrop-blur-md text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              {plant.category}
            </span>
          </div>

          {/* Variety Count Badge Top Right */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-forest-950 text-xs font-extrabold shadow-md">
              <Layers className="w-3.5 h-3.5" /> {varietyCount} {varietyCount === 1 ? 'Variety' : 'Varieties'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 
                onClick={() => onSelect(plant)}
                className="text-lg font-bold text-forest-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 font-serif"
              >
                {plant.commonName}
              </h3>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-gray-500 block text-[10px]">Starting from</span>
                <span className="text-lg font-extrabold text-emerald-800">
                  {formatCurrency(minPrice)}
                </span>
              </div>
            </div>

            <p className="text-xs italic text-emerald-700 font-medium mt-0.5">
              {plant.scientificName}
            </p>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {plant.description}
          </p>

          {/* Available varieties preview tags */}
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Featured Hybrid Varieties:</div>
            <div className="flex flex-wrap gap-1">
              {plant.varieties.slice(0, 3).map((v) => (
                <span key={v.id} className="px-2 py-0.5 rounded-md bg-sage-100 text-forest-900 text-[10px] font-semibold">
                  {v.varietyName}
                </span>
              ))}
              {plant.varieties.length > 3 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                  +{plant.varieties.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={() => onSelect(plant)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all active:scale-95"
        >
          View Varieties ({varietyCount}) <ChevronRight className="w-4 h-4 text-emerald-300" />
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors"
          title="Order on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-emerald-800" />
        </a>
      </div>
    </motion.div>
  );
}
