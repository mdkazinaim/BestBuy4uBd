interface ProductTitleProps {
  title: string;
  lines?: 0 | 1 | 2 | 3;
  align?: "left" | "center";
  hoverColor?: string;
  className?: string;
}

export const ProductTitle = ({
  title,
  lines = 2,
  align = "left",
  className = "",
}: ProductTitleProps) => {
  const lineClampClass =
    lines === 1
      ? "line-clamp-1"
      : lines === 2
      ? "line-clamp-2"
      : lines === 3
      ? "line-clamp-3"
      : "line-clamp-none";
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <h3
      title={title}
      className={`text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-secondary leading-snug transition-colors ${lineClampClass} ${alignClass} ${className}`}
    >
      {title}
    </h3>
  );
};
