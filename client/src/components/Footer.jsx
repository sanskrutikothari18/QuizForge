import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">

        {/* 3 Columns Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 pb-10 border-b border-white/10">

          {/* Column 1: Brand & Bio */}
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
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-extrabold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Contact */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-extrabold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <Link to="/join" className="hover:text-secondary transition-colors">
                  Join Game with Code
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-secondary transition-colors">
                  Create Quiz
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-secondary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="mailto:support@fourisequizhub.com" className="hover:text-accent transition-colors flex items-center gap-1.5 pt-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>support@fourisequizhub.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <p>© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
