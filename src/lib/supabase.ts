import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Song, ScheduleEvent, UserProfile, StorageStats, VoicePart, ChoirRole, MembershipStatus } from '../types';
import { INITIAL_SONGS, INITIAL_SCHEDULES, INITIAL_PROFILE, INITIAL_MEMBERS } from '../data/initialChoirData';

let supabaseClient: SupabaseClient | null = null;
let activeRealtimeChannel: RealtimeChannel | null = null;

// The database URL and Anon Key are configured exclusively in code/environment
export const getSupabaseConfig = () => {
  const envUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';
  
  // Project credentials
  const defaultUrl = 'https://rzotkwzwvljxsjjdwwel.supabase.co';
  const defaultKey = 'sb_publishable_y2KK5T05KLMAuXaNIo5tXw_Jwp9bW5h';

  const url = envUrl || defaultUrl;
  const key = envKey || defaultKey;

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http'))
  };
};

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseClient) return supabaseClient;
  const { url, key, isConfigured } = getSupabaseConfig();
  if (isConfigured && url && key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return supabaseClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
};

// Fetch real-time songs from Supabase, auto-seeding if empty
export const fetchRemoteSongs = async (): Promise<Song[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Table doesn't exist yet or connection error - use offline local cache
      console.info('Supabase songs fetch notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      // Auto-seed initial hymns so remote database has the choir songs immediately
      console.log('Seeding initial choir hymns to Supabase...');
      const rowsToInsert = INITIAL_SONGS.map((s) => ({
        id: s.id,
        title: s.title,
        amharic_title: s.amharicTitle,
        category: s.category,
        written_by: s.writtenBy,
        language: s.language,
        verses: s.verses,
        audio_url: s.audioUrl || null,
        audio_duration: s.audioDuration || null,
        has_audio: s.hasAudio ?? true,
        musical_key: s.key || null,
        tempo: s.tempo || null
      }));

      await supabase.from('songs').insert(rowsToInsert);
      return INITIAL_SONGS;
    }

    // Map remote rows to Song objects
    const mapped: Song[] = data.map((row: any) => ({
      id: String(row.id),
      title: row.title || 'Untitled',
      amharicTitle: row.amharic_title || row.title || '',
      category: row.category || 'Worship',
      writtenBy: row.written_by || 'Yididya Choir',
      language: row.language || 'Amharic',
      verses: Array.isArray(row.verses) ? row.verses : [],
      audioUrl: row.audio_url || undefined,
      audioDuration: row.audio_duration || undefined,
      hasAudio: row.has_audio ?? true,
      key: row.musical_key || row.key || undefined,
      tempo: row.tempo || undefined,
      isFavorite: false,
      isDownloaded: true,
      createdAt: row.created_at || new Date().toISOString()
    }));

    OfflineStorageManager.saveSongs(mapped);
    return mapped;
  } catch (err) {
    console.warn('Error fetching remote songs:', err);
    return null;
  }
};

// Fetch real-time schedules from Supabase, auto-seeding if empty
export const fetchRemoteSchedules = async (): Promise<ScheduleEvent[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.info('Supabase schedules fetch notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('Seeding initial choir rehearsals to Supabase...');
      const rows = INITIAL_SCHEDULES.map((sch) => ({
        id: sch.id,
        title: sch.title,
        type: sch.type,
        date: sch.date,
        time: sch.time,
        location: sch.location,
        description: sch.description,
        voice_parts_needed: sch.voicePartsNeeded
      }));

      await supabase.from('schedules').insert(rows);
      return INITIAL_SCHEDULES;
    }

    const mapped: ScheduleEvent[] = data.map((row: any) => ({
      id: String(row.id),
      title: row.title || 'Rehearsal',
      type: row.type || 'Rehearsal',
      date: row.date || '',
      time: row.time || '',
      location: row.location || '',
      description: row.description || '',
      voicePartsNeeded: Array.isArray(row.voice_parts_needed) ? row.voice_parts_needed : ['Soprano', 'Alto', 'Tenor', 'Bass'],
      isAttending: false,
      isPast: false,
      reminderSet: true
    }));

    OfflineStorageManager.saveSchedules(mapped);
    return mapped;
  } catch (err) {
    console.warn('Error fetching remote schedules:', err);
    return null;
  }
};

