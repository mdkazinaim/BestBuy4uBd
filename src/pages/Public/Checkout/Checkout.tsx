import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTracking } from "@/hooks/useTracking";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { clearCart } from "@/store/Slices/CartSlice";
import CommonWrapper from "@/common/CommonWrapper";
import { Truck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import OrderSuccessModal from "@/pages/LandingPage/Checkout/OrderSuccessModal";

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  courierCharge: string;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const [deliveryChargeType, setDeliveryChargeType] =
    useState<string>("insideDhaka");
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);
  const [formValid, setFormValid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Dynamic delivery charge calculation
  let maxDeliveryChargeInside = 0;
  let maxDeliveryChargeOutside = 0;
  let hasFreeShipping = false;

  cartItems.forEach((item) => {
    // These fields are now available in CartItem thanks to the interface update
    const chargeInside = item.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = item.deliveryChargeOutsideDhaka ?? 150;
    const itemFreeShipping = item.freeShipping ?? false;

    if (itemFreeShipping) hasFreeShipping = true;
    maxDeliveryChargeInside = Math.max(maxDeliveryChargeInside, chargeInside);
    maxDeliveryChargeOutside = Math.max(maxDeliveryChargeOutside, chargeOutside);
  });

  const deliveryCharge = hasFreeShipping
    ? 0
    : (deliveryChargeType === "insideDhaka" ? maxDeliveryChargeInside : maxDeliveryChargeOutside);

  const { trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo, trackCouponApply, trackCheckoutError, trackPurchase } = useTracking();

  const total = subtotal + deliveryCharge - discount;

  const hasTrackedBeginCheckout = useRef(false);

  useEffect(() => {
    if (cartItems.length > 0 && !hasTrackedBeginCheckout.current) {
      const items = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.selectedVariants?.map((g: any) => 
          g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
        ).join("; ")
      }));

      // Track Begin Checkout
      trackBeginCheckout(items, total, couponCode);

      // Track Add Payment Info (Static: Cash on Delivery)
      trackAddPaymentInfo(items, total, "Cash on Delivery");

      // Track Add Shipping Info (Initial default)
      trackAddShippingInfo(items, total, deliveryChargeType);

      hasTrackedBeginCheckout.current = true;
    }
  }, [cartItems.length, total, deliveryChargeType, couponCode, trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo]); // Dependencies to ensure data is ready, but ref prevents re-firing

  const handleDeliveryChargeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newChargeType = e.target.value;
    setDeliveryChargeType(newChargeType);

    // Recalculate total for tracking using new charge type logic locally or just rely on react update?
    // The state update is async, so 'total' variable here is old. 
    // Ideally we should track in useEffect dependent on deliveryChargeType, but let's do it here with approximate or wait for effect?
    // Simpler: Just track with new type.

    // We can re-calculate total here roughly for tracking
    // But actually, let's use a useEffect on deliveryChargeType to be accurate with total.
  };

  // Effect to track shipping info update when charge type changes
  useEffect(() => {
    if (cartItems.length > 0) {
      trackAddShippingInfo(cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.selectedVariants?.map((g: any) => 
          g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
        ).join("; ")
      })), total, deliveryChargeType);
    }
  }, [deliveryChargeType]);

  const checkFormValidity = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form) {
      const isValid = form.checkValidity();
      setFormValid(isValid);
    }
  };

  const applyCoupon = () => {
    const availableCoupons: Record<string, number> = {
      FreeShippingDhaka: 80,
      FreeShippingBD: 150,
      BestBuy: 50,
    };

    if (availableCoupons[couponCode]) {
      const newDiscount = availableCoupons[couponCode];
      setDiscount(newDiscount);
      setAppliedCoupon({ code: couponCode, discount: newDiscount });
      trackCouponApply(couponCode, newDiscount);
      toast.success(`Successfully applied coupon: ${couponCode}`);
    } else {
      setDiscount(0);
      setAppliedCoupon({ code: "", discount: 0 });
      toast.error("Invalid coupon code.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;

    const formData: CheckoutFormData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value,
      address: (target.elements.namedItem("address") as HTMLTextAreaElement)
        .value,
      notes: (target.elements.namedItem("notes") as HTMLTextAreaElement).value,
      courierCharge: (
        target.elements.namedItem("courierCharge") as HTMLSelectElement
      ).value,
    };

    try {
      const orderData = {
        body: {
          items: cartItems.map((item) => {
            // Convert selectedVariants array to object format
            const selectedVariantsObj =
              item.selectedVariants && item.selectedVariants.length > 0
                ? item.selectedVariants.reduce((acc: any, group: any) => {
                  // Handle modern group-with-items structure
                  if (group.items && Array.isArray(group.items)) {
                    acc[group.group] = group.items.map((v: any) => ({
                      value: v.value,
                      price: v.price || 0,
                      quantity: v.quantity || item.quantity,
                      image: v.image || ""
                    }));
                  } else if (group.value) {
                    // Fallback for potential flat structure
                    acc[group.group] = [{
                      value: group.value,
                      price: group.price || 0,
                      quantity: group.quantity || item.quantity,
                      image: group.image || ""
                    }];
                  }
                  return acc;
                }, {})
                : {};

            return {
              product: item.id,
              image: item.image,
              quantity: item.quantity,
              itemKey: item.itemKey,
              price: item.price,
              selectedVariants: selectedVariantsObj,
            };
          }),
          totalAmount: total,
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: "no-email@example.com",
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: "cash on delivery",
            notes: formData.notes || "",
          },
          courierCharge: formData.courierCharge,
          cuponCode: appliedCoupon.code || "",
          discount: appliedCoupon.discount || 0,
        },
      };

      const response = await createOrder(orderData).unwrap();

      setSuccessOrderDetails({
        orderId: response.data._id,
        productPrice: subtotal,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        appliedCoupon: appliedCoupon,
        billingInformation: orderData.body.billingInformation,
      });

      trackPurchase({
        transaction_id: response.data._id,
        value: total,
        tax: 0,
        shipping: deliveryCharge,
        currency: "BDT",
        coupon: appliedCoupon.code,
        items: cartItems.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_variant: item.selectedVariants?.map((g: any) => 
            g.items.map((i: any) => `${g.group}: ${i.value}`).join(", ")
          ).join("; ")
        })),
        user_data: {
          email: "no-email@example.com",
          phone_number: formData.phone,
          address: {
            street: formData.address,
            country: "Bangladesh"
          }
        }
      });

      setShowSuccessModal(true);
      dispatch(clearCart());

      // Reset form
      setCouponCode("");
      setAppliedCoupon({ code: "", discount: 0 });
      setDiscount(0);
    } catch (error: any) {
      console.error("Order Error:", error);
      trackCheckoutError(error.data?.message || "Order Error", "ORDER_CREATION_FAILED");
      toast.error(error.data?.message || "Sad! Order could not be completed.");
    }
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="card-container p-12 text-center max-w-md">
          <ShoppingBag className="w-20 h-20 text-text-muted mx-auto mb-6" />
          <h2 className="h4 mb-4">Your Cart is Empty</h2>
          <p className="text-text-secondary mb-6">
            Add some products to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 bg-secondary text-white rounded-component font-semibold shadow-lg shadow-secondary/20 uppercase tracking-widest text-xs hover:scale-105 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg-base pb-20 font-primary">
        {/* Header */}
        <div className="bg-bg-surface border-b border-border-main mb-4 md:mb-8">
          <CommonWrapper className="py-4 md:py-6 px-2 md:px-4">
            <h1 className="h4 md:h3 uppercase tracking-tighter">Checkout</h1>
            <p className="text-text-muted text-[11px] md:text-sm mt-1">
              Complete your order details
            </p>
          </CommonWrapper>
        </div>

        <CommonWrapper className="px-2 md:px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-border-main dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Checkout Form */}
              <form
                onSubmit={handleFormSubmit}
                onChange={checkFormValidity}
                className="p-3 md:p-10 bg-white dark:bg-slate-900 order-2 md:order-none"
              >
                {/* <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6 md:mb-8 flex items-center">
                  <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </span>
                  ডেলিভারি তথ্য
                </h2> */}

                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        নাম <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        placeholder="আপনার পূর্ণ নাম"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        ফোন নাম্বার <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        pattern="01[2-9][0-9]{8}"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      ঠিকানা <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="আপনার সম্পূর্ণ ঠিকানা"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-secondary/5 p-3 md:p-4 rounded-xl">
                      <label className="block text-text-primary font-medium mb-2">
                        ডেলিভারি এলাকা <span className="text-danger">*</span>
                      </label>
                      <select
                        name="courierCharge"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-secondary/20 focus:border-secondary focus:ring-0 transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        required
                        onChange={handleDeliveryChargeChange}
                        value={deliveryChargeType}
                      >
                        <option value="insideDhaka" className="dark:bg-slate-900">ঢাকার ভিতরে (৳80)</option>
                        <option value="outsideDhaka" className="dark:bg-slate-900">ঢাকার বাইরে (৳150)</option>
                      </select>
                    </div>

                    <div className="bg-secondary/5 p-3 md:p-4 rounded-xl">
                      <label className="block text-text-primary font-medium mb-2">
                        কুপন কোড{" "}
                        <span className="text-text-muted text-sm">
                          (ঐচ্ছিক)
                        </span>
                      </label>
                      <div className="flex gap-2 w-full">
                        <div className="relative w-full border-2 border-secondary/20 rounded-xl bg-white dark:bg-slate-900">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            name="cuponCode"
                            className="w-[70%] px-4 md:px-5 py-2 md:py-3 rounded-xl focus:border-secondary focus:ring-0 transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="কুপন কোড"
                          />
                          <button
                            onClick={applyCoupon}
                            type="button"
                            className="px-3 md:px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          >
                            যাচাই করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      অতিরিক্ত তথ্য{" "}
                      <span className="text-text-muted text-sm">(ঐচ্ছিক)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="যদি কোন বিশেষ নির্দেশনা থাকে"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formValid || isOrderLoading}
                  className={`w-full mt-6 md:mt-10 bg-gradient-to-r 
              ${formValid && !isOrderLoading
                      ? "from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary"
                      : "from-gray-400 to-gray-500 cursor-not-allowed"
                    } 
              text-white py-3 md:py-4 rounded-xl text-base md:text-lg font-bold 
              transition-all duration-300 transform hover:scale-[1.02] 
              focus:ring-4 focus:ring-secondary/50 shadow-lg
              relative
            `}
                >
                  {isOrderLoading ? (
                    <>
                      <span className="opacity-0">অর্ডার কনফার্ম করুন</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </>
                  ) : (
                    "অর্ডার কনফার্ম করুন"
                  )}
                </button>
              </form>

              {/* Order Summary Section */}
              <div className="p-3 md:p-10 bg-gradient-to-br from-secondary/5 via-white dark:via-slate-900/40 to-secondary/5 border-t md:border-t-0 md:border-l border-border-main dark:border-slate-800">
                <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-4 md:mb-8 flex items-center">
                  <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-4">
                    <ShoppingBag className="h-4 w-4 md:h-6 md:w-6 text-secondary" />
                  </span>
                  অর্ডার সামারি
                </h2>

                <div className="space-y-6 md:space-y-8">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.itemKey}
                        className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-white dark:bg-slate-950 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800/40"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg md:rounded-xl"
                          />
                          <div className="absolute -top-1.5 -right-1.5 bg-secondary text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-xs md:text-base text-text-primary line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm md:text-xl font-black text-secondary mt-0.5">
                            ৳{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/40">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-text-muted">সাবটোটাল:</span>
                        <span className="font-medium text-text-primary">৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-text-muted">ডেলিভারি চার্জ:</span>
                        <span className="font-medium text-text-primary">৳{deliveryCharge}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-sm md:text-base text-secondary">
                          <span className="text-text-muted">
                            কুপন ডিসকাউন্ট:
                          </span>
                          <span className="font-medium">-৳{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-secondary/10 p-3 md:p-4 rounded-xl">
                        <span className="text-base md:text-lg font-medium text-text-primary">
                          মোট মূল্য
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-secondary">
                          ৳{total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6 md:mt-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4 md:mb-6 flex items-center">
                      <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <Truck className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                      </span>
                      পেমেন্ট পদ্ধতি
                    </h2>
                    <div className="bg-secondary/10 dark:bg-secondary/5 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 md:h-6 md:w-6 text-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-medium text-text-primary">
                            ক্যাশ অন ডেলিভারি
                          </p>
                          <p className="text-xs md:text-sm text-text-muted dark:text-slate-400">
                            পণ্য হাতে পেয়ে টাকা প্রদান করুন
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CommonWrapper>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/");
          }}
          orderDetails={successOrderDetails}
        />
      )}
    </>
  );
};

export default Checkout;
