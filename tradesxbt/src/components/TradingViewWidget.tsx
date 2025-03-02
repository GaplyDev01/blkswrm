"use client";

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  interval?: string;
  timezone?: string;
  style?: 'candlesticks' | 'bars' | 'line' | 'area';
  locale?: string;
  enable_publishing?: boolean;
  save_image?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  container_id?: string;
  className?: string;
}

function TradingViewWidget({
  symbol = 'BINANCE:SOLUSDT',
  theme = 'dark',
  width = '100%',
  height = 500,
  interval = '15',
  timezone = 'Etc/UTC',
  style = 'candlesticks',
  locale = 'en',
  enable_publishing = false,
  save_image = true,
  hide_top_toolbar = false,
  hide_legend = false,
  container_id = 'tradingview_widget',
  className = '',
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: style,
          locale: locale,
          enable_publishing: enable_publishing,
          save_image: save_image,
          hide_top_toolbar: hide_top_toolbar,
          hide_legend: hide_legend,
          container_id: container_id,
          // Custom options for crypto-themed style
          studies: ['MACD@tv-basicstudies', 'RSI@tv-basicstudies'],
          loading_screen: { backgroundColor: "#0A0A0A", foregroundColor: "#00E676" },
          overrides: {
            // Main chart styles
            "paneProperties.background": "#0A0A0A",
            "paneProperties.vertGridProperties.color": "#111111",
            "paneProperties.horzGridProperties.color": "#111111",
            "scalesProperties.textColor": "#999999",
            
            // Candlestick colors
            "mainSeriesProperties.candleStyle.upColor": "#00E676",
            "mainSeriesProperties.candleStyle.downColor": "#FF3B69",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00E676",
            "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B69",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00E676",
            "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B69",

            // Volume colors
            "volume.volume.color.0": "#FF3B6950",
            "volume.volume.color.1": "#00E67650",
          },
          disabled_features: [
            "header_symbol_search",
            "header_screenshot",
            "header_compare",
          ],
          enabled_features: [
            "use_localstorage_for_settings",
            "side_toolbar_in_fullscreen_mode",
          ],
          charts_storage_url: 'https://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, theme, interval, timezone, style, locale, enable_publishing, save_image, hide_top_toolbar, hide_legend, container_id]);

  return (
    <div 
      className={`w-full bg-[#0A0A0A] relative overflow-hidden rounded-xl border border-white/5 ${className}`}
      style={{ height }}
    >
      {/* Gradient effects for crypto-themed UI */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full -mt-10 -mr-10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full -mb-10 -ml-10 z-0"></div>
      
      {/* TradingView container */}
      <div id={container_id} ref={containerRef} className="w-full h-full relative z-10" />
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(TradingViewWidget);

// Add TypeScript type for TradingView global object
declare global {
  interface Window {
    TradingView: any;
  }
}