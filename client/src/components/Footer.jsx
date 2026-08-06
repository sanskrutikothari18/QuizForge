import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles, Gamepad2, Mail, BookOpen, PlusCircle,
  LayoutDashboard, ArrowRight
} from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleHashLink = (hash) => {
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

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6 sm:pt-12 sm:pb-8">

        {/* Grid Navigation: 2 Columns on mobile (Brand full width + 2 side-by-side link cols), 3 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 pb-8 sm:pb-12" style={{ borderBottom: '1px solid var(--footer-border)' }}>

          {/* Column 1: Brand Logo & Social Links */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="font-outfit text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Empower learning with interactive quizzes, real-time multiplayer challenges, and detailed performance analytics.
            </p>

            {/* Social Links */}
            <div className="pt-1">
              <span className="text-xs font-bold block mb-2 tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
                Follow & Connect
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 rounded-xl border border-[var(--glass-panel-border)] bg-[var(--card-bg)] transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105"
                  style={{ color: 'var(--text-main)' }}
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
                  className="p-2.5 rounded-xl border border-[var(--glass-panel-border)] bg-[var(--card-bg)] transition-all hover:border-secondary hover:bg-secondary/10 hover:text-secondary hover:scale-105"
                  style={{ color: 'var(--text-main)' }}
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
                  className="p-2.5 rounded-xl border border-[var(--glass-panel-border)] bg-[var(--card-bg)] transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105"
                  style={{ color: 'var(--text-main)' }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
                <a
                  href="mailto:support@fourisequizhub.com"
                  aria-label="Email"
                  className="p-2.5 rounded-xl border border-[var(--glass-panel-border)] bg-[var(--card-bg)] transition-all hover:border-accent hover:bg-accent/10 hover:text-accent hover:scale-105"
                  style={{ color: 'var(--text-main)' }}
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <Link to="/" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => handleHashLink('#features')} className="hover:text-primary transition-colors inline-flex items-center gap-1.5 py-0.5 text-left" style={{ color: 'var(--text-main)' }}>
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleHashLink('#how-it-works')} className="hover:text-primary transition-colors inline-flex items-center gap-1.5 py-0.5 text-left" style={{ color: 'var(--text-main)' }}>
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleHashLink('#testimonials')} className="hover:text-primary transition-colors inline-flex items-center gap-1.5 py-0.5 text-left" style={{ color: 'var(--text-main)' }}>
                  Reviews
                </button>
              </li>
              <li>
                <Link to="/join" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                  Enter PIN
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Shortcuts */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-secondary">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              {token ? (
                <>
                  <li>
                    <Link to="/dashboard" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      <LayoutDashboard className="h-3.5 w-3.5 text-primary shrink-0" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/quiz/my" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      <BookOpen className="h-3.5 w-3.5 text-secondary shrink-0" />
                      My Quizzes
                    </Link>
                  </li>
                  <li>
                    <Link to="/quiz/create" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      <PlusCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                      Create Quiz
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/forgot-password" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}>
                      Reset Password
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          <span className="text-center sm:text-left">
            © {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.
          </span>

          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 flex-nowrap">
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">Privacy Policy</span>
            <span className="opacity-40">•</span>
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">Terms of Service</span>
            <span className="opacity-40">•</span>
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
