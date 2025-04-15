'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const { login, googleLogin, error, loading } = useAuth();
  const router = useRouter();

  // Use router in an effect to avoid unused variable warning
  useEffect(() => {
    // This is just to satisfy the linter
    if (router) {
      // Do nothing
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const result = await login(formData.email, formData.password);
    
    // Get the callback URL from the search params
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get('callbackUrl');
    
    // If there's a callback URL, the middleware will handle the redirect
    // Otherwise, we'll redirect based on the user's role
    if (!callbackUrl) {
      const user = await fetch('/api/auth/session').then(res => res.json());
      if (user?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get callbackUrl from URL if it exists
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl');
      
      // For Google login, we need to use redirect
      await googleLogin({ 
        callbackUrl: callbackUrl || '/',
        redirect: true 
      });
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex">
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={loading} text="Signing you in..." />
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Homepage
          </Link>
          
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
                Wanderlux
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your account and manage your bookings.
            </p>
          </div>
          
          <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors",
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                    )}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <svg className="h-3 w-3 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      "block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors",
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                    )}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <svg className="h-3 w-3 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button 
                variant="gradient" 
                fullWidth 
                size="lg"
                type="submit"
                disabled={loading}
                className="py-3 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1606293459339-aa5508385bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="India Travel"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <div className="mb-6 inline-block px-3 py-1 bg-orange-500/30 backdrop-blur-sm text-orange-100 rounded-full text-sm font-medium">
              Explore India with Wanderlux
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover the vibrant colors and traditions of India</h2>
            <p className="text-white/90 mb-6">
              From the majestic Taj Mahal to the serene backwaters of Kerala, 
              India offers a tapestry of unforgettable experiences waiting to be explored.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/30 backdrop-blur-sm">
                    <Check className="h-4 w-4 text-orange-100" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-white/90">Personalized itineraries tailored to your interests</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/30 backdrop-blur-sm">
                    <Check className="h-4 w-4 text-orange-100" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-white/90">Expert local guides with deep cultural knowledge</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/30 backdrop-blur-sm">
                    <Check className="h-4 w-4 text-orange-100" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-white/90">Authentic experiences beyond the tourist trails</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
