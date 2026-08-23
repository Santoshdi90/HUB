'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { PlantVariety, StockStatus } from '@/lib/types';
import ImageUploader from './ImageUploader';

interface VarietyFormModalProps {
  plantId: string;
  parentCropName: string;
  variety?: PlantVariety | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (varietyData: Partial<PlantVariety>) => Promise<void>;
}

export default function VarietyFormModal({
  plantId,
  parentCropName,
  variety,
  isOpen,
  onClose,
  onSave,
}: VarietyFormModalProps) {
  const [varietyName, setVarietyName] = useState('');
  const [price, setPrice] = useState<number | string>(1.2);
  const [unit, setUnit] = useState('per sapling');
  const [stockStatus, setStockStatus] = useState<StockStatus>('In Stock');
  const [imageUrl, setImageUrl] = useState('');
  const [yieldTraits, setYieldTraits] = useState('');
  const [daysToMaturity, setDaysToMaturity] = useState('60 days');
  const [careGuidelines, setCareGuidelines] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (variety) {
      setVarietyName(variety.varietyName);
      setPrice(variety.price);
      setUnit(variety.unit || 'per sapling');
      setStockStatus(variety.stockStatus);
      setImageUrl(variety.imageUrl);
      setYieldTraits(variety.yieldTraits);
      setDaysToMaturity(variety.daysToMaturity);
      setCareGuidelines(variety.careGuidelines);
      setIsPopular(Boolean(variety.isPopular));
    } else {
      setVarietyName('');
      setPrice(1.2);
      setUnit('per sapling');
      setStockStatus('In Stock');
      setImageUrl('');
      setYieldTraits('');
      setDaysToMaturity('60 days');
      setCareGuidelines('');
      setIsPopular(false);
    }
  }, [variety, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        plantId,
        varietyName,
        price: Number(price),
        unit,
        stockStatus,
        imageUrl,
        yieldTraits,
        daysToMaturity,
        careGuidelines,
        isPopular,
      });
      onClose();
    } catch (err) {
      console.error('Error saving variety:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl my-8 border border-emerald-900/10"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-sage-50">
            <div>
              <h2 className="text-xl font-bold font-serif text-forest-900">
                {variety ? `Edit Variety (${variety.varietyName})` : `Add Variety under ${parentCropName}`}
              </h2>
              <p className="text-xs text-emerald-700 font-medium">
                Configure rate, traits, and stock for this seed/hybrid variety
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Variety Name & Popular toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Variety Name *
                </label>
                <input
                  type="text"
                  required
                  value={varietyName}
                  onChange={(e) => setVarietyName(e.target.value)}
                  placeholder="e.g. Saaho (Syngenta 3251), Sitara, Teja"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Popular Badge</span>
                </label>
              </div>
            </div>

            {/* Rate & Stock Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Rate / Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1.2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Unit Specification
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="per sapling or per tray"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Stock Status *
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-emerald-800"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-Booking">Pre-Booking</option>
                </select>
              </div>
            </div>

            {/* Cloudinary Image Uploader */}
            <ImageUploader
              currentUrl={imageUrl}
              onImageChange={(url) => setImageUrl(url)}
            />

            {/* Yield Traits & Days to Maturity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Yield & Disease Resistance Traits
                </label>
                <textarea
                  rows={2}
                  value={yieldTraits}
                  onChange={(e) => setYieldTraits(e.target.value)}
                  placeholder="e.g. High pungency, deep red pods, Leaf Curl Virus resistant"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Days to Maturity
                </label>
                <input
                  type="text"
                  value={daysToMaturity}
                  onChange={(e) => setDaysToMaturity(e.target.value)}
                  placeholder="e.g. 55-60 days post transplanting"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Care Guidelines */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Care & Irrigation Guidelines
              </label>
              <input
                type="text"
                value={careGuidelines}
                onChange={(e) => setCareGuidelines(e.target.value)}
                placeholder="e.g. Staking required, drip fertigation twice weekly"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : variety ? 'Update Variety' : 'Add Variety'}
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
