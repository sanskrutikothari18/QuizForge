import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, PlusCircle, LayoutDashboard, LogOut, LogIn, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <Link to="/quiz/my" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <Award className="h-4 w-4 text-secondary" />
                My Quizzes
              </Link>
              <Link to="/quiz/create" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <PlusCircle className="h-4 w-4 text-accent" />
                Create Quiz
              </Link>
            </>
          ) : (
            <Link to="/#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-4">
              {/* Profile Badge */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                <User className="h-4 w-4 text-secondary" />
                <span className="text-xs font-semibold text-gray-200">{user?.name}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-premium flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 px-4 py-2 text-xs font-semibold"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="btn-premium flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4.5 py-2 text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5 text-secondary" />
                Login
              </Link>
              <Link
                to="/register"
                className="btn-premium bg-gradient-to-r from-primary to-purple-600 text-white px-4.5 py-2 text-xs font-semibold shadow-premium-glow"
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
