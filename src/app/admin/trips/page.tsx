'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Trip {
  _id: string;
  title: string;
  duration: number;
  coverImage: string;
  price: {
    amount: number;
    currency: string;
  };
  difficulty: string;
  featured: boolean;
  trending: boolean;
  createdAt: string;
  discount?: number;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export default function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'trending'>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch trips
  const fetchTrips = async (page = 1, filter: 'all' | 'featured' | 'trending' = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (filter === 'featured') {
        params.append('featured', 'true');
      } else if (filter === 'trending') {
        params.append('trending', 'true');
      }

      const response = await fetch(`/api/trips?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      
      const data = await response.json();
      
      // Handle array response format
      const tripsArray = Array.isArray(data) ? data : [];
      
      // Set trips data
      setTrips(tripsArray);
      
      // Set pagination data
      setPagination({
        total: tripsArray.length,
        page: page,
        pageSize: 10,
        totalPages: Math.ceil(tripsArray.length / 10),
        hasMore: tripsArray.length > page * 10
      });
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to load trips. Please try again later.');
      setTrips([]);
      setPagination({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasMore: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Update trip featured/trending status
  const updateTripStatus = async (tripId: string, updateData: { featured?: boolean; trending?: boolean }) => {
    setIsUpdating(tripId);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update trip');
      }
      
      // Update local state
      setTrips(trips.map(trip => 
        trip._id === tripId ? { ...trip, ...updateData } : trip
      ));
    } catch (error) {
      console.error('Error updating trip:', error);
      setError('Failed to update trip status. Please try again.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle deletion
  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }
    
    setIsUpdating(tripId);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }
      
      // Remove trip from local state
      setTrips(trips.filter(trip => trip._id !== tripId));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Filter trips
  const handleFilterChange = (newFilter: 'all' | 'featured' | 'trending') => {
    setFilter(newFilter);
    fetchTrips(1, newFilter);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchTrips(newPage, filter);
  };

  // Initial fetch
  useEffect(() => {
    fetchTrips();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trip Management</h1>
        <Link 
          href="/admin/trips/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Add New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All Trips
          </button>
          <button
            onClick={() => handleFilterChange('featured')}
            className={`px-4 py-2 rounded-md ${filter === 'featured' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Featured
          </button>
          <button
            onClick={() => handleFilterChange('trending')}
            className={`px-4 py-2 rounded-md ${filter === 'trending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Trending
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-10">
          <div className="loader">Loading...</div>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No trips found.</p>
        </div>
      ) : (
        <>
          {/* Trips grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={trip.coverImage || '/placeholder-trip.jpg'}
                    alt={trip.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{trip.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {trip.difficulty}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">{trip.duration} days</p>
                    <p className="text-xl font-bold mt-1">
                      {formatCurrency(trip.price.amount, trip.price.currency)}
                    </p>
                    {trip.discount > 0 && (
                      <p className="text-green-600 text-sm mt-1">
                        {trip.discount}% off
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => updateTripStatus(trip._id, { featured: !trip.featured })}
                      disabled={isUpdating === trip._id}
                      className={`px-2 py-1 text-xs rounded ${
                        trip.featured 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trip.featured ? 'Featured ★' : 'Set Featured'}
                    </button>
                    <button
                      onClick={() => updateTripStatus(trip._id, { trending: !trip.trending })}
                      disabled={isUpdating === trip._id}
                      className={`px-2 py-1 text-xs rounded ${
                        trip.trending 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trip.trending ? 'Trending 🔥' : 'Set Trending'}
                    </button>
                  </div>
                  <div className="flex justify-between mt-2">
                    <Link 
                      href={`/admin/trips/${trip._id}`} 
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      disabled={isUpdating === trip._id}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === pagination.page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}