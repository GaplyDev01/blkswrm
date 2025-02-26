import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Initialize a connection to the Solana network
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

/**
 * Get the SOL balance for a wallet address
 */
export async function getSolBalance(address: string): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
}

/**
 * Get token balances for a wallet address
 * This is a simplified version - a real implementation would use 
 * the Token Program or SPL Token extensions for a complete solution
 */
export async function getTokenBalances(address: string): Promise<any[]> {
  try {
    const publicKey = new PublicKey(address);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    return tokenAccounts.value.map(tokenAccount => {
      const accountData = tokenAccount.account.data.parsed.info;
      return {
        mint: accountData.mint,
        amount: Number(accountData.tokenAmount.amount) / Math.pow(10, accountData.tokenAmount.decimals),
        decimals: accountData.tokenAmount.decimals,
      };
    });
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}

/**
 * Get recent transactions for a wallet address
 */
export async function getRecentTransactions(address: string): Promise<any[]> {
  try {
    const publicKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
    
    const transactions = await Promise.all(
      signatures.map(async sig => {
        const tx = await connection.getParsedTransaction(sig.signature);
        return {
          signature: sig.signature,
          timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
          successful: tx?.meta?.err === null,
          // A real implementation would parse the transaction data more thoroughly
        };
      })
    );
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Get market price data from an external API
 * This is a mock function - in a real app, you would use CoinGecko, CoinMarketCap, etc.
 */
export async function getTokenPrices(tokens: string[]): Promise<Record<string, number>> {
  // Mock data - in a real app, fetch from an external API
  const mockPrices: Record<string, number> = {
    'solana': 102.45,
    'bonk': 0.000015,
    'serum': 0.76,
    'jupiter': 1.24,
  };
  
  return tokens.reduce((acc, token) => {
    if (mockPrices[token.toLowerCase()]) {
      acc[token] = mockPrices[token.toLowerCase()];
    }
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get data for a specific token
 * This would need to be expanded with real API integration
 */
export async function getTokenData(tokenId: string): Promise<any> {
  // Mock data - in a real app, fetch from an external API
  const mockTokens: Record<string, any> = {
    'solana': {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: 102.45,
      change24h: 5.23,
      volume24h: 1245678901,
      marketCap: 45678901234,
      description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.',
      website: 'https://solana.com',
      explorer: 'https://explorer.solana.com',
    },
    'bonk': {
      id: 'bonk',
      name: 'Bonk',
      symbol: 'BONK',
      price: 0.000015,
      change24h: -2.12,
      volume24h: 45678901,
      marketCap: 1234567890,
      description: 'BONK is the first Solana dog coin for the people, by the people.',
      website: 'https://bonkcoin.com',
      explorer: 'https://explorer.solana.com',
    }
  };
  
  return mockTokens[tokenId.toLowerCase()] || null;
}