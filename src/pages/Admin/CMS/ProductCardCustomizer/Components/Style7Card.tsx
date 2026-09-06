import {
  CardBadge,
  ProductTitle,
  PriceDisplay,
} from "../Common";

export const Style7Card = () => {
  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2">
      {/* Top Image Container */}
      <div className="relative w-full h-[290px] bg-[#f9f9f9] dark:bg-slate-950 rounded-md overflow-hidden flex items-center justify-center shrink-0">
        <CardBadge
          text="-19%"
          variant="circle"
          colorScheme="red"
          className="absolute top-3 left-3 z-10"
        />
        <img
          src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80"
          alt="Adipiscing consectetur elit"
          className="h-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="pt-3 pb-1 text-center flex-1 flex flex-col justify-between">
        <div>
          <ProductTitle
            title="Adipiscing consectetur elit"
            lines={1}
            align="center"
            hoverColor="none"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Marketplace
          </p>
        </div>

        <PriceDisplay
          regularPrice={269}
          discountedPrice={219}
          currencySymbol="$"
          colorScheme="red"
          align="center"
          className="mt-2"
        />
      </div>
    </div>
  );
};
