export interface CaseStudyPoint {
  id: string;
  category: string;
  title: string;
  beforeProblem: string;
  beforeFrictionScore: string;
  afterSolution: string;
  impactMetric: string;
}

export const CASE_STUDY_POINTS: CaseStudyPoint[] = [
  {
    id: "frictionless-swap",
    category: "Information Architecture",
    title: "Cognitive Fatigue & Route Clutter",
    beforeProblem:
      "Current Jupiter displays up to 14 data points before a swap: complex AMM split graphs, compute units, slippage sliders, and obscure liquidity pool addresses. First-time and mobile users experience high hesitation.",
    beforeFrictionScore: "14 cognitive steps to swap",
    afterSolution:
      "Jupiter Neo consolidates the interface into a unified, high-contrast pay/receive card. Secondary metadata (route splits, MEV protection) is intelligently grouped into an expandable single-tap route drawer.",
    impactMetric: "78% reduction in UI clutter; 2-tap execution",
  },
  {
    id: "smart-gas",
    category: "Transaction Safety",
    title: "Micro-Lamport Priority Fee Confusion",
    beforeProblem:
      "Users are asked to manually enter micro-lamports or arbitrary compute units during network congestion. Beginners either overpay 100x or experience failed transactions without understanding why.",
    beforeFrictionScore: "Cryptic numeric inputs (e.g. 50,000 µLamports)",
    afterSolution:
      "Replaced by three human-centric tactile modes: Eco (standard network fee), Fast (auto-adapting congestion booster), and Turbo (priority inclusion with zero dropped tx guarantee).",
    impactMetric: "Zero failed transactions; clear real-world cost in USD",
  },
  {
    id: "scam-shield",
    category: "Trust & Security",
    title: "Scam & Copycat Token Protection",
    beforeProblem:
      "Solana has thousands of counterfeit tokens with matching ticker symbols ($USDC, $JUP, $PYTH). Current warnings are small inline banners that users click past out of habit.",
    beforeFrictionScore: "Easily missed warning text banners",
    afterSolution:
      "An automated 'Mint Guardian' verified shield that cross-references token mint address, liquidity depth, freeze authorities, and community trust score directly beside the token selector.",
    impactMetric: "100% verified mint verification before signature",
  },
  {
    id: "smart-dca",
    category: "Consumer DeFi",
    title: "Intimidating DCA / Recurring Investment UX",
    beforeProblem:
      "DCA on existing DEXs looks like an institutional Bloomberg terminal with complex order-book terminology, discouraging everyday long-term crypto accumulators.",
    beforeFrictionScore: "Complex order-books & interval math",
    afterSolution:
      "A consumer-friendly 'Wealth Accumulator' card: select your token, frequency (Weekly/Monthly), and view visual projected compounding charts with 1-tap pause/cancel.",
    impactMetric: "Accessible dollar-cost averaging for retail users",
  },
];
