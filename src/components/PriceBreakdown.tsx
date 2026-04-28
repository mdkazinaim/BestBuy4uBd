import React from "react";
import {
  ComboPricing,
  calculateComboPricing,
  formatPrice,
} from "../utils/pricingUtils";

interface PriceBreakdownProps {
  quantity: number;
  unitPrice: number;
  comboPricing: ComboPricing[];
  subtotal?: number;
  className?: string;
}

/**
 * Displays a detailed breakdown of the price calculation including
 * regular price, applied discounts, and final total.
 */
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  quantity,
  unitPrice,
  comboPricing,
  subtotal,
  className,
}) => {
  const { appliedTier, discountAmount, finalPrice, savings, originalTotal } =
    calculateComboPricing(quantity, unitPrice, comboPricing, subtotal);
  if (quantity === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-5 relative overflow-hidden group",
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="p-1 bg-slate-100 rounded-lg">
            <Sparkles className="w-3 h-3 text-brand-500" />
          </div>
          Price Summary
        </h3>
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 uppercase">
            {quantity} {quantity === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>

      <div className="space-y-3.5 relative z-10">
        {/* Regular Price */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium tracking-tight">
            Original Market Price
          </span>
          <span className="text-slate-400 font-bold line-through decoration-slate-300">
            {formatPrice(originalTotal)}
          </span>
        </div>

        {/* Combo Saving Logic Display */}
        {appliedTier && discountAmount > 0 && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex justify-between items-center text-sm bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100 shadow-inner"
          >
            <div className="flex flex-col">
              <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                Combo Deal Applied
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-wide">
                {appliedTier.discountType === "per_product"
                  ? `${formatPrice(appliedTier.discount)} saved per item`
                  : `Flat bundle discount`}
              </span>
            </div>
            <span className="text-emerald-700 font-black text-base">
              -{formatPrice(discountAmount)}
            </span>
          </motion.div>
        )}

        {/* Weighted Average Unit Price (Optional info) */}
        {quantity > 1 && (
          <div className="flex justify-between text-[11px] text-slate-400 font-medium border-t border-slate-50 pt-4 px-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="italic">Best Value Price</span>
            </div>
            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-brand-600">
              Only {formatPrice(Math.ceil(finalPrice / quantity))} / each
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t-2 border-slate-100 border-dashed flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Payable Total
          </span>
          <span className="text-3xl font-black text-brand-600 tracking-tighter">
            {formatPrice(finalPrice)}
          </span>
        </div>

        {savings > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-2xl text-center shadow-lg shadow-emerald-200 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all cursor-default"
          >
            <p className="font-black text-xs uppercase tracking-wider mb-0.5 italic">
              You Saved
            </p>
            <p className="font-extrabold text-lg leading-none">
              {formatPrice(savings)}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PriceBreakdown;
