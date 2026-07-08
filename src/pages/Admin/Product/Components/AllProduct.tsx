"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { Card } from "@heroui/react";
import {
  Search,
  Grid,
  List,
  Package,
  DollarSign,
  Star,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import TableView from "./TableView";
import CardView from "./CardView";
import { ProductDisplay } from "./types";
import { normalizeProduct } from "./utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/common/Components/Button";
import Pagination from "@/pages/Public/Shop/Components/Pagination";
import { motion } from "framer-motion";

// Popover Select for Category Filter
const CategoryFilterPopover = ({
  categoryFilter,
  onSelect,
  categories,
}: {
  categoryFilter: string;
  onSelect: (val: string) => void;
  categories: string[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 font-medium text-slate-700 dark:text-slate-250 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer text-sm h-9">
          <span className="capitalize">{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="max-h-64 overflow-y-auto no-scrollbar py-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelect(category);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                categoryFilter === category
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Popover Select for Limit Options
const LimitPopover = ({
  limit,
  onSelect,
}: {
  limit: number;
  onSelect: (val: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const options = [10, 20, 30, 50, 100];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 font-medium text-slate-700 dark:text-slate-250 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer text-xs h-8">
          <span>{limit}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-20 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`w-full text-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                limit === opt
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AllProduct = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading, error } = useGetAllProductsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const meta = data?.meta || { page: 1, limit: 12, total: 0, totalPage: 1 };
  const apiProducts = data?.data || [];
  const products: ProductDisplay[] = apiProducts.map(normalizeProduct);

  const categories = [
    "all",
    ...Array.from(
      new Set(products.map((p: ProductDisplay) => p.basicInfo.category))
    ),
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Failed to load products</h3>
        <p className="text-slate-600 dark:text-slate-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Filters and Controls */}
       {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Products</p>
              <h3 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">{meta.total}</h3>
            </div>
            <Package className="w-5 h-5 md:w-8 md:h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Sales</p>
              <h3 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">
                {products.reduce(
                  (acc: number, p: ProductDisplay) => acc + p.sold,
                  0
                )}
              </h3>
            </div>
            <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Rating</p>
              <h3 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">
                {products.length > 0
                  ? (
                      products.reduce(
                        (acc: number, p: ProductDisplay) =>
                          acc + p.rating.average,
                        0
                      ) / products.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
            </div>
            <Star className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 fill-yellow-550" />
          </div>
        </Card>
        <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">On Sale</p>
              <h3 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">
                {
                  products.filter(
                    (p: ProductDisplay) => p.additionalInfo.isOnSale
                  ).length
                }
              </h3>
            </div>
            <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none h-9"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <CategoryFilterPopover
                categoryFilter={categoryFilter}
                onSelect={(val) => {
                  setCategoryFilter(val);
                  setPage(1);
                }}
                categories={categories}
              />
            </div>

            {/* View Toggle */}
            <div className="relative flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 justify-center h-9 p-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`relative z-10 p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center h-7 w-7 ${
                  viewMode === "table"
                    ? "text-slate-800 dark:text-white"
                    : "text-slate-450 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {viewMode === "table" && (
                  <motion.div
                    layoutId="activeViewTab"
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-md -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`relative z-10 p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center h-7 w-7 ${
                  viewMode === "card"
                    ? "text-slate-800 dark:text-white"
                    : "text-slate-450 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {viewMode === "card" && (
                  <motion.div
                    layoutId="activeViewTab"
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-md -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Grid className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

     

      {/* Top Pagination and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-none">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 px-1">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {meta.total} Products
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">SHOW:</span>
            <LimitPopover limit={limit} onSelect={(val) => { setLimit(val); setPage(1); }} />
          </div>
        </div>

        {meta.totalPage > 1 && (
          <div className="w-full sm:w-auto flex justify-center">
            <Pagination
              currentPage={page}
              totalPage={meta.totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Products Display */}
      <div className="min-h-[400px]">
        {products.length > 0 && (
          viewMode === "table" ? (
            <TableView products={products} />
          ) : (
            <CardView products={products} />
          )
        )}
      </div>

      {/* Bottom Pagination */}
      {products.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-none">
          <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 w-full text-center md:text-left px-1">
            Showing {Math.min((page - 1) * limit + 1, meta.total)} - {Math.min(page * limit, meta.total)} of {meta.total}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold uppercase">Rows:</span>
              <LimitPopover limit={limit} onSelect={(val) => { setLimit(val); setPage(1); }} />
            </div>

            {meta.totalPage > 1 && (
              <Pagination
                currentPage={page}
                totalPage={meta.totalPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <Card className="p-8 text-center border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60 mt-4">
          <div className="text-slate-400 mb-4 text-2xl">📦</div>
          <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-105">No products found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchTerm
              ? "No products match your search criteria"
              : "No products available in this category"}
          </p>
          {(searchTerm || categoryFilter !== "all") && (
            <Button
              variant="outline"
              className="mt-4 font-semibold text-xs py-2 px-4"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default AllProduct;
