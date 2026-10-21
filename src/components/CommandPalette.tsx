"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
  BookOpen,
  Smartphone,
  Repeat,
  Sparkles,
  Layers,
  ArrowDownUp,
  Volume2,
  Check,
} from "lucide-react";
import { sounds } from "../utils/sound";
import { Token, POPULAR_TOKENS } from "../data/tokens";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Solana RPC" | "Security Audit" | "Tokens" | "Shortcuts";
  description?: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: "swap" | "limit" | "dca") => void;
  onOpenCaseStudy: () => void;
  onOpenMobileSim: () => void;
  onOpenJudgeTour: () => void;
  onOpenRpcModal: () => void;
  onSelectToken: (token: Token) => void;
  onInvertPair: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCaseStudy,
  onOpenMobileSim,
  onOpenJudgeTour,
  onOpenRpcModal,
  onSelectToken,
  onInvertPair,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: "judge-tour",
      title: "Launch 60-Sec Judge Tour",
      category: "Navigation",
      description: "Interactive walkthrough of 5 core architectural innovations",
      shortcut: "T",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => {
        onClose();
        onOpenJudgeTour();
      },
    },
    {
      id: "tab-swap",
      title: "Go to Instant Swap Interface",
      category: "Navigation",
      description: "Multi-hop routing with Pre-Flight Simulation preview",
      icon: <ArrowDownUp className="w-4 h-4 text-[#14F195]" />,
      action: () => {
        onNavigateTab("swap");
        onClose();
      },
    },
    {
      id: "tab-limit",
      title: "Go to Limit Orders Dashboard",
      category: "Navigation",
      description: "Trigger distance meters, expiry chips, and cancel refunds",
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigateTab("limit");
        onClose();
      },
    },
    {
      id: "tab-dca",
      title: "Go to Automated DCA Streams",
      category: "Navigation",
      description: "Retail wealth accumulation streams with visual progress",
      icon: <Repeat className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigateTab("dca");
        onClose();
      },
    },
    {
      id: "case-study",
      title: "Open UX Case Study & Design Tokens",
      category: "Navigation",
      description: "Problem statement, before/after metrics & color token spec",
      shortcut: "C",
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onClose();
        onOpenCaseStudy();
      },
    },
    {
      id: "mobile-sim",
      title: "Open iPhone 16 Pro Hardware Simulator",
      category: "Navigation",
      description: "Test touch ergonomics and responsive layout in device frame",
      shortcut: "M",
      icon: <Smartphone className="w-4 h-4 text-blue-400" />,
      action: () => {
        onClose();
        onOpenMobileSim();
      },
    },
    {
      id: "invert-pair",
      title: "Invert Trading Pair (Pay ⇄ Receive)",
      category: "Shortcuts",
      description: "Quick toggle input and output token directions",
      shortcut: "X",
      icon: <ArrowDownUp className="w-4 h-4 text-zinc-400" />,
      action: () => {
        onInvertPair();
        onClose();
      },
    },
    {
      id: "rpc-helius",
      title: "Solana RPC Node Engine: Open Switcher",
      category: "Solana RPC",
      description: "Switch between Helius (18ms), Triton (24ms), and Jito (26ms)",
      icon: <Server className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onClose();
        onOpenRpcModal();
      },
    },
    // Tokens
    ...POPULAR_TOKENS.map((token) => ({
      id: `token-${token.symbol.toLowerCase()}`,
      title: `Select ${token.symbol} (${token.name})`,
      category: "Tokens" as const,
      description: `$${token.price.toLocaleString()} • 24h: ${token.change24h >= 0 ? "+" : ""}${token.change24h}%`,
      icon: (
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
          style={{ backgroundColor: token.color }}
        >
          {token.symbol[0]}
        </span>
      ),
      action: () => {
        onSelectToken(token);
        onClose();
      },
    })),
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      sounds.playClick();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sounds.playClick();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        sounds.playSuccess();
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      sounds.playClick();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0D0E15] border border-white/[0.12] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or token (e.g. 'Tour', 'SOL', 'RPC', 'Limit')..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.02]">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No actions matching &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    sounds.playSuccess();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#14F195]/10 text-white border border-[#14F195]/30 shadow-[0_0_15px_rgba(20,241,149,0.08)]"
                      : "text-zinc-300 hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#14F195]/20 border-[#14F195]/50"
                          : "bg-white/[0.03] border-white/[0.06]"
                      }`}
                    >
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.description && (
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">
                          {cmd.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-zinc-400">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#14F195]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#14F195]">Raycast Command Architecture</span>
        </div>
      </div>
    </div>
  );
};
