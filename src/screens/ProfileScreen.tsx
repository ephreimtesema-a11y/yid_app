import React from 'react';
import { 
  Heart, 
  Sun, 
  Moon, 
  Bell, 
  Download, 
  Edit3, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck,
  UserCheck,
  Music2,
  Lock
} from 'lucide-react';
import { UserProfile, AppSettings, ActiveScreen, Song, AppLanguage } from '../types';
import { getTranslation, getVoicePartLabel } from '../lib/translations';

interface ProfileScreenProps {
  userProfile: UserProfile;
  settings: AppSettings;
  songs: Song[];
  language?: AppLanguage;
  onToggleTheme: () => void;
  onToggleSetting: (key: keyof AppSettings) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onLogout: () => void;
  onOpenAuthModal?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  settings,
  songs,
  language = 'am',
  onToggleTheme,
  onToggleSetting,
  onNavigate,
  onLogout,
  onOpenAuthModal
}) => {
  const isDark = settings.theme === 'dark';
  const t = getTranslation(language);
  const isAm = language === 'am';
  const favoritesCount = songs.filter((s) => s.isFavorite).length;

  return (
    <div className="pb-36 pt-4 px-4 max-w-lg mx-auto space-y-6 animate-fade-in font-ethiopic">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        {/* Golden Circle Avatar */}
        <div className="relative mb-3.5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5D886] via-[#DFA944] to-[#B3781F] flex items-center justify-center text-slate-950 font-serif font-bold text-3xl shadow-xl ring-4 ring-amber-500/20">
            {userProfile.avatarLetter || userProfile.name.charAt(0)}
          </div>
          {userProfile.choirRole === 'Admin' && (
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-amber-400 text-amber-400" title="Choir Admin">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Username and Email */}
        <h2 className="font-serif font-bold text-xl text-white dark:text-white">
          {userProfile.name}
        </h2>
        <p className="text-xs text-slate-400 font-normal mt-0.5">
          {userProfile.phone || userProfile.email}
        </p>

        {/* Badges Row */}
        <div className="flex items-center gap-2 mt-3">
          {/* Voice part pill */}
          <button
            onClick={onOpenAuthModal}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition active:scale-95 ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-amber-400/60'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {getVoicePartLabel(userProfile.voicePart, language)}
          </button>

          {/* Role Pill */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {userProfile.choirRole === 'Admin' ? (isAm ? 'የመዘምራን መሪ / አድሚን' : 'Admin') : (isAm ? 'የመዘምራን አባል' : 'Member')}
          </span>
        </div>

        {/* Countryside Member Quick Login/Switch Button */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md hover:bg-amber-300 transition active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isAm ? 'መለያ ቀይር / ቀላል መግቢያ' : 'Switch Member Profile'}</span>
          </button>
        </div>
      </div>

      {/* Two Stats Row Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Favorites Card */}
        <div
          onClick={() => onNavigate('library')}
          className={`p-4 rounded-2xl border text-center cursor-pointer transition ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 hover:border-amber-500/30 text-slate-100'
              : 'bg-white border-amber-900/15 hover:border-amber-400 text-slate-900 shadow-sm'
          }`}
        >
          <div className="font-serif font-bold text-2xl text-amber-400">
            {favoritesCount}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">
            {t.favorites}
          </div>
        </div>

        {/* Voice Part Card */}
        <div
          onClick={onOpenAuthModal}
          className={`p-4 rounded-2xl border text-center cursor-pointer transition ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 hover:border-amber-500/30 text-slate-100'
              : 'bg-white border-amber-900/15 hover:border-amber-400 text-slate-900 shadow-sm'
          }`}
        >
          <div className="font-serif font-bold text-base text-amber-400 truncate">
            {getVoicePartLabel(userProfile.voicePart, language)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">
            {isAm ? 'የድምፅ ክፍል' : 'Voice Part'}
          </div>
        </div>
      </div>

      {/* PREFERENCES SECTION */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">
          {isAm ? 'ምርጫዎች' : 'PREFERENCES'}
        </h3>

        <div
          className={`rounded-2xl border divide-y overflow-hidden ${
            isDark
              ? 'bg-[#111A2E] border-slate-800 divide-slate-800/80 text-slate-200'
              : 'bg-white border-amber-900/15 divide-amber-900/10 text-slate-800 shadow-sm'
          }`}
        >
          {/* Light Mode / Appearance */}
          <div
            onClick={onToggleTheme}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {isDark ? (isAm ? 'የቀን ገጽታ (Light Mode)' : 'Light Theme') : (isAm ? 'የጨለማ ገጽታ (Dark Mode)' : 'Dark Theme')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'የቀለም ገጽታን ይቀይሩ' : 'Switch appearance'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{isAm ? 'ማሳወቂያዎች' : 'Notifications'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'የልምምድና የፕሮግራም ማስታወሻዎች' : 'Announcements & reminders'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onToggleSetting('notificationsEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.notificationsEnabled ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-download for offline */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{isAm ? 'በራስ-ሰር አውርድ' : 'Auto-download'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'መዝሙራትን ለገጠርና ከመስመር ውጭ ማስቀመጥ' : 'Save songs for offline'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onToggleSetting('autoDownloadOffline')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.autoDownloadOffline ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoDownloadOffline ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Settings */}
          <div
            onClick={() => onNavigate('settings')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{isAm ? 'ተጨማሪ ቅንብሮች' : 'Settings'}</div>
                <div className="text-[11px] text-slate-400">
                  {isAm ? 'ቋንቋ፣ የድምፅ ማስተካከያ (Pitch Pipe) እና ማከማቻ' : 'Language, Pitch Pipe & storage'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Logout */}
          <div
            onClick={onLogout}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-red-400">
                  {isAm ? 'ውጣ / መገለጫ ቀይር' : 'Logout / Switch'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-[10px] text-slate-500 pt-2">
        {isAm ? 'የይዲድያ መዘምራን • አዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ' : 'YIDIDYA Choir • ASTU Fellowship'}
      </div>
    </div>
  );
};
