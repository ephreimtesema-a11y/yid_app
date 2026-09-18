import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  X
} from 'lucide-react';
import { ScheduleEvent, AppTheme, UserProfile, AppLanguage } from '../types';
import { getTranslation } from '../lib/translations';

interface ScheduleScreenProps {
  schedules: ScheduleEvent[];
  theme: AppTheme;
  userProfile: UserProfile;
  language?: AppLanguage;
  onToggleRSVP: (scheduleId: string) => void;
  onAddSchedule: (event: Omit<ScheduleEvent, 'id'>) => void;
}

type ScheduleTab = 'Upcoming' | 'All' | 'Past';

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  schedules,
  theme,
  userProfile,
  language = 'am',
  onToggleRSVP,
  onAddSchedule
}) => {
  const isDark = theme === 'dark';
  const t = getTranslation(language);
  const isAm = language === 'am';

  const [activeTab, setActiveTab] = useState<ScheduleTab>('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ScheduleEvent['type']>('Rehearsal');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('3:00 PM – 5:30 PM');
  const [location, setLocation] = useState('አዳማ ዩኒቨርሲቲ ግቢ ውስጥ (ASTU)');
  const [description, setDescription] = useState('');
  const [selectedParts, setSelectedParts] = useState<string[]>(['Soprano', 'Alto', 'Tenor', 'Bass']);

  const filteredEvents = schedules.filter((event) => {
    if (activeTab === 'Upcoming') return !event.isPast;
    if (activeTab === 'Past') return event.isPast;
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddSchedule({
      title,
      type,
      date,
      time,
      location,
      description,
      voicePartsNeeded: selectedParts,
      isAttending: true,
      isPast: false,
      reminderSet: true
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const togglePart = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const tabs: { key: ScheduleTab; label: string }[] = [
    { key: 'Upcoming', label: isAm ? 'ቀጣይ ፕሮግራሞች' : 'Upcoming' },
    { key: 'All', label: isAm ? 'ሁሉንም' : 'All' },
    { key: 'Past', label: isAm ? 'ያለፉ' : 'Past' },
  ];

  return (
    <div className="pb-36 pt-4 px-4 max-w-lg mx-auto space-y-5 animate-fade-in font-ethiopic">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold tracking-tight text-white dark:text-white">
            {isAm ? 'መርሐ-ግብር' : 'Schedule'}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isAm ? 'የዝማሬ ልምምዶችና አገልግሎቶች' : 'Rehearsals & programs'}
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          id="add-schedule-button"
          className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-lg hover:bg-amber-300 active:scale-95 transition"
          aria-label="Add event"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className={`p-1 rounded-2xl flex items-center border ${
          isDark
            ? 'bg-[#111A2E] border-slate-800'
            : 'bg-white border-amber-900/10 shadow-sm'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="pt-1">
        {filteredEvents.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 rounded-2xl text-slate-600 dark:text-slate-600">
              <CalendarIcon className="w-12 h-12 stroke-[1.2]" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              {isAm ? 'ምንም የተመዘገበ መርሐ-ግብር የለም' : 'No events scheduled'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition mt-2 active:scale-95"
            >
              {isAm ? 'አዲስ ልምምድ መዝግብ' : 'Create First Rehearsal'}
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-[#111B30] border-slate-800 hover:border-amber-500/30 text-slate-100 shadow-md'
                    : 'bg-white border-amber-900/15 hover:border-amber-400 text-slate-900 shadow-sm'
                }`}
              >
                {/* Event Type & Date */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {event.type === 'Rehearsal' ? (isAm ? 'የዝማሬ ልምምድ' : 'Rehearsal') : event.type}
                  </span>
                  <span className="text-xs font-medium text-amber-500">
                    {event.date}
                  </span>
                </div>

                <h3 className="font-semibold text-base mb-2">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-slate-400/90 pt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Voice parts needed & RSVP button */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{event.voicePartsNeeded.join(' • ')}</span>
                  </div>

                  <button
                    onClick={() => onToggleRSVP(event.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                      event.isAttending
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {event.isAttending ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isAm ? 'እገኛለሁ' : 'Attending'}</span>
                      </>
                    ) : (
                      <span>{isAm ? 'እገኛለሁ ብለህ መዝግብ' : 'RSVP Yes'}</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rehearsal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-5 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar ${
              isDark
                ? 'bg-[#0E172A] border-slate-800 text-slate-100'
                : 'bg-white border-amber-900/20 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold">
                {isAm ? 'አዲስ መርሐ-ግብር መዝግብ' : 'Add Choir Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'የመርሐ-ግብሩ ርዕስ *' : 'Event Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isAm ? 'ለምሳሌ፡ የቅዳሜ ልምምድ (Special Prep)' : 'e.g. Saturday Choir Rehearsal'}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    {isAm ? 'ቀን *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    {isAm ? 'ሰዓት' : 'Time'}
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="3:00 PM – 5:30 PM"
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'የስብሰባው ቦታ' : 'Location'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="አዳማ ዩኒቨርሲቲ ግቢ ውስጥ"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'የተጠሩ የድምፅ ክፍሎች' : 'Voice Parts Needed'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Soprano', 'Alto', 'Tenor', 'Bass'].map((part) => (
                    <button
                      type="button"
                      key={part}
                      onClick={() => togglePart(part)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        selectedParts.includes(part)
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  {isAm ? 'ማብራሪያ / ማስታወሻ' : 'Notes / Agenda'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isAm ? 'ስለ ልምምዱ ተጨማሪ መረጃ...' : 'Agenda details...'}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/50 border-slate-700 text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  {isAm ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition"
                >
                  {isAm ? 'መዝግብና አጋራ' : 'Save Rehearsal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
