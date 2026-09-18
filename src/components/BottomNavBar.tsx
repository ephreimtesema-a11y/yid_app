import React from 'react';
import { Home, Music, Calendar, User, BookOpen } from 'lucide-react';
import { ActiveScreen, AppTheme, AppLanguage } from '../types';
import { getTranslation } from '../lib/translations';

interface BottomNavBarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  theme: AppTheme;
  language?: AppLanguage;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeScreen,
  onNavigate,
  theme,
  language = 'am'
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 max-w-[420px] mx-auto z-40 pointer-events-none select-none">
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className={`pointer-events-auto rounded-full px-2 py-1.5 backdrop-blur-2xl border transition-all duration-300 ${
          isDark
            ? 'bg-[#091222]/90 border-white/10 text-slate-400 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]'
            : 'bg-[#FCF9F2]/90 border-amber-900/15 text-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="flex items-center justify-between h-14 relative px-1">
          {/* 1. Home / መነሻ */}
          <button
            onClick={() => onNavigate('home')}
            id="nav-tab-home"
            className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all duration-200 active:scale-90 ${
              activeScreen === 'home'
                ? isDark
                  ? 'text-amber-400 font-semibold'
                  : 'text-amber-800 font-semibold'
                : 'hover:text-amber-300/80 opacity-70'
            }`}
          >
            {activeScreen === 'home' && (
              <span className="absolute inset-x-2 inset-y-1 rounded-full bg-amber-400/15 -z-10 animate-fade-in" />
            )}
            <Home className={`w-[21px] h-[21px] transition-transform ${activeScreen === 'home' ? 'scale-110 drop-shadow-[0_2px_8px_rgba(226,179,80,0.3)]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium font-ethiopic">{t.navHome}</span>
          </button>

          {/* 2. Songs / መዝሙራት */}
          <button
            onClick={() => onNavigate('songs')}
            id="nav-tab-songs"
            className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all duration-200 active:scale-90 ${
              activeScreen === 'songs' || activeScreen === 'song-detail'
                ? isDark
                  ? 'text-amber-400 font-semibold'
                  : 'text-amber-800 font-semibold'
                : 'hover:text-amber-300/80 opacity-70'
            }`}
          >
            {(activeScreen === 'songs' || activeScreen === 'song-detail') && (
              <span className="absolute inset-x-2 inset-y-1 rounded-full bg-amber-400/15 -z-10 animate-fade-in" />
            )}
            <Music className={`w-[21px] h-[21px] transition-transform ${activeScreen === 'songs' || activeScreen === 'song-detail' ? 'scale-110 drop-shadow-[0_2px_8px_rgba(226,179,80,0.3)]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium font-ethiopic">{t.navSongs}</span>
          </button>

          {/* 3. Center Elevated Floating Library Button / ቤተ-መጻሕፍት */}
          <div className="flex flex-col items-center justify-center px-1.5 -mt-3.5">
            <button
              onClick={() => onNavigate('library')}
              id="nav-tab-library-center"
              aria-label={t.navLibrary}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xl border-2 ${
                activeScreen === 'library'
                  ? 'bg-gradient-to-tr from-[#E5B242] to-[#FBF2B7] border-amber-300 text-slate-950 ring-4 ring-amber-400/25 shadow-amber-500/30'
                  : isDark
                  ? 'bg-[#132038] border-amber-400/40 text-amber-300 hover:border-amber-400 hover:scale-105'
                  : 'bg-[#EDE4D0] border-amber-600/40 text-amber-900 hover:border-amber-600 hover:scale-105'
              }`}
            >
              {/* 3 hymnbooks angled glyph */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="drop-shadow-sm"
              >
                <line x1="6" y1="4" x2="6" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="18" y1="5" x2="20" y2="19" strokeWidth="2.2" />
              </svg>
            </button>
            <span
              className={`text-[9px] font-bold tracking-wider uppercase mt-1 font-ethiopic ${
                activeScreen === 'library'
                  ? isDark
                    ? 'text-amber-400'
                    : 'text-amber-900'
                  : 'opacity-60 text-slate-400'
              }`}
            >
              {t.navLibrary}
            </span>
          </div>

          {/* 4. Schedule / መርሐ-ግብር */}
          <button
            onClick={() => onNavigate('schedule')}
            id="nav-tab-schedule"
            className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all duration-200 active:scale-90 ${
              activeScreen === 'schedule'
                ? isDark
                  ? 'text-amber-400 font-semibold'
                  : 'text-amber-800 font-semibold'
                : 'hover:text-amber-300/80 opacity-70'
            }`}
          >
            {activeScreen === 'schedule' && (
              <span className="absolute inset-x-2 inset-y-1 rounded-full bg-amber-400/15 -z-10 animate-fade-in" />
            )}
            <Calendar className={`w-[21px] h-[21px] transition-transform ${activeScreen === 'schedule' ? 'scale-110 drop-shadow-[0_2px_8px_rgba(226,179,80,0.3)]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium font-ethiopic">{t.navSchedule}</span>
          </button>

          {/* 5. Profile / መገለጫ */}
          <button
            onClick={() => onNavigate('profile')}
            id="nav-tab-profile"
            className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all duration-200 active:scale-90 ${
              activeScreen === 'profile'
                ? isDark
                  ? 'text-amber-400 font-semibold'
                  : 'text-amber-800 font-semibold'
                : 'hover:text-amber-300/80 opacity-70'
            }`}
          >
            {activeScreen === 'profile' && (
              <span className="absolute inset-x-2 inset-y-1 rounded-full bg-amber-400/15 -z-10 animate-fade-in" />
            )}
            <User className={`w-[21px] h-[21px] transition-transform ${activeScreen === 'profile' ? 'scale-110 drop-shadow-[0_2px_8px_rgba(226,179,80,0.3)]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium font-ethiopic">{t.navProfile}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
