import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import CryptoPayment from './CryptoPayment';
import { useToast } from '@/hooks/use-toast';

// Company's Ethereum address to receive payments
const COMPANY_ETH_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ETH_ADDRESS || '0x1234567890123456789012345678901234567890';

type CryptoPaymentTabProps = {
  amount: number;
  tripId: string;
  onPaymentComplete: (paymentInfo: {
    method: string;
    transactionId: string;
    amount: number;
  }) => void;
};

const CryptoPaymentTab: React.FC<CryptoPaymentTabProps> = ({
  amount,
  tripId,
  onPaymentComplete,
}) => {
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Convert amount from USD to ETH (in a real app, you would use an API for current rates)
  // This is a simplified example - 1 ETH = $3000 USD (adjust as needed)
  const ethAmount = amount / 3000;

  const handlePaymentSuccess = async (txHash: string) => {
    setIsProcessingPayment(true);
    
    try {
      // In a real application, you would likely create a server endpoint to verify
      // the transaction and record it in your database
      // Here we're just simulating that process
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onPaymentComplete callback with payment information
      onPaymentComplete({
        method: 'crypto_ethereum',
        transactionId: txHash,
        amount: amount,
      });
      
      toast({
        title: 'Payment Successful',
        description: 'Your cryptocurrency payment was processed successfully.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error Processing Payment',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Error',
      description: error,
      variant: 'destructive',
    });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Pay with Cryptocurrency</h3>
      </div>
      
      <div className="p-1 bg-orange-50 text-orange-700 rounded-lg mb-6 text-sm">
        <p className="p-3">
          You will be paying approximately <strong>{ethAmount.toFixed(6)} ETH</strong> for this 
          trip (using a simplified conversion rate of 1 ETH = $3,000 USD).
        </p>
      </div>
      
      <CryptoPayment 
        amount={ethAmount}
        receiverAddress={COMPANY_ETH_ADDRESS}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default CryptoPaymentTab; 