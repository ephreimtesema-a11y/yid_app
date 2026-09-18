import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Headphones, 
  Heart, 
  Download, 
  Plus, 
  CheckCircle2,
  X
} from 'lucide-react';
import { Song, AppTheme, UserProfile, SongVerse, AppLanguage } from '../types';
import { getTranslation, getCategoryLabel } from '../lib/translations';

interface SongsScreenProps {
  songs: Song[];
  theme: AppTheme;
  userProfile: UserProfile;
  language?: AppLanguage;
  onSelectSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onToggleDownload: (songId: string) => void;
  onAddSong: (newSong: Omit<Song, 'id'>) => void;
}

export const SongsScreen: React.FC<SongsScreenProps> = ({
  songs,
  theme,
  userProfile,
  language = 'am',
  onSelectSong,
  onToggleFavorite,
  onToggleDownload,
  onAddSong
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);
  const isAm = language === 'am';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Song Form State
  const [title, setTitle] = useState('');
  const [amharicTitle, setAmharicTitle] = useState('');
  const [category, setCategory] = useState<Song['category']>('Worship');
  const [writtenBy, setWrittenBy] = useState('');
  const [keySig, setKeySig] = useState('Eb Major');
  const [rawLyrics, setRawLyrics] = useState('');

  const rawCategories = ['All', 'Worship', 'Praise', 'Hymns', 'Communion', 'Fast & Prayer'];

  const filteredSongs = songs.filter((song) => {
    const matchesCat = selectedCategory === 'All' || song.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch =
      song.title.toLowerCase().includes(q) ||
      song.amharicTitle.includes(q) ||
      song.writtenBy.toLowerCase().includes(q) ||
      song.verses.some((v) => v.lines.some((l) => l.toLowerCase().includes(q) || l.includes(q)));

    return matchesCat && matchesSearch;
  });

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amharicTitle.trim()) return;

    // Parse raw lyrics into verse structure
    const verses = rawLyrics.trim()
      ? rawLyrics
          .split('\n\n')
          .map((block, idx) => ({
            type: (idx === 0 ? 'VERSE' : 'CHORUS') as SongVerse['type'],
            index: idx === 0 ? 1 : undefined,
            lines: block.split('\n').map((l) => l.trim()).filter(Boolean)
          }))
      : [
          {
            type: 'VERSE' as SongVerse['type'],
            index: 1,
            lines: ['እግዚአብሔር ሆይ አመሰግንሃለሁ', 'በቅድስናህ ስፍራ እዘምራለሁ']
          }
        ];

    onAddSong({
      title: title || amharicTitle,
      amharicTitle,
      category,
      language: 'Amharic',
      writtenBy: writtenBy || 'Yididya Choir',
      verses,
      isFavorite: false,
      isDownloaded: true,
      key: keySig,
      tempo: '72 BPM',
      hasAudio: true,
      audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
      lyricsFontSize: 17,
      textAlign: 'center',
      createdAt: new Date().toISOString()
    });

    // Reset & close
    setAmharicTitle('');
    setTitle('');
    setWrittenBy('');
    setRawLyrics('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="pb-36 pt-4 px-4 max-w-lg mx-auto space-y-4 animate-fade-in font-ethiopic">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold tracking-tight text-white dark:text-white">
            {isAm ? 'የመዘምራን መዝሙራት' : 'Choir Hymns'}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {filteredSongs.length} {isAm ? 'መዝሙራት ከመስመር ውጭ ይገኛሉ' : 'songs available offline'}
          </p>
        </div>

        {/* Add Song Button for Choir Admin */}
        {userProfile.choirRole === 'Admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            id="add-song-button"
            className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-lg hover:bg-amber-300 active:scale-95 transition"
            aria-label="Add new song"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition outline-none ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500'
              : 'bg-white border-amber-900/15 text-slate-900 placeholder-slate-400 focus:border-amber-600'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {rawCategories.map((cat) => {
          const label = cat === 'All' 
            ? (isAm ? 'ሁሉንም' : 'All') 
            : getCategoryLabel(cat as any, language);
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Song List */}
      <div className="space-y-3 pt-1">
        {filteredSongs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {isAm ? `ከፍለጋዎ ጋር የሚመሳሰል መዝሙር አልተገኘም፡ "${searchQuery}"` : `No hymns found matching "${searchQuery}".`}
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              id={`song-row-${song.id}`}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-[#111B30] border-slate-800 hover:border-amber-500/40 text-slate-100 shadow-sm'
                  : 'bg-white border-amber-900/10 hover:border-amber-400 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Book Icon Tile */}
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-400">
                  <BookOpen className="w-5 h-5 stroke-[1.7]" />
                </div>

                {/* Titles */}
                <div className="min-w-0">
                  <div className="font-semibold text-base truncate">
                    {song.amharicTitle || song.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                    <span>{song.writtenBy}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">{getCategoryLabel(song.category, language)}</span>
                    {song.key && (
                      <>
                        <span>•</span>
                        <span>{song.key}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Icons: Audio, Offline Check, Favorite */}
              <div className="flex items-center gap-2 shrink-0">
                {song.hasAudio && (
                  <span className="p-1.5 rounded-lg bg-slate-800/60 text-amber-400" title={t.audioAvailable}>
                    <Headphones className="w-3.5 h-3.5" />
                  </span>
                )}

                {song.isDownloaded && (
                  <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400" title={t.offlineSaved}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      song.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Song Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-5 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar ${
              isDark
                ? 'bg-[#0E172A] border-slate-800 text-slate-100'
                : 'bg-white border-amber-900/20 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold">
                {isAm ? 'አዲስ መዝሙር ጨምር' : 'Add Choir Hymn'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSong} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'የመዝሙሩ ርዕስ (Amharic Title) *' : 'Amharic Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={amharicTitle}
                  onChange={(e) => setAmharicTitle(e.target.value)}
                  placeholder="ለምሳሌ፡ ግን ባንተ"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    {isAm ? 'ምድብ (Category)' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Song['category'])}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                  >
                    <option value="Worship">{isAm ? 'አምልኮ (Worship)' : 'Worship'}</option>
                    <option value="Praise">{isAm ? 'ምስጋና (Praise)' : 'Praise'}</option>
                    <option value="Hymns">{isAm ? 'የማኅበር (Hymns)' : 'Hymns'}</option>
                    <option value="Communion">{isAm ? 'የጌታ እራት (Communion)' : 'Communion'}</option>
                    <option value="Fast & Prayer">{isAm ? 'ጾም እና ጸሎት' : 'Fast & Prayer'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    {isAm ? 'ኪይ (Key)' : 'Musical Key'}
                  </label>
                  <input
                    type="text"
                    value={keySig}
                    onChange={(e) => setKeySig(e.target.value)}
                    placeholder="Eb Major / C Major"
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'ደራሲ / አቀናባሪ' : 'Written By / Composer'}
                </label>
                <input
                  type="text"
                  value={writtenBy}
                  onChange={(e) => setWrittenBy(e.target.value)}
                  placeholder="ለምሳሌ፡ ይድነቃቸው ተካ"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'የግጥሙ ስንኞች (ስንኞችን በመስመር ይለዩ)' : 'Amharic Lyrics'}
                </label>
                <textarea
                  rows={6}
                  value={rawLyrics}
                  onChange={(e) => setRawLyrics(e.target.value)}
                  placeholder="ግን ባንተ እታመናለሁ&#10;የምመካበት አንተ ብቻ ነህ...&#10;&#10;[Chorus]&#10;ክብር ለአንተ ይሁን..."
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none leading-relaxed text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  {isAm ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition"
                >
                  {isAm ? 'አስቀምጥና አመሳስል' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
