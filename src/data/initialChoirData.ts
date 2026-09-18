import { Song, ScheduleEvent, UserProfile, Moment, Devotional, ChoirLeader, AppSettings } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  id: 'user-ephraim-001',
  name: 'ephraimtessema',
  email: 'ephraimtessema@gmail.com',
  choirRole: 'Admin',
  voicePart: 'Unassigned',
  phone: '+251 938 126 346',
  avatarLetter: 'E',
  university: 'Adama Science and Technology University (ASTU)',
  bio: 'Student of Computer Science & Engineering at ASTU, Ethiopia. Building the Yididya Choir mobile ecosystem for spiritual growth and choral excellence.',
  joinedYear: '2023',
  membershipStatus: 'approved',
  pin: '1234'
};

export const INITIAL_MEMBERS: UserProfile[] = [
  {
    id: 'user-ephraim-001',
    name: 'Ephraim Tessema',
    email: 'ephraimtessema@gmail.com',
    choirRole: 'Admin',
    voicePart: 'Tenor',
    phone: '+251 938 126 346',
    avatarLetter: 'E',
    university: 'ASTU',
    membershipStatus: 'approved',
    registeredAt: '2026-01-10T10:00:00Z',
    joinedYear: '2023'
  },
  {
    id: 'member-selamawit-bekele-4512',
    name: 'Selamawit Bekele',
    email: 'selamawit@yididya.choir',
    choirRole: 'Member',
    voicePart: 'Soprano',
    phone: '+251 911 234 512',
    avatarLetter: 'S',
    university: 'ASTU',
    membershipStatus: 'pending',
    registeredAt: '2026-03-18T08:30:00Z',
    joinedYear: '2026'
  },
  {
    id: 'member-dawit-alemayehu-7839',
    name: 'Dawit Alemayehu',
    email: 'dawit@yididya.choir',
    choirRole: 'Member',
    voicePart: 'Bass',
    phone: '+251 922 876 839',
    avatarLetter: 'D',
    university: 'ASTU',
    membershipStatus: 'pending',
    registeredAt: '2026-03-17T14:15:00Z',
    joinedYear: '2026'
  },
  {
    id: 'member-hanna-girma-6190',
    name: 'Hanna Girma',
    email: 'hanna@yididya.choir',
    choirRole: 'Member',
    voicePart: 'Alto',
    phone: '+251 933 543 190',
    avatarLetter: 'H',
    university: 'ASTU',
    membershipStatus: 'approved',
    registeredAt: '2026-02-05T09:00:00Z',
    joinedYear: '2025'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'am',
  notificationsEnabled: true,
  autoDownloadOffline: true,
  pinLockEnabled: false,
  pinCode: '1234',
  biometricsEnabled: false,
  supabaseUrl: '',
  supabaseAnonKey: ''
};

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-gin-bante',
    title: 'Gin Bante',
    amharicTitle: 'ግን ባንተ',
    category: 'Worship',
    writtenBy: 'Yidnekachew Teka',
    language: 'Amharic',
    key: 'Eb Major',
    tempo: '68 BPM',
    audioDuration: '5:42',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_11861866-lq.mp3',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-01T10:00:00Z',
    textAlign: 'center',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'ደካማ ሆኜ አገኘኸኝ',
          'ኃጢአተኛ ሆኜ አገኘኸኝ',
          'የማልጠቅም ሆኜ አገኘኸኝ',
          'ከሰይጣን እጅ ሆኜ አገኘኸኝ',
          'ግን ባንተ ከዚህ ሁሉ ወጣሁኝ',
          'ግን ባንተ የእግዚአብሔር ልጅ ተብያለሁ',
          'ዛሬ አርገኸኛል የብርሃን ልጅ እኔን',
          'የሱስ ወሰድህ ጨለማዬን (4x)'
        ]
      },
      {
        type: 'VERSE',
        index: 2,
        lines: [
          'ይህች ፅዋ ከኔ ትለፍ ብትል እንኳን',
          'የእግዚአብሔር በግ አስቀድመህ የታረድከው',
          'ስለ ፍቅርህ ስለ መስቀሉ ሞት',
          'ሕይወቴን ሰጠሁህ ላንተ ይሁን ክብር',
          'የጨለማውን ቀን በቀን ተክተህልኝ',
          'የምስጋና ቅኔን በአንደበቴ ሞላህ',
          'በሕይወቴ ሁሉ ዝናህን አወራለሁ'
        ]
      },
      {
        type: 'CHORUS',
        lines: [
          'ግን ባንተ... ግን ባንተ...',
          'የእግዚአብሔር ልጅ ተብያለሁ',
          'ከጨለማ ወደ ድንቅ ብርሃን',
          'ተሻግሬአለሁ ባንተ ስም!'
        ]
      }
    ]
  },
  {
    id: 'song-mewededien',
    title: 'Mewededien',
    amharicTitle: 'መወደዴን',
    category: 'Worship',
    writtenBy: 'Yididya Choir',
    language: 'Amharic',
    key: 'C Major',
    tempo: '72 BPM',
    audioDuration: '4:35',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-05T14:30:00Z',
    textAlign: 'center',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'መወደዴን ሳስበው የሚደንቀኝ',
          'ከምድር አቧራ ያነሳኸኝ',
          'በፍቅርህ ማዕበል ልቤን ያረሰረስከው',
          'ቸር አምላክ አንተ ነህ የማትለወጠው'
        ]
      },
      {
        type: 'CHORUS',
        lines: [
          'መወደዴ በጸጋህ ነውና',
          'ክብር ምስጋና ይድረስህ ጌታ',
          'ለዘላለም ስምህ ይባረክ'
        ]
      },
      {
        type: 'VERSE',
        index: 2,
        lines: [
          'በመንገዴ ሁሉ ብርሃኔ አንተ ነህ',
          'የደካማነቴ መጠጊያዬ ነህ',
          'ስምህን ጠርቼ መቼ አፍሬ አውቃለሁ',
          'ምስጋናዬን ላንተ አቀርባለሁ'
        ]
      }
    ]
  },
  {
    id: 'song-tazez',
    title: 'Tazez',
    amharicTitle: 'ታዘዝ',
    category: 'Worship',
    writtenBy: 'Yididya Choir',
    language: 'Amharic',
    key: 'G Major',
    tempo: '80 BPM',
    audioDuration: '6:12',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_11861866-lq.mp3',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-08T09:15:00Z',
    textAlign: 'center',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'ታዘዝ ነፍሴ ሆይ ለእግዚአብሔር',
          'እርሱ ነውና አዳኝህ ታማኝ መሪህ',
          'በነፋስ በማዕበል ውስጥ ድምፁን ስማ',
          'የእርሱ ፈቃድ ለዘላለም ጸንቶ ይኖራል'
        ]
      },
      {
        type: 'CHORUS',
        lines: [
          'እታዘዛለሁ ቃሉን አከብራለሁ',
          'በሕይወቴ ሁሉ ፈቃዱን እፈጽማለሁ'
        ]
      }
    ]
  },
  {
    id: 'song-wabiye-neh',
    title: 'Wabiye Neh',
    amharicTitle: 'ዋቢዬ ነህ',
    category: 'Worship',
    writtenBy: 'Yididya Choir Elders',
    language: 'Amharic',
    key: 'D Major',
    tempo: '70 BPM',
    audioDuration: '5:10',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-10T12:00:00Z',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'ዋቢዬ ነህ ለነገዬ',
          'ዋስትናዬ ለመኖሬ',
          'የተስፋዬ መልህቅ አንተ ነህ',
          'በአንተ ፍቅር እታመናለሁ'
        ]
      }
    ]
  },
  {
    id: 'song-alresawum',
    title: 'Alresawum',
    amharicTitle: 'አልረሳውም',
    category: 'Praise',
    writtenBy: 'Yididya Choir',
    language: 'Amharic',
    key: 'F Major',
    tempo: '96 BPM',
    audioDuration: '4:50',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-12T16:20:00Z',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'አልረሳውም ውለታህን',
          'ያደረግክልኝን ሁሉ',
          'በልቤ ውስጥ ተጽፎ ይኖራል',
          'ምስጋናህ ለዘላለም'
        ]
      }
    ]
  },
  {
    id: 'song-kidus',
    title: 'Kidus Kidus',
    amharicTitle: 'ቅዱስ',
    category: 'Choral',
    writtenBy: 'Traditional Orthodox & Evangelical Hymn',
    language: 'Ge\'ez / Amharic',
    key: 'A Minor',
    tempo: '65 BPM',
    audioDuration: '5:15',
    isFavorite: false,
    isDownloaded: false,
    createdAt: '2026-03-14T08:00:00Z',
    verses: [
      {
        type: 'VERSE',
        index: 1,
        lines: [
          'ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር',
          'ሰማይና ምድር በክብርህ ተሞልተዋል',
          'በልዑል ማደሪያህ ምስጋና ይሁን',
          'በጌታ ስም የሚመጣ የተባረከ ነው'
        ]
      }
    ]
  }
];

