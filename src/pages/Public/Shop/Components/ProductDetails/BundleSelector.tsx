import { Sparkles, ShoppingBag, Truck, Tag, X, Check } from "lucide-react";
import { toast } from "sonner";

export interface ProductBundle {
  name?: string;
  variants: string[];
  discount: number;
  discountType: "flat" | "percentage" | "free_delivery" | "free_delivery_inside" | "free_delivery_outside";
}

interface BundleSelectorProps {
  product: any;
  activeBundle: ProductBundle | null;
  bundleQuantity: number;
  onSelectBundle: (bundle: ProductBundle) => void;
  onClearBundle: () => void;
  isDark?: boolean;
}

function getVariantUnitPrice(val: string, product: any): number {
  const basePrice = product?.price?.discounted || product?.price?.regular || 0;
  const baseVariantName = product?.price?.baseVariantName;
  if (val === baseVariantName) return basePrice;
  for (const group of product?.variants || []) {
    const item = group.items.find((i: any) => i.value === val);
    if (item) return !item.price || item.price === 0 ? basePrice : item.price;
  }
  return basePrice;
}

function getBundleCombinedPrice(bundle: ProductBundle, product: any): number {
  return bundle.variants.reduce((sum, val) => sum + getVariantUnitPrice(val, product), 0);
}

