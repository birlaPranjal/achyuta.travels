'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut, SessionContextValue } from 'next-auth/react';

// Define the FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

// Define the travel preferences interface
interface TravelPreference {
  accommodationType: string[];
  budget: string;
  travelStyle: string[];
  interests: string[];
  dietaryRestrictions: string[];
}

// Define the profile interface
interface Profile {
  bio?: string;
  travelPreferences?: TravelPreference;
  faqs?: FAQ[];
}

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  profile?: Profile;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status }: SessionContextValue = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle session changes
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
        profile: (session.user).profile || {
          bio: '',
          travelPreferences: {
            accommodationType: [],
            budget: 'mid-range',
            travelStyle: [],
            interests: [],
            dietaryRestrictions: [],
          },
          faqs: [],
        },
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Don't navigate here - let the session change trigger navigation via middleware
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      // Auto login after successful registration
      await login(email, password);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      // Let the session change trigger navigation
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      // For Google login, we need to use redirect
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading: loading || status === 'loading',
    error,
    login,
    register,
    logout,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 