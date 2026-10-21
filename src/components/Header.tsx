"use client";

import React, { useState } from "react";
import {
  Activity,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Wallet,
  ChevronDown,
  Server,
  Search,
} from "lucide-react";
import { sounds } from "../utils/sound";
import { RpcModal } from "./RpcModal";

interface HeaderProps {
  activeTab: "swap" | "limit" | "dca";
  setActiveTab: (tab: "swap" | "limit" | "dca") => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  walletConnected: boolean;
  setWalletConnected: (connected: boolean) => void;
  onOpenMobileSim?: () => void;
  onOpenJudgeTour?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenWalletModal?: () => void;
  onOpenRpcModal?: () => void;
  currentProfileSol?: number;
  currentProfileShortAddress?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isInspectorOpen,
  setIsInspectorOpen,
  walletConnected,
  setWalletConnected,
  onOpenMobileSim,
  onOpenJudgeTour,
  onOpenCommandPalette,
  onOpenWalletModal,
  onOpenRpcModal,
  currentProfileSol = 14.82,
  currentProfileShortAddress = "7xKZ...4mQ9",
}) => {
  const [internalRpcModalOpen, setInternalRpcModalOpen] = useState<boolean>(false);

  const handleOpenRpc = () => {
    sounds.playClick();
    if (onOpenRpcModal) onOpenRpcModal();
    else setInternalRpcModalOpen(true);
  };

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#090A0F]/90 backdrop-blur-2xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <div
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14F195]/20 via-[#9945FF]/20 to-[#14F195]/10 border border-[#14F195]/40 flex items-center justify-center shadow-[0_0_20px_rgba(20,241,149,0.15)] group-hover:border-[#14F195]/80 transition-all">
              <span className="font-mono text-base font-bold tracking-tight text-[#14F195]">♃</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold tracking-tight text-white text-base">JUPITER</span>
                <span className="text-[10px] font-mono tracking-widest font-semibold uppercase px-1.5 py-0.5 rounded bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20">
                  NEO
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">CONSUMER DEFI REDESIGN</span>
            </div>
          </div>

          {/* Navigation Pill (Desktop) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(["swap", "limit", "dca"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab);
                }}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? "text-white bg-white/[0.1] shadow-sm shadow-black/50 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* 60s Judge Tour Highlight Pill */}
          {onOpenJudgeTour && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onOpenJudgeTour();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 text-xs font-mono text-amber-300 font-semibold transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 whitespace-nowrap cursor-pointer"
              title="Launch Superteam Judge Guided Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>60s Tour</span>
            </button>
          )}

          {/* Command Palette Trigger Pill (Raycast Style) */}
          {onOpenCommandPalette && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-xs font-mono text-zinc-400 hover:text-white transition-colors flex-shrink-0 whitespace-nowrap cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-zinc-400 flex-shrink-0" />
              <kbd className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] text-zinc-300 border border-white/[0.1] font-semibold">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Solana TPS & Network Status Button with Dynamic Congestion State */}
          <button
            onClick={handleOpenRpc}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/[0.06] hover:border-amber-400/40 hover:bg-white/[0.03] text-xs font-mono transition-all cursor-pointer group flex-shrink-0 whitespace-nowrap"
            title="Inspect Solana Network & RPC Node Health"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B] flex-shrink-0" />
            <span className="text-zinc-200 font-semibold">2,482 TPS</span>
            <span className="text-zinc-600">·</span>
            <span className="text-amber-400/90 font-medium">412ms (Moderate)</span>
          </button>

          {/* UX Inspector / Case Study Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsInspectorOpen(!isInspectorOpen);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight border transition-all duration-200 flex-shrink-0 whitespace-nowrap cursor-pointer ${
              isInspectorOpen
                ? "bg-[#14F195]/15 border-[#14F195]/50 text-[#14F195] shadow-[0_0_15px_rgba(20,241,149,0.2)]"
                : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
            }`}
            title="Inspect UX Before/After Case Study"
          >
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Case Study</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.1] text-zinc-300">
              {isInspectorOpen ? "ACTIVE" : "VIEW"}
            </span>
          </button>

          {/* Wallet Connect & Profile Switcher with Web3 Jazzicon Avatar */}
          <button
            onClick={() => {
              sounds.playClick();
              if (onOpenWalletModal) {
                onOpenWalletModal();
              } else {
                setWalletConnected(!walletConnected);
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap cursor-pointer ${
              walletConnected
                ? "bg-zinc-900 border border-white/[0.1] text-zinc-200 hover:border-white/[0.2]"
                : "bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black font-semibold hover:opacity-90 shadow-[0_0_20px_rgba(20,241,149,0.25)]"
            }`}
            title="Inspect & Switch Wallet Profiles"
          >
            {walletConnected ? (
              <div className="relative w-4 h-4 rounded-full flex-shrink-0 overflow-hidden ring-1 ring-white/20 bg-gradient-to-tr from-[#9945FF] via-[#00C2FF] to-[#14F195]">
                <div className="absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#14F195] rounded-full ring-1 ring-black" />
              </div>
            ) : (
              <Wallet className="w-3.5 h-3.5 text-[#14F195] flex-shrink-0" />
            )}
            <span className="whitespace-nowrap">
              {walletConnected
                ? `${currentProfileShortAddress} · ${currentProfileSol} SOL`
                : "Connect Wallet"}
            </span>
            {walletConnected && <ChevronDown className="w-3 h-3 text-zinc-400 flex-shrink-0" />}
          </button>
        </div>
      </div>

      {/* Solana RPC Network & Node Health Modal (if not hoisted) */}
      {!onOpenRpcModal && (
        <RpcModal
          isOpen={internalRpcModalOpen}
          onClose={() => setInternalRpcModalOpen(false)}
        />
      )}
    </header>
  );
};
