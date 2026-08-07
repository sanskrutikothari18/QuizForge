import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, LayoutDashboard, LogOut, LogIn, User, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const { themeMode, toggleThemeMode } = useTheme();
  const isLight = themeMode === 'light';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll position for active section highlighting & navbar blur depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'features', 'pricing', 'how-it-works', 'faq'];
      const scrollPos = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: 'Home', hash: '#hero' },
    { label: 'Features', hash: '#features' },
    { label: 'Pricing', hash: '#pricing' },
    { label: 'How It Works', hash: '#how-it-works' },
    { label: 'FAQs', hash: '#faq' },
  ];

  const handleNavClick = (hash) => {
    closeMobile();
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
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl shadow-md transition-all duration-300"
      style={{
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 10, 15, 0.96)',
        borderColor: isLight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.10)'
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Leftmost */}
        <Link to="/" className="flex items-center gap-2.5 transition-transform active:scale-95 shrink-0" onClick={closeMobile}>
          <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="font-outfit text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
            Fourise <span className="text-secondary">Quiz Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {token ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-primary" style={{ color: 'var(--text-main)' }}>
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <Link to="/quiz/my" className="flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-secondary" style={{ color: 'var(--text-main)' }}>
                <BookOpen className="h-4 w-4 text-secondary" />
                My Quizzes
              </Link>
              <Link to="/quiz/create" className="flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-accent" style={{ color: 'var(--text-main)' }}>
                <PlusCircle className="h-4 w-4 text-accent" />
                Create Quiz
              </Link>
            </>
          ) : (
            navLinks.map((link) => {
              const secId = link.hash.replace('#', '');
              const isActive = activeSection === secId;

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.hash)}
                  className={`text-sm font-extrabold transition-all cursor-pointer relative py-1 ${
                    isActive ? 'text-primary' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  )}
                </button>
              );
            })
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="rounded-xl p-2 sm:p-2.5 border transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center"
            style={{
              background: isLight ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.05)',
              borderColor: isLight ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.10)',
              color: isLight ? '#6d28d9' : '#d1d5db',
            }}
            aria-label="Toggle Theme"
          >
            {isLight ? (
              <Moon className="h-4 w-4" style={{ color: '#6d28d9' }} />
            ) : (
              <Sun className="h-4 w-4 text-yellow-400" />
            )}
          </button>

          {token ? (
            <div className="hidden md:flex items-center gap-3">
              {/* Profile Badge */}
              <div
                className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{
                  background: isLight ? 'rgba(139,92,246,0.07)' : 'rgba(255,255,255,0.05)',
                  border: isLight ? '1px solid rgba(139,92,246,0.14)' : '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <User className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>{user?.name}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-premium flex items-center gap-2 px-4 py-2 text-sm rounded-xl text-white cursor-pointer"
                style={{ fontWeight: 900, backgroundColor: '#dc2626', border: '2px solid #dc2626' }}
              >
                <LogOut className="h-4 w-4" />
                <span style={{ fontWeight: 900 }}>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {/* Outline Login Button */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 text-white text-sm font-extrabold transition-all hover:bg-white/10"
              >
                Login
              </Link>
              
              {/* Primary Gradient Get Started Button */}
              <Link
                to="/register"
                className="btn-premium btn-primary-gradient px-5 py-2 text-sm font-extrabold text-white rounded-xl shadow-premium-glow flex items-center gap-1.5 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-xl border transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.10)',
              color: 'var(--text-main)',
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-white/5 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200"
          style={{ background: 'var(--header-bg)', backdropFilter: 'blur(16px)' }}
        >
          {token ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <User className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-xs font-bold truncate" style={{ color: 'var(--text-main)' }}>{user?.name}</span>
              </div>

              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-main)' }}
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <Link
                to="/quiz/my"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-main)' }}
              >
                <BookOpen className="h-4 w-4 text-secondary" />
                My Quizzes
              </Link>
              <Link
                to="/quiz/create"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-main)' }}
              >
                <PlusCircle className="h-4 w-4 text-accent" />
                Create Quiz
              </Link>
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.hash)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              <div className="flex flex-col gap-2.5 pt-3 border-t border-white/5">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="w-full text-center py-3 rounded-xl border border-white/20 text-white text-sm font-extrabold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="btn-premium btn-primary-gradient w-full text-center py-3 text-sm font-extrabold text-white rounded-xl shadow-premium-glow flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
