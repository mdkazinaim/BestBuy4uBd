import { ShoppingBag } from "lucide-react";
import {
  CardBadge,
  ProductTitle,
  PriceDisplay,
} from "../Common";

export const Style8Card = () => {
  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2">
      {/* Top Image Container */}
      <div className="relative w-full h-[290px] bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden shrink-0">
        <CardBadge
          text="Bridal Combo (Pack of 3 Pcs)"
          variant="top-banner"
          colorScheme="dark-blue"
          className="absolute top-0 left-0 right-0 z-10"
        />

        <CardBadge
          text="-47%"
          variant="circle"
          colorScheme="orange"
          className="absolute top-7 left-3 z-10 !w-10 !h-10"
        />

        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80"
          alt="3-in-1 Bridal Shower Set"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <ProductTitle
          title="3-in-1 Bridal Shower Set – Includes 'Bride To Be' Sash, Metallic Bridal"
          hoverColor="none"
        />

        <div className="flex items-center justify-between pt-2 mt-auto">
          <PriceDisplay
            regularPrice={1160}
            discountedPrice={611}
            colorScheme="orange"
          />

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>3 Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
};