// Real-Time subscription for Songs, Schedules, and Profiles
export const subscribeToRealtimeChanges = (
  onSongChange: () => void,
  onScheduleChange: () => void,
  onProfileChange?: () => void
): (() => void) => {
  const supabase = getSupabase();
  if (!supabase) {
    return () => {};
  }

  try {
    if (activeRealtimeChannel) {
      try {
        activeRealtimeChannel.unsubscribe();
      } catch {
        // ignore
      }
    }

    const channel = supabase
      .channel('yididya-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'songs' },
        () => {
          onSongChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        () => {
          onScheduleChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          if (onProfileChange) onProfileChange();
        }
      )
      .subscribe();

    activeRealtimeChannel = channel;

    return () => {
      try {
        channel.unsubscribe();
      } catch {
        // ignore
      }
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
};

// Member Authentication & Admin-Approval Workflow
export interface ChoirAuthPayload {
  name: string;
  voicePart: VoicePart;
  phone?: string;
  pin?: string;
  choirRole?: ChoirRole;
  isAdminAttempt?: boolean;
}

export interface AuthResult {
  success: boolean;
  profile: UserProfile;
  isPending?: boolean;
  isRejected?: boolean;
  message: string;
}

export const simpleChoirAuth = async (payload: ChoirAuthPayload): Promise<AuthResult> => {
  const cleanName = payload.name.trim();
  const cleanPhone = (payload.phone || '').trim();
  const suppliedPin = (payload.pin || '').trim();

  // Check if Admin Login attempt (Ephraim Tessema or Admin credentials)
  const isAdminCredentials = 
    payload.isAdminAttempt || 
    cleanPhone === '+251 938 126 346' || 
    cleanPhone === '0938126346' || 
    (cleanName.toLowerCase().includes('ephraim') && (suppliedPin === '1234' || suppliedPin === 'admin'));

  if (isAdminCredentials) {
    const adminProfile: UserProfile = {
      ...INITIAL_PROFILE,
      phone: cleanPhone || INITIAL_PROFILE.phone,
      membershipStatus: 'approved',
      choirRole: 'Admin'
    };
    OfflineStorageManager.saveUserProfile(adminProfile);
    return {
      success: true,
      profile: adminProfile,
      message: 'እንኳን ወደ ይዲድያ መዘምራን አስተዳዳሪ (Admin) ገጽ በደህና መጡ!'
    };
  }

  // Generate or find consistent member ID
  const normalizedPhone = cleanPhone.replace(/\D/g, '');
  const id = `member-${cleanName.toLowerCase().replace(/\s+/g, '-')}-${normalizedPhone.slice(-4) || 'astu'}`;

  // Check local members list first
  const localMembers = OfflineStorageManager.loadMembers();
  let existing = localMembers.find(
    (m) => m.id === id || (cleanPhone && m.phone && m.phone.replace(/\D/g, '').endsWith(normalizedPhone.slice(-8)))
  );

  // Check remote Supabase if connected
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('profiles').select('*');
      if (cleanPhone) {
        query = query.or(`id.eq.${id},phone.eq.${cleanPhone}`);
      } else {
        query = query.eq('id', id);
      }
      const { data } = await query.limit(1);
      if (data && data.length > 0) {
        const row = data[0];
        existing = {
          id: row.id,
          name: row.name || cleanName,
          email: row.email || `${row.id}@yididya.choir`,
          choirRole: (row.choir_role as ChoirRole) || 'Member',
          voicePart: (row.voice_part as VoicePart) || payload.voicePart,
          phone: row.phone || cleanPhone,
          avatarLetter: (row.name || cleanName).charAt(0).toUpperCase(),
          bio: row.bio || `የይዲድያ መዘምራን አባል • ክፍል: ${row.voice_part || payload.voicePart}`,
          university: row.university || 'ASTU',
          membershipStatus: (row.status as MembershipStatus) || 'pending',
          pin: row.pin || suppliedPin,
          registeredAt: row.created_at || new Date().toISOString(),
          joinedYear: row.joined_year || new Date().getFullYear().toString()
        };
      }
    } catch (e) {
      console.warn('Supabase lookup note:', e);
    }
  }

  if (existing) {
    if (existing.membershipStatus === 'rejected') {
      return {
        success: false,
        profile: existing,
        isRejected: true,
        message: 'ይቅርታ፣ ይህ የአባልነት ጥያቄ በመዘምራን መሪዎች ውድቅ ተደርጓል። እባክዎ አድሚኑን ያነጋግሩ።'
      };
    }

    if (existing.membershipStatus === 'pending') {
      OfflineStorageManager.saveUserProfile(existing);
      return {
        success: true,
        profile: existing,
        isPending: true,
        message: 'የአባልነት ጥያቄዎ በአድሚን በመጠባበቅ ላይ ነው። አድሚኑ ሲያጸድቀው ወዲያውኑ ይከፈትልዎታል።'
      };
    }

    // Status is 'approved'
    OfflineStorageManager.saveUserProfile(existing);
    return {
      success: true,
      profile: existing,
      message: 'የመዘምራን መለያዎ ጸድቋል! እንኳን ደህና መጡ።'
    };
  }

  // NEW MEMBER REGISTRATION: STRICTLY REQUIRES ADMIN APPROVAL!
  const newMemberProfile: UserProfile = {
    id,
    name: cleanName,
    email: `${id}@yididya.choir`,
    choirRole: payload.choirRole || 'Member',
    voicePart: payload.voicePart,
    phone: cleanPhone || '+251 900 000 000',
    avatarLetter: cleanName.charAt(0).toUpperCase(),
    university: 'Adama Science and Technology University (ASTU)',
    bio: `የይዲድያ መዘምራን አባል • ክፍል: ${payload.voicePart}`,
    joinedYear: new Date().getFullYear().toString(),
    membershipStatus: 'pending', // STRICTLY PENDING UNTIL ADMIN APPROVES!
    pin: suppliedPin || '1234',
    registeredAt: new Date().toISOString()
  };

  // Add to local members roster
  const updatedMembersList = [newMemberProfile, ...localMembers.filter((m) => m.id !== id)];
  OfflineStorageManager.saveMembers(updatedMembersList);
  OfflineStorageManager.saveUserProfile(newMemberProfile);

  // Send request to Supabase profiles table
  if (supabase) {
    try {
      await supabase.from('profiles').upsert({
        id: newMemberProfile.id,
        name: newMemberProfile.name,
        email: newMemberProfile.email,
        choir_role: newMemberProfile.choirRole,
        voice_part: newMemberProfile.voicePart,
        phone: newMemberProfile.phone,
        bio: newMemberProfile.bio,
        status: 'pending', // Awaiting Admin Approval
        pin: newMemberProfile.pin,
        created_at: newMemberProfile.registeredAt,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase profile request queued offline:', err);
      OfflineStorageManager.queueChange('UPSERT', 'profiles', {
        id: newMemberProfile.id,
        name: newMemberProfile.name,
        phone: newMemberProfile.phone,
        voice_part: newMemberProfile.voicePart,
        status: 'pending'
      });
    }
  }

  return {
    success: true,
    profile: newMemberProfile,
    isPending: true,
    message: 'የአባልነት ጥያቄዎ በተሳካ ሁኔታ ለአድሚን ተልኳል! የአድሚን ፈቃድ በመጠባበቅ ላይ ነው።'
  };
};

export const verifyMemberPin = (
  enteredPin: string, 
  userProfile?: UserProfile | null
): boolean => {
  const clean = enteredPin.trim();
  if (!clean) return false;
  // Master bypass / default PIN
  if (clean === '1234') return true;
  if (!userProfile) return false;
  if (userProfile.pin && clean === userProfile.pin.trim()) return true;
  return false;
};

export const fetchRemoteMembers = async (): Promise<UserProfile[]> => {
  const localMembers = OfflineStorageManager.loadMembers();
  const supabase = getSupabase();
  if (!supabase) return localMembers;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localMembers;
    }

    const mapped: UserProfile[] = data.map((row: any) => ({
      id: row.id,
      name: row.name || 'Member',
      email: row.email || `${row.id}@yididya.choir`,
      choirRole: (row.choir_role as ChoirRole) || 'Member',
      voicePart: (row.voice_part as VoicePart) || 'Tenor',
      phone: row.phone || '',
      avatarLetter: (row.name || 'M').charAt(0).toUpperCase(),
      bio: row.bio || '',
      university: row.university || 'ASTU',
      membershipStatus: (row.status as MembershipStatus) || 'pending',
      pin: row.pin || '1234',
      registeredAt: row.created_at || new Date().toISOString(),
      joinedYear: row.joined_year || '2026'
    }));

    OfflineStorageManager.saveMembers(mapped);
    return mapped;
  } catch (e) {
    console.warn('Failed to fetch remote members, using cached:', e);
    return localMembers;
  }
};

export const updateMemberApprovalStatus = async (
  memberId: string,
  status: MembershipStatus,
  role?: ChoirRole,
  voicePart?: VoicePart
): Promise<{ success: boolean; message: string }> => {
  const members = OfflineStorageManager.loadMembers();
  const updatedMembers = members.map((m) => {
    if (m.id === memberId) {
      return {
        ...m,
        membershipStatus: status,
        ...(role ? { choirRole: role } : {}),
        ...(voicePart ? { voicePart } : {})
      };
    }
    return m;
  });
  OfflineStorageManager.saveMembers(updatedMembers);

  // If current active user profile is this member, update active session too
  const currentProfile = OfflineStorageManager.loadUserProfile();
  if (currentProfile && currentProfile.id === memberId) {
    OfflineStorageManager.saveUserProfile({
      ...currentProfile,
      membershipStatus: status,
      ...(role ? { choirRole: role } : {}),
      ...(voicePart ? { voicePart } : {})
    });
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      if (role) updateData.choir_role = role;
      if (voicePart) updateData.voice_part = voicePart;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', memberId);

      if (error) {
        OfflineStorageManager.queueChange('UPDATE', 'profiles', { id: memberId, ...updateData });
      }
    } catch {
      OfflineStorageManager.queueChange('UPDATE', 'profiles', { id: memberId, status, choir_role: role, voice_part: voicePart });
    }
  }

  return {
    success: true,
    message: status === 'approved' ? 'አባሉ በተሳካ ሁኔታ ጸድቋል!' : 'የአባልነት ጥያቄው ውድቅ ተደርጓል።'
  };
};

