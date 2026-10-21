"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Activity,
  Check,
  Cpu,
  Radio,
  Server,
  Zap,
  Shield,
  Layers,
  Clock,
  ExternalLink,
} from "lucide-react";
import { sounds } from "../utils/sound";

interface RpcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode?: (node: RpcNode) => void;
}

export interface RpcNode {
  id: string;
  name: string;
  provider: string;
  latencyMs: number;
  region: string;
  feature: string;
  isJitoProtected: boolean;
}

const RPC_NODES: RpcNode[] = [
  {
    id: "helius",
    name: "Helius Edge Accelerator",
    provider: "Helius Global",
    latencyMs: 18,
    region: "Global Anycast",
    feature: "Geyser low-latency streaming",
    isJitoProtected: true,
  },
  {
    id: "triton",
    name: "Triton One High-Throughput",
    provider: "Triton Network",
    latencyMs: 24,
    region: "Direct TPU Socket",
    feature: "Zero-queue validator routing",
    isJitoProtected: false,
  },
  {
    id: "jito",
    name: "Jito Block Engine Relay",
    provider: "Jito Labs",
    latencyMs: 26,
    region: "Frankfurt / Tokyo / NY",
    feature: "100% Private Mempool Protection",
    isJitoProtected: true,
  },
  {
    id: "quicknode",
    name: "QuickNode Global Fabric",
    provider: "QuickNode",
    latencyMs: 31,
    region: "APAC & EMEA",
    feature: "Multi-cluster automatic failover",
    isJitoProtected: false,
  },
];

export const RpcModal: React.FC<RpcModalProps> = ({ isOpen, onClose, onSelectNode }) => {
  const [selectedNode, setSelectedNode] = useState<string>("helius");

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

  const activeNode = RPC_NODES.find((n) => n.id === selectedNode) || RPC_NODES[0];

  const handleChooseNode = (node: RpcNode) => {
    sounds.playClick();
    setSelectedNode(node.id);
    if (onSelectNode) {
      onSelectNode(node);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        className="w-full max-w-lg bg-[#0F1117] border border-white/[0.1] rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150 cursor-default max-h-[90vh] overflow-y-auto scrollbar-none my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#14F195]/15 border border-[#14F195]/30 flex items-center justify-center text-[#14F195]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Solana Network &amp; RPC Engine
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Direct Validator &amp; Private Mempool Connections
              </p>
            </div>
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

        {/* Live Epoch Status Card */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-zinc-900/70 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
              <span>Solana Mainnet-Beta Status</span>
            </span>
            <span className="text-white font-bold">Epoch 682</span>
          </div>

          {/* Epoch Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Epoch Progress (74.8%)</span>
              <span className="text-[#14F195] font-semibold">14h 22m remaining</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9945FF] via-[#00C2FF] to-[#14F195]"
                style={{ width: "74.8%" }}
              />
            </div>
          </div>

          {/* Network Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[11px] font-mono text-center">
            <div>
              <div className="text-zinc-400 text-[10px] uppercase font-semibold">True TPS</div>
              <div className="text-white font-bold mt-0.5">2,482</div>
            </div>
            <div>
              <div className="text-zinc-400 text-[10px] uppercase font-semibold">Slot Latency</div>
              <div className="text-emerald-400 font-bold mt-0.5">390ms</div>
            </div>
            <div>
              <div className="text-zinc-400 text-[10px] uppercase font-semibold">Skip Rate</div>
              <div className="text-white font-bold mt-0.5">1.8%</div>
            </div>
          </div>
        </div>

        {/* Available RPC Endpoints */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>Select Active RPC Node:</span>
            <span className="text-[#14F195] text-[11px]">
              Active: {activeNode.latencyMs}ms ping
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5 scrollbar-none">
            {RPC_NODES.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleChooseNode(node)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-white/[0.06] border-[#14F195]/50 shadow-sm"
                      : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? "border-[#14F195] bg-[#14F195]"
                          : "border-zinc-500 bg-transparent"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {node.name}
                        </span>
                        {node.isJitoProtected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/20 font-semibold">
                            JITO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5 flex items-center gap-2">
                        <span>{node.provider}</span>
                        <span>•</span>
                        <span>{node.feature}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`text-xs font-bold ${
                        node.latencyMs < 20
                          ? "text-emerald-400"
                          : node.latencyMs < 30
                          ? "text-cyan-400"
                          : "text-amber-400"
                      }`}
                    >
                      {node.latencyMs}ms
                    </span>
                    <div className="text-[9px] text-zinc-500">{node.region}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Auto-routing fallback enabled
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#14F195]/20 transition-all"
          >
            Apply &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
};
