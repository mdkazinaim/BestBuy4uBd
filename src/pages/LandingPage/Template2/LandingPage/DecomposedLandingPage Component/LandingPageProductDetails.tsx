import React from "react";
import KeyFeatures from "./KeyFeatures";

import ProductDescription from "./ProductDescription";
import PolicyAndShipping from "./PolicyAndShipping";
import CustomerReviews from "./CustomerReviews";
import { Product, ProductImage } from "@/types/Product/Product";
import Specifications from "./Specifications";
import { Layout, ClipboardList, Star, Truck } from "lucide-react";
import AnimatedContainer from "@/common/Components/AnimatedContainer";

interface LandingPageProductDetailsProps {
  product: Product;
  currentPrice?: number;
  currentImage?: ProductImage | null;
  selectedVariants?: { group: string; item: any; quantity: number }[];
  quantity?: number;
  onVariantChange?: (groupName: string, variant: any) => void;
  onQuantityChange?: (qty: number) => void;
}

const LandingPageProductDetails: React.FC<LandingPageProductDetailsProps> = ({
  product,
}) => {
  const reviewCount = product.rating?.count || 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-12">
        {/* Main Content Info */}
        <div className="space-y-16">
          {/* Description */}
          {product.basicInfo.description && (
            <AnimatedContainer>
              <section id="description">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-100 pb-2 inline-block">
                    বিস্তারিত তথ্য
                  </h2>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 text-gray-700 leading-relaxed whitespace-pre-line">
                  <ProductDescription
                    description={product.basicInfo.description}
                  />
                </div>
              </section>
            </AnimatedContainer>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <AnimatedContainer delay={0.1}>
              <section id="specifications">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-100 pb-2 inline-block">
                    স্পেসিফিকেশন
                  </h2>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                  <Specifications specifications={product.specifications} />
                </div>
              </section>
            </AnimatedContainer>
          )}

          {/* Reviews */}
          {reviewCount > 0 && (
            <AnimatedContainer delay={0.2}>
              <section id="reviews">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-100 pb-2 inline-block">
                    গ্রাহকদের মতামত
                  </h2>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                  <CustomerReviews reviews={product.reviews || []} />
                </div>
              </section>
            </AnimatedContainer>
          )}


          {/* Shipping & Policy */}
          <AnimatedContainer delay={0.3}>
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-100 pb-2 inline-block">
                  শিপিং ও রিটার্ন পলিসি
                </h2>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 line">
                <PolicyAndShipping
                  shippingDetails={product.shippingDetails}
                  additionalInfo={product.additionalInfo}
                />
              </div>
            </section>
          </AnimatedContainer>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {product.basicInfo.keyFeatures && product.basicInfo.keyFeatures.length > 0 && (
            <AnimatedContainer direction="left">
               <div id="features">
                  <KeyFeatures features={product.basicInfo.keyFeatures} />
               </div>
            </AnimatedContainer>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-3xl border border-blue-100 sticky top-24">
            <AnimatedContainer direction="none" delay={0.2}>
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-lg text-lg">
                  🕒
                </span>
                দ্রুত ডেলিভারি
              </h3>
              <p className="text-blue-800 leading-relaxed font-medium">
                আপনার অর্ডার করার ২৪-৪৮ ঘণ্টার মধ্যে আমরা পণ্য ডেলিভারি নিশ্চিত
                করি। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।
              </p>
              <div className="mt-6 pt-6 border-t border-blue-200/50 space-y-4">
                <div className="flex items-center gap-3 text-blue-900">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold">
                    ১০০% অরিজিনাল পণ্য
                  </span>
                </div>
                <div className="flex items-center gap-3 text-blue-900">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold">সহজ রিটার্ন পলিসি</span>
                </div>
                <div className="flex items-center gap-3 text-blue-900">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold">
                    ২৪/৭ কাস্টমার সাপোর্ট
                  </span>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageProductDetails;
