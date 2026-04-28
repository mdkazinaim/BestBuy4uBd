import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import AnimatedContainer from "@/common/Components/AnimatedContainer";
import { useGetNewArrivalsQuery } from "@/store/Api/ProductApi";
import ProductCard from "./ProductCard";

interface ProgressProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  purchases: number | string;
  badges: string[];
  promotion?: {
    text: string[];
    expiry: string;
    image: string;
  };
  product: any; // Keep raw product for wishlist
}

const NewArrival: React.FC = () => {
  const navigate = useNavigate();

  const { data: productResponse, isLoading } = useGetNewArrivalsQuery();

  const products = useMemo(() => {
    if (
      isLoading ||
      !productResponse?.data ||
      productResponse.data.length === 0
    ) {
      return [];
    }

    return productResponse.data.map((product: any): ProgressProduct => {
      // Check for combo pricing
      const hasCombo = product.comboPricing && product.comboPricing.length > 0;

      let promotion;
      if (hasCombo && product.comboPricing) {
        // Find specific quantities (e.g., 2 and 4) from comboPricing if possible
        const combo2 = product.comboPricing.find(
          (cp: any) => cp.minQuantity === 2,
        );
        const combo4 = product.comboPricing.find(
          (cp: any) => cp.minQuantity === 4,
        );

        promotion = {
          text: [
            combo2
              ? `Buy 02 boxes get ৳${combo2.discount} off`
              : "Special Combo Offer",
            combo4
              ? `Buy 04 boxes get ৳${combo4.discount} off`
              : "Limited Time Deal",
          ],
          expiry: "Limited Offer",
          image: "https://i.ibb.co/VvW8N4k/gift-box.png",
        };
      }

      return {
        id: product._id,
        title: product.basicInfo.title,
        price:
          (product.price.discounted ?? 0) > 0
            ? (product.price.discounted ?? 0).toLocaleString()
            : product.price.regular.toLocaleString(),
        image: product.images?.[0]?.url || "https://placehold.co/400x500",
        rating: product.rating?.average || 0,
        reviews: product.rating?.count || 0,
        purchases: product.sold || 0,
        badges: hasCombo ? ["COMBO"] : ["NEW"],
        promotion,
        product,
      };
    });
  }, [productResponse, isLoading]);

  const handleViewAll = () => {
    navigate(`/shop`);
  };

  return (
    <section className="pb-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-semibold text-brand-700 mb-0">
              New Arrival
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="hidden md:block text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            View All
          </button>
        </div>

        {/* Pattern Grid: Repeating rows of 1 Large + 3 Small */}
        <div className="flex flex-col gap-6">
          {[0, 4].map((rowStart) => (
            <div
              key={rowStart}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Large Card (Featured) */}
              <div className="lg:col-span-5">
                {products[rowStart] && (
                  <AnimatedContainer delay={0} className="h-full">
                    <ProductCard
                      {...products[rowStart]}
                      isLarge
                      className="h-full"
                    />
                  </AnimatedContainer>
                )}
              </div>

              {/* Small Cards Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">
                  {products
                    .slice(rowStart + 1, rowStart + 4)
                    .map((product: ProgressProduct, idx: number) => (
                      <AnimatedContainer
                        key={idx}
                        delay={(idx + 1) * 0.1}
                        className="h-full"
                      >
                        <ProductCard
                          {...product}
                          isLarge={false}
                          className="h-full"
                        />
                      </AnimatedContainer>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-12 md:hidden text-center">
          <button
            onClick={handleViewAll}
            className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
