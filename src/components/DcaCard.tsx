"use client";

import React, { useState } from "react";
import {
  Repeat,
  Calendar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { POPULAR_TOKENS, Token } from "../data/tokens";
import { sounds } from "../utils/sound";

interface DcaStream {
  id: string;
  sourceSymbol: string;
  targetSymbol: string;
  amountPerOrder: number;
  frequency: "daily" | "weekly" | "monthly";
  totalOrders: number;
  completedOrders: number;
  accumulatedSol: number;
  totalAllocated: number;
  nextExecution: string;
  status: "active" | "paused";
}

export const DcaCard: React.FC = () => {
  const [amountPerOrder, setAmountPerOrder] = useState<string>("50");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [totalOrders, setTotalOrders] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<"create" | "streams">("create");

  const [streams, setStreams] = useState<DcaStream[]>([
    {
      id: "dca-1",
      sourceSymbol: "USDC",
      targetSymbol: "SOL",
      amountPerOrder: 50,
      frequency: "weekly",
      totalOrders: 4,
      completedOrders: 2,
      accumulatedSol: 0.624,
      totalAllocated: 200,
      nextExecution: "in 3d 14h",
      status: "active",
    },
  ]);

  const numericAmount = parseFloat(amountPerOrder) || 0;
  const totalAllocated = numericAmount * totalOrders;
  const solPrice = POPULAR_TOKENS[0].price; // 160.25
  const estimatedSolPerOrder = numericAmount / solPrice;
  const totalSolAccumulated = estimatedSolPerOrder * totalOrders;

  const handleStartDca = () => {
    sounds.playSuccess();
    const newStream: DcaStream = {
      id: `dca-${Date.now()}`,
      sourceSymbol: "USDC",
      targetSymbol: "SOL",
      amountPerOrder: numericAmount,
      frequency,
      totalOrders,
      completedOrders: 1,
      accumulatedSol: parseFloat(estimatedSolPerOrder.toFixed(3)),
      totalAllocated,
      nextExecution: frequency === "daily" ? "in 23h 59m" : frequency === "weekly" ? "in 6d 23h" : "in 29d",
      status: "active",
    };
    setStreams([newStream, ...streams]);
    setActiveTab("streams");
  };

  const handleToggleStream = (id: string) => {
    sounds.playClick();
    setStreams(
      streams.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
      )
    );
  };

  const handleCloseStream = (id: string) => {
    sounds.playSwitch();
    setStreams(streams.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-3xl bg-[#0B0D13]/90 border border-white/[0.08] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Header with Sub-tabs */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-[#9945FF]" />
              <span>Automated DCA</span>
            </span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("create");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "create"
                  ? "bg-white/[0.12] text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Setup
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("streams");
              }}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === "streams"
                  ? "bg-white/[0.12] text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Streams</span>
              {streams.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#9945FF]/30 text-[#9945FF] text-[9px] font-bold">
                  {streams.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <>
            {/* Target Asset Readout */}
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span>Target Asset:</span>
              <span className="text-white font-bold">SOL ($160.25 USD)</span>
            </div>

            {/* Allocate Amount per cycle */}
            <div className="mt-3 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
              <div className="text-xs text-zinc-400 mb-2 flex justify-between">
                <span className="font-medium text-zinc-300">Amount Per Buy</span>
                <span className="font-mono text-[11px]">USDC Wallet Balance: 420.50</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-2xl font-mono text-white font-medium">
                  <span className="text-zinc-400 text-lg font-medium">$</span>
                  <input
                    type="number"
                    value={amountPerOrder}
                    onChange={(e) => setAmountPerOrder(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-semibold text-xs font-mono">
                  USDC
                </div>
              </div>
            </div>

            {/* Cadence Frequency Selector */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-3">
              <div className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9945FF]" />
                  <span>Investment Cadence</span>
                </span>
                <span className="text-xs font-mono text-zinc-400 capitalize">{frequency} Orders</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["daily", "weekly", "monthly"] as const).map((cadence) => (
                  <button
                    key={cadence}
                    onClick={() => {
                      sounds.playClick();
                      setFrequency(cadence);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border uppercase transition-all ${
                      frequency === cadence
                        ? "bg-[#9945FF]/20 border-[#9945FF]/50 text-white font-bold"
                        : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    {cadence === "daily" ? "Daily" : cadence === "weekly" ? "Weekly" : "Monthly"}
                  </button>
                ))}
              </div>

              {/* Number of orders slider / pills */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-zinc-400">Total Cycles:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  {[2, 4, 8, 12].map((cycles) => (
                    <button
                      key={cycles}
                      onClick={() => {
                        sounds.playClick();
                        setTotalOrders(cycles);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        totalOrders === cycles
                          ? "bg-white/[0.12] border-white/20 text-white font-bold"
                          : "bg-white/[0.02] border-white/[0.04] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {cycles}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DCA Projection Card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#9945FF]/10 via-[#14F195]/5 to-transparent border border-[#9945FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Estimated Accumulation</div>
                  <div className="text-xl font-bold font-mono text-[#14F195]">
                    ≈ {totalSolAccumulated.toFixed(3)} SOL
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Total Investment</div>
                  <div className="text-lg font-bold font-mono text-white">
                    ${totalAllocated.toFixed(2)} USDC
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero fees on intermediate route swaps
                </span>
                <span>1-Tap Pause / Cancel</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5">
              <button
                onClick={handleStartDca}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-semibold text-sm tracking-wider uppercase hover:opacity-95 shadow-lg shadow-[#9945FF]/20 active:scale-[0.99] transition-all"
              >
                Start Automated DCA (${totalAllocated} USDC)
              </button>
            </div>
          </>
        ) : (
          /* Active Streams View */
          <div className="mt-4 space-y-3">
            {streams.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                No active DCA streams.
                <button
                  onClick={() => setActiveTab("create")}
                  className="block mx-auto mt-2 text-[#9945FF] hover:underline"
                >
                  Create your first stream ➔
                </button>
              </div>
            ) : (
              streams.map((stream) => {
                const progressPct = Math.round((stream.completedOrders / stream.totalOrders) * 100);
                return (
                  <div
                    key={stream.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            stream.status === "active" ? "bg-[#14F195] animate-pulse" : "bg-amber-400"
                          }`}
                        />
                        <span className="font-bold text-white">
                          Accumulating {stream.targetSymbol}
                        </span>
                        <span className="text-zinc-500 text-[10px]">(${stream.amountPerOrder} / {stream.frequency.replace("ly", "")})</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300">
                        {stream.completedOrders}/{stream.totalOrders} cycles
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Progress ({progressPct}%)</span>
                        <span className="text-[#14F195]">Accumulated: {stream.accumulatedSol} SOL</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195] transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        Next order {stream.nextExecution}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStream(stream.id)}
                          className="text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {stream.status === "active" ? (
                            <>
                              <Pause className="w-3 h-3 text-amber-400" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-emerald-400" />
                              <span>Resume</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCloseStream(stream.id)}
                          className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => setActiveTab("create")}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
            >
              + Create Another DCA Strategy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
