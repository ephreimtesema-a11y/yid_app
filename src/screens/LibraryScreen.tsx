import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  Download, 
  Clock, 
  ListMusic, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';
import { Song, AppTheme, ActiveScreen, AppLanguage } from '../types';
import { getTranslation, getCategoryLabel } from '../lib/translations';

interface LibraryScreenProps {
  songs: Song[];
  theme: AppTheme;
  language?: AppLanguage;
  onSelectSong: (song: Song) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onToggleFavorite: (songId: string) => void;
  onToggleDownload: (songId: string) => void;
}

type LibraryTab = 'favorites' | 'downloads' | 'recent' | 'playlists';

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  songs,
  theme,
  language = 'am',
  onSelectSong,
  onNavigate,
  onToggleFavorite,
  onToggleDownload
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);
  const isAm = language === 'am';

  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter songs according to active tab
  const getFilteredSongs = () => {
    let list: Song[] = [];
    if (activeTab === 'favorites') {
      list = songs.filter((s) => s.isFavorite);
    } else if (activeTab === 'downloads') {
      list = songs.filter((s) => s.isDownloaded);
    } else if (activeTab === 'recent') {
      list = songs.slice(0, 4);
    } else {
      list = songs.filter((s) => s.category === 'Worship');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.amharicTitle.includes(q) ||
          s.writtenBy.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const currentSongs = getFilteredSongs();

  return (
    <div className="pb-36 pt-4 px-4 max-w-lg mx-auto space-y-5 animate-fade-in font-ethiopic">
      {/* Header */}
      <div>
        <h1 className="font-cinzel text-2xl font-bold tracking-tight text-white dark:text-white">
          {isAm ? 'ቤተ-መጻሕፍት' : 'Library'}
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {isAm ? 'የግል መዝሙራትና የተቀመጡ ስብስቦች' : 'Your personal collection'}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAm ? 'በቤተ-መጻሕፍትዎ ውስጥ ይፈልጉ...' : 'Search your library...'}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition outline-none ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500'
              : 'bg-white border-amber-900/15 text-slate-900 placeholder-slate-400 focus:border-amber-600'
          }`}
        />
      </div>

      {/* 4 Category Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Favorites */}
        <button
          onClick={() => setActiveTab('favorites')}
          className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${
            activeTab === 'favorites'
              ? isDark
                ? 'bg-[#131F35] border-amber-500 text-amber-400 shadow-md ring-1 ring-amber-500/30'
                : 'bg-amber-100/60 border-amber-600 text-amber-900 shadow-md'
              : isDark
              ? 'bg-[#10182C] border-slate-800/80 text-slate-300 hover:border-slate-700'
              : 'bg-white border-amber-900/10 text-slate-700 hover:border-amber-300'
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition ${
              activeTab === 'favorites'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-50 text-slate-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'favorites' ? 'fill-slate-950 text-slate-950' : ''
              }`}
            />
          </div>
          <span className="text-xs font-semibold">{t.favorites}</span>
        </button>

        {/* Downloads */}
        <button
          onClick={() => setActiveTab('downloads')}
          className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${
            activeTab === 'downloads'
              ? isDark
                ? 'bg-[#131F35] border-amber-500 text-amber-400 shadow-md ring-1 ring-amber-500/30'
                : 'bg-amber-100/60 border-amber-600 text-amber-900 shadow-md'
              : isDark
              ? 'bg-[#10182C] border-slate-800/80 text-slate-300 hover:border-slate-700'
              : 'bg-white border-amber-900/10 text-slate-700 hover:border-amber-300'
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition ${
              activeTab === 'downloads'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-50 text-slate-500'
            }`}
          >
            <Download className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{t.downloads}</span>
        </button>

        {/* Recently Played */}
        <button
          onClick={() => setActiveTab('recent')}
          className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${
            activeTab === 'recent'
              ? isDark
                ? 'bg-[#131F35] border-amber-500 text-amber-400 shadow-md ring-1 ring-amber-500/30'
                : 'bg-amber-100/60 border-amber-600 text-amber-900 shadow-md'
              : isDark
              ? 'bg-[#10182C] border-slate-800/80 text-slate-300 hover:border-slate-700'
              : 'bg-white border-amber-900/10 text-slate-700 hover:border-amber-300'
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition ${
              activeTab === 'recent'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-50 text-slate-500'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{isAm ? 'በቅርብ የተከፈቱ' : 'Recently Played'}</span>
        </button>

        {/* Playlists */}
        <button
          onClick={() => setActiveTab('playlists')}
          className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${
            activeTab === 'playlists'
              ? isDark
                ? 'bg-[#131F35] border-amber-500 text-amber-400 shadow-md ring-1 ring-amber-500/30'
                : 'bg-amber-100/60 border-amber-600 text-amber-900 shadow-md'
              : isDark
              ? 'bg-[#10182C] border-slate-800/80 text-slate-300 hover:border-slate-700'
              : 'bg-white border-amber-900/10 text-slate-700 hover:border-amber-300'
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition ${
              activeTab === 'playlists'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-50 text-slate-500'
            }`}
          >
            <ListMusic className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{isAm ? 'የዝማሬ ዝርዝሮች' : 'Setlists'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="pt-2">
        {currentSongs.length === 0 ? (
          <div
            className={`rounded-2xl p-8 border border-dashed text-center flex flex-col items-center justify-center space-y-3 ${
              isDark
                ? 'bg-[#0E172A]/70 border-slate-800 text-slate-300'
                : 'bg-[#FCF9F2] border-amber-900/20 text-slate-700'
            }`}
          >
            <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 mb-1">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-serif font-bold text-base">
              {isAm ? 'እስካሁን የተወደደ መዝሙር የለም' : 'No favorites yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">
              {isAm
                ? 'የሚወዷቸውን መዝሙራት የልብ ምልክቱን በመጫን እዚህ በቀላሉ ከመስመር ውጭ ማግኘት ይችላሉ።'
                : 'Heart songs you love and they will appear here for instant offline access.'}
            </p>
            <button
              onClick={() => onNavigate('songs')}
              className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold border border-amber-500 text-amber-400 hover:bg-amber-500/10 transition active:scale-95"
            >
              {isAm ? 'መዝሙራትን ፈልግ' : 'Browse Songs'}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                {currentSongs.length} {isAm ? 'መዝሙራት' : 'songs'}
              </span>
              {activeTab === 'downloads' && (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {isAm ? 'ከመስመር ውጭ ዝግጁ' : 'Ready Offline'}
                </span>
              )}
            </div>

            {currentSongs.map((song) => (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                  isDark
                    ? 'bg-[#111B30] border-slate-800 hover:border-amber-500/40 text-slate-100'
                    : 'bg-white border-amber-900/10 hover:border-amber-400 text-slate-900 shadow-sm'
                }`}
                onClick={() => onSelectSong(song)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {song.amharicTitle || song.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {song.writtenBy} • {getCategoryLabel(song.category, language)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {song.isDownloaded && (
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Download className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className={`p-2 rounded-xl hover:bg-slate-800/40 transition active:scale-90 ${
                      song.isFavorite ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        song.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
