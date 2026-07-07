import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSelector = () => {
  const { activeTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        <span className="text-xl">🎨</span>
        <span className="font-semibold text-sm hidden sm:block">Theme: {activeTheme.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-0 glass-panel rounded-xl p-4 w-64 max-h-[70vh] overflow-y-auto"
          >
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Theme</h3>
            <div className="flex flex-col gap-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    changeTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    activeTheme.id === theme.id 
                      ? 'bg-[var(--theme-primary)] text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                    style={{ background: theme.colors.background }}
                  />
                  <span className="font-medium text-sm">{theme.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
