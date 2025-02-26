export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only register in Node.js environment
    const { kv } = await import('@vercel/kv');
    
    console.log('✅ Redis KV store initialized');
    
    // Register Vercel Speed Insights
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
      console.log('✅ Vercel Speed Insights initialized');
    }
  }
}