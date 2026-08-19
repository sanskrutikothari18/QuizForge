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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* 3-Column Compact Synchronized Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-5 border-b border-black/10 dark:border-white/10 text-left">
          
          {/* Column 1: Brand & Parent Company */}
          <div className="space-y-3 text-left">
            <Link to="/" className="inline-flex items-center gap-2 transition-transform active:scale-95">
              <Logo className="h-7 w-7" />
              <span className="font-outfit text-lg font-black tracking-tight text-primary">
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>

            <div className="space-y-1.5">
              <h5 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-heading)' }}>
                <Building2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span>Fourise Software Solutions Pvt Ltd</span>
              </h5>
              
              <a
                href="https://fouriseindia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline transition-colors"
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>fouriseindia.com</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>

            <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Interactive multiplayer battle platform for live quizzes, AI question generation, and instant participant analytics.
            </p>

            {/* Second Branch Notice Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-[10px] font-extrabold text-primary">
              <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse shrink-0" />
              <span>We've Opened Our Second Branch</span>
            </div>
          </div>

          {/* Column 2: Head Office & Navigable Map Address */}
          <div className="space-y-2.5 text-left">
            <h4 className="font-outfit text-xs font-black tracking-wide uppercase" style={{ color: 'var(--text-heading)' }}>
              Head Office & Contact
            </h4>

            {/* Clickable Navigable Address */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-primary/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-left cursor-pointer"
              title="Fourise Software Solutions Pvt. Ltd Pune (Google Maps)"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-[10px] font-black uppercase text-secondary tracking-wider flex items-center gap-1">
                    <span>Pune (Head Office)</span>
                    <ExternalLink className="h-3 w-3 text-secondary opacity-70 group-hover:opacity-100 shrink-0" />
                  </span>
                  <p className="text-[11px] font-semibold leading-snug truncate" style={{ color: 'var(--text-main)' }}>
                    305, City Vista, Kharadi, Pune 411014
                  </p>
                </div>
              </div>
            </a>

            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:support@fourisequizhub.com" className="hover:text-primary transition-colors">
                  support@fourisequizhub.com
                </a>
              </li>
              <li className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="tel:+13866883295" className="hover:text-primary transition-colors">
                  +1 386-688-3295
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-2.5 text-left">
            <h4 className="font-outfit text-xs font-black tracking-wide uppercase" style={{ color: 'var(--text-heading)' }}>
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li>
                <button onClick={() => handleNavClick('#interactive-demo')} className="hover:text-primary transition-colors cursor-pointer text-left font-extrabold text-secondary flex items-center gap-1.5">
                  <span className="shrink-0">▶</span>
                  <span>Play Interactive Demo</span>
                </button>
              </li>
              <li>
                <Link to="/join" className="hover:text-primary transition-colors font-semibold flex items-center gap-1.5">
                  <span>Join Game with PIN</span>
                </Link>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold flex items-center gap-1.5">
                  <span>How Quiz Hub Works</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold flex items-center gap-1.5">
                  <span>Pricing & Plans</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors cursor-pointer text-left font-semibold flex items-center gap-1.5">
                  <span>Help & FAQs</span>
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors font-semibold flex items-center gap-1.5">
                  <span>Host Login / Register</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal Row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} Fourise Software Solutions Pvt Ltd · Fourise Quiz Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <a href="https://fouriseindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Fourise India
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
