import { AppLanguage, SongCategory, VoicePart } from '../types';

export interface Translations {
  // Navigation
  navHome: string;
  navSongs: string;
  navLibrary: string;
  navSchedule: string;
  navProfile: string;

  // Header
  online: string;
  offline: string;
  offlineNotice: string;
  reconnectSync: string;

  // Home Screen
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  choirName: string;
  choirFellowship: string;
  nextRehearsal: string;
  rehearsalTime: string;
  rehearsalLocation: string;
  verseOfTheDay: string;
  announcements: string;
  voiceSections: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  catalogedSongs: string;
  favoriteSongs: string;
  offlineDownloaded: string;
  weeklyEvents: string;
  quickActions: string;
  browseHymns: string;
  myLibrary: string;
  rehearsalSchedule: string;

  // Songs Screen
  songsTitle: string;
  songsSubtitle: string;
  searchPlaceholder: string;
  categoryAll: string;
  categoryWorship: string;
  categoryPraise: string;
  categoryChoral: string;
  categoryTraditional: string;
  categoryFastPrayer: string;
  categoryCommunion: string;
  filterAll: string;
  filterWithAudio: string;
  filterOffline: string;
  songsCountSuffix: string;
  noSongsFound: string;
  audioAvailable: string;
  offlineSaved: string;

  // Song Detail
  back: string;
  playRehearsalAudio: string;
  pauseAudio: string;
  fontSize: string;
  copyLyrics: string;
  copiedLyrics: string;
  shareHymn: string;
  downloadOffline: string;
  removeDownload: string;
  author: string;
  musicalKey: string;
  tempo: string;
  verse: string;
  chorus: string;
  bridge: string;

  // Library Screen
  libraryTitle: string;
  librarySubtitle: string;
  tabFavorites: string;
  tabOffline: string;
  tabSetlists: string;
  favorites: string;
  downloads: string;
  noFavorites: string;
  noFavoritesDesc: string;
  noOfflineSongs: string;
  noOfflineSongsDesc: string;
  noSetlists: string;
  createSetlist: string;

  // Schedule Screen
  scheduleTitle: string;
  scheduleSubtitle: string;
  tabUpcoming: string;
  tabPast: string;
  attending: string;
  notAttending: string;
  iWillAttend: string;
  cannotAttend: string;
  location: string;
  time: string;
  voicePartsNeeded: string;
  remindMe: string;
  reminderActive: string;

