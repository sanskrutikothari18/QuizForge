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
    <footer className="relative z-10 w-full border-t border-white/10 overflow-hidden bg-background/80 backdrop-blur-lg transition-colors duration-300">
      {/* Decorative Glow Background Spheres */}
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 translate-y-1/2 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Top Banner / Call to Action Box */}
        <div 
          className="mb-12 rounded-3xl p-6 sm:p-8 relative overflow-hidden glass-panel border border-white/10"
          style={{
            background: isLight 
              ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.12) 100%)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ready for Live Trivia Battles?</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Elevate learning with interactive live quizzes
              </h3>
              <p className="text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
                Join thousands of hosts and players around the globe. Host custom multiplayer sessions or join with a quick PIN code.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                to="/join"
                className="btn-premium flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-extrabold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #0891b2)', border: 'none' }}
              >
                <Gamepad2 className="h-4 w-4" />
                Join Game PIN
              </Link>

              {token ? (
                <Link
                  to="/quiz/create"
                  className="btn-premium flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-extrabold shadow-premium-glow"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create a Quiz
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-premium flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-extrabold shadow-premium-glow"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Logo & Social Links */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="font-outfit text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-bold block mb-2" style={{ color: 'var(--text-muted)' }}>
                Follow & Connect
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-xl border border-white/10 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
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
                  className="p-2 rounded-xl border border-white/10 transition-all hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
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
                  className="p-2 rounded-xl border border-white/10 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                  style={{ color: 'var(--text-main)' }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
                <a
                  href="mailto:support@fourisequizhub.com"
                  aria-label="Email"
                  className="p-2 rounded-xl border border-white/10 transition-all hover:border-accent hover:bg-accent/10 hover:text-accent"
                  style={{ color: 'var(--text-main)' }}
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => handleHashLink('#features')} className="hover:text-primary transition-colors flex items-center gap-1.5 text-left" style={{ color: 'var(--text-main)' }}>
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => handleHashLink('#how-it-works')} className="hover:text-primary transition-colors flex items-center gap-1.5 text-left" style={{ color: 'var(--text-main)' }}>
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleHashLink('#testimonials')} className="hover:text-primary transition-colors flex items-center gap-1.5 text-left" style={{ color: 'var(--text-main)' }}>
                  Reviews & Feedback
                </button>
              </li>
              <li>
                <Link to="/join" className="hover:text-primary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                  Enter PIN to Join
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Tools & Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-secondary">
              Quick Shortcuts
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {token ? (
                <>
                  <li>
                    <Link to="/dashboard" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/quiz/my" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      <BookOpen className="h-4 w-4 text-secondary" />
                      My Quiz Collection
                    </Link>
                  </li>
                  <li>
                    <Link to="/quiz/create" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      <PlusCircle className="h-4 w-4 text-accent" />
                      Create New Quiz
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      Login to Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      Sign Up for Free
                    </Link>
                  </li>
                  <li>
                    <Link to="/forgot-password" className="hover:text-secondary transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      Reset Password
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
