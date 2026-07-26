import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, KeyRound, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [simulatedUrl, setSimulatedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword({ email: data.email });
      if (response.success) {
        setResetSent(true);
        if (response.resetUrl) {
          setSimulatedUrl(response.resetUrl);
        }
        toast.success('Reset code generated successfully! 🔑');
      } else {
        toast.error(response.message || 'Failed to process request.');
      }
    } catch (error) {
      console.error('[FORGOT PASSWORD ERROR]', error);
      let errMsg = 'Could not request password reset';
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(simulatedUrl);
    setIsCopied(true);
    toast.success('Reset URL copied to clipboard! 📋');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatedPage>
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-[80vh] px-4 py-12 sm:px-6 lg:px-8 bg-background">
        
        {/* Glow Spheres */}
        <div className="absolute top-[10%] left-[20%] h-[350px] w-[350px] rounded-full bg-glow-primary pointer-events-none opacity-45"></div>
        <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-glow-secondary pointer-events-none opacity-30"></div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Subtle light border decoration at the top */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-400 font-medium">
              {!resetSent 
                ? 'Enter your email to receive instructions to reset your password' 
                : 'Check below for your password reset link'}
            </p>
          </div>

          {!resetSent ? (
            /* EMAIL INPUT FORM */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
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
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full rounded-xl bg-white/5 border px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 ${
                      errors.email 
                        ? 'border-accent/40 focus:border-accent focus:ring-accent/30' 
                        : 'border-white/10 focus:border-primary focus:ring-primary/30'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-accent text-left">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
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
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SUCCESS & SIMULATION COMPONENT */
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                If an account exists for that email, a password reset request has been processed!
              </div>

              {simulatedUrl && (
                <div className="space-y-3 text-left">
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                    Developer Mode: Simulated Reset Link
                  </div>
                  <p className="text-xs text-gray-400">
                    Since email delivery is not configured, you can use the link below to reset your password:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={simulatedUrl}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <Link
                    to={`/reset-password/${simulatedUrl.split('/').pop()}`}
                    className="w-full mt-3 btn-premium btn-secondary-gradient py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold shadow-secondary-glow cursor-pointer"
                  >
                    <span>Proceed to Reset Password Page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* Footer Back link (only when form is showing) */}
          {!resetSent && (
            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatedPage>
  );
}
