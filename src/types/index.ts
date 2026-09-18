export type ChoirRole = 'Admin' | 'Singer' | 'Conductor' | 'Section Leader' | 'Member' | 'Voice Leader';
export type VoicePart = 'Unassigned' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass';
export type SongCategory = 'Worship' | 'Praise' | 'Traditional' | 'Choral' | 'Hymn' | 'Hymns' | 'Communion' | 'Fast & Prayer';
export type AppTheme = 'dark' | 'light';
export type AppLanguage = 'en' | 'am';

export interface SongVerse {
  type: 'VERSE' | 'CHORUS' | 'BRIDGE' | 'INTRO' | 'OUTRO' | 'Verse' | 'Chorus' | 'Bridge';
  index?: number;
  lines: string[];
}

export interface Song {
  id: string;
  title: string;
  amharicTitle: string;
  transliteration?: string;
  category: SongCategory;
  writtenBy: string;
  key?: string;
  tempo?: string;
  language: string;
  verses: SongVerse[];
  audioUrl?: string;
  audioDuration?: string;
  hasAudio?: boolean;
  isFavorite: boolean;
  isDownloaded: boolean;
  downloadDate?: string;
  lastPlayed?: string;
  createdAt: string;
  lyricsFontSize?: number;
  textAlign?: 'left' | 'center';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'Rehearsal' | 'Sunday Worship' | 'Special Program' | 'Vocal Training';
  date: string;
  time: string;
  location: string;
  description: string;
  voicePartsNeeded: VoicePart[] | string[];
  isAttending?: boolean;
  isPast?: boolean;
  reminderSet?: boolean;
}

export type MembershipStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  choirRole: ChoirRole;
  voicePart: VoicePart;
  phone: string;
  avatarLetter: string;
  avatarUrl?: string;
  bio?: string;
  university?: string;
  joinedYear?: string;
  membershipStatus?: MembershipStatus;
  pin?: string;
  registeredAt?: string;
}

export interface Moment {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  location?: string;
  category?: 'Rehearsal' | 'Concert' | 'Ministry' | 'Fellowship' | string;
  isCachedOffline?: boolean;
  likesCount: number;
  isLiked?: boolean;
}

export interface Devotional {
  id: string;
  title: string;
  scripture: string;
  content: string;
  body?: string;
  author: string;
  date: string;
  readTime: string;
}

export interface ChoirLeader {
  id: string;
  name: string;
  role: string;
  voicePart: VoicePart;
  phone: string;
  email: string;
  bio: string;
  photoUrl?: string;
}

export interface StorageStats {
  appDataKb: number;
  cachedAudioKb: number;
  cachedPhotosKb: number;
  totalKb: number;
  songsMarkedForOffline: number;
}

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  notificationsEnabled: boolean;
  autoDownloadOffline: boolean;
  pinLockEnabled: boolean;
  pinCode: string;
  biometricsEnabled: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export type ActiveScreen = 
  | 'splash'
  | 'home' 
  | 'songs' 
  | 'library' 
  | 'schedule' 
  | 'profile'
  | 'song-detail'
  | 'moments'
  | 'devotionals'
  | 'choir-leaders'
  | 'admin-panel'
  | 'about-choir'
  | 'about-developer'
  | 'settings'
  | 'edit-profile'
  | 'flutter-export';
