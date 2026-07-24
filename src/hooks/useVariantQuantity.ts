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
  isBaseVariant?: boolean;
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
 * Creates a base variant from product pricing & baseVariantName
 */
const createBaseVariant = (product: any): VariantSelection => {
  const baseName = product?.price?.baseVariantName || "Standard";
  const groupName = product?.variants?.[0]?.group || "Variant";
  
  return {
    group: groupName,
    item: {
      value: baseName,
      price: 0, // Base price, no surcharge
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

  // Initialize with base variant by default
  useEffect(() => {
    if (selectedVariants.length === 0) {
      if (product) {
        const baseVariant = createBaseVariant(product);
        setSelectedVariants([baseVariant]);
      } else if (defaultVariants && defaultVariants.length > 0) {
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
    if (productData) {
      const baseVariant = createBaseVariant(productData);
      setSelectedVariants([baseVariant]);
    } else if (variants && variants.length > 0) {
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
    return sum;
  }, [selectedVariants]);

  const addVariant = useCallback((group: string, item: any) => {
    setSelectedVariants((prev) => {
      const isBase = item.isBaseVariant === true;
      const existingIndex = prev.findIndex(
        (v) => v.group === group && v.item.value === item.value
      );

      if (existingIndex >= 0) {
        return prev.map((v, i) =>
          i === existingIndex ? { ...v, quantity: v.quantity + 1 } : v
        );
      }

      return [...prev, { group, item, quantity: 1, isBaseVariant: isBase }];
    });
  }, []);

  const removeVariant = useCallback((group: string, value: string) => {
    setSelectedVariants((prev) =>
      prev.filter((v) => !(v.group === group && v.item.value === value))
    );
  }, []);

  const updateVariantQuantity = useCallback(
    (group: string, value: string, quantity: number) => {
      if (quantity <= 0) {
        removeVariant(group, value);
        return;
      }

      setSelectedVariants((prev) => {
        const existingIndex = prev.findIndex(
          (v) => v.group === group && v.item.value === value
        );

        if (existingIndex >= 0) {
          return prev.map((v, i) =>
            i === existingIndex ? { ...v, quantity } : v
          );
        }

        return prev;
      });
    },
    [removeVariant]
  );

  const clearVariants = useCallback(() => {
    setSelectedVariants([]);
  }, []);

  const getVariantQuantity = useCallback(
    (group: string, value: string) => {
      const found = selectedVariants.find(
        (v) => v.group === group && v.item.value === value
      );
      return found ? found.quantity : 0;
    },
    [selectedVariants]
  );

  return {
    selectedVariants,
    totalQuantity,
    addVariant,
    removeVariant,
    updateVariantQuantity,
    clearVariants,
    getVariantQuantity,
    initVariants,
  };
};

export default useVariantQuantity;
