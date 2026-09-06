import { useState } from "react";
import {
  CardBadge,
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  ActionButtons,
} from "../Common";

export const Style2Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
  );

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Box */}
      <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        <CardBadge
          text="-13% OFF"
          colorScheme="orange"
          className="absolute top-3 left-3 z-10"
        />
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          activeColor="red"
          className="absolute top-3 right-3 z-10"
        />
        <img
          src={imgSrc}
          onError={() =>
            setImgSrc("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80")
          }
          alt="Dress"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <CategoryLabel category="FASHION & APPAREL" colorScheme="orange" />
          <ProductTitle
            title="Unstitched 3Pc Embroidered Luxury Lawn Collection"
            hoverColor="orange"
            className="mt-0.5"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <PriceDisplay
            regularPrice={5600}
            discountedPrice={4900}
            colorScheme="orange"
          />
          <ActionButtons
            variant="quick-buy"
            primaryText="Quick Buy →"
            className="text-orange-500 hover:text-orange-600"
          />
        </div>
      </div>
    </div>
  );
};
