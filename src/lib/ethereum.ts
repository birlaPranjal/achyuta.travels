import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

export type TransactionResult = {
  success: boolean;
  hash?: string;
  error?: string;
};

// Initialize Web3Modal instance
const getWeb3Modal = () => {
  return new Web3Modal({
    network: process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || 'mainnet',
    cacheProvider: true,
    providerOptions: {}, // Add provider options as needed
  });
};

// Connect to wallet
export const connectWallet = async (): Promise<{
  provider: ethers.providers.Web3Provider | null;
  address: string | null;
  chainId: number | null;
  error?: string;
}> => {
  try {
    const web3Modal = getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.listAccounts();
    const network = await provider.getNetwork();
    
    return {
      provider,
      address: accounts[0],
      chainId: network.chainId,
    };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    return {
      provider: null,
      address: null,
      chainId: null,
      error: 'Failed to connect wallet. Please try again.'
    };
  }
};

// Disconnect wallet
export const disconnectWallet = async (): Promise<void> => {
  const web3Modal = getWeb3Modal();
  web3Modal.clearCachedProvider();
};

// Send Ethereum transaction
export const sendTransaction = async (
  toAddress: string,
  amount: string,
  provider: ethers.providers.Web3Provider
): Promise<TransactionResult> => {
  try {
    const signer = provider.getSigner();
    
    // Convert amount to wei (1 ETH = 10^18 wei)
    const amountInWei = ethers.utils.parseEther(amount);
    
    // Create transaction
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: amountInWei,
    });
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.error('Transaction error:', error);
    return {
      success: false,
      error: error.message || 'Transaction failed',
    };
  }
};

// Format Ethereum address for display
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get ETH balance
export const getEthBalance = async (
  provider: ethers.providers.Web3Provider,
  address: string
): Promise<string> => {
  const balanceInWei = await provider.getBalance(address);
  return ethers.utils.formatEther(balanceInWei);
};

// Validate Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};