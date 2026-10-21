export interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  balance: number;
  mint: string;
  decimals: number;
  verified: boolean;
  color: string;
  badge?: string;
}

export const POPULAR_TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    price: 160.25,
    change24h: 4.82,
    balance: 14.82,
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    verified: true,
    color: "#9945FF",
    badge: "Native",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: 0.01,
    balance: 420.5,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    verified: true,
    color: "#2775CA",
    badge: "Stablecoin",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    price: 1.18,
    change24h: 8.45,
    balance: 1250.0,
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    decimals: 6,
    verified: true,
    color: "#14F195",
    badge: "DEX Token",
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    price: 2.42,
    change24h: 11.3,
    balance: 180.0,
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    decimals: 6,
    verified: true,
    color: "#EC4899",
    badge: "Trending",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: 0.0000224,
    change24h: -1.2,
    balance: 5500000.0,
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
    verified: true,
    color: "#F59E0B",
    badge: "Community",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    price: 2.14,
    change24h: 3.1,
    balance: 84.0,
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    decimals: 6,
    verified: true,
    color: "#06B6D4",
    badge: "DEX",
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    price: 0.38,
    change24h: 2.15,
    balance: 500.0,
    mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    decimals: 6,
    verified: true,
    color: "#8B5CF6",
    badge: "Oracle",
  },
  {
    symbol: "POPCAT",
    name: "Popcat",
    price: 1.28,
    change24h: 6.4,
    balance: 310.0,
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    decimals: 9,
    verified: true,
    color: "#F97316",
    badge: "Memecoin",
  },
];
