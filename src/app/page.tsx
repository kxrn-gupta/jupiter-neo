"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { TradingChart } from "../components/TradingChart";
import { MarketTicker } from "../components/MarketTicker";
import { RecentTrades } from "../components/RecentTrades";
import { SwapCard } from "../components/SwapCard";
import { LimitCard } from "../components/LimitCard";
import { DcaCard } from "../components/DcaCard";
import { CaseStudyDrawer } from "../components/CaseStudyDrawer";
import { DeviceSimulator } from "../components/DeviceSimulator";
import { JudgeTourModal } from "../components/JudgeTourModal";
import { CommandPalette } from "../components/CommandPalette";
import { WalletModal, WALLET_PROFILES, WalletProfile } from "../components/WalletModal";
import { RpcModal } from "../components/RpcModal";
import { ToastContainer, ToastData } from "../components/Toast";
import { ArrowRight, ShieldCheck, Zap, Layers, Sparkles, TrendingUp, CheckCircle, Smartphone, BookOpen } from "lucide-react";
import { Token, POPULAR_TOKENS } from "../data/tokens";
import { sounds } from "../utils/sound";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"swap" | "limit" | "dca">("swap");
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isMobileSimOpen, setIsMobileSimOpen] = useState<boolean>(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isRpcModalOpen, setIsRpcModalOpen] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [currentWalletProfile, setCurrentWalletProfile] = useState<WalletProfile>(WALLET_PROFILES[0]);
  const [isRpcHydrating, setIsRpcHydrating] = useState<boolean>(true);

  // Active Pair State
  const [payToken, setPayToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [receiveToken, setReceiveToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRpcHydrating(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const addToast = (data: Omit<ToastData, "id">) => {
    const id = "toast_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    const newToast: ToastData = { id, ...data };

    if (data.type === "success") sounds.playSuccess();
    else if (data.type === "error") sounds.playError();
    else sounds.playClick();

    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (msg: string, type: "success" | "error" | "warning" | "info" = "info") => {
    addToast({
      type,
      title: msg,
    });
  };

  const handleSelectTickerSymbol = (symbol: string) => {
    const found = POPULAR_TOKENS.find((t) => t.symbol === symbol);
    if (!found) return;

    if (payToken.symbol === symbol) {
      setReceiveToken(POPULAR_TOKENS[1]); // Set quote to USDC
    } else {
      setReceiveToken(found);
    }
    addToast({
      type: "info",
      title: `Chart & Swap: ${symbol}`,
      description: `Aggregated realtime liquidity curve for ${symbol}`,
    });
  };

  const handleSelectWalletProfile = (profile: WalletProfile) => {
    setCurrentWalletProfile(profile);
    setPayToken((prev) => {
      if (prev.symbol === "SOL") return { ...prev, balance: profile.solBalance };
      if (prev.symbol === "USDC") return { ...prev, balance: profile.usdcBalance };
      if (prev.symbol === "JUP") return { ...prev, balance: profile.jupBalance };
      return prev;
    });
    setReceiveToken((prev) => {
      if (prev.symbol === "SOL") return { ...prev, balance: profile.solBalance };
      if (prev.symbol === "USDC") return { ...prev, balance: profile.usdcBalance };
      if (prev.symbol === "JUP") return { ...prev, balance: profile.jupBalance };
      return prev;
    });
    addToast({
      type: "success",
      title: `Profile: ${profile.name}`,
      description: `Connected with ${profile.solBalance} SOL via ${profile.provider}`,
    });
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        sounds.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        sounds.playSuccess();
        setIsJudgeTourOpen((prev) => !prev);
      } else if (e.key === "x" || e.key === "X") {
        e.preventDefault();
        sounds.playSwitch();
        setPayToken(receiveToken);
        setReceiveToken(payToken);
        addToast({
          type: "info",
          title: `Inverted: ${receiveToken.symbol} ⇄ ${payToken.symbol}`,
          description: "Recalculating routing for inverted token pair",
        });
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        sounds.playClick();
        setIsInspectorOpen((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        sounds.playClick();
        setIsMobileSimOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsInspectorOpen(false);
        setIsMobileSimOpen(false);
        setIsJudgeTourOpen(false);
        setIsCommandPaletteOpen(false);
        setIsWalletModalOpen(false);
        setIsRpcModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [payToken, receiveToken]);

  // Primary base token for chart (always the non-stable asset, or receive token)
  const chartBaseToken =
    receiveToken.symbol === "USDC" ? payToken : receiveToken;
  const chartQuoteToken =
    receiveToken.symbol === "USDC" ? receiveToken : payToken;

  return (
    <div className="min-h-[100dvh] bg-[#07080B] text-white selection:bg-[#14F195]/30 selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Subtle Mathematical Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-b from-[#14F195]/[0.06] via-[#9945FF]/[0.02] to-transparent pointer-events-none blur-3xl" />

      {/* Sonner-Style Haptic Obsidian Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInspectorOpen={isInspectorOpen}
        setIsInspectorOpen={setIsInspectorOpen}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
        onOpenMobileSim={() => setIsMobileSimOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenRpcModal={() => setIsRpcModalOpen(true)}
        currentProfileSol={currentWalletProfile.solBalance}
        currentProfileShortAddress={currentWalletProfile.shortAddress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-36 flex flex-col gap-6 relative z-10">
        {/* RPC Hydration Shimmer Bar (App Launch & Sync Indicator) */}
        {isRpcHydrating && (
          <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-[#0E1118]/90 border border-[#14F195]/40 text-xs font-mono text-[#14F195] animate-shimmer shadow-[0_4px_20px_rgba(20,241,149,0.1)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
              <span className="font-semibold text-white">Hydrating Solana Mainnet-Beta State...</span>
              <span className="text-zinc-400 hidden sm:inline">Connecting via Triton Cluster</span>
            </div>
            <span className="text-[11px] font-bold text-[#14F195] bg-[#14F195]/10 px-2 py-0.5 rounded border border-[#14F195]/20">
              SLOT 310,924,192 · 390MS
            </span>
          </div>
        )}

        {/* Banner Pill: Superteam India Design Bounty Candidate */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
            <span className="text-xs font-mono font-medium text-zinc-300">
              Superteam India Design Bounty Submission — <strong>Jupiter Neo Pro Experience</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playSuccess();
                setIsJudgeTourOpen(true);
              }}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>60s Judge Tour</span>
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileSimOpen(true);
              }}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Mobile Viewport</span>
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => {
                sounds.playClick();
                setIsInspectorOpen(true);
              }}
              className="text-xs font-mono text-[#14F195] hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Inspect UX Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Live Trending Tokens Ticker Strip (Interactive) */}
        <MarketTicker onSelectSymbol={handleSelectTickerSymbol} />

        {/* Main Split Pro Dashboard (Left 60% : Right 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Trading Chart + Live Feed (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <TradingChart
              baseToken={chartBaseToken}
              quoteToken={chartQuoteToken}
            />
            <RecentTrades onNotify={addToast} />
          </div>

          {/* Right Column: Execution Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {(["swap", "limit", "dca"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium uppercase transition-all ${
                    activeTab === tab
                      ? "bg-white/[0.12] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Active Card */}
            <div className="w-full transition-all duration-200">
              {activeTab === "swap" && (
                <SwapCard
                  walletConnected={walletConnected}
                  onConnectWallet={() => setIsWalletModalOpen(true)}
                  payToken={payToken}
                  receiveToken={receiveToken}
                  onPayTokenChange={setPayToken}
                  onReceiveTokenChange={setReceiveToken}
                  onNotify={addToast}
                />
              )}

              {activeTab === "limit" && <LimitCard />}

              {activeTab === "dca" && <DcaCard />}
            </div>
          </div>
        </div>

        {/* Bottom Trust & Architecture Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">Routing Speed</div>
            <div className="text-base font-bold font-mono text-white mt-1">~390ms</div>
            <div className="text-[10px] font-mono text-emerald-400">Solana Slot 1</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">MEV Protected</div>
            <div className="text-base font-bold font-mono text-white mt-1">100% Private</div>
            <div className="text-[10px] font-mono text-emerald-400">Jito Bundle Shield</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">Priority Engine</div>
            <div className="text-base font-bold font-mono text-white mt-1">Dynamic Gas</div>
            <div className="text-[10px] font-mono text-emerald-400">Zero Dropped Tx</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">Mint Verification</div>
            <div className="text-base font-bold font-mono text-white mt-1">Pre-flight</div>
            <div className="text-[10px] font-mono text-emerald-400">Mint Guardian</div>
          </div>
        </div>
      </main>

      {/* Slide-over UX Case Study Drawer */}
      <CaseStudyDrawer
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Simulated Mobile Device Preview Modal */}
      <DeviceSimulator
        isOpen={isMobileSimOpen}
        onClose={() => setIsMobileSimOpen(false)}
        walletConnected={walletConnected}
        onConnectWallet={() => setIsWalletModalOpen(true)}
      />

      {/* 60-Second Superteam Judge Guided Tour */}
      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
      />

      {/* Raycast Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          showToast(`Switched view to ${tab.toUpperCase()}`);
        }}
        onOpenCaseStudy={() => setIsInspectorOpen(true)}
        onOpenMobileSim={() => setIsMobileSimOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenRpcModal={() => setIsRpcModalOpen(true)}
        onSelectToken={(token) => {
          handleSelectTickerSymbol(token.symbol);
        }}
        onInvertPair={() => {
          sounds.playSwitch();
          setPayToken(receiveToken);
          setReceiveToken(payToken);
          showToast(`Inverted: ${receiveToken.symbol} ⇄ ${payToken.symbol}`);
        }}
      />

      {/* Wallet Multi-Profile Switcher Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        currentProfile={currentWalletProfile}
        onSelectProfile={handleSelectWalletProfile}
        walletConnected={walletConnected}
        onDisconnect={() => {
          setWalletConnected(false);
          addToast({
            type: "warning",
            title: "Wallet Disconnected",
            description: "Session closed. Connect wallet to sign Solana transactions.",
          });
        }}
        onConnect={() => {
          setWalletConnected(true);
          addToast({
            type: "success",
            title: "Wallet Connected",
            description: `Session active: ${currentWalletProfile.provider} (${currentWalletProfile.solBalance} SOL)`,
          });
        }}
      />

      {/* Solana RPC Network & Node Health Modal */}
      <RpcModal
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        onSelectNode={(node) => {
          setIsRpcHydrating(true);
          setTimeout(() => setIsRpcHydrating(false), 500);
          addToast({
            type: "success",
            title: `RPC Node Connected: ${node.name}`,
            description: `Connected to ${node.region} · ${node.latencyMs}ms latency · Jito Mempool: ${node.isJitoProtected ? "Active" : "Standard"}`,
          });
        }}
      />

      {/* Power-User Keyboard Shortcuts Floating Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2.5 sm:gap-3 px-4 py-2 rounded-full bg-[#0A0B10]/95 border border-white/[0.14] shadow-[0_12px_45px_rgba(0,0,0,0.92)] backdrop-blur-2xl text-xs font-mono text-zinc-300 whitespace-nowrap">
        <span className="text-[10px] text-zinc-400 uppercase font-semibold flex-shrink-0">Shortcuts:</span>
        <button
          onClick={() => {
            sounds.playClick();
            setIsCommandPaletteOpen(true);
          }}
          className="flex items-center gap-1 hover:text-white transition-colors flex-shrink-0 whitespace-nowrap cursor-pointer"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10px] border border-white/10 font-bold">⌘K</kbd>
          <span>Actions</span>
        </button>
        <span className="text-zinc-500 flex-shrink-0">·</span>
        <button
          onClick={() => {
            sounds.playSuccess();
            setIsJudgeTourOpen(true);
          }}
          className="flex items-center gap-1 hover:text-amber-300 text-amber-400 transition-colors flex-shrink-0 whitespace-nowrap cursor-pointer"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30 font-bold">T</kbd>
          <span>Judge Tour</span>
        </button>
        <span className="text-zinc-500 flex-shrink-0">·</span>
        <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10px] border border-white/10 font-bold">X</kbd>
          <span>Invert</span>
        </span>
        <span className="text-zinc-500 flex-shrink-0">·</span>
        <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10px] border border-white/10 font-bold">C</kbd>
          <span>Case Study</span>
        </span>
        <span className="text-zinc-500 flex-shrink-0">·</span>
        <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10px] border border-white/10 font-bold">M</kbd>
          <span>Mobile</span>
        </span>
        <span className="text-zinc-500 flex-shrink-0">·</span>
        <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10px] border border-white/10 font-bold">Esc</kbd>
          <span>Close</span>
        </span>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-8 px-4 sm:px-6 text-center text-xs font-mono text-zinc-400 relative z-10 pb-28 sm:pb-24">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Jupiter Neo — Crafted by Karan Gupta (Gupta Ventures)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="text-[#14F195] hover:underline cursor-pointer"
            >
              Open UX Case Study
            </button>
            <span>•</span>
            <span className="text-zinc-400">Solana Summit India 2026 Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
