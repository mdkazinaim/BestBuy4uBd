import { useMemo } from 'react';
import { calculateComboPricing, ComboPricing } from '../utils/pricingUtils';

export interface PriceBreakdown {
  basePrice: number;
  variantTotal: number;
  subtotal: number;
  comboDiscount: number;
  finalTotal: number;
  totalQuantity: number;
  appliedComboTier?: ComboPricing | null;
}

export const usePriceCalculation = (
  product: any,
  selectedVariants: any[],
  manualQuantity?: number
): PriceBreakdown => {
  return useMemo(() => {
    if (!product) {
      return {
        basePrice: 0,
        variantTotal: 0,
        subtotal: 0,
        comboDiscount: 0,
        finalTotal: 0,
        totalQuantity: 0
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

    // Apply combo discount using centralized logic with merged tiers
    const { 
      appliedTier, 
      discountAmount: comboDiscount 
    } = calculateComboPricing(totalQuantity, 0, normalizedTiers, subtotal); 

    // Recalculate finalTotal 
    const realFinalTotal = Math.max(0, subtotal - comboDiscount);

    return {
      basePrice,
      variantTotal,
      subtotal,
      comboDiscount,
      finalTotal: realFinalTotal,
      totalQuantity,
      appliedComboTier: appliedTier
    };
  }, [product, selectedVariants, manualQuantity]);
};
