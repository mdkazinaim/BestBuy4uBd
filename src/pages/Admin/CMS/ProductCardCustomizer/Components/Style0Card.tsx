import { useState } from "react";
import {
  CardBadge,
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  StockBadge,
  ActionButtons,
  CardImageContainer,
} from "../Common";

interface Style0CardProps {
  sampleProduct: {
    _id: string;
    basicInfo: { title: string; category: string };
    price: { regular: number; discounted: number };
    images: { url: string }[];
    stockStatus: string;
  };
}

export const Style0Card = ({ sampleProduct }: Style0CardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercentage = sampleProduct.price.discounted
    ? Math.round(
        ((sampleProduct.price.regular - sampleProduct.price.discounted) /
          sampleProduct.price.regular) *
          100
      )
    : 0;

  return (
    <div className="group relative card-container p-2.5 w-full h-full flex flex-col bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-300 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Reusable Image Container with Badges & Wishlist Overlay */}
      <CardImageContainer
        src={sampleProduct.images[0]?.url}
        alt={sampleProduct.basicInfo.title}
        heightClass="h-56"
        roundedClass="rounded-t-xl"
      >
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {discountPercentage > 0 && (
            <CardBadge text={`${discountPercentage}% OFF`} colorScheme="emerald" />
          )}
          <CardBadge text="Featured" colorScheme="blue" />
        </div>
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          className="absolute top-4 right-4 z-10"
        />
      </CardImageContainer>

      {/* Content */}
      <div className="flex-1 flex flex-col p-2.5 rounded-b-xl justify-between">
        <div>
          <CategoryLabel
            category={sampleProduct.basicInfo.category}
            colorScheme="blue"
            className="mb-1"
          />
          <ProductTitle
            title={sampleProduct.basicInfo.title}
            hoverColor="blue"
          />
        </div>

        <div className="pt-2 flex items-center justify-between gap-1.5 mt-auto">
          <PriceDisplay
            regularPrice={sampleProduct.price.regular}
            discountedPrice={sampleProduct.price.discounted}
            colorScheme="blue"
          />
          <StockBadge status={sampleProduct.stockStatus} />
        </div>

        {/* Action Buttons */}
        <div className="mt-3">
          <ActionButtons variant="eye-order" colorScheme="blue" />
        </div>
      </div>
    </div>
  );
};
