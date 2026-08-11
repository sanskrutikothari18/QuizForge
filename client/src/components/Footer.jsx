import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
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
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }} className="relative z-10 w-full backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">

        {/* Minimal Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pb-3 border-b border-white/10 text-left">

          {/* Column 1: Brand */}
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-2 transition-transform active:scale-95">
              <Logo className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="font-outfit text-base font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            <p className="text-[11px] leading-tight font-medium" style={{ color: 'var(--text-muted)' }}>
              Interactive quizzes, real-time multiplayer challenges & performance analytics.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-1">
            <h4 className="font-outfit text-xs font-extrabold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-gray-400">
              <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer">
                Features
              </button>
              <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer">
                How It Works
              </button>
              <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer">
                Pricing Plans
              </button>
              <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer">
                Help & FAQs
              </button>
            </div>
          </div>

          {/* Column 3: Quick Links & Contact */}
          <div className="space-y-1">
            <h4 className="font-outfit text-xs font-extrabold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] font-semibold text-gray-400">
              <Link to="/join" className="hover:text-secondary transition-colors">
                Join Game with Code
              </Link>
              <Link to="/login" className="hover:text-secondary transition-colors">
                Create Quiz
              </Link>
              <Link to="/dashboard" className="hover:text-secondary transition-colors">
                Dashboard
              </Link>
              <a href="mailto:support@fourisequizhub.com" className="hover:text-accent transition-colors flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>support@fourisequizhub.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-medium text-gray-400">
          <p>© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

