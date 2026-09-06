import { useState } from "react";
import {
  CardBadge,
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  ActionButtons,
  CardImageContainer,
} from "../Common";

export const Style1Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Reusable Image Container */}
      <CardImageContainer
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
        alt="Wireless Headphones"
        heightClass="h-56"
        roundedClass="rounded-xl"
      >
        <CardBadge
          text="POPULAR"
          variant="pill"
          colorScheme="purple"
          className="absolute top-4 left-4 z-10"
        />
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          activeColor="purple"
          className="absolute top-4 right-4 z-10"
        />
      </CardImageContainer>

      {/* Content */}
      <div className="p-1 my-2 flex-1 flex flex-col justify-between text-center">
        <CategoryLabel
          category="COOLING GADGETS"
          colorScheme="purple"
          align="center"
        />
        <ProductTitle
          title="Extonic ET-C702 Portable Air Cooler Fan – Powerful Cooling Fan (Green)"
          align="center"
          hoverColor="purple"
        />
        <PriceDisplay
          regularPrice={2250}
          discountedPrice={1750}
          colorScheme="purple"
          align="center"
        />
      </div>

      {/* Action Button */}
      <ActionButtons colorScheme="purple" className="rounded-full mt-auto" />
    </div>
  );
};
