import React from 'react';
import { ArrowLeft, BookOpen, Quote, Sparkles, Share2 } from 'lucide-react';
import { Devotional, AppTheme } from '../types';

interface DevotionalsScreenProps {
  devotionals: Devotional[];
  theme: AppTheme;
  onBack: () => void;
}

export const DevotionalsScreen: React.FC<DevotionalsScreenProps> = ({
  devotionals,
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
        <span className="font-cinzel text-lg font-bold">Choir Devotionals</span>
      </div>

      <div className="space-y-4">
        {devotionals.map((d) => (
          <div
            key={d.id}
            className={`p-5 rounded-3xl border space-y-3.5 transition ${
              isDark
                ? 'bg-[#111A2E] border-slate-800 text-slate-100'
                : 'bg-white border-amber-900/15 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {d.date}
              </span>
              <span className="text-slate-400 font-normal">{d.author}</span>
            </div>

            <h3 className="font-serif font-bold text-lg text-white dark:text-white">
              {d.title}
            </h3>

            {/* Scripture Quote Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs italic font-serif text-amber-200 leading-relaxed">
              <Quote className="w-4 h-4 text-amber-400 inline mr-1 -mt-1" />
              "{d.scripture}"
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {d.content || d.body}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Saved in local choir cache</span>
              <button
                onClick={() => alert('Devotional copied to clipboard!')}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
