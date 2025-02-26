# TradesXBT Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npx next lint src/app/dashboard/page.tsx` - Lint specific file

## Authentication & Authorization
- TradesXBT uses Clerk for authentication
- Authentication middleware at `/src/middleware.ts`
- Public routes configuration in middleware
- Protected routes check for authentication
- Client-side: Use `useUser()` for user data
- Server-side: Use `currentUser()` for auth checks

## Data Visualization
- TradingView for candlestick & trading charts
- Recharts for metrics & analytics displays
- MetricsChart component for standardized charts

## Code Style
- **Imports**: Group imports by 1) React/Next.js, 2) Components, 3) Utils/Libs, 4) Types
- **Components**: Use named exports. Prefer functional components with explicit return types
- **Types**: Define interfaces for props and state. Use TypeScript strictly
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Folder Structure**: Group by feature in `src/app`, shared components in `src/components`
- **State Management**: Use React hooks. Context for global state
- **Tailwind**: Use utility classes directly, extract to custom components for reuse
- **API Calls**: Try/catch with explicit error handling, use loading states
- **Wallet Integration**: Always check connection state before transactions

## Redis Caching
- Use Vercel KV for Redis caching
- Import from `@/lib/redis-cache.ts` for caching utilities
- Cache invalidation handling in API routes
- Properly tag cache items for structured invalidation

## Environment Variables
- Store all API keys in `.env.local`
- Required keys for Clerk, Redis, CoinGecko, Anthropic

## Solana Best Practices
- Avoid raw address strings, prefer PublicKey objects
- Handle SOL amounts as LAMPORTS_PER_SOL (10^9) for calculations
- Error handling for RPC failures is essential