"use client";

import React, { useState } from "react";
import {
  ArrowDownUp,
  ShieldCheck,
  Target,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Layers,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { POPULAR_TOKENS, Token } from "../data/tokens";
import { sounds } from "../utils/sound";

interface LimitOrder {
  id: string;
  payAmount: number;
  paySymbol: string;
  receiveAmount: number;
  receiveSymbol: string;
  targetPrice: number;
  expiry: string;
  createdAt: string;
  status: "open" | "near_trigger";
}

export const LimitCard: React.FC = () => {
  const [payToken, setPayToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC
  const [receiveToken, setReceiveToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [payAmount, setPayAmount] = useState<string>("500");
  const [targetPrice, setTargetPrice] = useState<string>("152.00");
  const [expiry, setExpiry] = useState<string>("7d");
  const [activeTab, setActiveTab] = useState<"create" | "orders">("create");

  const [orders, setOrders] = useState<LimitOrder[]>([
    {
      id: "ord-1",
      payAmount: 300,
      paySymbol: "USDC",
      receiveAmount: 2.013,
      receiveSymbol: "SOL",
      targetPrice: 149.0,
      expiry: "5d left",
      createdAt: "2h ago",
      status: "open",
    },
  ]);

  const numericPay = parseFloat(payAmount) || 0;
  const numericTarget = parseFloat(targetPrice) || 1;
  const receiveAmount = numericPay / numericTarget;

  const currentSolPrice = receiveToken.price;
  const discountPercent = ((currentSolPrice - numericTarget) / currentSolPrice) * 100;

  const handlePlaceOrder = () => {
    sounds.playSuccess();
    const newOrder: LimitOrder = {
      id: `ord-${Date.now()}`,
      payAmount: numericPay,
      paySymbol: payToken.symbol,
      receiveAmount: parseFloat(receiveAmount.toFixed(4)),
      receiveSymbol: receiveToken.symbol,
      targetPrice: numericTarget,
      expiry: `${expiry} left`,
      createdAt: "Just now",
      status: Math.abs(discountPercent) < 3 ? "near_trigger" : "open",
    };
    setOrders([newOrder, ...orders]);
    setActiveTab("orders");
  };

  const handleCancelOrder = (id: string) => {
    sounds.playSwitch();
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-3xl bg-[#0B0D13]/90 border border-white/[0.08] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Header with Sub-tabs */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Limit Orders</span>
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
              Order Form
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("orders");
              }}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === "orders"
                  ? "bg-white/[0.12] text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Orders</span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <>
            {/* Market Price Indicator */}
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span>Current Market:</span>
              <span className="text-white font-bold">${currentSolPrice.toFixed(2)} USD</span>
            </div>

            {/* You Allocate (USDC) */}
            <div className="mt-3 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
              <div className="text-xs text-zinc-400 mb-2 flex justify-between">
                <span className="font-medium text-zinc-300">You Allocate</span>
                <span className="font-mono text-[11px]">Balance: 420.50 USDC</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-mono text-white focus:outline-none"
                />
                <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-semibold text-xs font-mono">
                  {payToken.symbol}
                </div>
              </div>
            </div>

            {/* Target Price Configuration */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Buy {receiveToken.symbol} At Price</span>
                </span>
                <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                  {discountPercent > 0
                    ? `${discountPercent.toFixed(1)}% below market`
                    : "Above market"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-2xl font-mono text-white font-medium">
                  <span className="text-zinc-400 text-lg">$</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase font-medium">USD per SOL</span>
              </div>

              {/* Quick Price Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { label: "-2%", val: (currentSolPrice * 0.98).toFixed(2) },
                  { label: "-5%", val: (currentSolPrice * 0.95).toFixed(2) },
                  { label: "-10%", val: (currentSolPrice * 0.9).toFixed(2) },
                  { label: "Market", val: currentSolPrice.toFixed(2) },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      sounds.playClick();
                      setTargetPrice(p.val);
                    }}
                    className="py-1 px-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-300 transition-colors border border-white/[0.06]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Output */}
            <div className="mt-4 p-4 rounded-2xl bg-[#14F195]/5 border border-[#14F195]/20 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase">
                  You Receive If Triggered
                </div>
                <div className="text-xl font-bold font-mono text-[#14F195]">
                  ≈ {receiveAmount.toFixed(4)} {receiveToken.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-zinc-400" /> Expiry
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {["24h", "7d", "1m"].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => {
                        sounds.playClick();
                        setExpiry(dur);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        expiry === dur
                          ? "bg-white/[0.15] text-white font-bold"
                          : "bg-white/[0.02] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5">
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-[#14F195] text-black font-semibold text-sm tracking-wider uppercase hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all"
              >
                Place Limit Order (${payAmount} {payToken.symbol})
              </button>
            </div>
          </>
        ) : (
          /* Active Orders View */
          <div className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                No active limit orders.
                <button
                  onClick={() => setActiveTab("create")}
                  className="block mx-auto mt-2 text-cyan-400 hover:underline"
                >
                  Create your first order ➔
                </button>
              </div>
            ) : (
              orders.map((ord) => {
                const diffPct = ((ord.targetPrice - currentSolPrice) / currentSolPrice) * 100;
                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-bold text-white">
                          Buy {ord.receiveAmount} {ord.receiveSymbol}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {ord.expiry}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
                      <div>
                        <span>Trigger: </span>
                        <strong className="text-white">${ord.targetPrice.toFixed(2)}</strong>
                        <span className="text-cyan-400 text-[10px] ml-1.5">
                          ({diffPct.toFixed(1)}% away)
                        </span>
                      </div>
                      <span className="text-zinc-400 text-[11px] font-medium">{ord.payAmount} {ord.paySymbol} allocated</span>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">Created {ord.createdAt}</span>
                      <button
                        onClick={() => handleCancelOrder(ord.id)}
                        className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancel Order</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => setActiveTab("create")}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
            >
              + Create Another Limit Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
