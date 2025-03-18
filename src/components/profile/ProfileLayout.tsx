'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface ProfileLayoutProps {
  children: ReactNode;
  title: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, title }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    // Will redirect in the useEffect
    return null;
  }

  // Convert MongoDB ObjectId timestamp to Date
  // MongoDB ObjectId first 4 bytes represent a timestamp in seconds
  const getCreationDate = (id: string) => {
    // Extract first 8 characters (4 bytes) from the hex string
    const timestampHex = id.substring(0, 8);
    // Convert hex to decimal and multiply by 1000 to get milliseconds
    const timestampMs = parseInt(timestampHex, 16) * 1000;
    return new Date(timestampMs);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          
          {/* Profile header with image */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 relative">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-orange-50">
                      <UserIcon className="h-16 w-16 text-orange-300" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {getCreationDate(user.id).toLocaleDateString()}
                </p>
                
                <div className="mt-4 flex space-x-4">
                  <Link 
                    href="/profile" 
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                  >
                    Edit Profile
                  </Link>
                  <Link 
                    href="/profile/bookings" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-500"
                  >
                    My Bookings
                  </Link>
                  <Link 
                    href="/profile/wishlist" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-500"
                  >
                    Wishlist
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 