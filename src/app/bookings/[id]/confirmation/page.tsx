'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Booking = {
  _id: string;
  tripId: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  amount: number;
  status: string;
  createdAt: string;
};

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast({
          title: 'Error',
          description: 'Failed to load booking details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
        <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/bookings')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          View all bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-green-100 rounded-full p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Thank you for your booking. Your payment has been processed successfully.
        </p>

        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{booking._id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">
                  {booking.paymentMethod === 'crypto_ethereum' ? 'Ethereum' : 'Credit Card'}
                </span>
              </div>
              
              {booking.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{booking.transactionId}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${booking.amount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{booking.status}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/bookings')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage; 