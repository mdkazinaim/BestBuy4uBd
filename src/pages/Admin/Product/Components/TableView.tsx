import { useState } from "react";
import { Tooltip } from "@heroui/react";
import { Eye, Edit, Trash2, Star, Layout, ChevronDown } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice } from "./utils";
import { useNavigate } from "react-router-dom";
import { useUpdateProductMutation } from "@/store/Api/ProductApi";
import { toast } from "sonner";
import DeleteProductModal from "./DeleteProductModal";
import { Button } from "@/common/Components/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface TableViewProps {
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
            <Layout className="w-3.5 h-3.5 text-slate-400" />
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

const TableView = ({ products }: TableViewProps) => {
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

  const handleTemplateChange = async (
    productId: string,
    newTemplate: string
  ) => {
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

  const getStockBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s?.includes("in")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400 whitespace-nowrap">
          In Stock
        </span>
      );
    }
    if (s?.includes("out")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400 whitespace-nowrap">
          Out of Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-950/20 text-yellow-805 dark:text-yellow-450 whitespace-nowrap">
        {status}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 shadow-none">
        <table className="w-full text-sm text-left border-collapse min-w-[1050px]">
          <thead className="bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-l-lg w-16">Product</th>
              <th className="px-4 py-3 font-semibold min-w-[220px]">Name & Code</th>
              <th className="px-4 py-3 font-semibold w-[120px]">Price</th>
              <th className="px-4 py-3 font-semibold w-[100px]">Stock</th>
              <th className="px-4 py-3 font-semibold w-[80px]">Sales</th>
              <th className="px-4 py-3 font-semibold w-[100px]">Rating</th>
              <th className="px-4 py-3 font-semibold w-[140px]">Template</th>
              <th className="px-4 py-3 font-semibold w-[125px]">Status</th>
              <th className="px-4 py-3 font-semibold text-right rounded-r-lg w-[130px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {products.map((product, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={product._id}
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                    isEven ? "bg-white dark:bg-slate-900/10" : "bg-slate-50/20 dark:bg-slate-800/10"
                  }`}
                >
                  {/* Image */}
                  <td className="px-4 py-3 w-16">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
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
                    </div>
                  </td>

                  {/* Title & Info */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm line-clamp-2">
                        {product.basicInfo.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Code: {product.basicInfo.productCode}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Brand: {product.basicInfo.brand}
                      </p>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 w-[120px]">
                    <div className="flex flex-col min-w-[120px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatPrice(product.price.discounted)}
                        </span>
                        {product.price.discounted < product.price.regular && (
                          <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium">
                            {formatPrice(product.price.regular)}
                          </span>
                        )}
                      </div>
                      {product.price.discounted < product.price.regular && (
                        <span className="inline-flex mt-1 text-[10px] font-semibold text-red-500">
                          Save {formatPrice(product.price.regular - product.price.discounted)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 w-[100px]">
                    <div className="flex flex-col min-w-[100px] gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{product.stockQuantity}</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full ${
                            product.stockQuantity > 20
                              ? "bg-green-500"
                              : product.stockQuantity > 5
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Sales */}
                  <td className="px-4 py-3 w-[80px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{product.sold}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Units</span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3 w-[100px]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-550 fill-yellow-550" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{product.rating.average.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">({product.rating.count})</span>
                    </div>
                  </td>

                  {/* Landing Template */}
                  <td className="px-4 py-3 w-[140px]">
                    <div className="min-w-[140px]">
                      <TemplatePopover
                        currentTemplate={product.additionalInfo?.landingPageTemplate || "template1"}
                        onSelect={(val) => handleTemplateChange(product._id, val)}
                        disabled={updatingId === product._id}
                      />
                    </div>
                  </td>

                  {/* Badges/Status */}
                  <td className="px-4 py-3 w-[125px]">
                    <div className="flex flex-col gap-1.5 items-start">
                      {getStockBadge(product.stockStatus)}
                      {product.additionalInfo.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/20 text-purple-850 dark:text-purple-400 whitespace-nowrap">
                          Featured
                        </span>
                      )}
                      {product.additionalInfo.isOnSale && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-105 dark:bg-red-950/20 text-red-800 dark:text-red-400 whitespace-nowrap">
                          Sale
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right min-w-[130px]">
                    <div className="flex gap-1 justify-end">
                      <Tooltip content="View Details">
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
                      <Tooltip content="Delete">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => (
          <div key={product._id} className="bg-white dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-none">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                <img
                  src={product.images[0]?.url || "https://placehold.co/400x400?text=No+Image"}
                  alt={product.basicInfo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{product.basicInfo.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{product.basicInfo.productCode}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-450 text-base">
                    {formatPrice(product.price.discounted)}
                  </span>
                  {getStockBadge(product.stockStatus)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800/80">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">Stock & Sales</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {product.stockQuantity} Left / {product.sold} Sold
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">Rating</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.rating.average.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">({product.rating.count})</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider mb-1.5">Landing Template</p>
                <TemplatePopover
                  currentTemplate={product.additionalInfo?.landingPageTemplate || "template1"}
                  onSelect={(val) => handleTemplateChange(product._id, val)}
                  disabled={updatingId === product._id}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 shrink-0 !rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => navigate(`/${product._id}`)}
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 h-9 !rounded-lg text-xs font-semibold border border-transparent"
                  onClick={() => navigate(`/admin/update-product/${product._id}`)}
                >
                  <div className="flex items-center gap-1">
                    <Edit size={14} />
                    <span>Edit</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 h-9 !rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => openDeleteModal(product._id, product.basicInfo.title)}
                >
                  <div className="flex items-center gap-1">
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productToDelete?.id || null}
        productName={productToDelete?.name || null}
      />
    </div>
  );
};

export default TableView;
