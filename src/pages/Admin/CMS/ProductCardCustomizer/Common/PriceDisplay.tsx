interface PriceDisplayProps {
  regularPrice: number;
  discountedPrice?: number;
  currencySymbol?: string;
  unitText?: string;
  align?: "left" | "center";
  colorScheme?: string;
  className?: string;
}

export const PriceDisplay = ({
  regularPrice,
  discountedPrice,
  currencySymbol = "৳",
  unitText,
  align = "left",
  className = "",
}: PriceDisplayProps) => {
  const alignClass = align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex items-center gap-1.5 font-bold ${alignClass} ${className}`}>
      {discountedPrice ? (
        <>
          <span className="text-xs text-slate-400 line-through font-normal">
            {currencySymbol}
            {regularPrice.toLocaleString()}
          </span>
          <span className="text-base font-bold text-secondary">
            {currencySymbol}
            {discountedPrice.toLocaleString()}
          </span>
        </>
      ) : (
        <span className="text-base font-bold text-secondary">
          {currencySymbol}
          {regularPrice.toLocaleString()}
        </span>
      )}
      {unitText && (
        <span className="text-slate-400 font-normal text-[10px]">{unitText}</span>
      )}
    </div>
  );
};
