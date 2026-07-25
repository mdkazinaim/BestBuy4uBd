import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductFormNew from "./Components/ProductFormNew"; // New form using field configs
import ProductPreviewNew from "./Components/ProductPreviewNew";
import { ProductFormValues } from "./Components/Product";
import { Button } from "@/common/Components/Button";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "@/store/Api/ProductApi";
import { toast } from "sonner";

export default function ProductAdminPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdd = !id || id === "new";

  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<ProductFormValues | null>(null);
  const [defaultValues, setDefaultValues] = useState<
    Partial<ProductFormValues> | undefined
  >(undefined);

  // Fetch existing product (only if updating)
  const { data: existing, isLoading } = useGetProductByIdQuery(
    { id: id! },
    {
      skip: isAdd,
    },
  );

  // RTK Mutation for create/update
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isAdding || isUpdating;

  // When existing product loads, set it as default values
  useEffect(() => {
    if (existing)
      setDefaultValues(existing.data as unknown as ProductFormValues);
  }, [existing]);

  // Load draft from localStorage on mount (for new products)
  useEffect(() => {
    if (isAdd) {
      const savedDraft = localStorage.getItem("product_draft_new");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object") {
            setDefaultValues(parsed);
            toast("Restored draft product from your last session", {
              action: {
                label: "Clear Draft",
                onClick: () => {
                  localStorage.removeItem("product_draft_new");
                  setDefaultValues(undefined);
                  window.location.reload();
                }
              }
            });
          }
        } catch (e) {
          console.error("Error parsing saved draft:", e);
        }
      }
    }
  }, [isAdd]);

  const handleSubmit = (values: ProductFormValues) => {
    setDraft(values);
    setDefaultValues(values);
    if (isAdd) {
      localStorage.setItem("product_draft_new", JSON.stringify(values));
    }
    setPreview(true);
  };

