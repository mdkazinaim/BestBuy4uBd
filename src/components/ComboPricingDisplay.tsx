import React from "react";
import { Flame, Truck, Package, BadgePercent, ChevronRight } from "lucide-react";

interface ComboPricingTier {
  minQuantity: number;
  discount: number;
  discountType?: "total" | "per_product" | "free_delivery" | "free_delivery_inside" | "free_delivery_outside";
  variantValue?: string;
}

interface ComboPricingDisplayProps {
  comboPricing: ComboPricingTier[];
  currentQuantity: number;
  appliedTier?: ComboPricingTier;
  variant?: "primary" | "secondary" | "success";
}

const ComboPricingDisplay: React.FC<ComboPricingDisplayProps> = ({
  comboPricing,
  currentQuantity,
  appliedTier,
}) => {
  if (!comboPricing || comboPricing.length === 0) return null;

  const sorted = [...comboPricing].sort((a, b) => a.minQuantity - b.minQuantity);
  const nextTier = sorted.find((t) => currentQuantity < t.minQuantity);
  const remaining = nextTier ? nextTier.minQuantity - currentQuantity : 0;

  const isFreeType = (dt?: string) =>
    ["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(dt || "");

  const getDiscountLabel = (tier: ComboPricingTier) => {
    if (tier.discountType === "free_delivery") return "ফ্রি ডেলিভারি";
    if (tier.discountType === "free_delivery_inside") return "ফ্রি ডেলিভারি (ঢাকায়)";
    if (tier.discountType === "free_delivery_outside") return "ফ্রি ডেলিভারি (ঢাকার বাইরে)";
    if (tier.discountType === "per_product") return `৳${tier.discount} সাশ্রয় (৳${tier.discount}/pcs ছাড়)`;
    return `৳${tier.discount} সাশ্রয়`;
  };

  const getSavingSubLabel = (tier: ComboPricingTier) => {
    if (isFreeType(tier.discountType)) return null;
    if (tier.discountType === "per_product") return `৳${tier.discount}/pcs ছাড়`;
    return `মোট ৳${tier.discount} ছাড়`;
  };

  const getTierIcon = (tier: ComboPricingTier) => {
    if (isFreeType(tier.discountType)) return <Truck className="w-4 h-4" />;
    if (tier.discountType === "per_product") return <Package className="w-4 h-4" />;
    return <BadgePercent className="w-4 h-4" />;
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-900/40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Flame className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <p className="text-sm font-black text-white leading-tight">কম্বো অফার পাওয়া যাচ্ছে!</p>
          <p className="text-[11px] text-emerald-100 font-medium">বেশি পরিমাণে কিনুন এবং সাশ্রয় করুন</p>
        </div>
      </div>

      {/* Tiers */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/10 px-4 py-3 space-y-2">
        {sorted.map((tier, idx) => {
          const isApplied = appliedTier && appliedTier.minQuantity === tier.minQuantity;
          const isMet = currentQuantity >= tier.minQuantity;
          const subLabel = getSavingSubLabel(tier);

          return (
            <div
              key={idx}
              className={`relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 border transition-all ${
                isApplied
                  ? "bg-emerald-500 border-emerald-500 shadow-sm"
                  : isMet
                  ? "bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800"
              }`}
            >
              {/* Left: qty label */}
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${
                  isApplied
                    ? "bg-white/20 text-white"
                    : isMet
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                }`}>
                  {tier.minQuantity}+ টি
                </span>
                <span className={`text-sm font-semibold ${isApplied ? "text-white" : "text-gray-700 dark:text-slate-300"}`}>
                  কিনুন
                </span>
                {tier.variantValue && (
                  <span className={`text-[10px] font-medium ${isApplied ? "text-white/70" : "text-gray-400"}`}>
                    ({tier.variantValue})
                  </span>
                )}
              </div>

              {/* Right: discount */}
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-1.5 font-black text-sm ${
                  isApplied ? "text-white" : isMet ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-slate-200"
                }`}>
                  {getTierIcon(tier)}
                  {getDiscountLabel(tier)}
                </div>
                {subLabel && (
                  <span className={`text-[10px] font-semibold mt-0.5 ${
                    isApplied ? "text-white/70" : "text-gray-400 dark:text-slate-500"
                  }`}>
                    ({subLabel})
                  </span>
                )}
              </div>

              {/* Applied badge */}
              {isApplied && (
                <div className="absolute -top-px -right-px bg-yellow-400 text-yellow-900 text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg rounded-tr-xl tracking-widest">
                  ✓ প্রযোজ্য
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer nudge */}
      <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/10 border-t border-emerald-200 dark:border-emerald-900/30">
        {nextTier && remaining > 0 ? (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            আরও <span className="font-black">{remaining}টি</span> যোগ করুন এবং স্বয়ংক্রিয়ভাবে ছাড় পান!
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            💡 পরিমাণ বাড়ান এবং স্বয়ংক্রিয়ভাবে ছাড় পান!
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboPricingDisplay;
