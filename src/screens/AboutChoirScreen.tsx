import React from 'react';
import { ArrowLeft, Church, Heart, Music, Clock, MapPin, Send, Mail, Youtube, Phone } from 'lucide-react';
import { ChoirLogo } from '../components/ChoirLogo';
import { AppTheme } from '../types';

interface AboutChoirScreenProps {
  theme: AppTheme;
  onBack: () => void;
}

export const AboutChoirScreen: React.FC<AboutChoirScreenProps> = ({ theme, onBack }) => {
  const isDark = theme === 'dark';

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Top Bar with Back Arrow */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-cinzel text-lg font-bold">About Yididya Choir</span>
      </div>

      {/* Hero Brand Card matching Screenshot 8 */}
      <div
        className={`p-6 rounded-3xl border text-center flex flex-col items-center justify-center relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#152238] to-[#0E172A] border-amber-500/20 shadow-xl'
            : 'bg-gradient-to-b from-amber-100/70 to-amber-50/30 border-amber-900/15 shadow-md'
        }`}
      >
        <div className="mb-4">
          <ChoirLogo size="lg" showText={false} />
        </div>

        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F9E29D] via-[#E2B350] to-[#C78F2E]">
          YIDIDYA
        </h1>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-amber-400/90 font-semibold mt-1">
          CHOIR
        </p>
        <p className="text-xs text-slate-400 max-w-xs mt-3 italic font-serif">
          "Praise the Lord with song; worship Him in the beauty of holiness."
        </p>
      </div>

      {/* Our Mission Card matching Screenshot 8 */}
      <div
        className={`p-5 rounded-2xl border space-y-2.5 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Heart className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          To glorify God through spirit-filled worship, vocal excellence, and Christ-centered fellowship, ministering to the congregation and reaching souls through the power of gospel music.
        </p>
      </div>

      {/* Rehearsal Schedule Card matching Screenshot 8 */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Clock className="w-4 h-4" />
          <span>Rehearsal Times</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="font-semibold text-amber-400">Saturdays (Main Practice)</div>
            <div className="text-slate-400 text-[11px]">3:00 PM – 5:30 PM • Main Sanctuary</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="font-semibold text-amber-400">Sundays (Pre-Worship Warmup)</div>
            <div className="text-slate-400 text-[11px]">8:00 AM – 9:00 AM • Choir Hall</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="font-semibold text-amber-400">Wednesdays (Voice Training)</div>
            <div className="text-slate-400 text-[11px]">6:00 PM – 7:30 PM • Sectional Rooms</div>
          </div>
        </div>
      </div>

      {/* Voice Sections */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Music className="w-4 h-4" />
          <span>Voice Sections</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
            <span className="font-semibold text-amber-400 block">Soprano</span>
            <span className="text-[11px] text-slate-400">14 Members</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
            <span className="font-semibold text-amber-400 block">Alto</span>
            <span className="text-[11px] text-slate-400">12 Members</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
            <span className="font-semibold text-amber-400 block">Tenor</span>
            <span className="text-[11px] text-slate-400">10 Members</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
            <span className="font-semibold text-amber-400 block">Bass</span>
            <span className="text-[11px] text-slate-400">8 Members</span>
          </div>
        </div>
      </div>

      {/* Connect & Contact */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Connect With Us
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-amber-400" />
            <span>Telegram Channel: @YididyaChoir</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Youtube className="w-4 h-4 text-red-400" />
            <span>YouTube: Yididya Gospel Ministry</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email: yididyachoir@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
