import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Globe, Sparkles, Building2 } from 'lucide-react';
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

  const googleMapsUrl = 'https://www.google.com/maps/place/Fourise+Software+Solutions+Pvt.+Ltd+Pune/@18.5614019,73.9445274,17z/data=!4m10!1m2!2m1!1s305+City+Vista+Kharadi+Pune+411014!3m6!1s0x3bc2c11464246d03:0x7ef94ccf7fe4a2d0!8m2!3d18.5611975!4d73.9447286!15sCiIzMDUgQ2l0eSBWaXN0YSBLaGFyYWRpIFB1bmUgNDExMDE0WiQiIjMwNSBjaXR5IHZpc3RhIGtoYXJhZGkgcHVuZSA0MTEwMTSSARBzb2Z0d2FyZV9jb21wYW554AEA!16s%2Fg%2F11q_073v_m?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D';

  return (
    <footer
      style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}
      className="relative z-10 w-full backdrop-blur-xl transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-white/10 text-left">
          
          {/* Column 1: Brand & Parent Company */}
          <div className="space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-8 w-8" />
              <span className="font-outfit text-xl font-black tracking-tight text-primary">
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            <div className="space-y-2">
              <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-secondary" />
                <span>Fourise Software Solutions Pvt Ltd</span>
              </h5>
              
              <a
                href="https://fouriseindia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 hover:underline transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>fouriseindia.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-xs leading-relaxed text-gray-400 max-w-xs">
              Interactive multiplayer battle platform for real-time live quizzes, AI question generation, and instant participant analytics.
            </p>

            {/* Second Branch Notice Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/25 px-3 py-1.5 text-[11px] font-extrabold text-primary">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse shrink-0" />
              <span>We've Opened Our Second Branch</span>
            </div>
          </div>

          {/* Column 2: Head Office & Navigable Map Address */}
          <div className="space-y-3.5 text-left">
            <h4 className="font-outfit text-sm font-black text-white tracking-wide uppercase">
              Head Office & Contact
            </h4>

            {/* Clickable Navigable Address */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all text-left cursor-pointer"
              title="Fourise Software Solutions Pvt. Ltd Pune (Google Maps)"
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-secondary tracking-wider block flex items-center gap-1">
                    <span>Pune (Head Office)</span>
                    <ExternalLink className="h-3 w-3 text-secondary opacity-70 group-hover:opacity-100" />
                  </span>
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-white leading-snug">
                    305, City Vista, Kharadi, Pune 411014
                  </p>
                </div>
              </div>
            </a>

            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:support@fourisequizhub.com" className="hover:text-primary transition-colors">
                  support@fourisequizhub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="tel:+13866883295" className="hover:text-primary transition-colors">
                  +1 386-688-3295
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-3.5 text-left">
            <h4 className="font-outfit text-sm font-black text-white tracking-wide uppercase">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#interactive-demo')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  30s Interactive Quiz Demo
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  AI Quiz Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  Real-time Multiplayer Arena
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  Live Score Analytics
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  Pro Host Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-3.5 text-left">
            <h4 className="font-outfit text-sm font-black text-white tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => handleNavClick('#interactive-demo')} className="hover:text-primary transition-colors cursor-pointer text-left font-extrabold text-secondary flex items-center gap-1">
                  <span>▶ Play Interactive Demo</span>
                </button>
              </li>
              <li>
                <Link to="/join" className="hover:text-primary transition-colors font-semibold">
                  Join Game with PIN
                </Link>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  How Quiz Hub Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  Pricing & Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold">
                  Help & FAQs
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors font-semibold">
                  Host Login / Register
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-left">
          <p>© {new Date().getFullYear()} Fourise Software Solutions Pvt Ltd · Fourise Quiz Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            <a href="https://fouriseindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
              Fourise India
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
