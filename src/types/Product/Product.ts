// Basic Product Information
export interface ProductBasicInfo {
  productCode?: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  keyFeatures?: string[];
  addDeliveryCharge?: boolean;
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
}

// Product Images
export interface ProductImage {
  url: string;
  alt: string;
}

// Product Videos
export interface ProductVideo {
  url: string; // YouTube, Vimeo, or direct video URL
  title: string; // Video title/description
  thumbnail?: string; // Optional custom thumbnail
  platform?: 'youtube' | 'vimeo' | 'direct'; // Video platform
}

// Product Variants
export interface ProductVariantItem {
  value: string;
  price?: number;
  stock?: number;
  image?: {
    url?: string;
    alt?: string;
  };
}

export interface ProductVariant {
  group: string;
  items: ProductVariantItem[];
}

// Product Specifications
export interface ProductSpecificationItem {
  name: string;
  value: string;
}

export interface ProductSpecification {
  group: string;
  items: ProductSpecificationItem[];
}

// Product Reviews and Ratings
export interface ProductReview {
  user: string;
  rating: number;
  comment: string;
  date: Date | string;
}

export interface ProductRating {
  average: number;
  count: number;
}

// Product Pricing
export interface ProductPrice {
  regular: number;
  discounted?: number;
  savings?: number;
  savingsPercentage?: number;
  selectedVariants?: Record<string, string>;
  baseVariantName?: string;
}

// Product Shipping Details
export interface ProductShippingDetails {
  length: number;
  width: number;
  height: number;
  weight: number;
  dimensionUnit: "cm" | "in";
  weightUnit: "kg" | "lb";
}

// Additional Product Information
export interface AdditionalInfo {
  freeShipping: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  estimatedDelivery?: string;
  returnPolicy?: string;
  warranty?: string;
  landingPageTemplate?: string;
}

// Product SEO
export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

/**
 * Represents a product in the e-commerce system (Client-side version)
 */
export interface Product {
  _id: string;
  basicInfo: ProductBasicInfo;

  price: ProductPrice;
  stockStatus: "In Stock" | "Out of Stock" | "Pre-order";
  stockQuantity?: number;
  sold: number;

  // Product Details
  images: ProductImage[];
  videos?: ProductVideo[]; // Optional product videos
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];

  // Reviews and Ratings
  reviews?: ProductReview[];
  rating?: ProductRating;

  // Additional Information
  additionalInfo?: AdditionalInfo;

  // Related Products and Tags
  relatedProducts: string[]; // Array of product IDs as strings
  tags: string[];

  // Shipping Details
  shippingDetails: ProductShippingDetails;

  // SEO and Categorization
  seo?: ProductSEO;

  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // Combo Pricing
  comboPricing?: { minQuantity: number; discount: number }[];
}
