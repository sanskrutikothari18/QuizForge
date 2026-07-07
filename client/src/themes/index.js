export const themes = {
  science: {
    id: 'science',
    name: 'Science',
    colors: {
      primary: '#0ea5e9', // Sky blue
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      cardBg: 'rgba(15, 23, 42, 0.6)',
      text: '#f8fafc',
    },
    effects: {
      glass: 'backdrop-blur-md border border-sky-500/30',
      glow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
      particleType: 'atoms',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
    }
  },
  space: {
    id: 'space',
    name: 'Space Mission',
    colors: {
      primary: '#8b5cf6', // Violet
      secondary: '#6d28d9',
      accent: '#c4b5fd',
      background: 'linear-gradient(to bottom, #000000, #17002e, #0a001a)',
      cardBg: 'rgba(10, 0, 26, 0.7)',
      text: '#ffffff',
    },
    effects: {
      glass: 'backdrop-blur-lg border border-purple-500/20',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
      particleType: 'stars',
    },
    typography: {
      fontFamily: "'Space Grotesk', sans-serif",
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      primary: '#facc15', // Yellow
      secondary: '#eab308',
      accent: '#22d3ee', // Cyan
      background: 'linear-gradient(135deg, #111827 0%, #312e81 100%)',
      cardBg: 'rgba(17, 24, 39, 0.8)',
      text: '#fdf8f6',
    },
    effects: {
      glass: 'backdrop-blur-sm border-2 border-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.6)]',
      particleType: 'grid',
    },
    typography: {
      fontFamily: "'Orbitron', sans-serif",
    }
  },
  heritage: {
    id: 'heritage',
    name: 'Indian Heritage',
    colors: {
      primary: '#f59e0b', // Amber
      secondary: '#d97706',
      accent: '#ef4444', // Red
      background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
      cardBg: 'rgba(69, 26, 3, 0.8)',
      text: '#fef3c7',
    },
    effects: {
      glass: 'backdrop-blur-md border border-amber-600/40',
      glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.3)]',
      particleType: 'petals',
    },
    typography: {
      fontFamily: "'Rozha One', serif",
    }
  },
  sports: {
    id: 'sports',
    name: 'Sports Arena',
    colors: {
      primary: '#22c55e', // Green
      secondary: '#16a34a',
      accent: '#fbbf24',
      background: 'linear-gradient(to bottom, #064e3b, #022c22)',
      cardBg: 'rgba(2, 44, 34, 0.7)',
      text: '#f0fdf4',
    },
    effects: {
      glass: 'backdrop-blur-none border-2 border-green-500 rounded-lg',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
      particleType: 'confetti',
    },
    typography: {
      fontFamily: "'Bebas Neue', cursive",
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean World',
    colors: {
      primary: '#06b6d4', // Cyan
      secondary: '#0891b2',
      accent: '#34d399',
      background: 'linear-gradient(to bottom, #164e63, #083344)',
      cardBg: 'rgba(8, 51, 68, 0.6)',
      text: '#cffafe',
    },
    effects: {
      glass: 'backdrop-blur-xl border border-cyan-300/30 rounded-3xl',
      glow: 'shadow-[0_10px_25px_rgba(6,182,212,0.4)]',
      particleType: 'bubbles',
    },
    typography: {
      fontFamily: "'Nunito', sans-serif",
    }
  },
  jungle: {
    id: 'jungle',
    name: 'Jungle Adventure',
    colors: {
      primary: '#84cc16', // Lime
      secondary: '#65a30d',
      accent: '#eab308',
      background: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
      cardBg: 'rgba(20, 83, 45, 0.7)',
      text: '#f7fee7',
    },
    effects: {
      glass: 'backdrop-blur-md border border-lime-500/30',
      glow: 'shadow-[0_5px_15px_rgba(132,204,22,0.3)]',
      particleType: 'leaves',
    },
    typography: {
      fontFamily: "'Cabin', sans-serif",
    }
  },
  ai: {
    id: 'ai',
    name: 'AI Future',
    colors: {
      primary: '#6366f1', // Indigo
      secondary: '#4f46e5',
      accent: '#ec4899', // Pink
      background: 'linear-gradient(to right, #0f172a, #1e1b4b, #312e81)',
      cardBg: 'rgba(15, 23, 42, 0.8)',
      text: '#e0e7ff',
    },
    effects: {
      glass: 'backdrop-blur-lg border border-indigo-500/40',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.6)]',
      particleType: 'nodes',
    },
    typography: {
      fontFamily: "'Fira Code', monospace",
    }
  },
  movie: {
    id: 'movie',
    name: 'Movie Night',
    colors: {
      primary: '#e11d48', // Rose
      secondary: '#be123c',
      accent: '#f59e0b',
      background: 'linear-gradient(to bottom, #4c0519, #28030d)',
      cardBg: 'rgba(40, 3, 13, 0.8)',
      text: '#ffe4e6',
    },
    effects: {
      glass: 'backdrop-blur-sm border border-rose-500/50',
      glow: 'shadow-[0_0_30px_rgba(225,29,72,0.4)]',
      particleType: 'spotlight',
    },
    typography: {
      fontFamily: "'Limelight', cursive",
    }
  },
  music: {
    id: 'music',
    name: 'Music Festival',
    colors: {
      primary: '#d946ef', // Fuchsia
      secondary: '#c026d3',
      accent: '#14b8a6', // Teal
      background: 'linear-gradient(135deg, #4a044e, #2e1065)',
      cardBg: 'rgba(74, 4, 78, 0.6)',
      text: '#fae8ff',
    },
    effects: {
      glass: 'backdrop-blur-xl border border-fuchsia-500/30',
      glow: 'shadow-[0_0_25px_rgba(217,70,239,0.5)]',
      particleType: 'equalizer',
    },
    typography: {
      fontFamily: "'Montserrat', sans-serif",
    }
  },
  travel: {
    id: 'travel',
    name: 'World Travel',
    colors: {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      accent: '#0284c7', // Light blue
      background: 'linear-gradient(to right, #7c2d12, #451a03)',
      cardBg: 'rgba(124, 45, 18, 0.7)',
      text: '#ffedd5',
    },
    effects: {
      glass: 'backdrop-blur-md border border-orange-400/30',
      glow: 'shadow-[0_4px_15px_rgba(249,115,22,0.3)]',
      particleType: 'planes',
    },
    typography: {
      fontFamily: "'Playfair Display', serif",
    }
  }
};

export const defaultTheme = themes.science;
