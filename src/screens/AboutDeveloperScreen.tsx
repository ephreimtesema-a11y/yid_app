import React from 'react';
import { ArrowLeft, Code2, Globe, Mail, Send, Github, Heart, Sparkles, Terminal } from 'lucide-react';
import { AppTheme } from '../types';

interface AboutDeveloperScreenProps {
  theme: AppTheme;
  onBack: () => void;
}

export const AboutDeveloperScreen: React.FC<AboutDeveloperScreenProps> = ({ theme, onBack }) => {
  const isDark = theme === 'dark';

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Top Header matching Screenshot 9 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-cinzel text-lg font-bold">About Developer</span>
      </div>

      {/* Developer Profile Card matching Screenshot 9 */}
      <div
        className={`p-6 rounded-3xl border text-center flex flex-col items-center justify-center space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-100 shadow-xl'
            : 'bg-white border-amber-900/15 text-slate-900 shadow-md'
        }`}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5D886] via-[#DFA944] to-[#B3781F] flex items-center justify-center text-slate-950 font-serif font-bold text-3xl shadow-xl ring-4 ring-amber-500/20">
          E
        </div>

        <div>
          <h2 className="font-serif font-bold text-xl">Ephraim Tessema</h2>
          <p className="text-xs text-amber-400 font-medium">
            Mobile & Full-Stack Systems Engineer
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          Passionate about building church ministry applications, local-first offline synchronization engines, and high-fidelity vocal rehearsal software for choirs across the globe.
        </p>
      </div>

      {/* Technology Architecture */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Terminal className="w-4 h-4" />
          <span>App Architecture & Technologies</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="font-semibold text-amber-400 block">Flutter & Dart</span>
            <span className="text-[11px] text-slate-400">Cross-Platform Core</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="font-semibold text-amber-400 block">Supabase</span>
            <span className="text-[11px] text-slate-400">Postgres, Auth & Media</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="font-semibold text-amber-400 block">Offline Cache</span>
            <span className="text-[11px] text-slate-400">Local-First Sync Queue</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="font-semibold text-amber-400 block">Web Audio API</span>
            <span className="text-[11px] text-slate-400">Voice Part Harmonies</span>
          </div>
        </div>
      </div>

      {/* Contact Links */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-[#111A2E] border-slate-800 text-slate-200'
            : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
        }`}
      >
        <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Get In Touch
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <a
            href="mailto:ephraimtessema@gmail.com"
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>ephraimtessema@gmail.com</span>
          </a>
          <a
            href="https://t.me/ephraimtessema"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Telegram: @ephraimtessema</span>
          </a>
        </div>
      </div>
    </div>
  );
};
