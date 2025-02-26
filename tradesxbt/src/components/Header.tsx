import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';

export default function Header() {
  return (
    <header className="bg-[#0A0A0A] border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white font-bold text-xl">
              TradesXBT
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/markets" className="text-gray-300 hover:text-white transition">
                Markets
              </Link>
              <Link href="/trading" className="text-gray-300 hover:text-white transition">
                Trading
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition">
                Analytics
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectWalletButton />
            
            <SignedIn>
              {/* User is signed in, show user button */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                    userButtonPopoverCard: "bg-[#0D0D0D] border border-gray-700 text-white shadow-xl",
                    userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-[#1A1A1A]",
                    userButtonPopoverActionButtonText: "text-current",
                    userButtonPopoverFooter: "border-t border-gray-700",
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              {/* User is not signed in, show sign in and sign up buttons */}
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}