import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../../../api/apiClient';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('forgot-password', { email });
      toast.success(response.data?.message || 'Password reset link sent successfully');
      onClose();
      setEmail('');
    } catch (error: any) {
      if (error.response?.status === 422 || error.response?.status === 404 || error.response?.status === 400) {
        toast.error('Email is not registered in the system');
      } else if (error.response?.data?.message && !error.response.data.message.includes('invalid')) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Email is not registered in the system');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-dark mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-brown" />
                </div>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green focus:border-green outline-none transition-all duration-200 bg-surface hover:bg-white focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-medium text-white bg-green hover:bg-green-dark rounded-xl transition-all duration-200 shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
