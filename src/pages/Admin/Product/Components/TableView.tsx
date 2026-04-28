import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
  Badge,
  Select,
  SelectItem,
} from "@heroui/react";
import { Eye, Edit, Trash2, Star, Layout } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice, getStatusColor } from "./utils";
import { useNavigate } from "react-router-dom";
import { useUpdateProductMutation } from "@/store/Api/ProductApi";
import { toast } from "sonner";
import DeleteProductModal from "./DeleteProductModal";

interface TableViewProps {
  products: ProductDisplay[];
}

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

  const templateOptions = [
    { value: "template1", label: "Template 1" },
    { value: "template2", label: "Template 2" },
    { value: "template3", label: "Template 3" },
    { value: "template4", label: "Template 4" },
  ];

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

  const tableColumns = [
    { key: "image", label: "Product" },
    { key: "title", label: "Name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "sales", label: "Sales" },
    { key: "rating", label: "Rating" },
    { key: "template", label: "Template" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderTableRows = (product: ProductDisplay) => ({
    key: product._id,
    image: (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={
            product.images[0]?.url ||
            "https://placehold.co/400x400?text=No+Image"
          }
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
    ),
    title: (
      <div className="flex flex-col min-w-[200px]">
        <p className="font-medium text-sm line-clamp-1">
          {product.basicInfo.title}
        </p>
        <p className="text-xs text-gray-500">{product.basicInfo.productCode}</p>
        <p className="text-xs text-gray-400">{product.basicInfo.brand}</p>
      </div>
    ),
    price: (
      <div className="flex flex-col min-w-[120px]">
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {formatPrice(product.price.discounted)}
          </span>
          {product.price.discounted < product.price.regular && (
            <span className="text-xs line-through text-gray-500">
              {formatPrice(product.price.regular)}
            </span>
          )}
        </div>
        {product.price.discounted < product.price.regular && (
          <Chip size="sm" color="danger" variant="flat">
            Save {formatPrice(product.price.regular - product.price.discounted)}
          </Chip>
        )}
      </div>
    ),
    stock: (
      <div className="flex flex-col min-w-[100px]">
        <span className="font-medium">{product.stockQuantity}</span>
        <div className="w-full bg-gray-200 rounded-full h-2">
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
    ),
    sales: (
      <div className="flex flex-col">
        <span className="font-medium">{product.sold}</span>
        <span className="text-xs text-gray-500">Units sold</span>
      </div>
    ),
    rating: (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-medium">{product.rating.average.toFixed(1)}</span>
        <span className="text-xs text-gray-500">
          ({product.rating.count})
        </span>
      </div>
    ),
    template: (
      <div className="min-w-[140px]">
        <Select
          size="sm"
          aria-label="Select template"
          selectedKeys={[
            product.additionalInfo?.landingPageTemplate || "template1",
          ]}
          onChange={(e) => handleTemplateChange(product._id, e.target.value)}
          isDisabled={updatingId === product._id}
          classNames={{
            trigger: "min-h-unit-8 h-8",
          }}
          startContent={<Layout className="w-3 h-3" />}
        >
          {templateOptions.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>
    ),
    status: (
      <div className="flex flex-col gap-1">
        <Badge
          color={getStatusColor(product.stockStatus)}
          variant="flat"
          size="sm"
        >
          {product.stockStatus}
        </Badge>
        {product.additionalInfo.isFeatured && (
          <Badge color="secondary" variant="flat" size="sm">
            Featured
          </Badge>
        )}
        {product.additionalInfo.isOnSale && (
          <Badge color="danger" variant="flat" size="sm">
            Sale
          </Badge>
        )}
      </div>
    ),
    actions: (
      <div className="flex gap-2">
        <Tooltip content="View Details">
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
            variant="light"
            color="primary"
            onPress={() => navigate(`/admin/update-product/${product._id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() =>
              openDeleteModal(product._id, product.basicInfo.title)
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    ),
  });

  const ProductCard = ({ product }: { product: ProductDisplay }) => (
    <div className="bg-white p-4 mb-3 border border-gray-100 rounded-xl space-y-4">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={product.images[0]?.url || "https://placehold.co/400x400?text=No+Image"}
            alt={product.basicInfo.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm line-clamp-1">{product.basicInfo.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{product.basicInfo.productCode}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-black text-primary text-base">
              {formatPrice(product.price.discounted)}
            </span>
            <Chip 
              size="sm" 
              color={getStatusColor(product.stockStatus) as any} 
              variant="flat"
               className="capitalize"
            >
              {product.stockStatus}
            </Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Stock & Sales</p>
          <p className="text-sm font-medium mt-0.5">
            {product.stockQuantity} Left / {product.sold} Sold
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Rating</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{product.rating.average.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.rating.count})</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Landing Template</p>
            <Select
              size="sm"
              selectedKeys={[product.additionalInfo?.landingPageTemplate || "template1"]}
              onChange={(e) => handleTemplateChange(product._id, e.target.value)}
              isDisabled={updatingId === product._id}
              classNames={{ trigger: "h-9 bg-gray-50 border-none shadow-none" }}
            >
              {templateOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
        </div>

        <div className="flex gap-2">
            <Button 
                isIconOnly
                className="h-9 w-9 font-bold bg-gray-50 text-gray-600 border-none" 
                size="sm" 
                onPress={() => navigate(`/${product._id}`)}
            >
                <Eye size={16} />
            </Button>
            <Button 
                className="flex-1 h-9 font-bold bg-blue-50 text-blue-600 border-none" 
                size="sm" 
                onPress={() => navigate(`/admin/update-product/${product._id}`)}
                startContent={<Edit size={16} />}
            >
                Edit
            </Button>
            <Button 
                className="flex-1 h-9 font-bold bg-red-50 text-red-600 border-none" 
                size="sm" 
                onPress={() => openDeleteModal(product._id, product.basicInfo.title)}
                startContent={<Trash2 size={16} />}
            >
                Delete
            </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto border border-gray-100 rounded-lg bg-white">
        <Table
          aria-label="Products table"
          className="w-full"
          classNames={{
            wrapper: "p-0 shadow-none",
            th: "bg-gray-50 text-gray-600 font-medium",
            td: "py-3",
          }}
          selectionMode="multiple"
        >
          <TableHeader columns={tableColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={products.map(renderTableRows)}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{item[columnKey as keyof typeof item]}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
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
