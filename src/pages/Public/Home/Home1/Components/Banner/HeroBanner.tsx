import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTracking } from "@/hooks/useTracking";

interface HeroBannerProps {
  banners: BannerData[];
}

const HeroBanner = ({ banners }: HeroBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { trackSelectPromotion } = useTracking();

  useEffect(() => {
    // trackViewPromotion removed as per request
  }, [currentSlide, banners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const data = banners[currentSlide];

  const getPositionClasses = (position: string = "center") => {
    switch (position) {
      case "top-left":
        return "justify-start items-start";
      case "top-right":
        return "justify-end items-start";
      case "bottom-left":
        return "justify-start items-end";
      case "bottom-right":
        return "justify-end items-end";
      case "center":
      default:
        return "justify-center items-center text-center";
    }
  };

  const positionClasses = getPositionClasses(data.textPosition);

  return (
    <div
      className={`relative ${data.bgColor || "bg-bg-base"
        } rounded-container overflow-hidden h-full min-h-[400px] flex items-center transition-colors duration-500 rounded-xl`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full absolute inset-0 flex items-center"
        >
          {/* Content Container */}
          <div className={`absolute inset-0 z-10 p-8 md:p-16 flex ${positionClasses}`}>
            <div className="max-w-xl">
              {/* Subtitle */}
              {data.subtitle && (
                <h3
                  className="font-semibold opacity-90 mb-4 uppercase tracking-widest"
                  style={{ 
                    color: data.textColor || "inherit",
                    fontSize: data.subtitleSize || "inherit"
                  }}
                >
                  {data.subtitle}
                </h3>
              )}

              {/* Title */}
              {data.title && data.showTitle !== false && (
                <h2
                  className="h2 mb-4 leading-[1.1] uppercase tracking-tighter"
                  style={{ 
                    color: data.textColor || "inherit",
                    fontSize: data.titleSize || "inherit"
                  }}
                >
                  {data.title}
                </h2>
              )}

              {/* Description */}
              {data.description && (
                <p
                  className="text-base font-medium opacity-70 mb-10 uppercase tracking-[0.15em] leading-relaxed line-clamp-2"
                  style={{ color: data.textColor || "inherit" }}
                >
                  {data.description}
                </p>
              )}

              {/* CTA Button */}
              {data.ctaLink && data.showButton !== false && (
                <motion.a
                  href={data.ctaLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackSelectPromotion({
                      id: data.id,
                      name: data.title || "Hero Banner",
                      creative_name: "hero_banner",
                      creative_slot: `slot_${currentSlide + 1}`,
                      location_id: "home_hero",
                    });
                  }}
                  style={{
                    backgroundColor: data.buttonColor || "#FFFFFF",
                    color: data.buttonTextColor || "#000000",
                  }}
                  className="inline-block px-10 py-4 rounded-component font-semibold shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300 no-underline uppercase tracking-widest text-xs"
                >
                  {data.ctaText || "Shop Now"}
                </motion.a>
              )}
            </div>
          </div>

          {/* Product Image (Right side) */}
          <div className="absolute right-0 top-0 bottom-0 w-full h-full flex items-center justify-center pointer-events-none opacity-40 md:opacity-100">
            <div className="relative w-full h-full flex items-center justify-center ">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-full w-full object-cover drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination / Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 right-8 bg-bg-surface/80 backdrop-blur-md rounded-component p-2 border border-border-main shadow-2xl flex items-center gap-4 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 hover:bg-bg-base rounded-inner transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <span className="text-xs font-semibold text-text-primary uppercase tracking-widest">
            {currentSlide + 1} <span className="text-text-muted mx-1">/</span> {banners.length}
          </span>
          <button
            onClick={nextSlide}
            className="w-10 h-10 hover:bg-bg-base rounded-inner transition-colors flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
