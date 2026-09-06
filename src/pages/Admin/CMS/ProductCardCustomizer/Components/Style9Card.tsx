import {
  CardBadge,
  ProductTitle,
  PriceDisplay,
} from "../Common";

export const Style9Card = () => {
  return (
    <div className="group relative w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Full height upper image container */}
      <div className="relative w-full h-[360px] bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0">
        <CardBadge
          text="-12%"
          colorScheme="red"
          className="absolute top-3 left-3 z-10"
        />

        <img
          src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"
          alt="Bamboo JACQUARD Shirt S060"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Clean bottom text bar */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
        <ProductTitle
          title="Bamboo JACQUARD Shirt S060"
          lines={1}
          hoverColor="none"
        />

        <PriceDisplay
          regularPrice={2250}
          discountedPrice={1990}
          colorScheme="red"
          className="mt-1"
        />
      </div>
    </div>
  );
};
