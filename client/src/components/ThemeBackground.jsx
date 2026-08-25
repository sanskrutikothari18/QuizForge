import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeBackground = ({ children }) => {
  const { activeTheme, themeMode } = useTheme();
  const isLight = themeMode === 'light';

  const primaryColor = activeTheme?.colors?.primary || '#0284c7';
  const secondaryColor = activeTheme?.colors?.secondary || '#38bdf8';
  const accentColor = activeTheme?.colors?.accent || '#06b6d4';

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Base Background: Shades of Light Blue in Light mode */}
      <div 
        className="absolute inset-0 z-0 transition-colors duration-700" 
        style={{ 
          background: isLight 
            ? '#f8fafc' 
            : (activeTheme?.colors?.background || 'var(--theme-bg)') 
        }}
      />

      {/* Subtle Ambient Soft Light Blue Orbs (Static / CSS Animated) */}
      <div 
        className={`absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none filter blur-[120px] animate-pulse ${
          isLight ? 'mix-blend-multiply opacity-25' : 'mix-blend-screen opacity-40'
        }`}
        style={{ background: isLight ? '#bae6fd' : primaryColor }}
      />

      <div 
        className={`absolute bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none filter blur-[140px] animate-pulse ${
          isLight ? 'mix-blend-multiply opacity-20' : 'mix-blend-screen opacity-30'
        }`}
        style={{ background: isLight ? '#7dd3fc' : accentColor, animationDuration: '9s' }}
      />

      <div 
        className={`absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full pointer-events-none filter blur-[110px] animate-pulse ${
          isLight ? 'mix-blend-multiply opacity-15' : 'mix-blend-screen opacity-20'
        }`}
        style={{ background: isLight ? '#93c5fd' : secondaryColor, animationDuration: '12s' }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default ThemeBackground;
