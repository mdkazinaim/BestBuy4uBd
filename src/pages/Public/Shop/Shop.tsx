import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { useTracking } from "@/hooks/useTracking";
import { useGetAllCategoriesQuery } from "@/store/Api/CategoriesApi";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "./Components/ProductCard";
import FilterSidebar from "./Components/FilterSidebar";
import Pagination from "./Components/Pagination";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/common/Components/Button";

const Shop = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: Number(searchParams.get("minPrice")) || 0,
      maxPrice: Number(searchParams.get("maxPrice")) || 20000,
      sort: searchParams.get("sort") || "-createdAt",
      stockStatus: searchParams.get("stockStatus") || "",
      rating: Number(searchParams.get("rating")) || 0,
    }),
    [searchParams],
  );

  const handleUpdateFilters = (updater: any) => {
    const nextFilters =
      typeof updater === "function" ? updater(activeFilters) : updater;
    const params: Record<string, string> = {};

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        // Only include non-zeros for these specific keys to keep URL clean
        if ((key === "minPrice" || key === "rating") && value === 0) return;
        if (key === "limit" && value === 12) return;
        if (key === "page" && value === 1) return;
        if (key === "maxPrice" && value === 20000) return;

        params[key] = String(value);
      }
    });

    setSearchParams(params, { replace: true });
  };

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery(activeFilters);
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const { trackViewItemList } = useTracking();

  useEffect(() => {
    if (productsData?.data) {
      trackViewItemList(
        productsData.data.map((product) => ({
          id: product._id,
          name: product.basicInfo.title,
          price: product.price.discounted || product.price.regular,
          category: product.basicInfo.category,
          list_name: "Shop Page",
          list_id: "shop_page",
        })),
      );
    }
  }, [productsData, trackViewItemList]);

  const handlePageChange = (page: number) => {
    handleUpdateFilters((prev: any) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-bg-base py-12 font-nunito">
      <CommonWrapper>
        <div className="flex flex-col lg:flex-row gap-6 px-4">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="outline"
              className="flex items-center gap-2 px-5 py-3 bg-bg-surface border border-border-main text-xs uppercase tracking-widest text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4 text-secondary" />
              Filters
            </Button>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {productsData?.meta?.total || 0} Products
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-48 h-fit">
            <div className="bg-bg-surface p-8 rounded-xl border border-border-main">
              <FilterSidebar
                categories={categoriesData?.data || []}
                filters={activeFilters}
                setFilters={handleUpdateFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar Slider */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 250 }}
                  className="fixed top-0 left-0 h-full w-full max-w-md bg-bg-surface z-[101] p-8 overflow-y-auto lg:hidden rounded-r-xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-text-primary uppercase tracking-tighter">
                      FILTERS
                    </h2>
                    <Button
                      onClick={() => setIsSidebarOpen(false)}
                      variant="ghost"
                      size="icon"
                      roundedFull
                      className="bg-bg-base border border-border-main text-text-muted"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <FilterSidebar
                    categories={categoriesData?.data || []}
                    filters={activeFilters}
                    setFilters={handleUpdateFilters}
                  />
                  <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4 bg-gradient-to-t from-bg-surface via-bg-surface to-transparent">
                    <Button
                      onClick={() => setIsSidebarOpen(false)}
                      variant="primary"
                      className="w-full py-4 text-xs font-semibold uppercase tracking-widest"
                    >
                      Show Results
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            {/* <div className="bg-bg-surface px-8 py-6 rounded-xl border border-border-main shadow-sm flex items-center justify-between transition-all">
              <div className="flex items-center gap-10">
                <div className="hidden md:block text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em]">
                  {(activeFilters.page - 1) * activeFilters.limit + 1}-
                  {Math.min(
                    activeFilters.page * activeFilters.limit,
                    productsData?.meta?.total || 0,
                  )}{" "}
                  of {productsData?.meta?.total || 0} ITEMS
                </div>
                <div className="flex items-center bg-bg-base p-1.5 rounded-xl border border-border-main">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2.5 rounded-inner transition-all duration-300 ${
                      viewType === "grid"
                        ? "bg-bg-surface text-secondary shadow-sm scale-110"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-2.5 rounded-inner transition-all duration-300 ${
                      viewType === "list"
                        ? "bg-bg-surface text-secondary shadow-sm scale-110"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] md:hidden font-semibold uppercase tracking-widest text-text-muted">
                {productsData?.meta?.total || 0} Items
              </div>
            </div> */}

            {/* Top Pagination Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 h-18">
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em]">
                PAGES{" "}
                <span className="text-secondary mx-2 font-semibold">
                  {activeFilters.page}
                </span>{" "}
                / {productsData?.meta?.totalPage || 1}
              </div>
              <Pagination
                currentPage={activeFilters.page}
                totalPage={productsData?.meta?.totalPage || 1}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Product Grid */}
            <div
              className={`relative ${
                isFetching ? "opacity-60 grayscale-[0.5]" : "opacity-100"
              } transition-all duration-500`}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="group relative card-container p-2 h-full min-h-[460px] flex flex-col rounded-xl border border-gray-200 dark:border-slate-800/60 bg-bg-surface animate-pulse"
                    >
                      {/* Image container skeleton */}
                      <div className="w-full h-56 bg-gray-100 dark:bg-slate-800/50 rounded-t-xl mb-4" />
                      
                      {/* Content skeleton */}
                      <div className="flex-1 flex flex-col p-3">
                        {/* Category */}
                        <div className="h-3 w-1/4 bg-gray-200 dark:bg-slate-800 rounded mb-2" />
                        {/* Title */}
                        <div className="h-4 w-11/12 bg-gray-200 dark:bg-slate-800 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-800 rounded mb-4" />
                        
                        {/* Price & Stock */}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="h-5 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
                          <div className="h-5 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                        </div>
                        
                        {/* Buttons */}
                        <div className="mt-4 flex gap-2 w-full">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : productsData?.data && productsData.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsData.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 bg-bg-surface rounded-xl border-2 border-dashed border-border-main"
                >
                  <div className="w-24 h-24 bg-bg-base rounded-full flex items-center justify-center mb-8 border border-border-main">
                    <Search className="w-12 h-12 text-text-muted/30" />
                  </div>
                  <h2 className="text-3xl font-semibold text-text-primary mb-3 tracking-tighter uppercase">
                    EMPTY SEARCH
                  </h2>
                  <p className="text-text-muted font-medium uppercase tracking-widest text-[10px] mb-10">
                    We couldn't find any items matching your filters
                  </p>
                  <Button
                    onClick={() =>
                      handleUpdateFilters({
                        ...activeFilters,
                        search: "",
                        category: "",
                        minPrice: 0,
                        maxPrice: 100000,
                        stockStatus: "",
                        rating: 0,
                      })
                    }
                    variant="primary"
                    className="px-12 py-4 font-semibold uppercase tracking-widest text-xs"
                  >
                    Clear Selection
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border-main to-transparent" />
              <Pagination
                currentPage={activeFilters.page}
                totalPage={productsData?.meta?.totalPage || 1}
                onPageChange={handlePageChange}
              />
             
            </div>
          </main>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default Shop;
