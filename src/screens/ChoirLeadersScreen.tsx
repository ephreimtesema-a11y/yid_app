import React from 'react';
import { ArrowLeft, Users, Phone, Mail, Award } from 'lucide-react';
import { ChoirLeader, AppTheme } from '../types';

interface ChoirLeadersScreenProps {
  leaders: ChoirLeader[];
  theme: AppTheme;
  onBack: () => void;
}

export const ChoirLeadersScreen: React.FC<ChoirLeadersScreenProps> = ({
  leaders,
  theme,
  onBack
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-amber-100 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-cinzel text-lg font-bold">Choir Leadership</span>
      </div>

      <div className="space-y-3.5">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3.5 transition ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100'
                : 'bg-white border-amber-900/15 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5D886] via-[#DFA944] to-[#B3781F] flex items-center justify-center text-slate-950 font-serif font-bold text-lg shrink-0 shadow-md">
                {leader.name.charAt(0)}
              </div>

              <div className="min-w-0">
                <h4 className="font-semibold text-sm truncate">{leader.name}</h4>
                <div className="text-xs text-amber-400 font-medium truncate flex items-center gap-1">
                  <Award className="w-3 h-3 shrink-0" />
                  <span>{leader.role}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Section: {leader.voicePart}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`tel:${leader.phone}`}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-400 transition"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${leader.email}`}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-400 transition"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
