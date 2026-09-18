import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, CheckCircle2, Download } from 'lucide-react';
import { Song, AppTheme } from '../types';

interface ChoirAudioPlayerProps {
  song: Song;
  theme: AppTheme;
  onToggleDownload?: (songId: string) => void;
}

export const ChoirAudioPlayer: React.FC<ChoirAudioPlayerProps> = ({
  song,
  theme,
  onToggleDownload
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(275); // ~4:35
  const [selectedVoice, setSelectedVoice] = useState<'All' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass'>('All');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Clean up audio context
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      // Play a gentle warm chord progression in Web Audio for choir harmony demonstration
      playChoirHarmony(selectedVoice);
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const playChoirHarmony = (voice: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Base pitches for Eb Major / C Major chord
      const freqs = {
        Soprano: [622.25, 783.99],
        Alto: [466.16, 523.25],
        Tenor: [311.13, 392.00],
        Bass: [155.56, 196.00],
      };

      const toPlay = voice === 'All' 
        ? [155.56, 311.13, 466.16, 622.25] 
        : freqs[voice as keyof typeof freqs] || [311.13];

      toPlay.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.6);
      });
    } catch {
      // Audio not permitted or user interaction needed
    }
  };

  const handleVoiceChange = (v: 'All' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass') => {
    setSelectedVoice(v);
    if (isPlaying) {
      playChoirHarmony(v);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-200 border ${
        isDark
          ? 'bg-[#121B30] border-amber-500/20 text-slate-200 shadow-xl'
          : 'bg-[#FAF6EE] border-amber-700/15 text-slate-800 shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-500/20 text-amber-800'}`}>
            <Music className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Rehearsal Track & Harmony
            </div>
            <div className="text-sm font-medium">
              {song.amharicTitle} ({song.key || 'Eb Major'})
            </div>
          </div>
        </div>

        {song.isDownloaded ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Cached Offline
          </span>
        ) : (
          onToggleDownload && (
            <button
              onClick={() => onToggleDownload(song.id)}
              className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-950/30 border border-amber-500/30 px-2 py-0.5 rounded-full transition"
            >
              <Download className="w-3 h-3" />
              Download Audio
            </button>
          )
        )}
      </div>

      {/* Voice Part Isolation */}
      <div className="flex items-center gap-1.5 my-3 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-medium opacity-60 mr-1 shrink-0">Part:</span>
        {(['All', 'Soprano', 'Alto', 'Tenor', 'Bass'] as const).map((part) => (
          <button
            key={part}
            onClick={() => handleVoiceChange(part)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              selectedVoice === part
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                : 'bg-amber-100 text-slate-700 hover:bg-amber-200/70'
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="relative w-full h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30">
        <button
          onClick={() => setCurrentTime(0)}
          className="p-2 text-slate-400 hover:text-amber-400 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Volume2 className="w-4 h-4" />
          <span className="text-[11px] font-mono">{selectedVoice === 'All' ? '4-Part' : selectedVoice}</span>
        </div>
      </div>
    </div>
  );
};
