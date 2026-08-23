'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Phone, MessageSquare, Shield, Menu, X } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';

interface NavbarProps {
  settings: SiteSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ settings, searchQuery, onSearchChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber);

  return (
    <header className="sticky top-0 z-40 bg-[#1B4332]/95 backdrop-blur-md border-b border-emerald-800/40 text-white shadow-lg">
      <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-white shadow-md group-hover:scale-105 transition-transform">
              <Image
                src={settings.logoUrl}
                alt={settings.nurseryName}
                fill
                className="object-cover p-0.5"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-serif leading-tight text-white group-hover:text-emerald-300 transition-colors">
                {settings.nurseryName}
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium">
                📍 {settings.locationTagline}
              </p>
            </div>
          </Link>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search saplings (e.g. Teak, Sandalwood, Dragon Fruit)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 text-white placeholder-emerald-200/60 border border-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-sm transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-emerald-300 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-emerald-300 hover:text-white text-xs bg-white/10 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${settings.phone1.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{settings.phone1}</span>
            </a>

            <Link
              href="/admin"
              className="text-xs font-semibold text-emerald-200/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Admin Portal
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold px-4 py-2.5 rounded-full text-xs shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-forest-950" />
              Order on WhatsApp
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-500 text-forest-950 font-bold text-xs"
              title="Order on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-forest-950" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Expandable */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-800/40 space-y-3 pb-6 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                placeholder="Search saplings & plants..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 text-white placeholder-emerald-200/60 border border-emerald-600/40 text-sm focus:outline-none"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-emerald-300" />
            </div>

            <div className="flex flex-col gap-2 pt-2 text-sm font-medium">
              <a
                href={`tel:${settings.phone1.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-emerald-200 py-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Us: {settings.phone1}</span>
              </a>
              <a
                href={`tel:${settings.phone2.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-emerald-200 py-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Alt: {settings.phone2}</span>
              </a>
              <Link
                href="/admin"
                className="text-emerald-300 py-2 hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Admin Dashboard Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
