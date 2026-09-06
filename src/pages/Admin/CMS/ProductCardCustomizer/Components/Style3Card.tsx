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

export const Style3Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Reusable Image Container */}
      <CardImageContainer
        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"
        alt="Saree"
        heightClass="h-56"
        bgClass="bg-amber-50 dark:bg-slate-800"
        roundedClass="rounded-lg"
      >
        <CardBadge
          text="-47% OFF"
          colorScheme="pink"
          className="absolute top-2.5 left-2.5 z-10"
        />
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          activeColor="pink"
          className="absolute top-2.5 right-2.5 z-10"
        />
      </CardImageContainer>

      {/* Content */}
      <div className="text-center space-y-1 my-2 flex-1 flex flex-col justify-center">
        <CategoryLabel
          category="TRADITIONAL WEAR"
          colorScheme="pink"
          align="center"
        />
        <ProductTitle
          title="Jamdani Premium Handloom Saree (1255)"
          lines={1}
          align="center"
          hoverColor="pink"
        />
        <PriceDisplay
          regularPrice={143264}
          discountedPrice={75678}
          colorScheme="pink"
          align="center"
        />
      </div>

      {/* Double Action Buttons */}
      <ActionButtons
        variant="double-stack"
        primaryText="ORDER NOW"
        secondaryText="ADD TO CART"
        colorScheme="pink"
      />
    </div>
  );
};
