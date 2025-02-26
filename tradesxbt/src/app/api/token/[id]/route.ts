import { NextRequest, NextResponse } from 'next/server';
import { getTokenData, getMarketChart } from '@/lib/coingecko-api';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tokenId = params.id;
    
    // Get query parameters
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '7', 10);
    
    // Fetch token data and market chart in parallel
    const [tokenData, marketChart] = await Promise.all([
      getTokenData(tokenId),
      getMarketChart(tokenId, days)
    ]);
    
    // Format response with essential data
    const response = {
      id: tokenData.id,
      name: tokenData.name,
      symbol: tokenData.symbol.toUpperCase(),
      description: tokenData.description?.en || '',
      image: {
        small: tokenData.image?.small,
        thumb: tokenData.image?.thumb,
      },
      links: {
        homepage: tokenData.links?.homepage?.[0] || '',
        blockchain_site: tokenData.links?.blockchain_site?.[0] || '',
        official_forum: tokenData.links?.official_forum_url?.[0] || '',
        twitter: tokenData.links?.twitter_screen_name || '',
        telegram: tokenData.links?.telegram_channel_identifier || '',
        github: tokenData.links?.repos_url?.github?.[0] || '',
      },
      market_data: {
        current_price: tokenData.market_data?.current_price?.usd || 0,
        market_cap: tokenData.market_data?.market_cap?.usd || 0,
        total_volume: tokenData.market_data?.total_volume?.usd || 0,
        high_24h: tokenData.market_data?.high_24h?.usd || 0,
        low_24h: tokenData.market_data?.low_24h?.usd || 0,
        price_change_percentage_24h: tokenData.market_data?.price_change_percentage_24h || 0,
        price_change_percentage_7d: tokenData.market_data?.price_change_percentage_7d || 0,
        price_change_percentage_30d: tokenData.market_data?.price_change_percentage_30d || 0,
        circulating_supply: tokenData.market_data?.circulating_supply || 0,
        total_supply: tokenData.market_data?.total_supply || 0,
        max_supply: tokenData.market_data?.max_supply || 0,
      },
      community_data: {
        twitter_followers: tokenData.community_data?.twitter_followers || 0,
        telegram_channel_user_count: tokenData.community_data?.telegram_channel_user_count || 0,
        reddit_subscribers: tokenData.community_data?.reddit_subscribers || 0,
      },
      // Market chart data for price graph
      chart_data: {
        prices: marketChart.prices,
        market_caps: marketChart.market_caps,
        total_volumes: marketChart.total_volumes,
        timeframe: `${days} day${days > 1 ? 's' : ''}`,
      },
      last_updated: tokenData.last_updated,
      timestamp: new Date().toISOString(),
      ecosystem: 'solana',
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error(`Error fetching token data for ${params.id}:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch token data',
        message: error instanceof Error ? error.message : 'Unknown error',
        tokenId: params.id,
      },
      { status: 500 }
    );
  }
}