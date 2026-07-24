import React from "react";
import { ComboPricing } from "@/utils/pricingUtils";

interface SavingsGaugeProps {
  comboPricing?: ComboPricing[];
  currentQuantity: number;
  title?: string;
  className?: string;
}

export const SavingsGauge: React.FC<SavingsGaugeProps> = ({
  comboPricing = [],
  currentQuantity,
  title = "Buy more, save more — pressure gauge",
  className = "",
}) => {
  if (!comboPricing || comboPricing.length === 0) {
    return null;
  }

  // Sort tiers ascending by minQuantity
  const sortedCombos = [...comboPricing].sort((a, b) => a.minQuantity - b.minQuantity);

  // Active combo tier
  let activeCombo: ComboPricing | null = null;
  for (const c of sortedCombos) {
    if (currentQuantity >= c.minQuantity) {
      activeCombo = c;
    }
  }

  // Next upcoming combo tier
  const upcomingCombo = sortedCombos.find((c) => currentQuantity < c.minQuantity) || null;

  // Stops list for gauge calculation: 1 base + combo tiers
  const allStops = [{ minQuantity: 1, isBase: true }, ...sortedCombos];

  // Gauge fill percentage calculation across segments
  let pct = 100;
  for (let i = 0; i < allStops.length - 1; i++) {
    const a = allStops[i].minQuantity;
    const b = allStops[i + 1].minQuantity;
    if (currentQuantity < b) {
      const segFrac = (currentQuantity - a) / (b - a);
      pct = ((i + segFrac) / (allStops.length - 1)) * 100;
      break;
    }
  }
  const fillWidthPercent = Math.min(100, Math.max(0, pct));

  return (
    <div
      className={`border border-gray-200 dark:border-slate-800 rounded-xl p-5 mb-6 bg-white dark:bg-slate-900 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-slate-100">
          {title}
        </span>
        <span
          className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
            activeCombo
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
              : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {activeCombo ? `Combo active: ${activeCombo.minQuantity}+ units` : "No combo applied"}
        </span>
      </div>

      {/* Progress Track & Stops */}
      <div className="relative mb-12">
        <div className="relative h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mx-1">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${fillWidthPercent}%` }}
          />
        </div>

        {/* Ticks and stop badges */}
        <div className="relative h-0">
          {allStops.map((stop: any, idx) => {
            const leftPct = 4 + (idx / (allStops.length - 1)) * 92;
            const isReached = currentQuantity >= stop.minQuantity;
            const isActive = activeCombo && activeCombo.minQuantity === stop.minQuantity;

            const stopLabel = stop.isBase
              ? "Base price"
              : stop.discountType === "per_product"
              ? `৳${stop.discount} off / unit`
              : `৳${stop.discount} off total`;

            return (
              <div
                key={idx}
                className="absolute -top-[15px] -translate-x-1/2 flex flex-col items-center w-[80px]"
                style={{ left: `${leftPct}%` }}
              >
                <div
                  className={`w-[2px] h-[16px] mb-1.5 rounded-sm transition-colors ${
                    isReached ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-slate-700"
                  }`}
                />
                <div
                  className={`text-[11px] font-bold font-mono rounded-full w-6 h-6 flex items-center justify-center transition-all ${
                    isActive
                      ? "border border-amber-500 bg-amber-500 text-gray-900"
                      : isReached
                      ? "border border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400"
                  }`}
                >
                  {stop.minQuantity}
                </div>
                <div
                  className={`text-[10.5px] text-center mt-1.5 leading-tight transition-colors ${
                    isReached
                      ? "text-gray-900 dark:text-slate-100 font-semibold"
                      : "text-gray-500 dark:text-slate-500"
                  }`}
                >
                  {stopLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note Footer */}
      <div className="mt-8 text-[13px] text-gray-600 dark:text-slate-400 flex items-center gap-2">
        <span className="text-amber-500 font-bold">↳</span>
        {upcomingCombo ? (
          <span>
            Add <strong className="text-gray-900 dark:text-slate-100">{upcomingCombo.minQuantity - currentQuantity} more</strong> to unlock{" "}
            <strong className="text-gray-900 dark:text-slate-100">
              {upcomingCombo.discountType === "per_product"
                ? `৳${upcomingCombo.discount} off each unit`
                : `৳${upcomingCombo.discount} off your total`}
            </strong>.
          </span>
        ) : (
          <span>
            <strong className="text-gray-900 dark:text-slate-100">Best tier unlocked</strong> — maximum combo savings applied.
          </span>
        )}
      </div>
    </div>
  );
};

export default SavingsGauge;
