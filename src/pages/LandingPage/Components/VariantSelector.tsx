import { Minus, Check } from "lucide-react";
import { VariantSelection } from "@/hooks/useVariantQuantity";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  selectedVariants: VariantSelection[];
  productVariants?: any[];
  onVariantAdd: (group: string, item: any) => void;
  onVariantUpdate: (group: string, value: string, quantity: number) => void;
  showBaseVariant?: boolean;
  className?: string;
  isDark?: boolean;
}

const VariantSelector = ({
  selectedVariants,
  productVariants = [],
  onVariantAdd,
  onVariantUpdate,
  showBaseVariant = true,
  className = "",
  isDark = false,
}: VariantSelectorProps) => {
  // Helper to determine if a group is a color selector
  const isColorGroup = (groupName: string) => {
    return (
      groupName.toLowerCase().includes("color") ||
      groupName.toLowerCase().includes("colour")
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Base Variant - Auto-injected quantity option */}
      {showBaseVariant && selectedVariants.find((v) => v.isBaseVariant) && (
        <div className="space-y-3">
          <label className={cn(
            "text-xs font-semibold uppercase tracking-widest pl-1",
            isDark ? "text-white/50" : "text-muted-foreground"
          )}>
            Quantity
          </label>
          <div className="flex flex-wrap gap-3">
            {selectedVariants
              .filter((v) => v.isBaseVariant)
              .map((variant) => {
                const quantity = variant.quantity;
                const isActive = quantity > 0;

                return (
                  <button
                    key={variant.item.value}
                    onClick={() => {
                      onVariantUpdate(
                        variant.group,
                        variant.item.value,
                        quantity + 1,
                      );
                    }}
                    className={cn(
                      "group relative px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ease-out",
                      isActive
                        ? isDark
                          ? "border-emerald-500 bg-emerald-500/20 text-white shadow-sm ring-1 ring-emerald-500/30"
                          : "border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                        : isDark
                          ? "border-white/10 hover:border-white/20 text-white/70 bg-white/5"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700 bg-white",
                    )}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{variant.item.value}</span>
                      <span className="text-[10px] opacity-70 font-normal">
                        Base Price
                      </span>
                    </div>

                    {/* Quantity Badge */}
                    {isActive && (
                      <div className={cn(
                        "absolute -top-2.5 -right-2.5 text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in spin-in-12 duration-300",
                        isDark ? "bg-emerald-500 text-white ring-2 ring-slate-900" : "bg-brand-600 text-white ring-2 ring-white"
                      )}>
                        {quantity}
                      </div>
                    )}

                    {/* Decrease Control */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm z-10 transition-colors cursor-pointer",
                          isDark 
                            ? "bg-slate-800 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white ring-2 ring-slate-900" 
                            : "bg-white text-destructive border-destructive/20 hover:bg-destructive hover:text-white ring-2 ring-white"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantUpdate(
                            variant.group,
                            variant.item.value,
                            quantity - 1,
                          );
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Product Variants */}
      {productVariants?.map((variantGroup: any) => {
        const isColor = isColorGroup(variantGroup.group);

        return (
          <div key={variantGroup.group} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={cn(
                "text-xs font-semibold uppercase tracking-widest pl-1",
                isDark ? "text-white/50" : "text-muted-foreground"
              )}>
                Select {variantGroup.group}
              </label>
              {isColor && (
                <span className={cn(
                  "text-[10px] font-medium px-2",
                  isDark ? "text-white/40" : "text-muted-foreground/80"
                )}>
                  {/* Optional: Show selected color name specifically here if needed */}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {variantGroup.items.map((item: any) => {
                const selection = selectedVariants.find(
                  (v) =>
                    v.group === variantGroup.group &&
                    v.item.value === item.value,
                );
                const quantity = selection?.quantity || 0;
                const isActive = quantity > 0;

                // For color variants, try using the value as the background color
                // If it's a valid hex/rgb or name, it will work. Otherwise fallback styling handles it.
                // We use inline styles for the dynamic color.
                const colorStyle = isColor
                  ? { backgroundColor: item.value }
                  : {};

                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      onVariantAdd(variantGroup.group, item);
                    }}
                    title={isColor ? item.value : undefined}
                    className={cn(
                      "relative transition-all duration-200 ease-out group",
                      isDark ? "bg-white/5" : "bg-white",
                      isColor
                        ? (item.price ?? 0) > 0
                          ? "px-3 py-2 rounded-lg border shadow-sm flex items-center gap-2" // Color with price (Pill)
                          : "w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center" // Color swatch only
                        : "px-5 py-2.5 rounded-lg border text-sm font-medium flex flex-col items-center gap-0.5", // Text button
                      
                      // Active State
                      isActive 
                        ? isColor 
                          ? isDark
                            ? "border-emerald-500 ring-2 ring-emerald-500/30 ring-offset-1 ring-offset-slate-900"
                            : "border-brand-500 ring-2 ring-brand-200 ring-offset-1" 
                          : isDark
                            ? "border-emerald-500 bg-emerald-500/20 text-white shadow-sm ring-1 ring-emerald-500/30"
                            : "border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                        : isColor
                          ? isDark
                            ? "border-white/10 hover:border-emerald-500/50 ring-transparent"
                            : "border-gray-200 hover:border-brand-300 ring-transparent"
                          : isDark
                            ? "border-white/10 hover:border-white/20 text-white/70"
                            : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700"
                    )}
                    style={
                      isColor && (item.price ?? 0) === 0
                        ? colorStyle
                        : undefined
                    }
                  >
                    {/* Color Indication for Price Pill */}
                    {isColor && (item.price ?? 0) > 0 && (
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                        style={colorStyle}
                      />
                    )}

                    {/* Content for Non-Color Variants OR Color with Price */}
                    {(!isColor || (item.price ?? 0) > 0) && (
                      <>
                        {/* Show value only if NOT color or if color has price (optional, maybe just show price for color to keep it compact) */}
                        {!isColor && <span>{item.value}</span>}

                        {(item.price ?? 0) > 0 && (
                          <span
                            className={cn(
                              "text-[10px] font-normal",
                              isColor
                                ? isDark ? "text-white/80 font-medium whitespace-nowrap" : "text-gray-700 font-medium whitespace-nowrap"
                                : isDark ? "text-emerald-400" : "text-brand-600/80",
                            )}
                          >
                            +৳{item.price}
                          </span>
                        )}
                      </>
                    )}

                    {/* Content for Color Variants (Checkmark if active) */}
                    {isColor && isActive && (
                      <Check
                        className={cn(
                          "w-4 h-4 shadow-sm",
                          // Make checkmark visible based on lightness (simplified: usually white works, or toggle based on prop if complex)
                          "text-white mix-blend-difference",
                        )}
                      />
                    )}

                    {/* Quantity Badge */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute w-5 h-5 rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in spin-in-12 duration-300 text-[10px]",
                          isDark ? "bg-emerald-500 text-white ring-2 ring-slate-900" : "bg-brand-600 text-white ring-2 ring-white",
                          isColor
                            ? "-top-1 -right-1"
                            : "-top-2.5 -right-2.5",
                        )}
                      >
                        {quantity}
                      </div>
                    )}

                    {/* Decrease Control */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute w-5 h-5 rounded-full flex items-center justify-center border shadow-sm z-10 transition-colors cursor-pointer",
                          isDark 
                            ? "bg-slate-800 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white ring-2 ring-slate-900" 
                            : "bg-white text-destructive border-destructive/20 hover:bg-destructive hover:text-white ring-2 ring-white",
                          isColor 
                            ? "-top-1 -left-1" 
                            : "-top-2.5 -left-2.5",
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantUpdate(
                            variantGroup.group,
                            item.value,
                            quantity - 1,
                          );
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;
