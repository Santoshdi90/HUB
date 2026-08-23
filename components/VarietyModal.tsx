'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Clock, MessageSquare, Sun, Droplets, Calendar, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Plant, PlantVariety, SiteSettings } from '@/lib/types';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';

interface VarietyModalProps {
  plant: Plant | null;
  settings: SiteSettings;
  onClose: () => void;
}

export default function VarietyModal({ plant, settings, onClose }: VarietyModalProps) {
  if (!plant) return null;

  const [selectedVarietyId, setSelectedVarietyId] = useState<string>(
    plant.varieties && plant.varieties[0] ? plant.varieties[0].id : ''
  );

  const selectedVariety = plant.varieties.find((v) => v.id === selectedVarietyId) || plant.varieties[0];

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Out of Stock
          </span>
        );
      case 'Pre-Booking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pre-Booking
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl my-8 border border-emerald-900/10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={plant.imageUrl}
                alt={plant.commonName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md bg-white"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    {plant.category}
                  </span>
                  <span className="text-xs text-emerald-200">
                    {plant.varieties.length} Hybrid Varieties
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold font-serif text-white mt-0.5">
                  {plant.commonName} <span className="text-xs font-normal italic text-emerald-200">({plant.scientificName})</span>
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* Left: Variety Selector Pills */}
            <div className="lg:col-span-4 p-5 bg-sage-50/50 space-y-3 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Select Seed / Hybrid Variety
              </h3>

              <div className="space-y-2">
                {plant.varieties.map((v) => {
                  const isSelected = selectedVariety?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVarietyId(v.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md scale-102'
                          : 'bg-white text-gray-800 hover:bg-sage-100 border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">{v.varietyName}</span>
                          {v.isPopular && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-forest-950 font-extrabold text-[9px]">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                          {formatCurrency(v.price)} <span className="text-[10px] font-normal">{v.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          v.stockStatus === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.stockStatus}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Hi-Tech Plug Grown
                </div>
                <p className="text-emerald-800/80 leading-snug">
                  Grown in coco-peat pro-trays under controlled shading for 100% root retention.
                </p>
              </div>
            </div>

            {/* Right: Selected Variety Breakdown */}
            {selectedVariety && (
              <div className="lg:col-span-8 p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStockBadge(selectedVariety.stockStatus)}
                        <span className="text-xs text-gray-500 font-medium">
                          {selectedVariety.unit || 'per sapling'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-forest-900 font-serif mt-1">
                        {selectedVariety.varietyName}
                      </h3>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Parent Crop: {plant.commonName} ({plant.scientificName})
                      </p>
                    </div>

                    <div className="text-right bg-sage-50 px-4 py-2 rounded-2xl border border-sage-200">
                      <span className="text-2xl font-extrabold text-forest-900">
                        {formatCurrency(selectedVariety.price)}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Rate / Unit</span>
                    </div>
                  </div>

                  {/* Image & Yield Traits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-sage-100 border border-gray-200">
                      <img
                        src={selectedVariety.imageUrl || plant.imageUrl}
                        alt={selectedVariety.varietyName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Yield & Crop Traits
                        </span>
                        <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                          {selectedVariety.yieldTraits}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" /> Days to Maturity
                        </span>
                        <p className="text-xs font-bold text-gray-800">
                          {selectedVariety.daysToMaturity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Care Guidelines */}
                  {selectedVariety.careGuidelines && (
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1 text-xs">
                      <span className="font-bold text-forest-900 block">Nursery Care Guidelines:</span>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedVariety.careGuidelines}
                      </p>
                    </div>
                  )}

                </div>

                {/* WhatsApp Action Footer */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <a
                    href={generateWhatsAppLink(settings.whatsappNumber, selectedVariety, plant.commonName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs shadow-lg transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4.5 h-4.5 fill-white" />
                    Order {selectedVariety.varietyName} on WhatsApp
                  </a>

                  <p className="text-[10px] text-center text-gray-500">
                    Sends pre-filled WhatsApp greeting: <em>"Namaskara, I want to book/order {selectedVariety.varietyName} of {plant.commonName}..."</em>
                  </p>
                </div>

              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
