'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Sprout, Award, PhoneCall, ArrowDown } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';

interface HeroBannerProps {
  settings: SiteSettings;
  onExploreClick: () => void;
}

export default function HeroBanner({ settings, onExploreClick }: HeroBannerProps) {
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white py-16 md:py-24 border-b border-emerald-800/40">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Hero Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-400" />
              Karnataka's Premier Hi-Tech Plant Nursery
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-tight tracking-tight text-white">
              Cultivating Excellence with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sage-200 to-white">Hi-Tech Breed Saplings</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-light leading-relaxed">
              Supplying farmers and commercial growers across Karnataka & Maharashtra with tissue cultured  all varieties of plants  and high-yield Horticulture plants from our Inchageri estate.
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Quality Spec</div>
                  <div className="text-sm font-bold text-white">Hi-Tech Breeds</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Order Capacity</div>
                  <div className="text-sm font-bold text-white">Bulk Farm Supply</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Guaranteed</div>
                  <div className="text-sm font-bold text-white">Healthy Roots</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 bg-white text-forest-900 font-bold px-6 py-3.5 rounded-full text-sm shadow-xl hover:bg-emerald-100 transition-all hover:scale-105 active:scale-95"
              >
                Browse Plant Catalog <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={`tel:${settings.phone1.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold px-6 py-3.5 rounded-full text-sm border border-emerald-500/40 backdrop-blur-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" /> Call Nursery Directly
              </a>
            </div>
          </motion.div>

          {/* Right Botanical Showcase Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-forest-900">
              <img
                src="https://media.istockphoto.com/id/505307313/photo/greenhouse-for-the-cultivation-of-salad.jpg?s=612x612&w=0&k=20&c=pahV2bgiT7ClQLLa6WmHtDf6Ijf3rZnMFow4mG5Tg2o="
                alt="Rani Channamma Hitech Nursery"
                className="w-full h-96 object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/40 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-forest-950 text-xs font-extrabold uppercase">
                  Featured Farm Nursery
                </div>
                <h3 className="text-xl font-bold font-serif text-white">
                  Rani Channamma Hitech Nursery
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  Horti Road, Inchageri, Vijayapura • High Yield Sapling Nursery
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
