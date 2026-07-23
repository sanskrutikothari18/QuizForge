import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const hostForm = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });


  const onHostSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success(`Welcome back, ${response.user.name}!`);
        
        // Wait briefly for toast to show, then redirect to Dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        toast.error(response.message || 'Login failed. Please check credentials.');
      }
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      let errMsg = 'Invalid email or password';
      if (error.response) {
        errMsg = error.response.data?.message || errMsg;
      } else if (error.request) {
        errMsg = 'Connection failed. Please ensure the backend server is running.';
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
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-[80vh] px-4 py-8 sm:py-12 sm:px-6 lg:px-8 bg-background">
        
        {/* Glow Spheres */}
        <div className="absolute top-[10%] left-[20%] h-[350px] w-[350px] rounded-full bg-glow-primary pointer-events-none opacity-45"></div>
        <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-glow-secondary pointer-events-none opacity-30"></div>

        {/* Login Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden"
        >
          {/* Subtle light border decoration at the top */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-white">
              Fourise Quiz Hub Entry
            </h2>
            <p className="mt-2 text-sm text-gray-400 font-medium">
              Log in as a host to manage quizzes
            </p>
          </div>

          {/* HOST LOGIN FORM */}
          <form onSubmit={hostForm.handleSubmit(onHostSubmit)} className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...hostForm.register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      hostForm.formState.errors.email 
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {hostForm.formState.errors.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{hostForm.formState.errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.error('Forgot password endpoint is not implemented on the server!')}
                    className="text-xs font-medium text-secondary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...hostForm.register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      hostForm.formState.errors.password 
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {hostForm.formState.errors.password && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{hostForm.formState.errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...hostForm.register('rememberMe')}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/30 focus:ring-offset-background"
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none">
                  Remember my session
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-premium btn-primary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow cursor-pointer ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Sign In as Host</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

          {/* Footer link */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-gray-400">
              New to Fourise Quiz Hub?{' '}
              <Link to="/register" className="font-semibold text-secondary hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatedPage>
  );
}
