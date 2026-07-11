import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "@/store/Slices/CartSlice";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { Product } from "@/types/Product/Product";
import { useGetHost } from "@/utils/useGetHost";
import AnimatedContainer from "@/common/Components/AnimatedContainer";
import CountdownTimer from "../Components/CountdownTimer";
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import CheckoutSection from "../../Checkout/CheckoutSection";
import OrderSuccessModal from "../../Checkout/OrderSuccessModal";
import RelatedProducts from "@/pages/LandingPage/Components/RelatedProducts";
import WhyBuyFromUs from "../Components/WhyBuyFromUs";
import VideoGallery from "../Components/VideoGallery";
import { useTracking } from "@/hooks/useTracking";


const LandingPage = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const host = useGetHost();
  const { trackBeginCheckout, trackPurchase } = useTracking();

  // Hooks
  const {
    selectedVariants,
    totalQuantity,
    addVariant,
    updateVariantQuantity,
    initVariants,
  } = useVariantQuantity(product?.variants, product);

  useEffect(() => {
    if (product?.variants) initVariants(product.variants, product);
  }, [product, initVariants]);

  const effectiveQuantity = totalQuantity;

  const { finalTotal, basePrice, subtotal } =
    usePriceCalculation(product, selectedVariants, effectiveQuantity);
  const [currentImage, setCurrentImage] = useState<any>(null);

  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (product) {
      setCurrentImage(product.images[0]);
    }

    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, dispatch]);

  if (!product) return null;

  const handleVariantChange = (groupName: string, variant: any) => {
    addVariant(groupName, variant);
    if (variant.image?.url) setCurrentImage(variant.image);
  };

  // Manual quantity handling removed in favor of VariantSelector

  const applyCoupon = () => {
    const availableCoupons: Record<string, number> = {
      SAVE10: 50,
      WELCOME: 100,
    };

    if (availableCoupons[couponCode]) {
      const disc = availableCoupons[couponCode];
      setDiscount(disc);
      setAppliedCoupon({ code: couponCode, discount: disc });
      toast.success(`Coupon ${couponCode} applied!`);
    } else {
      setDiscount(0);
      setAppliedCoupon({ code: "", discount: 0 });
      toast.error("Invalid coupon code.");
    }
  };

  const calculateTotal = (courierCharge: string | null) => {
    const base = finalTotal;
    if (product?.additionalInfo?.freeShipping) {
      return Math.max(0, base - discount);
    }
    const chargeInside = product?.basicInfo?.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150;
    const shipping =
      courierCharge === "insideDhaka" ? chargeInside : chargeOutside;
    return Math.max(0, base + shipping - discount);
  };

  const handleSubmit = async (formData: any) => {
    try {
      // Validate quantity
      if (totalQuantity === 0) {
        toast.error(
          "Please select at least one variant with quantity greater than 0",
        );
        return;
      }

      const total = calculateTotal(formData.courierCharge);

      // Transform variants for Order API
      const variantsPayload: Record<string, any[]> = {};
      selectedVariants.forEach((sv) => {
        if (!variantsPayload[sv.group]) variantsPayload[sv.group] = [];
        variantsPayload[sv.group].push({
          value: sv.item.value,
          price: sv.item.price,
          quantity: sv.quantity,
        });
      });
      const orderData = {
        body: {
          items: [
            {
              product: product._id,
              image: currentImage?.url,
              quantity: effectiveQuantity,
              price: basePrice,
              itemKey: `${product._id}-${Date.now()}`,
              selectedVariants: variantsPayload,
            },
          ],
          totalAmount: total,
          deliveryCharge: product?.additionalInfo?.freeShipping
            ? 0
            : formData.courierCharge === "insideDhaka"
              ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80)
              : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150),
          status: "pending",
          billingInformation: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            email: formData.email || "no-email@example.com",
            country: "Bangladesh",
            paymentMethod: "cod",
          },
          courierCharge: formData.courierCharge,
          cuponCode: appliedCoupon.code,
          discount: appliedCoupon.discount,
        },
      };

      const response = await createOrder(orderData).unwrap();
      setSuccessOrderDetails({
        orderId: (response as any).data.orderId || (response as any).data._id, // Use human-readable orderId from backend
        subTotal: (response as any).data.subTotal, // Subtotal before discounts
        totalDiscount: (response as any).data.totalDiscount, // Combo + Coupon savings
        comboInfo: (response as any).data.comboInfo, // Combo description
        productPrice: finalTotal, // For backward compatibility
        deliveryCharge: product?.additionalInfo?.freeShipping
          ? 0
          : formData.courierCharge === "insideDhaka"
            ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80)
            : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150),
        totalAmount: (response as any).data.totalAmount, // Use backend-calculated total
        appliedCoupon: appliedCoupon,
      });
      setShowSuccessModal(true);

      trackPurchase({
        transaction_id: (response as any).data._id,
        value: total,
        tax: 0,
        shipping: product?.additionalInfo?.freeShipping
          ? 0
          : formData.courierCharge === "insideDhaka"
            ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80)
            : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150),
        currency: "BDT",
        coupon: appliedCoupon.code,
        items: [
          {
            item_id: product._id,
            item_name: product.basicInfo.title,
            price: basePrice,
            quantity: effectiveQuantity,
            item_category: product.basicInfo.category,
            item_variant: selectedVariants
              .map((v) => `${v.group}: ${v.item.value}`)
              .join(", "),
          },
        ],
        user_data: {
          email: formData.email,
          phone_number: formData.phone,
          address: {
            street: formData.address,
            country: "Bangladesh",
          },
        },
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Order failed");
    }
  };

  const scrollToCheckout = () => {
    trackBeginCheckout(
      [
        {
          id: product._id,
          name: product.basicInfo.title,
          price: basePrice,
          quantity: effectiveQuantity,
          category: product.basicInfo.category,
          variant: selectedVariants
            .map((v) => `${v.group}: ${v.item.value}`)
            .join(", "),
        },
      ],
      finalTotal,
      couponCode,
    );
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-primary text-gray-900 pb-20">
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <AnimatedContainer direction="down">
            <h1 className="text-2xl md:text-4xl font-black text-brand-700 mb-6 leading-tight">
              {product?.basicInfo?.title || "Product Title"}
            </h1>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.1}>
            <div className="relative group max-w-xl mx-auto mb-8">
              <div className="aspect-square rounded-[1.5rem] overflow-hidden border-6 border-brand-600 shadow-xl bg-white p-1.5">
                <img
                  src={
                    currentImage?.url ||
                    "https://placehold.co/800x800?text=No+Image"
                  }
                  alt={product?.basicInfo?.title || "Product image"}
                  className="w-full h-full object-cover rounded-[1rem]"
                />
              </div>
            </div>

            {/* Image Thumbnails */}
            {product?.images && product.images.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(img)}
                    className={`size-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      currentImage?.url === img.url
                        ? "border-brand-600 ring-2 ring-brand-200 scale-110"
                        : "border-gray-200 hover:border-brand-500"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product?.basicInfo?.title || "Product"} thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {/* Scroll to Video Link */}
                {product?.videos && product.videos.length > 0 && (
                  <button
                    onClick={() =>
                      document
                        .getElementById("product-video")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="size-16 rounded-xl overflow-hidden border-2 border-brand-200 bg-brand-50 flex items-center justify-center hover:bg-brand-100 transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-brand-600 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                      <span className="text-[10px] font-bold text-brand-600">
                        VIDEO
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.2}>
            <CountdownTimer days={3} />
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-4 mt-4">
              {/* <div className="w-full  mx-auto bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <PriceBreakdown
                     quantity={effectiveQuantity}
                     unitPrice={Math.round(basePrice)}
                     comboPricing={product.comboPricing || []}
                     subtotal={subtotal}
                   />
                </div>

                <div className="w-full max-w-md mx-auto mt-4 mb-4">
                  <ComboPricingDisplay
                    comboPricing={product.comboPricing || []}
                    currentQuantity={effectiveQuantity}
                    appliedTier={appliedComboTier || undefined} 
                    variant="primary"
                  />
                </div> */}

              <button
                onClick={scrollToCheckout}
                className="bg-brand-600 hover:bg-brand-700 text-xl md:text-2xl font-black py-4 px-10 rounded-xl shadow-[0_6px_0_0_#000] hover:shadow-[0_4px_0_0_#000] transition-all duration-2000 active:translate-y-1 active:shadow-none mt-4 text-white duration-500 animate-pulse"
              >
                অর্ডার করতে চাই
              </button>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Why Buy Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <AnimatedContainer direction="left">
          <div className="bg-brand-600 text-white p-4 rounded-t-2xl text-center">
            <h2 className="text-xl md:text-3xl font-black text-white uppercase">
              {product?.basicInfo?.title || "Product Title"}
            </h2>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-lg border-x border-b border-brand-100">
            {product?.basicInfo?.description ? (
              <div
                className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-3 whitespace-pre-line [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>li]:mb-2"
                dangerouslySetInnerHTML={{
                  __html: product.basicInfo.description,
                }}
              />
            ) : (
              <div className="grid gap-3">
                {(product?.basicInfo?.keyFeatures || []).map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-brand-50 rounded-xl border border-brand-100 italic font-medium"
                  >
                    <span className="text-brand-600 text-xl font-bold">✔</span>
                    <span className="text-base text-brand-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-10 bg-brand-100 py-4 rounded-xl border-2 border-dashed border-brand-500">
              <h3 className="text-2xl md:text-4xl font-black text-brand-700">
                {product.price.discounted || product.price.regular}{" "}
                <span className="text-brand-900 text-base">টাকা মাত্র</span>
              </h3>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToCheckout}
                className="bg-brand-600 hover:bg-brand-700 text-lg md:text-xl font-black py-3 px-8 rounded-lg shadow-md transition-all text-white"
              >
                অর্ডার করতে চাই
              </button>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Why Buy From Us */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatedContainer direction="right">
          <div className="bg-brand-600 text-white p-4 rounded-t-2xl text-center">
            <h2 className="text-xl md:text-3xl font-black uppercase text-white">
              আমাদের কাছে কেন কিনবেন?
            </h2>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-lg border-x border-b border-brand-100 space-y-4">
            <WhyBuyFromUs features={product?.basicInfo?.keyFeatures || []} />

            <div className="mt-8 rounded-2xl overflow-hidden border-4 border-brand-600 shadow-xl">
              <img
                src={product?.images?.[0]?.url}
                alt="Quality assurance"
                className="w-full h-auto"
              />
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Video Demonstration Section */}
      {product?.videos && product.videos.length > 0 && (
        <div
          id="product-video"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          <AnimatedContainer direction="up">
            <div className="bg-brand-600 text-white p-4 rounded-t-2xl text-center">
              <h2 className="text-xl md:text-3xl font-semibold uppercase text-white">
                Product Video Review
              </h2>
            </div>
            <div className="bg-white p-4 md:p-8 rounded-b-2xl shadow-lg border-x border-b border-brand-100">
              <VideoGallery videos={product.videos} />
            </div>
          </AnimatedContainer>
        </div>
      )}

      {/* Contact Bar */}
      <div className="bg-brand-600 text-white py-8 sticky top-0 z-40 mb-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-3xl font-black tracking-wide">
            যে কোন প্রয়োজনে যোগাযোগ করুন {host?.phone || "01610403011"}
          </p>
        </div>
      </div>

      {/* Checkout Section Integration */}
      <div id="checkout" className="container mx-auto px-4 max-w-5xl">
        <AnimatedContainer direction="none" delay={0.1}>
          <div className="bg-white rounded-[2rem] shadow-xl border border-brand-100 overflow-hidden">
            <div className="bg-brand-50 py-8 text-center border-b border-brand-100">
              <h2 className="text-xl md:text-2xl font-black text-brand-700 px-4">
                অর্ডার করতে নিচের ফর্মটি পূরণ করুন
              </h2>
            </div>

            <div className="">
              <CheckoutSection
                orderDetails={{
                  title: product.basicInfo.title,
                  price: basePrice,
                  payablePrice:finalTotal,
                  subtotal: subtotal,
                  variants: selectedVariants,
                  quantity: effectiveQuantity,
                  image: currentImage,
                  product: product,
                  discount: discount,
                }}
                handleSubmit={handleSubmit}
                onQuantityChange={() => {}}
                onVariantChange={handleVariantChange}
                onVariantUpdate={updateVariantQuantity}
                isLoading={isOrderLoading}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
              />
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 py-20">
        <RelatedProducts
          category={product?.basicInfo?.category}
          currentProductId={product?._id}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p>Copyright © 2026 {host.title || "BestBuy4uBd"}</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
