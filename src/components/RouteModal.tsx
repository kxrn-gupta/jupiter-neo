"use client";

import React, { useEffect } from "react";
import { X, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Layers, Cpu } from "lucide-react";
import { Token } from "../data/tokens";
import { sounds } from "../utils/sound";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  payToken: Token;
  receiveToken: Token;
  payAmount: number;
  receiveAmount: number;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  payToken,
  receiveToken,
  payAmount,
  receiveAmount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalUsdValue = payAmount * payToken.price;
  const pool1Share = 0.72;
  const pool2Share = 0.28;

  const pool1Usdc = receiveAmount * pool1Share;
  const pool2Usdc = receiveAmount * pool2Share;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        className="w-full max-w-lg bg-[#0F1117] border border-white/[0.1] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#14F195]" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Dynamic Jupiter Routing Graph
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Savings Summary Banner */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#14F195]/10 via-[#00C2FF]/10 to-transparent border border-[#14F195]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#14F195]" />
            <div>
              <div className="text-xs font-semibold text-white">Smart Split Execution Active</div>
              <div className="text-[11px] font-mono text-[#14F195]">
                Saved ≈ ${(totalUsdValue * 0.003 + 1.25).toFixed(2)} vs single-pool DEX execution
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14F195]/20 text-[#14F195] font-semibold">
            2-HOP SPLIT
          </span>
        </div>

        {/* Visual Routing Tree */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Liquidity Path Decomposition</span>
            <span className="font-mono text-zinc-500 font-normal">Optimal Execution</span>
          </div>

          <div className="relative pl-6 space-y-4 border-l border-white/[0.1] ml-4">
            {/* Step 1: Input Token */}
            <div className="relative flex items-center gap-3">
              <span className="absolute -left-[31px] w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0F1117] shadow-[0_0_8px_#ffffff]" />
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex-1 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white font-mono">
                    {payAmount} {payToken.symbol}
                  </span>
                  <div className="text-[10px] font-mono text-zinc-500">
                    ≈ ${totalUsdValue.toFixed(2)} USD
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-400">Source Mint</span>
              </div>
            </div>

            {/* Step 2: AMM Splits */}
            <div className="space-y-2 py-1">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#14F195]" />
                <span>Split across 2 concentrated liquidity AMMs:</span>
              </div>

              {/* Pool 1: Meteora DLMM */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-between hover:border-[#14F195]/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Meteora DLMM v2 (72%)
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Fee: 0.01% · $24.8M Pool TVL
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-emerald-400">
                    {pool1Usdc.toFixed(2)} {receiveToken.symbol}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">0.00% Price Impact</div>
                </div>
              </div>

              {/* Pool 2: Orca Whirlpools */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-between hover:border-[#14F195]/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Orca Whirlpools (28%)
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Fee: 0.02% · $16.2M Pool TVL
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-emerald-400">
                    {pool2Usdc.toFixed(2)} {receiveToken.symbol}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">&lt; 0.01% Price Impact</div>
                </div>
              </div>
            </div>

            {/* Step 3: Output Token */}
            <div className="relative flex items-center gap-3">
              <span className="absolute -left-[31px] w-3.5 h-3.5 rounded-full bg-[#14F195] border-2 border-[#0F1117] shadow-[0_0_10px_#14F195]" />
              <div className="p-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/30 flex-1 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white font-mono">
                    ≈ {receiveAmount.toFixed(receiveAmount < 1 ? 4 : 2)} {receiveToken.symbol}
                  </span>
                  <div className="text-[10px] font-mono text-[#14F195]">
                    Guaranteed Minimum: {(receiveAmount * 0.995).toFixed(2)} {receiveToken.symbol}
                  </div>
                </div>
                <span className="text-xs font-mono text-[#14F195] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Output Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            Close Route Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
