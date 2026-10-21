"use client";

import React, { useState } from "react";
import { X, Wallet, Check, Copy, ExternalLink, ShieldCheck, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { sounds } from "../utils/sound";

export interface WalletProfile {
  id: "degen" | "whale" | "fresh";
  name: string;
  provider: "Phantom" | "Backpack" | "Solflare" | "Ledger";
  address: string;
  shortAddress: string;
  solBalance: number;
  usdcBalance: number;
  jupBalance: number;
  badge: string;
  badgeColor: string;
  description: string;
}

export const WALLET_PROFILES: WalletProfile[] = [
  {
    id: "degen",
    name: "Degen Trader (Default)",
    provider: "Phantom",
    address: "7xKZtgZYw3yK8mC5a7D1FvQnUeG4pL9bRtY2wK3x4mQ9",
    shortAddress: "7xKZ...4mQ9",
    solBalance: 14.82,
    usdcBalance: 420.5,
    jupBalance: 1250.0,
    badge: "Balanced Portfolio",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description: "Standard active Solana trader account with initialized token accounts.",
  },
  {
    id: "whale",
    name: "Solana Whale (Institutional)",
    provider: "Backpack",
    address: "Whale99xLpQ8vM2cRtY4eG7nUa5kL2bF1D3sK6wJ8zK9p",
    shortAddress: "Whal...zK9p",
    solBalance: 420.69,
    usdcBalance: 250000.0,
    jupBalance: 50000.0,
    badge: "VIP Tier / High Liquidity",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description: "Deep liquidity profile with zero slippage impact on large size executions.",
  },
  {
    id: "fresh",
    name: "Fresh Wallet (Rent Stress Test)",
    provider: "Solflare",
    address: "Newbie01sRt9kL2bF1D3sK6wJ8zK9p7xKZtgZYw3yK8mC",
    shortAddress: "Newb...8mC",
    solBalance: 0.005,
    usdcBalance: 0.0,
    jupBalance: 0.0,
    badge: "Low SOL Warning",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    description: "Tests edge cases: triggers Jupiter Neo's Pre-Flight Rent Guardian and insufficient balance checks.",
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: WalletProfile;
  onSelectProfile: (profile: WalletProfile) => void;
  walletConnected: boolean;
  onDisconnect: () => void;
  onConnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
  walletConnected,
  onDisconnect,
  onConnect,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(currentProfile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl bg-[#0C0D14] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 flex flex-col gap-5 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#14F195]/10 border border-[#14F195]/30 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#14F195]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">
                Solana Wallet Architecture
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Multi-Profile Switcher & Rent Stress Tester
              </p>
            </div>
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

        {/* Current Active Account Card */}
        {walletConnected ? (
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  {currentProfile.provider} Connected
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentProfile.badgeColor}`}>
                  {currentProfile.badge}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-[#14F195] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#14F195]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : currentProfile.shortAddress}</span>
              </button>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.05]">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <div className="text-[10px] font-mono uppercase text-zinc-500">SOL Balance</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {currentProfile.solBalance.toLocaleString()} SOL
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  ≈ ${(currentProfile.solBalance * 160.25).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <div className="text-[10px] font-mono uppercase text-zinc-500">USDC Balance</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  ${currentProfile.usdcBalance.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">Stable Reserve</div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <div className="text-[10px] font-mono uppercase text-zinc-500">JUP Staked</div>
                <div className="text-sm font-mono font-bold text-[#14F195] mt-0.5">
                  {currentProfile.jupBalance.toLocaleString()} JUP
                </div>
                <div className="text-[10px] font-mono text-zinc-400">Governance Voting</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-dashed border-white/[0.1] text-center flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-zinc-400">Wallet is currently disconnected</p>
            <button
              onClick={() => {
                sounds.playSuccess();
                onConnect();
              }}
              className="px-5 py-2 rounded-xl bg-[#14F195] text-black font-semibold text-xs font-mono hover:opacity-90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.25)]"
            >
              Connect Active Wallet
            </button>
          </div>
        )}

        {/* Profile Switcher Section */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Interactive Test Profiles (Judge Sandbox)
            </span>
            <span className="text-[10px] font-mono text-[#14F195]">Click to simulate state</span>
          </div>

          <div className="space-y-2">
            {WALLET_PROFILES.map((profile) => {
              const isSelected = walletConnected && currentProfile.id === profile.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    sounds.playSwitch();
                    if (!walletConnected) onConnect();
                    onSelectProfile(profile);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#14F195]/[0.08] border-[#14F195]/50 shadow-[0_0_15px_rgba(20,241,149,0.1)]"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-xs font-bold text-zinc-300">
                      {profile.provider[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{profile.name}</span>
                        {isSelected && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#14F195] text-black font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <div className="text-xs font-bold text-white">{profile.solBalance} SOL</div>
                    <div className="text-[10px] text-zinc-500">{profile.provider}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
          <a
            href={`https://solscan.io/account/${currentProfile.address}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#14F195] transition-colors"
          >
            <span>Inspect on Solscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {walletConnected ? (
            <button
              onClick={() => {
                sounds.playClick();
                onDisconnect();
              }}
              className="text-rose-400 hover:text-rose-300 hover:underline transition-colors"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSuccess();
                onConnect();
              }}
              className="text-[#14F195] hover:underline"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
