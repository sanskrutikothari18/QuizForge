import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, BookOpen, PlusCircle, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { themeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleHashLink = (hash) => {
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}
      className="relative z-10 w-full overflow-hidden transition-colors duration-300"
    >
      {/* Decorative Glow Spheres */}
      <div className="absolute top-0 left-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-10 pb-6 sm:pt-12 sm:pb-8">

        {/* ═══════════════════════════════════════════════
            MOBILE: Brand row on top, 2-col links below
            DESKTOP (md+): 3-column side-by-side grid
        ═══════════════════════════════════════════════ */}

        {/* ── Desktop 3-col grid (hidden on mobile) ── */}
        <div
          className="hidden md:grid md:grid-cols-3 md:gap-10 lg:gap-16 pb-10"
          style={{ borderBottom: '1px solid var(--footer-border)' }}
        >
          {/* Col 1: Brand + tagline + socials */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-10 w-10" />
              <span className="font-outfit text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Empower learning with interactive quizzes, real-time multiplayer challenges, and detailed performance analytics.
            </p>
            {/* Social Icons */}
            <div>
              <span className="text-xs font-bold block mb-2.5 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                Follow &amp; Connect
              </span>
              <div className="flex flex-row items-center gap-2">
                {[
                  { href: 'https://github.com', label: 'GitHub', hoverClass: 'hover:text-primary hover:border-primary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg> },
                  { href: 'https://twitter.com', label: 'Twitter', hoverClass: 'hover:text-secondary hover:border-secondary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                  { href: 'https://linkedin.com', label: 'LinkedIn', hoverClass: 'hover:text-primary hover:border-primary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" /></svg> },
                  { href: 'mailto:support@fourisequizhub.com', label: 'Email', hoverClass: 'hover:text-accent hover:border-accent', icon: <Mail className="h-4 w-4" /> },
                ].map(({ href, label, hoverClass, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className={`p-2.5 rounded-xl transition-all hover:scale-110 ${hoverClass}`}
                    style={{ color: 'var(--text-muted)', background: 'var(--card-bg)', border: '1px solid var(--footer-border)' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary">Navigation</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {[
                { label: 'Home', to: '/' },
                { label: 'Features', hash: '#features' },
                { label: 'How It Works', hash: '#how-it-works' },
                { label: 'Reviews', hash: '#testimonials' },
                { label: 'Enter PIN to Join', to: '/join' },
              ].map(({ label, to, hash }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="hover:text-primary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>{label}</Link>
                  ) : (
                    <button onClick={() => handleHashLink(hash)} className="hover:text-primary transition-colors block py-0.5 text-left w-full" style={{ color: 'var(--text-main)' }}>{label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-secondary">Quick Links</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {token ? (
                <>
                  <li><Link to="/dashboard" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><LayoutDashboard className="h-3.5 w-3.5 text-primary shrink-0" />Dashboard</Link></li>
                  <li><Link to="/quiz/my" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><BookOpen className="h-3.5 w-3.5 text-secondary shrink-0" />My Quizzes</Link></li>
                  <li><Link to="/quiz/create" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><PlusCircle className="h-3.5 w-3.5 text-accent shrink-0" />Create Quiz</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Login to Account</Link></li>
                  <li><Link to="/register" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Sign Up for Free</Link></li>
                  <li><Link to="/forgot-password" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Reset Password</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* ── Mobile layout (hidden on md+) ── */}
        <div className="md:hidden">
          {/* Brand + Socials row */}
          <div className="mb-6 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform active:scale-95">
              <Logo className="h-9 w-9" />
              <span className="font-outfit text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Fourise <span className="text-secondary">Quiz Hub</span>
              </span>
            </Link>
            <p className="text-xs font-medium leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Empower learning with interactive quizzes, real-time multiplayer challenges, and analytics.
            </p>
            <div>
              <span className="text-xs font-bold block mb-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                Follow &amp; Connect
              </span>
              {/* Force icons into a single horizontal row — no wrapping */}
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '8px' }}>
                {[
                  { href: 'https://github.com', label: 'GitHub', hoverClass: 'hover:text-primary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg> },
                  { href: 'https://twitter.com', label: 'Twitter', hoverClass: 'hover:text-secondary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                  { href: 'https://linkedin.com', label: 'LinkedIn', hoverClass: 'hover:text-primary', icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" /></svg> },
                  { href: 'mailto:support@fourisequizhub.com', label: 'Email', hoverClass: 'hover:text-accent', icon: <Mail className="h-4 w-4" /> },
                ].map(({ href, label, hoverClass, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className={`p-2.5 rounded-xl transition-all hover:scale-110 ${hoverClass}`}
                    style={{ color: 'var(--text-muted)', background: 'var(--card-bg)', border: '1px solid var(--footer-border)', flexShrink: 0 }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 2-col link grid */}
          <div
            className="grid grid-cols-2 gap-6 py-6"
            style={{ borderTop: '1px solid var(--footer-border)', borderBottom: '1px solid var(--footer-border)' }}
          >
            {/* Navigation — uniform spacing via line-height, no py gap variation */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">Navigation</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-xs font-semibold">
                <li><Link to="/" className="hover:text-primary transition-colors leading-none" style={{ color: 'var(--text-main)' }}>Home</Link></li>
                <li><button onClick={() => handleHashLink('#features')} className="hover:text-primary transition-colors leading-none text-left" style={{ color: 'var(--text-main)' }}>Features</button></li>
                <li><button onClick={() => handleHashLink('#how-it-works')} className="hover:text-primary transition-colors leading-none text-left" style={{ color: 'var(--text-main)' }}>How It Works</button></li>
                <li><button onClick={() => handleHashLink('#testimonials')} className="hover:text-primary transition-colors leading-none text-left" style={{ color: 'var(--text-main)' }}>Reviews</button></li>
                <li><Link to="/join" className="hover:text-primary transition-colors leading-none" style={{ color: 'var(--text-main)' }}>Enter PIN</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-secondary">Quick Links</h4>
              <ul className="space-y-2 text-xs font-semibold">
                {token ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><LayoutDashboard className="h-3.5 w-3.5 text-primary shrink-0" />Dashboard</Link></li>
                    <li><Link to="/quiz/my" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><BookOpen className="h-3.5 w-3.5 text-secondary shrink-0" />My Quizzes</Link></li>
                    <li><Link to="/quiz/create" className="hover:text-secondary transition-colors inline-flex items-center gap-1.5 py-0.5" style={{ color: 'var(--text-main)' }}><PlusCircle className="h-3.5 w-3.5 text-accent shrink-0" />Create Quiz</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Login</Link></li>
                    <li><Link to="/register" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Sign Up</Link></li>
                    <li><Link to="/forgot-password" className="hover:text-secondary transition-colors block py-0.5" style={{ color: 'var(--text-main)' }}>Reset Password</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar (shared) — always left-aligned column on mobile, row on desktop ── */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          <span className="text-left">
            © {new Date().getFullYear()} Fourise Quiz Hub. All rights reserved.
          </span>
          {/* Dots appear BEFORE each policy item, all left-aligned */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }} className="sm:flex-row sm:items-center sm:gap-3">
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">
              <span className="opacity-40 mr-1.5">•</span>Privacy Policy
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">
              <span className="opacity-40 mr-1.5">•</span>Terms of Service
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">
              <span className="opacity-40 mr-1.5">•</span>Security
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