export const checkMemberApprovalStatus = async (memberId: string): Promise<MembershipStatus> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', memberId)
        .single();

      if (!error && data && data.status) {
        return data.status as MembershipStatus;
      }
    } catch {
      // ignore
    }
  }

  const members = OfflineStorageManager.loadMembers();
  const found = members.find((m) => m.id === memberId);
  return found?.membershipStatus || 'pending';
};

// Offline Storage and Sync Manager
export class OfflineStorageManager {
  private static STORAGE_KEY_SONGS = 'yididya_cached_songs_v2';
  private static STORAGE_KEY_SCHEDULES = 'yididya_cached_schedules_v2';
  private static STORAGE_KEY_PROFILE = 'yididya_cached_profile_v2';
  private static STORAGE_KEY_MEMBERS = 'yididya_cached_members_v2';
  private static STORAGE_KEY_QUEUE = 'yididya_sync_queue_v2';

  static saveMembers(members: UserProfile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Error saving members:', e);
    }
  }

  static loadMembers(): UserProfile[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_MEMBERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading members:', e);
    }
    return INITIAL_MEMBERS;
  }

  static getStorageStats(songs: Song[]): StorageStats {
    try {
      const songJson = JSON.stringify(songs);
      const scheduleJson = localStorage.getItem(this.STORAGE_KEY_SCHEDULES) || '';
      const profileJson = localStorage.getItem(this.STORAGE_KEY_PROFILE) || '';
      
      const appDataBytes = (songJson.length + scheduleJson.length + profileJson.length) * 2;
      const appDataKb = Number((appDataBytes / 1024).toFixed(1));

      const downloadedCount = songs.filter(s => s.isDownloaded).length;
      const cachedAudioKb = downloadedCount * 3850;
      const cachedPhotosKb = 6600;

      const totalKb = appDataKb + cachedAudioKb + cachedPhotosKb;

      return {
        appDataKb: Math.max(13.2, appDataKb),
        cachedAudioKb,
        cachedPhotosKb,
        totalKb,
        songsMarkedForOffline: downloadedCount,
      };
    } catch {
      return {
        appDataKb: 13.2,
        cachedAudioKb: 0,
        cachedPhotosKb: 6600,
        totalKb: 6613.2,
        songsMarkedForOffline: 0
      };
    }
  }

  static saveSongs(songs: Song[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_SONGS, JSON.stringify(songs));
    } catch (e) {
      console.error('Error saving songs:', e);
    }
  }

  static loadSongs(): Song[] | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_SONGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading songs:', e);
    }
    return null;
  }

  static saveSchedules(schedules: ScheduleEvent[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.error('Error saving schedules:', e);
    }
  }

  static loadSchedules(): ScheduleEvent[] | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_SCHEDULES);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading schedules:', e);
    }
    return null;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }

  static loadProfile(): UserProfile | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_PROFILE);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading profile:', e);
    }
    return null;
  }

  static saveSettings(settings: unknown): void {
    try {
      localStorage.setItem('yididya_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  static loadSettings(): any | null {
    try {
      const raw = localStorage.getItem('yididya_settings');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading settings:', e);
    }
    return null;
  }

  static STORAGE_KEY_REGISTERED = 'yididya_user_is_registered';

  static isRegistered(): boolean {
    try {
      const explicitFlag = localStorage.getItem(this.STORAGE_KEY_REGISTERED);
      if (explicitFlag === 'true') return true;
      if (explicitFlag === 'false') return false;
      const profile = this.loadProfile();
      return !!(profile && profile.id && profile.name && profile.name.trim().length > 0);
    } catch {
      return false;
    }
  }

  static setRegistered(registered: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_REGISTERED, registered ? 'true' : 'false');
    } catch (e) {
      console.error('Error setting registered flag:', e);
    }
  }

  static saveUserProfile(profile: UserProfile): void {
    this.saveProfile(profile);
    if (profile && profile.name && profile.name.trim().length > 0) {
      this.setRegistered(true);
    }
  }

  static loadUserProfile(): UserProfile | null {
    return this.loadProfile();
  }

  static clearRegistration(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_PROFILE);
      localStorage.setItem(this.STORAGE_KEY_REGISTERED, 'false');
    } catch (e) {
      console.error('Error clearing registration:', e);
    }
  }

  static queueChange(action: string, entity: string, payload: unknown): void {
    try {
      const queue = JSON.parse(localStorage.getItem(this.STORAGE_KEY_QUEUE) || '[]');
      queue.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        timestamp: new Date().toISOString(),
        action,
        entity,
        payload
      });
      localStorage.setItem(this.STORAGE_KEY_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to queue change:', e);
    }
  }

  static queueSyncAction({ action, table, payload }: { action: string; table: string; payload: unknown }): void {
    this.queueChange(action, table, payload);
  }

  static getSyncQueue(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_QUEUE) || '[]');
    } catch {
      return [];
    }
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY_SONGS);
    localStorage.removeItem(this.STORAGE_KEY_SCHEDULES);
    localStorage.removeItem(this.STORAGE_KEY_PROFILE);
    localStorage.removeItem(this.STORAGE_KEY_QUEUE);
    localStorage.removeItem('yididya_settings');
  }

  static async syncWithSupabase(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    const supabase = getSupabase();
    const queue = JSON.parse(localStorage.getItem(this.STORAGE_KEY_QUEUE) || '[]');

    if (!supabase || queue.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        message: 'All changes up to date.'
      };
    }

    try {
      let synced = 0;
      for (const item of queue) {
        if (item.entity === 'songs' || item.entity === 'song') {
          await supabase.from('songs').upsert(item.payload);
          synced++;
        } else if (item.entity === 'schedules' || item.entity === 'schedule') {
          await supabase.from('schedules').upsert(item.payload);
          synced++;
        } else if (item.entity === 'profiles') {
          await supabase.from('profiles').upsert(item.payload);
          synced++;
        }
      }

      localStorage.setItem(this.STORAGE_KEY_QUEUE, JSON.stringify([]));
      return {
        success: true,
        syncedCount: synced,
        message: `Synced ${synced} changes with Supabase successfully.`
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        syncedCount: 0,
        message: `Sync note: ${errMsg}`
      };
    }
  }
}

export const syncWithSupabase = OfflineStorageManager.syncWithSupabase.bind(OfflineStorageManager);
