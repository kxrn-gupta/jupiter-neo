"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  ExternalLink,
  ArrowRight,
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Token } from "../data/tokens";
import { sounds } from "../utils/sound";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  payToken: Token;
  receiveToken: Token;
  payAmount: number;
  receiveAmount: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  payToken,
  receiveToken,
  payAmount,
  receiveAmount,
}) => {
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShowReceipt(false);
      setCopied(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#14F195", "#9945FF", "#00C2FF"],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockTxSignature =
    "5Ubq" + Math.random().toString(36).substring(2, 10) + "8mPx9kL" + Math.random().toString(36).substring(2, 6);

  const handleCopyReceipt = () => {
    sounds.playClick();
    const text = `🪐 Swapped on Jupiter Neo:\n${payAmount} ${payToken.symbol} ➔ ${receiveAmount.toFixed(4)} ${receiveToken.symbol}\nRoute: Meteora DLMM (72%) + Orca (28%)\nTx: https://solscan.io/tx/${mockTxSignature}\nZero MEV Slippage via Jito Shield.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Just swapped ${payAmount} $${payToken.symbol} for ${receiveAmount.toFixed(2)} $${receiveToken.symbol} on Jupiter Neo! 🚀\nZero MEV slippage via Jito + split routing (Meteora DLMM + Orca).\n\nBuilt for @SuperteamEarn India Design Bounty by @kxrn_gupta`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0F1117] border border-[#14F195]/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(20,241,149,0.15)] text-center animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Checkmark Icon */}
        <div className="w-14 h-14 rounded-full bg-[#14F195]/15 border border-[#14F195]/40 mx-auto flex items-center justify-center mb-3 text-[#14F195]">
          <CheckCircle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">Transaction Confirmed</h3>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          Finalized in 390ms on Solana Mainnet-Beta
        </p>

        {/* Swapped details */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] flex items-center justify-between text-left">
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase">You Swapped</div>
            <div className="text-base font-bold text-white font-mono">
              {payAmount} {payToken.symbol}
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="text-right">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">You Received</div>
            <div className="text-base font-bold text-[#14F195] font-mono">
              +{receiveAmount.toFixed(receiveToken.price < 0.01 ? 4 : 2)} {receiveToken.symbol}
            </div>
          </div>
        </div>

        {/* Tx Signature */}
        <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Signature:</span>
          <a
            href={`https://solscan.io/tx/${mockTxSignature}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#00C2FF] hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            {mockTxSignature.slice(0, 10)}...{mockTxSignature.slice(-8)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Shareable Receipt Drawer / Card */}
        {showReceipt ? (
          <div className="mt-4 p-4 rounded-2xl bg-black/70 border border-[#14F195]/30 text-left font-mono space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-[10px] tracking-wider uppercase text-[#14F195] font-bold">
                Jupiter Neo Pro Receipt
              </span>
              <span className="text-[10px] text-zinc-500">JITO PROTECTED</span>
            </div>
            <div className="text-xs text-white space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Pair:</span>
                <span className="font-bold">{payToken.symbol} / {receiveToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Route:</span>
                <span className="text-[#00C2FF]">Meteora (72%) + Orca (28%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">MEV Slippage:</span>
                <span className="text-[#14F195]">0.00% (Protected)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Gas Used:</span>
                <span>0.000005 SOL ($0.0008)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleCopyReceipt}
                className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#14F195]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Receipt"}</span>
              </button>
              <a
                href={tweetIntent}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg bg-[#1D9BF0]/20 hover:bg-[#1D9BF0]/30 border border-[#1D9BF0]/40 text-xs font-mono text-[#1D9BF0] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on X</span>
              </a>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              sounds.playClick();
              setShowReceipt(true);
            }}
            className="mt-3 text-xs font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <Share2 className="w-3 h-3 text-[#14F195]" />
            <span>Generate Shareable PnL Receipt</span>
          </button>
        )}

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14F195] to-[#00C2FF] hover:opacity-90 text-black font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#14F195]/20 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
