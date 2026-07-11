import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import CommonWrapper from "@/common/CommonWrapper";
import { RootState } from "@/store/store";
import { removeFromCart, incrementQuantity, decrementQuantity } from "@/store/Slices/CartSlice";
import { useTracking } from "@/hooks/useTracking";
import { Helmet } from "react-helmet";
import { Button } from "@/common/Components/Button";
import { useGetHost } from "@/utils/useGetHost";

const Cart = () => {
    const host = useGetHost();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const { trackRemoveFromCart, trackBeginCheckout } = useTracking();

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            const items = cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.selectedVariants?.map((v: any) => `${v.group}: ${v.value}`).join(", ")
            }));
            trackBeginCheckout(items, subtotal); // Coupon not applied yet
        }
    };

    return (
        <div className="min-h-[80vh] py-10 bg-bg-base font-primary text-text-primary">
            <Helmet>
                <title>Shopping Cart | {host.title || "BestBuy4uBD"}</title>
            </Helmet>
            <CommonWrapper>
                <h1 className="text-3xl font-semibold text-text-primary mb-8 uppercase tracking-tighter">Shopping Cart</h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1 bg-bg-surface rounded-xl border border-border-main p-6">
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.itemKey} className="flex gap-4 sm:gap-6 group pb-6 border-b border-border-main last:border-0 last:pb-0">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-bg-base rounded-xl flex-shrink-0 p-4 border border-border-main relative overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-base sm:text-lg font-semibold text-text-primary line-clamp-2 uppercase leading-tight">{item.name}</h3>
                                                    <button
                                                        onClick={() => {
                                                            trackRemoveFromCart({
                                                                id: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                                quantity: item.quantity,
                                                                variant: item.selectedVariants?.map((v: any) => `${v.group}: ${v.value}`).join(", ")
                                                            });
                                                            dispatch(removeFromCart({ itemKey: item.itemKey }));
                                                        }}
                                                        className="text-text-muted hover:text-danger transition-colors p-1 cursor-pointer"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                {item.selectedVariants && item.selectedVariants.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.selectedVariants.map((v: any, idx: number) => (
                                                            <span key={idx} className="text-xs font-semibold text-text-secondary bg-secondary/5 border border-secondary/10 px-2 py-1 rounded-sm uppercase tracking-wide">
                                                                {v.group}: {v.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                                <div className="flex items-center bg-bg-base rounded-lg p-1 border border-border-main">
                                                    <button
                                                        onClick={() => dispatch(decrementQuantity({ itemKey: item.itemKey }))}
                                                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors cursor-pointer"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-semibold text-text-primary">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(incrementQuantity({ itemKey: item.itemKey }))}
                                                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors cursor-pointer"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-semibold text-secondary">৳{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-96 flex-shrink-0">
                            <div className="bg-bg-surface rounded-xl border border-border-main p-6 sticky top-28">
                                <h2 className="text-xl font-semibold text-text-primary mb-6 uppercase tracking-tight">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Subtotal</span>
                                        <span className="text-lg font-semibold text-text-primary">৳{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shipping</span>
                                        <span className="text-xs font-medium text-text-muted italic">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border-main space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-base font-semibold text-text-primary uppercase tracking-wider">Total</span>
                                        <span className="text-2xl font-semibold text-secondary">৳{subtotal.toLocaleString()}</span>
                                    </div>

                                    <Link
                                        to="/checkout"
                                        onClick={handleCheckout}
                                        className="block w-full no-underline"
                                    >
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-full font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            Proceed to Checkout
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>

                                    <Link
                                        to="/shop"
                                        className="block w-full py-3 text-xs font-semibold text-text-muted uppercase tracking-widest text-center hover:text-secondary transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center bg-bg-surface rounded-xl border border-border-main p-12">
                        <div className="w-24 h-24 bg-bg-base rounded-full flex items-center justify-center mb-6 border border-border-main">
                            <ShoppingBag className="w-12 h-12 text-text-muted/30" />
                        </div>
                        <h2 className="text-2xl font-semibold text-text-primary mb-3 uppercase tracking-tighter">Your cart is empty</h2>
                        <p className="text-text-muted font-medium uppercase tracking-widest text-xs mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love!</p>
                        <Link
                            to="/shop"
                            className="no-underline"
                        >
                            <Button
                                variant="primary"
                                className="px-10 py-4 font-semibold uppercase tracking-widest text-xs"
                            >
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </CommonWrapper>
        </div>
    );
};

export default Cart;