  // Profile Screen
  profileTitle: string;
  choirMember: string;
  voicePartLabel: string;
  choirRoleLabel: string;
  phoneLabel: string;
  universityLabel: string;
  statsTitle: string;
  rehearsalsAttended: string;
  savedFavoritesCount: string;
  offlineTracksCount: string;
  simpleLoginTitle: string;
  simpleLoginSubtitle: string;
  loginButton: string;
  logoutButton: string;
  switchProfile: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  appearance: string;
  themeDark: string;
  themeLight: string;
  themeToggle: string;
  language: string;
  amharic: string;
  english: string;
  audioTools: string;
  pitchReference: string;
  pitchReferenceDesc: string;
  playTone: string;
  playing: string;
  autoScroll: string;
  autoScrollDesc: string;
  rehearsalAlerts: string;
  rehearsalAlertsDesc: string;
  storageTitle: string;
  hymnsData: string;
  cachedAudio: string;
  cachedPhotos: string;
  totalStorage: string;
  downloadAllHymns: string;
  clearCache: string;
  cloudSyncTitle: string;
  cloudSyncDesc: string;
  connectSupabase: string;
  cloudConnected: string;
  cloudNotConnected: string;
  syncNow: string;
  syncing: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  am: {
    // Navigation
    navHome: 'መነሻ',
    navSongs: 'መዝሙራት',
    navLibrary: 'ቤተ-መጻሕፍት',
    navSchedule: 'መርሐ-ግብር',
    navProfile: 'መገለጫ',

    // Header
    online: 'በመስመር ላይ',
    offline: 'ከመስመር ውጭ',
    offlineNotice: 'ከመስመር ውጭ ነዎት — የወረዱ መዝሙራትና ግጥሞች ይሰራሉ።',
    reconnectSync: 'ተገናኝቷል • መረጃዎች ተመሳስለዋል',

    // Home Screen
    greetingMorning: 'እንደምን አደራችሁ',
    greetingAfternoon: 'እንደምን ዋላችሁ',
    greetingEvening: 'እንደምን አመሻችሁ',
    choirName: 'የይዲድያ መዘምራን',
    choirFellowship: 'አዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ የኮምፒውተር ሳይንስ ተማሪዎች ህብረት',
    nextRehearsal: 'ቀጣይ የዝማሬ ልምምድ',
    rehearsalTime: 'እሑድ ከቀኑ 8:00 - 11:00 ሰዓት',
    rehearsalLocation: 'አዳማ ዩኒቨርሲቲ ቤተክርስቲያን አዳራሽ',
    verseOfTheDay: 'የዕለቱ ቃል',
    announcements: 'የመዘምራን ማስታወቂያዎች',
    voiceSections: 'የድምፅ ክፍሎች',
    soprano: 'ሶፕራኖ',
    alto: 'አልቶ',
    tenor: 'ቴኖር',
    bass: 'ባስ',
    catalogedSongs: 'መዝሙራት',
    favoriteSongs: 'የተወደዱ',
    offlineDownloaded: 'ከመስመር ውጭ',
    weeklyEvents: 'መርሐ-ግብሮች',
    quickActions: 'ፈጣን አገልግሎቶች',
    browseHymns: 'ሁሉንም መዝሙራት ተመልከት',
    myLibrary: 'የግል ዝማሬዎች',
    rehearsalSchedule: 'የልምምድ መርሐ-ግብር',

    // Songs Screen
    songsTitle: 'የመዝሙራት ስብስብ',
    songsSubtitle: 'የመንፈሳዊ ዝማሬዎች፣ ግጥሞችና የልምምድ ቅጂዎች ማኅደር',
    searchPlaceholder: 'የመዝሙር ርዕስ ወይም ግጥም ፈልግ...',
    categoryAll: 'ሁሉንም',
    categoryWorship: 'አምልኮ',
    categoryPraise: 'ምስጋና',
    categoryChoral: 'ኅብረት',
    categoryTraditional: 'ባህላዊ',
    categoryFastPrayer: 'ጾም እና ጸሎት',
    categoryCommunion: 'የጌታ እራት',
    filterAll: 'ሁሉንም',
    filterWithAudio: 'በድምፅ ብቻ',
    filterOffline: 'የወረዱ',
    songsCountSuffix: 'መዝሙራት ተገኝተዋል',
    noSongsFound: 'ምንም የተገኘ መዝሙር የለም',
    audioAvailable: 'የልምምድ ድምፅ አለው',
    offlineSaved: 'ከመስመር ውጭ ይገኛል',

    // Song Detail
    back: 'ተመለስ',
    playRehearsalAudio: 'የልምምድ ድምፅ አጫውት',
    pauseAudio: 'አቁም',
    fontSize: 'የፊደል መጠን',
    copyLyrics: 'ግጥሙን ገልብጥ',
    copiedLyrics: 'ግጥሙ ተገልብጧል!',
    shareHymn: 'አጋራ',
    downloadOffline: 'ከመስመር ውጭ አስቀምጥ',
    removeDownload: 'የወረደውን አስወግድ',
    author: 'ደራሲ / አቀናባሪ',
    musicalKey: 'ኪይ (Key)',
    tempo: 'ቴምፖ (Tempo)',
    verse: 'ክፍል',
    chorus: 'አዝማች',
    bridge: 'ማገናኛ',

    // Library Screen
    libraryTitle: 'የግል ቤተ-መጻሕፍት',
    librarySubtitle: 'የተወደዱ፣ የወረዱ እና የተዘጋጁ የዝማሬ ዝርዝሮች',
    tabFavorites: 'የተወደዱ',
    tabOffline: 'የወረዱ መዝሙራት',
    tabSetlists: 'የዝማሬ ዝርዝሮች',
    favorites: 'የተወደዱ',
    downloads: 'የወረዱ',
    noFavorites: 'ምንም የተወደደ መዝሙር የለም',
    noFavoritesDesc: 'በመዝሙራት ገጽ ላይ የልብ ቅርጹን በመንካት እዚህ ማሰባሰብ ይችላሉ።',
    noOfflineSongs: 'ከመስመር ውጭ የወረደ መዝሙር የለም',
    noOfflineSongsDesc: 'ያለ ኢንተርኔት በገጠርም ሆነ በጉዞ ወቅት ለመዘመር መዝሙራቱን ያውርዱ።',
    noSetlists: 'ምንም የተዘጋጀ የዝማሬ ዝርዝር የለም',
    createSetlist: 'አዲስ የዝማሬ ዝርዝር ፍጠር',

    // Schedule Screen
    scheduleTitle: 'የልምምድ መርሐ-ግብር',
    scheduleSubtitle: 'የይዲድያ መዘምራን ሳምንታዊና ልዩ ፕሮግራሞች',
    tabUpcoming: 'ቀጣይ መርሐ-ግብሮች',
    tabPast: 'ያለፉ ፕሮግራሞች',
    attending: 'እገኛለሁ',
    notAttending: 'አልገኝም',
    iWillAttend: 'እገኛለሁ (አረጋግጥ)',
    cannotAttend: 'አልገኝም',
    location: 'ቦታ',
    time: 'ሰዓት',
    voicePartsNeeded: 'ተፈላጊ የድምፅ ክፍሎች',
    remindMe: 'አስታውሰኝ',
    reminderActive: 'ማስታወሻ በርቷል',

    // Profile Screen
    profileTitle: 'የመዘምራን መገለጫ',
    choirMember: 'የይዲድያ መዘምራን አባል',
    voicePartLabel: 'የድምፅ ክፍል',
    choirRoleLabel: 'የአገልግሎት ድርሻ',
    phoneLabel: 'ስልክ ቁጥር',
    universityLabel: 'ተቋም / ዩኒቨርሲቲ',
    statsTitle: 'የአገልግሎት አጠቃላይ መረጃ',
    rehearsalsAttended: 'የተገኙባቸው ልምምዶች',
    savedFavoritesCount: 'የተወደዱ መዝሙራት',
    offlineTracksCount: 'ከመስመር ውጭ ዝማሬዎች',
    simpleLoginTitle: 'ቀላል የገጠር መዘምራን መግቢያ',
    simpleLoginSubtitle: 'ያለ ውስብስብ ፓስወርድ ስምዎንና የድምፅ ክፍልዎን በመምረጥ በቀላሉ ይግቡ',
    loginButton: 'ግባ / ተመዝገብ',
    logoutButton: 'መገለጫ ቀይር / ውጣ',
    switchProfile: 'መለያ ቀይር',

    // Settings
    settingsTitle: 'ቅንብሮች',
    settingsSubtitle: 'የመተግበሪያ ገጽታ፣ ቋንቋ፣ የድምፅ መሣሪያዎችና ማከማቻ',
    appearance: 'ገጽታ (Appearance)',
    themeDark: 'የጨለማ ገጽታ (Dark Mode)',
    themeLight: 'የብርሃን ገጽታ (Light Mode)',
    themeToggle: 'ገጽታ ቀይር',
    language: 'የመተግበሪያ ቋንቋ',
    amharic: 'አማርኛ (ቀዳሚ)',
    english: 'English (Phonetics)',
    audioTools: 'የልምምድ እና የድምፅ መሣሪያዎች',
    pitchReference: 'የድምፅ መቃኛ ቶን (Pitch Pipe)',
    pitchReferenceDesc: 'ለመዘምራን ድምፅ ማስተካከያ የሚሆን ማጣቀሻ ቶን',
    playTone: 'አጫውት',
    playing: 'እየተጫወተ...',
    autoScroll: 'ግጥሙን በራስ-ሰር አንሸራትት',
    autoScrollDesc: 'በልምምድ ወቅት የድምፅ ቅጂው ሲጫወት ግጥሙ አብሮ ይከተላል',
    rehearsalAlerts: 'የልምምድ ማስታወሻ',
    rehearsalAlertsDesc: 'ከእሑድ እና ሐሙስ ልምምድ 2 ሰዓት ቀደም ብሎ ማሳሰቢያ ይሰጣል',
    storageTitle: 'ከመስመር ውጭ ማከማቻ',
    hymnsData: 'የመዝሙራት መረጃና ግጥሞች',
    cachedAudio: 'የተቀመጡ የልምምድ ድምፆች',
    cachedPhotos: 'የኅብረት ፎቶዎች',
    totalStorage: 'ጠቅላላ ከመስመር ውጭ ማከማቻ',
    downloadAllHymns: 'ሁሉንም መዝሙራት ከመስመር ውጭ አውርድ',
    clearCache: 'ጊዜያዊ ድምፆችን አጽዳ',
    cloudSyncTitle: 'ሱፓቤዝ የደመና ግንኙነት',
    cloudSyncDesc: 'መዝሙራትንና መርሐ-ግብሮችን በቅጽበት በሁሉም መዘምራን ስልኮች ላይ ለማመሳሰል',
    connectSupabase: 'ሱፓቤዝን አገናኝ',
    cloudConnected: 'ደመናው በቀጥታ ተገናኝቷል • Live Realtime',
    cloudNotConnected: 'ደመና አልተገናኘም (በስልክ ማከማቻ እየሰራ ነው)',
    syncNow: 'አሁን አመሳስል',
    syncing: 'እያመሳሰለ ነው...'
  },
  en: {
    // Navigation
    navHome: 'Home',
    navSongs: 'Songs',
    navLibrary: 'Library',
    navSchedule: 'Schedule',
    navProfile: 'Profile',

    // Header
    online: 'Online',
    offline: 'Offline',
    offlineNotice: 'Offline mode active — cached hymns and lyrics are accessible.',
    reconnectSync: 'Connected • Offline sync completed',

    // Home Screen
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    choirName: 'Yididya Choir',
    choirFellowship: 'ASTU Computer Science & Engineering Fellowship',
    nextRehearsal: 'Next Vocal Rehearsal',
    rehearsalTime: 'Sunday 2:00 PM - 5:00 PM',
    rehearsalLocation: 'Adama University Fellowship Hall',
    verseOfTheDay: 'Verse of the Day',
    announcements: 'Choir Announcements',
    voiceSections: 'Voice Sections',
    soprano: 'Soprano',
    alto: 'Alto',
    tenor: 'Tenor',
    bass: 'Bass',
    catalogedSongs: 'Hymns',
    favoriteSongs: 'Favorites',
    offlineDownloaded: 'Offline',
    weeklyEvents: 'Events',
    quickActions: 'Quick Navigation',
    browseHymns: 'Browse Hymn Archive',
    myLibrary: 'My Library & Favorites',
    rehearsalSchedule: 'Choir Rehearsals',

    // Songs Screen
    songsTitle: 'Hymn Collection',
    songsSubtitle: 'Spiritual songs, liturgical lyrics and vocal rehearsal tracks',
    searchPlaceholder: 'Search hymn title or lyrics...',
    categoryAll: 'All',
    categoryWorship: 'Worship',
    categoryPraise: 'Praise',
    categoryChoral: 'Choral',
    categoryTraditional: 'Traditional',
    categoryFastPrayer: 'Fast & Prayer',
    categoryCommunion: 'Communion',
    filterAll: 'All',
    filterWithAudio: 'With Audio',
    filterOffline: 'Offline',
    songsCountSuffix: 'hymns found',
    noSongsFound: 'No hymns match your search',
    audioAvailable: 'Audio track available',
    offlineSaved: 'Saved for offline singing',

    // Song Detail
    back: 'Back',
    playRehearsalAudio: 'Play Vocal Track',
    pauseAudio: 'Pause',
    fontSize: 'Text Size',
    copyLyrics: 'Copy Lyrics',
    copiedLyrics: 'Lyrics copied!',
    shareHymn: 'Share Hymn',
    downloadOffline: 'Download for Offline',
    removeDownload: 'Remove Download',
    author: 'Author / Composer',
    musicalKey: 'Key',
    tempo: 'Tempo',
    verse: 'Verse',
    chorus: 'Chorus',
    bridge: 'Bridge',

    // Library Screen
    libraryTitle: 'My Choir Library',
    librarySubtitle: 'Bookmarked hymns, downloaded tracks and rehearsal setlists',
    tabFavorites: 'Favorites',
    tabOffline: 'Offline Saved',
    tabSetlists: 'Setlists',
    favorites: 'Favorites',
    downloads: 'Downloads',
    noFavorites: 'No favorites yet',
    noFavoritesDesc: 'Tap the heart icon on any hymn to save it to your personal list.',
    noOfflineSongs: 'No offline songs downloaded',
    noOfflineSongsDesc: 'Download songs to praise even when you have no mobile reception in rural areas.',
    noSetlists: 'No rehearsal setlists created',
    createSetlist: 'Create New Setlist',

    // Schedule Screen
    scheduleTitle: 'Rehearsals & Events',
    scheduleSubtitle: 'Yididya Choir weekly practices and ministry programs',
    tabUpcoming: 'Upcoming',
    tabPast: 'Past Programs',
    attending: 'Attending',
    notAttending: 'Cannot Attend',
    iWillAttend: 'I Will Attend',
    cannotAttend: 'Cannot Attend',
    location: 'Location',
    time: 'Time',
    voicePartsNeeded: 'Voice Sections Needed',
    remindMe: 'Remind Me',
    reminderActive: 'Reminder Set',

    // Profile Screen
    profileTitle: 'Choir Member Profile',
    choirMember: 'Yididya Choir Member',
    voicePartLabel: 'Voice Part',
    choirRoleLabel: 'Choir Ministry Role',
    phoneLabel: 'Phone Number',
    universityLabel: 'Institution / Fellowship',
    statsTitle: 'Choir Participation Overview',
    rehearsalsAttended: 'Rehearsals Attended',
    savedFavoritesCount: 'Favorite Hymns',
    offlineTracksCount: 'Offline Songs Saved',
    simpleLoginTitle: 'Simple Countryside Sign-In',
    simpleLoginSubtitle: 'Select your name and voice part for easy one-tap access with zero tech hassle',
    loginButton: 'Sign In / Register',
    logoutButton: 'Switch Profile / Sign Out',
    switchProfile: 'Switch Profile',

    // Settings
    settingsTitle: 'Settings & Preferences',
    settingsSubtitle: 'Choir preferences, audio rehearsals & storage',
    appearance: 'APPEARANCE',
    themeDark: 'Dark Theme',
    themeLight: 'Light Theme',
    themeToggle: 'Switch Theme',
    language: 'HYMN & UI LANGUAGE',
    amharic: 'አማርኛ (Amharic)',
    english: 'English (Phonetics)',
    audioTools: 'REHEARSAL & AUDIO TOOLS',
    pitchReference: 'Choir Pitch Reference',
    pitchReferenceDesc: 'Key reference tone for choir vocal tuning',
    playTone: 'Play Tone',
    playing: 'Playing...',
    autoScroll: 'Auto-Scroll Hymn Lyrics',
    autoScrollDesc: 'Follow song verses automatically during audio rehearsal playback',
    rehearsalAlerts: 'Rehearsal Notifications',
    rehearsalAlertsDesc: 'Notify 2 hours prior to Sunday and Thursday vocal practices',
    storageTitle: 'OFFLINE STORAGE & CACHE',
    hymnsData: 'Choir Hymns & Lyrics',
    cachedAudio: 'Rehearsal Audio Cache',
    cachedPhotos: 'Fellowship Photos',
    totalStorage: 'Total Offline Footprint',
    downloadAllHymns: 'Download All Hymns For Offline',
    clearCache: 'Clear Temporary Audio Cache',
    cloudSyncTitle: 'SUPABASE REAL-TIME CLOUD',
    cloudSyncDesc: 'Synchronize hymns, lyrics, and practice schedules across all choir member devices',
    connectSupabase: 'Connect Supabase Credentials',
    cloudConnected: 'Cloud Connected • Live Realtime Active',
    cloudNotConnected: 'Cloud Disconnected (Using Local Offline Storage)',
    syncNow: 'Sync Now',
    syncing: 'Syncing...'
  }
};

export const getTranslation = (lang: AppLanguage = 'am'): Translations => {
  return TRANSLATIONS[lang] || TRANSLATIONS.am;
};

export const getCategoryLabel = (category: SongCategory, lang: AppLanguage = 'am'): string => {
  if (lang === 'am') {
    switch (category) {
      case 'Worship': return 'አምልኮ';
      case 'Praise': return 'ምስጋና';
      case 'Choral': return 'ኅብረት';
      case 'Traditional': return 'ባህላዊ';
      case 'Fast & Prayer': return 'ጾም እና ጸሎት';
      case 'Communion': return 'የጌታ እራት';
      default: return category;
    }
  }
  return category;
};

export const getVoicePartLabel = (part: VoicePart, lang: AppLanguage = 'am'): string => {
  if (lang === 'am') {
    switch (part) {
      case 'Soprano': return 'ሶፕራኖ';
      case 'Alto': return 'አልቶ';
      case 'Tenor': return 'ቴኖር';
      case 'Bass': return 'ባስ';
      default: return 'ያልተመደበ';
    }
  }
  return part;
};
