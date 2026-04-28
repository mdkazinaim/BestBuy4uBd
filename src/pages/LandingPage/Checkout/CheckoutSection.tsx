import React, { useState } from "react";
import { toast } from "sonner";
import VariantSelector from "../Components/VariantSelector";
import { cn } from "@/lib/utils";

interface OrderDetails {
  title: string;
  variants: { group: string; item: any; quantity: number }[];
  price: number;
  subtotal: number;
  quantity: number;
  image?: { url: string; alt?: string };
  product?: any;
  discount?: number;
  totalAmount?: number;
  payablePrice?: number;
}

interface CheckoutSectionProps {
  orderDetails: OrderDetails;
  handleSubmit: (formData: any) => void;
  onQuantityChange: (quantity: number) => void;
  onVariantChange: (groupName: string, variant: any) => void;
  onVariantUpdate?: (group: string, value: string, quantity: number) => void;
  isLoading?: boolean;
  couponCode?: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  isDark?: boolean;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  orderDetails,
  handleSubmit,
  onVariantChange,
  onVariantUpdate,
  isLoading,
  couponCode,
  setCouponCode,
  applyCoupon,
  isDark = false,
}) => {
  const {
    title,
    variants,
    price,
    quantity,
    image,
    product,
    discount,
    payablePrice,
  } = orderDetails;
  const [formValid, setFormValid] = useState(false);
  const [deliveryChargeType, setDeliveryChargeType] = useState("insideDhaka");

  // Quantity controls handled by VariantSelector

  const handleDeliveryChargeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDeliveryChargeType(e.target.value);
  };
  const deliveryCharge = product?.additionalInfo?.freeShipping
    ? 0
    : deliveryChargeType === "insideDhaka"
      ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80)
      : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150);

  const calculateTotalPrice = () => {
    const subtotal = payablePrice; // Price passed is already the total (finalTotal)
    const total = subtotal + deliveryCharge - (discount || 0);
    return total > 0 ? total : 0;
  };

  const checkFormValidity = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form) {
      const isValid = form.checkValidity();
      setFormValid(isValid);
    }
  };

  const handleButtonClick = () => {
    if (!formValid && !isLoading) {
      const form = document.querySelector("form");
      if (form) {
        const nameInput = form.querySelector(
          'input[name="name"]',
        ) as HTMLInputElement;
        const phoneInput = form.querySelector(
          'input[name="phone"]',
        ) as HTMLInputElement;
        const addressInput = form.querySelector(
          'textarea[name="address"]',
        ) as HTMLTextAreaElement;

        if (!nameInput?.value) {
          return toast.warning("আপনার নাম প্রদান করুন");
        }
        if (!phoneInput?.value) {
          return toast.warning("আপনার ফোন নাম্বার প্রদান করুন");
        }
        if (phoneInput?.validity.patternMismatch) {
          return toast.warning(
            "সঠিক ফোন নাম্বার প্রদান করুন (যেমন: 017XXXXXXXX)",
          );
        }
        if (!addressInput?.value) {
          return toast.warning("আপনার ঠিকানা প্রদান করুন");
        }

        if (!form.checkValidity()) {
          return toast.warning("অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন");
        }
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) {
      handleButtonClick();
      return;
    }
    const target = e.currentTarget;
    const formData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value,
      address: (target.elements.namedItem("address") as HTMLTextAreaElement)
        .value,
      notes: (target.elements.namedItem("notes") as HTMLTextAreaElement).value,
      paymentMethod: "cash on delivery",
      courierCharge: (
        target.elements.namedItem("courierCharge") as HTMLSelectElement
      ).value,
      cuponCode: couponCode,
    };

    handleSubmit(formData);
  };

  return (
    <div
      id="checkout"
      className={cn(
        "rounded-3xl shadow-xl overflow-hidden border transition-all duration-300",
        isDark 
          ? "bg-slate-900/50 backdrop-blur-xl border-white/10" 
          : "bg-white border-brand-100"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Checkout Form */}
        <form
          onSubmit={handleFormSubmit}
          onChange={(e: any) => checkFormValidity(e)}
          className={cn(
            "p-4 md:p-10 order-2 md:order-none",
            isDark ? "bg-transparent" : "bg-white"
          )}
        >
          <h2 className={cn(
            "text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center",
            isDark ? "text-white" : "text-gray-800"
          )}>
            <span className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4",
              isDark ? "bg-white/10" : "bg-brand-100"
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "h-5 w-5 md:h-6 md:w-6",
                  isDark ? "text-emerald-400" : "text-brand-600"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            ডেলিভারি তথ্য
          </h2>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={cn(
                  "block font-medium mb-2",
                  isDark ? "text-white/80" : "text-gray-700"
                )}>
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={cn(
                    "w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 transition-all",
                    isDark 
                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500" 
                      : "bg-white border-gray-200 text-gray-800 focus:border-brand-500"
                  )}
                  placeholder="আপনার পূর্ণ নাম"
                  required
                />
              </div>
              <div>
                <label className={cn(
                  "block font-medium mb-2",
                  isDark ? "text-white/80" : "text-gray-700"
                )}>
                  ফোন নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  pattern="01[2-9][0-9]{8}"
                  className={cn(
                    "w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 transition-all",
                    isDark 
                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500" 
                      : "bg-white border-gray-200 text-gray-800 focus:border-brand-500"
                  )}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "block font-medium mb-2",
                isDark ? "text-white/80" : "text-gray-700"
              )}>
                ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                rows={3}
                className={cn(
                  "w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 transition-all",
                  isDark 
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500" 
                    : "bg-white border-gray-200 text-gray-800 focus:border-brand-500"
                )}
                placeholder="আপনার সম্পূর্ণ ঠিকানা"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <div className={cn(
                "p-3 md:p-4 rounded-xl",
                isDark ? "bg-white/5 border border-white/10" : "bg-brand-50"
              )}>
                <label className={cn(
                  "block font-medium mb-2",
                  isDark ? "text-white/80" : "text-gray-700"
                )}>
                  ডেলিভারি এলাকা <span className="text-red-500">*</span>
                </label>
                <select
                  name="courierCharge"
                  className={cn(
                    "w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 transition-all",
                    isDark 
                      ? "bg-slate-800 border-white/10 text-white focus:border-emerald-500" 
                      : "bg-white border-brand-200 text-gray-800 focus:border-brand-500"
                  )}
                  required
                  onChange={handleDeliveryChargeChange}
                  value={deliveryChargeType}
                >
                  <option value="insideDhaka">
                    ঢাকার ভিতরে (৳
                    {product?.basicInfo?.deliveryChargeInsideDhaka ?? 80})
                  </option>
                  <option value="outsideDhaka">
                    ঢাকার বাইরে (৳
                    {product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150})
                  </option>
                </select>
                {product?.additionalInfo?.freeShipping && (
                  <p className={cn(
                    "text-xs mt-1 font-bold italic",
                    isDark ? "text-emerald-400" : "text-brand-600"
                  )}>
                    এই পণ্যটির জন্য শিপিং ফ্রি
                  </p>
                )}
              </div>

              <div className={cn(
                "p-3 md:p-4 rounded-xl",
                isDark ? "bg-white/5 border border-white/10" : "bg-brand-50"
              )}>
                <label className={cn(
                  "block font-medium mb-2",
                  isDark ? "text-white/80" : "text-gray-700"
                )}>
                  কুপন কোড{" "}
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-white/40" : "text-gray-500"
                  )}>(ঐচ্ছিক)</span>
                </label>
                <div className="flex gap-2 w-full">
                  <div className={cn(
                    "relative w-full border-2 rounded-xl overflow-hidden",
                    isDark ? "border-white/10 bg-white/5" : "border-brand-200 bg-white"
                  )}>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      name="cuponCode"
                      className={cn(
                        "w-full pr-24 px-4 md:px-5 py-2 md:py-3 rounded-xl focus:ring-0 transition-colors",
                        isDark ? "bg-transparent text-white" : "bg-white text-gray-800"
                      )}
                      placeholder="কুপন কোড"
                    />
                    <button
                      onClick={applyCoupon}
                      type="button"
                      className={cn(
                        "px-3 md:px-4 py-1.5 md:py-2 text-white rounded-lg transition-colors absolute right-1 top-1/2 transform -translate-y-1/2 text-sm font-bold",
                        isDark ? "bg-emerald-500 hover:bg-emerald-600" : "bg-brand-500 hover:bg-brand-600"
                      )}
                    >
                      যাচাই
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={cn(
                "block font-medium mb-2",
                isDark ? "text-white/80" : "text-gray-700"
              )}>
                অতিরিক্ত তথ্য{" "}
                <span className={cn(
                  "text-sm",
                  isDark ? "text-white/40" : "text-gray-500"
                )}>(ঐচ্ছিক)</span>
              </label>
              <textarea
                name="notes"
                rows={2}
                className={cn(
                  "w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 transition-all",
                  isDark 
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500" 
                    : "bg-white border-gray-200 text-gray-800 focus:border-brand-500"
                )}
                placeholder="যদি কোন বিশেষ নির্দেশনা থাকে"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleButtonClick}
            disabled={isLoading}
            className={cn(
              "w-full mt-6 md:mt-10 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg relative",
              !isLoading
                ? isDark
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  : "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600"
                : "bg-gray-400 cursor-not-allowed",
              !formValid ? "opacity-90" : "opacity-100"
            )}
          >
            {isLoading ? (
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

          {/* Combo Pricing Offers Card */}
          {product?.comboPricing && product.comboPricing.length > 0 && (
            <div className={cn(
              "mt-6 border-2 rounded-2xl p-4 md:p-6",
              isDark 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
            )}>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "text-base md:text-lg font-bold mb-1",
                    isDark ? "text-white" : "text-emerald-900"
                  )}>
                    🎉 কম্বো অফার পাওয়া যাচ্ছে!
                  </h3>
                  <p className={cn(
                    "text-xs md:text-sm",
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  )}>
                    বেশি পরিমাণে কিনুন এবং সাশ্রয় করুন
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[...product.comboPricing]
                  .sort((a: any, b: any) => a.minQuantity - b.minQuantity)
                  .map((combo: any, index: number) => {
                    const savingsPerUnit =
                      combo.discountType === "per_product"
                        ? combo.discount
                        : combo.discount / combo.minQuantity;
                    const totalSavings =
                      combo.discountType === "per_product"
                        ? combo.discount * combo.minQuantity
                        : combo.discount;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "rounded-xl p-3 md:p-4 border transition-colors",
                          isDark 
                            ? "bg-white/5 border-emerald-500/20 hover:border-emerald-500" 
                            : "bg-white border-emerald-100 hover:border-emerald-300"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold",
                              isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                            )}>
                              {combo.minQuantity}+ টি
                            </span>
                            <span className={cn(
                              "text-xs md:text-sm font-medium",
                              isDark ? "text-white/70" : "text-gray-700"
                            )}>
                              কিনুন
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "font-bold text-sm md:text-base",
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            )}>
                              ৳{totalSavings} সাশ্রয়
                            </div>
                            <div className={cn(
                              "text-[10px] md:text-xs",
                              isDark ? "text-white/40" : "text-gray-500"
                            )}>
                              (৳{savingsPerUnit.toFixed(0)}/pcs ছাড়)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-200">
                <p className="text-xs text-emerald-700 text-center italic">
                  💡 পরিমাণ বাড়ান এবং স্বয়ংক্রিয়ভাবে ছাড় পান!
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Order Summary Section */}
        <div className={cn(
          "p-4 md:p-10",
          isDark ? "bg-white/5 backdrop-blur-sm" : "bg-gradient-to-br from-brand-50 via-white to-brand-50"
        )}>
          <h2 className={cn(
            "text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center",
            isDark ? "text-white" : "text-gray-800"
          )}>
            <span className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4",
              isDark ? "bg-white/10" : "bg-brand-100"
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "h-5 w-5 md:h-6 md:w-6",
                  isDark ? "text-emerald-400" : "text-brand-600"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>
            অর্ডার সামারি
          </h2>

          <div className="space-y-6 md:space-y-8">
            {/* Product Card */}
            <div className={cn(
              "flex flex-col items-center gap-3 md:gap-6 p-3 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
              isDark ? "bg-white/5 border border-white/10" : "bg-white"
            )}>
              <div className=" relative">
                <img
                  src={
                    image?.url || "https://placehold.co/400x400?text=Product"
                  }
                  alt={image?.alt || title}
                  className="size-40 mx-auto object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (
                      target.src !== "https://placehold.co/400x400?text=Product"
                    ) {
                      target.src = "https://placehold.co/400x400?text=Product";
                    }
                  }}
                />
                <div className={cn(
                  "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  isDark ? "bg-emerald-500 text-white ring-2 ring-slate-800" : "bg-brand-500 text-white"
                )}>
                  {quantity}
                </div>
              </div>
              <div className="flex-grow text-center">
                <h3 className={cn(
                  "font-bold text-base md:text-xl mb-2",
                  isDark ? "text-white" : "text-gray-800"
                )}>
                  {title}
                </h3>
                <div className="flex justify-center items-center">
                  <p className={cn(
                    "text-xl md:text-2xl font-bold",
                    isDark ? "text-emerald-400" : "text-brand-600"
                  )}>
                    ৳{price}
                  </p>
                </div>
              </div>
            </div>

            {/* Variant Selector - Always rendered to allow Base Variant quantity control */}
            {product && (
              <div className={cn(
                "p-4 md:p-6 rounded-2xl shadow-sm border",
                isDark ? "bg-white/5 border-white/10" : "bg-white border-transparent"
              )}>
                <h3 className={cn(
                  "font-bold text-base md:text-lg mb-4",
                  isDark ? "text-white" : "text-gray-800"
                )}>
                  ভেরিয়েন্ট নির্বাচন করুন
                </h3>
                <VariantSelector
                  selectedVariants={variants}
                  productVariants={product.variants}
                  onVariantAdd={onVariantChange}
                  onVariantUpdate={onVariantUpdate || (() => {})}
                  showBaseVariant={true}
                  className="text-sm"
                  isDark={isDark}
                />
              </div>
            )}

            <div className={cn(
              "p-5 md:p-8 rounded-3xl shadow-sm border",
              isDark ? "bg-white/5 border-white/10" : "bg-white border-brand-50"
            )}>
              <div className="space-y-4">
                <div className={cn(
                  "flex justify-between items-center text-sm md:text-base pb-3 border-b",
                  isDark ? "text-white/40 border-white/10" : "text-gray-500 border-gray-50 font-medium"
                )}>
                  <span>
                    আইটেম মুল্য ( {quantity} টি ) :
                  </span>
                  <span>
                    ৳{orderDetails.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className={cn(
                  "flex justify-between items-center text-sm md:text-base pt-1",
                  isDark ? "text-white/80" : "text-gray-600"
                )}>
                  <span>সাবটোটাল:</span>
                  <span className="font-semibold text-xs space-x-2">
                    <span className={cn(
                      "text-xs font-bold",
                      isDark ? "text-emerald-400" : "text-brand-600"
                    )}>
                      ( {quantity} টি )
                    </span>
                    <span className={cn(
                      "text-xl font-bold",
                      isDark ? "text-emerald-400" : "text-brand-600"
                    )}>
                      ৳{orderDetails.subtotal.toLocaleString()}
                    </span>
                  </span>
                </div>

                {orderDetails.subtotal > price && (
                  <div className={cn(
                    "text-sm md:text-base font-medium",
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  )}>
                    <div className="flex justify-between items-center">
                      <span>কম্বো ডিসকাউন্ট (-) :</span>
                      <span className="space-x-2">
                        <span className="text-xs font-bold">
                          (-)
                        </span>
                        <span className="text-xl font-bold">
                          ৳
                          {(
                            orderDetails.subtotal - payablePrice!
                          ).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                <div className={cn(
                  "flex justify-between items-center text-sm md:text-base",
                  isDark ? "text-white/60" : "text-gray-600"
                )}>
                  <span>ডেলিভারি চার্জ (+):</span>
                  <span
                    className={cn(
                      "font-semibold",
                      product?.additionalInfo?.freeShipping ? "text-emerald-500 line-through" : isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    ৳{deliveryCharge.toLocaleString()}
                  </span>
                </div>

                {product?.additionalInfo?.freeShipping && (
                  <div className="flex justify-between items-center text-sm md:text-base text-emerald-600 font-bold italic bg-emerald-50/50 px-3 py-1.5 rounded-lg">
                    <span>শিপিং:</span>
                    <span>ফ্রি</span>
                  </div>
                )}

                {(discount || 0) > 0 && (
                  <div className={cn(
                    "flex justify-between items-center text-sm md:text-base font-bold",
                    isDark ? "text-emerald-400" : "text-brand-600"
                  )}>
                    <span>কুপন ডিসকাউন্ট (-) :</span>
                    <span>৳{(discount || 0).toLocaleString()}</span>
                  </div>
                )}

                <div className={cn(
                  "mt-4 pt-4 border-t-2 flex justify-between items-center",
                  isDark ? "border-white/10" : "border-brand-100"
                )}>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-base md:text-lg font-bold",
                      isDark ? "text-white" : "text-gray-800"
                    )}>
                      সর্বমোট মূল্য
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isDark ? "text-white/40" : "text-gray-400"
                    )}>
                      Cash on Delivery
                    </span>
                  </div>
                  <span className={cn(
                    "text-2xl md:text-3xl font-black",
                    isDark ? "text-emerald-400" : "text-brand-600"
                  )}>
                    ৳{calculateTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8">
              <h2 className={cn(
                "text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center",
                isDark ? "text-white" : "text-gray-800"
              )}>
                <span className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4",
                  isDark ? "bg-white/10" : "bg-brand-100"
                )}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(
                      "h-5 w-5 md:h-6 md:w-6",
                      isDark ? "text-emerald-400" : "text-brand-600"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                পেমেন্ট পদ্ধতি
              </h2>
              <div className={cn(
                "rounded-xl p-4",
                isDark ? "bg-white/5 border border-white/10" : "bg-brand-50"
              )}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        "h-5 w-5 md:h-6 md:w-6",
                        isDark ? "text-emerald-400" : "text-brand-600"
                      )}
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
                    <p className={cn(
                      "text-base md:text-lg font-medium",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      ক্যাশ অন ডেলিভারি
                    </p>
                    <p className={cn(
                      "text-xs md:text-sm",
                      isDark ? "text-white/40" : "text-gray-500"
                    )}>
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
  );
};

export default CheckoutSection;
