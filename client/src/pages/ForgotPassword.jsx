import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, Lock, Check } from 'lucide-react';
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

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    defaultValues: { email: initialEmail },
  });

  const {
    register: registerAnswer,
    handleSubmit: handleSubmitAnswer,
    formState: { errors: errorsAnswer },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  const onEmailSubmit = async (data) => {
    setIsLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const response = await forgotPassword({ email });

      if (response.success) {
        setUserEmail(email);
        setSecurityQuestion(response.securityQuestion || '');
        setStep(2);
        toast.success('Security question ready.');
      } else {
        toast.error(response.message || 'No account found.');
      }
    } catch (error) {
      console.error('[FORGOT PASSWORD ERROR]', error);
      toast.error(error.response?.data?.message || 'Could not request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const onAnswerSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await verifySecurityAnswer({
        email: userEmail,
        answer: data.answer,
      });

      if (response.success) {
        setResetToken(response.resetToken);
        setRemainingAttempts(null);
        setStep(3);
        toast.success('Answer verified!');
      } else {
        toast.error(response.message || 'Could not verify answer');
        if (response.remainingAttempts !== undefined) {
          setRemainingAttempts(response.remainingAttempts);
        }
      }
    } catch (error) {
      console.error('[VERIFY ANSWER ERROR]', error);
      const errMsg = error.response?.data?.message || 'Could not verify answer';
      toast.error(errMsg);
      if (error.response?.data?.remainingAttempts !== undefined) {
        setRemainingAttempts(error.response.data.remainingAttempts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await resetPassword({
        email: userEmail,
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        setIsResetComplete(true);
        toast.success('Password updated successfully.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(response.message || 'Could not reset password');
      }
    } catch (error) {
      console.error('[RESET PASSWORD ERROR]', error);
      toast.error(error.response?.data?.message || 'Could not reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-[80vh] px-4 py-8 sm:py-12 sm:px-6 lg:px-8 bg-background">
        <div className="absolute top-[10%] left-[20%] h-[350px] w-[350px] rounded-full bg-glow-primary pointer-events-none opacity-45"></div>
        <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-glow-secondary pointer-events-none opacity-30"></div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

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
                Your new password has been saved. Redirecting to login...
              </p>
            </motion.div>
          )}

          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary mb-4">
              {step === 1 && <KeyRound className="h-6 w-6" />}
              {step === 2 && <ShieldCheck className="h-6 w-6" />}
              {step === 3 && <Lock className="h-6 w-6 text-secondary" />}
            </div>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify Security Answer'}
              {step === 3 && 'Set New Password'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-medium">
              {step === 1 && 'Enter your email to continue'}
              {step === 2 && `Answer your security question for ${userEmail || 'your account'}`}
              {step === 3 && 'Create a new password for your account'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitEmail(onEmailSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider block text-left text-gray-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      {...registerEmail('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                        } ${errorsEmail.email
                          ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                          : 'focus:border-primary focus:ring-primary/30'
                        }`}
                    />
                  </div>
                  {errorsEmail.email && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorsEmail.email.message}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full btn-premium btn-primary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitAnswer(onAnswerSubmit)}
                className="space-y-6"
              >
                <div className={`p-4 rounded-2xl border text-sm font-semibold mb-4 text-center ${isLight ? 'bg-secondary/10 border-secondary/30 text-gray-900' : 'bg-secondary/10 border-secondary/20 text-secondary'}`}>
                  {securityQuestion || 'Answer your security question'}
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
                      {...registerAnswer('answer', { required: 'Answer is required' })}
                      className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                        } ${errorsAnswer.answer
                          ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                          : 'focus:border-primary focus:ring-primary/30'
                        }`}
                    />
                  </div>
                  {errorsAnswer.answer && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorsAnswer.answer.message}</span>
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
                  className={`w-full btn-premium btn-secondary-gradient text-white py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-secondary-glow cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
                className="space-y-6"
              >
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
                      {...registerPassword('newPassword', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                        } ${errorsPassword.newPassword
                          ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                          : 'focus:border-primary focus:ring-primary/30'
                        }`}
                    />
                  </div>
                  {errorsPassword.newPassword && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorsPassword.newPassword.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wider block text-left ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === watchPassword('newPassword') || 'Passwords do not match',
                      })}
                      className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm transition-all focus:outline-none focus:ring-1 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                        } ${errorsPassword.confirmPassword
                          ? 'border-accent/40 focus:border-accent focus:ring-accent/30'
                          : 'focus:border-primary focus:ring-primary/30'
                        }`}
                    />
                  </div>
                  {errorsPassword.confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorsPassword.confirmPassword.message}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full btn-premium btn-primary-gradient py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Change Password</span>
                      <Check className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 text-xs font-semibold transition-colors ${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
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