export const INITIAL_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'sched-1',
    title: 'Saturday Main Choir Rehearsal',
    type: 'Rehearsal',
    date: '2026-09-20',
    time: '3:00 PM – 5:30 PM',
    location: 'Main Sanctuary, Fellowship Hall',
    description: 'Preparation for upcoming Sunday Service hymns. Please arrive 15 minutes early for vocal warm-ups and harmony tuning.',
    voicePartsNeeded: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    isAttending: true,
    isPast: false
  },
  {
    id: 'sched-2',
    title: 'Sunday Morning Worship Ministry',
    type: 'Sunday Worship',
    date: '2026-09-21',
    time: '8:30 AM – 12:00 PM',
    location: 'Main Sanctuary',
    description: 'Full choir attire required (Navy & Gold stoles). Song lineup: "Gin Bante", "Mewededien", and Entrance Anthem.',
    voicePartsNeeded: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    isAttending: true,
    isPast: false
  },
  {
    id: 'sched-3',
    title: 'Vocal Harmony Workshop',
    type: 'Vocal Training',
    date: '2026-09-24',
    time: '6:00 PM – 7:30 PM',
    location: 'Choir Room B',
    description: 'Special breath control, diaphragm resonance, and 4-part polyphony dynamics with guest music director.',
    voicePartsNeeded: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    isAttending: false,
    isPast: false
  },
  {
    id: 'sched-4',
    title: 'Annual Spiritual Choir Retreat',
    type: 'Special Program',
    date: '2026-10-03',
    time: 'All Day',
    location: 'Bishoftu Lake Center',
    description: 'Fellowship, prayer, repertoire planning, and bonding for all choir members and leaders.',
    voicePartsNeeded: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    isAttending: true,
    isPast: false
  }
];

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'mom-1',
    title: 'Easter Sunday Worship Celebration',
    date: 'April 2026',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    caption: 'Lifting up our voices in unified praise before thousands in the congregation. Glory to God!',
    likesCount: 42,
    isLiked: true
  },
  {
    id: 'mom-2',
    title: 'Saturday Evening Harmony Practice',
    date: 'March 2026',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    caption: 'Rehearsing the 4-part arrangement for "Gin Bante". The tenors and sopranos blended beautifully tonight.',
    likesCount: 31,
    isLiked: false
  },
  {
    id: 'mom-3',
    title: 'Choir Fellowship & Prayer Night',
    date: 'February 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    caption: 'Breaking bread together and praying over our musical ministry and personal walk with Christ.',
    likesCount: 27,
    isLiked: true
  }
];

