import { motion } from "framer-motion";
import { useGetAllBannersQuery } from "@/store/Api/BannerApi";
import { useMemo } from "react";

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

const PromotionalSection = () => {
  const { data: bannerResponse } = useGetAllBannersQuery();

  const promoBanner = useMemo(() => {
    const banners = bannerResponse?.data || [];
    const banner = banners.find((b: any) => b.type === "promotional");
    if (!banner) return null;

    return {
      id: banner._id,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.buttonText || "Shop Now",
      ctaLink: banner.link || "#",
      image: banner.image,
      textColor: banner.textColor || "#000000",
      buttonColor: banner.buttonBgColor || "#000000",
      buttonTextColor: banner.buttonTextColor || "#FFFFFF",
      textPosition: banner.textPosition || "center",
      titleSize: banner.titleSize,
      subtitleSize: banner.subtitleSize,
      showButton: banner.showButton !== undefined ? banner.showButton : true,
      showTitle: banner.showTitle !== undefined ? banner.showTitle : true,
    };
  }, [bannerResponse]);

  if (!promoBanner) return null;

  const positionClasses = getPositionClasses(promoBanner.textPosition);

  return (
    <section className="container mx-auto px-4 rounded-container">
      <div className="relative w-full aspect-[3/2] sm:aspect-[16/6] min-h-[220px] sm:min-h-0 rounded-container overflow-hidden group rounded-xl">
        {/* Background Image */}
        <img
          src={promoBanner.image}
          alt={promoBanner.title || "Promotion"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay Content Container */}
        <div className={`absolute inset-0 p-4 sm:p-8 md:p-16 flex ${positionClasses}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="z-10 max-w-xl"
            style={{ color: promoBanner.textColor }}
          >
            {promoBanner.subtitle && (
              <span
                className="block font-bold uppercase tracking-[0.3em] mb-2 sm:mb-4 opacity-80"
                style={{ fontSize: promoBanner.subtitleSize || "0.875rem" }}
              >
                {promoBanner.subtitle}
              </span>
            )}

            {promoBanner.title && promoBanner.showTitle !== false && (
              <h2
                className="font-black mb-3 sm:mb-6 leading-[1.1] uppercase tracking-tighter text-xl sm:text-3xl lg:text-4xl"
                style={{ fontSize: promoBanner.titleSize || "inherit" }}
              >
                {promoBanner.title}
              </h2>
            )}

            {promoBanner.description && (
              <p className="text-xs sm:text-base lg:text-lg font-medium opacity-70 mb-4 sm:mb-10 leading-relaxed uppercase tracking-widest line-clamp-2">
                {promoBanner.description}
              </p>
            )}

            {promoBanner.showButton && (
              <motion.a
                href={promoBanner.ctaLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: promoBanner.buttonColor,
                  color: promoBanner.buttonTextColor,
                }}
                className="inline-block px-6 py-2.5 sm:px-10 sm:py-4 rounded-component font-bold shadow-xl hover:shadow-2xl transition-all duration-300 no-underline uppercase tracking-widest text-[10px] sm:text-xs"
              >
                {promoBanner.ctaText}
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;
