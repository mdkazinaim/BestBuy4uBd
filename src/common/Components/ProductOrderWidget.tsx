import { Minus, Plus } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { cn } from "@/lib/utils";

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
  item: {
    value: string;
    price?: number;
    stock?: number;
  };
  quantity?: number;
  isBaseVariant?: boolean;
}

interface ProductOrderWidgetProps {
  product: {
    variants?: VariantGroup[];
    stockQuantity?: number;
    price?: {
      regular?: number;
      discounted?: number;
      baseVariantName?: string;
    };
  } | any;
  selectedVariants: SelectedVariant[];
  quantity: number;
  onVariantSelect: (group: string, item: any) => void;
  onQuantityChange: (newQuantity: number) => void;
  deliveryCharge?: number;
  discount?: number; // Coupon discount
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
  // Calculate pricing breakdown reactively
  const {
    subtotal,
    comboDiscount,
    finalTotal
  } = usePriceCalculation(product, selectedVariants, quantity);

  if (!product) return null;

  const basePrice = product.price?.discounted || product.price?.regular || 0;
  const regularPrice = product.price?.regular || basePrice;

  return (
    <div className="space-y-3">
      {/* 1. Variant Selector (Slimmer padding card) */}
      {product.variants && product.variants.length > 0 && (
        <div className={cn(
          "p-3 md:p-4 rounded-xl shadow-sm border space-y-3",
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100 dark:border-slate-800"
        )}>
          {product.variants.map((variantGroup: VariantGroup, gIdx: number) => {
            const baseVariantItem = {
              value: product.price?.baseVariantName || "Standard",
              price: 0,
              stock: product.stockQuantity,
              isBaseVariant: true,
            };
            const itemsToRender = gIdx === 0
              ? [baseVariantItem, ...variantGroup.items.filter((i: VariantItem) => i.value !== (product.price?.baseVariantName || "Standard"))]
              : variantGroup.items;

            // Determine currently selected variant for this group
            const selectedInGroup = selectedVariants?.find(
              (sv: SelectedVariant) => sv.group === variantGroup.group && (sv.quantity || 0) > 0 && !sv.isBaseVariant
            );
            
            const hasBaseSelected = selectedVariants?.some(
              (sv: SelectedVariant) => sv.isBaseVariant && (sv.quantity || 0) > 0
            );

            const selectedValue = selectedInGroup?.item?.value ||
              (hasBaseSelected
                ? (product.price?.baseVariantName || "Standard")
                : (product.price?.baseVariantName || "Standard"));

            return (
              <div key={variantGroup.group} className="space-y-2">
                <h3 className={cn(
                  "text-base font-medium uppercase pl-1",
                  isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
                )}>
                  {variantGroup.group} সিলেক্ট করুন
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {itemsToRender.map((item: VariantItem) => {
                    const isSelected = item.value === selectedValue;
                    const itemExtraPrice = item.price || 0;
                    const itemBasePrice = basePrice + itemExtraPrice;
                    const itemWasPrice = regularPrice + itemExtraPrice;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => onVariantSelect(variantGroup.group, item)}
                        className={`py-2 px-3.5 rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? isDark
                              ? "border-2 border-emerald-500 bg-emerald-500/10 shadow-sm"
                              : "border-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm"
                            : isDark
                            ? "border border-white/10 bg-white/5 hover:border-white/20"
                            : "border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className={`text-sm font-extrabold uppercase tracking-wide mb-0.5 ${
                          isSelected
                            ? isDark ? "text-emerald-300" : "text-emerald-800 dark:text-emerald-400"
                            : isDark ? "text-white/60" : "text-gray-600 dark:text-slate-400"
                        }`}>
                          {item.value}
                        </div>
                        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                          <span className={`font-mono font-black text-xl ${
                            isSelected
                              ? isDark ? "text-emerald-300 animate-pulse" : "text-emerald-700 dark:text-emerald-450"
                              : isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
                          }`}>
                            ৳{itemBasePrice.toLocaleString()}
                          </span>
                          {itemWasPrice > itemBasePrice && (
                            <span className={`line-through text-xs font-medium ${
                              isDark ? "text-white/30" : "text-gray-400 dark:text-slate-500"
                            }`}>
                              ৳{itemWasPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Quantity Selector (Slimmer padding card) */}
      <div className={cn(
        "p-3 md:p-4 rounded-xl shadow-sm border flex items-center justify-between",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100 dark:border-slate-800"
      )}>
        <div className="space-y-0.5">
          <h3 className={cn(
            "text-base font-medium uppercase pl-1",
            isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
          )}>
            পরিমাণ
          </h3>
          <p className={cn(
            "text-xs md:text-sm uppercase pl-1",
            isDark ? "text-white/40" : "text-gray-450 dark:text-slate-500"
          )}>
            আইটেমের সংখ্যা সিলেক্ট করুন
          </p>
        </div>
        <div className={cn(
          "flex items-center rounded-lg p-0.5 border",
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950"
        )}>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer",
              isDark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-gray-500 hover:bg-gray-250 hover:text-gray-900"
            )}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className={cn(
            "w-10 text-center text-base font-black",
            isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
          )}>{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer",
              isDark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-gray-500 hover:bg-gray-250 hover:text-gray-900"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Price Breakdown (Slimmer padding card) */}
      <div className={cn(
        "p-3 md:p-4 rounded-xl shadow-sm border space-y-2",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100 dark:border-slate-800"
      )}>
        {/* Unit price × qty */}
        <div className={cn(
          "flex justify-between items-center text-base font-medium",
          isDark ? "text-white/70" : "text-gray-700 dark:text-slate-350"
        )}>
          <span>ইউনিট মূল্য × {quantity}</span>
          <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900 dark:text-slate-100")}>
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        {/* Regular discount / Combo pricing discount */}
        {comboDiscount > 0 && (
          <div className={cn(
            "flex justify-between items-center text-base font-semibold",
            isDark ? "text-emerald-400" : "text-emerald-600"
          )}>
            <span>কম্বো ডিসকাউন্ট (-)</span>
            <span>-৳{comboDiscount.toLocaleString()}</span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className={cn(
          "flex justify-between items-center text-base font-medium",
          isDark ? "text-white/70" : "text-gray-700 dark:text-slate-350"
        )}>
          <span>ডেলিভারি চার্জ</span>
          <span className={cn(
            "font-semibold",
            product.additionalInfo?.freeShipping ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900 dark:text-slate-100"
          )}>
            {product.additionalInfo?.freeShipping ? "ফ্রি" : `৳${deliveryCharge.toLocaleString()}`}
          </span>
        </div>

        {/* Coupon discount */}
        {discount > 0 && (
          <div className={cn(
            "flex justify-between items-center text-base font-semibold",
            isDark ? "text-emerald-400" : "text-emerald-600"
          )}>
            <span>কুপন ডিসকাউন্ট (-)</span>
            <span>-৳{discount.toLocaleString()}</span>
          </div>
        )}

        {/* Divider */}
        <div className={cn("h-px", isDark ? "bg-white/10" : "bg-gray-150 dark:bg-slate-850")} />

        {/* TOTAL */}
        <div className="flex justify-between items-center pt-0.5">
          <div className="flex flex-col">
            <span className={cn(
              "text-base font-semibold uppercase",
              isDark ? "text-white/55" : "text-gray-500 dark:text-slate-400"
            )}>
              সর্বমোট
            </span>
            <span className={cn(
              "text-[10px] md:text-sm font-medium uppercase ",
              isDark ? "text-white/40" : "text-gray-500 dark:text-slate-500"
            )}>
              ক্যাশ অন ডেলিভারি
            </span>
          </div>
          <span className={cn(
            "text-3xl md:text-4xl font-semibold",
            isDark ? "text-emerald-400" : "text-gray-800 dark:text-white"
          )}>
            ৳{Math.max(0, finalTotal + deliveryCharge - discount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
