import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  Music, 
  Phone, 
  Shield, 
  User,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UserProfile, AppTheme, AppLanguage, MembershipStatus } from '../types';
import { checkMemberApprovalStatus, getSupabase } from '../lib/supabase';

interface PendingApprovalScreenProps {
  userProfile: UserProfile;
  theme: AppTheme;
  language: AppLanguage;
  onApproved: (updatedProfile: UserProfile) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  userProfile,
  theme,
  language,
  onApproved,
  onOpenAuthModal,
  onLogout
}) => {
  const isDark = theme === 'dark';
  const isAm = language === 'am';

  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<MembershipStatus>(
    userProfile.membershipStatus || 'pending'
  );

  // Manual Check Function
  const handleCheckStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    try {
      const status = await checkMemberApprovalStatus(userProfile.id);
      setCurrentStatus(status);

      if (status === 'approved') {
        setStatusMessage(
          isAm 
            ? 'እንኳን ደስ አለዎት! የአባልነት ጥያቄዎ በአድሚን ጸድቋል። ወደ መተግበሪያው እየገቡ ነው...' 
            : 'Congratulations! Your membership has been approved by the admin. Redirecting...'
        );
        setTimeout(() => {
          onApproved({
            ...userProfile,
            membershipStatus: 'approved'
          });
        }, 1200);
      } else if (status === 'rejected') {
        setStatusMessage(
          isAm
            ? 'ይቅርታ፣ ይህ የአባልነት ጥያቄ በመዘምራን መሪዎች ውድቅ ተደርጓል። እባክዎ አድሚኑን ያነጋግሩ።'
            : 'Your membership request was declined by the choir leadership. Please contact the administrator.'
        );
      } else {
        setStatusMessage(
          isAm
            ? 'አሁንም የአድሚን ፈቃድ በመጠባበቅ ላይ ነው። እባክዎ ጥቂት ጊዜ ቆይተው እንደገና ያረጋግጡ።'
            : 'Your request is still awaiting admin approval. Please check back shortly.'
        );
      }
    } catch {
      setStatusMessage(
        isAm 
          ? 'ሁኔታውን ማረጋገጥ አልተቻለም። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።' 
          : 'Could not verify status. Please check your internet connection.'
      );
    } finally {
      setIsChecking(false);
    }
  };

  // Real-time automatic listener for this specific user's approval
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`member-approval-${userProfile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userProfile.id}`
        },
        (payload: any) => {
          if (payload.new && payload.new.status === 'approved') {
            setCurrentStatus('approved');
            onApproved({
              ...userProfile,
              membershipStatus: 'approved',
              choirRole: payload.new.choir_role || userProfile.choirRole,
              voicePart: payload.new.voice_part || userProfile.voicePart
            });
          } else if (payload.new && payload.new.status === 'rejected') {
            setCurrentStatus('rejected');
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userProfile, onApproved]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors select-none ${
        isDark ? 'bg-[#0B1328] text-slate-100' : 'bg-[#FAF6EE] text-slate-900'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
          isDark
            ? 'bg-[#111A2E] border-amber-500/20 text-slate-100'
            : 'bg-white border-amber-900/15 text-slate-800'
        }`}
      >
        {/* Top Spiritual Crest */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Music className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-[#111A2E]">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold font-ethiopic tracking-wide">
              {isAm ? 'የይዲድያ መዘምራን' : 'Yididya Choir Ecosystem'}
            </h1>
            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isAm ? 'የአባልነት ማረጋገጫ በመጠባበቅ ላይ' : 'Admin Approval Required'}</span>
            </div>
          </div>
        </div>

        {/* Informative Explanation */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-slate-300'
              : 'bg-amber-50/70 border-amber-100 text-slate-700'
          }`}
        >
          <div className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{isAm ? `ሰላም ${userProfile.name}!` : `Greetings ${userProfile.name}!`}</span>
          </div>
          <p>
            {isAm
              ? 'የይዲድያ መዘምራን አባልነት ጥያቄዎ በተሳካ ሁኔታ ተመዝግቧል። የመዘምራን ምስጢራዊነትንና ደህንነትን ለመጠበቅ መተግበሪያውን መጠቀም የሚቻለው በአድሚኑ (ወይም በመዘምራን መሪዎች) ሲጸድቅ ብቻ ነው።'
              : 'Your membership request has been registered. For choir security and order, access to hymns and rehearsals is granted strictly upon Admin approval.'}
          </p>
          <p className="text-[11px] opacity-80">
            {isAm
              ? 'አድሚኑ ማንነትዎን ሲያጸድቅ ይህ ገጽ በራሱ ተከፍቶ ወደ መተግበሪያው ያስገባዎታል።'
              : 'Once approved by the choir administrator, this screen will automatically unlock.'}
          </p>
        </div>

        {/* Member Request Summary Card */}
        <div
          className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
            isDark ? 'bg-[#0B1328] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{isAm ? 'ያመለከቱበት መረጃ' : 'Application Summary'}</span>
            <span className="text-amber-400 font-semibold">
              {currentStatus === 'approved' 
                ? (isAm ? 'የጸደቀ' : 'Approved') 
                : currentStatus === 'rejected' 
                ? (isAm ? 'ውድቅ የተደረገ' : 'Declined') 
                : (isAm ? 'ምርመራ ላይ' : 'Pending Review')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">{isAm ? 'ሙሉ ስም' : 'Name'}</span>
                <span className="font-semibold">{userProfile.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">{isAm ? 'የድምፅ ክፍል' : 'Voice Part'}</span>
                <span className="font-semibold">{userProfile.voicePart}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-white/5">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">{isAm ? 'ስልክ ቁጥር' : 'Phone'}</span>
                <span className="font-semibold">{userProfile.phone || 'ያልተገለጸ'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 animate-fade-in ${
              currentStatus === 'approved'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : currentStatus === 'rejected'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            {currentStatus === 'approved' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Check Status Button */}
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? (isAm ? 'እየተረጋገጠ ነው...' : 'Checking...') : (isAm ? 'የፍቃድ ሁኔታን አረጋግጥ' : 'Check Approval Status')}</span>
          </button>

          {/* Admin Fast Switch Login */}
          <button
            onClick={onOpenAuthModal}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition active:scale-98 ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAm ? 'በአድሚን አካውንት ይግቡ (Admin Sign-In)' : 'Sign In as Choir Admin'}</span>
          </button>

          {/* Logout / Switch Member */}
          <button
            onClick={onLogout}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-rose-400 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAm ? 'ጥያቄውን ሰርዝ / በመለያ ቀይር' : 'Cancel & Switch Account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
