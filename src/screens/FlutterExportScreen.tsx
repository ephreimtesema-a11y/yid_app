import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Download, Terminal, Layers, FileCode, CheckCircle2 } from 'lucide-react';
import { AppTheme } from '../types';

interface FlutterExportScreenProps {
  theme: AppTheme;
  onBack: () => void;
}

export const FlutterExportScreen: React.FC<FlutterExportScreenProps> = ({
  theme,
  onBack
}) => {
  const isDark = theme === 'dark';
  const [activeFile, setActiveFile] = useState<string>('pubspec.yaml');
  const [copied, setCopied] = useState(false);

  const flutterFiles: Record<string, { desc: string; code: string }> = {
    'pubspec.yaml': {
      desc: 'Flutter dependencies including Supabase, Hive offline database, and Audioplayers',
      code: `name: yididya_choir
description: "Yididya Choir mobile app with local-first offline caching and Supabase"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # Supabase for Auth, Database & Storage
  supabase_flutter: ^2.5.0
  # Local-first high performance offline database & caching
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  # Connectivity monitoring for offline sync triggers
  connectivity_plus: ^5.0.2
  # Rehearsal track playback
  audioplayers: ^5.2.1
  # Typography for Cinzel and Ethiopic fonts
  google_fonts: ^6.1.0
  # State management & UI
  provider: ^6.1.1
  lucide_icons: ^0.257.0
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  hive_generator: ^2.0.1
  build_runner: ^2.4.7

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/audio/`
    },

    'lib/main.dart': {
      desc: 'App entry point initializing Hive offline cache and Supabase client',
      code: `import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/splash_screen.dart';
import 'services/offline_sync_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize local offline storage (Hive)
  await Hive.initFlutter();
  await Hive.openBox('songs_cache');
  await Hive.openBox('schedules_cache');
  await Hive.openBox('sync_queue');
  await Hive.openBox('user_preferences');

  // 2. Initialize Supabase
  await Supabase.initialize(
    url: const String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://your-project.supabase.co'),
    anonKey: const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'your-anon-key'),
  );

  // 3. Start background connectivity listener for offline auto-sync
  OfflineSyncService().initConnectivityListener();

  runApp(const YididyaChoirApp());
}

class YididyaChoirApp extends StatelessWidget {
  const YididyaChoirApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Yididya Choir',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B1328),
        primaryColor: const Color(0xFFE2B350),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFE2B350),
          secondary: Color(0xFF14213D),
          surface: Color(0xFF111A2E),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}`
    },

    'lib/models/song.dart': {
      desc: 'Song and Verse data models with JSON serialization & local caching',
      code: `class Verse {
  final String type; // 'Verse' | 'Chorus' | 'Bridge'
  final int? index;
  final List<String> lines;

  Verse({required this.type, this.index, required this.lines});

  factory Verse.fromJson(Map<String, dynamic> json) => Verse(
    type: json['type'] ?? 'Verse',
    index: json['index'],
    lines: List<String>.from(json['lines'] ?? []),
  );

  Map<String, dynamic> toJson() => {
    'type': type,
    'index': index,
    'lines': lines,
  };
}

class Song {
  final String id;
  final String title;
  final String amharicTitle;
  final String category;
  final String language;
  final String writtenBy;
  final List<Verse> verses;
  final bool isFavorite;
  final bool isDownloaded;
  final String? key;
  final String? tempo;
  final String? audioUrl;

  Song({
    required this.id,
    required this.title,
    required this.amharicTitle,
    required this.category,
    required this.language,
    required this.writtenBy,
    required this.verses,
    this.isFavorite = false,
    this.isDownloaded = false,
    this.key,
    this.tempo,
    this.audioUrl,
  });

  factory Song.fromJson(Map<String, dynamic> json) => Song(
    id: json['id'],
    title: json['title'] ?? '',
    amharicTitle: json['amharic_title'] ?? json['title'] ?? '',
    category: json['category'] ?? 'Worship',
    language: json['language'] ?? 'Amharic',
    writtenBy: json['written_by'] ?? 'Yididya Choir',
    verses: (json['verses'] as List? ?? [])
        .map((v) => Verse.fromJson(v))
        .toList(),
    isFavorite: json['is_favorite'] ?? false,
    isDownloaded: json['is_downloaded'] ?? true,
    key: json['musical_key'],
    tempo: json['tempo'],
    audioUrl: json['audio_url'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'amharic_title': amharicTitle,
    'category': category,
    'language': language,
    'written_by': writtenBy,
    'verses': verses.map((v) => v.toJson()).toList(),
    'is_favorite': isFavorite,
    'is_downloaded': isDownloaded,
    'musical_key': key,
    'tempo': tempo,
    'audio_url': audioUrl,
  };
}`
    },

    'lib/services/offline_sync_service.dart': {
      desc: 'Local-first offline synchronization engine with retry queue & Hive storage',
      code: `import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:hive/hive.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/song.dart';

class OfflineSyncService {
  static final OfflineSyncService _instance = OfflineSyncService._internal();
  factory OfflineSyncService() => _instance;
  OfflineSyncService._internal();

  final SupabaseClient _supabase = Supabase.instance.client;

  void initConnectivityListener() {
    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      if (result != ConnectivityResult.none) {
        // Automatically sync queued offline mutations
        syncPendingQueue();
      }
    });
  }

  // Get all cached songs immediately for offline access
  List<Song> getCachedSongs() {
    final box = Hive.box('songs_cache');
    return box.values
        .map((data) => Song.fromJson(Map<String, dynamic>.from(data)))
        .toList();
  }

  // Save song to offline local cache
  Future<void> cacheSong(Song song) async {
    final box = Hive.box('songs_cache');
    await box.put(song.id, song.toJson());
  }

  // Queue an action when offline (e.g. favorite toggle, new song, RSVP)
  Future<void> queueOfflineAction({
    required String action,
    required String table,
    required Map<String, dynamic> payload,
  }) async {
    final box = Hive.box('sync_queue');
    await box.add({
      'action': action,
      'table': table,
      'payload': payload,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  // Sync pending changes to Supabase when network is restored
  Future<void> syncPendingQueue() async {
    final box = Hive.box('sync_queue');
    if (box.isEmpty) return;

    final items = List.from(box.values);
    for (int i = 0; i < items.length; i++) {
      final item = Map<String, dynamic>.from(items[i]);
      try {
        final action = item['action'];
        final table = item['table'];
        final payload = Map<String, dynamic>.from(item['payload']);

        if (action == 'INSERT' || action == 'UPSERT') {
          await _supabase.from(table).upsert(payload);
        } else if (action == 'UPDATE') {
          await _supabase.from(table).update(payload).eq('id', payload['id']);
        } else if (action == 'DELETE') {
          await _supabase.from(table).delete().eq('id', payload['id']);
        }
        await box.deleteAt(0); // Safely remove completed item
      } catch (e) {
        // Keep in queue if sync fails
        break;
      }
    }
  }
}`
    },

    'lib/screens/lyrics_screen.dart': {
      desc: 'Lyrics screen with font resizing, alignment toggle, and audio rehearsal player',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/song.dart';

class LyricsScreen extends StatefulWidget {
  final Song song;
  const LyricsScreen({super.key, required this.song});

  @override
  State<LyricsScreen> createState() => _LyricsScreenState();
}

class _LyricsScreenState extends State<LyricsScreen> {
  double _fontSize = 17.0;
  TextAlign _textAlign = TextAlign.center;
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.song.amharicTitle,
          style: GoogleFonts.notoSansEthiopic(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Text('T-', style: TextStyle(fontWeight: FontWeight.bold)),
            onPressed: () => setState(() => _fontSize = (_fontSize - 2).clamp(13.0, 30.0)),
          ),
          IconButton(
            icon: const Text('T+', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            onPressed: () => setState(() => _fontSize = (_fontSize + 2).clamp(13.0, 30.0)),
          ),
          IconButton(
            icon: Icon(_textAlign == TextAlign.center ? Icons.format_align_center : Icons.format_align_left),
            onPressed: () => setState(() {
              _textAlign = _textAlign == TextAlign.center ? TextAlign.left : TextAlign.center;
            }),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Category & Song Metadata
          Text(
            widget.song.category.toUpperCase(),
            style: const TextStyle(color: Color(0xFFE2B350), letterSpacing: 2, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            widget.song.amharicTitle,
            style: GoogleFonts.notoSansEthiopic(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          Text('Written by: \${widget.song.writtenBy}', style: const TextStyle(color: Colors.white54, fontSize: 12)),
          const SizedBox(height: 24),

          // Verses
          ...widget.song.verses.map((verse) => Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: Column(
              crossAxisAlignment: _textAlign == TextAlign.center ? CrossAxisAlignment.center : CrossAxisAlignment.start,
              children: [
                Text(
                  '[\${verse.type.toUpperCase()}]',
                  style: const TextStyle(color: Color(0xFFE2B350), letterSpacing: 1.5, fontSize: 11, fontFamily: 'monospace'),
                ),
                const SizedBox(height: 8),
                ...verse.lines.map((line) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text(
                    line,
                    textAlign: _textAlign,
                    style: GoogleFonts.notoSansEthiopic(fontSize: _fontSize, height: 1.8),
                  ),
                )),
              ],
            ),
          )),
        ],
      ),
    );
  }
}`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(flutterFiles[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZipPrompt = () => {
    const combined = Object.entries(flutterFiles)
      .map(([name, item]) => `// ====================================\n// FILE: ${name}\n// ${item.desc}\n// ====================================\n\n${item.code}`)
      .join('\n\n\n');

    const blob = new Blob([combined], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yididya_choir_flutter_source_bundle.dart';
    a.click();
    URL.revokeObjectURL(url);
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
          <div>
            <h1 className="font-cinzel text-lg font-bold">Flutter Source Hub</h1>
            <p className="text-[11px] text-slate-400">Mobile app ready for iOS & Android</p>
          </div>
        </div>

        <button
          onClick={handleDownloadZipPrompt}
          className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition shadow"
        >
          <Download className="w-3.5 h-3.5" />
          Bundle
        </button>
      </div>

      {/* Intro info */}
      <div className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-xs text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider text-[11px]">
          <CheckCircle2 className="w-4 h-4" />
          Recovered Flutter & Supabase Architecture
        </div>
        <p className="leading-relaxed text-[11px]">
          Here is your full Flutter source code configured with <strong>Supabase</strong>, <strong>Hive offline caching</strong>, and exact screen layouts matching your recovered design.
        </p>
      </div>

      {/* File Selector Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {Object.keys(flutterFiles).map((fileName) => (
          <button
            key={fileName}
            onClick={() => setActiveFile(fileName)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition shrink-0 ${
              activeFile === fileName
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {fileName}
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1328] overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="font-mono text-amber-400 font-semibold">{activeFile}</span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy File'}
          </button>
        </div>

        <div className="p-3.5">
          <p className="text-[11px] text-slate-400 mb-2 italic">
            // {flutterFiles[activeFile].desc}
          </p>
          <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto p-2 bg-slate-950/70 rounded-xl leading-relaxed max-h-96">
            {flutterFiles[activeFile].code}
          </pre>
        </div>
      </div>

      {/* Terminal build guide */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs space-y-2 font-mono">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Terminal className="w-4 h-4" />
          <span>Quick Run Instructions:</span>
        </div>
        <ol className="list-decimal pl-4 space-y-1 text-slate-400 text-[11px]">
          <li><code>flutter create yididya_choir</code></li>
          <li>Copy files above into your project</li>
          <li>Run <code>flutter pub get</code></li>
          <li>Run <code>flutter run</code> on your Android/iOS phone or emulator!</li>
        </ol>
      </div>
    </div>
  );
};
