import React from 'react';

interface ChoirLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
  horizontal?: boolean;
}

export const ChoirLogo: React.FC<ChoirLogoProps> = ({
  size = 'md',
  showText = false,
  textColor,
  className = '',
  horizontal = false
}) => {
  const sizeMap = {
    xs: { width: 20, height: 30, textTitle: 'text-xs tracking-[0.2em]', gap: 'gap-1' },
    sm: { width: 28, height: 42, textTitle: 'text-sm tracking-[0.22em]', gap: 'gap-1' },
    md: { width: 44, height: 66, textTitle: 'text-base tracking-[0.22em]', gap: 'gap-1.5' },
    lg: { width: 80, height: 120, textTitle: 'text-2xl tracking-[0.24em]', gap: 'gap-3' },
    xl: { width: 140, height: 210, textTitle: 'text-4xl sm:text-5xl tracking-[0.25em]', gap: 'gap-5' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex ${horizontal ? 'flex-row items-center gap-2.5' : 'flex-col items-center justify-center ' + current.gap} ${className}`}>
      {/* 
        Official Yididya Clef Emblem:
        Golden Treble Clef encircling 3 Worshippers with Raised Hands
        Faithfully matching the real official choir logo
      */}
      <svg
        width={current.width}
        height={current.height}
        viewBox="0 0 100 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_16px_rgba(226,179,80,0.35)] select-none"
      >
        <defs>
          {/* Master Radiant Gold Gradient */}
          <linearGradient id="yididyaClefGold" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFF4C2" />
            <stop offset="30%" stopColor="#F5D87F" />
            <stop offset="65%" stopColor="#DEAC3D" />
            <stop offset="100%" stopColor="#B97E1C" />
          </linearGradient>

          {/* Golden glow for worship figures */}
          <linearGradient id="worshippersGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF6CD" />
            <stop offset="50%" stopColor="#F0C65A" />
            <stop offset="100%" stopColor="#C98F26" />
          </linearGradient>
        </defs>

        {/* 
          1. THE G-CLEF BODY
          Crisp, harmonic treble clef outline
        */}
        <path
          d="M 54 8
             C 50 8, 44 14, 46 24
             C 47 34, 52 46, 52 60
             C 52 65, 49 69, 45 71
             C 38 64, 28 62, 20 70
             C 10 79, 10 96, 22 105
             C 33 113, 48 111, 54 100
             L 54 122
             C 54 132, 49 140, 39 140
             C 32 140, 26 134, 27 127
             C 28 121, 23 118, 18 120
             C 12 122, 11 129, 13 135
             C 18 147, 30 150, 42 148
             C 56 144, 63 131, 63 117
             L 63 30
             C 63 18, 70 14, 75 21
             C 77 26, 75 33, 69 36
             C 65 38, 63 42, 66 45
             C 70 48, 77 46, 81 39
             C 87 29, 83 14, 70 9
             C 65 7, 58 8, 54 8 Z
             
             M 53 87
             C 50 94, 41 97, 33 93
             C 26 88, 25 78, 31 72
             C 37 66, 46 68, 50 75
             C 52 79, 53 83, 53 87 Z"
          fill="url(#yididyaClefGold)"
          fillRule="evenodd"
        />

        {/* 
          2. THREE PRAISING CHOIR MEMBERS (WORSHIPPERS) INSIDE THE CLEF LOOP
          Heads & Torso with Hands Raised High in Praise
        */}
        <g id="choir-worshippers">
          {/* Base platform connecting figures */}
          <path
            d="M 28 92 C 32 94, 45 94, 49 92 L 48 95 C 43 96.5, 34 96.5, 29 95 Z"
            fill="url(#worshippersGold)"
          />

          {/* --- CENTER FIGURE (Lead singer / praise leader) --- */}
          {/* Head */}
          <circle cx="39" cy="74" r="3.2" fill="url(#worshippersGold)" />
          {/* Body */}
          <path
            d="M 36.5 79.5 C 38 78, 40 78, 41.5 79.5 L 42.5 93 C 40 94.5, 38 94.5, 35.5 93 Z"
            fill="url(#worshippersGold)"
          />
          {/* Left raised arm */}
          <path
            d="M 37 80 C 33.5 75.5, 31 71, 29 66 C 28.5 64.5, 30.5 64, 31.5 65.5 C 33 69.5, 35.5 74, 38 78 Z"
            fill="url(#worshippersGold)"
          />
          {/* Right raised arm */}
          <path
            d="M 41 80 C 44.5 75.5, 47 71, 49 66 C 49.5 64.5, 47.5 64, 46.5 65.5 C 45 69.5, 42.5 74, 40 78 Z"
            fill="url(#worshippersGold)"
          />

          {/* --- LEFT FIGURE (Choir section) --- */}
          {/* Head */}
          <circle cx="30" cy="77" r="2.6" fill="url(#worshippersGold)" />
          {/* Body */}
          <path
            d="M 28 82 C 29.5 81, 31.5 81, 32.5 82 L 33 92 C 31 93, 29 93, 27 92 Z"
            fill="url(#worshippersGold)"
          />
          {/* Left raised arm reaching outward */}
          <path
            d="M 28 82 C 25 78, 22.5 74, 20.5 69.5 C 20 68.5, 21.8 67.8, 22.8 69 C 24.5 72.5, 27 76.5, 29 80 Z"
            fill="url(#worshippersGold)"
          />
          {/* Right raised arm reaching upward */}
          <path
            d="M 32 82 C 34 78, 35.5 74.5, 36.5 71 C 37 70, 38.5 70.5, 38 71.5 C 37 74.5, 35.5 78, 33.5 81 Z"
            fill="url(#worshippersGold)"
          />

          {/* --- RIGHT FIGURE (Choir section) --- */}
          {/* Head */}
          <circle cx="48" cy="77" r="2.6" fill="url(#worshippersGold)" />
          {/* Body */}
          <path
            d="M 46 82 C 47.5 81, 49.5 81, 50.5 82 L 51 92 C 49 93, 47 93, 45 92 Z"
            fill="url(#worshippersGold)"
          />
          {/* Left raised arm */}
          <path
            d="M 46 82 C 44 78, 42.5 74.5, 41.5 71 C 41 70, 39.5 70.5, 40 71.5 C 41 74.5, 42.5 78, 44.5 81 Z"
            fill="url(#worshippersGold)"
          />
          {/* Right raised arm reaching outward */}
          <path
            d="M 50 82 C 53 78, 55.5 74, 57.5 69.5 C 58 68.5, 56.2 67.8, 55.2 69 C 53.5 72.5, 51 76.5, 49 80 Z"
            fill="url(#worshippersGold)"
          />
        </g>
      </svg>

      {/* YIDIDYA Wordmark in Classical Gold Serif */}
      {showText && (
        <span
          className={`font-cinzel font-bold select-none ${current.textTitle} ${
            textColor
              ? textColor
              : 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4C2] via-[#F5D87F] to-[#C98F26] drop-shadow-[0_2px_10px_rgba(226,179,80,0.3)]'
          }`}
        >
          YIDIDYA
        </span>
      )}
    </div>
  );
};
