import { useMemo } from 'react';
import { calculateComboPricing, ComboPricing } from '../utils/pricingUtils';

export interface PriceBreakdown {
  basePrice: number;
  variantTotal: number;
  subtotal: number;
  comboDiscount: number;
  bundleDiscount: number;
  finalTotal: number;
  totalQuantity: number;
  appliedComboTier?: ComboPricing | null;
  isFreeDelivery: boolean;
  isFreeDeliveryInside: boolean;
  isFreeDeliveryOutside: boolean;
}

export const usePriceCalculation = (
  product: any,
  selectedVariants: any[],
  manualQuantity?: number,
  activeBundle?: any | null
): PriceBreakdown => {
  return useMemo(() => {
    if (!product) {
      return {
        basePrice: 0,
        variantTotal: 0,
        subtotal: 0,
        comboDiscount: 0,
        bundleDiscount: 0,
        finalTotal: 0,
        totalQuantity: 0,
        isFreeDelivery: false,
        isFreeDeliveryInside: false,
        isFreeDeliveryOutside: false,
      };
    }

    // Calculate total quantity from variants or use manual quantity
    const variantQtySum = selectedVariants.reduce((sum, v) => sum + (v.quantity || 1), 0);
    const totalQuantity = manualQuantity !== undefined ? manualQuantity : variantQtySum;

    // Base price is discounted price if available, otherwise regular price
    const basePrice = product.price.discounted || product.price.regular;
    
    // Filter comboPricing based on selected variants if variantValue is specified
    const activeSelectedVariants = selectedVariants.filter((v) => (v.quantity || 0) > 0);
    const selectedValues = activeSelectedVariants.map(v => v.item?.value || v.value);
    
    const applicableTiers = (product.comboPricing || []).filter((tier: any) => {
      if (!tier.variantValue || tier.variantValue === "") {
        return true;
      }
      return selectedValues.includes(tier.variantValue);
    });

    const normalizedTiers: ComboPricing[] = [...applicableTiers];

    // Calculate subtotal for all active selected variants
    const activeVariants = selectedVariants.filter((v) => (v.quantity || 0) > 0);

    let subtotal = 0;
    let variantTotal = 0;

    if (activeVariants.length > 0) {
      subtotal = activeVariants.reduce((sum, v) => {
        const unitPriceForVariant = (v.isBaseVariant || !v.item?.price || v.item.price === 0)
          ? basePrice
          : v.item.price;
        return sum + (unitPriceForVariant * v.quantity);
      }, 0);

      variantTotal = activeVariants.reduce((sum, v) => {
        if (v.isBaseVariant || !v.item?.price || v.item.price === 0) return sum;
        const extra = v.item.price - basePrice;
        return sum + (extra * v.quantity);
      }, 0);
    } else {
      subtotal = basePrice * totalQuantity;
    }

    // Apply combo discount — suppressed when a bundle is active
    const { 
      appliedTier, 
      discountAmount: comboDiscount,
      isFreeDelivery: comboFreeDelivery
    } = activeBundle
      ? { appliedTier: null, discountAmount: 0, isFreeDelivery: false }
      : calculateComboPricing(totalQuantity, 0, normalizedTiers, subtotal); 

    // Calculate bundle discounts
    let bundleDiscount = 0;
    let bundleFreeDelivery = false;
    let bundleFreeDeliveryInside = false;
    let bundleFreeDeliveryOutside = false;
    
    if (product.bundles && product.bundles.length > 0) {
      for (const bundle of product.bundles) {
        const isBundleMatched = bundle.variants.every((vVal: string) => selectedValues.includes(vVal));
        if (isBundleMatched) {
          if (bundle.discountType === 'free_delivery') {
            bundleFreeDelivery = true;
          } else if (bundle.discountType === 'free_delivery_inside') {
            bundleFreeDeliveryInside = true;
          } else if (bundle.discountType === 'free_delivery_outside') {
            bundleFreeDeliveryOutside = true;
          } else if (bundle.discountType === 'percentage') {
            // Find combined price of the variants in this bundle to calculate percentage
            let combinedPrice = 0;
            for (const vVal of bundle.variants) {
              let itemPrice = basePrice;
              for (const group of product.variants || []) {
                const foundItem = group.items.find((i: any) => i.value === vVal);
                if (foundItem?.price && foundItem.price > 0) {
                  itemPrice = foundItem.price;
                }
              }
              combinedPrice += itemPrice;
            }
            bundleDiscount += (combinedPrice * bundle.discount) / 100;
          } else {
            // flat discount
            bundleDiscount += bundle.discount;
          }
        }
      }
    }

    // Recalculate finalTotal 
    const finalTotal = Math.max(0, subtotal - comboDiscount - bundleDiscount);

    // Merge shipping/delivery charge waive status
    const isFreeDelivery = !!(comboFreeDelivery || bundleFreeDelivery || product.additionalInfo?.freeShipping);
    const isFreeDeliveryInside = !!(bundleFreeDeliveryInside);
    const isFreeDeliveryOutside = !!(bundleFreeDeliveryOutside);

    return {
      basePrice,
      variantTotal,
      subtotal,
      comboDiscount,
      bundleDiscount,
      finalTotal,
      totalQuantity,
      appliedComboTier: appliedTier,
      isFreeDelivery,
      isFreeDeliveryInside,
      isFreeDeliveryOutside,
    };
  }, [product, selectedVariants, manualQuantity, activeBundle]);
};