export const INITIAL_DEVOTIONALS: Devotional[] = [
  {
    id: 'dev-1',
    title: 'Singing with Grace in Your Hearts',
    scripture: 'Colossians 3:16 — "Let the word of Christ dwell in you richly... singing psalms and hymns and spiritual songs with grace in your hearts to the Lord."',
    content: 'When we gather as YIDIDYA Choir, our singing is never a performance for human applause. It is an outpouring of a heart filled with gratitude for what the Lord has done. Every note we sing carries spiritual weight. When we sing "Gin Bante", we remember where grace found us and where redemption placed us.',
    author: 'Pastor Daniel & Choir Spiritual Committee',
    date: 'September 15, 2026',
    readTime: '3 min read'
  },
  {
    id: 'dev-2',
    title: 'The Beauty of Harmony and Unity',
    scripture: 'Psalm 133:1 — "Behold, how good and pleasant it is when brothers and sisters dwell together in unity!"',
    content: 'A choir cannot function if each voice seeks to dominate. The soprano needs the warmth of the alto, the grounding of the bass, and the lift of the tenor. So it is in the body of Christ. Our vocal harmony reflects our spiritual fellowship.',
    author: 'Music Ministry Leadership',
    date: 'September 10, 2026',
    readTime: '4 min read'
  }
];

export const CHOIR_LEADERS: ChoirLeader[] = [
  {
    id: 'lead-1',
    name: 'Yidnekachew Teka',
    role: 'Music Director & Songwriter',
    voicePart: 'Tenor',
    phone: '+251 911 234 567',
    email: 'yidnekachew@yididyachoir.org',
    bio: 'Directing YIDIDYA Choir since 2019, composer of "Gin Bante" and numerous church anthems.'
  },
  {
    id: 'lead-2',
    name: 'Selamawit Kebede',
    role: 'Vocal Coach & Soprano Section Leader',
    voicePart: 'Soprano',
    phone: '+251 922 345 678',
    email: 'selamawit@yididyachoir.org',
    bio: 'Trained classical vocalist dedicated to guiding our young singers into pitch purity and breath control.'
  },
  {
    id: 'lead-3',
    name: 'Ephraim Tessema',
    role: 'Platform Developer & Admin',
    voicePart: 'Unassigned',
    phone: '+251 938 126 346',
    email: 'ephraimtessema@gmail.com',
    bio: 'Computer Science & Engineering student at ASTU. Creator of the Yididya digital mobile and offline platform.'
  }
];
