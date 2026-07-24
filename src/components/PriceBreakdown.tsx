import React from "react";
import {
  ComboPricing,
  calculateComboPricing,
} from "../utils/pricingUtils";
import { cn } from "@/lib/utils";

interface PriceBreakdownProps {
  quantity: number;
  unitPrice: number;
  regularUnitPrice?: number;
  comboPricing: ComboPricing[];
  subtotal?: number;
  className?: string;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  quantity,
  unitPrice,
  regularUnitPrice,
  comboPricing,
  subtotal,
  className,
}) => {
  const { appliedTier, discountAmount, finalPrice, originalTotal } =
    calculateComboPricing(quantity, unitPrice, comboPricing, subtotal);

  if (quantity === 0) return null;

  const currentSubtotal = subtotal !== undefined ? subtotal : originalTotal;
  
  // Normal regular market discount calculation
  const effRegularUnitPrice = regularUnitPrice && regularUnitPrice > unitPrice ? regularUnitPrice : 0;
  const normalDiscount = effRegularUnitPrice > 0 ? (effRegularUnitPrice - unitPrice) * quantity : 0;

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3",
        className
      )}
    >
      {/* Unit price row */}
      <div className="flex justify-between items-center text-sm font-medium text-gray-900 dark:text-slate-100">
        <span>Unit price × {quantity}</span>
        <span className="font-mono font-bold text-base">
          ৳{currentSubtotal.toLocaleString()}
        </span>
      </div>

      {/* Normal regular discount row */}
      {normalDiscount > 0 && (
        <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          <span>Regular discount (Save ৳{(effRegularUnitPrice - unitPrice).toLocaleString()}/unit)</span>
          <span className="font-mono font-bold text-base">
            −৳{normalDiscount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Combo discount row */}
      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-sm text-red-500 dark:text-red-400 font-medium">
          <span>
            Combo discount{" "}
            {appliedTier &&
              `(${appliedTier.minQuantity}+ · ${
                appliedTier.discountType === "per_product" ? "per unit" : "on total"
              })`}
          </span>
          <span className="font-mono font-bold text-base">
            −৳{discountAmount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Dashed divider */}
      <div className="border-t border-dashed border-gray-200 dark:border-slate-800 my-2" />

      {/* Total row */}
      <div className="flex justify-between items-baseline pt-1">
        <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
          TOTAL
        </span>
        <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
          ৳{finalPrice.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
