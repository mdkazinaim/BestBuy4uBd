import { Minus, Plus, Truck, Tag, Percent } from "lucide-react";
import { useState } from "react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { cn } from "@/lib/utils";
import BundleSelector, { ProductBundle } from "@/pages/Public/Shop/Components/ProductDetails/BundleSelector";

interface VariantItem {
  value: string;
  price?: number;
  stock?: number;
  isBaseVariant?: boolean;
}

interface VariantGroup {
  group: string;
  items: VariantItem[];
}

interface SelectedVariant {
  group: string;
  item: { value: string; price?: number; stock?: number };
  quantity?: number;
  isBaseVariant?: boolean;
}

interface ProductOrderWidgetProps {
  product: any;
  selectedVariants: SelectedVariant[];
  quantity: number;
  onVariantSelect: (group: string, item: any) => void;
  onQuantityChange: (newQuantity: number) => void;
  selectBundleVariants?: (variants: any[]) => void;
  deliveryCharge?: number;
  discount?: number;
  isDark?: boolean;
  locale?: "bn" | "en";
}

export default function ProductOrderWidget({
  product,
  selectedVariants,
  quantity,
  onVariantSelect,
  onQuantityChange,
  deliveryCharge = 0,
  discount = 0,
  isDark = false,
}: ProductOrderWidgetProps) {
  const [activeBundle, setActiveBundle] = useState<ProductBundle | null>(null);
  const [bundleQuantity, setBundleQuantity] = useState(1);

  const { subtotal, comboDiscount, bundleDiscount, finalTotal, isFreeDelivery, isFreeDeliveryInside, isFreeDeliveryOutside } =
    usePriceCalculation(product, selectedVariants, quantity, activeBundle);

  const effectiveDeliveryCharge = isFreeDelivery ? 0 : deliveryCharge;

  if (!product) return null;

  const basePrice = product.price?.discounted || product.price?.regular || 0;
  const regularPrice = product.price?.regular || basePrice;

  // Bundle pricing helpers
  const getBundleUnitPrice = (bundle: ProductBundle): number => {
    const bvName = product?.price?.baseVariantName;
    return bundle.variants.reduce((total, val) => {
      if (val === bvName) return total + basePrice;
      for (const group of product?.variants || []) {
        const item = group.items.find((i: any) => i.value === val);
        if (item) return total + (!item.price || item.price === 0 ? basePrice : item.price);
      }
      return total + basePrice;
    }, 0);
  };

  const bundleUnitPrice = activeBundle ? getBundleUnitPrice(activeBundle) : 0;
  const bundleFinalUnitPrice = (() => {
    if (!activeBundle) return 0;
    if (["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(activeBundle.discountType)) return bundleUnitPrice;
    if (activeBundle.discountType === "percentage") return Math.max(0, bundleUnitPrice - (bundleUnitPrice * activeBundle.discount) / 100);
    return Math.max(0, bundleUnitPrice - activeBundle.discount);
  })();

  const bundleFreeShipping = activeBundle ? ["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(activeBundle.discountType) : false;
  const bundleFreeShippingInside = activeBundle?.discountType === "free_delivery_inside";
  const bundleFreeShippingOutside = activeBundle?.discountType === "free_delivery_outside";

  const bundleSubtotal = bundleUnitPrice * bundleQuantity;
  const bundleFinalTotal = bundleFinalUnitPrice * bundleQuantity;
  const bundleSavings = bundleSubtotal - bundleFinalTotal;

  const displaySubtotal = activeBundle ? bundleSubtotal : subtotal;
  const displayFinal = activeBundle ? bundleFinalTotal : finalTotal;
  const displayComboDiscount = activeBundle ? 0 : comboDiscount;
  const displayBundleDiscount = activeBundle ? bundleSavings : bundleDiscount;
  const displayFreeDelivery = activeBundle ? bundleFreeShipping : isFreeDelivery;
  const displayFreeDeliveryInside = activeBundle ? bundleFreeShippingInside : isFreeDeliveryInside;
  const displayFreeDeliveryOutside = activeBundle ? bundleFreeShippingOutside : isFreeDeliveryOutside;
  const displayDelivery = displayFreeDelivery ? 0 : (activeBundle ? 0 : effectiveDeliveryCharge);
  const displayQuantity = activeBundle ? bundleQuantity : quantity;
  const grandTotal = Math.max(0, displayFinal + displayDelivery - discount);

  const freeDeliveryLabel = displayFreeDeliveryInside ? "ঢাকায় ফ্রি" : displayFreeDeliveryOutside ? "ঢাকার বাইরে ফ্রি" : "ফ্রি";

  return (
    <div className="space-y-3">

      {/* Bundle Selector */}
      {product.bundles && product.bundles.length > 0 && (
        <BundleSelector
          product={product}
          activeBundle={activeBundle}
          bundleQuantity={bundleQuantity}
          onSelectBundle={(b) => { setActiveBundle(b); setBundleQuantity(1); }}
          onClearBundle={() => { setActiveBundle(null); setBundleQuantity(1); }}
          isDark={isDark}
        />
      )}

      {/* Variant Selector */}
      {!activeBundle && product.variants && product.variants.length > 0 && (
        <div className={cn(
          "rounded-2xl border overflow-hidden",
          isDark ? "border-white/10" : "border-gray-200 dark:border-slate-800"
        )}>
          {product.variants.map((variantGroup: VariantGroup, gIdx: number) => {
            const baseVariantItem = {
              value: product.price?.baseVariantName || "Standard",
              price: 0,
              stock: product.stockQuantity,
              isBaseVariant: true,
              image: product.price?.image,
            };
            const itemsToRender = gIdx === 0
              ? [baseVariantItem, ...variantGroup.items.filter((i: VariantItem) => i.value !== (product.price?.baseVariantName || "Standard"))]
              : variantGroup.items;

            const selectedInGroup = selectedVariants?.find(
              (sv) => sv.group === variantGroup.group && (sv.quantity || 0) > 0 && !sv.isBaseVariant
            );
            const selectedValue = selectedInGroup?.item?.value || product.price?.baseVariantName || "Standard";

            return (
              <div key={variantGroup.group}>
                {/* Group header */}
                <div className={cn(
                  "px-4 py-2.5 flex items-center justify-between border-b",
                  isDark ? "bg-white/5 border-white/10" : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800"
                )}>
                  <span className={cn("text-xs uppercase tracking-widest", isDark ? "text-white/50" : "text-gray-400 dark:text-slate-500")}>
                    {variantGroup.group} বেছে নিন
                  </span>
                  <span className={cn("text-xs", isDark ? "text-white/40" : "text-gray-400")}>
                    {itemsToRender.length} অপশন
                  </span>
                </div>

                {/* Variant buttons */}
                <div className={cn("p-3 grid gap-2", itemsToRender.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
                  {itemsToRender.map((item: VariantItem) => {
                    const isSelected = item.value === selectedValue;
                    const itemPrice = (item.isBaseVariant || !item.price || item.price === 0) ? basePrice : item.price;
                    const itemOrigPrice = (item.isBaseVariant || !item.price || item.price === 0) ? regularPrice : item.price + Math.max(0, regularPrice - basePrice);

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => onVariantSelect(variantGroup.group, item)}
                        className={cn(
                          "relative py-2.5 px-3 rounded-xl text-left transition-all duration-150 cursor-pointer flex flex-col gap-0.5",
                          isSelected
                            ? isDark
                              ? "bg-emerald-500/15 border-2 border-emerald-500"
                              : "bg-emerald-50 border-2 border-emerald-500 dark:bg-emerald-950/30"
                            : isDark
                            ? "bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/8"
                            : "bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                        )}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                        <span className={cn(
                          "text-xs uppercase tracking-wide",
                          isSelected
                            ? isDark ? "text-emerald-300" : "text-emerald-700 dark:text-emerald-400"
                            : isDark ? "text-white/55" : "text-gray-500 dark:text-slate-400"
                        )}>
                          {item.value}
                        </span>
                        <span className={cn(
                          "text-lg leading-tight",
                          isSelected
                            ? isDark ? "text-emerald-200" : "text-emerald-800 dark:text-emerald-300"
                            : isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
                        )}>
                          ৳{itemPrice.toLocaleString()}
                        </span>
                        {itemOrigPrice > itemPrice && (
                          <span className={cn("text-xs line-through", isDark ? "text-white/25" : "text-gray-350 dark:text-slate-600")}>
                            ৳{itemOrigPrice.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity + Price — combined card */}
      <div className={cn(
        "rounded-2xl border overflow-hidden",
        isDark ? "border-white/10" : "border-gray-200 dark:border-slate-800"
      )}>

        {/* Quantity row */}
        <div className={cn(
          "flex items-center justify-between px-4 py-3 border-b",
          isDark ? "bg-white/5 border-white/10" : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800"
        )}>
          <div>
            <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600 dark:text-slate-400")}>
              {activeBundle ? "বান্ডেল সংখ্যা" : "পরিমাণ"}
            </p>
            <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
              {activeBundle ? "কতটি বান্ডেল নিতে চান" : "আইটেমের সংখ্যা"}
            </p>
          </div>
          <div className={cn(
            "flex items-center rounded-xl border overflow-hidden",
            isDark ? "border-white/10 bg-white/5" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950"
          )}>
            <button
              type="button"
              onClick={() => activeBundle ? setBundleQuantity((q) => Math.max(1, q - 1)) : onQuantityChange(Math.max(1, quantity - 1))}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors cursor-pointer",
                isDark ? "text-white/50 hover:bg-white/10 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className={cn(
              "w-10 text-center text-base",
              isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
            )}>
              {displayQuantity}
            </span>
            <button
              type="button"
              onClick={() => activeBundle ? setBundleQuantity((q) => q + 1) : onQuantityChange(quantity + 1)}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors cursor-pointer",
                isDark ? "text-white/50 hover:bg-white/10 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Price breakdown */}
        <div className={cn("px-4 py-3 space-y-2", isDark ? "bg-slate-900/20" : "bg-white dark:bg-slate-950")}>

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600 dark:text-slate-400")}>
              {activeBundle ? `বান্ডেল × ${bundleQuantity}` : `ইউনিট মূল্য × ${quantity}`}
            </span>
            <span className={cn("text-sm", isDark ? "text-white" : "text-gray-800 dark:text-slate-200")}>
              ৳{displaySubtotal.toLocaleString()}
            </span>
          </div>

          {/* Combo discount */}
          {displayComboDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className={cn("text-sm flex items-center gap-1.5", isDark ? "text-emerald-400" : "text-emerald-600")}>
                <Percent className="w-3.5 h-3.5" /> কম্বো ছাড়
              </span>
              <span className={cn("text-sm", isDark ? "text-emerald-400" : "text-emerald-600")}>
                −৳{displayComboDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Bundle discount */}
          {displayBundleDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className={cn("text-sm flex items-center gap-1.5", isDark ? "text-emerald-400" : "text-emerald-600")}>
                <Tag className="w-3.5 h-3.5" /> বান্ডেল ছাড়
              </span>
              <span className={cn("text-sm", isDark ? "text-emerald-400" : "text-emerald-600")}>
                −৳{displayBundleDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Delivery */}
          <div className="flex items-center justify-between">
            <span className={cn("text-sm flex items-center gap-1.5", isDark ? "text-white/70" : "text-gray-600 dark:text-slate-400")}>
              <Truck className="w-3.5 h-3.5" /> ডেলিভারি চার্জ
            </span>
            <span className={cn(
              "text-sm",
              displayFreeDelivery || displayFreeDeliveryInside || displayFreeDeliveryOutside
                ? isDark ? "text-sky-400" : "text-sky-600"
                : isDark ? "text-white/80" : "text-gray-700 dark:text-slate-300"
            )}>
              {(displayFreeDelivery || displayFreeDeliveryInside || displayFreeDeliveryOutside)
                ? freeDeliveryLabel
                : `৳${displayDelivery.toLocaleString()}`}
            </span>
          </div>

          {/* Coupon discount */}
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className={cn("text-sm flex items-center gap-1.5", isDark ? "text-emerald-400" : "text-emerald-600")}>
                <Tag className="w-3.5 h-3.5" /> কুপন ছাড়
              </span>
              <span className={cn("text-sm", isDark ? "text-emerald-400" : "text-emerald-600")}>
                −৳{discount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-white/8" : "bg-gray-100 dark:bg-slate-800")} />

          {/* Grand total */}
          <div className="flex items-end justify-between pt-0.5">
            <div>
              <p className={cn("text-sm", isDark ? "text-white/60" : "text-gray-500 dark:text-slate-400")}>
                সর্বমোট
              </p>
              <p className={cn("text-xs mt-0.5", isDark ? "text-white/30" : "text-gray-400")}>
                ক্যাশ অন ডেলিভারি
              </p>
            </div>
            <span className={cn(
              "text-3xl md:text-4xl leading-none",
              isDark ? "text-emerald-400" : "text-gray-900 dark:text-white"
            )}>
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
