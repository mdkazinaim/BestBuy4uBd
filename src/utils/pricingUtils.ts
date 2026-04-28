export interface ComboPricing {
  minQuantity: number;
  discount: number;
  discountType?: "total" | "per_product";
}

export interface PricingResult {
  appliedTier: ComboPricing | null;
  discountAmount: number;
  finalPrice: number;
  savings: number;
  unitPrice: number;
  originalTotal: number;
}

/**
 * Calculates the combo discount based on quantity and pricing tiers.
 * 
 * Rules:
 * 1. Tiers are sorted by minQuantity descending (highest quantity requirement first).
 * 2. The first tier that satisfies quantity >= minQuantity is selected.
 * 3. Total Discount Mode: Discount is subtracted once from the total.
 * 4. Per Product Mode: Discount is multiplied by quantity and subtracted.
 * 
 * @param quantity Number of items selected
 * @param unitPrice Price per single item
 * @param comboPricing Array of pricing tiers
 * @returns PricingResult object with detailed breakdown
 */
export const calculateComboPricing = (
  quantity: number,
  unitPrice: number,
  comboPricing: ComboPricing[] = [],
  subtotal?: number
): PricingResult => {
  const originalTotal = subtotal !== undefined ? subtotal : (unitPrice * quantity);

  if (!comboPricing || comboPricing.length === 0 || quantity <= 0) {
    return {
      appliedTier: null,
      discountAmount: 0,
      finalPrice: originalTotal,
      savings: 0,
      unitPrice,
      originalTotal
    };
  }

  // 1. Sort tiers by minQuantity descending to find highest applicable tier first
  const sortedTiers = [...comboPricing].sort((a, b) => b.minQuantity - a.minQuantity);

  // 2. Find the first applicable tier
  const applicableTier = sortedTiers.find(tier => quantity >= tier.minQuantity);

  if (!applicableTier) {
    return {
      appliedTier: null,
      discountAmount: 0,
      finalPrice: originalTotal,
      savings: 0,
      unitPrice,
      originalTotal
    };
  }

  // 3. Calculate discount based on type
  let discountAmount = 0;
  
  if (applicableTier.discountType === "per_product") {
    // Discount is per product
    discountAmount = applicableTier.discount * quantity;
  } else {
    // Discount is total amount
    discountAmount = applicableTier.discount;
  }

  // Ensure discount doesn't exceed total price (no negative prices)
  discountAmount = Math.min(discountAmount, originalTotal);
  
  const finalPrice = originalTotal - discountAmount;

  return {
    appliedTier: applicableTier,
    discountAmount,
    finalPrice,
    savings: discountAmount,
    unitPrice,
    originalTotal
  };
};

/**
 * Helper to format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `৳${price.toLocaleString()}`;
};
