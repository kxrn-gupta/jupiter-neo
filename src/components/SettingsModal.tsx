"use client";

import React, { useState, useEffect } from "react";
import { X, Sliders, Zap, Shield, Check, AlertTriangle, Volume2 } from "lucide-react";
import { sounds } from "../utils/sound";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: number;
  setSlippage: (slippage: number) => void;
  priorityFee: "eco" | "fast" | "turbo";
  setPriorityFee: (fee: "eco" | "fast" | "turbo") => void;
  mevProtection: boolean;
  setMevProtection: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  slippage,
  setSlippage,
  priorityFee,
  setPriorityFee,
  mevProtection,
  setMevProtection,
}) => {
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [audioActive, setAudioActive] = useState<boolean>(sounds.enabled);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCustomSlippageChange = (val: string) => {
    setCustomSlippage(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
      setSlippage(parsed);
    }
  };

  const parsedCustom = parseFloat(customSlippage);
  const isHighSlippage = slippage > 2.5;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        className="w-full max-w-md bg-[#0F1117] border border-white/[0.1] rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#14F195]" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Execution Architecture Settings
            </h3>
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

        {/* Slippage Tolerance Section */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Slippage Tolerance</span>
            </label>
            <span
              className={`text-xs font-mono font-semibold ${
                isHighSlippage ? "text-amber-400" : "text-[#14F195]"
              }`}
            >
              {slippage === 0.5 && !customSlippage ? "Auto (0.5%)" : `${slippage}%`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Auto (0.5%)", val: 0.5 },
              { label: "0.1%", val: 0.1 },
              { label: "1.0%", val: 1.0 },
              { label: "Custom", val: -1 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  sounds.playClick();
                  if (item.val === -1) {
                    setCustomSlippage("2.0");
                    setSlippage(2.0);
                  } else {
                    setCustomSlippage("");
                    setSlippage(item.val);
                  }
                }}
                className={`py-2 px-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                  (item.val === slippage && !customSlippage) || (item.val === -1 && customSlippage)
                    ? "bg-[#14F195]/15 border-[#14F195]/50 text-[#14F195] font-bold"
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {customSlippage && (
            <div className="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-zinc-900 border border-white/[0.08]">
              <span className="text-xs font-mono text-zinc-400">Custom Slippage:</span>
              <input
                type="number"
                step="0.1"
                min="0.05"
                max="50"
                value={customSlippage}
                onChange={(e) => handleCustomSlippageChange(e.target.value)}
                placeholder="0.5"
                className="w-20 bg-black/50 px-2 py-1 rounded text-xs font-mono text-white border border-white/10 focus:outline-none focus:border-[#14F195]"
              />
              <span className="text-xs font-mono text-zinc-400">%</span>
            </div>
          )}

          {isHighSlippage && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>High slippage (&gt;2.5%) increases risk of frontrunning.</span>
            </div>
          )}

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Transactions automatically revert if price moves unfavorably by more than this percentage.
          </p>
        </div>

        {/* Priority Fee Section */}
        <div className="mt-6 space-y-2 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority Gas Engine</span>
            </label>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
              {priorityFee}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "eco",
                name: "Eco",
                units: "5k µLamports",
                usd: "< $0.001",
                desc: "Standard slot",
              },
              {
                id: "fast",
                name: "Fast",
                units: "50k µLamports",
                usd: "≈ $0.008",
                desc: "Congestion skip",
              },
              {
                id: "turbo",
                name: "Turbo",
                units: "250k µLamports",
                usd: "≈ $0.038",
                desc: "Front-of-block",
              },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => {
                  sounds.playClick();
                  setPriorityFee(tier.id as "eco" | "fast" | "turbo");
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  priorityFee === tier.id
                    ? "bg-amber-500/10 border-amber-500/50 text-white"
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">{tier.name}</span>
                  {priorityFee === tier.id && (
                    <Check className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-300 font-semibold">
                  {tier.usd}
                </div>
                <div className="text-[9px] font-mono text-zinc-500 mt-0.5">{tier.units}</div>
              </button>
            ))}
          </div>
        </div>

        {/* MEV / Jito Bundle Protection */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="pr-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <Shield className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Jito Private Mempool Protection</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
              Bypasses public mempool to prevent malicious MEV sandwich bots from stealing your slippage.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setMevProtection(!mevProtection);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 border ${
              mevProtection
                ? "bg-[#14F195] border-[#14F195]"
                : "bg-zinc-800 border-zinc-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                mevProtection ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Tactile Audio Feedback Switch */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="pr-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <Volume2 className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Tactile Web Audio Haptics</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
              Synthesizer audio clicks and trade confirmation chimes rendered via Web Audio API.
            </p>
          </div>

          <button
            onClick={() => {
              const next = !audioActive;
              sounds.enabled = next;
              setAudioActive(next);
              if (next) sounds.playClick();
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 border ${
              audioActive
                ? "bg-[#14F195] border-[#14F195]"
                : "bg-zinc-800 border-zinc-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                audioActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
