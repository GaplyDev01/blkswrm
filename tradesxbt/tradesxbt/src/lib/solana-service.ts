import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress } from '@solana/spl-token';

export class SolanaService {
  private connection: Connection;
  
  constructor(rpcUrl = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }
  
  // Get SOL balance for a wallet
  async getSolBalance(walletAddress: string): Promise<number> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      throw error;
    }
  }
  
  // Get token balances for a wallet
  async getTokenBalances(walletAddress: string): Promise<any[]> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        pubkey,
        { programId: TOKEN_PROGRAM_ID }
      );
      
      return tokenAccounts.value.map(account => {
        const parsedInfo = account.account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const tokenBalance = parsedInfo.tokenAmount;
        
        return {
          mint: mintAddress,
          balance: tokenBalance.uiAmount,
          decimals: tokenBalance.decimals,
          address: account.pubkey.toBase58()
        };
      }).filter(token => token.balance > 0);
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw error;
    }
  }
  
  // Get token metadata
  async getTokenMetadata(mintAddress: string): Promise<any> {
    try {
      const pubkey = new PublicKey(mintAddress);
      const info = await this.connection.getParsedAccountInfo(pubkey);
      
      if (!info.value) {
        throw new Error('Token not found');
      }
      
      // For SPL tokens, we need to get metadata from token extensions or external sources
      // This is a simplified version
      return {
        mint: mintAddress,
        supply: info.value.data,
        isInitialized: true
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }
  
  // Get recent transactions for a wallet
  async getRecentTransactions(walletAddress: string, limit = 10): Promise<any[]> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(
        pubkey, 
        { limit }
      );
      
      return Promise.all(
        signatures.map(async sig => {
          const tx = await this.connection.getParsedTransaction(sig.signature);
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            status: tx?.meta?.err ? 'failed' : 'confirmed',
            fee: tx?.meta?.fee ? tx.meta.fee / LAMPORTS_PER_SOL : 0,
            instructions: tx?.transaction.message.instructions || []
          };
        })
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
  
  // Get on-chain price from DEX pools (simplified example)
  async getOnChainPrice(tokenMint: string): Promise<number | null> {
    try {
      // This is a placeholder - actual implementation would query Solana DEXs like Raydium, Orca, etc.
      // This typically involves fetching pool accounts and calculating prices based on the token reserves
      
      // For a real implementation, you would:
      // 1. Find the liquidity pools containing the token and a stablecoin (e.g., USDC)
      // 2. Get the reserve amounts for both tokens
      // 3. Calculate the price based on the ratio
      
      console.log(`Fetching on-chain price for ${tokenMint}`);
      return null; // Placeholder
    } catch (error) {
      console.error('Error fetching on-chain price:', error);
      return null;
    }
  }
}

// Hook for using Solana in React components
import { useEffect, useState } from 'react';

export function useSolanaWallet(walletAddress?: string) {
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const solanaService = new SolanaService();
  
  useEffect(() => {
    if (!walletAddress) return;
    
    const fetchWalletData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch SOL balance
        const balance = await solanaService.getSolBalance(walletAddress);
        setSolBalance(balance);
        
        // Fetch token balances
        const tokens = await solanaService.getTokenBalances(walletAddress);
        setTokenBalances(tokens);
        
        // Fetch recent transactions
        const txs = await solanaService.getRecentTransactions(walletAddress);
        setTransactions(txs);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, [walletAddress]);
  
  return { solBalance, tokenBalances, transactions, isLoading, error };
}