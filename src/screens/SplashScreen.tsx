import React, { useEffect } from 'react';
import { ChoirLogo } from '../components/ChoirLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      onClick={onFinish}
      className="fixed inset-0 z-50 bg-[#0A1325] flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-700 overflow-hidden"
    >
      <div className="flex flex-col items-center animate-fade-in text-center px-6 max-w-sm">
        {/* Subtle ambient golden radiance behind the sacred emblem */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-125 pointer-events-none" />
          <ChoirLogo size="xl" showText={false} />
        </div>

        {/* YIDIDYA Wordmark matching real official splash screen */}
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4C2] via-[#F5D87F] to-[#C98F26] drop-shadow-[0_4px_20px_rgba(226,179,80,0.35)] pl-1">
          YIDIDYA
        </h1>

        {/* Amharic Choir Subtitle */}
        <p className="mt-3 text-xs tracking-wider text-amber-200/60 font-ethiopic">
          የይዲድያ መዘምራን • አዳማ ዩኒቨርሲቲ
        </p>

        {/* Gentle breathing indicator bar */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
