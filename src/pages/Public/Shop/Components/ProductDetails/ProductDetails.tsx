import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Star,
  Minus,
  Heart,
  Truck,
  ShoppingCart,
  ChevronRight,
  Maximize2,
  Share2,
  ShieldCheck,
  Zap,
  Plus,
  CheckCircle,
  PhoneCall,
  X,
} from "lucide-react";
import { useGetHost } from "@/utils/useGetHost";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Chip, Divider, Skeleton } from "@heroui/react";
import {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
} from "@/store/Api/ProductApi";
import { useTracking } from "@/hooks/useTracking";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart, openWishlist } from "@/store/Slices/UISlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { RootState } from "@/store/store";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "../ProductCard";
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import PriceBreakdown from "../../../../../components/PriceBreakdown";
import SavingsGauge from "@/components/SavingsGauge";

const ProductDetailsSkeleton = () => (
  <div className="min-h-screen bg-slate-50/50 pb-20 font-primary">
    <CommonWrapper className="py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-5 space-y-8">
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-14 flex-1 rounded-xl" />
            <Skeleton className="h-14 w-14 rounded-xl" />
          </div>
        </div>
      </div>
    </CommonWrapper>
  </div>
);

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const host = useGetHost();
  const { 
    trackViewItem, 
    trackAddToCart, 
    trackAddToWishlist, 
    trackWishlistRemove, 
    trackVariantSelect 
  } = useTracking();
  
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { id } = useParams<{ id: string }>();
  
  const { data: productResponse, isLoading } = useGetProductByIdQuery({
    id: id || "",
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const product = productResponse?.data;

  // Hooks Integration
  const {
    selectedVariants,
    totalQuantity,
    addVariant,
    updateVariantQuantity
  } = useVariantQuantity(product?.variants, product);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (product) {
      trackViewItem({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
    }
  }, [product, trackViewItem]);

  // Pass totalQuantity (which is sum of variant quantities) as effectiveQuantity
  const {
    subtotal,
    finalTotal
  } = usePriceCalculation(product, selectedVariants, totalQuantity);

  const activeSelectedVariant = selectedVariants.find((v) => v.quantity > 0 && !v.isBaseVariant);
  const variantExtraPrice = activeSelectedVariant?.item?.price || 0;
  const currentDiscountedPrice = product?.price?.discounted || product?.price?.regular || 0;
  const activeUnitPrice = currentDiscountedPrice + variantExtraPrice;
  const activeRegularPrice = (product?.price?.regular || currentDiscountedPrice) + variantExtraPrice;
  const activeUnitSavings = Math.max(0, activeRegularPrice - activeUnitPrice);

  const selectSingleVariant = (group: string, item: any) => {
    const currentQty = Math.max(1, totalQuantity);
    selectedVariants.forEach((sv) => {
      if (sv.quantity > 0) {
        updateVariantQuantity(sv.group, sv.item.value, 0);
      }
    });
    addVariant(group, item);
    updateVariantQuantity(group, item.value, currentQty);
    if (product) {
      trackVariantSelect(product._id, group, item.value);
    }
  };

  const handleQuantityStep = (delta: number) => {
    const activeVar = selectedVariants.find((v) => v.quantity > 0) || selectedVariants[0];
    if (activeVar) {
      const newQty = Math.max(1, activeVar.quantity + delta);
      updateVariantQuantity(activeVar.group, activeVar.item.value, newQty);
    }
  };

  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    if (totalQuantity === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const activeSelectedVariants = selectedVariants.filter(sv => sv.quantity > 0 && !sv.isBaseVariant);
    const groupedVariants: Record<string, any[]> = {};
    activeSelectedVariants.forEach(sv => {
      if (!groupedVariants[sv.group]) groupedVariants[sv.group] = [];
      groupedVariants[sv.group].push({
        value: sv.item.value,
        price: sv.item.price,
        quantity: sv.quantity
      });
    });

    const variantsPayload = Object.entries(groupedVariants).map(([group, items]) => ({
      group,
      items
    }));

    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0]?.url,
      quantity: totalQuantity,
      selectedVariants: variantsPayload,
      deliveryChargeInsideDhaka: product.basicInfo.deliveryChargeInsideDhaka,
      deliveryChargeOutsideDhaka: product.basicInfo.deliveryChargeOutsideDhaka,
      freeShipping: product.additionalInfo?.freeShipping,
      comboPricing: product.comboPricing
    }));

    dispatch(openCart());
    trackAddToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      category: product.basicInfo.category,
      quantity: totalQuantity,
      variant: activeSelectedVariants.map(v => `${v.group}: ${v.item.value}`).join(", ")
    });
  };

  const handleOrderNow = () => {
    if (!product) return;
    if (totalQuantity === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const activeSelectedVariants = selectedVariants.filter(sv => sv.quantity > 0 && !sv.isBaseVariant);
    const groupedVariants: Record<string, any[]> = {};
    activeSelectedVariants.forEach(sv => {
      if (!groupedVariants[sv.group]) groupedVariants[sv.group] = [];
      groupedVariants[sv.group].push({
        value: sv.item.value,
        price: sv.item.price,
        quantity: sv.quantity
      });
    });

    const variantsPayload = Object.entries(groupedVariants).map(([group, items]) => ({
      group,
      items
    }));

    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0]?.url,
      quantity: totalQuantity,
      selectedVariants: variantsPayload,
      deliveryChargeInsideDhaka: product.basicInfo.deliveryChargeInsideDhaka,
      deliveryChargeOutsideDhaka: product.basicInfo.deliveryChargeOutsideDhaka,
      freeShipping: product.additionalInfo?.freeShipping,
      comboPricing: product.comboPricing
    }));

    trackAddToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      category: product.basicInfo.category,
      quantity: totalQuantity,
      variant: selectedVariants.map(v => `${v.group}: ${v.item.value}`).join(", ")
    });

    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      trackWishlistRemove({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
      trackAddToWishlist({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
    }
  };

  const handleShare = () => {
    if (!product) return;
    const shareData = {
      title: product.basicInfo.title,
      text: `Check out this product: ${product.basicInfo.title}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => toast.success("Shared successfully!"))
        .catch((err) => {
          if (err.name !== "AbortError") {
            toast.error("Could not share");
          }
        });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Product link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const { data: relatedProductsResponse } = useGetAllProductsQuery({ limit: 4 });


  if (isLoading) return <ProductDetailsSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  const stockStatus = product.stockStatus || "In Stock";

  const discountPercentage = product.price.discounted
    ? Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 pb-20 font-primary transition-colors">
      {/* Dynamic Header / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 transition-shadow">
        <CommonWrapper className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/shop" className="hover:text-secondary transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 dark:text-slate-100 truncate max-w-[150px] md:max-w-md">{product.basicInfo.title}</span>
            </div>
            <div className="flex gap-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={handleShare}
                className="bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-gray-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>
        </CommonWrapper>
      </div>

      <CommonWrapper className="px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="flex flex-col gap-4">
              <div 
                className="relative aspect-square bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-center group overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsLightboxOpen(true)}
              >
                <div
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{
                    transform: isHovered ? "scale(1.8)" : "scale(1)",
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                >
                  <img
                    src={product.images[selectedImage]?.url}
                    alt={product.basicInfo.title}
                    className="w-full h-full object-contain p-8 transition-opacity duration-300"
                  />
                </div>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <Chip color="success" size="sm" className="font-bold shadow-md text-white">
                      {discountPercentage}% OFF
                    </Chip>
                  )}
                  {product.additionalInfo?.isFeatured && (
                    <Chip color="primary" size="sm" className="font-bold shadow-md">
                      FEATURED
                    </Chip>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Maximize2 className="w-5 h-5 text-gray-700 dark:text-slate-200" />
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto py-1 px-1 justify-center lg:justify-start">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`size-20 rounded-xl border transition-all p-1 bg-white dark:bg-slate-900 flex-shrink-0 relative group cursor-pointer ${
                      selectedImage === idx ? "border-secondary ring-2 ring-secondary/20" : "border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Chip size="sm" variant="flat" className="font-bold uppercase tracking-wider text-[10px] bg-secondary/10 text-secondary">
                  {product.basicInfo.category}
                </Chip>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-900/30">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{product.rating?.average || 0}</span>
                  <span className="text-[10px] text-yellow-600/80 dark:text-yellow-400/80 font-medium">({product.rating?.count || 0})</span>
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={stockStatus === "In Stock" ? "success" : stockStatus === "Pre-order" ? "warning" : "danger"}
                  className="font-bold text-[10px]"
                >
                  {stockStatus.toUpperCase()}
                </Chip>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight">
                {product.basicInfo.title}
              </h1>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                 <span className="text-3xl font-extrabold text-secondary font-mono">
                   ৳{activeUnitPrice.toLocaleString()}
                 </span>
                 {activeRegularPrice > activeUnitPrice && (
                    <span className="text-lg font-semibold line-through text-gray-400 dark:text-slate-500 font-mono">
                      ৳{activeRegularPrice.toLocaleString()}
                    </span>
                 )}
                 {activeUnitSavings > 0 && (
                    <span className="text-xs font-bold text-[#D6483C] bg-[#F6D9D5] dark:bg-red-950/40 dark:text-red-400 px-2.5 py-1 rounded-md">
                      Save ৳{activeUnitSavings.toLocaleString()}
                    </span>
                 )}
              </div>

              {product.basicInfo.description && (
                <div
                  className="text-sm text-gray-600 dark:text-slate-350 leading-relaxed font-inter pt-2 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
                  dangerouslySetInnerHTML={{ __html: product.basicInfo.description }}
                />
              )}
            </div>

            <Divider className="opacity-60" />

            {/* Variant Selector Section (Matching shared single-choice card design) */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                {product.variants.map((variantGroup: any, gIdx: number) => {
                  const baseVariantItem = {
                    value: product.price?.baseVariantName || "Standard",
                    price: 0,
                    stock: product.stockQuantity,
                    isBaseVariant: true
                  };
                  const itemsToRender = gIdx === 0
                    ? [baseVariantItem, ...variantGroup.items.filter((i: any) => i.value !== (product.price?.baseVariantName || "Standard"))]
                    : variantGroup.items;

                  return (
                    <div key={variantGroup.group} className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-widest pl-1">
                        SELECT {variantGroup.group}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {itemsToRender.map((item: any) => {
                          const isSelected = selectedVariants.some(
                            (sv) => sv.group === variantGroup.group && sv.item.value === item.value && sv.quantity > 0
                          );
                          const defaultUnitPrice = product.price.discounted || product.price.regular;
                          const defaultRegularPrice = product.price.regular || defaultUnitPrice;
                          const itemExtraPrice = item.price || 0;
                          const itemBasePrice = defaultUnitPrice + itemExtraPrice;
                          const itemWasPrice = defaultRegularPrice + itemExtraPrice;

                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => selectSingleVariant(variantGroup.group, item)}
                              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? "border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm"
                                  : "border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300 dark:hover:border-slate-700"
                              }`}
                            >
                              <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                {item.value}
                              </div>
                              <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                                <span
                                  className={`font-mono font-extrabold text-lg sm:text-xl ${
                                    isSelected
                                      ? "text-emerald-700 dark:text-emerald-300 font-black"
                                      : "text-gray-900 dark:text-slate-100"
                                  }`}
                                >
                                  ৳{itemBasePrice.toLocaleString()}
                                </span>
                                {itemWasPrice > itemBasePrice && (
                                  <span className="line-through text-gray-400 dark:text-slate-500 font-normal text-xs">
                                    ৳{itemWasPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity Selector Section */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-widest">
                  Quantity
                </h3>
                <p className="text-xs text-gray-450 dark:text-slate-500 uppercase tracking-wider ">
                  Choose number of items
                </p>
              </div>
              <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => handleQuantityStep(-1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-950 dark:text-slate-100">
                  {Math.max(1, totalQuantity)}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityStep(1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Savings Gauge Pressure Gauge */}
            {product.comboPricing && product.comboPricing.length > 0 && (
              <SavingsGauge
                comboPricing={product.comboPricing}
                currentQuantity={totalQuantity}
              />
            )}

            {/* Price Summary Card */}
            {((product.comboPricing && product.comboPricing.length > 0) || totalQuantity > 1) && (
              <PriceBreakdown
                quantity={totalQuantity}
                unitPrice={activeUnitPrice}
                regularUnitPrice={activeRegularPrice}
                subtotal={subtotal}
                comboPricing={product.comboPricing || []}
              />
            )}

            {/* Actions */}
            <div className="sticky bottom-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 -mx-4 md:static md:bg-transparent md:p-0 md:mx-0 border-t md:border-t-0 border-gray-200 dark:border-slate-800 space-y-3">
               <div className="flex gap-3">
                  <Button
                    size="lg"
                    onPress={handleAddToCart}
                    isDisabled={totalQuantity === 0}
                    className="flex-1 h-12 bg-secondary text-white font-bold text-base shadow-lg shadow-secondary/20 rounded-xl hover:shadow-secondary/40 transition-all cursor-pointer"
                    startContent={<ShoppingCart className="w-5 h-5" />}
                  >
                    Add to Cart - ৳{finalTotal.toLocaleString()}
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    onPress={handleWishlist}
                    className={`h-12 w-12 rounded-xl border transition-all cursor-pointer ${
                      isWishlisted 
                        ? "bg-danger border-danger text-white shadow-lg" 
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-400 hover:border-danger hover:text-danger"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
               </div>
               
               <Button
                 size="lg"
                 onPress={handleOrderNow}
                 isDisabled={totalQuantity === 0}
                 className="w-full h-12 bg-[#ff5a00] hover:bg-[#e04f00] text-white font-semibold text-2xl shadow-lg shadow-orange-500/20 rounded-xl hover:shadow-orange-500/40 transition-all cursor-pointer"
                 startContent={<Zap className="w-5 h-5 fill-current animate-pulse" />}
               >
                 অর্ডার করুন
               </Button>
            </div>

            {/* Trust Signals & Need Help */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm text-center sm:text-left">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-700 dark:text-slate-350" />
                </div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-900 dark:text-slate-100 tracking-tight">Fast Delivery</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400">2-3 Days</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm text-center sm:text-left">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-700 dark:text-slate-350" />
                </div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-900 dark:text-slate-100 tracking-tight">Warranty</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400">Verified</p>
                </div>
              </div>

              {host.phone ? (
                <a
                  href={`tel:${host.phone}`}
                  className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm text-center sm:text-left hover:border-secondary transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/15 transition-colors">
                    <PhoneCall className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-700 dark:text-slate-350 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="overflow-hidden w-full">
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-900 dark:text-slate-100 tracking-tight group-hover:text-secondary transition-colors">Need Help?</h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-550 dark:text-slate-400 font-semibold truncate group-hover:text-secondary transition-colors">{host.phone}</p>
                  </div>
                </a>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm text-center sm:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-400 dark:text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400 dark:text-slate-500 tracking-tight">Need Help?</h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-slate-550">Online</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="mt-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-12 space-y-12">
              {/* Description */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-800">
                  <div className="h-6 w-1 bg-secondary rounded-full" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 uppercase tracking-tight">Description</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div
                    className="prose prose-sm max-w-none text-gray-600 dark:text-slate-300 leading-relaxed font-inter whitespace-pre-wrap [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
                    dangerouslySetInnerHTML={{ __html: product.basicInfo.description }}
                  />
                </div>
              </section>

              {/* Key Features */}
              {product.basicInfo.keyFeatures && product.basicInfo.keyFeatures.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-800">
                    <div className="h-6 w-1 bg-secondary rounded-full" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 uppercase tracking-tight">Key Features</h2>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.basicInfo.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/50 dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800/40">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-inter">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <section className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-800">
                    <div className="h-6 w-1 bg-secondary rounded-full" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 uppercase tracking-tight">Specifications</h2>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {product.specifications.map((group, i) => (
                        <div key={i} className={`p-6 ${i % 2 === 0 ? "md:border-r border-gray-100 dark:border-slate-800" : ""} border-b border-gray-100 dark:border-slate-800 last:border-b-0`}>
                          <h3 className="text-secondary font-bold text-xs uppercase tracking-widest mb-4">{group.group}</h3>
                          <div className="space-y-3">
                            {group.items.map((item, j) => (
                              <div key={j} className="flex justify-between items-center group">
                                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{item.name}</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Related Products Grid */}
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 uppercase tracking-tight">You May Also Like</h2>
              </div>
              <Button as={Link} to="/shop" variant="light" color="secondary" className="font-bold text-xs uppercase tracking-wider h-8 cursor-pointer">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsResponse?.data
                ?.filter((p: any) => p._id !== product._id)
                .slice(0, 4)
                .map((p: any) => (
                  <ProductCard key={p._id} product={p} />
                ))}
            </div>
          </section>
        </div>
      </CommonWrapper>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Button
              isIconOnly
              variant="flat"
              className="absolute top-4 right-4 bg-white/20 text-white rounded-full z-10 hover:bg-white/30"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={product.images[selectedImage]?.url}
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
