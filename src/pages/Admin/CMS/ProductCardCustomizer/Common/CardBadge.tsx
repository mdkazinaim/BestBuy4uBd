interface CardBadgeProps {
  text: string;
  variant?: "pill" | "rect" | "circle" | "top-banner";
  colorScheme?: string;
  className?: string;
}

export const CardBadge = ({
  text,
  variant = "rect",
  className = "",
}: CardBadgeProps) => {
  // Use theme CSS variable classes (--color-secondary / --color-primary / brand) instead of hardcoded themes
  const themeBadgeClasses = "bg-secondary text-white shadow-xs";

  if (variant === "circle") {
    return (
      <span
        className={`font-bold text-[10px] w-10 h-10 rounded-full flex flex-col items-center justify-center text-center leading-tight ${themeBadgeClasses} ${className}`}
      >
        {text}
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <span
        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center justify-center text-center ${themeBadgeClasses} ${className}`}
      >
        {text}
      </span>
    );
  }

  if (variant === "top-banner") {
    return (
      <div
        className={`w-full text-center text-[11px] font-bold py-1 px-3 uppercase tracking-wider flex items-center justify-center ${themeBadgeClasses} ${className}`}
      >
        {text}
      </div>
    );
  }

  return (
    <span
      className={`font-bold text-[10px] px-2 py-0.5 rounded-xs flex items-center justify-center text-center ${themeBadgeClasses} ${className}`}
    >
      {text}
    </span>
  );
};
