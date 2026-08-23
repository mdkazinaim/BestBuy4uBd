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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 sm:mb-10 text-left"
        >
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
            <div className="flex w-max  gap-3 sm:gap-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse w-[200px] sm:w-[240px] h-[220px] sm:h-[260px] p-5 flex flex-col"
                    >
                      <div className="w-3/4 h-6 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
<div className="w-1/2 h-4 bg-gray-200 dark:bg-slate-700 rounded mb-6" />
<div className="mt-auto w-full h-full flex justify-end items-end"><div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700" /></div>
                      
                    </div>
                  ))
                : categories.map((category: any, index: number) => {
                      const { icon: Icon } = getCategoryConfig(category.name);
                      const bgClasses = [
                        "bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-800/10",
                        "bg-gradient-to-br from-purple-50/80 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-800/10",
                        "bg-gradient-to-br from-rose-50/80 to-orange-50/50 dark:from-rose-900/20 dark:to-orange-800/10",
                        "bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-800/10",
                        "bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-800/10"
                      ];
                      const bgClass = bgClasses[index % bgClasses.length];
                      return (
                        <motion.div
                          key={category._id}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          whileHover={{ y: -5 }}
                          onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
                          className={`group cursor-pointer w-[200px] sm:w-[240px] h-[220px] sm:h-[260px] flex-shrink-0 rounded-2xl overflow-hidden relative p-5 ${bgClass} border border-white/50 dark:border-slate-800/50 shadow-sm`}
                        >
                          {/* Image as Background */}
                          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                             {category.image ? (
                               <img
                                 src={category.image}
                                 alt={category.name}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center opacity-20">
                                 <Icon className="w-24 h-24 text-slate-800 dark:text-white" strokeWidth={1} />
                               </div>
                             )}
                          </div>

                          {/* Gradient Overlay for Text Readability */}
                          {category.image && (
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-[5]"></div>
                          )}

                          {/* Text Content */}
                          <div className="relative z-10 flex flex-col h-full">
                            <h3 className={`text-base sm:text-lg font-bold mb-1 line-clamp-2 ${category.image ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                              {category.name}
                            </h3>
                            <p className={`text-xs mb-2 ${category.image ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                              Explore Products
                            </p>
                            <div className="mt-1">
                               <span className={`text-xs sm:text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all ${category.image ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                  Explore <span aria-hidden="true">&rarr;</span>
                               </span>
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
