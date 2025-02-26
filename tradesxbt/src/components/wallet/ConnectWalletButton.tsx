import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export function ConnectWalletButton() {
  const { wallet, connect, disconnect, connected, publicKey } = useWallet();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string): string => {
    return address.slice(0, 4) + '...' + address.slice(-4);
  };

  if (connected && publicKey) {
    return (
      <div className="relative group">
        <button 
          className="px-3 py-1.5 text-sm bg-green-600/20 text-green-500 border border-green-600/30 rounded-md flex items-center space-x-1 hover:bg-green-600/30 transition"
          onClick={() => disconnect()}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          <span>{formatAddress(publicKey.toString())}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 p-2 bg-[#0D0D0D] rounded-md shadow-lg border border-gray-700 z-10 hidden group-hover:block">
          <div className="p-2 text-xs text-gray-400">
            <p className="font-medium text-white mb-1">Connected Wallet</p>
            <p className="break-all mb-2">{publicKey.toString()}</p>
            <button 
              onClick={() => disconnect()}
              className="w-full text-center px-2 py-1.5 bg-red-900/20 text-red-400 rounded border border-red-900/30 hover:bg-red-900/30 transition text-xs"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className={`px-3 py-1.5 text-sm bg-orange-600/20 text-orange-400 border border-orange-600/30 rounded-md hover:bg-orange-600/30 transition ${connecting ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={handleConnect}
      disabled={connecting}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}