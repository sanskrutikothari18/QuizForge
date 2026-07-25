import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, KeyRound, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { forgotPassword, verifyOtp, resetPassword } from '../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm({ defaultValues: { email: '' } });
  const passwordForm = useForm({ defaultValues: { password: '', confirmPassword: '' } });
  const newPassword = passwordForm.watch('password');

  const handleSendOtp = async (data) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(data.email);
      if (response.success) {
        setEmail(data.email);
        setStep('otp');
        toast.success(response.message || 'OTP sent to your email!');
        if (response.devOtp) {
          setDevOtp(response.devOtp);
        }
      } else {
        toast.error(response.message || 'Failed to send OTP.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      if (response.success) {
        toast.success('OTP verified!');
        setStep('password');
      } else {
        toast.error(response.message || 'Invalid OTP.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setIsLoading(true);
    try {
      const response = await resetPassword(email, otp, data.password);
      if (response.success) {
        setStep('success');
        toast.success(response.message || 'Password reset successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(response.message || 'Failed to reset password.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
  };

  const stepConfig = {
    email: {
      icon: KeyRound,
      title: 'Forgot Password?',
      subtitle: 'Enter your email to receive a 4-digit OTP',
    },
    otp: {
      icon: ShieldCheck,
      title: 'Enter OTP',
      subtitle: `We sent a 4-digit code to ${email}`,
    },
    password: {
      icon: Lock,
      title: 'Reset Password',
      subtitle: 'Create a new password for your account',
    },
    success: {
      icon: CheckCircle,
      title: 'Password Reset!',
      subtitle: 'Your password has been updated successfully',
    },
  };

  const { icon: StepIcon, title, subtitle } = stepConfig[step];

  return (
    <AnimatedPage>
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 relative overflow-hidden bg-background">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[480px] glass-panel rounded-3xl border border-white/5 p-8 relative z-10 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 mb-4 ${step === 'success' ? 'text-green-400' : 'text-primary'}`}>
              <StepIcon className="h-6 w-6" />
            </div>
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-400 font-medium">{subtitle}</p>
          </div>

          {/* Step indicators */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {['email', 'otp', 'password'].map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    ['email', 'otp', 'password'].indexOf(step) >= i
                      ? 'w-8 bg-primary'
                      : 'w-4 bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-6">
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
                    {...emailForm.register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      emailForm.formState.errors.email
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{emailForm.formState.errors.email.message}</span>
                  </div>
                )}
              </div>

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
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                  4-Digit OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="0000"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder-gray-600 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
                <p className="text-xs text-gray-500 text-center">Enter the 4-digit code sent to your Gmail</p>
              </div>

              {devOtp && (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-left space-y-1">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                    [DEV MODE] Your OTP:
                  </span>
                  <span className="text-2xl font-bold tracking-widest text-secondary">{devOtp}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 4}
                className={`w-full btn-premium btn-primary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow cursor-pointer ${
                  isLoading || otp.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setDevOtp('');
                }}
                className="w-full text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Didn&apos;t receive OTP? Try again
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                  New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      passwordForm.formState.errors.password
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {passwordForm.formState.errors.password && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{passwordForm.formState.errors.password.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      passwordForm.formState.errors.confirmPassword
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{passwordForm.formState.errors.confirmPassword.message}</span>
                  </div>
                )}
              </div>

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
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 text-center">
              Redirecting you to the Sign In page...
            </div>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
