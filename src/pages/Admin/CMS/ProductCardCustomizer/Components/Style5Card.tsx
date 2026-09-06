import { useState } from "react";
import {
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  ActionButtons,
} from "../Common";

export const Style5Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative w-full h-56 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
        <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-bold text-[10px] w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-xs">
          -53%
        </span>
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={setIsWishlisted}
          activeColor="blue"
          className="absolute top-2.5 right-2.5 z-10"
        />
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80"
          alt="Ab Roller"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="text-center space-y-1 my-2 flex-1 flex flex-col justify-center">
        <CategoryLabel
          category="FITNESS & ACCESSORIES"
          colorScheme="blue"
          align="center"
        />
        <ProductTitle
          title="Automatic Rebound Ab Roller Wheel"
          lines={1}
          align="center"
          hoverColor="blue"
        />
        <PriceDisplay
          regularPrice={4800}
          discountedPrice={2280}
          unitText="/ Pcs"
          colorScheme="blue"
          align="center"
        />
      </div>

      {/* Dual Color Action Stack */}
      <ActionButtons
        variant="double-stack"
        primaryText="অর্ডার করুন"
        secondaryText="কার্ট যোগ"
        colorScheme="emerald"
      />
    </div>
  );
};
