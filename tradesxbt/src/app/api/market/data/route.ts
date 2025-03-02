import { NextRequest, NextResponse } from 'next/server';
import { getMarkets } from '@/lib/coingecko-api';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters with defaults
    const url = new URL(req.url);
    const vsCurrency = url.searchParams.get('vs_currency') || 'usd';
    const category = url.searchParams.get('category') || 'solana-ecosystem';
    const order = url.searchParams.get('order') || 'market_cap_desc';
    const perPage = parseInt(url.searchParams.get('per_page') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const sparkline = url.searchParams.get('sparkline') !== 'false';
    const priceChangePercentage = url.searchParams.get('price_change_percentage') || '24h';
    
    // Fetch market data
    const marketData = await getMarkets({
      vsCurrency,
      category,
      order,
      perPage,
      page,
      sparkline,
      priceChangePercentage,
    });
    
    // Extract important market metrics
    const marketMetrics = calculateMarketMetrics(marketData);
    
    // Format the response
    const response = {
      data: marketData,
      metrics: marketMetrics,
      params: {
        vs_currency: vsCurrency,
        category,
        order,
        per_page: perPage,
        page,
        sparkline,
        price_change_percentage: priceChangePercentage,
      },
      timestamp: new Date().toISOString(),
      source: 'CoinGecko Pro API',
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
      },
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Calculate additional market metrics from the data
function calculateMarketMetrics(marketData: any[]) {
  // Check if market data is valid
  if (!Array.isArray(marketData) || marketData.length === 0) {
    return {
      total_market_cap: 0,
      total_volume_24h: 0,
      positive_performers_24h: 0,
      negative_performers_24h: 0,
      best_performer: null,
      worst_performer: null,
    };
  }
  
  // Calculate metrics
  let totalMarketCap = 0;
  let totalVolume24h = 0;
  let positivePerformers = 0;
  let negativePerformers = 0;
  
  let bestPerformer = { symbol: '', change: -Infinity };
  let worstPerformer = { symbol: '', change: Infinity };
  
  marketData.forEach(token => {
    totalMarketCap += token.market_cap || 0;
    totalVolume24h += token.total_volume || 0;
    
    const change = token.price_change_percentage_24h || 0;
    
    if (change > 0) positivePerformers++;
    if (change < 0) negativePerformers++;
    
    if (change > bestPerformer.change) {
      bestPerformer = {
        symbol: token.symbol,
        change,
        name: token.name,
        price: token.current_price,
        id: token.id,
        image: token.image,
      };
    }
    
    if (change < worstPerformer.change) {
      worstPerformer = {
        symbol: token.symbol,
        change,
        name: token.name,
        price: token.current_price,
        id: token.id,
        image: token.image,
      };
    }
  });
  
  return {
    total_market_cap: totalMarketCap,
    total_volume_24h: totalVolume24h,
    positive_performers_24h: positivePerformers,
    negative_performers_24h: negativePerformers,
    best_performer: bestPerformer.symbol ? bestPerformer : null,
    worst_performer: worstPerformer.symbol ? worstPerformer : null,
  };
}