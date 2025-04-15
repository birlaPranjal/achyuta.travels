'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard, ArrowLeft, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CryptoPaymentTab from '@/components/payments/CryptoPaymentTab';

type Trip = {
  _id: string;
  title: string;
  price: number;
  duration: number;
  description: string;
  image: string;
};

const CheckoutPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) throw new Error('Failed to fetch trip');
        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error('Error fetching trip:', error);
        toast({
          title: 'Error',
          description: 'Failed to load trip details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id, toast]);

  // Handle regular credit card payment
  const handleCardPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate a payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with a payment processor here
      
      // Record the booking in the database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip?._id,
          paymentMethod: 'card',
          paymentStatus: 'completed',
          amount: trip?.price,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create booking');
      
      const booking = await response.json();
      
      toast({
        title: 'Payment Successful',
        description: 'Your trip has been booked successfully!',
        variant: 'success',
      });
      
      // Redirect to booking confirmation
      router.push(`/bookings/${booking._id}/confirmation`);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle successful payment completion
  const handlePaymentComplete = async (paymentInfo: {
    method: string;
    transactionId: string;
    amount: number;
  }) => {
    try {
      // Record the booking in the database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip?._id,
          paymentMethod: paymentInfo.method,
          transactionId: paymentInfo.transactionId,
          paymentStatus: 'completed',
          amount: paymentInfo.amount,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create booking');
      
      const booking = await response.json();
      
      // Redirect to booking confirmation
      router.push(`/bookings/${booking._id}/confirmation`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating your booking. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h1>
        <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/trips')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse other trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">Complete your booking for {trip.title}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="relative h-48">
              <img
                src={trip.image || 'https://images.unsplash.com/photo-1480796927426-f609979314bd'}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{trip.duration} days</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-xl text-orange-600">${trip.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit Card
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Cryptocurrency
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card">
                <div className="space-y-4">
                  {/* Credit Card Form */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCardPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ${trip.price}</>
                    )}
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="crypto">
                <CryptoPaymentTab
                  amount={trip.price}
                  tripId={trip._id}
                  onPaymentComplete={handlePaymentComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 