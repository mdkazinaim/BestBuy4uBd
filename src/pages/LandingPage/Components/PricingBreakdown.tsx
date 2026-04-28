interface PricingBreakdownProps {
  basePrice: number;
  variantTotal: number;
  comboDiscount: number;
  finalTotal: number;
  totalQuantity: number;
  appliedComboTier?: { minQuantity: number; discount: number };
  showBreakdown?: boolean;
  className?: string;
}

const PricingBreakdown = ({
  basePrice,
  variantTotal,
  comboDiscount,
  finalTotal,
  totalQuantity,
  appliedComboTier,
  showBreakdown = true,
  className = "",
}: PricingBreakdownProps) => {
  const hasBreakdown = variantTotal > 0 || comboDiscount > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Final Total - Always Shown */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-secondary">
          ৳{finalTotal.toLocaleString()}
        </span>
        {totalQuantity > 1 && (
          <span className="text-sm text-text-muted">
            ({totalQuantity} items)
          </span>
        )}
      </div>

      {/* Breakdown - Optional */}
      {showBreakdown && hasBreakdown && (
        <div className="text-xs text-text-muted flex flex-col gap-1">
          {basePrice > 0 && totalQuantity > 0 && (
            <span>
              Base Price ({basePrice.toLocaleString()} × {totalQuantity}):{" "}
              ৳{(basePrice * totalQuantity).toLocaleString()}
            </span>
          )}
          {variantTotal > 0 && (
            <span>Variants Extra: +৳{variantTotal.toLocaleString()}</span>
          )}
          {comboDiscount > 0 && (
            <span className="text-secondary font-bold">
              Combo Discount: -৳{comboDiscount.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Applied Combo Tier */}
      {appliedComboTier && (
        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
          <span>🎉</span>
          <span>
            Buy {appliedComboTier.minQuantity}+ Save ৳
            {appliedComboTier.discount}
          </span>
        </div>
      )}
    </div>
  );
};

export default PricingBreakdown;
