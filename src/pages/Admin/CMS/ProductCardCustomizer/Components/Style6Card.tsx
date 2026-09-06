import { useState } from "react";
import { Shuffle, Search, Heart } from "lucide-react";
import {
  CardBadge,
  ProductTitle,
  PriceDisplay,
  ActionButtons,
} from "../Common";

export const Style6Card = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2">
      {/* Top Image Container */}
      <div className="relative w-full h-[280px] bg-[#f8f8f8] dark:bg-slate-950 rounded-md overflow-hidden flex items-center justify-center shrink-0">
        <CardBadge
          text="-20%"
          colorScheme="red"
          className="absolute top-2.5 left-2.5 z-10"
        />

        {/* Right side floating action stack */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-md divide-y divide-slate-100 dark:divide-slate-800">
          <button className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted ? "text-red-500" : "text-slate-600 dark:text-slate-300 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Headphone Product Image */}
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
          alt="Exacitation ulamco laboris"
          className="h-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Coral/Red hover banner bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <ActionButtons
            variant="single-full"
            primaryText="ADD TO CART"
            colorScheme="red"
            className="rounded-none py-2.5"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 pb-1 text-center flex-1 flex flex-col justify-between">
        <div>
          <ProductTitle
            title="Exacitation ulamco laboris"
            lines={1}
            align="center"
            hoverColor="none"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Marketplace
          </p>
        </div>

        <PriceDisplay
          regularPrice={319}
          discountedPrice={255}
          currencySymbol="$"
          colorScheme="red"
          align="center"
          className="mt-2"
        />
      </div>
    </div>
  );
};
