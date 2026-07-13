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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Info Panel */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-none">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Product Preview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review your product configuration below before committing changes.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Media */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-450" />
              Product Images
            </h2>
            <div className="space-y-4">
              {images && images.length > 0 ? (
                images.map((img, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950/20"
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
                    <div className="p-3 border-t border-slate-100 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {img.alt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 dark:text-slate-650 text-sm">
                  No images added
                </div>
              )}
            </div>
          </div>

          {/* Videos Preview */}
          <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-450" />
              Product Videos
            </h2>
            <div className="space-y-4">
              {videos && videos.length > 0 ? (
                videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/20 dark:bg-slate-950/10 p-4"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {vid.title || "Untitled Video"}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 truncate font-mono">
                        {vid.url}
                      </p>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
                          {vid.platform || "Direct"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 dark:text-slate-650 text-sm">
                  No videos added
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-850">
              <div className="flex-1 min-w-[240px]">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {basicInfo.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                    {basicInfo.brand}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-full text-xs font-medium">
                    {basicInfo.category}
                  </span>
                  {basicInfo.subcategory && (
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-full text-xs font-medium">
                      {basicInfo.subcategory}
                    </span>
                  )}
                </div>
                {basicInfo.productCode && (
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-mono">
                    SKU: {basicInfo.productCode}
                  </p>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="flex-shrink-0">
                {stockStatus === "In Stock" ? (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200/50 dark:border-green-900/30 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>In Stock</span>
                  </div>
                ) : stockStatus === "Out of Stock" ? (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200/50 dark:border-red-900/30 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-750 dark:text-yellow-400 rounded-lg border border-yellow-200/50 dark:border-yellow-900/30 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Pre-order</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400">
                  ৳{price.discounted || price.regular}
                </span>
                {price.discounted && (
                  <>
                    <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                      ৳{price.regular}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                      -{savingsPercentage}%
                    </span>
                  </>
                )}
              </div>
              {stockQuantity !== undefined && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Available Stock: {stockQuantity} units
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 space-y-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-205 text-sm uppercase tracking-wider">Description</h3>
              <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-sm whitespace-pre-line">
                {basicInfo.description}
              </p>
            </div>

            {/* Key Features */}
            {basicInfo.keyFeatures && basicInfo.keyFeatures.length > 0 && (
              <div className="mb-6 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-205 text-sm uppercase tracking-wider">
                  Key Features
                </h3>
                <ul className="space-y-2.5">
                  {basicInfo.keyFeatures.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-slate-600 dark:text-slate-350 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-full text-xs flex items-center gap-1 font-medium"
                    >
                      <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants */}
          {variants && variants.length > 0 && (
            <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-850">Variants</h3>
              <div className="space-y-5">
                {variants.map((variant, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {variant.group}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {variant.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/30 dark:bg-slate-950/20"
                        >
                          <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                            {item.value}
                          </div>
                          {item.price !== undefined && item.price > 0 && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              +৳{item.price}
                            </div>
                          )}
                          {item.stock !== undefined && (
                            <div className="text-xs text-slate-455 dark:text-slate-500 mt-0.5">
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
            <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-850">
                Specifications
              </h3>
              <div className="space-y-6">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-450 uppercase tracking-wider mb-2">
                      {spec.group}
                    </h4>
                    <div className="divide-y divide-slate-100 dark:divide-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      {spec.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex justify-between p-3 text-sm bg-white dark:bg-slate-900/10 even:bg-slate-50/40 dark:even:bg-slate-900/30"
                        >
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{item.name}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-205">
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
            <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <Truck className="w-4 h-4 text-blue-600 dark:text-blue-450" />
                Shipping
              </h3>
              <div className="space-y-3 text-sm">
                {shippingDetails ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850/60">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Dimensions</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350">
                        {shippingDetails.length || 0} × {shippingDetails.width || 0} ×{" "}
                        {shippingDetails.height || 0} {shippingDetails.dimensionUnit || 'cm'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850/60">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Weight</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350">
                        {shippingDetails.weight || 0} {shippingDetails.weightUnit || 'kg'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400 py-1">No shipping details provided</div>
                )}
                {additionalInfo?.estimatedDelivery && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Est.</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">
                      {additionalInfo.estimatedDelivery}
                    </span>
                  </div>
                )}
                {additionalInfo?.freeShipping && (
                  <div className="mt-4 px-3 py-2 bg-green-50 dark:bg-green-950/20 text-green-705 dark:text-green-400 rounded-lg text-center font-medium border border-green-200/30 dark:border-green-900/30 text-xs uppercase tracking-wider">
                    Free Shipping Available
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-450" />
                Additional Info
              </h3>
              <div className="space-y-4">
                {additionalInfo?.warranty && (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warranty</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {additionalInfo.warranty}
                      </div>
                    </div>
                  </div>
                )}
                {additionalInfo?.returnPolicy && (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Return Policy</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {additionalInfo.returnPolicy}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-105 dark:border-slate-850">
                  {additionalInfo?.isFeatured && (
                    <span className="px-2.5 py-0.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-900/30 text-xs rounded-full flex items-center gap-1 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                  {additionalInfo?.isOnSale && (
                    <span className="px-2.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 text-xs rounded-full flex items-center gap-1 font-medium">
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
            <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-none border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-850">
                SEO Configuration
              </h3>
              <div className="space-y-4">
                {seo.metaTitle && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Meta Title
                    </div>
                    <div className="text-sm text-slate-750 dark:text-slate-300 font-medium">{seo.metaTitle}</div>
                  </div>
                )}
                {seo.metaDescription && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Meta Description
                    </div>
                    <div className="text-sm text-slate-750 dark:text-slate-300 leading-relaxed font-medium">
                      {seo.metaDescription}
                    </div>
                  </div>
                )}
                {seo.slug && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Slug URL Path
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-mono font-medium">
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
