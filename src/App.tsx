import React, { useState, useEffect, useCallback } from 'react';
import { 
  ActiveScreen, 
  Song, 
  ScheduleEvent, 
  UserProfile, 
  AppSettings, 
  StorageStats, 
  Moment, 
  AppLanguage, 
  AppTheme 
} from './types';
import { 
  INITIAL_SONGS, 
  INITIAL_SCHEDULES, 
  INITIAL_PROFILE as DEFAULT_USER_PROFILE, 
  INITIAL_SETTINGS as DEFAULT_SETTINGS, 
  INITIAL_DEVOTIONALS, 
  CHOIR_LEADERS as INITIAL_LEADERS, 
  INITIAL_MOMENTS 
} from './data/initialChoirData';
import { 
  OfflineStorageManager, 
  syncWithSupabase, 
  subscribeToRealtimeChanges, 
  fetchRemoteSongs,
  fetchRemoteSchedules,
  checkMemberApprovalStatus,
  getSupabaseConfig 
} from './lib/supabase';

// Components & Screens
import { ChoirHeader } from './components/ChoirHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { SideDrawer } from './screens/SideDrawer';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SongsScreen } from './screens/SongsScreen';
import { SongDetailScreen } from './screens/SongDetailScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutChoirScreen } from './screens/AboutChoirScreen';
import { AboutDeveloperScreen } from './screens/AboutDeveloperScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { MomentsScreen } from './screens/MomentsScreen';
import { DevotionalsScreen } from './screens/DevotionalsScreen';
import { ChoirLeadersScreen } from './screens/ChoirLeadersScreen';
import { AdminPanelScreen } from './screens/AdminPanelScreen';
import { FlutterExportScreen } from './screens/FlutterExportScreen';
import { PendingApprovalScreen } from './screens/PendingApprovalScreen';
import { SimpleChoirAuthModal } from './components/SimpleChoirAuthModal';

