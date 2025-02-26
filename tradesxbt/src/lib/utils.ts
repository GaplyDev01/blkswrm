import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD", compact = false): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: amount < 1 ? 4 : 2,
    maximumFractionDigits: amount < 1 ? 6 : 2,
  })
  return formatter.format(amount)
}

export function formatNumber(num: number, precision = 2): string {
  if (num === 0) return "0"
  
  if (Math.abs(num) < 0.001) {
    return num.toExponential(precision)
  }
  
  if (Math.abs(num) < 1) {
    return num.toFixed(6)
  }
  
  return num.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Token price change colors
export function getPriceChangeColor(change: number): string {
  if (change > 5) return "text-green-400"
  if (change > 0) return "text-green-500"
  if (change < -5) return "text-red-400"
  if (change < 0) return "text-red-500"
  return "text-gray-400"
}

// Generate mock data for charts
export function generateMockPriceData(days = 30, volatility = 0.05, trend = 0.01): number[] {
  let price = 100
  const data: number[] = [price]
  
  for (let i = 1; i < days; i++) {
    const change = price * (getRandomInt(-100, 100) / 100) * volatility
    const trendEffect = price * trend
    price = price + change + trendEffect
    if (price < 1) price = 1
    data.push(price)
  }
  
  return data
}

// Calculate ROI
export function calculateROI(initialInvestment: number, currentValue: number): number {
  return ((currentValue - initialInvestment) / initialInvestment) * 100
}