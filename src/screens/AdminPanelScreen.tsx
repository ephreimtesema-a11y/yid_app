import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  Database, 
  RefreshCw, 
  Send, 
  FileDown, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserPlus, 
  UserCheck, 
  Phone, 
  Music, 
  Filter,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AppTheme, Song, ScheduleEvent, UserProfile, MembershipStatus, ChoirRole, VoicePart } from '../types';
import { 
  OfflineStorageManager, 
  syncWithSupabase, 
  fetchRemoteMembers, 
  updateMemberApprovalStatus 
} from '../lib/supabase';

interface AdminPanelScreenProps {
  theme: AppTheme;
  songs: Song[];
  schedules: ScheduleEvent[];
  isOfflineMode: boolean;
  onToggleOfflineSim: () => void;
  onBack: () => void;
  onOpenFlutterExport?: () => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  theme,
  songs,
  schedules,
  isOfflineMode,
  onToggleOfflineSim,
  onBack
}) => {
  const isDark = theme === 'dark';
  const [broadcastText, setBroadcastText] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Member Management State
  const [members, setMembers] = useState<UserProfile[]>(() => OfflineStorageManager.loadMembers());
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'all'>('pending');
  const [isRefreshingMembers, setIsRefreshingMembers] = useState(false);
  const [approvalActionMsg, setApprovalActionMsg] = useState<string | null>(null);

  const pendingQueue = OfflineStorageManager.getSyncQueue();

  const loadLatestMembers = async () => {
    setIsRefreshingMembers(true);
    try {
      const list = await fetchRemoteMembers();
      setMembers(list);
    } catch {
      setMembers(OfflineStorageManager.loadMembers());
    } finally {
      setIsRefreshingMembers(false);
    }
  };

  useEffect(() => {
    loadLatestMembers();
  }, []);

  const handleApproval = async (memberId: string, status: MembershipStatus) => {
    setApprovalActionMsg('Updating status...');
    const res = await updateMemberApprovalStatus(memberId, status);
    setApprovalActionMsg(res.message);
    // Reload local roster
    setMembers(OfflineStorageManager.loadMembers());
    setTimeout(() => {
      setApprovalActionMsg(null);
    }, 3000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      alert(`Choir announcement broadcasted to all ${members.length} members: "${broadcastText}"`);
      setBroadcastText('');
    }, 800);
  };

  const handleForceSync = async () => {
    setSyncStatus('Syncing with Supabase...');
    const res = await syncWithSupabase();
    if (res.success) {
      setSyncStatus(`Sync succeeded! Flushed ${res.syncedCount} queued actions.`);
    } else {
      setSyncStatus(`Sync completed locally (${res.message}). Local-first state is safe.`);
    }
    loadLatestMembers();
  };

  const handleExportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      songs,
      schedules,
      members,
      queue: pendingQueue
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yididya_choir_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return (m.membershipStatus || 'pending') === 'pending';
    if (filterStatus === 'approved') return m.membershipStatus === 'approved';
    return true;
  });

  const pendingCount = members.filter((m) => (m.membershipStatus || 'pending') === 'pending').length;
  const approvedCount = members.filter((m) => m.membershipStatus === 'approved').length;

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-5 animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition ${
              isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="font-cinzel text-lg font-bold block">የመዘምራን አስተዳዳሪ (Admin Panel)</span>
            <span className="text-[11px] text-amber-400 font-semibold">የአባላት ፍቃድ እና ቅንጅት</span>
          </div>
        </div>

        <button
          onClick={loadLatestMembers}
          disabled={isRefreshingMembers}
          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-amber-200 text-slate-700'
          }`}
          title="Refresh Members"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMembers ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">አድስ</span>
        </button>
      </div>

      {/* Roster & Quick Counters */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl border bg-[#111A2E] border-slate-800 text-center relative overflow-hidden">
          {pendingCount > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
          <div className="font-serif font-bold text-xl text-amber-400">{pendingCount}</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">ፍቃድ የሚጠብቁ</div>
        </div>

        <div className="p-3.5 rounded-2xl border bg-[#111A2E] border-slate-800 text-center">
          <div className="font-serif font-bold text-xl text-emerald-400">{approvedCount}</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">የጸደቁ አባላት</div>
        </div>

        <div className="p-3.5 rounded-2xl border bg-[#111A2E] border-slate-800 text-center">
          <div className="font-serif font-bold text-xl text-amber-400">{songs.length}</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">መዝሙራት</div>
        </div>
      </div>

      {/* MEMBER APPROVAL WORKFLOW SECTION */}
      <div className={`p-4 rounded-3xl border space-y-3.5 ${
        isDark ? 'bg-[#111A2E] border-amber-500/20' : 'bg-white border-amber-900/15'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-ethiopic">የአባላት ፍቃድ መቆጣጠሪያ (Approvals)</h3>
              <p className="text-[11px] text-slate-400">አባላት መግባት የሚችሉት እዚህ ሲጸድቁ ብቻ ነው</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/20 border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>በመጠባበቅ ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              filterStatus === 'approved'
                ? 'bg-emerald-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>የጸደቁ ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              filterStatus === 'all'
                ? 'bg-slate-700 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ሁሉም ({members.length})</span>
          </button>
        </div>

        {/* Notification Toast */}
        {approvalActionMsg && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{approvalActionMsg}</span>
          </div>
        )}

        {/* Members Cards List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredMembers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-2xl border-slate-700">
              {filterStatus === 'pending'
                ? 'በአሁኑ ሰዓት ፈቃድ የሚጠብቅ አዲስ አባል የለም።'
                : 'ምንም አባል አልተገኘም።'}
            </div>
          ) : (
            filteredMembers.map((member) => {
              const status = member.membershipStatus || 'pending';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm">
                        {member.avatarLetter || member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {member.choirRole === 'Admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Music className="w-3 h-3" />
                            {member.voicePart}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone || 'No phone'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          የጸደቀ
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          ፈቃድ ይጠብቃል
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          ውድቅ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5">
                    {status !== 'approved' && (
                      <button
                        onClick={() => handleApproval(member.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>አጽድቅ (Approve)</span>
                      </button>
                    )}

                    {status !== 'rejected' && (
                      <button
                        onClick={() => handleApproval(member.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ውድቅ አድርግ</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Network Connectivity & Offline Simulator */}
      <div className="p-4 rounded-2xl border bg-[#111A2E] border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOfflineMode ? (
              <WifiOff className="w-5 h-5 text-amber-400" />
            ) : (
              <Wifi className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <div className="text-sm font-semibold text-slate-100">
                Network Connectivity Simulation
              </div>
              <div className="text-[11px] text-slate-400">
                Current status: <strong className={isOfflineMode ? 'text-amber-400' : 'text-emerald-400'}>{isOfflineMode ? 'OFFLINE (Local Caching)' : 'ONLINE'}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleOfflineSim}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isOfflineMode
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isOfflineMode ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>

        {/* Sync Queue Inspector */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Supabase Local Sync Queue:
            </span>
            <span className="font-mono text-amber-400">{pendingQueue.length} pending mutations</span>
          </div>
          <p className="text-[11px] text-slate-400">
            All offline edits, song adds, member approvals, and RSVPs are queued in localStorage and flushed to Supabase when online.
          </p>

          <button
            onClick={handleForceSync}
            className="w-full mt-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Trigger Supabase Sync Engine
          </button>

          {syncStatus && (
            <div className="text-[11px] text-emerald-400 pt-1">
              {syncStatus}
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Choir Announcement */}
      <form onSubmit={handleBroadcast} className="p-4 rounded-2xl border bg-[#111A2E] border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Send className="w-4 h-4" />
          <span>ማስታወቂያ ለመዘምራን አስተላልፍ (Broadcast)</span>
        </div>
        <textarea
          rows={2}
          value={broadcastText}
          onChange={(e) => setBroadcastText(e.target.value)}
          placeholder="ለምሳሌ፡ ነገ ጠዋት 12፡00 ሰዓት ሁሉም ነጭ ልብስ ለብሰው ይገኙ..."
          className="w-full p-2.5 rounded-xl border bg-slate-900 border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-400 font-ethiopic"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isBroadcasting}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition active:scale-95"
          >
            {isBroadcasting ? 'በመላክ ላይ...' : 'ማስታወቂያውን ላክ'}
          </button>
        </div>
      </form>

      {/* Quick Tools: Choir Data Backup */}
      <div className="space-y-2">
        <button
          onClick={handleExportBackup}
          className="w-full p-3.5 rounded-2xl border bg-[#111A2E] border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-between hover:border-slate-700 transition"
        >
          <span className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-amber-400" />
            Export Offline Choir Database Backup (.json)
          </span>
          <span className="text-[11px] font-mono text-amber-400">Download</span>
        </button>
      </div>
    </div>
  );
};
