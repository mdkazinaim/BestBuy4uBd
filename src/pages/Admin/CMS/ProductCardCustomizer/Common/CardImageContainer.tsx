import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface CardImageContainerProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  objectFit?: "cover" | "contain";
  heightClass?: string;
  bgClass?: string;
  roundedClass?: string;
  children?: React.ReactNode;
  className?: string;
}

export const CardImageContainer = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  objectFit = "cover",
  heightClass = "h-56",
  bgClass = "bg-slate-100 dark:bg-slate-800/80",
  roundedClass = "rounded-lg",
  children,
  className = "",
}: CardImageContainerProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const fitClass = objectFit === "contain" ? "object-contain h-[85%]" : "object-cover h-full w-full";

  return (
    <div
      className={`relative w-full overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-800 ${heightClass} ${bgClass} ${roundedClass} ${className}`}
    >
      {children}

      {!hasError ? (
        <img
          src={imgSrc}
          onError={() => {
            if (imgSrc !== fallbackSrc) {
              setImgSrc(fallbackSrc);
            } else {
              setHasError(true);
            }
          }}
          alt={alt}
          className={`${fitClass} transition-transform duration-700 group-hover:scale-105 ${roundedClass}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5 p-4 text-center">
          <ImageIcon className="w-8 h-8 opacity-60" />
          <span className="text-[10px] font-medium leading-tight">Product Image</span>
        </div>
      )}
    </div>
  );
};
