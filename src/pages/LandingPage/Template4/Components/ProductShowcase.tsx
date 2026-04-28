import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Product } from "@/types/Product/Product";
import VariantSelector from "../../Components/VariantSelector";

import PriceBreakdown from "@/components/PriceBreakdown";

interface ProductShowcaseProps {
  product: Product;
  currentImage: any;
  setCurrentImage: (image: any) => void;
  selectedVariants: any;
  handleVariantChange: (groupName: string, variant: any) => void;
  updateVariantQuantity: (
    groupName: string,
    variantValue: string,
    quantity: number,
  ) => void;
  basePrice: number;
  effectiveQuantity: number;
}

export default function ProductShowcase({
  product,
  currentImage,
  setCurrentImage,
  selectedVariants,
  handleVariantChange,
  updateVariantQuantity,
  basePrice,
  effectiveQuantity,
}: ProductShowcaseProps) {
  const subtotal = basePrice * effectiveQuantity;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = () => {
    const newIndex =
      activeImageIndex === 0 ? product.images.length - 1 : activeImageIndex - 1;
    setActiveImageIndex(newIndex);
    setCurrentImage(product.images[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex =
      activeImageIndex === product.images.length - 1 ? 0 : activeImageIndex + 1;
    setActiveImageIndex(newIndex);
    setCurrentImage(product.images[newIndex]);
  };
  return (
    <section
      id="product"
      className="py-20 bg-gradient-to-b from-slate-900 to-purple-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 group">
              <img
                src={currentImage?.url || product.images[0]?.url}
                alt={currentImage?.alt || product.images[0]?.alt}
                className="w-full h-auto object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImage(image);
                    setActiveImageIndex(index);
                  }}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/50"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover aspect-square"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {product.basicInfo.title}
              </h2>
              <p className="text-white/70 text-lg">{product.basicInfo.brand}</p>
            </div>

            {/* Price Display */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <PriceBreakdown
                quantity={effectiveQuantity}
                unitPrice={basePrice}
                comboPricing={product.comboPricing || []}
                subtotal={subtotal}
                className="bg-transparent text-white backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              />
            </div>

            {/* Combo Pricing */}
            {/* {product.comboPricing && product.comboPricing.length > 0 && (
              <ComboPricingDisplay
                comboPricing={product.comboPricing}
                currentQuantity={effectiveQuantity}
              />
            )} */}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  অপশন নির্বাচন করুন
                </h3>
                <VariantSelector
                  selectedVariants={selectedVariants}
                  productVariants={product.variants}
                  onVariantAdd={handleVariantChange}
                  onVariantUpdate={updateVariantQuantity}
                />
              </div>
            )}

            {/* Key Features */}
            {product.basicInfo.keyFeatures &&
              product.basicInfo.keyFeatures.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">
                    মুখ্য বৈশিষ্ট্য
                  </h3>
                  <ul className="space-y-3">
                    {product.basicInfo.keyFeatures
                      .slice(0, 5)
                      .map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="text-white/80 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {/* CTA to Checkout */}
            <a
              href="#order"
              className="block w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-center text-lg shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              অর্ডার করতে নিচে যান
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
