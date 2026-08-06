import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Heart, Globe, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { themeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (hash) => {
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }} className="relative z-10 w-full overflow-hidden backdrop-blur-xl transition-colors duration-300">
      
      {/* Decorative Glow Background Spheres */}
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 translate-y-1/2 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* 4 Columns Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-white/10">

          {/* Column 1: Brand & Social */}
          <div className="space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="font-outfit text-xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Empower learning with interactive quizzes, real-time multiplayer challenges, and detailed performance analytics.
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105 text-gray-300"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-secondary hover:bg-secondary/10 hover:text-secondary hover:scale-105 text-gray-300"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105 text-gray-300"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
                <a
                  href="mailto:support@fourisequizhub.com"
                  aria-label="Email"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-accent hover:bg-accent/10 hover:text-accent hover:scale-105 text-gray-300"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-extrabold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#live-demo')} className="hover:text-primary transition-colors cursor-pointer">
                  Interactive Demo
                </button>
              </li>
              <li>
                <span className="text-gray-500 flex items-center gap-1">
                  <span>Product Updates</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-black">v2.0</span>
                </span>
              </li>
              <li>
                <span className="text-gray-500">Public Roadmap</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-extrabold uppercase tracking-wider text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-secondary transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-secondary transition-colors cursor-pointer">
                  Help & FAQs
                </button>
              </li>
              <li>
                <Link to="/join" className="hover:text-secondary transition-colors">
                  Join Game with Code
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Documentation</span>
              </li>
              <li>
                <span className="text-gray-500">Video Tutorials</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-extrabold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#why-choose')} className="hover:text-accent transition-colors cursor-pointer">
                  About QuizForge
                </button>
              </li>
              <li>
                <a href="mailto:support@fourisequizhub.com" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-gray-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-gray-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-gray-500">Security & Compliance</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <p>© 2026 QuizForge. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
            <span>for educators & trivia champions</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
