"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, disconnectWallet, getEthBalance, TransactionResult, sendTransaction } from '@/lib/ethereum';

type CryptoContextType = {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  makePayment: (receiverAddress: string, amount: string) => Promise<TransactionResult>;
  provider: ethers.providers.Web3Provider | null;
};

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Only attempt to connect if in client browser
        if (typeof window !== 'undefined') {
          const web3Modal = (await import('web3modal')).default;
          if (web3Modal.cachedProvider) {
            connect();
          }
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      }
    };

    checkConnection();
  }, []);

  // Update balance whenever address changes
  useEffect(() => {
    const updateBalance = async () => {
      if (provider && address) {
        try {
          const bal = await getEthBalance(provider, address);
          setBalance(bal);
        } catch (err) {
          console.error('Error fetching balance:', err);
        }
      }
    };

    updateBalance();
  }, [provider, address]);

  // Handle events from provider
  useEffect(() => {
    if (provider && typeof window !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        // Handle chain change - page reload is recommended by MetaMask
        window.location.reload();
      };

      const handleDisconnect = () => {
        disconnect();
      };

      // Get the provider from ethers
      const ethersProvider = provider.provider as any;
      
      if (ethersProvider.on) {
        ethersProvider.on('accountsChanged', handleAccountsChanged);
        ethersProvider.on('chainChanged', handleChainChanged);
        ethersProvider.on('disconnect', handleDisconnect);

        // Cleanup listeners
        return () => {
          if (ethersProvider.removeListener) {
            ethersProvider.removeListener('accountsChanged', handleAccountsChanged);
            ethersProvider.removeListener('chainChanged', handleChainChanged);
            ethersProvider.removeListener('disconnect', handleDisconnect);
          }
        };
      }
    }
  }, [provider]);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await connectWallet();
      
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.provider && result.address) {
        setProvider(result.provider);
        setAddress(result.address);
        setChainId(result.chainId);
        setIsConnected(true);
        
        // Get initial balance
        const bal = await getEthBalance(result.provider, result.address);
        setBalance(bal);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connect wallet error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setProvider(null);
      setAddress(null);
      setChainId(null);
      setIsConnected(false);
      setBalance('0');
    } catch (err: any) {
      console.error('Disconnect error:', err);
    }
  };

  const makePayment = async (receiverAddress: string, amount: string): Promise<TransactionResult> => {
    if (!provider) {
      return { 
        success: false, 
        error: 'Wallet not connected' 
      };
    }

    try {
      setIsLoading(true);
      const result = await sendTransaction(receiverAddress, amount, provider);
      
      // Update balance after transaction
      if (result.success && address) {
        const newBalance = await getEthBalance(provider, address);
        setBalance(newBalance);
      }
      
      return result;
    } catch (err: any) {
      console.error('Payment error:', err);
      return { 
        success: false, 
        error: err.message || 'Payment failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isConnected,
    address,
    chainId,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    makePayment,
    provider
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
};

export const useCrypto = (): CryptoContextType => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}; 