import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Globe, Share2, Code2, HelpCircle, Shield, FileText } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';

  return (
    <footer
      className="w-full border-t border-white/5 transition-colors duration-300 relative overflow-hidden"
      style={{
        background: isLight ? '#f4f0fd' : '#0a0a0f',
        color: isLight ? '#4b5563' : '#9ca3af',
      }}
    >
      {/* Background Decorative Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span
                className="font-outfit text-xl font-bold tracking-tight"
                style={{ color: isLight ? '#111827' : '#ffffff' }}
              >
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: isLight ? '#6b7280' : '#9ca3af' }}>
              Empowering real-time interactive quizzes, learning assessments, and engaging multiplayer challenges.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:scale-105"
                style={{ background: isLight ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.05)' }}
                aria-label="Code Repository"
              >
                <Code2 className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-white/10 hover:border-secondary/50 transition-all hover:scale-105"
                style={{ background: isLight ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.05)' }}
                aria-label="Community"
              >
                <Share2 className="h-4 w-4 text-secondary" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-white/10 hover:border-accent/50 transition-all hover:scale-105"
                style={{ background: isLight ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.05)' }}
                aria-label="Website"
              >
                <Globe className="h-4 w-4 text-accent" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4
              className="font-outfit text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: isLight ? '#111827' : '#ffffff' }}
            >
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  Join Game
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h4
              className="font-outfit text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: isLight ? '#111827' : '#ffffff' }}
            >
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/quiz/create" className="hover:text-primary transition-colors">
                  Create Quiz
                </Link>
              </li>
              <li>
                <Link to="/quiz/my" className="hover:text-primary transition-colors">
                  My Quizzes
                </Link>
              </li>
              <li>
                <span className="cursor-default hover:text-primary transition-colors">
                  Real-time Multiplayer
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-primary transition-colors">
                  Analytics & Reports
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Security */}
          <div>
            <h4
              className="font-outfit text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: isLight ? '#111827' : '#ffffff' }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <Link to="/#faq" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="cursor-default hover:text-primary transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="cursor-default hover:text-primary transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium"
          style={{ color: isLight ? '#6b7280' : '#6b7280' }}
        >
          <p>© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for interactive learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