// Helper to transform form draft to API payload structure
const transformProductData = (draft: any) => {
  // Find base variant
  let baseGroup: any = null;
  let baseVar: any = null;
  draft.variants?.forEach((group: any) => {
    group.items?.forEach((item: any) => {
      if (item.isBase === true) {
        baseGroup = group;
        baseVar = item;
      }
    });
  });

  const regPrice = baseVar ? (Number(baseVar.price) || 0) : (draft.price?.regular ? Number(draft.price.regular) : 0);
  const baseVarName = baseVar ? baseVar.value : (draft.price?.baseVariantName || "Standard");

  // Determine relative surcharges for variants
  const formattedVariants = draft.variants
    ?.filter((variant: any) => variant.group.trim() !== "")
    .map((variant: any) => {
      const isTargetGroup = baseGroup && variant.group === baseGroup.group;
      return {
        group: variant.group,
        items: variant.items
          .filter((item: any) => item.value.trim() !== "")
          .map((item: any) => {
            let surchargePrice = item.price ? Number(item.price) : 0;
            if (isTargetGroup && baseVar) {
              if (item.value === baseVar.value) {
                surchargePrice = 0;
              } else {
                surchargePrice = Math.max(0, surchargePrice - regPrice);
              }
            }
            return {
              value: item.value,
              price: surchargePrice,
              stock: item.stock ? Number(item.stock) : 0,
              image: item.image
                ? {
                    url: item.image.url || "",
                    alt: item.image.alt || "",
                  }
                : undefined,
            };
          }),
      };
    }) || [];

  return {
    basicInfo: {
      productCode: draft.basicInfo.productCode,
      title: draft.basicInfo.title,
      brand: draft.basicInfo.brand,
      category: draft.basicInfo.category,
      subcategory: draft.basicInfo.subcategory,
      description: draft.basicInfo.description,
      keyFeatures:
        draft.basicInfo.keyFeatures?.filter(
          (feature: any) => feature.trim() !== "",
        ) || [],
      addDeliveryCharge: draft.basicInfo.addDeliveryCharge || false,
      deliveryChargeInsideDhaka: draft.basicInfo.deliveryChargeInsideDhaka
        ? Number(draft.basicInfo.deliveryChargeInsideDhaka)
        : 0,
      deliveryChargeOutsideDhaka: draft.basicInfo.deliveryChargeOutsideDhaka
        ? Number(draft.basicInfo.deliveryChargeOutsideDhaka)
        : 0,
    },
    price: {
      regular: regPrice,
      discounted: draft.price?.discounted ? Number(draft.price.discounted) : undefined,
      savings: draft.price?.savings ? Number(draft.price.savings) : undefined,
      savingsPercentage: draft.price?.savingsPercentage ? Number(draft.price.savingsPercentage) : undefined,
      baseVariantName: baseVarName,
      selectedVariants: draft.price?.selectedVariants,
    },
    stockStatus: draft.stockStatus,
    stockQuantity: draft.stockQuantity ? Number(draft.stockQuantity) : 0,
    sold: draft.sold ? Number(draft.sold) : 0,
    images: draft.images
      ?.filter((image: any) => image.url && image.url.trim() !== "")
      .map((image: any) => ({ url: image.url!, alt: image.alt })) || [],
    videos:
      draft.videos
        ?.filter((video: any) => video.url && video.url.trim() !== "")
        .map((video: any) => ({ ...video, url: video.url! })) || [],
    variants: formattedVariants,
    comboPricing:
      draft.comboPricing
        ?.filter((tier: any) => tier.minQuantity > 0 && tier.discount > 0)
        .map((tier: any) => ({
          minQuantity: Number(tier.minQuantity),
          discount: Number(tier.discount),
          discountType: tier.discountType || "total",
          variantValue: tier.variantValue || "",
        })) || [],
    specifications:
      draft.specifications
        ?.filter((spec: any) => spec.group.trim() !== "")
        .map((spec: any) => ({
          group: spec.group,
          items: spec.items
            .filter(
              (item: any) => item.name.trim() !== "" && item.value.trim() !== "",
            )
            .map((item: any) => ({
              name: item.name,
              value: item.value,
            })),
        })) || [],
    shippingDetails: draft.shippingDetails ? {
      length: draft.shippingDetails.length ? Number(draft.shippingDetails.length) : undefined,
      width: draft.shippingDetails.width ? Number(draft.shippingDetails.width) : undefined,
      height: draft.shippingDetails.height ? Number(draft.shippingDetails.height) : undefined,
      weight: draft.shippingDetails.weight ? Number(draft.shippingDetails.weight) : undefined,
      dimensionUnit: draft.shippingDetails.dimensionUnit,
      weightUnit: draft.shippingDetails.weightUnit,
    } : undefined,
    additionalInfo: {
      freeShipping: Boolean(draft.additionalInfo?.freeShipping),
      isFeatured: Boolean(draft.additionalInfo?.isFeatured),
      isOnSale: Boolean(draft.additionalInfo?.isOnSale),
      estimatedDelivery: draft.additionalInfo?.estimatedDelivery,
      returnPolicy: draft.additionalInfo?.returnPolicy,
      warranty: draft.additionalInfo?.warranty,
      landingPageTemplate: draft.additionalInfo?.landingPageTemplate,
    },
    seo: {
      metaTitle: draft.seo?.metaTitle || undefined,
      metaDescription: draft.seo?.metaDescription || undefined,
      slug: draft.seo?.slug || undefined,
    },
    tags: draft.tags?.filter((tag: any) => tag.trim() !== "") || [],
  };
};

  const handleConfirm = async () => {
    if (!draft) return;
    try {
      // Transform the form data to match the API payload structure
      const productData = transformProductData(draft);

      console.log("Sending product data:", productData); // Debug log

      if (isAdd) {
        await addProduct(productData).unwrap();
        localStorage.removeItem("product_draft_new");
      } else {
        await updateProduct({ id: id!, ...productData }).unwrap();
      }

      toast.success(isAdd ? "Product created successfully" : "Product updated successfully");
      setPreview(false);
      navigate("/admin/products");
    } catch (err) {
      console.error("Save product error:", err);
      toast.error("Failed to save product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm font-medium text-slate-500">
        Loading product details...
      </div>
    );
  }

  // Preview mode
  if (preview && draft) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
              Product Preview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verify your product configurations before saving.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(false)}
              disabled={isSaving}
            >
              Back to edit
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : isAdd ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Content Preview */}
        <ProductPreviewNew data={transformProductData(draft) as ProductFormValues} />

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(false)}
            disabled={isSaving}
          >
            Back to edit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isAdd ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  }

  // Form mode
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
            {isAdd ? "Add Product" : "Edit Product"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdd ? "Publish a new product to your storefront" : "Edit and update product information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Button>
        </div>
      </div> */}

      {/* Content Form */}
      <ProductFormNew defaultValues={defaultValues} onSubmit={handleSubmit} />
    </div>
  );
}
