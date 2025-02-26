'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import { PublicKey, Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Import wallet adapter CSS (only needed once in your app)
import '@solana/wallet-adapter-react-ui/styles.css';

// Define wallet context interface
interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  balance: number;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: async () => {},
  isConnecting: false,
  isConnected: false,
  walletAddress: null,
  balance: 0,
});

// Export context hook
export const useWalletContext = () => useContext(WalletContext);

// Create wallet provider component
export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  // Get wallet adapter from Solana
  const { select, connect: connectWallet, disconnect: disconnectWallet, connected, publicKey, connecting } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const { setWalletState } = useAppStore();
  
  // RPC endpoint for Solana
  const endpoint = 'https://api.mainnet-beta.solana.com';
  
  // Fetch wallet balance
  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey) return;
      
      try {
        const connection = new Connection(endpoint);
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / 1_000_000_000; // Convert lamports to SOL
        setBalance(solBalance);
        
        // Update global state
        setWalletState(connected, publicKey.toString(), solBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      }
    }
    
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(0);
      setWalletState(false, null, 0);
    }
  }, [connected, publicKey, setWalletState]);
  
  // Connect wallet function
  const connect = async () => {
    try {
      // Default to Phantom wallet
      select('phantom');
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  // Disconnect wallet function
  const disconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
  // Build context value
  const contextValue: WalletContextType = {
    connect,
    disconnect,
    isConnecting: connecting,
    isConnected: connected,
    walletAddress: publicKey ? publicKey.toString() : null,
    balance,
  };
  
  // Define supported wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
  ];
  
  // Return provider component with Solana wallet adapters
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContext.Provider value={contextValue}>
            {children}
          </WalletContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};