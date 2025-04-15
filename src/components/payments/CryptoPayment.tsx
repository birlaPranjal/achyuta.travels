import React, { useState } from 'react';
import { useCrypto } from '@/context/CryptoContext';
import { formatAddress, isValidEthereumAddress } from '@/lib/ethereum';
import { AlertCircle, Check, Wallet } from 'lucide-react';

type CryptoPaymentProps = {
  amount: number;
  receiverAddress: string;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
};

const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  amount,
  receiverAddress,
  onSuccess,
  onError,
}) => {
  const {
    isConnected,
    address,
    balance,
    isLoading,
    error: walletError,
    connect,
    disconnect,
    makePayment,
  } = useCrypto();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (err: any) {
      onError(err.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnectWallet = async () => {
    await disconnect();
    setTxHash(null);
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  const handleMakePayment = async () => {
    if (!isValidEthereumAddress(receiverAddress)) {
      setPaymentError('Invalid receiver address');
      onError('Invalid receiver address');
      return;
    }

    try {
      setPaymentStatus('processing');
      setPaymentError(null);

      const result = await makePayment(receiverAddress, amount.toString());

      if (result.success && result.hash) {
        setTxHash(result.hash);
        setPaymentStatus('success');
        onSuccess(result.hash);
      } else {
        setPaymentStatus('error');
        setPaymentError(result.error || 'Payment failed');
        onError(result.error || 'Payment failed');
      }
    } catch (err: any) {
      setPaymentStatus('error');
      setPaymentError(err.message || 'Payment failed');
      onError(err.message || 'Payment failed');
    }
  };

  // Check if user has enough balance
  const hasEnoughBalance = parseFloat(balance) >= amount;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-orange-500" />
        Pay with Cryptocurrency
      </h3>

      {!isConnected ? (
        <div>
          <p className="text-gray-600 mb-4">
            Connect your Ethereum wallet to make a payment of {amount} ETH.
          </p>
          <button
            onClick={handleConnectWallet}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Connecting...
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </button>
          {walletError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{walletError}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Connected as</p>
              <p className="font-medium">{address ? formatAddress(address) : 'Unknown'}</p>
            </div>
            <button
              onClick={handleDisconnectWallet}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Disconnect
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Your balance:</span>
              <span className="font-semibold">{parseFloat(balance).toFixed(6)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment amount:</span>
              <span className="font-semibold">{amount.toFixed(6)} ETH</span>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Insufficient balance. You need {amount.toFixed(6)} ETH to complete this payment.
              </p>
            </div>
          )}

          {paymentStatus === 'success' && txHash && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
              <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Payment successful!</p>
                <p className="text-sm mt-1">
                  Transaction hash:{' '}
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-green-800"
                  >
                    {formatAddress(txHash)}
                  </a>
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && paymentError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{paymentError}</p>
            </div>
          )}

          <button
            onClick={handleMakePayment}
            disabled={
              isLoading ||
              !hasEnoughBalance ||
              paymentStatus === 'processing' ||
              paymentStatus === 'success'
            }
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {paymentStatus === 'processing' ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <Check className="h-5 w-5" />
                Payment Complete
              </>
            ) : (
              <>Pay {amount} ETH</>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>
          * This payment will be processed on the Ethereum blockchain. Make sure you have a{' '}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MetaMask
          </a>{' '}
          wallet or another Web3 wallet installed.
        </p>
      </div>
    </div>
  );
};

export default CryptoPayment; 