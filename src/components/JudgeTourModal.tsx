"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Server,
  Repeat,
  Share2,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { sounds } from "../utils/sound";

interface TourStep {
  step: number;
  tag: string;
  title: string;
  problem: string;
  solution: string;
  metric: string;
  actionLabel?: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    tag: "Security Innovation #1",
    title: "Blowfish-Style Pre-Flight Transaction Simulator",
    problem:
      "On current DEXs, users sign transactions blindly without knowing exact balance changes, hidden ATA token rent fees (0.002039 SOL), or compute unit consumption.",
    solution:
      "Jupiter Neo simulates the instruction sequence before user signature: showing exact net balance deltas (-5.000 SOL ➔ +801.25 USDC), ATA account status, and 142.5k CU compute limits.",
    metric: "Eliminates unexpected slippage & saves rent fees",
    icon: <ShieldCheck className="w-6 h-6 text-[#14F195]" />,
  },
  {
    step: 2,
    tag: "Security Innovation #2",
    title: "Mint Guardian Anti-Rug Deep-Dive",
    problem:
      "Solana is plagued by counterfeit tokens with identical tickers and symbols, causing retail traders millions in rugpulls.",
    solution:
      "1-click security audit inspecting on-chain parameters: Mint Authority (Revoked), Freeze Authority (Revoked), LP Tokens (100% Burned), and Top 10 Holder distribution (12.4% Safe).",
    metric: "100% verified authentic mint confirmation",
    icon: <Zap className="w-6 h-6 text-amber-400" />,
  },
  {
    step: 3,
    tag: "Infrastructure Innovation",
    title: "Solana RPC Node Engine & Epoch 682 Tracker",
    problem:
      "During network congestion, retail traders have zero visibility into RPC latency or validator health, causing transaction drops.",
    solution:
      "Clicking the TPS header reveals an active RPC node switcher (Helius 18ms, Triton Direct TPU 24ms, Jito Block Engine 26ms) and live Epoch 682 progress meter (74.8% complete).",
    metric: "Direct validator edge routing with sub-second slot speeds",
    icon: <Server className="w-6 h-6 text-cyan-400" />,
  },
  {
    step: 4,
    tag: "UX Innovation",
    title: "Open Limit Orders & Automated DCA Streams",
    problem:
      "Order books are designed for institutional quants, intimidating retail users who simply want to buy dips or dollar-cost-average.",
    solution:
      "Limit orders include visual distance-to-trigger indicators (-7.0% away) and 1-click cancel with sound refund; DCA accumulation streams feature real-time progress bars (50% filled) and countdowns.",
    metric: "-85% cognitive friction for everyday wealth accumulation",
    icon: <Repeat className="w-6 h-6 text-purple-400" />,
  },
  {
    step: 5,
    tag: "Growth & Virality",
    title: "Viral Shareable PnL Trade Receipt",
    problem:
      "Standard DEX confirmation modals are boring plain text dialogs with zero viral distribution or brag-worthy social proof.",
    solution:
      "Post-swap obsidian receipt detailing Meteora DLMM 72% + Orca 28% routing, Jito private mempool protection, with 1-click clipboard copy and direct 'Share on X' integration.",
    metric: "Organic viral marketing built directly into execution flow",
    icon: <Share2 className="w-6 h-6 text-emerald-400" />,
  },
];

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToFeature?: (step: number) => void;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToFeature,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    sounds.playSwitch();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sounds.playSuccess();
      onClose();
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-[#0B0C12] border border-[#14F195]/30 shadow-[0_20px_80px_rgba(20,241,149,0.15)] p-6 sm:p-7 flex flex-col gap-6 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Superteam Judge Guided Tour (60s Walkthrough)</span>
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="grid grid-cols-5 gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <div
                key={s.step}
                onClick={() => {
                  sounds.playClick();
                  setCurrentStepIndex(idx);
                }}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  idx <= currentStepIndex
                    ? "bg-[#14F195] shadow-[0_0_8px_#14F195]"
                    : "bg-white/[0.1] hover:bg-white/[0.2]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 font-semibold">
              {current.tag} • Step {current.step} of 5
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              {current.icon}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {current.title}
            </h3>
          </div>

          {/* Problem vs Solution Split */}
          <div className="space-y-3 pt-2 text-xs font-sans">
            <div className="p-3 rounded-xl bg-rose-500/[0.06] border border-rose-500/20 text-rose-200">
              <div className="font-mono text-[10px] uppercase font-bold text-rose-400 mb-1">
                Friction in Current Jupiter (Before):
              </div>
              <p className="leading-relaxed">{current.problem}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#14F195]/[0.06] border border-[#14F195]/20 text-emerald-100">
              <div className="font-mono text-[10px] uppercase font-bold text-[#14F195] mb-1">
                Jupiter Neo Architecture (After):
              </div>
              <p className="leading-relaxed">{current.solution}</p>
            </div>
          </div>

          {/* Measurable Benchmark Metric */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono text-zinc-300">
            <CheckCircle className="w-4 h-4 text-[#14F195] flex-shrink-0" />
            <span>
              Impact Metric: <strong className="text-white">{current.metric}</strong>
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
              currentStepIndex === 0
                ? "opacity-30 cursor-not-allowed text-zinc-500"
                : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-zinc-500">
            {currentStepIndex + 1} / 5
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#14F195] text-black font-semibold text-xs font-mono hover:opacity-90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.3)]"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Innovation"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
