'use client';

import { Phone, MapPin, Clock, MessageSquare, ExternalLink, Navigation } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber);

  return (
    <section className="py-16 bg-white border-t border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Contact & Nursery Details */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Visit Nursery
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-white mt-3">
                  Get in Touch & Order
                </h2>
                <p className="text-emerald-100/80 text-xs md:text-sm mt-1">
                  We welcome farmers, estate managers, and gardening enthusiasts to inspect our hi-tech greenhouse stock directly.
                </p>
              </div>

              <div className="space-y-5">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10 text-emerald-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-200 uppercase">Nursery Address</h4>
                    <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10 text-emerald-300 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-200 uppercase">Operating Hours</h4>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {settings.timings}
                    </p>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10 text-emerald-300 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-emerald-200 uppercase">Direct Helpline Numbers</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={`tel:${settings.phone1.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-bold text-xs border border-emerald-400/30 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {settings.phone1}
                      </a>
                      <a
                        href={`tel:${settings.phone2.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-bold text-xs border border-emerald-400/30 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {settings.phone2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-6 border-t border-emerald-700/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-bold py-3.5 px-6 rounded-2xl text-xs shadow-lg transition-all hover:scale-102"
              >
                <MessageSquare className="w-4 h-4 fill-forest-950" />
                Chat on WhatsApp ({settings.whatsappNumber})
              </a>
            </div>

          </div>

          {/* Right Map View */}
          <div className="lg:col-span-7 bg-warm-50 rounded-3xl overflow-hidden border border-emerald-900/10 shadow-lg relative flex flex-col">
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-forest-900">
                  Google Map Directions — Horti Road, Inchageri
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Horti+Road+Inchageri+Vijayapura+Karnataka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Open Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full min-h-[360px] relative">
              <iframe
                title="Rani Channamma Hitech Nursery Map Location"
                src={settings.googleMapsUrl}
                className="w-full h-full border-0 absolute inset-0 min-h-[360px]"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