export default function App() {
  // Navigation & UI States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('splash');
  const [previousScreen, setPreviousScreen] = useState<ActiveScreen>('home');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal for Countryside-friendly Choir Member Login (Name, Voice Part, PIN)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // App Data with Offline-First Local Cache
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = OfflineStorageManager.loadSongs();
    return saved && saved.length > 0 ? saved : INITIAL_SONGS;
  });

  const [schedules, setSchedules] = useState<ScheduleEvent[]>(() => {
    const saved = OfflineStorageManager.loadSchedules();
    return saved && saved.length > 0 ? saved : INITIAL_SCHEDULES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return OfflineStorageManager.loadUserProfile() || DEFAULT_USER_PROFILE;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    return OfflineStorageManager.loadSettings() || DEFAULT_SETTINGS;
  });

  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);

  // Apply Dark/Light theme class to document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0B1328';
      document.body.style.color = '#F1F5F9';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FAF6EE';
      document.body.style.color = '#1E293B';
    }
  }, [settings.theme]);

  // Sync queued changes with Supabase
  const triggerAutoSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncWithSupabase();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Online / Offline Connectivity Detection & Auto-Sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOfflineMode(false);
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerAutoSync]);

  // Initial Fetch & Real-time Supabase subscriptions
  useEffect(() => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) return;

    // 1. Initial Remote Data Sync
    const loadRemoteData = async () => {
      try {
        const [remoteSongs, remoteSchedules] = await Promise.all([
          fetchRemoteSongs(),
          fetchRemoteSchedules()
        ]);

        if (remoteSongs && remoteSongs.length > 0) {
          setSongs(remoteSongs);
        }
        if (remoteSchedules && remoteSchedules.length > 0) {
          setSchedules(remoteSchedules);
        }
      } catch (e) {
        console.info('Initial Supabase fetch fallback to local cache:', e);
      }
    };

    loadRemoteData();

    // 2. Real-time Subscription: whenever any song, schedule, or member profile is updated in Supabase
    const unsubscribe = subscribeToRealtimeChanges(
      async () => {
        const freshSongs = await fetchRemoteSongs();
        if (freshSongs && freshSongs.length > 0) {
          setSongs(freshSongs);
        }
      },
      async () => {
        const freshSchedules = await fetchRemoteSchedules();
        if (freshSchedules && freshSchedules.length > 0) {
          setSchedules(freshSchedules);
        }
      },
      async () => {
        // Real-time member approval updates
        if (userProfile && userProfile.id) {
          const freshStatus = await checkMemberApprovalStatus(userProfile.id);
          if (freshStatus !== userProfile.membershipStatus) {
            setUserProfile((prev) => {
              const updated = { ...prev, membershipStatus: freshStatus };
              OfflineStorageManager.saveUserProfile(updated);
              return updated;
            });
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute live storage stats
  const computeStorageStats = (): StorageStats => {
    const downloadedSongsCount = songs.filter((s) => s.isDownloaded).length;
    const audioKb = downloadedSongsCount * 4200; // ~4.2 MB per track
    const photosKb = moments.length * 1100; // ~1.1 MB per photo
    const appDataKb = 18.5; // Base metadata + lyrics JSON

    return {
      appDataKb,
      cachedAudioKb: audioKb,
      cachedPhotosKb: photosKb,
      totalKb: appDataKb + audioKb + photosKb,
      songsMarkedForOffline: downloadedSongsCount
    };
  };

  // Navigation handlers
  const navigateTo = (screen: ActiveScreen) => {
    if (activeScreen !== screen) {
      setPreviousScreen(activeScreen);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBack = () => {
    if (activeScreen === 'song-detail') {
      setActiveScreen(previousScreen === 'song-detail' ? 'songs' : previousScreen);
    } else {
      setActiveScreen('home');
    }
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setPreviousScreen(activeScreen);
    setActiveScreen('song-detail');
  };

  // Song operations with offline persistence
  const handleToggleFavorite = (songId: string) => {
    setSongs((prev) => {
      const updated = prev.map((s) => {
        if (s.id === songId) {
          const nextVal = !s.isFavorite;
          OfflineStorageManager.queueSyncAction({
            action: nextVal ? 'INSERT' : 'DELETE',
            table: 'user_favorites',
            payload: { user_id: userProfile.id, song_id: songId }
          });
          return { ...s, isFavorite: nextVal };
        }
        return s;
      });
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });

    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleToggleDownload = (songId: string) => {
    setSongs((prev) => {
      const updated = prev.map((s) => {
        if (s.id === songId) {
          const nextVal = !s.isDownloaded;
          return { ...s, isDownloaded: nextVal };
        }
        return s;
      });
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });

    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong((prev) => prev ? { ...prev, isDownloaded: !prev.isDownloaded } : null);
    }
  };

  const handleAddSong = (newSongData: Omit<Song, 'id'>) => {
    const newSong: Song = {
      ...newSongData,
      id: `song_${Date.now()}`
    };

    setSongs((prev) => {
      const updated = [newSong, ...prev];
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });

    OfflineStorageManager.queueSyncAction({
      action: 'INSERT',
      table: 'songs',
      payload: {
        id: newSong.id,
        title: newSong.title,
        amharic_title: newSong.amharicTitle,
        category: newSong.category,
        language: newSong.language,
        written_by: newSong.writtenBy,
        verses: newSong.verses,
        musical_key: newSong.key,
        tempo: newSong.tempo
      }
    });

    handleSelectSong(newSong);
  };

  const handleDeleteSong = (songId: string) => {
    setSongs((prev) => {
      const updated = prev.filter((s) => s.id !== songId);
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });

    OfflineStorageManager.queueSyncAction({
      action: 'DELETE',
      table: 'songs',
      payload: { id: songId }
    });

    setActiveScreen('songs');
  };

  // Schedule operations
  const handleToggleRSVP = (scheduleId: string) => {
    setSchedules((prev) => {
      const updated = prev.map((e) => {
        if (e.id === scheduleId) {
          const nextVal = !e.isAttending;
          OfflineStorageManager.queueSyncAction({
            action: 'UPSERT',
            table: 'schedules',
            payload: { id: scheduleId, is_attending: nextVal }
          });
          return { ...e, isAttending: nextVal };
        }
        return e;
      });
      OfflineStorageManager.saveSchedules(updated);
      return updated;
    });
  };

  const handleAddSchedule = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: `sched_${Date.now()}`
    };

    setSchedules((prev) => {
      const updated = [newEvent, ...prev];
      OfflineStorageManager.saveSchedules(updated);
      return updated;
    });

    OfflineStorageManager.queueSyncAction({
      action: 'INSERT',
      table: 'schedules',
      payload: {
        id: newEvent.id,
        title: newEvent.title,
        type: newEvent.type,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        description: newEvent.description,
        voice_parts_needed: newEvent.voicePartsNeeded
      }
    });
  };

  // Profile operations
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      OfflineStorageManager.saveUserProfile(next);
      OfflineStorageManager.queueSyncAction({
        action: 'UPSERT',
        table: 'profiles',
        payload: {
          id: next.id,
          name: next.name,
          email: next.email,
          voice_part: next.voicePart,
          phone: next.phone,
          choir_role: next.choirRole
        }
      });
      return next;
    });
  };

  // Settings operations
  const handleToggleTheme = () => {
    setSettings((prev) => {
      const nextTheme: AppTheme = prev.theme === 'dark' ? 'light' : 'dark';
      const next: AppSettings = { ...prev, theme: nextTheme };
      OfflineStorageManager.saveSettings(next);
      return next;
    });
  };

  const handleSetLanguage = (lang: AppLanguage) => {
    setSettings((prev) => {
      const next = { ...prev, language: lang };
      OfflineStorageManager.saveSettings(next);
      return next;
    });
  };

  const handleToggleSetting = (key: keyof AppSettings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      OfflineStorageManager.saveSettings(next);
      return next;
    });
  };

  const handleDownloadAllSongs = () => {
    setSongs((prev) => {
      const updated = prev.map((s) => ({ ...s, isDownloaded: true }));
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });
  };

  const handleRemoveDownloadedSongs = () => {
    setSongs((prev) => {
      const updated = prev.map((s) => ({ ...s, isDownloaded: false }));
      OfflineStorageManager.saveSongs(updated);
      return updated;
    });
  };

  const handleClearCache = () => {
    OfflineStorageManager.clearAll();
    setSongs(INITIAL_SONGS);
    setSchedules(INITIAL_SCHEDULES);
  };

  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  // Splash Screen view
  if (activeScreen === 'splash') {
    return <SplashScreen onFinish={() => setActiveScreen('home')} />;
  }

  const isDark = settings.theme === 'dark';
  const language = settings.language || 'am';

  // Strict Choir Security: Members can ONLY access the application with Admin approval!
  const isMemberApprovalGated = userProfile.choirRole !== 'Admin' && userProfile.membershipStatus !== 'approved';

  if (isMemberApprovalGated) {
    return (
      <>
        <PendingApprovalScreen
          userProfile={userProfile}
          theme={settings.theme}
          language={language}
          onApproved={(updatedProfile) => {
            setUserProfile(updatedProfile);
            OfflineStorageManager.saveUserProfile(updatedProfile);
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={() => setIsAuthModalOpen(true)}
        />

        <SimpleChoirAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(profile) => {
            setUserProfile(profile);
            OfflineStorageManager.saveUserProfile(profile);
          }}
          currentProfile={userProfile}
          language={language}
          theme={settings.theme}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-[#0B1328] text-slate-100' : 'bg-[#FAF6EE] text-slate-800'
      }`}
    >
      {/* Top Application Header */}
      <ChoirHeader
        theme={settings.theme}
        language={language}
        onToggleTheme={handleToggleTheme}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        activeScreen={activeScreen}
        onNavigateBack={handleNavigateBack}
        isOfflineMode={isOfflineMode}
        onToggleOfflineSim={() => setIsOfflineMode(!isOfflineMode)}
        onOpenNotifications={() => navigateTo('schedule')}
      />

      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        theme={settings.theme}
        language={language}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Screen Body Router */}
      <main className="min-h-[calc(100vh-60px)]">
        {activeScreen === 'home' && (
          <HomeScreen
            songs={songs}
            schedules={schedules}
            devotionals={INITIAL_DEVOTIONALS}
            theme={settings.theme}
            language={language}
            onSelectSong={handleSelectSong}
            onNavigate={navigateTo}
            onToggleRSVP={handleToggleRSVP}
            isOfflineMode={isOfflineMode}
          />
        )}

        {activeScreen === 'songs' && (
          <SongsScreen
            songs={songs}
            theme={settings.theme}
            language={language}
            userProfile={userProfile}
            onSelectSong={handleSelectSong}
            onToggleFavorite={handleToggleFavorite}
            onToggleDownload={handleToggleDownload}
            onAddSong={handleAddSong}
          />
        )}

        {activeScreen === 'song-detail' && selectedSong && (
          <SongDetailScreen
            song={selectedSong}
            theme={settings.theme}
            userProfile={userProfile}
            onBack={handleNavigateBack}
            onToggleFavorite={handleToggleFavorite}
            onToggleDownload={handleToggleDownload}
            onEditSong={(song) => alert(`Editing "${song.amharicTitle}" lyrics.`)}
            onDeleteSong={handleDeleteSong}
          />
        )}

        {activeScreen === 'library' && (
          <LibraryScreen
            songs={songs}
            theme={settings.theme}
            language={language}
            onSelectSong={handleSelectSong}
            onNavigate={navigateTo}
            onToggleFavorite={handleToggleFavorite}
            onToggleDownload={handleToggleDownload}
          />
        )}

        {activeScreen === 'schedule' && (
          <ScheduleScreen
            schedules={schedules}
            theme={settings.theme}
            language={language}
            userProfile={userProfile}
            onToggleRSVP={handleToggleRSVP}
            onAddSchedule={handleAddSchedule}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            settings={settings}
            songs={songs}
            language={language}
            onToggleTheme={handleToggleTheme}
            onToggleSetting={handleToggleSetting}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            storageStats={computeStorageStats()}
            onToggleTheme={handleToggleTheme}
            onSetLanguage={handleSetLanguage}
            onToggleSetting={handleToggleSetting}
            onDownloadAllSongs={handleDownloadAllSongs}
            onRemoveDownloadedSongs={handleRemoveDownloadedSongs}
            onClearCache={handleClearCache}
            onSyncNow={triggerAutoSync}
            isSyncing={isSyncing}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'about-choir' && (
          <AboutChoirScreen
            theme={settings.theme}
            onBack={handleNavigateBack}
          />
        )}

        {activeScreen === 'about-developer' && (
          <AboutDeveloperScreen
            theme={settings.theme}
            onBack={handleNavigateBack}
          />
        )}

        {activeScreen === 'edit-profile' && (
          <EditProfileScreen
            userProfile={userProfile}
            theme={settings.theme}
            onBack={handleNavigateBack}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeScreen === 'moments' && (
          <MomentsScreen
            moments={moments}
            theme={settings.theme}
            onBack={handleNavigateBack}
            onAddMoment={(newMoment) => setMoments([
              { ...newMoment, id: `m_${Date.now()}` },
              ...moments
            ])}
          />
        )}

        {activeScreen === 'devotionals' && (
          <DevotionalsScreen
            devotionals={INITIAL_DEVOTIONALS}
            theme={settings.theme}
            onBack={handleNavigateBack}
          />
        )}

        {activeScreen === 'choir-leaders' && (
          <ChoirLeadersScreen
            leaders={INITIAL_LEADERS}
            theme={settings.theme}
            onBack={handleNavigateBack}
          />
        )}

        {activeScreen === 'admin-panel' && (
          <AdminPanelScreen
            theme={settings.theme}
            songs={songs}
            schedules={schedules}
            isOfflineMode={isOfflineMode}
            onToggleOfflineSim={() => setIsOfflineMode(!isOfflineMode)}
            onBack={handleNavigateBack}
          />
        )}

        {activeScreen === 'flutter-export' && (
          <FlutterExportScreen
            theme={settings.theme}
            onBack={handleNavigateBack}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <BottomNavBar
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        theme={settings.theme}
        language={language}
      />

      {/* Countryside Simple Member Login Modal */}
      <SimpleChoirAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
          OfflineStorageManager.saveUserProfile(profile);
        }}
        currentProfile={userProfile}
        language={language}
        theme={settings.theme}
      />
    </div>
  );
}
