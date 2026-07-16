import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tv,
  Speaker,
  Tablet,
  Printer,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../../../../../store/Api/CategoriesApi";

// Mapping for category icons and colors based on name keywords
const categoryConfig: Record<string, { icon: any; color: string }> = {
  smartphone: { icon: Smartphone, color: "from-primary-blue to-primary-cyan" },
  mobile: { icon: Smartphone, color: "from-primary-blue to-primary-cyan" },
  laptop: { icon: Laptop, color: "from-primary-purple to-primary-purple-new" },
  computer: {
    icon: Laptop,
    color: "from-primary-purple to-primary-purple-new",
  },
  audio: { icon: Headphones, color: "from-primary-green to-primary-cyan" },
  headphone: { icon: Headphones, color: "from-primary-green to-primary-cyan" },
  wearable: { icon: Watch, color: "from-primary-orange to-primary-yellow" },
  watch: { icon: Watch, color: "from-primary-orange to-primary-yellow" },
  camera: { icon: Camera, color: "from-primary-red to-primary-orange" },
  gaming: { icon: Gamepad2, color: "from-primary-purple-new to-primary-cyan" },
  game: { icon: Gamepad2, color: "from-primary-purple-new to-primary-cyan" },
  tv: { icon: Tv, color: "from-blue-500 to-indigo-500" },
  television: { icon: Tv, color: "from-blue-500 to-indigo-500" },
  speaker: { icon: Speaker, color: "from-emerald-400 to-teal-500" },
  tablet: { icon: Tablet, color: "from-pink-500 to-rose-500" },
  printer: { icon: Printer, color: "from-gray-600 to-gray-800" },
};

const getDefaultConfig = () => ({
  icon: ShoppingBag,
  color: "from-blue-400 to-indigo-500",
});

const getCategoryConfig = (name: string) => {
  const normalizedName = name.toLowerCase();
  for (const key in categoryConfig) {
    if (normalizedName.includes(key)) {
      return categoryConfig[key];
    }
  }
  return getDefaultConfig();
};

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery({});
  const categories = categoriesData?.data || [];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = 300;
      const halfWidth = (scrollWidth - 24) / 2; // Subtracting gap/padding adjustments

      if (direction === "right") {
        if (scrollLeft + clientWidth >= scrollWidth - 50) {
          // If at the very end, jump back to start of second half
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      } else {
        if (scrollLeft <= 50) {
          // If at the very start, jump to middle
          scrollRef.current.scrollLeft = halfWidth;
        } else {
          scrollRef.current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }
  };

  if (isError) {
    return null; // Or handle error gracefully
  }

  return (
    <section className="">
      <div className="container mx-auto px-4 mt-4 sm:mt-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-700 dark:text-brand-200 mb-4 text-center">
            Shop by Category
          </h2>
        </motion.div>

        {/* Categories Carousel Container */}
        <div className="relative group/carousel">
          {/* Navigation Buttons */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute top-1/2 -translate-y-1/2 z-20 bg-brand-500 shadow-md p-1.5 rounded opacity-0 group-hover/carousel:opacity-100 transition-opacity -left-4 hidden md:flex items-center justify-center hover:bg-brand-600"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>

          <button
            onClick={() => handleScroll("right")}
            className="absolute top-1/2 -translate-y-1/2 z-20 bg-brand-500 shadow-md p-1.5 rounded opacity-0 group-hover/carousel:opacity-100 transition-opacity -right-4 hidden md:flex items-center justify-center hover:bg-brand-600"
          >
            <ChevronRight size={18} className="text-white" />
          </button>

          {/* Scrolling Area */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar relative pause-on-hover scroll-smooth"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 1%, black 99%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 1%, black 99%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee gap-3 sm:gap-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-100 shadow-sm animate-pulse w-[130px] sm:w-[180px] aspect-[1/1.1] p-2 sm:p-4 flex flex-col items-center justify-center"
                    >
                      <div className="w-24 h-24 rounded bg-gray-50 mb-6" />
                      <div className="w-full h-8 bg-gray-100 rounded" />
                    </div>
                  ))
                : [...categories, ...categories].map(
                    (category: any, index: number) => {
                      const { icon: Icon } = getCategoryConfig(category.name);
                      return (
                        <motion.div
                          key={`${category._id}-${index}`}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          whileHover={{
                            y: -5,
                          }}
                          onClick={() =>
                            navigate(
                              `/shop?category=${encodeURIComponent(category.name)}`,
                            )
                          }
                          className="group cursor-pointer w-[130px] sm:w-[180px] flex-shrink-0 rounded-lg overflow-hidden"
                        >
                          {/* Simple Brand Card */}
                          <div className="relative bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col items-center justify-center">
                            {/* Image/Icon Container */}
                            <div className="w-full aspect-square flex items-center justify-center">
                              {category.image ? (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="size-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                                  <Icon
                                    className="w-8 h-8 text-gray-400 dark:text-slate-500"
                                    strokeWidth={1.5}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Pill Label at Bottom */}
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="bg-brand-500 group-hover:bg-brand-600/80 transition-colors py-1.5 px-2 rounded flex items-center justify-center">
                                <h3 className="text-[11px] font-normal sm:font-medium text-white uppercase tracking-wider text-center truncate">
                                  {category.name}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    },
                  )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
