import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, KeyRound, Lock, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { forgotPassword, verifyOtp, resetPassword } from '../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step state: 1 = Enter Email, 2 = Verify 4-Digit OTP, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // 4-Digit OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Form for Step 1 (Email)
  const emailForm = useForm({
    defaultValues: { email: '' }
  });

  // Form for Step 3 (Password Reset)
  const passwordForm = useForm({
    defaultValues: { password: '', confirmPassword: '' }
  });

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input when reaching step 2
  useEffect(() => {
    if (step === 2 && otpInputsRef[0].current) {
      setTimeout(() => {
        otpInputsRef[0].current?.focus();
      }, 100);
    }
  }, [step]);

  // Password strength meter logic
  const watchPassword = passwordForm.watch('password');
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'bg-white/10' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 2:
        return { score, label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' };
      case 3:
        return { score, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
      case 4:
        return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
      default:
        return { score: 0, label: 'None', color: 'bg-white/10', text: 'text-gray-500' };
    }
  };
  const strength = getPasswordStrength(watchPassword);

  // STEP 1: Request OTP
  const handleEmailSubmit = async (data) => {
    setIsLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const response = await forgotPassword({ email });
      if (response.success) {
        setUserEmail(email);
        if (response.devOtp) {
          setDevOtpCode(response.devOtp);
        }
        setStep(2);
        setResendCooldown(30);
        toast.success('4-digit OTP sent to your email! 📧');
      } else {
        toast.error(response.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('[FORGOT PASSWORD ERROR]', error);
      const errMsg = error.response?.data?.message || error.message || 'Could not request password reset';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !userEmail) return;
    setIsLoading(true);
    try {
      const response = await forgotPassword({ email: userEmail });
      if (response.success) {
        if (response.devOtp) {
          setDevOtpCode(response.devOtp);
        }
        setResendCooldown(30);
        setOtpDigits(['', '', '', '']);
        toast.success('A new 4-digit OTP has been sent! 📧');
        if (otpInputsRef[0].current) {
          otpInputsRef[0].current.focus();
        }
      } else {
        toast.error(response.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Digit Change Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    
    // Handle paste of full 4-digit code
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 4).split('');
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pastedDigits[i] || '';
      }
      setOtpDigits(newOtp);
      const nextFocus = Math.min(pastedDigits.length, 3);
      otpInputsRef[nextFocus].current?.focus();
      return;
    }

    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-advance to next box if digit entered
    if (value && index < 3) {
      otpInputsRef[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef[index - 1].current?.focus();
    }
  };

  // STEP 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otpDigits.join('');
    if (otpString.length !== 4) {
      toast.error('Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp({ email: userEmail, otp: otpString });
      if (response.success) {
        toast.success('OTP verified! Please set your new password.');
        setStep(3);
      } else {
        toast.error(response.message || 'Invalid OTP code.');
      }
    } catch (error) {
      console.error('[VERIFY OTP ERROR]', error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handlePasswordResetSubmit = async (data) => {
    const otpString = otpDigits.join('');
    setIsLoading(true);
    try {
      const response = await resetPassword({
        email: userEmail,
        otp: otpString,
        password: data.password,
      });

      if (response.success) {
        setIsResetComplete(true);
        toast.success('Password updated successfully in database! 🎉');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      } else {
        toast.error(response.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('[RESET PASSWORD ERROR]', error);
      const errMsg = error.response?.data?.message || 'Password reset failed';
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

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          {/* Subtle light border decoration at the top */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          {/* Success Overlay Animation */}
          {isResetComplete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#09090b]/95 z-20 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.2 }}
                className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(34,197,94,0.5)] mb-4"
              >
                <Check className="h-8 w-8 stroke-[3]" />
              </motion.div>
              <h3 className="font-outfit text-2xl font-bold text-white mb-2">Password Reset Successful!</h3>
              <p className="text-sm text-gray-400 max-w-[280px] leading-relaxed">
                Your new password is saved in the database. Redirecting to login...
              </p>
            </motion.div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary mb-4">
              {step === 1 && <KeyRound className="h-6 w-6" />}
              {step === 2 && <Mail className="h-6 w-6" />}
              {step === 3 && <Lock className="h-6 w-6 text-secondary" />}
            </div>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Enter 4-Digit OTP'}
              {step === 3 && 'Set New Password'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-medium">
              {step === 1 && 'Enter your email to receive a 4-digit verification OTP code'}
              {step === 2 && `We sent a 4-digit code to ${userEmail || 'your email'}`}
              {step === 3 && 'Create and confirm your new account password'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${
              step >= 1 ? 'bg-primary text-white shadow-[0_0_12px_rgba(109,40,217,0.5)]' : 'bg-white/10 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-0.5 mx-2 transition-all ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${
              step >= 2 ? 'bg-primary text-white shadow-[0_0_12px_rgba(109,40,217,0.5)]' : 'bg-white/10 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-0.5 mx-2 transition-all ${step >= 3 ? 'bg-secondary' : 'bg-white/10'}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${
              step >= 3 ? 'bg-secondary text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]' : 'bg-white/10 text-gray-400'
            }`}>
              3
            </div>
          </div>

          {/* Dev Mode Notification Banner if email service is fallback */}
          {devOtpCode && step === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left"
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span>Dev / Testing Quick Access</span>
              </div>
              <p className="text-gray-300 mb-2">
                Your 4-digit OTP is: <strong className="text-amber-300 tracking-widest text-sm bg-black/40 px-2 py-0.5 rounded font-mono">{devOtpCode}</strong>
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL INPUT FORM */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                    Registered Email Address
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
                    <>
                      <span>Send 4-Digit OTP</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* STEP 2: 4-DIGIT OTP VERIFICATION FORM */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-center">
                    Enter 4-Digit Security Code
                  </label>
                  
                  {/* 4 Digit Boxes */}
                  <div className="flex justify-center gap-3 sm:gap-4 my-4">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputsRef[idx]}
                        type="text"
                        maxLength={4}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white/5 border border-white/15 text-center text-2xl font-bold font-mono text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-white transition-colors underline cursor-pointer"
                    >
                      Change Email
                    </button>
                    
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                        resendCooldown > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-primary hover:text-primary-light'
                      }`}
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>
                        {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend OTP'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length !== 4}
                  className={`w-full btn-premium btn-primary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow cursor-pointer ${
                    isLoading || otpDigits.join('').length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5" />
                      <span>Verify OTP & Continue</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* STEP 3: NEW PASSWORD FORM */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={passwordForm.handleSubmit(handlePasswordResetSubmit)}
                className="space-y-6"
              >
                {/* New Password Field */}
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
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                        passwordForm.formState.errors.password 
                          ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                          : 'border-white/10 focus:border-primary focus:ring-primary/30'
                      }`}
                    />
                  </div>

                  {/* Security Index Meter */}
                  {watchPassword && (
                    <div className="mt-2.5 space-y-1.5 text-left">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-gray-500">Security Index:</span>
                        <span className={strength.text}>{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
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

                  {passwordForm.formState.errors.password && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{passwordForm.formState.errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-left">
                    Confirm New Password
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
                        validate: (val) => val === watchPassword || 'Passwords do not match',
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full btn-premium btn-secondary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-secondary-glow cursor-pointer ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Updating Database...</span>
                    </div>
                  ) : (
                    <>
                      <span>Reset & Update Password</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Back link */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>

        </motion.div>
      </div>
    </AnimatedPage>
  );
}
