"use client";

import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, ExternalLink } from "lucide-react";
import { sounds } from "../utils/sound";

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  txHash?: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";
        const isInfo = toast.type === "info";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl bg-[#0D0F16]/95 border shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? "border-emerald-500/30 shadow-[0_10px_35px_rgba(16,185,129,0.15)]"
                : isError
                ? "border-rose-500/30 shadow-[0_10px_35px_rgba(244,63,94,0.15)]"
                : isWarning
                ? "border-amber-500/30 shadow-[0_10px_35px_rgba(245,158,11,0.15)]"
                : "border-[#00C2FF]/30 shadow-[0_10px_35px_rgba(0,194,255,0.15)]"
            }`}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#14F195]" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {isInfo && <Info className="w-4 h-4 text-[#00C2FF]" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 font-mono">
              <div className="text-xs font-semibold text-white tracking-tight flex items-center justify-between">
                <span>{toast.title}</span>
              </div>
              {toast.description && (
                <div className="text-[11px] text-zinc-300 mt-0.5 leading-snug">
                  {toast.description}
                </div>
              )}
              {toast.txHash && (
                <div className="mt-1.5 flex items-center gap-2">
                  <a
                    href={`https://solscan.io/tx/${toast.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-[#14F195] hover:underline flex items-center gap-1"
                  >
                    <span>Tx: {toast.txHash.slice(0, 4)}...{toast.txHash.slice(-4)}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
