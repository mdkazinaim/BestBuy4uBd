import type { Product as ApiProduct } from "@/types/Product/Product";
import { ProductDisplay } from "./types";

export const normalizeProduct = (apiProduct: ApiProduct): ProductDisplay => {
  return {
    _id: apiProduct._id || "",
    basicInfo: {
      title: apiProduct.basicInfo?.title || "No Title",
      productCode: apiProduct.basicInfo?.productCode || "N/A",
      brand: apiProduct.basicInfo?.brand || "No Brand",
      category: apiProduct.basicInfo?.category || "Uncategorized",
      description: apiProduct.basicInfo?.description || "",
    },
    price: {
      regular: apiProduct.price?.regular || 0,
      discounted: apiProduct.price?.discounted || 0,
    },
    stockStatus: apiProduct.stockStatus || "Unknown",
    stockQuantity: apiProduct.stockQuantity || 0,
    sold: apiProduct.sold || 0,
    images: apiProduct.images || [],
    rating: {
      average: apiProduct.rating?.average || 0,
      count: apiProduct.rating?.count || 0,
    },
    additionalInfo: {
      freeShipping: apiProduct.additionalInfo?.freeShipping || false,
      isFeatured: apiProduct.additionalInfo?.isFeatured || false,
      isOnSale: apiProduct.additionalInfo?.isOnSale || false,
      landingPageTemplate: apiProduct.additionalInfo?.landingPageTemplate || "template1",
    },
    createdAt: String(apiProduct.createdAt) || "",
    tags: apiProduct.tags || [],
  };
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(price);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "success";
    case "Out of Stock":
      return "danger";
    default:
      return "warning";
  }
};
