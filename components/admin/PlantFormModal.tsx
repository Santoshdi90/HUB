'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Plant, PlantCategory } from '@/lib/types';
import ImageUploader from './ImageUploader';

interface PlantFormModalProps {
  plant?: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantData: Partial<Plant>) => Promise<void>;
}

const CATEGORIES: PlantCategory[] = [
  'Vegetables & Commercial Saplings',
  'Horticulture & Fruits',
  'Floriculture',
];

export default function PlantFormModal({ plant, isOpen, onClose, onSave }: PlantFormModalProps) {
  const [commonName, setCommonName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<PlantCategory>('Vegetables & Commercial Saplings');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plant) {
      setCommonName(plant.commonName);
      setScientificName(plant.scientificName);
      setCategory(plant.category);
      setImageUrl(plant.imageUrl);
      setDescription(plant.description);
    } else {
      setCommonName('');
      setScientificName('');
      setCategory('Vegetables & Commercial Saplings');
      setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');
      setDescription('');
    }
  }, [plant, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        commonName,
        scientificName,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        description,
      });
      onClose();
    } catch (err) {
      console.error('Error saving parent crop:', err);
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-sage-50">
            <div>
              <h2 className="text-xl font-bold font-serif text-forest-900">
                {plant ? 'Edit Parent Crop' : 'Add New Parent Crop'}
              </h2>
              <p className="text-xs text-emerald-700 font-medium">
                Configure main crop category and details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Common Name & Scientific Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Parent Crop Name *
                </label>
                <input
                  type="text"
                  required
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  placeholder="e.g. Chilly (Mirchi), Tomato, Roses"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Scientific / Botanical Name
                </label>
                <input
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="e.g. Capsicum annuum"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium italic"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlantCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Cloudinary Image Uploader */}
            <ImageUploader
              currentUrl={imageUrl}
              onImageChange={(url) => setImageUrl(url)}
            />

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Crop Overview & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High yield seedling traits and climate suitability..."
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
                {saving ? 'Saving...' : plant ? 'Update Crop' : 'Save Crop'}
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
