import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
    _id: string;
    [key: string]: any; // Allow other properties for now
}

interface WishlistState {
    wishlistItems: WishlistItem[];
    loading: boolean;
    error: string | null;
}

// Load initial wishlist items from localStorage
const loadWishlistFromStorage = (): WishlistItem[] => {
    try {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
        console.error('Error loading wishlist from storage:', error);
        return [];
    }
};

const initialState: WishlistState = {
    wishlistItems: loadWishlistFromStorage(),
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
            const item = action.payload;
            const existingItem = state.wishlistItems.find(
                (i: WishlistItem) => i._id === item._id
            );
            if (!existingItem) {
                state.wishlistItems.push(item);
                // Save to localStorage
                localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.wishlistItems = state.wishlistItems.filter(
                (item: WishlistItem) => item._id !== action.payload
            );
            // Update localStorage
            localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
            // Clear localStorage
            localStorage.removeItem('wishlist');
        }
    }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
