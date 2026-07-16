import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import VerticalPagination from "./VerticalPagination";
import { ProductData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllProductsQuery } from "../../../../../../store/Api/ProductApi";

const FETCH_LIMIT = 12;
const ITEMS_PER_VIEW = 6;

const mapProductData = (item: any): ProductData => ({
  id: item._id,
  category: item.basicInfo.category,
  title: item.basicInfo.title,
  brand: item.basicInfo.brand,
  price: item.price.discounted || item.price.regular,
  oldPrice: item.price.discounted ? item.price.regular : undefined,
  discount: item.price.discounted
    ? Math.round(
        ((item.price.regular - item.price.discounted) / item.price.regular) *
          100,
      )
    : undefined,
  rating: item.rating?.average || 0,
  reviews: item.rating?.count || 0,
  image: item.images?.[0]?.url || "https://placehold.co/400",
  colors:
    item.variants?.flatMap((v: any) => v.items.map((i: any) => i.value)) || [],
  tag:
    item.stockStatus === "Out of Stock"
      ? "SALE"
      : item.additionalInfo?.isFeatured
        ? "HOT"
        : undefined,
  description: item.basicInfo.description,
  purchases: item.sold || 0,
});

const CategorySection = ({
  category,
  label,
}: {
  category: string;
  label: string;
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({
    category,
    limit: FETCH_LIMIT,
  });

  const products: ProductData[] = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.map(mapProductData);
  }, [productsData]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_VIEW) || 1;

  if (!isLoading && products.length < 2) return null;

  const currentProducts = products.slice(
    currentPage * ITEMS_PER_VIEW,
    (currentPage + 1) * ITEMS_PER_VIEW,
  );

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section className=" relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-700 dark:text-brand-200 mb-2">{label}</h2>
        </div>

        {/* Carousel Content */}
        <div className="relative flex items-center gap-4">
          {/* Left Controls */}
          <div className="hidden md:flex flex-col items-center gap-4 bg-bg-surface dark:bg-slate-900 p-2 rounded-component border border-border-main dark:border-slate-800">
            <button
              onClick={prevPage}
              className="p-1 rounded-full hover:bg-bg-base dark:hover:bg-slate-800 transition-colors"
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="w-5 h-5 text-text-muted dark:text-slate-400" />
            </button>
            <VerticalPagination
              total={totalPages > 0 ? totalPages : 1}
              current={currentPage}
              onChange={setCurrentPage}
            />
            <button
              onClick={nextPage}
              className="p-1 rounded-full hover:bg-bg-base dark:hover:bg-slate-800 transition-colors"
              disabled={totalPages <= 1}
            >
              <ChevronRight className="w-5 h-5 text-text-muted dark:text-slate-400" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-hidden min-h-[360px]">
            <AnimatePresence mode="wait">
              {isLoading || isFetching ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 h-full gap-3 sm:gap-4">
                  {Array.from({ length: ITEMS_PER_VIEW }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface rounded-component p-4 border border-border-main shadow-sm animate-pulse h-[380px]"
                    >
                      <div className="w-full h-48 bg-bg-base rounded-inner mb-4" />
                      <div className="h-4 w-3/4 bg-bg-base rounded mb-2" />
                      <div className="h-4 w-1/2 bg-bg-base rounded mb-4" />
                      <div className="flex justify-between mt-auto">
                        <div className="h-6 w-20 bg-bg-base rounded" />
                        <div className="h-8 w-8 bg-bg-base rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  key={`${category}-${currentPage}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 h-full gap-3 sm:gap-4"
                >
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex flex-col items-center gap-4 bg-bg-surface dark:bg-slate-900 p-2 rounded-component border border-border-main dark:border-slate-800">
            <button
              onClick={prevPage}
              className="p-1 rounded-full hover:bg-bg-base dark:hover:bg-slate-800 transition-colors"
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="w-5 h-5 text-text-muted dark:text-slate-400" />
            </button>
            <VerticalPagination
              total={totalPages > 0 ? totalPages : 1}
              current={currentPage}
              onChange={setCurrentPage}
            />
            <button
              onClick={nextPage}
              className="p-1 rounded-full hover:bg-bg-base dark:hover:bg-slate-800 transition-colors"
              disabled={totalPages <= 1}
            >
              <ChevronRight className="w-5 h-5 text-text-muted dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile controls */}
        {totalPages > 1 && (
          <div className="md:hidden flex justify-center mt-8 pb-4">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[28px] py-2.5 px-4 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 w-fit select-none ">
              {/* Previous Slide (Left Chevron) */}
              <button
                onClick={prevPage}
                className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center p-0.5"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots List */}
              <div className="flex gap-2.5 py-1 items-center">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className="relative flex items-center justify-center cursor-pointer w-7 h-7 transition-all duration-300"
                  >
                    {idx === currentPage ? (
                      <div className="w-7 h-7 rounded-full border border-emerald-500 flex items-center justify-center bg-emerald-500/10">
                        <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse" />
                      </div>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700 hover:bg-slate-500 transition-colors" />
                    )}
                  </button>
                ))}
              </div>

              {/* Next Slide (Right Chevron) */}
              <button
                onClick={nextPage}
                className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center p-0.5"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
