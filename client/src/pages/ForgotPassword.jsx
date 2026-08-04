import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, KeyRound, Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { forgotPassword, verifySecurityAnswer, resetPassword } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPassword() {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // Forms for each step
  const emailForm = useForm({ defaultValues: { email: initialEmail } });
  const answerForm = useForm({ defaultValues: { answer: '' } });
  const passwordForm = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } });

  // Password strength helper
  const watchNewPassword = passwordForm.watch('newPassword');
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'bg-white/10' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1: return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 2: return { score, label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' };
      case 3: return { score, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
      case 4: return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
      default: return { score: 0, label: 'None', color: 'bg-white/10', text: 'text-gray-500' };
    }
  };
  const strength = getPasswordStrength(watchNewPassword);

  // STEP 1: Handle Email Submit
  const onEmailSubmit = async (data) => {
    setIsLoading(true);
    try {
      const emailVal = data.email.trim().toLowerCase();
      const response = await forgotPassword({ email: emailVal });
      if (response.success && response.securityQuestion) {
        setUserEmail(emailVal);
        setSecurityQuestion(response.securityQuestion);
        setStep(2);
        toast.success('Security question retrieved!');
      } else {
        toast.error(response.message || 'No account found with this email.');
      }
    } catch (error) {
      console.error('[FORGOT PASSWORD ERROR]', error);
      toast.error(error.response?.data?.message || 'Could not find account');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Handle Security Answer Submit
  const onAnswerSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await verifySecurityAnswer({ email: userEmail, answer: data.answer });
      if (response.success && response.resetToken) {
        setResetToken(response.resetToken);
        setStep(3);
        toast.success('Answer verified!');
      }
    } catch (error) {
      console.error('[VERIFY ANSWER ERROR]', error);
      if (error.response?.data?.remainingAttempts !== undefined) {
        setRemainingAttempts(error.response.data.remainingAttempts);
      }
      toast.error(error.response?.data?.message || 'Incorrect answer');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Handle Password Reset Submit
  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await resetPassword({
        email: userEmail,
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      if (response.success) {
        setIsResetComplete(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('[RESET PASSWORD ERROR]', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
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

        {/* Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          {/* Success Overlay */}
          {isResetComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-green-500/20 text-green-500 border border-green-500/30 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h3 className={`font-outfit text-2xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Password Reset Successful!
              </h3>
              <p className={`text-sm max-w-[280px] ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Your password has been updated. Redirecting to login page...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary mb-4">
                  {step === 1 && <KeyRound className="h-6 w-6" />}
                  {step === 2 && <ShieldCheck className="h-6 w-6" />}
                  {step === 3 && <Lock className="h-6 w-6 text-secondary" />}
                </div>
                <h2 className={`font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {step === 1 && 'Forgot Password'}
                  {step === 2 && 'Security Verification'}
                  {step === 3 && 'Set New Password'}
                </h2>
                <p className={`mt-2 text-xs sm:text-sm font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step === 1 && 'Enter your email address to start account recovery'}
                  {step === 2 && 'Answer your security question to verify identity'}
                  {step === 3 && 'Choose a new password for your account'}
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

              <AnimatePresence mode="wait">
                {/* STEP 1: EMAIL FORM */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider block text-left ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
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
                          className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${
                            isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          } ${
                            emailForm.formState.errors.email 
                              ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                              : 'focus:border-primary focus:ring-primary/30'
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
                          <span>Finding account...</span>
                        </div>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* STEP 2: SECURITY QUESTION FORM */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={answerForm.handleSubmit(onAnswerSubmit)}
                    className="space-y-6"
                  >
                    <div className={`p-4 rounded-2xl border text-sm font-semibold mb-4 text-center ${isLight ? 'bg-secondary/10 border-secondary/30 text-gray-900' : 'bg-secondary/10 border-secondary/20 text-secondary'}`}>
                      {securityQuestion || 'What is your security answer?'}
                    </div>

                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider block text-left ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
                        Your Answer
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                          <ShieldCheck className="h-4.5 w-4.5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Type your answer"
                          {...answerForm.register('answer', {
                            required: 'Security answer is required',
                          })}
                          className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${
                            isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          } ${
                            answerForm.formState.errors.answer 
                              ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                              : 'focus:border-primary focus:ring-primary/30'
                          }`}
                        />
                      </div>
                      {answerForm.formState.errors.answer && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{answerForm.formState.errors.answer.message}</span>
                        </div>
                      )}
                      {remainingAttempts !== null && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{remainingAttempts} attempts remaining</span>
                        </div>
                      )}
                    </div>

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
                          <span>Verifying answer...</span>
                        </div>
                      ) : (
                        <>
                          <span>Submit Answer</span>
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* STEP 3: RESET PASSWORD FORM */}
                {step === 3 && (
                  <motion.form
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    {/* New Password */}
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider block text-left ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
                        New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                          <Lock className="h-4.5 w-4.5" />
                        </div>
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...passwordForm.register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters',
                            },
                          })}
                          className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${
                            isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          } ${
                            passwordForm.formState.errors.newPassword 
                              ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                              : 'focus:border-primary focus:ring-primary/30'
                          }`}
                        />
                      </div>

                      {/* Strength indicator */}
                      {watchNewPassword && (
                        <div className="mt-2.5 space-y-1.5 text-left">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-gray-400">Password Strength:</span>
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

                      {passwordForm.formState.errors.newPassword && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{passwordForm.formState.errors.newPassword.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider block text-left ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
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
                            validate: (val) => val === watchNewPassword || 'Passwords do not match',
                          })}
                          className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${
                            isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          } ${
                            passwordForm.formState.errors.confirmPassword 
                              ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                              : 'focus:border-primary focus:ring-primary/30'
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
                      className={`w-full btn-premium btn-secondary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-secondary-glow cursor-pointer ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Updating password...</span>
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
                  className={`inline-flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </AnimatedPage>
  );
}
