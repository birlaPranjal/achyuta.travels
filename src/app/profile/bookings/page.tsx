'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import { Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';
import Button from '@/components/common/Button';

// Sample booking data - in a real app, this would come from an API
const sampleBookings = [
  {
    id: 'bk1',
    title: 'Golden Triangle Tour',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Delhi, Agra, Jaipur',
    startDate: new Date(2023, 11, 15),
    endDate: new Date(2023, 11, 22),
    status: 'confirmed',
    price: 1299,
    guests: 2,
  },
  {
    id: 'bk2',
    title: 'Kerala Backwaters Cruise',
    image: 'https://images.unsplash.com/photo-1602301818347-dfbd915a9a85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Alleppey, Kerala',
    startDate: new Date(2024, 1, 10),
    endDate: new Date(2024, 1, 13),
    status: 'pending',
    price: 899,
    guests: 2,
  },
  {
    id: 'bk3',
    title: 'Varanasi Spiritual Journey',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Varanasi, Uttar Pradesh',
    startDate: new Date(2023, 8, 5),
    endDate: new Date(2023, 8, 9),
    status: 'completed',
    price: 749,
    guests: 1,
  },
];

const BookingsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);
  
  // Format date range
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading || !user) {
    return null; // Will be handled by ProfileLayout
  }
  
  return (
    <ProfileLayout title="My Bookings">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Travel Bookings</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="all">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {sampleBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet. Start exploring India!</p>
            <Button variant="primary" href="/destinations">
              Explore Destinations
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sampleBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <img 
                    src={booking.image} 
                    alt={booking.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
                
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                      </div>
                      
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        ${booking.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    
                    {booking.status === 'confirmed' && (
                      <Button variant="outline" size="sm">
                        Download Itinerary
                      </Button>
                    )}
                    
                    {booking.status === 'pending' && (
                      <Button variant="primary" size="sm">
                        Complete Payment
                      </Button>
                    )}
                    
                    {booking.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Write a Review
                      </Button>
                    )}
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

export default BookingsPage; 