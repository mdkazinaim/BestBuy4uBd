import { useState } from "react";
import { Card, Tooltip } from "@heroui/react";
import { Star, Eye, Edit, Layout, Trash2, ChevronDown } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice } from "./utils";
import { useNavigate } from "react-router-dom";
import { useUpdateProductMutation } from "@/store/Api/ProductApi";
import { toast } from "sonner";
import DeleteProductModal from "./DeleteProductModal";
import { Button } from "@/common/Components/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface CardViewProps {
  products: ProductDisplay[];
}

// Custom Popover Select for Template Selector
const TemplatePopover = ({
  currentTemplate,
  onSelect,
  disabled,
}: {
  currentTemplate: string;
  onSelect: (val: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const templateOptions = [
    { value: "template1", label: "Template 1" },
    { value: "template2", label: "Template 2" },
    { value: "template3", label: "Template 3" },
    { value: "template4", label: "Template 4" },
  ];
  const currentOption = templateOptions.find((opt) => opt.value === currentTemplate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer text-xs disabled:opacity-50 disabled:pointer-events-none h-8"
        >
          <div className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-slate-450" />
            <span>{currentOption?.label || currentTemplate}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="py-1">
          {templateOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentTemplate === opt.value
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CardView = ({ products }: CardViewProps) => {
  const navigate = useNavigate();
  const [updateProduct] = useUpdateProductMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openDeleteModal = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleTemplateChange = async (productId: string, newTemplate: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setUpdatingId(productId);
    try {
      await updateProduct({
        id: productId,
        additionalInfo: {
          ...product.additionalInfo,
          landingPageTemplate: newTemplate,
        },
      }).unwrap();
      toast.success("Template updated successfully!");
    } catch (error) {
      toast.error("Failed to update template");
      console.error("Template update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // const getStockBadge = (status: string) => {
  //   const s = status?.toLowerCase();
  //   if (s?.includes("in")) {
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-105 dark:bg-green-950/20 text-green-800 dark:text-green-400">
  //         In Stock
  //       </span>
  //     );
  //   }
  //   if (s?.includes("out")) {
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-105 dark:bg-red-950/20 text-red-800 dark:text-red-400">
  //         Out of Stock
  //       </span>
  //     );
  //   }
  //   return (
  //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-105 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-450">
  //       {status}
  //     </span>
  //   );
  // };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 shadow-none flex flex-col h-full"
        >
          {/* Product Image */}
          <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-850">
            <img
              src={product.images[0]?.url || "https://placehold.co/400x400?text=No+Image"}
              alt={product.images[0]?.alt || product.basicInfo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== "https://placehold.co/400x400?text=No+Image") {
                  target.src = "https://placehold.co/400x400?text=No+Image";
                }
              }}
            />
            {/* Top Left Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
              {product.additionalInfo.isOnSale && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600 text-white shadow-xs">
                  SALE
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-xs ${
                product.stockStatus.toLowerCase().includes("in") ? "bg-green-600" : "bg-red-600"
              }`}>
                {product.stockStatus.toLowerCase().includes("in") ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Top Right Badges */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
              {product.additionalInfo.freeShipping && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white shadow-xs">
                  FREE SHIPPING
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                Stock: {product.stockQuantity}
              </span>
            </div>

            {/* Bottom Left Badges */}
            {product.additionalInfo.isFeatured && (
              <div className="absolute bottom-2 left-2 z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-650 text-white shadow-xs">
                  FEATURED
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 text-sm">
                {product.basicInfo.title}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">
                {product.basicInfo.category} • {product.basicInfo.brand}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
                {product.basicInfo.description ? product.basicInfo.description.replace(/<[^>]*>/g, "") : ""}
              </p>
            </div>

            <div className="space-y-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-150">
                    {formatPrice(product.price.discounted)}
                  </span>
                  {product.price.discounted < product.price.regular && (
                    <span className="text-xs line-through text-slate-450 dark:text-slate-500 ml-2 font-medium">
                      {formatPrice(product.price.regular)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {product.rating.average.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Template Selector */}
              <div>
                <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block font-semibold">Landing Page Template</label>
                <TemplatePopover
                  currentTemplate={product.additionalInfo?.landingPageTemplate || "template1"}
                  onSelect={(val) => handleTemplateChange(product._id, val)}
                  disabled={updatingId === product._id}
                />
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <Tooltip content={`+${product.tags.length - 3} more`}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 cursor-pointer">
                        +{product.tags.length - 3}
                      </span>
                    </Tooltip>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Tooltip content="View Product">
                  <Button
                    variant="ghost"
                    size="none"
                    className="h-8 w-8 p-0 shrink-0 !rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => navigate(`/${product._id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Edit Product">
                  <Button
                    variant="ghost"
                    size="none"
                    className="h-8 w-8 p-0 shrink-0 !rounded-lg text-blue-650 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    onClick={() => navigate(`/admin/update-product/${product._id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete Product">
                  <Button
                    variant="ghost"
                    size="none"
                    className="h-8 w-8 p-0 shrink-0 !rounded-lg text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => openDeleteModal(product._id, product.basicInfo.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productToDelete?.id || null}
        productName={productToDelete?.name || null}
      />
    </div>
  );
};

export default CardView;
