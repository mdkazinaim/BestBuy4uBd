import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromCart, incrementQuantity, decrementQuantity } from "@/store/Slices/CartSlice";
import { Link } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useTracking } from "@/hooks/useTracking";

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const dispatch = useDispatch();
  const { trackRemoveFromCart, trackViewCart, trackBeginCheckout } = useTracking();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      trackViewCart(cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.selectedVariants?.map((g: any) => 
          g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
        ).join("; ")
      })), subtotal);
    }
  }, [isOpen, cartItems, subtotal]);

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
                <div className="w-12 h-12 bg-secondary/10 rounded-component flex items-center justify-center text-secondary">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary uppercase tracking-tighter">Your Cart</h2>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-widest">{cartItems.length} Items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-bg-base rounded-component transition-colors group"
              >
                <X className="w-6 h-6 text-text-muted group-hover:text-danger transition-colors" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.itemKey} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-bg-base rounded-component flex-shrink-0 p-2 border border-border-main relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium text-text-primary line-clamp-2 uppercase leading-tight">{item.name}</h3>
                          <button
                            onClick={() => {
                              trackRemoveFromCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: item.quantity,
                                variant: item.selectedVariants?.map((g: any) => 
                                  g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
                                ).join("; ")
                              });
                              dispatch(removeFromCart({ itemKey: item.itemKey }));
                            }}
                            className="text-text-muted/50 hover:text-danger transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.selectedVariants && item.selectedVariants.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedVariants.map((v: any, idx: number) => (
                              <span key={idx} className="text-[10px] font-medium text-text-muted bg-bg-base px-1.5 py-0.5 rounded-inner">
                                {v.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-bg-base rounded-component p-1 border border-border-main">
                          <button
                            onClick={() => dispatch(decrementQuantity({ itemKey: item.itemKey }))}
                            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(incrementQuantity({ itemKey: item.itemKey }))}
                            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-secondary">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-bg-base rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <ShoppingBag className="w-10 h-10 text-text-muted/30" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2 uppercase tracking-tighter">Your cart is empty</h3>
                  <p className="text-text-muted font-medium uppercase tracking-widest text-[10px] mb-8">Looks like you haven't added anything yet</p>
                  <button
                    onClick={onClose}
                    className="px-8 py-4 bg-secondary text-white rounded-component font-semibold shadow-xl shadow-secondary/20 uppercase tracking-widest text-xs hover:translate-y-[-2px] active:translate-y-0 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-bg-base border-t border-border-main space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-2xl font-semibold text-text-primary tracking-tighter">৳{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest text-center">Taxes and shipping calculated at checkout</p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full py-4 bg-bg-surface border border-border-main text-text-primary rounded-component font-semibold text-[10px] uppercase tracking-widest text-center shadow-lg hover:bg-bg-base transition-all"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => {
                      const items = cartItems.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        variant: item.selectedVariants?.map((g: any) => 
                          g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
                        ).join("; ")
                      }));
                      trackBeginCheckout(items, subtotal);
                      onClose();
                    }}
                    className="w-full py-4 bg-secondary text-white rounded-component font-semibold text-[10px] uppercase tracking-widest text-center shadow-2xl shadow-secondary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all group"
                  >
                    Checkout
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
