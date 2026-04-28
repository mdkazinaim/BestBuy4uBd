import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "@/store/Slices/CartSlice";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { Product } from "@/types/Product/Product";
import AnimatedContainer from "@/common/Components/AnimatedContainer";
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import CheckoutSection from "../../Checkout/CheckoutSection";
import OrderSuccessModal from "../../Checkout/OrderSuccessModal";
import RelatedProducts from "@/pages/LandingPage/Components/RelatedProducts";
import Hero from "../Components/Hero";
import Features from "../Components/Features";
import ProductShowcase from "../Components/ProductShowcase";
import SocialProof from "../Components/SocialProof";
import { useTracking } from "@/hooks/useTracking";

const LandingPage = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
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

  const { finalTotal, basePrice } = usePriceCalculation(
    product,
    selectedVariants,
    effectiveQuantity,
  );

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

  const handleOrderSuccess = (orderDetails: any) => {
    setSuccessOrderDetails(orderDetails);
    setShowSuccessModal(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
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
              price: basePrice, // Base unit price (NOT finalTotal/quantity)
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
      handleOrderSuccess({
        orderId: (response as any).data.orderId || (response as any).data._id,
        subTotal: (response as any).data.subTotal,
        totalDiscount: (response as any).data.totalDiscount,
        comboInfo: (response as any).data.comboInfo,
        productPrice: finalTotal,
        deliveryCharge: product?.additionalInfo?.freeShipping
          ? 0
          : formData.courierCharge === "insideDhaka"
            ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80)
            : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150),
        totalAmount: (response as any).data.totalAmount,
        appliedCoupon: appliedCoupon,
      });

      trackPurchase({
        transaction_id: (response as any).data._id,
        value: total,
        tax: 0,
        shipping: product.additionalInfo?.freeShipping
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

  // Build orderDetails object for CheckoutSection
  const orderDetails = {
    title: product.basicInfo.title,
    variants: selectedVariants,
    price: basePrice,
    subtotal: finalTotal,
    quantity: effectiveQuantity,
    image: product.images[0],
    product: product,
    discount: discount,
    payablePrice: finalTotal,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <Hero
        product={product}
        scrollToCheckout={() => {
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
          document
            .getElementById("order")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Product Showcase with Variants */}
      <ProductShowcase
        product={product}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        selectedVariants={selectedVariants}
        handleVariantChange={handleVariantChange}
        updateVariantQuantity={updateVariantQuantity}
        basePrice={basePrice}
        effectiveQuantity={effectiveQuantity}
      />

      {/* Features Section */}
      <Features />

      {/* Social Proof */}
      <SocialProof />

      {/* Checkout Section */}
      <section
        id="order"
        className="py-20 bg-gradient-to-b from-slate-900 to-purple-900"
      >
        <div className="container mx-auto px-4">
          <AnimatedContainer>
            <CheckoutSection
              orderDetails={orderDetails}
              handleSubmit={handleSubmit}
              onQuantityChange={() => {}}
              onVariantChange={handleVariantChange}
              onVariantUpdate={updateVariantQuantity}
              isLoading={isOrderLoading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              isDark={true}
            />
          </AnimatedContainer>
        </div>
      </section>

      {/* Related Products */}
      {product?._id && (
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <RelatedProducts
              currentProductId={product._id}
              category={product.basicInfo.category}
            />
          </div>
        </section>
      )}

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={successOrderDetails}
      />
    </div>
  );
};

export default LandingPage;
