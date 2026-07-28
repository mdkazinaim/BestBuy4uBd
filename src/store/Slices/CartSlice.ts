import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedVariant {
  group: string;
  value: string;
  price?: number;
  quantity?: number;
}

export interface CartItem {
  id: string;
  productId?: string;
  itemKey: string;
  name: string;
  price: number; // Current adjusted unit price (effective price)
  basePrice: number; // Original base price (without variants)
  image: string;
  quantity: number;
  selectedVariants?: any[]; // Keep as any[] to support legacy structure or specific payload
  comboPricing?: { minQuantity: number; discount: number; discountType?: "total" | "per_product" }[];
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
  freeShipping?: boolean;
  isBundle?: boolean;
  bundleInfo?: any;
}

interface CartState {
  cartItems: CartItem[];
}

// Helper to calculate effective unit price (considering variants and combo pricing)
const calculateEffectiveUnitPrice = (item: CartItem): number => {
  if ((item.isBundle || item.bundleInfo) && item.price && item.price > 0) {
    return item.price;
  }
  const totalQuantity = item.quantity;
  if (totalQuantity <= 0) return 0;

  // 1. Calculate Total Cost using variant replacement prices if defined
  let unitPrice = item.basePrice;

  if (item.selectedVariants) {
     const variantsToIterate = Array.isArray(item.selectedVariants) 
      ? item.selectedVariants 
      : Object.entries(item.selectedVariants).map(([group, items]) => ({ group, items }));

     for (const group of variantsToIterate) {
        if (group.items && Array.isArray(group.items)) {
            const activeVar = group.items.find((v: any) => v.quantity > 0 || typeof v.quantity === 'undefined');
            if (activeVar && activeVar.price && activeVar.price > 0) {
                unitPrice = activeVar.price;
                break;
            }
        } else if (group.price && group.price > 0) {
             unitPrice = group.price;
             break;
        }
     }
  }

  let totalCost = unitPrice * totalQuantity;

  // 3. Apply Combo Discount
  if (item.comboPricing && item.comboPricing.length > 0) {
      const selectedVariantValues: string[] = [];
      if (item.selectedVariants) {
         const variantsToIterate = Array.isArray(item.selectedVariants) 
          ? item.selectedVariants 
          : Object.entries(item.selectedVariants).map(([group, items]) => ({ group, items }));

         variantsToIterate.forEach((group: any) => {
            if (group.items && Array.isArray(group.items)) {
                group.items.forEach((v: any) => {
                    if (v.quantity > 0 || typeof v.quantity === 'undefined') {
                        selectedVariantValues.push(v.value);
                    }
                });
            }
         });
      }

      const applicableCombo = item.comboPricing.filter((tier: any) => {
          if (!tier.variantValue || tier.variantValue === "") {
              return true;
          }
          return selectedVariantValues.includes(tier.variantValue);
      });

      const sortedCombo = [...applicableCombo].sort((a, b) => b.minQuantity - a.minQuantity);
      const tier = sortedCombo.find(t => totalQuantity >= t.minQuantity);
      if (tier) {
          const discountAmt = tier.discountType === "per_product" 
            ? tier.discount * totalQuantity 
            : tier.discount;
          totalCost -= discountAmt;
      }
  }

  // Return effective unit price
  return Math.max(0, totalCost / totalQuantity);
};

// Load cart items from localStorage if they exist
const loadCartItems = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const {
        id,
        name,
        price: basePrice,
        image,
        quantity,
        selectedVariants,
        comboPricing,
        deliveryChargeInsideDhaka,
        deliveryChargeOutsideDhaka,
        freeShipping,
      } = action.payload;

      // Unique key: ProductID + Sorted Variant Values
      const variantKey =
        selectedVariants?.length > 0
          ? `${id}-${selectedVariants
              .map((g: any) => `${g.group}-${g.items.map((i:any) => i.value).sort().join('_')}`)
              .sort().join("-")}`
          : id;

      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.itemKey === variantKey
      );

      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity += quantity;
        
        // Merge variant quantities
        if (selectedVariants && state.cartItems[existingItemIndex].selectedVariants) {
            const existingVars = state.cartItems[existingItemIndex].selectedVariants;
            
            selectedVariants.forEach((newGroup: any) => {
                // Ensure existingVars is treated as array of groups
                // Note: existingVars might be `any` type, we assume consistent structure
                const existingGroup = existingVars.find((g: any) => g.group === newGroup.group);
                if (existingGroup) {
                    newGroup.items.forEach((newItem: any) => {
                        const existingItem = existingGroup.items.find((i: any) => i.value === newItem.value);
                        if (existingItem) {
                            existingItem.quantity = (existingItem.quantity || 0) + (newItem.quantity || 0);
                        } else {
                            existingGroup.items.push(newItem);
                        }
                    });
                } else {
                    existingVars.push(newGroup);
                }
            });
        }
        
        state.cartItems[existingItemIndex].price = calculateEffectiveUnitPrice(
          state.cartItems[existingItemIndex]
        );
      } else {
        const realProductId = action.payload.productId || (typeof id === 'string' && id.includes('-bundle-') ? id.split('-bundle-')[0] : id);
        const newItem: CartItem = {
          id,
          productId: realProductId,
          itemKey: variantKey,
          name,
          basePrice: basePrice,
          price: action.payload.price || basePrice,
          image,
          quantity,
          selectedVariants: selectedVariants || [],
          comboPricing,
          deliveryChargeInsideDhaka,
          deliveryChargeOutsideDhaka,
          freeShipping,
          isBundle: action.payload.isBundle || !!action.payload.bundleInfo,
          bundleInfo: action.payload.bundleInfo,
        };
        newItem.price = calculateEffectiveUnitPrice(newItem);
        state.cartItems.push(newItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemKey: string; quantity: number }>
    ) => {
      const { itemKey, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item) {
        item.quantity = quantity;
        item.price = calculateEffectiveUnitPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.itemKey !== itemKey
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    incrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item) {
        item.quantity++;
        item.price = calculateEffectiveUnitPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item && item.quantity > 1) {
        item.quantity--;
        item.price = calculateEffectiveUnitPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
