# TradesXBT - Solana Trading Platform

TradesXBT is a Next.js-based web application that provides a modern trading interface for Solana tokens with wallet integration, real-time charting, and AI-powered insights.

## Features

- **Dual Authentication**: Clerk user auth + Solana wallet integration
- **Trading Interface**: Professional UI for analyzing and trading Solana tokens
- **AI Chat Assistant**: Market analysis and trading recommendations powered by Vercel AI SDK
- **Token Explorer**: Comprehensive token information with TradingView charts
- **Dashboard**: Portfolio tracking and market data visualization
- **AI Trading Signals**: Algorithmic trading signals with entry/exit points
- **Real-time Markets**: Live market data and token listings
- **Redis Caching**: High-performance API response caching

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code development
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **Clerk** - Authentication and user management
- **Vercel AI SDK** - Streaming AI responses for chat functionality
- **Zustand** - Lightweight state management
- **Solana Web3.js** - Solana blockchain interaction
- **Wallet Adapter** - Secure wallet connection and authentication
- **Vercel KV (Redis)** - High-performance data caching
- **TradingView** - Professional trading charts
- **Recharts** - Responsive React charts for metrics

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/tradesxbt.git
cd tradesxbt
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local` and fill in the required API keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your API keys:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_DOMAIN=your_clerk_domain

# Vercel KV for Redis caching
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_api_url
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token

# API Keys
COINGECKO_API_KEY=your_coingecko_api_key 
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/` - Next.js app router pages
  - `api/` - API routes including AI chat endpoint
  - `(app)/` - Authenticated routes requiring wallet connection
- `src/components/` - Reusable UI components
  - `ui/` - Base UI components (buttons, cards, etc.)
  - `layout/` - Layout components (AppShell, etc.)
- `src/context/` - React context for state management
- `src/lib/` - Utility functions, services, and shared logic
  - `solana.ts` - Solana blockchain service
  - `store.ts` - Zustand store for global state management
  - `utils.ts` - Helper functions for formatting and data processing

## AI Integration

The platform uses the Vercel AI SDK to provide intelligent trading insights:

- **AI Chat**: Conversational interface for token analysis and market insights
- **Trading Signals**: AI-generated trading opportunities with confidence scores
- **Market Analysis**: Automated technical and fundamental analysis

To use these features:

1. Ensure you have set up your OpenAI API key in `.env.local`
2. Connect your wallet to access the AI features
3. The AI system is fine-tuned for the Solana ecosystem

## Authentication Flow

TradesXBT uses a dual authentication system:

### User Authentication (Clerk)

1. User signs up or logs in via the `/login` or `/signup` pages
2. Clerk handles authentication, email verification, and session management
3. After authentication, users are redirected to the dashboard
4. Protected routes check for authentication using middleware
5. User profile and settings are accessible via Clerk's user management

### Wallet Connection

1. Authenticated users can connect their Solana wallet from the dashboard
2. Wallet adapter handles the connection to the selected Solana wallet (Phantom, Solflare, etc.)
3. Connected wallet enables trading functionality and transaction signing
4. Wallet state is synchronized with user profile for a seamless experience

This dual approach ensures both secure user identity management and blockchain transaction capabilities.

## Deployment

Follow these steps to deploy TradesXBT to Vercel:

1. **Prepare for deployment**:
   ```bash
   npm run build
   ```

2. **Set up Vercel project**:
   - Create a new project in the Vercel dashboard
   - Link your GitHub repository
   - Configure the following environment variables:
     - All Clerk authentication variables 
     - Vercel KV connection details
     - API keys (CoinGecko, Anthropic)
   
3. **Deploy**:
   - Deploy from the Vercel dashboard or use the Vercel CLI:
   ```bash
   vercel --prod
   ```

4. **Post-deployment checks**:
   - Verify authentication flows
   - Confirm Redis caching is working
   - Test wallet connections
   - Check API integrations

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment) and [Vercel documentation](https://vercel.com/docs).

## License

MIT