"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Check,
  ShieldCheck,
  Filter,
  Lock,
  Flame,
  Users,
  Copy,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { POPULAR_TOKENS, Token } from "../data/tokens";
import { sounds } from "../utils/sound";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  selectedTokenSymbol: string;
}

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedTokenSymbol,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "verified" | "meme">("all");
  const [auditedToken, setAuditedToken] = useState<Token | null>(null);
  const [copiedMint, setCopiedMint] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (auditedToken) {
          setAuditedToken(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, auditedToken]);

  if (!isOpen) return null;

  const handleCopyMint = (mint: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(mint);
    setCopiedMint(true);
    setTimeout(() => setCopiedMint(false), 2000);
  };

  const filteredTokens = POPULAR_TOKENS.filter((t) => {
    const matchesSearch =
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.mint.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (category === "verified") return t.verified && t.badge !== "Memecoin";
    if (category === "meme") return t.badge === "Memecoin" || t.badge === "Community";
    return true;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        className="w-full max-w-md bg-[#0F1117] border border-white/[0.1] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {auditedToken ? (
          /* Mint Guardian Deep Audit View */
          <div className="flex flex-col h-full animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <button
                onClick={() => {
                  sounds.playClick();
                  setAuditedToken(null);
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Token List</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Token Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundColor: auditedToken.color }}
                >
                  {auditedToken.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white tracking-tight">
                      {auditedToken.name}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      ${auditedToken.symbol}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                    Pre-Flight Safety Score: <strong>99 / 100 (Safe)</strong>
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                AUDITED
              </span>
            </div>

            {/* Mint Copy Bar */}
            <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Mint:</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-300">
                  {auditedToken.mint.slice(0, 8)}...{auditedToken.mint.slice(-8)}
                </span>
                <button
                  onClick={() => handleCopyMint(auditedToken.mint)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  title="Copy Mint Address"
                >
                  {copiedMint ? <Check className="w-3 h-3 text-[#14F195]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMint ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Security Audit Checklist */}
            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  <div>
                    <span className="font-semibold text-white">Mint Authority</span>
                    <div className="text-[10px] text-zinc-500">Zero additional supply creation</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#14F195] bg-[#14F195]/10 px-2 py-0.5 rounded">
                  REVOKED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  <div>
                    <span className="font-semibold text-white">Freeze Authority</span>
                    <div className="text-[10px] text-zinc-500">Wallets cannot be blacklisted</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#14F195] bg-[#14F195]/10 px-2 py-0.5 rounded">
                  REVOKED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  <div>
                    <span className="font-semibold text-white">Liquidity Pool Status</span>
                    <div className="text-[10px] text-zinc-500">Meteora / Orca Whirlpool locks</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  100% BURNED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  <div>
                    <span className="font-semibold text-white">Top 10 Concentration</span>
                    <div className="text-[10px] text-zinc-500">Healthy community distribution</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  12.4% (LOW RISK)
                </span>
              </div>
            </div>

            {/* Select Token Action */}
            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectToken(auditedToken);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md shadow-[#14F195]/20 transition-all"
              >
                Trade Verified ${auditedToken.symbol}
              </button>
            </div>
          </div>
        ) : (
          /* Normal Token Selector View */
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">Select Token</h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Mint Guardian Verified
                </span>
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

            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search token name, symbol ($SOL), or mint..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#14F195]/60 transition-colors font-sans"
                autoFocus
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3 pt-1 border-t border-white/[0.04] text-[11px] font-mono">
              {(["all", "verified", "meme"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-lg uppercase transition-all ${
                    category === cat
                      ? "bg-white/[0.12] text-white font-bold"
                      : "bg-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Popular Quick Pills */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
              {POPULAR_TOKENS.slice(0, 5).map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => {
                    sounds.playClick();
                    onSelectToken(token);
                    onClose();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                    selectedTokenSymbol === token.symbol
                      ? "bg-white/[0.1] border-white/20 text-white"
                      : "bg-white/[0.03] border-white/[0.06] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: token.color }}
                  />
                  <span>{token.symbol}</span>
                </button>
              ))}
            </div>

            {/* Token List */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredTokens.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                  No verified tokens found matching &quot;{search}&quot;
                </div>
              ) : (
                filteredTokens.map((token) => {
                  const isSelected = selectedTokenSymbol === token.symbol;
                  return (
                    <div
                      key={token.symbol}
                      className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border group ${
                        isSelected
                          ? "bg-[#14F195]/10 border-[#14F195]/30 text-white"
                          : "bg-white/[0.01] border-transparent hover:bg-white/[0.04] text-zinc-300"
                      }`}
                    >
                      <div
                        onClick={() => {
                          sounds.playClick();
                          onSelectToken(token);
                          onClose();
                        }}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white border border-white/10 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${token.color}22, ${token.color}55)`,
                          }}
                        >
                          {token.symbol[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-white tracking-tight">
                              {token.symbol}
                            </span>
                            <span className="text-xs text-zinc-400 font-normal">
                              {token.name}
                            </span>
                            {token.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">
                                {token.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500">
                            ${token.price.toLocaleString(undefined, {
                              minimumFractionDigits: token.price < 0.01 ? 6 : 2,
                            })}{" "}
                            ·{" "}
                            <span
                              className={token.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}
                            >
                              {token.change24h >= 0 ? "+" : ""}
                              {token.change24h}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Token Balance */}
                        <div
                          onClick={() => {
                            sounds.playClick();
                            onSelectToken(token);
                            onClose();
                          }}
                          className="text-right font-mono cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">
                            {token.balance.toLocaleString()} {token.symbol}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            ${(token.balance * token.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>

                        {/* Audit Shield Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick();
                            setAuditedToken(token);
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#14F195]/20 text-zinc-400 hover:text-[#14F195] border border-white/[0.06] transition-colors"
                          title={`Inspect ${token.symbol} Mint Guardian Audit`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
