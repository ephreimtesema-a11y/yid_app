import React from 'react';
import { 
  Headphones, 
  Heart, 
  Download, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  CheckCircle, 
  Music2,
  Users
} from 'lucide-react';
import { Song, ScheduleEvent, AppTheme, ActiveScreen, Devotional, AppLanguage } from '../types';
import { getTranslation, getCategoryLabel } from '../lib/translations';

interface HomeScreenProps {
  songs: Song[];
  schedules: ScheduleEvent[];
  devotionals: Devotional[];
  theme: AppTheme;
  language?: AppLanguage;
  onSelectSong: (song: Song) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onToggleRSVP: (scheduleId: string) => void;
  onFilterCategory?: (cat: string) => void;
  isOfflineMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  songs,
  schedules,
  devotionals,
  theme,
  language = 'am',
  onSelectSong,
  onNavigate,
  onToggleRSVP,
  isOfflineMode
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);
  const isAm = language === 'am';

  const upcomingEvents = schedules.filter((e) => !e.isPast);
  const nextEvent = upcomingEvents[0];
  const featuredDevotional = devotionals[0];

  return (
    <div className="pb-32 pt-3 px-4 max-w-lg mx-auto space-y-6 animate-fade-in font-ethiopic">
      {/* Offline Alert Banner if offline */}
      {isOfflineMode && (
        <div className={`p-3 rounded-2xl flex items-center justify-between text-xs border ${
          isDark 
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' 
            : 'bg-amber-100/80 border-amber-300 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-medium">{t.offlineNotice}</span>
          </div>
          <button 
            onClick={() => onNavigate('settings')}
            className="text-[11px] underline font-semibold"
          >
            {isAm ? 'ቅንብሮች' : 'Manage'}
          </button>
        </div>
      )}

      {/* QUICK ACCESS Section */}
      <div>
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60 mb-3">
          {isAm ? 'ፈጣን አገልግሎቶች' : 'QUICK ACCESS'}
        </h2>
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Audio */}
          <button
            onClick={() => onNavigate('songs')}
            id="quick-access-audio"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-all shrink-0 ${
              isDark
                ? 'bg-[#131F35] border-slate-700/60 text-slate-200 hover:border-amber-400/50 hover:bg-[#182845]'
                : 'bg-white border-amber-900/15 text-slate-800 hover:border-amber-500 shadow-sm'
            }`}
          >
            <Headphones className="w-4 h-4 text-amber-500" />
            <span>{isAm ? 'የልምምድ ድምፅ' : 'Audio'}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => onNavigate('library')}
            id="quick-access-favorites"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-all shrink-0 ${
              isDark
                ? 'bg-[#131F35] border-slate-700/60 text-slate-200 hover:border-amber-400/50 hover:bg-[#182845]'
                : 'bg-white border-amber-900/15 text-slate-800 hover:border-amber-500 shadow-sm'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-500" />
            <span>{isAm ? 'የተወደዱ' : 'Favorites'}</span>
          </button>

          {/* Downloads */}
          <button
            onClick={() => onNavigate('library')}
            id="quick-access-downloads"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-all shrink-0 ${
              isDark
                ? 'bg-[#131F35] border-slate-700/60 text-slate-200 hover:border-amber-400/50 hover:bg-[#182845]'
                : 'bg-white border-amber-900/15 text-slate-800 hover:border-amber-500 shadow-sm'
            }`}
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>{isAm ? 'ከመስመር ውጭ' : 'Downloads'}</span>
          </button>

          {/* Hymns */}
          <button
            onClick={() => onNavigate('songs')}
            id="quick-access-hymns"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-all shrink-0 ${
              isDark
                ? 'bg-[#131F35] border-slate-700/60 text-slate-200 hover:border-amber-400/50 hover:bg-[#182845]'
                : 'bg-white border-amber-900/15 text-slate-800 hover:border-amber-500 shadow-sm'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{isAm ? 'መዝሙራት' : 'Hymns'}</span>
          </button>
        </div>
      </div>

      {/* RECENTLY ADDED Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">
            {isAm ? 'በቅርብ የተጨመሩ መዝሙራት' : 'RECENTLY ADDED'}
          </h2>
          <button
            onClick={() => onNavigate('songs')}
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1"
          >
            {isAm ? 'ሁሉንም እይ' : 'See All'} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carousel / Horizontal cards */}
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar py-1">
          {songs.slice(0, 6).map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              id={`song-card-${song.id}`}
              className={`w-44 shrink-0 rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#111B30] border-slate-700/50 hover:border-amber-500/50 shadow-lg'
                  : 'bg-white border-amber-900/15 hover:border-amber-400 shadow-md'
              }`}
            >
              {/* Upper Section: Hymn Icon */}
              <div
                className={`h-28 flex items-center justify-center ${
                  isDark
                    ? 'bg-gradient-to-b from-[#1C2C4E]/40 to-transparent'
                    : 'bg-gradient-to-b from-amber-100/70 to-amber-50/20'
                }`}
              >
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <BookOpen className="w-9 h-9 text-amber-400 stroke-[1.5]" />
                </div>
              </div>

              {/* Lower Section: Amharic Title & Category */}
              <div
                className={`p-3.5 border-t ${
                  isDark
                    ? 'bg-[#0E172A] border-slate-800 text-slate-100'
                    : 'bg-[#FCFAF6] border-amber-900/10 text-slate-900'
                }`}
              >
                <div className="font-semibold text-base truncate">
                  {song.amharicTitle || song.title}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span className="font-medium">{getCategoryLabel(song.category, language)}</span>
                  {song.audioUrl && (
                    <Headphones className="w-3 h-3 text-amber-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEXT UPCOMING REHEARSAL / EVENT CARD */}
      {nextEvent && (
        <div
          className={`rounded-2xl p-4 border transition-all ${
            isDark
              ? 'bg-[#121E36] border-amber-500/20 text-slate-100 shadow-lg'
              : 'bg-[#FCF9F2] border-amber-900/15 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-500">
                {isAm ? 'ቀጣይ የዝማሬ ልምምድ' : 'Next Rehearsal'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-0.5"
            >
              {isAm ? 'ሁሉንም ፕሮግራሞች' : 'All Events'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <h3 className="font-semibold text-base mb-2">
            {nextEvent.title}
          </h3>

          <div className="space-y-1.5 text-xs text-slate-300 opacity-90 mb-3.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{nextEvent.date} • {nextEvent.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{nextEvent.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/40">
            <span className="text-[11px] text-slate-400">
              {isAm ? 'ተፈላጊ ክፍሎች፡ ' : 'Voice Parts: '}{nextEvent.voicePartsNeeded.join(', ')}
            </span>
            <button
              onClick={() => onToggleRSVP(nextEvent.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                nextEvent.isAttending
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
            >
              {nextEvent.isAttending ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> {isAm ? 'እገኛለሁ' : 'Attending'}
                </>
              ) : (
                isAm ? 'እገኛለሁ (አረጋግጥ)' : 'RSVP Yes'
              )}
            </button>
          </div>
        </div>
      )}

      {/* SPIRITUAL DEVOTIONAL HIGHLIGHT */}
      {featuredDevotional && (
        <div
          onClick={() => onNavigate('devotionals')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            isDark
              ? 'bg-[#10182C] border-slate-800 text-slate-200 hover:border-amber-500/40'
              : 'bg-white border-amber-900/10 text-slate-800 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isAm ? 'የዕለቱ ቃልና ጸሎት' : 'Choir Devotional'}
          </div>
          <h4 className="font-semibold text-sm mb-1">{featuredDevotional.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 italic font-serif">
            "{featuredDevotional.scripture}"
          </p>
        </div>
      )}
    </div>
  );
};
