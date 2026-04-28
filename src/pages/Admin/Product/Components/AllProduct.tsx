"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";
import {
  Search,
  Grid,
  List,
  Package,
  DollarSign,
  TrendingDown,
  Star,
} from "lucide-react";
import TableView from "./TableView";
import CardView from "./CardView";
import { ProductDisplay } from "./types";
import { normalizeProduct } from "./utils";

const AllProduct = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading, error } = useGetAllProductsQuery({
    page,
    limit,
  });

  // Extract meta data
  const meta = data?.meta || { page: 1, limit: 12, total: 0, totalPage: 1 };
  const apiProducts = data?.data || [];
  // Normalize products for display
  const products: ProductDisplay[] = apiProducts.map(normalizeProduct);

  // Get unique categories for filter
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
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      {/* Filters and Controls */}
      <Card className="p-2 md:p-4 mb-4 shadow-sm border-none bg-gray-50/50">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={handleSearch}
              size="sm"
              className="w-full"
              variant="bordered"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 shrink-0">
            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <Select
                aria-label="Category"
                placeholder="Category"
                selectedKeys={[categoryFilter]}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                size="sm"
                variant="bordered"
              >
                {categories.map((category) => (
                  <SelectItem key={category} textValue={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 justify-center">
              <Button
                isIconOnly
                variant={viewMode === "table" ? "flat" : "light"}
                onClick={() => setViewMode("table")}
                size="sm"
                color={viewMode === "table" ? "primary" : "default"}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === "card" ? "flat" : "light"}
                onClick={() => setViewMode("card")}
                size="sm"
                color={viewMode === "card" ? "primary" : "default"}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase">Products</p>
              <h3 className="text-lg md:text-2xl font-bold">{meta.total}</h3>
            </div>
            <Package className="w-5 h-5 md:w-8 md:h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase">Sales</p>
              <h3 className="text-lg md:text-2xl font-bold">
                {products.reduce(
                  (acc: number, p: ProductDisplay) => acc + p.sold,
                  0
                )}
              </h3>
            </div>
            <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase">Rating</p>
              <h3 className="text-lg md:text-2xl font-bold">
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
            <Star className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
          </div>
        </Card>
        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase">On Sale</p>
              <h3 className="text-lg md:text-2xl font-bold">
                {
                  products.filter(
                    (p: ProductDisplay) => p.additionalInfo.isOnSale
                  ).length
                }
              </h3>
            </div>
            <TrendingDown className="w-5 h-5 md:w-8 md:h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Top Pagination and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 mb-4 md:mb-6 bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 px-1">
          <span className="text-sm font-medium text-gray-500">
            {meta.total} Products
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold hidden xs:block">SHOW:</span>
            <Select
              size="sm"
              className="w-20"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {meta.totalPage > 1 && (
          <div className="w-full sm:w-auto flex justify-center">
            <Pagination
              total={meta.totalPage}
              page={page}
              onChange={handlePageChange}
              showControls
              color="primary"
              size="sm"
              className="scale-[0.85] sm:scale-100"
            />
          </div>
        )}
      </div>

      {/* Products Display */}
      <div className="min-h-[400px]">
        {viewMode === "table" ? (
          <TableView products={products} />
        ) : (
          <CardView products={products} />
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 md:mt-8 bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-xs md:text-sm font-medium text-gray-500 w-full text-center md:text-left px-1">
          Showing {Math.min((page - 1) * limit + 1, meta.total)} - {Math.min(page * limit, meta.total)} of {meta.total}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap font-bold uppercase">Rows:</span>
            <Select
              size="sm"
              className="w-16"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>

          {meta.totalPage > 1 && (
            <div className="scale-[0.85] sm:scale-100">
              <Pagination
                total={meta.totalPage}
                page={page}
                onChange={handlePageChange}
                showControls
                color="primary"
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      {products.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "No products match your search criteria"
              : "No products available in this category"}
          </p>
          {(searchTerm || categoryFilter !== "all") && (
            <Button
              className="mt-4"
              variant="flat"
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
