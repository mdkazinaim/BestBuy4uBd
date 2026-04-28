import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart } from "@/store/Slices/UISlice";
import { Link } from "react-router-dom";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistSidebar = ({ isOpen, onClose }: WishlistSidebarProps) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const handleMoveToCart = (item: any) => {
    dispatch(addToCart({
      id: item._id,
      name: item.basicInfo?.title || item.name,
      price: item.price?.discounted || item.price?.regular || item.price,
      image: item.images?.[0]?.url || item.image,
      quantity: 1,
      selectedVariants: []
    }));
    dispatch(removeFromWishlist(item._id));
    dispatch(openCart());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-surface z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-bg-surface sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-danger/10 rounded-component flex items-center justify-center text-danger">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="h5 text-text-primary uppercase tracking-tighter">Wishlist</h2>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">{wishlistItems.length} Favorite Items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-bg-base rounded-component transition-colors group"
              >
                <X className="w-6 h-6 text-text-muted group-hover:text-danger transition-colors" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-bg-base rounded-component flex-shrink-0 p-2 border border-border-main relative overflow-hidden">
                      <img 
                        src={item.images?.[0]?.url || item.image || "https://via.placeholder.com/100"} 
                        alt={item.basicInfo?.title || item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium text-text-primary line-clamp-2 uppercase leading-tight">
                            {item.basicInfo?.title || item.name}
                          </h3>
                          <button 
                            onClick={() => dispatch(removeFromWishlist(item._id))}
                            className="text-text-muted/50 hover:text-danger transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-secondary mt-1">
                          ৳{(item.price?.discounted || item.price?.regular || item.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                         <button 
                            onClick={() => handleMoveToCart(item)}
                            className="text-[10px] font-semibold uppercase tracking-widest text-secondary flex items-center gap-2 hover:bg-secondary/5 px-3 py-1.5 rounded-inner transition-colors border border-secondary/10"
                         >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                         </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-bg-base rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Heart className="w-10 h-10 text-text-muted/20" />
                  </div>
                  <h3 className="h5 text-text-primary mb-2 uppercase tracking-tighter">Your wishlist is empty</h3>
                  <p className="text-text-muted font-medium uppercase tracking-widest text-[10px] mb-8">Save items you love to find them later</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-danger text-white rounded-component font-semibold shadow-xl shadow-danger/20 uppercase tracking-widest text-xs hover:translate-y-[-2px] active:translate-y-0 transition-all"
                  >
                    Explore Shop
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div className="p-6 bg-bg-base border-t border-border-main">
                <Link 
                  to="/shop"
                  onClick={onClose}
                  className="w-full py-4 bg-danger text-white rounded-component font-semibold text-[10px] uppercase tracking-widest text-center shadow-2xl shadow-danger/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all group"
                >
                  Continue Shopping
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;
