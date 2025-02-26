"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Info,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CryptoCard, CryptoCardHeader, CryptoCardTitle, CryptoCardContent, CryptoCardFooter } from "@/components/ui/crypto-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TradingViewWidget from "@/components/TradingViewWidget";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { useAppStore } from "@/lib/store";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const router = useRouter();
  const { setSelectedToken } = useAppStore();
  const { isSignedIn, user, isLoaded } = useUser();
  const [chartTimeframe, setChartTimeframe] = useState("1D");
  const [chartSymbol, setChartSymbol] = useState("BINANCE:SOLUSDT");
  
  // Redirect to login if not authenticated
  if (isLoaded && !isSignedIn) {
    router.push('/login');
    return null;
  }
  
  // Demo wallet data
  const walletData = {
    balance: 1245.87,
    changePercentage: 8.2,
    tokens: [
      { symbol: 'SOL', name: 'Solana', amount: 4.25, value: 606.82, priceChange: 8.45 },
      { symbol: 'JUP', name: 'Jupiter', amount: 324.56, value: 402.45, priceChange: 3.21 },
      { symbol: 'BONK', name: 'Bonk', amount: 15235789, value: 235.70, priceChange: 12.3 },
      { symbol: 'JTO', name: 'Jito', amount: 0.35, value: 1.005, priceChange: -2.4 },
    ],
  };
  
  // Demo performance data
  const performance = {
    day: 8.2,
    week: 12.5,
    month: -3.8,
    year: 104.3,
  };
  
  // Demo market data
  const markets = [
    { name: 'Solana', symbol: 'SOL', price: 142.78, change: 8.45, volume: 2.46, signal: 'buy' },
    { name: 'Jupiter', symbol: 'JUP', price: 1.24, change: 3.21, volume: 0.54, signal: 'hold' },
    { name: 'Bonk', symbol: 'BONK', price: 0.00001547, change: 12.3, volume: 0.287, signal: 'buy' },
    { name: 'Jito', symbol: 'JTO', price: 2.87, change: -2.4, volume: 0.13, signal: 'sell' },
    { name: 'Raydium', symbol: 'RAY', price: 0.89, change: 1.2, volume: 0.095, signal: 'hold' },
  ];
  
  // Mock trading signals
  const tradingSignals = [
    { symbol: 'SOL/USDT', direction: 'buy', confidence: 85, timeframe: '4h', price: 142.78 },
    { symbol: 'BONK/USDT', direction: 'buy', confidence: 92, timeframe: '1h', price: 0.00001547 },
    { symbol: 'JTO/USDT', direction: 'sell', confidence: 78, timeframe: '1d', price: 2.87 },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Top row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CryptoCard variant="glass" hover="scale" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/10 rounded-md">
                <Wallet className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-medium">Wallet Balance</h3>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 h-6 w-6">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">${walletData.balance.toFixed(2)}</div>
            <div className="flex items-center space-x-2">
              <Badge variant={walletData.changePercentage >= 0 ? "success" : "danger"}>
                {walletData.changePercentage >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(walletData.changePercentage)}%
              </Badge>
              <span className="text-sm text-gray-400">past 24h</span>
            </div>
            {user && (
              <div className="mt-1 text-xs text-gray-400">
                Welcome, {user.firstName || user.username || 'Trader'}
              </div>
            )}
          </div>
        </CryptoCard>
        
        <CryptoCard variant="glass" hover="scale" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/10 rounded-md">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="font-medium">Performance</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" variant="glass">
                <DropdownMenuItem className="cursor-pointer">This Week</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">This Month</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">This Year</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">All Time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {performance.day >= 0 ? '+' : ''}{performance.day}%
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-gray-400">Week</div>
                <div className={performance.week >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {performance.week >= 0 ? '+' : ''}{performance.week}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">Month</div>
                <div className={performance.month >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {performance.month >= 0 ? '+' : ''}{performance.month}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">Year</div>
                <div className={performance.year >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {performance.year >= 0 ? '+' : ''}{performance.year}%
                </div>
              </div>
            </div>
          </div>
        </CryptoCard>
        
        <CryptoCard variant="glass" hover="scale" className="relative overflow-hidden col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-medium">AI Trading Signals</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => router.push('/signals')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            {tradingSignals.map((signal, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{signal.symbol}</span>
                  <Badge variant={signal.direction === 'buy' ? 'success' : 'danger'}>
                    {signal.direction.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="font-medium">{signal.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeframe:</span>
                    <span>{signal.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span>${signal.price < 0.01 ? signal.price.toFixed(8) : signal.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CryptoCard>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart section */}
        <div className="lg:col-span-2">
          <CryptoCard gradientOverlay className="h-[500px]">
            <CryptoCardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Select
                    value={chartSymbol}
                    onValueChange={(value) => setChartSymbol(value)}
                  >
                    <SelectTrigger className="w-[180px]" variant="glass">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent variant="glass">
                      <SelectItem value="BINANCE:SOLUSDT">SOL/USDT</SelectItem>
                      <SelectItem value="BINANCE:JUPUSDT">JUP/USDT</SelectItem>
                      <SelectItem value="BINANCE:BONKUSDT">BONK/USDT</SelectItem>
                      <SelectItem value="BINANCE:JTOUSDT">JTO/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-1 bg-black/30 rounded-md p-1">
                    {['1h', '4h', '1D', '1W'].map((timeframe) => (
                      <Toggle
                        key={timeframe}
                        variant="pill"
                        pressed={chartTimeframe === timeframe}
                        onPressedChange={() => setChartTimeframe(timeframe)}
                        className="px-3 py-1 text-xs"
                      >
                        {timeframe}
                      </Toggle>
                    ))}
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CryptoCardHeader>
            
            <CryptoCardContent className="h-[420px] -mx-5">
              <TradingViewWidget 
                symbol={chartSymbol}
                interval={chartTimeframe === '1D' ? 'D' : chartTimeframe === '1W' ? 'W' : chartTimeframe}
                height={420}
              />
            </CryptoCardContent>
          </CryptoCard>
        </div>
        
        {/* Portfolio section */}
        <div>
          <CryptoCard className="h-[500px]">
            <CryptoCardHeader>
              <div className="flex items-center justify-between w-full">
                <CryptoCardTitle>Your Portfolio</CryptoCardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/wallet')}>
                  View Wallet
                </Button>
              </div>
            </CryptoCardHeader>
            
            <CryptoCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 mb-1">Total Balance</div>
                  <div className="font-medium text-lg">${walletData.balance.toFixed(2)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 mb-1">24h Change</div>
                  <div className={`font-medium text-lg ${walletData.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {walletData.changePercentage >= 0 ? '+' : ''}{walletData.changePercentage}%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-400">Allocation</h3>
                <div className="flex space-x-1 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-purple-500" style={{ width: `${(walletData.tokens[0].value / walletData.balance) * 100}%` }}></div>
                  <div className="bg-blue-500" style={{ width: `${(walletData.tokens[1].value / walletData.balance) * 100}%` }}></div>
                  <div className="bg-green-500" style={{ width: `${(walletData.tokens[2].value / walletData.balance) * 100}%` }}></div>
                  <div className="bg-yellow-500" style={{ width: `${(walletData.tokens[3].value / walletData.balance) * 100}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span>SOL {((walletData.tokens[0].value / walletData.balance) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span>JUP {((walletData.tokens[1].value / walletData.balance) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>BONK {((walletData.tokens[2].value / walletData.balance) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span>JTO {((walletData.tokens[3].value / walletData.balance) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-400">Assets</h3>
                <div className="space-y-3">
                  {walletData.tokens.map((token, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedToken(token.symbol.toLowerCase());
                        router.push(`/token-analysis?token=${token.symbol.toLowerCase()}`);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                          <span className="text-white font-medium">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-gray-400">{token.amount} tokens</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${token.value.toFixed(2)}</div>
                        <div className={`text-xs ${token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="glow" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Trade Assets
                </Button>
              </div>
            </CryptoCardContent>
          </CryptoCard>
        </div>
      </div>
      
      {/* Bottom row */}
      <div>
        <CryptoCard>
          <CryptoCardHeader>
            <div className="flex items-center justify-between w-full">
              <CryptoCardTitle>Top Markets</CryptoCardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/markets')}>
                View All Markets
              </Button>
            </div>
          </CryptoCardHeader>
          
          <CryptoCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">24h Change</th>
                    <th className="pb-2">24h Volume (B)</th>
                    <th className="pb-2">AI Signal</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {markets.map((market, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                            <span className="text-white font-medium">{market.symbol[0]}</span>
                          </div>
                          <div>
                            <div className="font-medium">{market.symbol}</div>
                            <div className="text-xs text-gray-400">{market.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium">
                          ${market.price < 0.01 ? market.price.toFixed(8) : market.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className={`font-medium ${market.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {market.change >= 0 ? '+' : ''}{market.change}%
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium">${market.volume}</div>
                      </td>
                      <td className="py-3">
                        <Badge 
                          variant={
                            market.signal === 'buy' ? 'success' :
                            market.signal === 'sell' ? 'danger' : 
                            'warning'
                          }
                        >
                          {market.signal.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => {
                              setSelectedToken(market.symbol.toLowerCase());
                              router.push(`/token-analysis?token=${market.symbol.toLowerCase()}`);
                            }}
                          >
                            Chart
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => router.push('/trading')}
                          >
                            Trade
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CryptoCardContent>
        </CryptoCard>
      </div>
    </div>
  );
}