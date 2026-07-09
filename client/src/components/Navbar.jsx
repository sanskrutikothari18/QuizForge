import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, PlusCircle, LayoutDashboard, LogOut, LogIn, User, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-transform active:scale-95">
          <Logo className="h-10 w-10" />
          <span className="font-outfit text-xl font-bold tracking-tight text-white">
            Fourise <span className="text-secondary">Quiz Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {token ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <Link to="/quiz/my" className="flex items-center gap-1.5 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                <Award className="h-4 w-4 text-secondary" />
                My Quizzes
              </Link>
              <Link to="/quiz/create" className="flex items-center gap-1.5 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                <PlusCircle className="h-4 w-4 text-accent" />
                Create Quiz
              </Link>
            </>
          ) : (
            <Link to="/#features" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center mr-1"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4.5 w-4.5 text-primary" />
            ) : (
              <Sun className="h-4.5 w-4.5 text-yellow-400" />
            )}
          </button>

          {token ? (
            <div className="flex items-center gap-3">
              {/* Profile Badge */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                <User className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold text-gray-200">{user?.name}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-premium flex items-center gap-2 px-4 py-2 text-sm rounded-xl text-white"
                style={{ fontWeight: 900, backgroundColor: '#dc2626', border: '2px solid #dc2626' }}
              >
                <LogOut className="h-4 w-4" />
                <span style={{ fontWeight: 900 }}>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-premium flex items-center gap-2 text-white px-5 py-2.5 text-sm font-extrabold tracking-wide shadow-md"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="btn-premium flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2.5 text-sm font-extrabold tracking-wide shadow-premium-glow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
