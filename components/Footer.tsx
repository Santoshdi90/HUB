'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber);

  return (
    <footer className="bg-[#081c15] text-emerald-100/80 pt-16 pb-12 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/40">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-white">
                <Image
                  src={settings.logoUrl}
                  alt={settings.nurseryName}
                  fill
                  className="object-cover p-0.5"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {settings.nurseryName}
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  {settings.locationTagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/70 max-w-md leading-relaxed">
              Karnataka's trusted nursery for commercial forestry, high-yielding horticulture fruits, tissue culture bamboo, and premium plantation crops. Direct bulk farm delivery.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Healthy Root & Genetic Purity Guarantee
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Nursery Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#catalog-section" className="hover:text-emerald-300 transition-colors">Commercial Forestry</a></li>
              <li><a href="#catalog-section" className="hover:text-emerald-300 transition-colors">Horticulture & Fruit Trees</a></li>
              <li><a href="#catalog-section" className="hover:text-emerald-300 transition-colors">Plantation Crops</a></li>
              <li><a href="#catalog-section" className="hover:text-emerald-300 transition-colors">Flowering & Foliage</a></li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Inquiries
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.phone1}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.phone2}</span>
              </p>
              <p className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-4">
          <p>© {new Date().getFullYear()} {settings.nurseryName}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <Link href="/admin" className="hover:text-white transition-colors underline">
              Admin Login Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
