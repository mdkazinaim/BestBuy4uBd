import { useState } from "react";
import {
  CardBadge,
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  ActionButtons,
} from "../Common";

export const Style4Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        <CardBadge
          text="-12%"
          colorScheme="red"
          className="absolute top-3 left-3 z-10"
        />
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          activeColor="red"
          className="absolute top-3 right-3 z-10"
        />
        <img
          src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"
          alt="Shirt"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <CategoryLabel category="MEN'S COLLECTION" colorScheme="slate" />
          <ProductTitle
            title="Bamboo JACQUARD Premium Men's Casual Shirt S060"
            hoverColor="none"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <PriceDisplay
            regularPrice={2250}
            discountedPrice={1990}
            colorScheme="red"
          />
          <ActionButtons
            variant="single-full"
            primaryText="Buy Now"
            colorScheme="slate"
            className="w-auto px-3 py-1.5"
          />
        </div>
      </div>
    </div>
  );
};
