import React from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { Product } from "@/types/Product/Product";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  currentProductId,
}) => {
  const { data, isLoading } = useGetAllProductsQuery({
    category: category,
    limit: 5,
  });

  const relatedProducts =
    data?.data?.filter((p) => p._id !== currentProductId).slice(0, 4) || [];

  if (isLoading || relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        <Link
          to="/shop"
          className="text-primary-green font-semibold hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product: Product) => (
          <Link
            key={product._id}
            to={`/${product._id}`}
            className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square overflow-hidden bg-gray-50 relative">
              <img
                src={
                  product.images?.[0]?.url ||
                  "https://placehold.co/400x400?text=No+Image"
                }
                alt={product.basicInfo.title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (
                    target.src !== "https://placehold.co/400x400?text=No+Image"
                  ) {
                    target.src = "https://placehold.co/400x400?text=No+Image";
                  }
                }}
              />
              {product.price.discounted &&
                product.price.discounted < product.price.regular && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -
                    {Math.round(
                      ((product.price.regular - product.price.discounted) /
                        product.price.regular) *
                        100,
                    )}
                    %
                  </div>
                )}
            </div>
            <div className="p-5">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                {product.basicInfo.category}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-green transition">
                {product.basicInfo.title}
              </h3>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-700">
                  {product.rating?.average?.toFixed(1) || "0.0"}
                </span>
                <span className="text-xs text-gray-400">
                  ({product.rating?.count || 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-green">
                  ৳
                  {product.price.discounted?.toLocaleString() ||
                    product.price.regular.toLocaleString()}
                </span>
                {product.price.discounted &&
                  product.price.discounted < product.price.regular && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{product.price.regular.toLocaleString()}
                    </span>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
