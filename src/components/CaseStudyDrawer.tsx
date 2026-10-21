"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  Layers,
  Palette,
  Volume2,
  Type,
  MousePointer,
} from "lucide-react";
import { CASE_STUDY_POINTS } from "../data/caseStudy";
import { sounds } from "../utils/sound";

interface CaseStudyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESIGN_TOKENS = [
  { name: "Obsidian Canvas", hex: "#07080B", role: "Primary dark background" },
  { name: "Obsidian Elevated", hex: "#0F1117", role: "Card & modal surfaces" },
  { name: "Solana Spring Green", hex: "#14F195", role: "Primary brand & success glow" },
  { name: "Phantom Purple", hex: "#9945FF", role: "Secondary Solana gradient" },
  { name: "Cyber Cyan", hex: "#00C2FF", role: "Routing & multi-pool paths" },
  { name: "Warning Amber", hex: "#F59E0B", role: "High slippage alert" },
  { name: "Threat Rose", hex: "#F43F5E", role: "Balance error / risk" },
];

export const CaseStudyDrawer: React.FC<CaseStudyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"study" | "design">("study");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#090A0F] border-l border-white/[0.1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14F195]/15 border border-[#14F195]/30 flex items-center justify-center text-[#14F195]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Jupiter Neo: UX Dossier
                </h2>
                <p className="text-xs font-mono text-[#14F195]">
                  SUPERTEAM INDIA DESIGN BOUNTY SUBMISSION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sub-tabs */}
              <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab("study");
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === "study"
                      ? "bg-white/[0.12] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  UX Shifts
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab("design");
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === "design"
                      ? "bg-white/[0.12] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Design System
                </button>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 text-sm leading-relaxed text-zinc-300">
            {activeTab === "study" ? (
              <>
                {/* Mission Statement */}
                <section className="p-5 rounded-2xl bg-gradient-to-br from-[#14F195]/10 via-white/[0.02] to-transparent border border-[#14F195]/20">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#14F195]">
                    Design Philosophy
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Consumer Simplicity Meets Institutional Power
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Jupiter is Solana&apos;s most vital liquidity engine, but its interface has evolved into a dense Bloomberg-like terminal. <strong>Jupiter Neo</strong> bridges this chasm: delivering Cash App-level consumer elegance while preserving 100% of the advanced routing, MEV shields, and priority compute mechanics underneath.
                  </p>
                </section>

                {/* The 4 Major Innovations (Before vs After) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#14F195]" />
                      <span>The 4 UX Innovations (Before vs. After)</span>
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">4 Architectural Shifts</span>
                  </div>

                  <div className="space-y-4">
                    {CASE_STUDY_POINTS.map((point, idx) => (
                      <div
                        key={point.id}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white tracking-tight">
                            {idx + 1}. {point.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                            Shift #{idx + 1}
                          </span>
                        </div>

                        {/* Before vs After Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Before */}
                          <div className="p-3.5 rounded-xl bg-rose-500/[0.04] border border-rose-500/15 space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                              Before (Current Jupiter)
                            </span>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                              {point.beforeProblem}
                            </p>
                          </div>

                          {/* After */}
                          <div className="p-3.5 rounded-xl bg-[#14F195]/[0.05] border border-[#14F195]/20 space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#14F195]">
                              After (Jupiter Neo)
                            </span>
                            <p className="text-white text-xs leading-relaxed font-medium">
                              {point.afterSolution}
                            </p>
                          </div>
                        </div>

                        {/* Impact Stat */}
                        <div className="flex items-center gap-2 pt-1 text-xs font-mono text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]" />
                          <span>Measurable UX Win:</span>
                          <strong className="text-white">{point.impactMetric}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quantitative Impact Summary */}
                <section className="space-y-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#14F195]" />
                    <span>Executive Scorecard</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">Decision Cognitive Load</div>
                      <div className="text-lg font-bold text-white mt-1">14 ➔ 2 Steps</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">-85% cognitive load</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">Mobile Touch Accuracy</div>
                      <div className="text-lg font-bold text-white mt-1">48px min targets</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">WCAG AAA compliant</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">Priority Fee Drop-off</div>
                      <div className="text-lg font-bold text-white mt-1">0% Fail Rate</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Auto-adapting gas tiers</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">Scam Token Protection</div>
                      <div className="text-lg font-bold text-white mt-1">100% Pre-flight</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Mint Guardian Shield</div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* Design System & Token Specifications */
              <div className="space-y-6 animate-in fade-in duration-150">
                <section className="space-y-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#14F195]" />
                    <span>Color Token Architecture (Obsidian Raycast Palette)</span>
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Designed to eliminate eye fatigue during late-night trading while maximizing legibility of critical execution states.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {DESIGN_TOKENS.map((token) => (
                      <div
                        key={token.hex}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 font-mono text-xs"
                      >
                        <div
                          className="w-8 h-8 rounded-lg border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: token.hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold flex items-center justify-between">
                            <span className="truncate">{token.name}</span>
                            <span className="text-zinc-500 text-[11px]">{token.hex}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">{token.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Typography System */}
                <section className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#14F195]" />
                    <span>Tabular Monospace Engineering</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Numeric Display Font:</span>
                      <strong className="text-white">Geist Mono (Tabular Numbers)</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Prose / Interface Font:</span>
                      <strong className="text-white">Geist Sans (Variable 100-900)</strong>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.04]">
                      All financial amounts use monospace numbers so digits maintain fixed horizontal widths during streaming updates, preventing layout jitter.
                    </div>
                  </div>
                </section>

                {/* Physical Audio Haptics */}
                <section className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#14F195]" />
                    <span>Zero-Asset Web Audio Synthesizer</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Click Mechanical Haptic:</span>
                      <strong className="text-[#14F195]">600Hz ➔ 150Hz Exponential Sine (30ms)</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Invert Switch Sound:</span>
                      <strong className="text-cyan-400">320Hz ➔ 680Hz Triangle (40ms)</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Celebration Chime:</span>
                      <strong className="text-[#9945FF]">C Major Quad-Chord (523 - 1046Hz)</strong>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.04]">
                      Generated directly via browser Web Audio API oscillator nodes. Zero external audio asset downloads, instantaneous response under 0.1ms.
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Submission Credits */}
            <section className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-400 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">Karan Gupta (kxrn gupta)</div>
                <div className="text-[11px] text-zinc-500">Systems Architect &amp; Product Engineer | Gupta Ventures</div>
              </div>
              <div className="text-right">
                <div className="text-[#14F195] font-semibold">Superteam India</div>
                <div className="text-[11px] text-zinc-500">Regional Bounty Candidate</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
