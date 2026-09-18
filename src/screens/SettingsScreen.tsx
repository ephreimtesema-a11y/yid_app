import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Trash2, 
  Download, 
  Volume2, 
  Bell, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Globe, 
  Fingerprint 
} from 'lucide-react';
import { AppSettings, StorageStats, AppLanguage, ActiveScreen } from '../types';
import { getTranslation } from '../lib/translations';

interface SettingsScreenProps {
  settings: AppSettings;
  storageStats: StorageStats;
  onToggleTheme: () => void;
  onSetLanguage: (lang: AppLanguage) => void;
  onToggleSetting: (key: keyof AppSettings) => void;
  onDownloadAllSongs: () => void;
  onRemoveDownloadedSongs: () => void;
  onClearCache: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  onNavigate: (screen: ActiveScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  storageStats,
  onToggleTheme,
  onSetLanguage,
  onToggleSetting,
  onDownloadAllSongs,
  onRemoveDownloadedSongs,
  onClearCache,
  onSyncNow,
  isSyncing,
  onNavigate
}) => {
  const isDark = settings.theme === 'dark';
  const language = settings.language || 'am';
  const isAm = language === 'am';
  const t = getTranslation(language);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPitch, setSelectedPitch] = useState('A4 (440 Hz)');
  const [rehearsalReminder, setRehearsalReminder] = useState(true);
  const [autoScrollLyrics, setAutoScrollLyrics] = useState(true);
  const [playingTone, setPlayingTone] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlayPitchTone = () => {
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const freqMap: Record<string, number> = {
          'A4 (440 Hz)': 440,
          'C4 (261.6 Hz)': 261.63,
          'D4 (293.7 Hz)': 293.66,
          'Eb4 (311.1 Hz)': 311.13,
          'F4 (349.2 Hz)': 349.23,
          'G4 (392.0 Hz)': 392.0,
        };
        osc.frequency.setValueAtTime(freqMap[selectedPitch] || 440, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        setPlayingTone(true);
        setTimeout(() => setPlayingTone(false), 1200);
      } catch {
        // fallback
      }
    }
  };

  const formatStorage = (kb: number) => {
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="pb-36 pt-3 px-4 max-w-lg mx-auto space-y-5 animate-fade-in relative font-ethiopic">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div>
        <h1 className="font-cinzel text-2xl font-bold tracking-tight text-white dark:text-white">
          {isAm ? 'ቅንብሮች' : 'Settings'}
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {isAm ? 'የመተግበሪያ ምርጫዎች፣ የድምፅ ልምምድ መሳሪያዎችና የደመና ግንኙነት' : 'Choir preferences, audio rehearsals & storage'}
        </p>
      </div>

      {/* LANGUAGE SELECTOR - AMHARIC FIRST */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAm ? 'የመተግበሪያው ቋንቋ (AMHARIC FIRST)' : 'APP LANGUAGE'}</span>
        </h2>
        <div
          className={`p-1.5 rounded-2xl border flex items-center gap-2 ${
            isDark ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-amber-900/15 shadow-sm'
          }`}
        >
          {/* Amharic is primary */}
          <button
            onClick={() => {
              onSetLanguage('am');
              showToast('ቋንቋ ወደ አማርኛ ተቀይሯል (Amharic)');
            }}
            id="lang-button-amharic"
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              language === 'am'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            አማርኛ (ዋና ቋንቋ)
          </button>
          {/* English alternative */}
          <button
            onClick={() => {
              onSetLanguage('en');
              showToast('Language switched to English');
            }}
            id="lang-button-english"
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              language === 'en'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English (Optional)
          </button>
        </div>
      </div>

      {/* APPEARANCE */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">
          {isAm ? 'የቀለም ገጽታ' : 'APPEARANCE'}
        </h2>
        <div
          onClick={onToggleTheme}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 text-slate-200 hover:border-amber-500/40'
              : 'bg-white border-amber-900/15 text-slate-800 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-semibold">
                {isDark ? (isAm ? 'የቀን ገጽታ (Light Theme)' : 'Light Theme') : (isAm ? 'የጨለማ ገጽታ (Dark Theme)' : 'Dark Theme')}
              </div>
              <div className="text-xs text-slate-400">
                {isDark ? (isAm ? 'ወደ ብሩህ የቀን ገጽታ ይቀይሩ' : 'Switch to light mode') : (isAm ? 'ወደ ጨለማ ገጽታ ይቀይሩ' : 'Switch to dark mode')}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400">
            {isDark ? (isAm ? 'ቀን' : 'Light') : (isAm ? 'ጨለማ' : 'Dark')}
          </span>
        </div>
      </div>

      {/* REHEARSAL & AUDIO TOOLS */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">
          {isAm ? 'የልምምድና የድምፅ መሳሪያዎች' : 'REHEARSAL & AUDIO TOOLS'}
        </h2>
        <div
          className={`rounded-2xl border p-4 space-y-4 ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 text-slate-200'
              : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
          }`}
        >
          {/* Pitch Pipe Reference Tone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold">{isAm ? 'የድምፅ መቃኛ ቶን (Pitch Pipe)' : 'Pitch Reference'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'የመዘምራን ድምፅ ማስተካከያ' : 'Key tone for choir tuning'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPitch}
                onChange={(e) => setSelectedPitch(e.target.value)}
                className={`text-xs font-medium px-2 py-1.5 rounded-lg border outline-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <option value="A4 (440 Hz)">A4 (440 Hz)</option>
                <option value="C4 (261.6 Hz)">C4 (Middle C)</option>
                <option value="D4 (293.7 Hz)">D4</option>
                <option value="Eb4 (311.1 Hz)">Eb4</option>
                <option value="F4 (349.2 Hz)">F4</option>
                <option value="G4 (392.0 Hz)">G4</option>
              </select>
              <button
                onClick={handlePlayPitchTone}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                  playingTone
                    ? 'bg-amber-500 text-slate-950 scale-95'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                {playingTone ? '...' : (isAm ? 'አሰማ' : 'Play')}
              </button>
            </div>
          </div>

          {/* Auto-scroll lyrics */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/60 text-amber-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">{isAm ? 'ግጥም በራስ-ሰር ይሸብለል' : 'Auto-Scroll Hymn Lyrics'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'ዘፈን ሲከፈት ግጥሙን አብሮ መከተል' : 'Follow song verses during playback'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setAutoScrollLyrics(!autoScrollLyrics);
                showToast(!autoScrollLyrics ? 'Auto-scroll enabled' : 'Auto-scroll disabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoScrollLyrics ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoScrollLyrics ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Rehearsal Reminders */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/60 text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">{isAm ? 'የልምምድ ማሳወቂያዎች' : 'Rehearsal Reminders'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'ከፕሮግራም 2 ሰዓት በፊት ማስታወስ' : 'Notify before rehearsal practice'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setRehearsalReminder(!rehearsalReminder);
                showToast(!rehearsalReminder ? 'ማሳወቂያ ነቅቷል' : 'ማሳወቂያ ጠፍቷል');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                rehearsalReminder ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  rehearsalReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* STORAGE & OFFLINE CACHE */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">
          {isAm ? 'ከመስመር ውጭ ማህደረ-ትውስታ' : 'OFFLINE STORAGE & CACHE'}
        </h2>
        <div
          className={`rounded-2xl border p-4 space-y-4 ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 text-slate-200'
              : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
          }`}
        >
          {/* Storage Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{isAm ? 'የመዘምራን መዝሙራትና ግጥሞች' : 'Choir Hymns & Lyrics'}</span>
              <span className="font-semibold">{formatStorage(storageStats.appDataKb)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isAm ? 'የልምምድ ድምጾች ማህደረ-ትውስታ' : 'Rehearsal Audio Cache'}</span>
              <span className="font-semibold">{formatStorage(storageStats.cachedAudioKb)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isAm ? 'የኅብረት ፎቶዎች' : 'Fellowship Photos'}</span>
              <span className="font-semibold">{formatStorage(storageStats.cachedPhotosKb)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-amber-400 font-bold">
              <span>{isAm ? 'አጠቃላይ ከመስመር ውጭ የተቀመጠ' : 'Total Offline Footprint'}</span>
              <span>{formatStorage(storageStats.totalKb)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{storageStats.songsMarkedForOffline} {isAm ? 'መዝሙራት 100% ከመስመር ውጭ ዝግጁ ናቸው' : 'hymns available 100% offline'}</span>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onDownloadAllSongs();
                showToast(isAm ? 'ሁሉም መዝሙራት ከመስመር ውጭ ተቀምጠዋል' : 'All choir hymns downloaded for offline use');
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${
                isDark
                  ? 'bg-amber-400/15 border-amber-500/40 text-amber-300 hover:bg-amber-400/25'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isAm ? 'ሁሉንም መዝሙራት ከመስመር ውጭ አውርድ' : 'Download All Hymns For Offline'}</span>
            </button>

            <button
              onClick={() => {
                onClearCache();
                showToast(isAm ? 'የድምፅ ማህደረ-ትውስታ ጸድቷል' : 'Rehearsal cache cleared successfully');
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${
                isDark
                  ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>{isAm ? 'ጊዜያዊ የድምፅ ማህደረ-ትውስታ አጽዳ' : 'Clear Temporary Audio Cache'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark
            ? 'bg-[#111A2E]/70 border-slate-800 text-slate-300'
            : 'bg-white border-amber-900/10 text-slate-700 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide">
              {isAm ? 'የይዲድያ መዘምራን መተግበሪያ' : 'Yididya Choir App'}
            </div>
            <div className="text-[11px] text-slate-400">
              Version 2.4.0 • ASTU Fellowship
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('about-choir')}
          className="text-xs font-bold text-amber-400 hover:underline"
        >
          {isAm ? 'ስለ እኛ >' : 'About >'}
        </button>
      </div>
    </div>
  );
};
