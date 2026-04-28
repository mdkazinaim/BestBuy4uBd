import { useState } from "react";
import { Card, Badge, Button, Chip, Tooltip, Select, SelectItem } from "@heroui/react";
import { Star, Eye, Edit, Layout, Trash2 } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice, getStatusColor } from "./utils";
import { useNavigate } from "react-router-dom";
import { useUpdateProductMutation } from "@/store/Api/ProductApi";
import { toast } from "sonner";
import DeleteProductModal from "./DeleteProductModal";

interface CardViewProps {
  products: ProductDisplay[];
}

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

  const templateOptions = [
    { value: "template1", label: "Template 1" },
    { value: "template2", label: "Template 2" },
    { value: "template3", label: "Template 3" },
    { value: "template4", label: "Template 4" },
  ];

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

  return (
    // Card View
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className="p-4 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full"
        >
          {/* Product Image */}
          <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
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
            {product.additionalInfo.isOnSale && (
              <div className="absolute top-2 left-2">
                <Badge color="danger" size="lg">
                  SALE
                </Badge>
              </div>
            )}
            {product.additionalInfo.freeShipping && (
              <div className="absolute top-2 right-2">
                <Badge color="success" size="lg">
                  FREE SHIPPING
                </Badge>
              </div>
            )}
            {product.additionalInfo.isFeatured && (
              <div className="absolute bottom-2 left-2">
                <Badge color="secondary" size="sm">
                  FEATURED
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 flex-grow flex flex-col">
            <div>
              <h3 className="font-semibold line-clamp-2 text-sm">
                {product.basicInfo.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {product.basicInfo.category} • {product.basicInfo.brand}
              </p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {product.basicInfo.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">
                  {formatPrice(product.price.discounted)}
                </span>
                {product.price.discounted < product.price.regular && (
                  <span className="text-sm line-through text-gray-500 ml-2">
                    {formatPrice(product.price.regular)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">
                  {product.rating.average.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <Badge
                color={getStatusColor(product.stockStatus)}
                variant="flat"
              >
                {product.stockStatus}
              </Badge>
              <span className="text-sm text-gray-600">
                Stock: {product.stockQuantity}
              </span>
            </div>

            {/* Template Selector */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Landing Page Template</label>
              <Select
                size="sm"
                aria-label="Select template"
                selectedKeys={[product.additionalInfo?.landingPageTemplate || "template1"]}
                onChange={(e) => handleTemplateChange(product._id, e.target.value)}
                isDisabled={updatingId === product._id}
                classNames={{
                  trigger: "min-h-unit-8 h-8",
                }}
                startContent={<Layout className="w-3 h-3" />}
              >
                {templateOptions.map((option) => (
                  <SelectItem key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Chip key={index} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))}
                {product.tags.length > 3 && (
                  <Tooltip content={`+${product.tags.length - 3} more`}>
                    <Chip size="sm" variant="flat">
                      +{product.tags.length - 3}
                    </Chip>
                  </Tooltip>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 mt-auto">
              <Tooltip content="View Product">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => navigate(`/${product._id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Edit Product">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => navigate(`/admin/update-product/${product._id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Delete Product">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => openDeleteModal(product._id, product.basicInfo.title)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Tooltip>
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
