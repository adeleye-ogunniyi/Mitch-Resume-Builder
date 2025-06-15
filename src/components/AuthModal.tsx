import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
import { useToast } from './ui/useToast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, confirmEmail, resendConfirmation } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setShowEmailConfirmation(true);
        toast({
          title: 'Check your email',
          description: 'We\'ve sent you a 6-digit confirmation code.',
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        onClose();
        resetForm();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
        setShowEmailConfirmation(true);
        toast({
          title: 'Email not verified',
          description: 'Please enter the 6-digit code sent to your email.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('Invalid login credentials')) {
        toast({
          title: 'Invalid credentials',
          description: 'Please check your email and password and try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationCode || confirmationCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a valid 6-digit confirmation code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await confirmEmail(email, confirmationCode);
      toast({
        title: 'Email confirmed!',
        description: 'Your account has been verified. You can now sign in.',
      });
      setShowEmailConfirmation(false);
      setIsSignUp(false);
      setConfirmationCode('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: 'Confirmation failed',
        description: errorMessage.includes('expired') 
          ? 'The confirmation code has expired. Please request a new one.'
          : 'Invalid confirmation code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await resendConfirmation(email);
      toast({
        title: 'Code sent',
        description: 'A new confirmation code has been sent to your email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend confirmation code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmationCode('');
    setShowEmailConfirmation(false);
    setIsSignUp(false);
  };

  const handleBackToSignIn = () => {
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {showEmailConfirmation ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Confirm your email
            </h2>
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-2 text-center">
                Enter the 6-digit code sent to:
              </p>
              <p className="font-medium text-slate-900 mb-4 text-center">{email}</p>
            </div>

            <form onSubmit={handleConfirmEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || confirmationCode.length !== 6}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Confirming...' : 'Confirm Email'}
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <button
                onClick={handleResendCode}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Resend code
              </button>
              <div>
                <button
                  onClick={handleBackToSignIn}
                  className="text-sm text-slate-600 hover:text-slate-800"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-sm text-slate-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;