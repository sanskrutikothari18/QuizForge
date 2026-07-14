import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    // Check local storage for saved theme palette
    const saved = localStorage.getItem('quizforge_theme');
    return saved && themes[saved] ? themes[saved] : defaultTheme;
  });

  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('quizforge_mode');
    return savedMode === 'light' ? 'light' : 'dark';
  });

  // Whenever palette changes, update CSS variables on :root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', activeTheme.colors.primary);
    root.style.setProperty('--theme-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--theme-accent', activeTheme.colors.accent);
    root.style.setProperty('--theme-bg', activeTheme.colors.background);
    root.style.setProperty('--theme-card-bg', activeTheme.colors.cardBg);
    root.style.setProperty('--theme-text', activeTheme.colors.text);
    root.style.setProperty('--theme-font', activeTheme.typography.fontFamily);
    localStorage.setItem('quizforge_theme', activeTheme.id);
  }, [activeTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', themeMode === 'light');
    root.classList.toggle('dark', themeMode !== 'light');
    localStorage.setItem('quizforge_mode', themeMode);
  }, [themeMode]);

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setActiveTheme(themes[themeId]);
    }
  };

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, changeTheme, themes, themeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
