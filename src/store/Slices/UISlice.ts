import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
}

const initialState: UIState = {
  isCartOpen: false,
  isWishlistOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    toggleWishlist: (state) => {
      state.isWishlistOpen = !state.isWishlistOpen;
    },
    openWishlist: (state) => {
      state.isWishlistOpen = true;
    },
    closeWishlist: (state) => {
      state.isWishlistOpen = false;
    },
  },
});

export const {
  toggleCart,
  openCart,
  closeCart,
  toggleWishlist,
  openWishlist,
  closeWishlist,
} = uiSlice.actions;

export default uiSlice.reducer;
