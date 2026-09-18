import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Lock, 
  Music2, 
  ShieldCheck, 
  CheckCircle2, 
  ShieldAlert, 
  KeyRound,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { VoicePart, UserProfile, AppLanguage, AppTheme } from '../types';
import { simpleChoirAuth } from '../lib/supabase';
import { getTranslation } from '../lib/translations';

interface SimpleChoirAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  currentProfile?: UserProfile;
  language: AppLanguage;
  theme: AppTheme;
}

export const SimpleChoirAuthModal: React.FC<SimpleChoirAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentProfile,
  language,
  theme
}) => {
  const isDark = theme === 'dark';
  const isAm = language === 'am';

  const [authMode, setAuthMode] = useState<'member' | 'admin'>('member');

  // Member Fields
  const [name, setName] = useState(currentProfile?.name || '');
  const [voicePart, setVoicePart] = useState<VoicePart>(currentProfile?.voicePart || 'Tenor');
  const [phone, setPhone] = useState(currentProfile?.phone || '');
  const [pin, setPin] = useState('1234');

  // Admin Fields
  const [adminPhone, setAdminPhone] = useState('+251 938 126 346');
  const [adminPin, setAdminPin] = useState('1234');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const result = await simpleChoirAuth({
        name: name.trim(),
        voicePart,
        phone: phone.trim(),
        pin: pin.trim(),
        choirRole: 'Member',
        isAdminAttempt: false
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      onSuccess(result.profile);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await simpleChoirAuth({
        name: 'Ephraim Tessema',
        voicePart: 'Tenor',
        phone: adminPhone.trim(),
        pin: adminPin.trim(),
        choirRole: 'Admin',
        isAdminAttempt: true
      });

      if (!result.success) {
        setErrorMessage(result.message || 'Invalid admin credentials');
        return;
      }

      onSuccess(result.profile);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const voiceSections: { part: VoicePart; amharic: string; desc: string }[] = [
    { part: 'Soprano', amharic: 'ሶፕራኖ (Soprano)', desc: 'ከፍተኛ የሴቶች ድምፅ' },
    { part: 'Alto', amharic: 'አልቶ (Alto)', desc: 'መካከለኛ የሴቶች ድምፅ' },
    { part: 'Tenor', amharic: 'ቴኖር (Tenor)', desc: 'ከፍተኛ የወንዶች ድምፅ' },
    { part: 'Bass', amharic: 'ባስ (Bass)', desc: 'ጥልቅ የወንዶች ድምፅ' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0B1426] border-amber-400/20 text-slate-100'
            : 'bg-[#FCF9F2] border-amber-900/15 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-ethiopic">
                {isAm ? 'የይዲድያ መዘምራን መግቢያ' : 'Yididya Choir Access'}
              </h2>
              <p className="text-[11px] text-amber-400/80 font-ethiopic">
                {isAm ? 'አባላት መግባት የሚችሉት በአድሚን ፍቃድ ብቻ ነው' : 'Membership requires Admin Approval'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Member vs Admin */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-black/25 mt-4 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('member');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'member'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAm ? 'የመዘምራን አባል' : 'Choir Member'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'admin'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isAm ? 'አስተዳዳሪ (Admin)' : 'Admin Login'}</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MEMBER ACCESS FORM */}
        {authMode === 'member' && (
          <form onSubmit={handleMemberSubmit} className="mt-4 space-y-4 font-ethiopic">
            {/* Explanatory Approval Notice */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300/90 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="space-y-0.5">
                <span className="font-bold block text-amber-300">
                  {isAm ? 'የአድሚን ማረጋገጫ ደንብ' : 'Admin Approval Policy'}
                </span>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isAm
                    ? 'አዲስ አባላት መረጃቸውን ሲያስገቡ ጥያቄያቸው በቀጥታ ወደ መዘምራን አድሚን ይላካል። አድሚኑ ሲያጸድቀው ወዲያውኑ ይከፈታል።'
                    : 'New members register their details, which are submitted for admin approval before full choir access is unlocked.'}
                </p>
              </div>
            </div>

            {/* Member Full Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'የመዘምራኑ ሙሉ ስም' : 'Member Full Name'} *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAm ? 'ለምሳሌ፡ ሰላማዊት በቀለ' : 'e.g. Selamawit Bekele'}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? 'bg-[#111C33] border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-amber-200 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Voice Part Selection */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'የድምፅ ክፍል ይምረጡ' : 'Select Voice Part'} *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {voiceSections.map((item) => (
                  <button
                    type="button"
                    key={item.part}
                    onClick={() => setVoicePart(item.part)}
                    className={`p-2.5 rounded-2xl border text-left transition active:scale-95 ${
                      voicePart === item.part
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : isDark
                        ? 'bg-[#111C33] border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-white border-amber-100 text-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{item.amharic}</span>
                      {voicePart === item.part && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'ስልክ ቁጥር (ለመታወቂያ)' : 'Phone Number (For Identity Verification)'} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 9..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? 'bg-[#111C33] border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-amber-200 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Member PIN */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'ቀላል ባለ 4-አሃዝ ፒን (PIN)' : '4-Digit Member PIN'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? 'bg-[#111C33] border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-amber-200 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Submit Request Button */}
            <button
              type="submit"
              disabled={isLoading || !name.trim() || !phone.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98 transition disabled:opacity-50"
            >
              {isLoading
                ? (isAm ? 'እየተረጋገጠ ነው...' : 'Verifying...')
                : (isAm ? 'የአባልነት ጥያቄ ላክ / ግባ' : 'Request Access / Sign In')}
            </button>
          </form>
        )}

        {/* ADMIN LOGIN FORM */}
        {authMode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="mt-4 space-y-4 font-ethiopic">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold block text-amber-300">
                  {isAm ? 'የመዘምራን መሪዎችና አድሚን መግቢያ' : 'Choir Leadership & Admin Login'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAm
                    ? 'አድሚኑ አዳዲስ አባላትን ለማጽደቅ ወይም ውድቅ ለማድረግ እዚህ ጋር በይለፍ ቃል ይገባል።'
                    : 'Log in as Choir Admin to review and approve pending membership requests.'}
                </p>
              </div>
            </div>

            {/* Admin Phone or Username */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'የአድሚን ስልክ ወይም ስም' : 'Admin Phone or Username'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="text"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+251 938 126 346"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? 'bg-[#111C33] border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-amber-200 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Admin PIN */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                {isAm ? 'የአድሚን ፒን ኮድ (Admin PIN)' : 'Admin Secret PIN'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="password"
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="1234"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? 'bg-[#111C33] border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-amber-200 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Admin Login Button */}
            <button
              type="submit"
              disabled={isLoading || !adminPhone.trim() || !adminPin.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98 transition disabled:opacity-50"
            >
              {isLoading
                ? (isAm ? 'በመግባት ላይ...' : 'Authenticating...')
                : (isAm ? 'እንደ አድሚን ግባ (Approve Members)' : 'Sign In as Admin')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
