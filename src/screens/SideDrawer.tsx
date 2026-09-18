import React from 'react';
import { 
  ChevronLeft, 
  Home, 
  Music, 
  Calendar, 
  Camera, 
  BookOpen, 
  Users, 
  Shield, 
  Church, 
  Code2, 
  Settings, 
  User, 
  LogOut,
  Database,
  UserCheck
} from 'lucide-react';
import { ActiveScreen, AppTheme, AppLanguage } from '../types';
import { ChoirLogo } from '../components/ChoirLogo';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  theme: AppTheme;
  language?: AppLanguage;
  onLogout: () => void;
  onOpenAuthModal?: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  theme,
  language = 'am',
  onLogout,
  onOpenAuthModal
}) => {
  const isDark = theme === 'dark';
  const isAm = language === 'am';

  if (!isOpen) return null;

  const handleSelect = (screen: ActiveScreen) => {
    onNavigate(screen);
    onClose();
  };

  const navItems = [
    { id: 'home' as ActiveScreen, label: isAm ? 'መነሻ (Home)' : 'Home', icon: Home },
    { id: 'songs' as ActiveScreen, label: isAm ? 'መዝሙራት (Hymns)' : 'Hymns & Lyrics', icon: Music },
    { id: 'library' as ActiveScreen, label: isAm ? 'ቤተ-መጻሕፍት (Library)' : 'Library', icon: BookOpen },
    { id: 'schedule' as ActiveScreen, label: isAm ? 'መርሐ-ግብር (Schedule)' : 'Schedule', icon: Calendar },
    { id: 'moments' as ActiveScreen, label: isAm ? 'የመዘምራን ትዝታዎች (Moments)' : 'Choir Moments', icon: Camera },
    { id: 'devotionals' as ActiveScreen, label: isAm ? 'መንፈሳዊ ጽሑፎች (Devotions)' : 'Devotionals', icon: BookOpen },
    { id: 'choir-leaders' as ActiveScreen, label: isAm ? 'የመዘምራን አመራር (Leadership)' : 'Choir Leadership', icon: Users },
  ];

  const secondaryItems = [
    { id: 'profile' as ActiveScreen, label: isAm ? 'የግል መገለጫ (Profile)' : 'My Profile', icon: User },
    { id: 'settings' as ActiveScreen, label: isAm ? 'ቅንብሮች (Settings)' : 'Settings', icon: Settings },
    { id: 'about-choir' as ActiveScreen, label: isAm ? 'ስለ ይዲድያ መዘምራን (About)' : 'About Yididya Choir', icon: Church },
    { id: 'about-developer' as ActiveScreen, label: isAm ? 'ስለ መተግበሪያው አበልጻጊ' : 'About Developer', icon: Code2 },
    { id: 'admin-panel' as ActiveScreen, label: isAm ? 'የአድሚን ክፍል' : 'Admin Control Panel', icon: Shield, badge: 'Admin' },
    { id: 'flutter-export' as ActiveScreen, label: isAm ? 'የፍላተር ኮድ (Flutter Code)' : 'Flutter Source Export', icon: Code2, badge: 'Flutter' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex font-ethiopic">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`relative w-4/5 max-w-xs h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ${
          isDark
            ? 'bg-[#0B1328] text-slate-100 border-r border-slate-800'
            : 'bg-[#FCF9F2] text-slate-900 border-r border-amber-900/15'
        }`}
      >
        {/* Drawer Header with Choir Logo */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800/80 bg-[#0E172A]' : 'border-amber-900/10 bg-amber-500/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <ChoirLogo size="sm" showText={false} />
            <div>
              <div className="font-cinzel text-base font-bold tracking-wider text-amber-400">
                YIDIDYA CHOIR
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                የይዲድያ መዘምራን • ASTU
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-amber-200/50 text-slate-700'
            }`}
            aria-label="Close menu"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Member Profile Quick Action */}
        {onOpenAuthModal && (
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={() => {
                onOpenAuthModal();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition text-xs font-semibold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isAm ? 'የመዘምራን መለያ / ቀላል መግቢያ' : 'Choir Member Sign-In'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">PIN</span>
            </button>
          </div>
        )}

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? isDark
                      ? 'bg-slate-800/90 text-amber-400 font-semibold'
                      : 'bg-amber-500/20 text-amber-900 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className={`my-3 border-t ${isDark ? 'border-slate-800/80' : 'border-amber-900/10'}`} />

          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? isDark
                      ? 'bg-slate-800/90 text-amber-400 font-semibold'
                      : 'bg-amber-500/20 text-amber-900 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'opacity-70'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Logout button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>{isAm ? 'መገለጫ ቀይር / ውጣ' : 'Switch Profile / Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
