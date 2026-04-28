import { useState, useEffect, useCallback, useMemo } from 'react';

export interface VariantSelection {
  group: string;
  item: {
    value: string;
    price: number;
    stock?: number;
    image?: { url: string; alt: string };
  };
  quantity: number;
  isBaseVariant?: boolean; // Flag to identify the base variant
}

export interface UseVariantQuantityReturn {
  selectedVariants: VariantSelection[];
  totalQuantity: number;
  addVariant: (group: string, item: any) => void;
  removeVariant: (group: string, value: string) => void;
  updateVariantQuantity: (group: string, value: string, quantity: number) => void;
  clearVariants: () => void;
  getVariantQuantity: (group: string, value: string) => number;
  initVariants: (variants: any[], product?: any) => void;
}

/**
 * Creates a base variant from product pricing
 * This represents the default product option
 */
const createBaseVariant = (product: any): VariantSelection => {
  const hasDiscount = product?.price?.discounted && product.price.discounted < product.price.regular;
  const displayPrice = hasDiscount ? product.price.discounted : product.price.regular;
  
  return {
    group: "Quantity",
    item: {
      value: hasDiscount 
        ? `৳${displayPrice.toLocaleString()} (Discounted)` 
        : `৳${displayPrice.toLocaleString()}`,
      price: 0, // Base price, no additional cost
      stock: product?.stockQuantity
    },
    quantity: 1,
    isBaseVariant: true
  };
};

export const useVariantQuantity = (
  defaultVariants?: any[],
  product?: any
): UseVariantQuantityReturn => {
  const [selectedVariants, setSelectedVariants] = useState<VariantSelection[]>([]);

  // Initialize with defaults if provided and not already selected
  useEffect(() => {
    if (selectedVariants.length === 0) {
      if (product) {
        const baseVariant = createBaseVariant(product);
        setSelectedVariants([baseVariant]);
      } else if (defaultVariants && defaultVariants.length > 0) {
        // Fallback for when product is not provided but variants are
        const validDefaults = defaultVariants.filter(vg => vg.items && vg.items.length > 0);
        const defaults = validDefaults.map(vg => ({
          group: vg.group,
          item: vg.items[0],
          quantity: 1,
          isBaseVariant: false
        }));
        setSelectedVariants(defaults);
      }
    }
  }, [defaultVariants, product]); // eslint-disable-line react-hooks/exhaustive-deps

  const initVariants = useCallback((variants: any[], productData?: any) => {
      // If product is provided, only select the base variant
      if (productData) {
        const baseVariant = createBaseVariant(productData);
        setSelectedVariants([baseVariant]);
      } else {
        // Fallback behavior
        const validDefaults = variants.filter(vg => vg.items && vg.items.length > 0);
        const defaults = validDefaults.map(vg => ({
            group: vg.group,
            item: vg.items[0],
            quantity: 1,
            isBaseVariant: false
        }));
        setSelectedVariants(defaults);
      }
  }, []);


  const totalQuantity = useMemo(() => {
    const sum = selectedVariants.reduce((sum, v) => sum + v.quantity, 0);
    return sum; // Returns the actual sum of all variant quantities
  }, [selectedVariants]);

  const addVariant = useCallback((group: string, item: any) => {
    setSelectedVariants(prev => {
      // Check if this specific item is already selected
      const existingItemIndex = prev.findIndex(v => v.group === group && v.item.value === item.value);

      if (existingItemIndex > -1) {
          // Increment quantity
          const newVariants = [...prev];
          newVariants[existingItemIndex] = {
              ...newVariants[existingItemIndex],
              quantity: newVariants[existingItemIndex].quantity + 1
          };
          return newVariants;
      }
      
      // Add new variant selection
      return [...prev, { group, item, quantity: 1, isBaseVariant: false }];
    });
  }, []);

  const removeVariant = useCallback((group: string, value: string) => {
    setSelectedVariants(prev => {
      // Don't allow removing the base variant if it's the only one
      const variant = prev.find(v => v.group === group && v.item.value === value);
      if (variant?.isBaseVariant && prev.length === 1) {
        return prev; // Keep at least the base variant
      }
      return prev.filter(v => !(v.group === group && v.item.value === value));
    });
  }, []);

  const updateVariantQuantity = useCallback((group: string, value: string, quantity: number) => {
    setSelectedVariants(prev => {
      const variant = prev.find(v => v.group === group && v.item.value === value);
      
      // Base variant should stay visible even at quantity 0
      if (variant?.isBaseVariant) {
        return prev.map(v =>
          v.group === group && v.item.value === value
            ? { ...v, quantity: Math.max(0, quantity) }
            : v
        );
      }
      
      // Other variants can be removed if quantity is 0
      if (quantity <= 0) {
        return prev.filter(v => !(v.group === group && v.item.value === value));
      }
      
      return prev.map(v =>
        v.group === group && v.item.value === value
          ? { ...v, quantity }
          : v
      );
    });
  }, []);

  const clearVariants = useCallback(() => {
    setSelectedVariants([]);
  }, []);

  const getVariantQuantity = useCallback((group: string, value: string) => {
    const variant = selectedVariants.find(v => v.group === group && v.item.value === value);
    return variant?.quantity || 0;
  }, [selectedVariants]);

  return {
    selectedVariants,
    totalQuantity,
    addVariant,
    removeVariant,
    updateVariantQuantity,
    clearVariants,
    getVariantQuantity,
    initVariants
  };
};
