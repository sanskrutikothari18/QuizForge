import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, AlertCircle, Check, Briefcase, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import Logo from '../components/Logo';
import { register as registerUser } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      designation: 'Professor',
      email: '',
      password: '',
      confirmPassword: '',
      securityQuestion: '',
      securityAnswer: '',
    },
  });

  const watchPassword = watch('password');

  // Password strength meter
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'bg-white/10', text: 'text-gray-500' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
      case 2:
        return { score, label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-400' };
      case 3:
        return { score, label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
      case 4:
        return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
      default:
        return { score: 0, label: 'None', color: 'bg-white/10', text: 'text-gray-500' };
    }
  };

  const strength = getPasswordStrength(watchPassword);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await registerUser({
        name: data.name ? data.name.trim() : '',
        designation: data.designation,
        email: data.email ? data.email.trim() : '',
        password: data.password,
        securityQuestion: data.securityQuestion,
        securityAnswer: data.securityAnswer ? data.securityAnswer.trim().toLowerCase() : '',
      });

      if (response.success) {
        setIsRegistered(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success(`Welcome to Quiz Hub, ${response.user.name || 'User'}!`);

        setTimeout(() => {
          navigate('/dashboard', {
            state: { welcomeMsg: `Welcome to Quiz Hub, ${response.user.name || 'User'}!` },
            replace: true,
          });
        }, 1200);
      } else {
        toast.error(response.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('[REGISTER ERROR]', error);
      let errMsg = 'Email already exists or invalid data';
      if (error.response) {
        errMsg = error.response.data?.message || errMsg;
      } else if (error.request) {
        errMsg = 'Connection failed. Please ensure backend server is running.';
      } else {
        errMsg = error.message || errMsg;
      }
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="relative min-h-[85vh] flex items-center justify-center px-3 py-6 sm:py-10 lg:px-8 bg-background overflow-hidden w-full">
        
        {/* Glow Spheres */}
        <div className="absolute top-[15%] left-[25%] h-[350px] w-[350px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[25%] h-[400px] w-[400px] rounded-full bg-secondary/15 blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl mx-auto">
          
          {/* Main Clean Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-2xl border border-white/15"
          >
            {/* Top Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary via-primary to-accent" />

            {/* Success Overlay Animation */}
            {isRegistered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#09090b]/95 z-20 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.1 }}
                  className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] mb-3"
                >
                  <Check className="h-8 w-8 stroke-[3]" />
                </motion.div>
                <h3 className="font-outfit text-2xl font-black text-white mb-1">Welcome Aboard!</h3>
                <p className="text-xs text-emerald-400 font-bold">
                  Your account has been created. Redirecting to dashboard...
                </p>
              </motion.div>
            )}

            {/* Header with Logo */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Logo className="h-9 w-9 shrink-0" />
                <span className="font-outfit text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                  Fourise <span className="text-secondary">Quiz Hub</span>
                </span>
              </div>
              <h2 className={`font-outfit text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Create Account
              </h2>
              <p className={`mt-1 text-xs sm:text-sm font-semibold ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Join Quiz Hub to host live games, manage questions & track real-time results
              </p>
            </div>

            {/* SIGNUP FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Row 1: Name / Nickname & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Name Field */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Your Name / Nickname
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Alex"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Min 2 characters',
                        },
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.name ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.name.message}</span>
                    </div>
                  )}
                </div>

                {/* Designation Field (NEW) */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Designation / Role
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <select
                      {...register('designation', {
                        required: 'Please select a designation',
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 text-xs font-medium transition-all focus:outline-none focus:ring-2 appearance-none ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.designation ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    >
                      <option value="Professor" className="bg-[#1e1840]">Professor / Educator</option>
                      <option value="Teacher" className="bg-[#1e1840]">Teacher / Instructor</option>
                      <option value="Manager" className="bg-[#1e1840]">Manager / Team Lead</option>
                      <option value="Student" className="bg-[#1e1840]">Student / Player</option>
                      <option value="Quiz Host" className="bg-[#1e1840]">Quiz Host / Trainer</option>
                      <option value="Other" className="bg-[#1e1840]">Other</option>
                    </select>
                  </div>
                  {errors.designation && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.designation.message}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Row 2: Email Address & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Email Field */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="host@quiz.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Valid email required',
                        },
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.email ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Min 6 characters',
                        },
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 pr-8 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.password ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {watchPassword && (
                    <div className="mt-1 space-y-0.5">
                      <div className="flex justify-between items-center text-[9px] font-extrabold uppercase">
                        <span className="text-gray-400">Security Index:</span>
                        <span className={strength.text}>{strength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                              strength.score >= i ? strength.color : 'bg-white/5'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Row 3: Confirm Password & Security Question */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Confirm Password Field */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        required: 'Confirm password required',
                        validate: (val) => val === watchPassword || 'Passwords do not match',
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 pr-8 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.confirmPassword ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.confirmPassword.message}</span>
                    </div>
                  )}
                </div>

                {/* Security Question Field */}
                <div className="space-y-1 text-left">
                  <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    Security Question
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <select
                      {...register('securityQuestion', {
                        required: 'Question required',
                      })}
                      className={`w-full rounded-xl border px-3 py-2.5 pl-9 text-xs font-medium transition-all focus:outline-none focus:ring-2 appearance-none ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-secondary/30 focus:border-secondary'
                          : 'bg-white/5 border-white/10 text-white focus:ring-secondary/40 focus:border-secondary'
                      } ${
                        errors.securityQuestion ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                      }`}
                    >
                      <option value="" disabled className="bg-[#1e1840]">Select a question</option>
                      <option value="What is your favourite colour?" className="bg-[#1e1840]">What is your favourite colour?</option>
                      <option value="What was your first school?" className="bg-[#1e1840]">What was your first school?</option>
                      <option value="What is your favourite food?" className="bg-[#1e1840]">What is your favourite food?</option>
                      <option value="What is your childhood nickname?" className="bg-[#1e1840]">What is your childhood nickname?</option>
                      <option value="What is your favourite teacher's name?" className="bg-[#1e1840]">What is your favourite teacher's name?</option>
                    </select>
                  </div>
                  {errors.securityQuestion && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.securityQuestion.message}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Security Answer Field */}
              <div className="space-y-1 text-left">
                <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                  Security Answer
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Your answer"
                    {...register('securityAnswer', {
                      required: 'Answer required',
                    })}
                    className={`w-full rounded-xl border px-3 py-2.5 pl-9 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-secondary/30 focus:border-secondary'
                        : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-secondary/40 focus:border-secondary'
                    } ${
                      errors.securityAnswer ? 'border-accent/60 focus:ring-accent/30 focus:border-accent' : ''
                    }`}
                  />
                </div>
                {errors.securityAnswer && (
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-accent font-bold">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.securityAnswer.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-premium btn-secondary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-white rounded-xl shadow-secondary-glow cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all mt-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Register Account</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-5 text-center border-t border-white/10 pt-4">
              <p className={`text-xs font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Already have an account?{' '}
                <Link to="/login" className="font-extrabold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </AnimatedPage>
  );
}
