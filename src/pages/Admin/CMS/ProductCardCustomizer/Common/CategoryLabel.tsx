interface CategoryLabelProps {
  category: string;
  align?: "left" | "center";
  colorScheme?: string;
  className?: string;
}

export const CategoryLabel = ({
  category,
  align = "left",
  className = "",
}: CategoryLabelProps) => {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-widest text-secondary ${alignClass} ${className}`}
    >
      {category}
    </div>
  );
};
