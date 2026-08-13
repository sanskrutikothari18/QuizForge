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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* 4 Column Layout Matching Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 border-b border-white/10 text-left">

          {/* Column 1: Brand Logo & Description */}
          <div className="space-y-3 text-left">
            <Link to="/" className="inline-flex items-center justify-start gap-2.5 transition-transform active:scale-95">
              <Logo className="h-7 w-7" />
              <span className="font-outfit text-lg font-bold tracking-tight text-primary">
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 max-w-xs text-left">
              Fourise Quiz Hub is an interactive digital quiz platform offering AI quiz generation, real-time multiplayer challenges, and comprehensive analytics.
            </p>
          </div>

          {/* Column 2: Get in Touch */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-bold text-primary tracking-wide text-left">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300 text-left">
              <li className="flex items-start justify-start gap-2.5 text-left">
                <span className="text-primary mt-0.5 shrink-0">📍</span>
                <span>Pune</span>
              </li>
              <li className="flex items-center justify-start gap-2.5 text-left">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:support@fourisequizhub.com" className="hover:text-primary transition-colors">
                  support@fourisequizhub.com
                </a>
              </li>
              <li className="flex items-center justify-start gap-2.5 text-left">
                <span className="text-primary shrink-0">📞</span>
                <a href="tel:+13866883295" className="hover:text-primary transition-colors">
                  +1 386-688-3295
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Features & Services */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-bold text-primary tracking-wide text-left">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 text-left">
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  AI Quiz Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Live Multiplayer
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Real-time Analytics
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Pro Subscriptions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  SEO & Search Integration
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links / Company */}
          <div className="space-y-3 text-left">
            <h4 className="font-outfit text-sm font-bold text-primary tracking-wide text-left">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 text-left">
              <li>
                <Link to="/join" className="hover:text-primary transition-colors text-left">
                  Join Game Code
                </Link>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Help & FAQs
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors text-left">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500 text-left">
          <p className="text-left">© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</p>
          <div className="flex gap-4 justify-start text-left">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

