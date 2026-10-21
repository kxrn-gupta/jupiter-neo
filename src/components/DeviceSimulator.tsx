"use client";

import React, { useState } from "react";
import { Smartphone, Monitor, X } from "lucide-react";
import { SwapCard } from "./SwapCard";
import { LimitCard } from "./LimitCard";
import { DcaCard } from "./DcaCard";
import { sounds } from "../utils/sound";

interface DeviceSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  isOpen,
  onClose,
  walletConnected,
  onConnectWallet,
}) => {
  const [mobileTab, setMobileTab] = useState<"swap" | "limit" | "dca">("swap");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        {/* Top Dismiss Button */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-white">
            <Smartphone className="w-3.5 h-3.5 text-[#14F195]" />
            <span>Simulated Mobile Hardware (iPhone 16 Pro Viewport)</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iPhone Chassis Frame */}
        <div className="w-[380px] h-[800px] rounded-[52px] bg-[#0A0C10] border-[6px] border-[#252833] shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(20,241,149,0.15)] overflow-hidden flex flex-col relative">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Internal Mobile Screen */}
          <div className="flex-1 overflow-y-auto p-3.5 pt-12 pb-12 scrollbar-none bg-[#07080B]">
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5">
                <span className="text-[#14F195]">♃</span> JUPITER NEO
              </span>
              <span className="text-[10px] font-mono text-zinc-400">7xKZ...4mQ9</span>
            </div>

            {/* Mobile In-Phone Tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-4">
              {(["swap", "limit", "dca"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sounds.playClick();
                    setMobileTab(tab);
                  }}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-medium uppercase transition-all ${
                    mobileTab === tab
                      ? "bg-white/[0.12] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {mobileTab === "swap" && (
              <SwapCard
                walletConnected={walletConnected}
                onConnectWallet={onConnectWallet}
              />
            )}
            {mobileTab === "limit" && <LimitCard />}
            {mobileTab === "dca" && <DcaCard />}
          </div>

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-30" />
        </div>
      </div>
    </div>
  );
};
