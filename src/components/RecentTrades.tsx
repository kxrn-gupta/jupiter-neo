"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, Zap, ExternalLink, Copy, Check } from "lucide-react";
import { sounds } from "../utils/sound";

interface Trade {
  id: string;
  wallet: string;
  from: string;
  fromAmount: string;
  to: string;
  toAmount: string;
  usdValue: string;
  route: string;
  timeAgo: string;
}

const LIVE_TRADES: Trade[] = [
  {
    id: "tx-1",
    wallet: "9wFF...k2Q1",
    from: "SOL",
    fromAmount: "12.50",
    to: "USDC",
    toAmount: "2,003.12",
    usdValue: "$2,003",
    route: "Meteora + Orca",
    timeAgo: "1s ago",
  },
  {
    id: "tx-2",
    wallet: "3nXY...p90Z",
    from: "USDC",
    fromAmount: "850.00",
    to: "JUP",
    toAmount: "720.33",
    usdValue: "$850",
    route: "Raydium CPMM",
    timeAgo: "4s ago",
  },
  {
    id: "tx-3",
    wallet: "4mKJ...81qA",
    from: "SOL",
    fromAmount: "4.80",
    to: "BONK",
    toAmount: "34.2M",
    usdValue: "$769",
    route: "Orca Whirlpool",
    timeAgo: "9s ago",
  },
  {
    id: "tx-4",
    wallet: "8xL2...00vB",
    from: "PYTH",
    fromAmount: "1,200",
    to: "SOL",
    toAmount: "2.84",
    usdValue: "$456",
    route: "Meteora DLMM",
    timeAgo: "17s ago",
  },
  {
    id: "tx-5",
    wallet: "2vQR...5xP9",
    from: "WIF",
    fromAmount: "350.0",
    to: "USDC",
    toAmount: "857.50",
    usdValue: "$857",
    route: "Phoenix Orderbook",
    timeAgo: "23s ago",
  },
  {
    id: "tx-6",
    wallet: "7jKP...1wX4",
    from: "SOL",
    fromAmount: "25.00",
    to: "USDC",
    toAmount: "4,006.25",
    usdValue: "$4,006",
    route: "Meteora DLMM 85% + Lifinity 15%",
    timeAgo: "31s ago",
  },
  {
    id: "tx-7",
    wallet: "5mTN...98kL",
    from: "JUP",
    fromAmount: "2,500",
    to: "SOL",
    toAmount: "18.42",
    usdValue: "$2,951",
    route: "Raydium CLMM",
    timeAgo: "44s ago",
  },
];

interface RecentTradesProps {
  onNotify?: (toast: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    txHash?: string;
  }) => void;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ onNotify }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHash = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    const hash = `5xJk9P2m8WqL4nR6sT1vY7zB3cM0eA_${id}`;
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    if (onNotify) {
      onNotify({
        type: "info",
        title: "Transaction Signature Copied",
        description: `Tx ${hash.slice(0, 10)}... copied to clipboard for verification`,
        txHash: hash,
      });
    }
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full rounded-3xl bg-[#0B0D13]/80 border border-white/[0.06] p-4 sm:p-5 backdrop-blur-xl">
      {/* Header with Dual-Ring Radar Pulse Live Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195] shadow-[0_0_8px_#14F195]"></span>
          </span>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase">
              Live Ecosystem Execution Feed
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20">
              WS: CONNECTED
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">Auto-updating · 390ms slot</span>
      </div>

      {/* Scrollable Feed with Sleek Minimalist Custom Scrollbar */}
      <div className="mt-3 max-h-[175px] overflow-y-auto pr-1.5 custom-scrollbar space-y-1.5">
        {LIVE_TRADES.map((trade, idx) => {
          // Highlight row #2 as human interactive state demonstration
          const isSimulatedActive = idx === 1;

          return (
            <div
              key={trade.id}
              onClick={() => sounds.playClick()}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all cursor-pointer group ${
                isSimulatedActive
                  ? "bg-white/[0.06] border-white/[0.14] ring-1 ring-[#14F195]/30 shadow-[0_0_12px_rgba(20,241,149,0.06)]"
                  : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 text-[11px] group-hover:text-zinc-200 transition-colors">
                  {trade.wallet}
                </span>
                <div className="flex items-center gap-1 font-semibold text-white">
                  <span>{trade.fromAmount} {trade.from}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                  <span className="text-emerald-400">{trade.toAmount} {trade.to}</span>
                </div>
                {isSimulatedActive && (
                  <span className="hidden md:inline-flex text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Inspecting Route
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="hidden sm:inline text-zinc-300 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                  {trade.route}
                </span>
                <span className="font-bold text-white">{trade.usdValue}</span>
                <span className="text-zinc-400">{trade.timeAgo}</span>
                <button
                  onClick={(e) => handleCopyHash(trade.id, e)}
                  title="Copy Transaction Signature"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  {copiedId === trade.id ? (
                    <Check className="w-3 h-3 text-[#14F195]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
