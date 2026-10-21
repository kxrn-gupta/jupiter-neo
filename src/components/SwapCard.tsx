"use client";

import React, { useState } from "react";
import {
  ArrowDownUp,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  ChevronDown,
  Info,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Token, POPULAR_TOKENS } from "../data/tokens";
import { TokenSelectModal } from "./TokenSelectModal";
import { SettingsModal } from "./SettingsModal";
import { RouteModal } from "./RouteModal";
import { SuccessModal } from "./SuccessModal";

import { sounds } from "../utils/sound";

interface SwapCardProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
  selectedSymbol?: string;
  payToken?: Token;
  receiveToken?: Token;
  onPayTokenChange?: (token: Token) => void;
  onReceiveTokenChange?: (token: Token) => void;
  onNotify?: (toast: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    txHash?: string;
  }) => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  walletConnected,
  onConnectWallet,
  selectedSymbol,
  payToken: propsPayToken,
  receiveToken: propsReceiveToken,
  onPayTokenChange,
  onReceiveTokenChange,
  onNotify,
}) => {
  const [internalPayToken, setInternalPayToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [internalReceiveToken, setInternalReceiveToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC

  const payToken = propsPayToken || internalPayToken;
  const receiveToken = propsReceiveToken || internalReceiveToken;

  const setPayToken = (t: Token) => {
    if (onPayTokenChange) onPayTokenChange(t);
    else setInternalPayToken(t);
  };

  const setReceiveToken = (t: Token) => {
    if (onReceiveTokenChange) onReceiveTokenChange(t);
    else setInternalReceiveToken(t);
  };

  const [payAmount, setPayAmount] = useState<string>("5");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [priorityFee, setPriorityFee] = useState<"eco" | "fast" | "turbo">("turbo");
  const [mevProtection, setMevProtection] = useState<boolean>(true);

  // Modals state
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [tokenModalTarget, setTokenModalTarget] = useState<"pay" | "receive">("pay");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRouteOpen, setIsRouteOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isSimExpanded, setIsSimExpanded] = useState<boolean>(false);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  React.useEffect(() => {
    setIsRouting(true);
    const t = setTimeout(() => {
      setIsRouting(false);
    }, 380);
    return () => clearTimeout(t);
  }, [payToken.symbol, receiveToken.symbol, payAmount]);

  const numericPay = parseFloat(payAmount) || 0;
  // Calculate relative output based on mock USD price
  const receiveAmount =
    numericPay > 0 && receiveToken.price > 0
      ? (numericPay * payToken.price) / receiveToken.price
      : 0;

  const payUsd = numericPay * payToken.price;
  const receiveUsd = receiveAmount * receiveToken.price;

  const handleFlipTokens = () => {
    sounds.playSwitch();
    const tempPay = payToken;
    const tempReceive = receiveToken;
    setPayToken(tempReceive);
    setReceiveToken(tempPay);
  };

  const handleExecuteSwap = () => {
    if (!walletConnected) {
      sounds.playClick();
      onConnectWallet();
      return;
    }
    sounds.playClick();
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      sounds.playSuccess();
      setIsSuccessOpen(true);
      if (onNotify) {
        onNotify({
          type: "success",
          title: `Swap Confirmed: ${numericPay} ${payToken.symbol} → ${receiveAmount.toFixed(2)} ${receiveToken.symbol}`,
          description: "Meteora DLMM 72% + Orca 28% · Settled in 390ms",
          txHash: "5xJk8P2m9WqL4nR6sT1vY7zB3cM0eA9F",
        });
      }
    }, 1200);
  };

  const handleSimulateReject = () => {
    sounds.playError();
    if (onNotify) {
      onNotify({
        type: "error",
        title: "Transaction Rejected by User",
        description: "Signature request rejected in Phantom Wallet (Error 4001)",
      });
    }
  };

  const isInsufficient = numericPay > payToken.balance;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Container with tactile border & obsidian backdrop */}
      <div className="relative rounded-3xl bg-[#0B0D13]/90 border border-white/[0.08] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all">
        {/* Card Header: Tabs & Quick Settings */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Instant Swap</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Priority Pill */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
              title="Priority Gas Speed"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="uppercase text-[11px] font-semibold">{priorityFee}</span>
            </button>

            {/* Quick Slippage Pill with Interactive Tooltip Indicator */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#14F195]/40 hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors group cursor-pointer"
              title="Click to customize Slippage & MEV execution settings"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#14F195]" />
              <span className="text-[11px] font-semibold">{slippage}%</span>
              <Info className="w-2.5 h-2.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Input: You Pay Section */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors focus-within:border-[#14F195]/50">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium text-zinc-200">You Pay</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-zinc-300">Balance: {payToken.balance.toLocaleString()} {payToken.symbol}</span>
              <button
                onClick={() => setPayAmount((payToken.balance / 2).toString())}
                className="px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-[10px] font-semibold transition-colors"
              >
                HALF
              </button>
              <button
                onClick={() => setPayAmount(payToken.balance.toString())}
                className="px-1.5 py-0.5 rounded bg-[#14F195]/15 hover:bg-[#14F195]/25 text-[#14F195] text-[10px] font-semibold transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-medium text-white placeholder-zinc-500 focus:outline-none tracking-tight"
            />

            {/* Token Selector Button */}
            <button
              onClick={() => {
                setTokenModalTarget("pay");
                setIsTokenModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold text-sm transition-all shrink-0"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: payToken.color }}
              >
                {payToken.symbol[0]}
              </div>
              <span>{payToken.symbol}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>≈ ${payUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
            {isInsufficient && (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Insufficient balance
              </span>
            )}
          </div>
        </div>

        {/* Center Switch Button */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="w-full border-t border-white/[0.06] absolute inset-x-0" />
          <button
            onClick={handleFlipTokens}
            className="relative z-10 w-9 h-9 rounded-full bg-[#12141A] border border-white/[0.15] hover:border-[#14F195]/60 hover:scale-105 active:scale-95 flex items-center justify-center text-zinc-300 hover:text-white shadow-lg transition-all duration-150"
            title="Invert Token Pair"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* Output: You Receive Section */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors focus-within:border-[#14F195]/50">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium text-zinc-200">You Receive (Estimated)</span>
            <span className="font-mono text-[11px] text-zinc-300">
              Balance: {receiveToken.balance.toLocaleString()} {receiveToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {isRouting ? (
              <div className="flex items-center gap-2.5 py-1">
                <div className="h-8 w-32 shimmer-bone rounded-lg" />
                <span className="text-[11px] font-mono text-zinc-400 animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-ping" />
                  Routing best quote...
                </span>
              </div>
            ) : (
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[#14F195] tracking-tight">
                {receiveAmount > 0
                  ? receiveAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })
                  : "0.00"}
              </div>
            )}

            {/* Token Selector Button */}
            <button
              onClick={() => {
                setTokenModalTarget("receive");
                setIsTokenModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold text-sm transition-all shrink-0"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: receiveToken.color }}
              >
                {receiveToken.symbol[0]}
              </div>
              <span>{receiveToken.symbol}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>≈ ${receiveUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
            <span className="text-emerald-400 font-medium">1 {payToken.symbol} ≈ {(payToken.price / receiveToken.price).toFixed(2)} {receiveToken.symbol}</span>
          </div>
        </div>

        {/* Best Route Preview Pill with Dynamic Routing Shimmer */}
        <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs transition-all">
          <div className="flex items-center gap-2 text-zinc-300">
            <GitBranch className={`w-3.5 h-3.5 ${isRouting ? "text-[#14F195] animate-spin" : "text-[#14F195]"}`} />
            <span className="font-medium text-zinc-200">Route:</span>
            {isRouting ? (
              <span className="text-[#14F195] font-mono text-[11px] animate-pulse">
                Simulating optimal DLMM &amp; CLMM hops...
              </span>
            ) : (
              <span className="text-zinc-300 font-mono text-[11px]">
                Meteora DLMM (72%) + Orca (28%)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsRouteOpen(true)}
            className="text-[11px] font-mono text-[#00C2FF] hover:underline font-medium"
          >
            Inspect Route ➔
          </button>
        </div>

        {/* Fee & Slippage Protection Summary */}
        <div className="mt-3 px-2 py-1 space-y-1.5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-medium">Price Impact</span>
            <span className="text-emerald-400 font-semibold">&lt; 0.01%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-medium">Max Slippage Guarantee</span>
            <span className="text-zinc-200 font-medium">{slippage}% ({((1 - slippage / 100) * receiveAmount).toFixed(2)} {receiveToken.symbol})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-medium">Estimated Network Fee</span>
            <span className="text-zinc-200 font-medium">~0.000005 SOL (&lt; $0.001)</span>
          </div>
        </div>

        {/* Pre-Flight Transaction Simulation Drawer (Blowfish / Phantom Style) */}
        <div className="mt-4 p-3 rounded-2xl bg-zinc-900/40 border border-white/[0.06] hover:border-white/[0.1] transition-all">
          <div
            onClick={() => {
              sounds.playClick();
              setIsSimExpanded(!isSimExpanded);
            }}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Pre-Flight Simulation</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                  99.8% SUCCESS
                </span>
              </span>
            </div>
            <button className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 hover:text-white">
              <span>{isSimExpanded ? "Hide Preview" : "Inspect State Change"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSimExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          {isSimExpanded && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2 text-[11px] font-mono animate-in fade-in duration-150">
              {/* Balance Delta */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Simulated Balance Deltas</div>
                <div className="flex items-center justify-between text-rose-400 font-semibold">
                  <span className="text-zinc-300">Pay Balance:</span>
                  <span>-{numericPay} {payToken.symbol} (New: {Math.max(0, payToken.balance - numericPay).toFixed(3)})</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="text-zinc-300">Receive Balance:</span>
                  <span>+{receiveAmount.toFixed(4)} {receiveToken.symbol} (New: {(receiveToken.balance + receiveAmount).toFixed(3)})</span>
                </div>
              </div>

              {/* Low balance ATA Rent Alert if applicable */}
              {payToken.balance < 0.01 && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-300 text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>
                    <strong>Rent Guardian Alert:</strong> Account requires ~0.002039 SOL rent exemption to create Associated Token Account (ATA).
                  </span>
                </div>
              )}

              {/* State & Security Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-400 block font-medium">ATA Account:</span>
                  <span className={payToken.balance < 0.01 ? "text-amber-400 font-bold" : "text-white font-bold"}>
                    {payToken.balance < 0.01 ? "New (0.002039 SOL rent)" : "Initialized (0 rent fee)"}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-400 block font-medium">Compute Budget:</span>
                  <span className="text-[#14F195] font-bold">142,500 CU (Optimal)</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-400 block font-medium">Blockhash:</span>
                  <span className="text-white font-bold">Valid (150 slots left)</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-400 block font-medium">MEV Frontrunning:</span>
                  <span className="text-emerald-400 font-bold">0% Risk (Jito Tip)</span>
                </div>
              </div>

              {/* Edge Case & Unhappy Path Testing Controls */}
              <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-zinc-400">Simulation Scenarios:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateReject}
                    className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium transition-colors cursor-pointer"
                    title="Simulate user rejecting Phantom signature"
                  >
                    Simulate Wallet Reject (4001)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Swap Button */}
        <div className="mt-5">
          <button
            onClick={handleExecuteSwap}
            disabled={isSwapping || (walletConnected && isInsufficient)}
            className={`w-full py-4 rounded-2xl font-semibold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
              !walletConnected
                ? "bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black hover:opacity-90 shadow-[0_0_25px_rgba(20,241,149,0.3)]"
                : isInsufficient
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.06]"
                : "bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black hover:opacity-95 shadow-[0_0_30px_rgba(20,241,149,0.35)] active:scale-[0.99]"
            }`}
          >
            {isSwapping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Broadcasting to Solana...</span>
              </>
            ) : !walletConnected ? (
              <span>Connect Wallet to Swap</span>
            ) : isInsufficient ? (
              <span>Insufficient {payToken.symbol} Balance</span>
            ) : (
              <span>Swap {payToken.symbol} for {receiveToken.symbol}</span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      <TokenSelectModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        selectedTokenSymbol={
          tokenModalTarget === "pay" ? payToken.symbol : receiveToken.symbol
        }
        onSelectToken={(token) => {
          if (tokenModalTarget === "pay") {
            setPayToken(token);
          } else {
            setReceiveToken(token);
          }
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slippage={slippage}
        setSlippage={setSlippage}
        priorityFee={priorityFee}
        setPriorityFee={setPriorityFee}
        mevProtection={mevProtection}
        setMevProtection={setMevProtection}
      />

      <RouteModal
        isOpen={isRouteOpen}
        onClose={() => setIsRouteOpen(false)}
        payToken={payToken}
        receiveToken={receiveToken}
        payAmount={numericPay}
        receiveAmount={receiveAmount}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        payToken={payToken}
        receiveToken={receiveToken}
        payAmount={numericPay}
        receiveAmount={receiveAmount}
      />
    </div>
  );
};
