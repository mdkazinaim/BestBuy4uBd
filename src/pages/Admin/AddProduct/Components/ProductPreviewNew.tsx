import { ProductFormValues } from "./Product";
import {
  Package,
  Tag,
  Truck,
  Shield,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Video,
} from "lucide-react";
import { memo, useMemo } from "react";

interface ProductPreviewProps {
  data: ProductFormValues;
}

const ProductPreviewNew = memo(({ data }: ProductPreviewProps) => {
  const {
    basicInfo,
    price,
    stockStatus,
    stockQuantity,
    images,
    videos,
    variants,
    specifications,
    tags,
    shippingDetails,
    additionalInfo,
    seo,
  } = data;

  // Calculate savings - memoized to prevent recalculation
  const savingsPercentage = useMemo(() => {
    const savingsAmount = price.discounted
      ? price.regular - price.discounted
      : 0;
    return savingsAmount
      ? Math.round((savingsAmount / price.regular) * 100)
      : 0;
  }, [price.regular, price.discounted]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-blue to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Product Preview</h1>
        <p className="text-blue-100">
          Review your product details before publishing
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-blue" />
              Product Images
            </h2>
            <div className="space-y-4">
              {images && images.length > 0 ? (
                images.map((img, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <img
                      src={img.url || "https://via.placeholder.com/400"}
                      alt={img.alt}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "https://placehold.co/400x400?text=No+Image") {
                          target.src = "https://placehold.co/400x400?text=No+Image";
                        }
                      }}
                    />
                    <div className="p-2 bg-gray-50 text-xs text-gray-600">
                      {img.alt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No images added
                </div>
              )}
            </div>
          </div>

          {/* Videos Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 mt-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-primary-blue" />
              Product Videos
            </h2>
            <div className="space-y-4">
              {videos && videos.length > 0 ? (
                videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg overflow-hidden bg-gray-50"
                  >
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-800 truncate mb-1">
                        {vid.title || "Untitled Video"}
                      </p>
                      <p className="text-xs text-primary-blue truncate mb-2">
                        {vid.url}
                      </p>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                          {vid.platform || "Direct"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No videos added
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {basicInfo.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-medium">
                    {basicInfo.brand}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {basicInfo.category}
                  </span>
                  {basicInfo.subcategory && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {basicInfo.subcategory}
                    </span>
                  )}
                </div>
                {basicInfo.productCode && (
                  <p className="text-sm text-gray-500">
                    SKU: {basicInfo.productCode}
                  </p>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="flex-shrink-0">
                {stockStatus === "In Stock" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : stockStatus === "Out of Stock" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Pre-order</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4 p-4 bg-gradient-to-r from-primary-blue/5 to-transparent rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-blue">
                  ৳{price.discounted || price.regular}
                </span>
                {price.discounted && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ৳{price.regular}
                    </span>
                    <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
                      -{savingsPercentage}%
                    </span>
                  </>
                )}
              </div>
              {stockQuantity !== undefined && (
                <p className="text-sm text-gray-600 mt-2">
                  Available: {stockQuantity} units
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {basicInfo.description}
              </p>
            </div>

            {/* Key Features */}
            {basicInfo.keyFeatures && basicInfo.keyFeatures.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {basicInfo.keyFeatures.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variants */}
          {variants && variants.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Variants</h3>
              <div className="space-y-4">
                {variants.map((variant, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {variant.group}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {variant.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 border border-border rounded-lg hover:border-primary-blue transition-colors"
                        >
                          <div className="font-medium text-sm">
                            {item.value}
                          </div>
                          {item.price !== undefined && (
                            <div className="text-xs text-gray-600">
                              ৳{item.price}
                            </div>
                          )}
                          {item.stock !== undefined && (
                            <div className="text-xs text-gray-500">
                              Stock: {item.stock}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {specifications && specifications.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Specifications
              </h3>
              <div className="space-y-4">
                {specifications.map((spec, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 pb-2 border-b border-border">
                      {spec.group}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {spec.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex justify-between py-2 text-sm"
                        >
                          <span className="text-gray-600">{item.name}:</span>
                          <span className="font-medium text-gray-800">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping & Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-blue" />
                Shipping Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">
                    {shippingDetails.length} × {shippingDetails.width} ×{" "}
                    {shippingDetails.height} {shippingDetails.dimensionUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">
                    {shippingDetails.weight} {shippingDetails.weightUnit}
                  </span>
                </div>
                {additionalInfo?.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">
                      {additionalInfo.estimatedDelivery}
                    </span>
                  </div>
                )}
                {additionalInfo?.freeShipping && (
                  <div className="mt-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-center font-medium">
                    Free Shipping Available
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-blue" />
                Additional Info
              </h3>
              <div className="space-y-3">
                {additionalInfo?.warranty && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Warranty</div>
                      <div className="text-xs text-gray-600">
                        {additionalInfo.warranty}
                      </div>
                    </div>
                  </div>
                )}
                {additionalInfo?.returnPolicy && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Return Policy</div>
                      <div className="text-xs text-gray-600">
                        {additionalInfo.returnPolicy}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {additionalInfo?.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {additionalInfo?.isOnSale && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      On Sale
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Info */}
          {seo && (seo.metaTitle || seo.metaDescription || seo.slug) && (
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                SEO Information
              </h3>
              <div className="space-y-3">
                {seo.metaTitle && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Meta Title
                    </div>
                    <div className="text-sm text-gray-600">{seo.metaTitle}</div>
                  </div>
                )}
                {seo.metaDescription && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Meta Description
                    </div>
                    <div className="text-sm text-gray-600">
                      {seo.metaDescription}
                    </div>
                  </div>
                )}
                {seo.slug && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      URL Slug
                    </div>
                    <div className="text-sm text-primary-blue font-mono">
                      /{seo.slug}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProductPreviewNew.displayName = "ProductPreviewNew";

export default ProductPreviewNew;
