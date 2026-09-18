import React from 'react';
import { Menu, Sun, Moon, Bell, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { ChoirLogo } from './ChoirLogo';
import { AppTheme, ActiveScreen, AppLanguage } from '../types';
import { getTranslation } from '../lib/translations';

interface ChoirHeaderProps {
  theme: AppTheme;
  language?: AppLanguage;
  onToggleTheme: () => void;
  onOpenDrawer: () => void;
  activeScreen: ActiveScreen;
  onNavigateBack?: () => void;
  isOfflineMode: boolean;
  onToggleOfflineSim: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
}

export const ChoirHeader: React.FC<ChoirHeaderProps> = ({
  theme,
  language = 'am',
  onToggleTheme,
  onOpenDrawer,
  activeScreen,
  onNavigateBack,
  isOfflineMode,
  onToggleOfflineSim,
  unreadNotifications = 2,
  onOpenNotifications
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);

  const showBackButton = onNavigateBack && [
    'song-detail', 
    'about-choir', 
    'about-developer', 
    'settings', 
    'edit-profile', 
    'flutter-export',
    'admin-panel',
    'moments',
    'devotionals',
    'choir-leaders'
  ].includes(activeScreen);

  return (
    <header
      className={`sticky top-0 z-30 px-3.5 py-2.5 border-b backdrop-blur-md transition-colors duration-200 ${
        isDark
          ? 'bg-[#0B132B]/95 border-slate-800/80 text-white'
          : 'bg-[#FCF9F2]/95 border-amber-900/10 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Left: Back Arrow or Hamburger */}
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={onNavigateBack}
              id="header-back-button"
              className={`p-2 rounded-xl transition active:scale-95 ${
                isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
              }`}
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenDrawer}
              id="header-menu-button"
              className={`p-2 rounded-xl transition active:scale-95 ${
                isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
              }`}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center: Choir Logo & Brand in Clean Horizontal Lockup matching the Real Emblem */}
        <div className="flex items-center justify-center flex-1">
          <ChoirLogo 
            size="xs" 
            horizontal={true}
            showText={true} 
            textColor={!isDark ? 'text-amber-950' : undefined}
          />
        </div>

        {/* Right Controls: Offline Badge, Theme Toggle, Notification Bell */}
        <div className="flex items-center gap-1.5">
          {/* Offline / Online indicator pill */}
          <button
            onClick={onToggleOfflineSim}
            id="header-offline-toggle"
            title={isOfflineMode ? t.offline : t.online}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition ${
              isOfflineMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="font-ethiopic">{language === 'am' ? 'ከመስመር ውጭ' : 'Offline'}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="font-ethiopic">{language === 'am' ? 'ኦንላይን' : 'Online'}</span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            id="header-theme-toggle"
            className={`p-2 rounded-xl transition ${
              isDark ? 'hover:bg-slate-800 text-amber-300' : 'hover:bg-amber-100 text-slate-700'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            id="header-notifications"
            className={`relative p-2 rounded-xl transition ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-amber-100 text-slate-700'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