function getBundleFinalPrice(bundle: ProductBundle, combinedPrice: number): number | null {
  if (["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(bundle.discountType)) return null;
  if (bundle.discountType === "percentage") return Math.max(0, combinedPrice - (combinedPrice * bundle.discount) / 100);
  return Math.max(0, combinedPrice - bundle.discount);
}

function isFreeShipping(bundle: ProductBundle) {
  return ["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(bundle.discountType);
}

function freeShippingLabel(bundle: ProductBundle) {
  if (bundle.discountType === "free_delivery") return "ফ্রি ডেলিভারি (সব জায়গায়)";
  if (bundle.discountType === "free_delivery_inside") return "ফ্রি ডেলিভারি (ঢাকায়)";
  return "ফ্রি ডেলিভারি (ঢাকার বাইরে)";
}

function discountLabel(bundle: ProductBundle) {
  if (isFreeShipping(bundle)) return freeShippingLabel(bundle);
  if (bundle.discountType === "percentage") return `${bundle.discount}% ছাড়`;
  return `৳${bundle.discount} ছাড়`;
}

export default function BundleSelector({
  product,
  activeBundle,
  bundleQuantity,
  onSelectBundle,
  onClearBundle,
  isDark = false,
}: BundleSelectorProps) {
  const bundles: ProductBundle[] = product?.bundles || [];
  if (bundles.length === 0) return null;

  const isBundleActive = (bundle: ProductBundle) =>
    activeBundle !== null &&
    activeBundle.variants.length === bundle.variants.length &&
    activeBundle.variants.every((v) => bundle.variants.includes(v));

  return (
    <div className="space-y-2.5 mt-5">
      {/* Section header */}
      <div className="flex items-center gap-2 px-0.5">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className={`text-xs uppercase tracking-widest font-medium ${isDark ? "text-white/70" : "text-gray-500 dark:text-slate-400"}`}>
          স্পেশাল বান্ডেল অফার
        </span>
      </div>

      {/* Bundle cards */}
      <div className="space-y-2">
        {bundles.map((bundle, idx) => {
          const isActive = isBundleActive(bundle);
          const combinedPrice = getBundleCombinedPrice(bundle, product);
          const finalPrice = getBundleFinalPrice(bundle, combinedPrice);
          const freeShip = isFreeShipping(bundle);
          const savings = finalPrice !== null ? combinedPrice - finalPrice : 0;
          const scaledCombined = isActive ? combinedPrice * bundleQuantity : combinedPrice;
          const scaledFinal = finalPrice !== null ? (isActive ? finalPrice * bundleQuantity : finalPrice) : null;
          const scaledSavings = isActive ? savings * bundleQuantity : savings;

          return (
            <div
              key={idx}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                isActive
                  ? isDark
                    ? "border-emerald-600/50"
                    : "border-emerald-400 dark:border-emerald-600/50"
                  : isDark
                  ? "border-white/10"
                  : "border-gray-200 dark:border-slate-800"
              }`}
            >
              {/* Card header */}
              <div className={`flex items-center justify-between gap-2 px-4 py-2.5 border-b ${
                isActive
                  ? isDark
                    ? "bg-emerald-900/30 border-emerald-600/30"
                    : "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700/30"
                  : isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800"
              }`}>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  {isActive && <Check className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
                  <span className={`text-sm uppercase tracking-wide truncate ${
                    isActive
                      ? isDark ? "text-emerald-400" : "text-emerald-700 dark:text-emerald-400"
                      : isDark ? "text-white" : "text-gray-700 dark:text-slate-200"
                  }`}>
                    {bundle.name || `Bundle Offer #${idx + 1}`}
                  </span>
                  {/* Discount pill */}
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs uppercase tracking-wide ${
                    isActive
                      ? isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                      : freeShip
                      ? isDark ? "bg-sky-500/15 text-sky-400" : "bg-sky-50 text-sky-600"
                      : isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {discountLabel(bundle)}
                  </span>
                </div>
                {isActive && (
                  <button
                    onClick={onClearBundle}
                    className={`shrink-0 flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                      isDark ? "text-white/30 hover:text-red-400" : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <X className="w-3 h-3" /> বাতিল
                  </button>
                )}
              </div>

              {/* Price breakdown body */}
              <div className={`px-4 py-3 space-y-1.5 ${isDark ? "bg-slate-900/20" : "bg-white dark:bg-slate-950"}`}>
                {/* Per-variant rows */}
                {bundle.variants.map((val, vIdx) => {
                  const unitPrice = getVariantUnitPrice(val, product);
                  return (
                    <div key={vIdx} className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? "text-white/70" : "text-gray-600 dark:text-slate-400"}`}>
                        {val}
                      </span>
                      <span className={`text-sm ${isDark ? "text-white/90" : "text-gray-800 dark:text-slate-200"}`}>
                        ৳{unitPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                {/* Divider */}
                <div className={`h-px my-1 ${isDark ? "bg-white/8" : "bg-gray-100 dark:bg-slate-800"}`} />

                {/* Totals */}
                {freeShip ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? "text-white/70" : "text-gray-600 dark:text-slate-400"}`}>মোট</span>
                      <span className={`text-sm ${isDark ? "text-white" : "text-gray-800 dark:text-slate-200"}`}>
                        ৳{scaledCombined.toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                      <Truck className="w-3.5 h-3.5" />
                      {freeShippingLabel(bundle)}
                    </div>
                  </>
                ) : scaledFinal !== null ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs line-through ${isDark ? "text-white/30" : "text-gray-350 dark:text-slate-600"}`}>মূল্য</span>
                      <span className={`text-xs line-through ${isDark ? "text-white/30" : "text-gray-350 dark:text-slate-600"}`}>
                        ৳{scaledCombined.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isActive ? isDark ? "text-emerald-400" : "text-emerald-600" : isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        বান্ডেল মূল্য
                      </span>
                      <span className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        ৳{scaledFinal.toLocaleString()}
                      </span>
                    </div>
                    {scaledSavings > 0 && (
                      <div className={`flex items-center gap-1 text-xs ${isDark ? "text-emerald-400/70" : "text-emerald-500"}`}>
                        <Tag className="w-3 h-3" />
                        সাশ্রয়: ৳{scaledSavings.toLocaleString()}
                      </div>
                    )}
                  </>
                ) : null}

                {/* Action button */}
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectBundle(bundle);
                      toast.success(`"${bundle.name || "Bundle"}" অফার সিলেক্ট হয়েছে!`);
                    }}
                    className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                      isDark
                        ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    বান্ডেলে অর্ডার করুন
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClearBundle}
                    className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                      isDark
                        ? "bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-white/10"
                        : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    বান্ডেল বাতিল করুন
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
