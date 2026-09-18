import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  Download, 
  Check, 
  Heart, 
  Edit3, 
  Trash2,
  Share2,
  Music2
} from 'lucide-react';
import { Song, AppTheme, UserProfile } from '../types';
import { ChoirAudioPlayer } from '../components/ChoirAudioPlayer';

interface SongDetailScreenProps {
  song: Song;
  theme: AppTheme;
  userProfile: UserProfile;
  onBack: () => void;
  onToggleFavorite: (songId: string) => void;
  onToggleDownload: (songId: string) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (songId: string) => void;
}

export const SongDetailScreen: React.FC<SongDetailScreenProps> = ({
  song,
  theme,
  userProfile,
  onBack,
  onToggleFavorite,
  onToggleDownload,
  onEditSong,
  onDeleteSong
}) => {
  const isDark = theme === 'dark';
  const [fontSize, setFontSize] = useState<number>(song.lyricsFontSize || 17);
  const [textAlign, setTextAlign] = useState<'left' | 'center'>(song.textAlign || 'center');
  const [showAudioPlayer, setShowAudioPlayer] = useState(true);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 13));
  const toggleAlignment = () => setTextAlign((prev) => (prev === 'center' ? 'left' : 'center'));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.amharicTitle} - Yididya Choir`,
          text: `${song.amharicTitle} (${song.title})\nWritten by ${song.writtenBy}\n\nLyrics available in Yididya Choir app.`
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${song.amharicTitle} - Written by: ${song.writtenBy}`);
      alert('Song details copied to clipboard!');
    }
  };

  return (
    <div className="pb-36 max-w-lg mx-auto animate-fade-in">
      {/* Top Action Bar matching Screenshot 11 */}
      <div
        className={`sticky top-0 z-20 px-3 py-2.5 border-b backdrop-blur-md flex items-center justify-between gap-1 transition ${
          isDark
            ? 'bg-[#0B1328]/95 border-slate-800 text-slate-300'
            : 'bg-[#FCF9F2]/95 border-amber-900/10 text-slate-700'
        }`}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
          }`}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Action icons group: T-, T+, Align, Download, Favorite, Edit, Delete */}
        <div className="flex items-center gap-1">
          {/* Smaller T */}
          <button
            onClick={decreaseFontSize}
            title="Decrease font size"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-xs font-serif font-bold"
          >
            T
          </button>

          {/* Larger T */}
          <button
            onClick={increaseFontSize}
            title="Increase font size"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-base font-serif font-bold"
          >
            T
          </button>

          {/* Text alignment toggle */}
          <button
            onClick={toggleAlignment}
            title="Toggle alignment"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 transition"
          >
            {textAlign === 'center' ? (
              <AlignCenter className="w-4 h-4" />
            ) : (
              <AlignLeft className="w-4 h-4" />
            )}
          </button>

          {/* Download for offline button */}
          <button
            onClick={() => onToggleDownload(song.id)}
            title={song.isDownloaded ? 'Downloaded for offline' : 'Download for offline'}
            className={`p-1.5 rounded-lg transition ${
              song.isDownloaded
                ? 'text-amber-400 bg-amber-500/15'
                : 'hover:bg-slate-800/40 text-slate-400 hover:text-amber-400'
            }`}
          >
            {song.isDownloaded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Favorite heart button */}
          <button
            onClick={() => onToggleFavorite(song.id)}
            title={song.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition ${
              song.isFavorite
                ? 'text-amber-400'
                : 'hover:bg-slate-800/40 text-slate-400 hover:text-amber-400'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                song.isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>

          {/* Edit Song Button */}
          <button
            onClick={() => onEditSong(song)}
            title="Edit song lyrics"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-amber-400 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Song (Admin role) */}
          {userProfile.choirRole === 'Admin' && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${song.amharicTitle}"?`)) {
                  onDeleteSong(song.id);
                }
              }}
              title="Delete song"
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/80 hover:text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            title="Share"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-amber-400 transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 pb-4 space-y-6">
        {/* Song Meta Header */}
        <div className="space-y-1">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-amber-500">
            {song.category}
          </div>
          <h1 className="font-ethiopic text-3xl font-bold tracking-tight text-white dark:text-white">
            {song.amharicTitle}
          </h1>
          <div className="text-xs text-slate-400 font-medium">
            {song.language}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Written by: <span className="text-slate-200">{song.writtenBy}</span>
          </div>
        </div>

        {/* Audio Rehearsal Player */}
        {showAudioPlayer && (
          <ChoirAudioPlayer
            song={song}
            theme={theme}
            onToggleDownload={onToggleDownload}
          />
        )}

        {/* Lyrics Display */}
        <div
          className={`space-y-8 pt-2 ${
            textAlign === 'center' ? 'text-center' : 'text-left'
          }`}
        >
          {song.verses.map((verse, idx) => (
            <div key={idx} className="space-y-3">
              {/* Verse Title Tag */}
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400/90 font-mono">
                [{verse.type}{verse.index ? ` ${verse.index}` : ''}]
              </div>

              {/* Verse Lines */}
              <div
                className="font-ethiopic font-normal leading-relaxed text-slate-100 transition-all duration-200 space-y-1.5"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              >
                {verse.lines.map((line, lIdx) => (
                  <p key={lIdx} className="tracking-wide">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Choral Notes / Key Information */}
        <div
          className={`p-4 rounded-2xl border text-xs ${
            isDark
              ? 'bg-[#10182B] border-slate-800 text-slate-400'
              : 'bg-[#FAF6EE] border-amber-900/10 text-slate-600'
          }`}
        >
          <div className="font-semibold text-amber-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5" />
            Choir Harmony Notes
          </div>
          <p>
            Key signature: <strong>{song.key || 'Eb Major'}</strong> • Tempo: <strong>{song.tempo || '68 BPM'}</strong>. Sopranos carry the melodic resolution in the second half of Verse 1. Tenors harmonize in thirds on line 6.
          </p>
        </div>
      </div>
    </div>
  );
};
