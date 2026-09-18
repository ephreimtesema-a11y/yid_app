import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, Music2, Shield } from 'lucide-react';
import { UserProfile, AppTheme, VoicePart } from '../types';

interface EditProfileScreenProps {
  userProfile: UserProfile;
  theme: AppTheme;
  onBack: () => void;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  userProfile,
  theme,
  onBack,
  onSaveProfile
}) => {
  const isDark = theme === 'dark';
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [voicePart, setVoicePart] = useState<VoicePart>(userProfile.voicePart);
  const [phone, setPhone] = useState(userProfile.phone || '+251 91 123 4567');
  const [choirRole, setChoirRole] = useState(userProfile.choirRole);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      voicePart,
      phone,
      choirRole,
      avatarLetter: name.charAt(0).toUpperCase() || 'E'
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-cinzel text-lg font-bold">Edit Profile</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Avatar Display */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5D886] via-[#DFA944] to-[#B3781F] flex items-center justify-center text-slate-950 font-serif font-bold text-2xl shadow-lg ring-4 ring-amber-500/20 mb-2">
            {name.charAt(0).toUpperCase() || 'E'}
          </div>
          <span className="text-[11px] text-slate-400">Avatar auto-generated from initials</span>
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-1 text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100 focus:border-amber-400'
                : 'bg-white border-amber-900/15 text-slate-900 focus:border-amber-500'
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1 text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100 focus:border-amber-400'
                : 'bg-white border-amber-900/15 text-slate-900 focus:border-amber-500'
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1 text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100 focus:border-amber-400'
                : 'bg-white border-amber-900/15 text-slate-900 focus:border-amber-500'
            }`}
          />
        </div>

        {/* Voice Part Selection */}
        <div>
          <label className="block font-semibold mb-1.5 text-slate-300 flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-amber-400" />
            Voice Part
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['Unassigned', 'Soprano', 'Alto', 'Tenor', 'Bass'] as VoicePart[]).map((part) => (
              <button
                type="button"
                key={part}
                onClick={() => setVoicePart(part)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  voicePart === part
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm'
                    : isDark
                    ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    : 'bg-white border-amber-900/15 text-slate-700 hover:border-amber-400'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {/* Choir Role */}
        <div>
          <label className="block font-semibold mb-1 text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Choir Role
          </label>
          <select
            value={choirRole}
            onChange={(e) => setChoirRole(e.target.value as UserProfile['choirRole'])}
            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100 focus:border-amber-400'
                : 'bg-white border-amber-900/15 text-slate-900 focus:border-amber-500'
            }`}
          >
            <option value="Member">Member</option>
            <option value="Voice Leader">Voice Leader</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-amber-300 transition"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved Successfully!' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
