interface StockBadgeProps {
  status: string;
  className?: string;
}

export const StockBadge = ({ status, className = "" }: StockBadgeProps) => {
  const isAvailable = status === "In Stock";
  const isPreorder = status === "Pre-order";

  const colorClasses = isAvailable
    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    : isPreorder
    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};
