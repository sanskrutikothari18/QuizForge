import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Atom, Dna, FlaskConical, Microscope, Telescope,
  Cpu, Monitor, Keyboard, Database, Network,
  Globe, Compass, Map, Milestone,
  Leaf, TreePine, Bird,
  Music, Radio, Speaker,
  Film, Video, Clapperboard,
  Waves, Fish, Shell,
  Flower2, PartyPopper, Hexagon, Sparkles
} from 'lucide-react';

const ThemeBackground = ({ children }) => {
  const { activeTheme } = useTheme();

  const getParticles = () => {
    const type = activeTheme?.effects?.particleType;
    if (!type) return null;

    const particleCount = 12;
    const particles = Array.from({ length: particleCount });
    
    return particles.map((_, i) => {
      const size = Math.random() * 25 + 15;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 10;
      
      let IconComponent = null;
      let iconColor = 'rgba(255,255,255,0.15)';

      if (type === 'atoms') {
        const icons = [Atom, Dna, FlaskConical, Microscope, Telescope];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.accent;
      } else if (type === 'grid') {
        const icons = [Cpu, Monitor, Keyboard, Database, Network];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.primary;
      } else if (type === 'planes') {
        const icons = [Globe, Compass, Map, Milestone];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.primary;
      } else if (type === 'leaves') {
        const icons = [Leaf, TreePine, Bird];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.secondary;
      } else if (type === 'equalizer') {
        const icons = [Music, Radio, Speaker];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.accent;
      } else if (type === 'spotlight') {
        const icons = [Film, Video, Clapperboard];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.primary;
      } else if (type === 'bubbles') {
        const icons = [Waves, Fish, Shell];
        IconComponent = icons[i % icons.length];
        iconColor = activeTheme.colors.accent;
      } else if (type === 'petals') {
        IconComponent = Flower2;
        iconColor = activeTheme?.colors?.accent || 'rgba(255,255,255,0.15)';
      } else if (type === 'confetti') {
        IconComponent = PartyPopper;
        iconColor = activeTheme?.colors?.primary || 'rgba(255,255,255,0.15)';
      } else if (type === 'nodes') {
        IconComponent = Hexagon;
        iconColor = activeTheme?.colors?.secondary || 'rgba(255,255,255,0.15)';
      } else {
        IconComponent = Sparkles;
        iconColor = activeTheme?.colors?.accent || 'rgba(255,255,255,0.15)';
      }

      return (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${left}%`,
            bottom: '-15%',
            color: iconColor,
            opacity: Math.random() * 0.3 + 0.1
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: Math.random() > 0.5 ? ['0vw', '15vw', '-15vw'] : ['0vw', '-15vw', '15vw'],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: 'linear'
          }}
        >
          <IconComponent size={size} strokeWidth={1.5} />
        </motion.div>
      );
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Background base */}
      <div 
        className="absolute inset-0 z-0 opacity-100 transition-all duration-1000" 
        style={{ background: activeTheme?.colors?.background || 'var(--theme-bg)' }}
      />
      
      {/* Subtle Glowing Orbs */}
      <div 
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full mix-blend-screen pointer-events-none filter blur-[100px] opacity-40 animate-pulse"
        style={{ background: activeTheme?.colors?.primary }}
      />
      <div 
        className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full mix-blend-screen pointer-events-none filter blur-[120px] opacity-30 animate-pulse"
        style={{ background: activeTheme?.colors?.accent, animationDuration: '8s' }}
      />
      <div 
        className="absolute top-[40%] right-[40%] w-[300px] h-[300px] rounded-full mix-blend-screen pointer-events-none filter blur-[90px] opacity-20 animate-pulse"
        style={{ background: activeTheme?.colors?.secondary, animationDuration: '12s' }}
      />

      {/* Particles layer */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {getParticles()}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default ThemeBackground;
