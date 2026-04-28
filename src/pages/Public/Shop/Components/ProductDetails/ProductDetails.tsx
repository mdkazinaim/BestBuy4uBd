import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
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
import ComboPricingDisplay from "../../../../../components/ComboPricingDisplay";
import VariantSelector from "@/pages/LandingPage/Components/VariantSelector";

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
    basePrice,
    subtotal,
    appliedComboTier,
    finalTotal
  } = usePriceCalculation(product, selectedVariants, totalQuantity);

  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    if (totalQuantity === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const groupedVariants: Record<string, any[]> = {};
    selectedVariants.forEach(sv => {
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
      variant: selectedVariants.map(v => `${v.group}: ${v.item.value}`).join(", ")
    });
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const { data: relatedProductsResponse } = useGetAllProductsQuery({ limit: 4 });

  if (isLoading) return <ProductDetailsSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  const discountPercentage = product.price.discounted
    ? Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 font-primary">
      {/* Dynamic Header / Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 transition-shadow">
        <CommonWrapper className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/shop" className="hover:text-secondary transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 truncate max-w-[150px] md:max-w-md">{product.basicInfo.title}</span>
            </div>
            <div className="flex gap-2">
              <Button isIconOnly variant="light" size="sm" className="bg-gray-50 rounded-full hover:bg-gray-100">
                <Share2 className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </CommonWrapper>
      </div>

      <CommonWrapper className="px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (Sticky) */}
          <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20">
            <div className="flex flex-col gap-4">
              <div 
                className="relative aspect-square bg-white rounded-xl border border-gray-200 flex items-center justify-center group overflow-hidden cursor-zoom-in group"
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
                    <Chip color="danger" size="sm" className="font-bold shadow-md">
                      -{discountPercentage}% OFF
                    </Chip>
                  )}
                  {product.additionalInfo?.isFeatured && (
                    <Chip color="primary" size="sm" className="font-bold shadow-md">
                      FEATURED
                    </Chip>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto py-1 px-1 justify-center lg:justify-start">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`size-20 rounded-xl border transition-all p-1 bg-white flex-shrink-0 relative group ${
                      selectedImage === idx ? "border-secondary ring-2 ring-secondary/20" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Chip size="sm" variant="flat" className="font-bold uppercase tracking-wider text-[10px] bg-secondary/10 text-secondary">
                  {product.basicInfo.category}
                </Chip>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-200">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-700">{product.rating?.average || 0}</span>
                  <span className="text-[10px] text-yellow-600/80 font-medium">({product.rating?.count || 0})</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.basicInfo.title}
              </h1>

              <div className="flex items-center gap-3 pt-2">
                 <span className="text-3xl font-extrabold text-secondary">
                   ৳{(product.price.discounted || product.price.regular).toLocaleString()}
                 </span>
                 {product.price.discounted && product.price.discounted < product.price.regular && (
                    <span className="text-lg font-semibold line-through text-gray-400">
                      ৳{product.price.regular.toLocaleString()}
                    </span>
                 )}
              </div>
            </div>

            <Divider className="opacity-60" />

            {/* Price Summary Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Price Summary
              </h3>
              
              <PriceBreakdown
                quantity={totalQuantity}
                unitPrice={basePrice}
                subtotal={subtotal}
                comboPricing={product.comboPricing || []}
              />
              
              {product.comboPricing && product.comboPricing.length > 0 && (
                <div className="mt-4">
                   <ComboPricingDisplay
                    comboPricing={product.comboPricing}
                    currentQuantity={totalQuantity}
                    appliedTier={appliedComboTier || undefined}
                    variant="success"
                  />
                </div>
              )}
            </div>

            {/* Variant Selector Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest pl-1">
                Select Options
              </h3>
              <VariantSelector
                selectedVariants={selectedVariants}
                productVariants={product.variants}
                onVariantAdd={(group, item) => {
                  addVariant(group, item);
                  trackVariantSelect(product._id, group, item.value);
                }}
                onVariantUpdate={updateVariantQuantity}
                showBaseVariant={true}
              />
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 z-20 bg-white/80 backdrop-blur-md p-4 -mx-4 md:static md:bg-transparent md:p-0 md:mx-0 border-t md:border-t-0 border-gray-200">
               <div className="flex gap-3">
                  <Button
                    size="lg"
                    onPress={handleAddToCart}
                    isDisabled={totalQuantity === 0}
                    className="flex-1 h-12 bg-secondary text-white font-bold text-base shadow-lg shadow-secondary/20 rounded-xl hover:shadow-secondary/40 transition-all"
                    startContent={<ShoppingCart className="w-5 h-5" />}
                  >
                    Add to Cart - ৳{finalTotal.toLocaleString()}
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    onPress={handleWishlist}
                    className={`h-12 w-12 rounded-xl border transition-all ${
                      isWishlisted 
                        ? "bg-danger border-danger text-white shadow-lg" 
                        : "bg-white border-gray-200 text-gray-400 hover:border-danger hover:text-danger"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
               </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-gray-900">Fast Delivery</h4>
                  <p className="text-[10px] text-gray-500">2-3 Days</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-gray-900">Warranty</h4>
                  <p className="text-[10px] text-gray-500">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="mt-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Description */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="h-6 w-1 bg-secondary rounded-full" />
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Description</h2>
                </div>
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <div
                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-inter"
                    dangerouslySetInnerHTML={{ __html: product.basicInfo.description }}
                  />
                </div>
              </section>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <section className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                    <div className="h-6 w-1 bg-secondary rounded-full" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Specifications</h2>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {product.specifications.map((group, i) => (
                        <div key={i} className={`p-6 ${i % 2 === 0 ? "md:border-r border-gray-100" : ""} border-b border-gray-100 last:border-b-0`}>
                          <h3 className="text-secondary font-bold text-xs uppercase tracking-widest mb-4">{group.group}</h3>
                          <div className="space-y-3">
                            {group.items.map((item, j) => (
                              <div key={j} className="flex justify-between items-center group">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.name}</span>
                                <span className="text-xs font-bold text-gray-900">{item.value}</span>
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

            {/* Sidebar widgets for desktop */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-slate-900 p-8 rounded-xl text-white relative overflow-hidden group shadow-xl">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-tight">Need Help?</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Have questions about this product? Contact our support team for assistance.
                    </p>
                    <Divider className="bg-white/10" />
                    <Button className="w-full bg-white text-slate-900 font-bold text-xs uppercase tracking-widest h-10 rounded-xl">
                      Contact Us
                    </Button>
                  </div>
               </div>
            </div>
          </div>

          {/* Related Products Grid */}
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">You May Also Like</h2>
              </div>
              <Button as={Link} to="/shop" variant="light" color="secondary" className="font-bold text-xs uppercase tracking-wider h-8">
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
              <Minus className="w-6 h-6 rotate-45" />
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
