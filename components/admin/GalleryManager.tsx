'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import ImageUploader from './ImageUploader';

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Greenhouse');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      }
    } catch (err) {
      console.error('Failed fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, imageUrl, caption }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setTitle('');
        setImageUrl('');
        setCaption('');
        fetchGallery();
      }
    } catch (err) {
      console.error('Error adding photo:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo from the nursery gallery?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Action */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
        <div>
          <h3 className="text-xl font-bold font-serif text-forest-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" /> Nursery Infrastructure Gallery Manager
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload actual photos of nursery beds, polyhouses, shade nets, and healthy root saplings.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Upload New Photo
        </button>
      </div>

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-sage-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-forest-900/90 text-emerald-200 text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="text-sm font-bold text-forest-900">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{item.caption}</p>
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-end">
              <button
                onClick={() => handleDeletePhoto(item.id)}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" /> Delete Photo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif text-forest-900">
                Upload Gallery Infrastructure Photo
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Automated Polyhouse Germination Unit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                >
                  <option value="Greenhouse">Greenhouse</option>
                  <option value="Root Trainers">Root Trainers</option>
                  <option value="Polyhouse">Polyhouse</option>
                  <option value="Shade Net">Shade Net</option>
                  <option value="Farm Delivery">Farm Delivery</option>
                </select>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                currentUrl={imageUrl}
                onImageChange={(url) => setImageUrl(url)}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Details about shade net percentage, root aeration, or plug tray capacity..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Uploading...' : 'Save to Gallery'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
