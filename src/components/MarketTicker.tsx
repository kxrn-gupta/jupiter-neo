"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import { sounds } from "../utils/sound";

interface TickerToken {
  symbol: string;
  name: string;
  price: string;
  change: number;
  sparkline: number[];
  color: string;
}

const TRENDING: TickerToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    price: "$160.25",
    change: 4.82,
    sparkline: [40, 45, 42, 48, 52, 58, 62],
    color: "#9945FF",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    price: "$1.18",
    change: 8.45,
    sparkline: [20, 22, 25, 24, 28, 30, 35],
    color: "#14F195",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: "$0.0000224",
    change: -1.2,
    sparkline: [50, 48, 49, 45, 46, 44, 43],
    color: "#F59E0B",
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    price: "$2.42",
    change: 11.3,
    sparkline: [30, 32, 38, 42, 45, 52, 58],
    color: "#EC4899",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    price: "$2.14",
    change: 3.1,
    sparkline: [25, 26, 28, 27, 29, 31, 33],
    color: "#06B6D4",
  },
  {
    symbol: "PYTH",
    name: "Pyth",
    price: "$0.38",
    change: 2.15,
    sparkline: [15, 16, 15, 17, 18, 19, 20],
    color: "#8B5CF6",
  },
];

export const MarketTicker: React.FC<{ onSelectSymbol?: (sym: string) => void }> = ({
  onSelectSymbol,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#0B0D13]/80 border border-white/[0.06] p-3 backdrop-blur-xl flex items-center gap-3 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold shrink-0">
        <Flame className="w-3.5 h-3.5" />
        <span>TRENDING</span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        {TRENDING.map((token) => {
          const isUp = token.change >= 0;
          return (
            <button
              key={token.symbol}
              onClick={() => {
                sounds.playClick();
                if (onSelectSymbol) onSelectSymbol(token.symbol);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.12] transition-all shrink-0 cursor-pointer text-left"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white"
                style={{ backgroundColor: token.color }}
              >
                {token.symbol[0]}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white font-mono">{token.symbol}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{token.price}</span>
                </div>
              </div>

              {/* Sparkline mini SVG */}
              <svg className="w-10 h-4" viewBox="0 0 70 30">
                <polyline
                  fill="none"
                  stroke={isUp ? "#14F195" : "#F43F5E"}
                  strokeWidth="2"
                  points={token.sparkline.map((v, i) => `${i * 11},${30 - (v / 65) * 28}`).join(" ")}
                />
              </svg>

              <span
                className={`text-[10px] font-mono font-semibold flex items-center ${
                  isUp ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isUp ? "+" : ""}
                {token.change}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
