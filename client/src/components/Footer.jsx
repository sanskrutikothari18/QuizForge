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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Brand & Description */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2 transition-transform active:scale-95 shrink-0">
              <Logo className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-outfit text-sm font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>
            <span className="hidden sm:inline text-gray-500">•</span>
            <p className="text-[11px] font-medium text-gray-400 max-w-xs sm:max-w-none">
              Interactive quizzes, real-time multiplayer & analytics.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-gray-400">
            <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer">
              FAQs
            </button>
            <Link to="/join" className="hover:text-secondary transition-colors">
              Join Game
            </Link>
            <a href="mailto:support@fourisequizhub.com" className="hover:text-accent transition-colors inline-flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>Contact</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[10px] sm:text-[11px] font-medium text-gray-500 shrink-0">
            © {new Date().getFullYear()} Fourise Quiz Hub.
          </div>

        </div>
      </div>
    </footer>
  );
}

