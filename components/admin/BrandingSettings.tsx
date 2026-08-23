'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import ImageUploader from './ImageUploader';
import { saveStoredSettings } from '@/lib/persistentStore';

interface BrandingSettingsProps {
  settings: SiteSettings;
  onSaveSettings: (updated: Partial<SiteSettings>) => Promise<void>;
}

export default function BrandingSettings({ settings: initialSettings, onSaveSettings }: BrandingSettingsProps) {
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl);
  const [nurseryName, setNurseryName] = useState(initialSettings.nurseryName);
  const [locationTagline, setLocationTagline] = useState(initialSettings.locationTagline);
  const [phone1, setPhone1] = useState(initialSettings.phone1);
  const [phone2, setPhone2] = useState(initialSettings.phone2);
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.whatsappNumber);
  const [address, setAddress] = useState(initialSettings.address);
  const [timings, setTimings] = useState(initialSettings.timings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const updatedData: Partial<SiteSettings> = {
      logoUrl,
      nurseryName,
      locationTagline,
      phone1,
      phone2,
      whatsappNumber,
      address,
      timings,
    };

    // 1. Save directly to persistent browser store for immediate refresh & cross-tab sync
    saveStoredSettings(updatedData, initialSettings);

    // 2. Trigger API update
    try {
      await onSaveSettings(updatedData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* Save Toast Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Nursery Branding & Contact details updated successfully! Reflected across site immediately.</span>
          </div>
        </div>
      )}

      {/* Logo Management Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-4">
        <h3 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
          Official Nursery Logo & Branding Header
        </h3>
        <p className="text-xs text-gray-500">
          Upload or replace the official circular nursery logo via Cloudinary. This logo automatically updates on the Floating Splash Screen, Sticky Navbar, and Footer.
        </p>

        <ImageUploader
          currentUrl={logoUrl}
          onImageChange={(url) => {
            setLogoUrl(url);
            saveStoredSettings({ logoUrl: url }, initialSettings);
          }}
        />
      </div>

      {/* Brand Names */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-4">
        <h3 className="text-lg font-bold font-serif text-forest-900">
          Nursery Name & Sub-Heading
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Nursery Business Name
            </label>
            <input
              type="text"
              required
              value={nurseryName}
              onChange={(e) => setNurseryName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Location Tagline / Subtitle
            </label>
            <input
              type="text"
              required
              value={locationTagline}
              onChange={(e) => setLocationTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Contact Numbers & WhatsApp */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-4">
        <h3 className="text-lg font-bold font-serif text-forest-900">
          Contact Helplines & WhatsApp Ordering
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Primary Phone Line
            </label>
            <input
              type="text"
              required
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Secondary Phone Line
            </label>
            <input
              type="text"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              WhatsApp Order Number
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Address & Timings */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-4">
        <h3 className="text-lg font-bold font-serif text-forest-900">
          Physical Address & Operating Timings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Nursery Address (Location)
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Operating Hours / Timings
            </label>
            <input
              type="text"
              required
              value={timings}
              onChange={(e) => setTimings(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save All Branding & Contact Settings'}
        </button>
      </div>

    </form>
  );
}
