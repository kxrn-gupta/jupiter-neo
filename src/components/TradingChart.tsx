"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Maximize2, BarChart2, Activity } from "lucide-react";
import { Token, POPULAR_TOKENS } from "../data/tokens";
import { sounds } from "../utils/sound";

interface ChartPoint {
  time: string;
  price: number;
  vol: number;
}

const BASE_CURVES: Record<string, number[]> = {
  "1D": [0.96, 0.97, 0.955, 0.98, 0.985, 0.975, 0.995, 0.99, 1.015, 1.002, 1.02, 1.0],
  "1W": [0.89, 0.92, 0.905, 0.95, 0.97, 0.99, 1.0],
  "1M": [0.82, 0.87, 0.925, 1.0],
};

const TIMEFRAME_LABELS: Record<string, string[]> = {
  "1D": ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  "1W": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "1M": ["Week 1", "Week 2", "Week 3", "Week 4"],
};

interface TradingChartProps {
  baseToken?: Token;
  quoteToken?: Token;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  baseToken = POPULAR_TOKENS[0],
  quoteToken = POPULAR_TOKENS[1],
}) => {
  const [timeframe, setTimeframe] = useState<string>("1D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger brief shimmer skeleton when baseToken or timeframe changes
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 420);
    return () => clearTimeout(timer);
  }, [baseToken.symbol, timeframe]);

  const tokenPrice = baseToken.price;
  const isUp = baseToken.change24h >= 0;

  const data: ChartPoint[] = useMemo(() => {
    const curve = BASE_CURVES[timeframe] || BASE_CURVES["1D"];
    const labels = TIMEFRAME_LABELS[timeframe] || TIMEFRAME_LABELS["1D"];
    return curve.map((multiplier, i) => ({
      time: labels[i] || `${i}:00`,
      price: tokenPrice * multiplier,
      vol: Math.round(15 + multiplier * 40),
    }));
  }, [timeframe, tokenPrice]);

  const minPrice = Math.min(...data.map((d) => d.price)) * 0.992;
  const maxPrice = Math.max(...data.map((d) => d.price)) * 1.008;
  const priceRange = maxPrice - minPrice || 1;

  // Chart Dimensions with dedicated Y-axis margin
  const width = 720;
  const height = 260;
  const chartRightPadding = 64; // Dedicated for Y-axis price labels
  const plotWidth = width - chartRightPadding;
  const bottomAxisPadding = 24;
  const plotHeight = height - bottomAxisPadding;

  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (plotWidth - 24) + 12;
      const y = plotHeight - ((d.price - minPrice) / priceRange) * (plotHeight - 40) - 20;
      return { x, y, ...d };
    });
  }, [data, minPrice, priceRange, plotWidth, plotHeight]);

  const svgPath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth cubic bezier
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (!svgPath || points.length === 0) return "";
    const last = points[points.length - 1];
    const first = points[0];
    return `${svgPath} L ${last.x} ${plotHeight} L ${first.x} ${plotHeight} Z`;
  }, [svgPath, points, plotHeight]);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const formatPriceDisplay = (price: number) => {
    if (price >= 100) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 1) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    if (price >= 0.001) {
      return price.toFixed(4);
    }
    return price.toFixed(6);
  };

  const high24h = tokenPrice * 1.038;
  const low24h = tokenPrice * 0.962;

  const getVolDisplay = (price: number) => {
    if (price > 100) return "$1.42B";
    if (price > 2) return "$184M";
    if (price > 0.5) return "$84.2M";
    return "$32.8M";
  };

  // Y-axis grid levels (4 ticks)
  const yTicks = [
    { ratio: 0.15, price: maxPrice * 0.998 },
    { ratio: 0.42, price: minPrice + priceRange * 0.6 },
    { ratio: 0.70, price: minPrice + priceRange * 0.28 },
    { ratio: 0.92, price: minPrice * 1.002 },
  ];

  // X-axis timestamps to display (select 4-5 evenly distributed)
  const xTicks = useMemo(() => {
    if (points.length <= 4) return points;
    const step = Math.floor(points.length / 4);
    return [points[0], points[step], points[step * 2], points[step * 3], points[points.length - 1]];
  }, [points]);

  return (
    <div className="w-full rounded-3xl bg-[#0B0D13]/90 border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex flex-col justify-between">
      {/* Chart Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        {/* Token Pair & Price Readout */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center font-bold font-mono text-white text-sm shadow-md"
            style={{ backgroundColor: `${baseToken.color}30` }}
          >
            {baseToken.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                {baseToken.symbol} / {quoteToken.symbol}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold flex items-center gap-0.5 border ${
                  isUp
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isUp ? "+" : ""}{baseToken.change24h}%
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-8 w-36 shimmer-bone rounded-lg" />
                <div className="h-4 w-16 shimmer-bone rounded" />
              </div>
            ) : (
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                  ${activePoint ? formatPriceDisplay(activePoint.price) : formatPriceDisplay(tokenPrice)}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {activePoint ? activePoint.time : "Current"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start sm:self-auto font-mono text-xs">
          {["1D", "1W", "1M"].map((tf) => (
            <button
              key={tf}
              onClick={() => {
                sounds.playClick();
                setTimeframe(tf);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeframe === tf
                  ? "bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30 shadow-sm font-bold"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Key Market Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-white/[0.04] text-[11px] font-mono">
        <div>
          <span className="text-zinc-400 font-medium">24h High:</span>{" "}
          <strong className="text-zinc-100">${formatPriceDisplay(high24h)}</strong>
        </div>
        <div>
          <span className="text-zinc-400 font-medium">24h Low:</span>{" "}
          <strong className="text-zinc-100">${formatPriceDisplay(low24h)}</strong>
        </div>
        <div>
          <span className="text-zinc-400 font-medium">24h Vol:</span>{" "}
          <strong className="text-zinc-100">{getVolDisplay(tokenPrice)}</strong>
        </div>
        <div>
          <span className="text-zinc-400 font-medium">Jupiter Dominance:</span>{" "}
          <strong className="text-[#14F195]">86.4%</strong>
        </div>
      </div>

      {/* Interactive SVG Chart Canvas with Y-Axis & Crosshair */}
      <div
        className="relative mt-4 w-full h-[270px] cursor-crosshair overflow-hidden select-none"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* RPC Shimmer Overlay during timeframe/token updates */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0D13]/50 backdrop-blur-xs transition-opacity duration-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/[0.1] text-xs font-mono text-zinc-300 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
              <span>Hydrating Pyth Oracle State...</span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14F195" stopOpacity="0.22" />
              <stop offset="65%" stopColor="#14F195" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="50%" stopColor="#00C2FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick, idx) => {
            const yPos = plotHeight * tick.ratio;
            return (
              <g key={idx}>
                <line
                  x1={0}
                  y1={yPos}
                  x2={plotWidth}
                  y2={yPos}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={plotWidth + 8}
                  y={yPos + 3}
                  fill="#A1A1AA"
                  fontSize="9.5"
                  fontFamily="monospace"
                  className="select-none font-medium"
                >
                  ${formatPriceDisplay(tick.price)}
                </text>
              </g>
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Crisp Line Stroke */}
          <path
            d={svgPath}
            fill="none"
            stroke="url(#chartStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Static X-Axis Timestamps */}
          {xTicks.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={height - 6}
              textAnchor="middle"
              fill="#A1A1AA"
              fontSize="9"
              fontFamily="monospace"
              className="select-none font-medium"
            >
              {pt.time}
            </text>
          ))}

          {/* Active Hover Crosshair (Both X & Y Axes) */}
          {activePoint && hoverIndex !== null && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={activePoint.x}
                y1={0}
                x2={activePoint.x}
                y2={plotHeight}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeDasharray="3 3"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={0}
                y1={activePoint.y}
                x2={plotWidth}
                y2={activePoint.y}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeDasharray="3 3"
              />

              {/* Floating Active Point Outer Glow */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="7"
                fill="#14F195"
                stroke="#090A0F"
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_10px_#14F195]"
              />

              {/* Floating Y-Axis Active Price Pill */}
              <g transform={`translate(${plotWidth + 4}, ${activePoint.y - 9})`}>
                <rect
                  x="0"
                  y="0"
                  width="58"
                  height="18"
                  rx="4"
                  fill="#14F195"
                  className="filter drop-shadow-[0_0_8px_rgba(20,241,149,0.3)]"
                />
                <text
                  x="29"
                  y="12.5"
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ${formatPriceDisplay(activePoint.price)}
                </text>
              </g>

              {/* Floating X-Axis Active Time Pill */}
              <g transform={`translate(${activePoint.x - 22}, ${height - 20})`}>
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="16"
                  rx="4"
                  fill="#18181B"
                  stroke="#3F3F46"
                  strokeWidth="1"
                />
                <text
                  x="22"
                  y="11.5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {activePoint.time}
                </text>
              </g>
            </g>
          )}

          {/* End-of-curve real-time Web-Socket radar pulse rings */}
          {activePoint && hoverIndex === null && (
            <g>
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="16"
                fill="#14F195"
                opacity="0.18"
                className="animate-ping"
                style={{ animationDuration: "2.4s" }}
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="9"
                fill="#14F195"
                opacity="0.25"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill="#14F195"
                stroke="#07080B"
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_10px_#14F195]"
              />
            </g>
          )}
        </svg>

        {/* Hover Capture Transparent Columns */}
        <div className="absolute inset-0 flex" style={{ width: `${(plotWidth / width) * 100}%` }}>
          {points.map((p, i) => (
            <div
              key={i}
              className="flex-1 h-full cursor-crosshair"
              onMouseEnter={() => {
                setHoverIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      {/* Chart Footer with Live Indicator */}
      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-ping" />
          <span className="text-zinc-300">Real-time Pyth Network / Meteora Price Oracle</span>
        </div>
        <span className="text-zinc-400">Slot: 390ms latency</span>
      </div>
    </div>
  );
};
