'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { getStoredSettings, EVENT_STORE_UPDATED } from '@/lib/persistentStore';

interface SplashScreenProps {
  settings: SiteSettings;
  onComplete: () => void;
}

export default function SplashScreen({ settings: initialSettings, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  useEffect(() => {
    // Hydrate active logo & settings from browser store
    setSettings(getStoredSettings(initialSettings));

    const handleStoreUpdate = () => {
      setSettings(getStoredSettings(initialSettings));
    };

    window.addEventListener(EVENT_STORE_UPDATED, handleStoreUpdate);

    // Auto transition after 1.8s
    const timer = setTimeout(() => {
      handleComplete();
    }, 1800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(EVENT_STORE_UPDATED, handleStoreUpdate);
    };
  }, [initialSettings]);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 400); // match exit animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#081c15] via-[#1B4332] to-[#2D6A4F] text-white px-4 select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Glowing Particles */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-forest-700/20 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Floating Logo Container */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mb-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-forest-900/60"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-emerald-400/50 bg-white">
                <Image
                  src={settings.logoUrl}
                  alt={settings.nurseryName}
                  fill
                  className="object-cover p-1 rounded-full"
                  priority
                  unoptimized
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full border border-dashed border-emerald-300/40 pointer-events-none"
              />
            </motion.div>

            {/* Glowing Accent Dot */}
            <div className="absolute -top-1 -right-1 bg-emerald-400 p-1.5 rounded-full shadow-glow">
              <Sparkles className="w-4 h-4 text-forest-900 animate-pulse" />
            </div>
          </motion.div>

          {/* Animated Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center max-w-lg"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs tracking-wider uppercase font-semibold border border-emerald-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Hi-Tech Grafted & Tissue Culture
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2 font-serif drop-shadow-md">
              {settings.nurseryName}
            </h1>
            <p className="text-emerald-200/90 text-sm md:text-base font-medium tracking-wide">
              — {settings.locationTagline} —
            </p>
          </motion.div>

          {/* Progress Indicator & Instant Skip Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            {/* Animated Loading Bar */}
            <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-white"
              />
            </div>

            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-sm border border-white/15 transition-all hover:scale-105 active:scale-95"
            >
              Skip Intro <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
