import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    // Check local storage for saved theme
    const saved = localStorage.getItem('quizforge_theme');
    return saved && themes[saved] ? themes[saved] : defaultTheme;
  });

  // Whenever theme changes, update CSS variables on the :root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', activeTheme.colors.primary);
    root.style.setProperty('--theme-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--theme-accent', activeTheme.colors.accent);
    root.style.setProperty('--theme-bg', activeTheme.colors.background);
    root.style.setProperty('--theme-card-bg', activeTheme.colors.cardBg);
    root.style.setProperty('--theme-text', activeTheme.colors.text);
    root.style.setProperty('--theme-font', activeTheme.typography.fontFamily);
    
    // Save to local storage
    localStorage.setItem('quizforge_theme', activeTheme.id);
  }, [activeTheme]);

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setActiveTheme(themes[themeId]);
    }
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
