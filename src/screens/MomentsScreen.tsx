import React, { useState } from 'react';
import { ArrowLeft, Camera, Heart, Download, Share2, Plus, X } from 'lucide-react';
import { Moment, AppTheme } from '../types';

interface MomentsScreenProps {
  moments: Moment[];
  theme: AppTheme;
  onBack: () => void;
  onAddMoment: (moment: Omit<Moment, 'id'>) => void;
}

export const MomentsScreen: React.FC<MomentsScreenProps> = ({
  moments,
  theme,
  onBack,
  onAddMoment
}) => {
  const isDark = theme === 'dark';
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Sanctuary Stage');
  const [category, setCategory] = useState<Moment['category']>('Ministry');

  const toggleLike = (id: string, current: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? current) + 1
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption) return;
    onAddMoment({
      title: caption.slice(0, 30),
      caption,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location,
      likesCount: 1,
      category,
      isCachedOffline: true
    });
    setCaption('');
    setIsAddOpen(false);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-5 animate-fade-in">
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
          <span className="font-cinzel text-lg font-bold">Choir Moments</span>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow hover:bg-amber-300 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {moments.map((m) => {
          const count = likes[m.id] ?? m.likesCount;
          return (
            <div
              key={m.id}
              className={`rounded-2xl border overflow-hidden transition ${
                isDark
                  ? 'bg-[#111A2E] border-slate-800 text-slate-200'
                  : 'bg-white border-amber-900/15 text-slate-800 shadow-sm'
              }`}
            >
              {/* Photo Image */}
              <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-amber-300 backdrop-blur-md">
                  {m.category}
                </span>
                {m.isCachedOffline && (
                  <span className="absolute bottom-3 left-3 text-[9px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 backdrop-blur-md">
                    Cached Offline
                  </span>
                )}
              </div>

              {/* Caption and Interactions */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{m.location}</span>
                  <span>{m.date}</span>
                </div>

                <p className="text-sm font-medium leading-snug">
                  {m.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleLike(m.id, m.likesCount)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
                  >
                    <Heart className="w-4 h-4 fill-amber-400/30" />
                    <span>{count} Loves</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert('Photo saved to local gallery cache.')}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400"
                      title="Download photo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert('Moment link copied!')}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400"
                      title="Share moment"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl p-5 border bg-[#0E172A] border-slate-800 text-slate-100 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-cinzel text-base font-bold">Add Choir Moment</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-slate-300 font-semibold">Caption / Memory</label>
                <textarea
                  required
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What happened during this rehearsal or concert?"
                  className="w-full p-2.5 rounded-xl border bg-slate-900 border-slate-700 text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-300 font-semibold">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-900 border-slate-700 text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-300 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Moment['category'])}
                  className="w-full p-2.5 rounded-xl border bg-slate-900 border-slate-700 text-slate-100 outline-none focus:border-amber-400"
                >
                  <option value="Rehearsal">Rehearsal</option>
                  <option value="Concert">Concert</option>
                  <option value="Ministry">Ministry</option>
                  <option value="Fellowship">Fellowship</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
                >
                  Post Moment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
