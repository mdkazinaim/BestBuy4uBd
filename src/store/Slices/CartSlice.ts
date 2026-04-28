import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedVariant {
  group: string;
  value: string;
  price?: number;
  quantity?: number;
}

export interface CartItem {
  id: string;
  itemKey: string;
  name: string;
  price: number; // Current adjusted unit price (effective price)
  basePrice: number; // Original base price (without variants)
  image: string;
  quantity: number;
  selectedVariants?: any[]; // Keep as any[] to support legacy structure or specific payload
  comboPricing?: { minQuantity: number; discount: number }[];
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
  freeShipping?: boolean;
}

interface CartState {
  cartItems: CartItem[];
}

// Helper to calculate effective unit price (considering variants and combo pricing)
const calculateEffectiveUnitPrice = (item: CartItem): number => {
  const totalQuantity = item.quantity;
  if (totalQuantity <= 0) return 0;

  // 1. Calculate Total Base Cost
  let totalCost = item.basePrice * totalQuantity;

  // 2. Add Variant Costs
  if (item.selectedVariants) {
     const variantsToIterate = Array.isArray(item.selectedVariants) 
      ? item.selectedVariants 
      : Object.entries(item.selectedVariants).map(([group, items]) => ({ group, items }));

     variantsToIterate.forEach((group: any) => {
        if (group.items && Array.isArray(group.items)) {
            group.items.forEach((v: any) => {
                const variantQty = v.quantity ?? totalQuantity; 
                totalCost += (v.price || 0) * variantQty;
            });
        } else if (typeof group.price === 'number') {
            // Flattened single variant structure fallback
             totalCost += group.price * totalQuantity;
        }
     });
  }

  // 3. Apply Combo Discount (Flat discount on total)
  if (item.comboPricing && item.comboPricing.length > 0) {
      const sortedCombo = [...item.comboPricing].sort((a, b) => b.minQuantity - a.minQuantity);
      const tier = sortedCombo.find(t => totalQuantity >= t.minQuantity);
      if (tier) {
          totalCost -= tier.discount;
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
        const newItem: CartItem = {
          id,
          itemKey: variantKey,
          name,
          basePrice: basePrice,
          price: 0, // Will be calculated
          image,
          quantity,
          selectedVariants: selectedVariants || [],
          comboPricing,
          deliveryChargeInsideDhaka,
          deliveryChargeOutsideDhaka,
          freeShipping,
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
