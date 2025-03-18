'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import { Heart, MapPin, Star, Calendar, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';

// Sample wishlist data - in a real app, this would come from an API
const sampleWishlist = [
  {
    id: 'wl1',
    title: 'Taj Mahal Sunrise Tour',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Agra, Uttar Pradesh',
    rating: 4.9,
    reviewCount: 128,
    price: 89,
    duration: '4 hours',
  },
  {
    id: 'wl2',
    title: 'Goa Beach Retreat',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Goa',
    rating: 4.7,
    reviewCount: 94,
    price: 599,
    duration: '3 days',
  },
  {
    id: 'wl3',
    title: 'Himalayan Trekking Adventure',
    image: 'https://images.unsplash.com/photo-1626016752441-a1955cffc280?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Himachal Pradesh',
    rating: 4.8,
    reviewCount: 76,
    price: 349,
    duration: '5 days',
  },
  {
    id: 'wl4',
    title: 'Rajasthan Desert Safari',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Jaisalmer, Rajasthan',
    rating: 4.6,
    reviewCount: 112,
    price: 199,
    duration: '2 days',
  },
];

const WishlistPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return null; // Will be handled by ProfileLayout
  }
  
  return (
    <ProfileLayout title="My Wishlist">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Saved Experiences</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="all">All Items</option>
              <option value="tours">Tours</option>
              <option value="hotels">Hotels</option>
              <option value="activities">Activities</option>
            </select>
          </div>
        </div>
        
        {sampleWishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save your favorite experiences to plan your perfect trip to India</p>
            <Button variant="primary" href="/destinations">
              Explore Destinations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleWishlist.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {item.location}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="font-medium">{item.rating}</span>
                      <span className="mx-1">·</span>
                      <span>{item.reviewCount} reviews</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {item.duration}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">
                      ${item.price}
                      <span className="text-sm font-normal text-gray-600 ml-1">
                        {item.duration.includes('days') ? '/person' : ''}
                      </span>
                    </div>
                    
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default WishlistPage; 