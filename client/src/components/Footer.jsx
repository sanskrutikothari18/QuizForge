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
    <footer style={{ background: '#130924', borderTop: '1px solid rgba(147, 51, 234, 0.3)' }} className="relative z-10 w-full backdrop-blur-xl transition-colors duration-300 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        
        {/* 4 Column Compact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 border-b border-purple-500/20 text-left">
          
          {/* Column 1: Brand Logo & Description */}
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <Link to="/" className="inline-flex items-center gap-2 transition-transform active:scale-95">
              <Logo className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-outfit text-sm sm:text-base font-bold tracking-tight text-white">
                Fourise <span className="text-purple-300">Quiz Hub</span>
              </span>
            </Link>
            <p className="text-[11px] leading-relaxed text-purple-100/80 max-w-xs sm:max-w-none">
              Fourise Quiz Hub is an interactive digital quiz platform offering AI quiz generation, real-time challenges, and analytics.
            </p>
          </div>

          {/* Column 2: Get in Touch */}
          <div className="space-y-1.5">
            <h4 className="font-outfit text-xs font-bold text-white tracking-wide uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-1 text-[11px] text-purple-100">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-300 shrink-0">📍</span>
                <span className="leading-tight">8819 Ohio St. South Gate, CA 90280</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-purple-300 shrink-0" />
                <a href="mailto:support@fourisequizhub.com" className="hover:text-purple-300 transition-colors truncate">
                  support@fourisequizhub.com
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-300 shrink-0">📞</span>
                <a href="tel:+13866883295" className="hover:text-purple-300 transition-colors">
                  +1 386-688-3295
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-1.5">
            <h4 className="font-outfit text-xs font-bold text-white tracking-wide uppercase">
              Features
            </h4>
            <ul className="space-y-1 text-[11px] text-purple-100/90">
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  AI Quiz Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Live Multiplayer
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Real-time Analytics
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Pro Subscriptions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-1.5">
            <h4 className="font-outfit text-xs font-bold text-white tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-1 text-[11px] text-purple-100/90">
              <li>
                <Link to="/join" className="hover:text-purple-300 transition-colors">
                  Join Game Code
                </Link>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-purple-200/70">
          <p>© {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.</p>
          <div className="flex gap-3">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

