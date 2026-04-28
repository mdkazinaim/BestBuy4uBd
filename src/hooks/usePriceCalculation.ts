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
    // Normalize comboPricing and bulkPricing into a single tiers array
    const normalizedTiers: ComboPricing[] = [...(product.comboPricing || [])];
    
    // Legacy Bulk Pricing Logic REMOVED per user request
    // We now strictly use comboPricing tiers

    // Check if base variant exists in selectedVariants
    const baseVariant = selectedVariants.find(v => v.isBaseVariant);
    const baseVariantQuantity = baseVariant?.quantity || 0;
    
    // Calculate variant total (additive pricing)
    const variantTotal = selectedVariants.reduce((sum, v) => {
      if (v.isBaseVariant) return sum;
      return sum + ((v.item.price || 0) * v.quantity);
    }, 0);

    // Calculate subtotal
    const subtotal = (basePrice * baseVariantQuantity) + variantTotal;

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
