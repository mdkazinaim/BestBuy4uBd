import React, { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { Product } from "@/types/Product/Product";

interface VariantImageGalleryProps {
  product: Product;
}

interface ImageItem {
  url: string;
  alt: string;
  type: "product" | "variant";
  group?: string;
  value?: string;
}

const VariantImageGallery: React.FC<VariantImageGalleryProps> = ({ product }) => {
  // Collect all product images
  const productImages: ImageItem[] = product?.images?.map(img => ({
    url: img.url,
    alt: img.alt || product.basicInfo.title,
    type: "product" as const
  })) || [];

  // Collect all variant images (flattened)
  const variantImages: ImageItem[] = [];
  product?.variants?.forEach(variantGroup => {
    variantGroup.items.forEach(variant => {
      if (variant.image?.url) {
        variantImages.push({
          url: variant.image.url,
          alt: variant.image.alt || variant.value,
          type: "variant" as const,
          group: variantGroup.group,
          value: variant.value
        });
      }
    });
  });

  // Merge and deduplicate by url
  const allImages = [...productImages, ...variantImages].filter(
    (img, idx, arr) => arr.findIndex(i => i.url === img.url) === idx
  );

  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [currentSlider, setCurrentSlider] = useState(0);

  const prevSlider = useCallback(() => {
    setCurrentSlider((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const nextSlider = useCallback(() => {
    setCurrentSlider((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  useEffect(() => {
    const intervalId = setInterval(nextSlider, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlider]);

  if (allImages.length === 0) return null;

  return (
    <div className="mb-8 ">
      <h3 className="text-md font-semibold text-gray-900 mb-2">ভেরিয়েন্ট ও প্রোডাক্ট ইমেজ গ্যালারি</h3>
      <div className={`relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[522px] overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Carousel container */}
        <div
          className="flex transition-transform duration-500 ease-linear h-full"
          style={{ transform: `translateX(-${currentSlider * 100}%)` }}
        >
          {allImages.map((img, idx) => (
            <div key={img.url + idx} className="min-w-full h-full flex flex-col items-center justify-center relative">
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-fit"
              />
              {img.type === "variant" && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-xl">
                  {img.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlider}
          className={`absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-black/30 text-white'} p-1 sm:p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-black/50'} transition text-sm sm:text-base`}
        >
          &#10094;
        </button>
        <button
          onClick={nextSlider}
          className={`absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-black/30 text-white'} p-1 sm:p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-black/50'} transition text-sm sm:text-base`}
        >
          &#10095;
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlider(idx)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                currentSlider === idx 
                  ? (isDarkMode ? "bg-gray-300 w-4 sm:w-8" : "bg-white w-4 sm:w-8")
                  : (isDarkMode ? "bg-gray-600" : "bg-white/50")
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariantImageGallery;
