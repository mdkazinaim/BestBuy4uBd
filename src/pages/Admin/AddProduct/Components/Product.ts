import { z } from "zod";

// --------------------------------------------------
// helpers
// --------------------------------------------------
const preprocessOptionalPositive = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)),
  z.number().positive("Value must be positive").optional()
);

const preprocessOptionalNumber = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)),
  z.number().optional()
);

const preprocessOptionalNonNegative = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)),
  z.number().nonnegative().optional()
);

const preprocessOptionalIntNonNegative = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)),
  z.number().int().nonnegative().optional()
);

// --------------------------------------------------
// leaf schemas
// --------------------------------------------------
const ProductImageSchema = z
  .object({
    url: z.string().optional(),
    alt: z.string().optional(),
    file: z.any().optional(),
  })
  .refine((data) => data.url || data.file, {
    message: "Either URL or file is required",
    path: ["url"],
  });

const ProductVideoSchema = z
  .object({
    url: z.string().optional(),
    title: z.string().min(1, "Video title is required"),
    thumbnail: z.string().url().optional().or(z.literal("")),
    platform: z.enum(["youtube", "vimeo", "direct"]).optional(),
    file: z.any().optional(),
  })
  .refine((data) => data.url || data.file, {
    message: "Either URL or file is required",
    path: ["url"],
  });

const ProductVariantItemSchema = z.object({
  value: z.string().min(1, "Value is required"),
  price: preprocessOptionalNonNegative,
  stock: preprocessOptionalIntNonNegative,
  isBase: z.boolean().optional(),
  image: z
    .object({
      url: z.string().url().optional().or(z.literal("")),
      alt: z.string().optional(),
    })
    .optional(),
  file: z.any().optional(),
});

const ProductVariantSchema = z.object({
  group: z.string().min(1, "Group name is required"),
  items: z
    .array(ProductVariantItemSchema)
    .min(1, "At least one item is required"),
});

const ProductSpecItemSchema = z.object({
  name: z.string().min(1, "Spec name is required"),
  value: z.string().min(1, "Spec value is required"),
});

const ProductSpecGroupSchema = z.object({
  group: z.string().min(1, "Group name is required"),
  items: z.array(ProductSpecItemSchema).min(1, "At least one item is required"),
});

const ProductReviewSchema = z.object({
  user: z.string().min(1, "User name is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
  date: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

const ProductPriceSchema = z.object({
  regular: preprocessOptionalPositive,
  discounted: preprocessOptionalPositive,
  savings: preprocessOptionalNumber,
  savingsPercentage: preprocessOptionalNumber,
  baseVariantName: z.string().optional(),
  selectedVariants: z.record(z.string()).optional(),
  image: z
    .object({
      url: z.string().url().optional().or(z.literal("")),
      alt: z.string().optional(),
    })
    .optional(),
  file: z.any().optional(),
});

const ComboPricingSchema = z.object({
  minQuantity: z.number().int().positive("Minimum quantity must be at least 1"),
  discount: z.number().nonnegative("Discount must be non-negative"),
  discountType: z.enum(["total", "per_product", "free_delivery", "free_delivery_inside", "free_delivery_outside"]).default("total"),
  variantValue: z.string().optional(),
});

const BundleSchemaZod = z.object({
  name: z.string().optional(),
  variants: z.array(z.string()).nonempty("Variants cannot be empty"),
  discount: z.number().nonnegative("Discount must be non-negative"),
  discountType: z.enum(["flat", "percentage", "free_delivery", "free_delivery_inside", "free_delivery_outside"]).default("flat"),
});

const ProductShippingSchema = z.object({
  length: z.number().nonnegative().optional(),
  width: z.number().nonnegative().optional(),
  height: z.number().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
  dimensionUnit: z.enum(["cm", "in"]).optional(),
  weightUnit: z.enum(["kg", "lb"]).optional(),
});

const ProductSEOSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().optional(),
});

const ProductBasicInfoSchema = z.object({
  productCode: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  keyFeatures: z.array(z.string()).optional(),
  addDeliveryCharge: z.boolean().default(false),
  deliveryChargeInsideDhaka: z.number().nonnegative().optional(),
  deliveryChargeOutsideDhaka: z.number().nonnegative().optional(),
});

// --------------------------------------------------
// top-level product schema
// --------------------------------------------------
export const ProductFormSchema = z.object({
  basicInfo: ProductBasicInfoSchema,
  price: ProductPriceSchema,
  stockStatus: z.enum(["In Stock", "Out of Stock", "Pre-order"]).optional().default("In Stock"),
  stockQuantity: preprocessOptionalIntNonNegative,
  sold: preprocessOptionalIntNonNegative.default(0),
  images: z.array(ProductImageSchema).optional().default([]),
  videos: z.array(ProductVideoSchema).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  comboPricing: z.array(ComboPricingSchema).optional(),
  bundles: z.array(BundleSchemaZod).optional(),
  specifications: z.array(ProductSpecGroupSchema).optional(),
  reviews: z.array(ProductReviewSchema).optional(),
  rating: z
    .object({
      average: z.number().min(0).max(5).default(0),
      count: z.number().int().nonnegative().default(0),
    })
    .optional(),
  relatedProducts: z.array(z.string()).optional(), // ObjectId strings
  tags: z.array(z.string()).optional(),
  shippingDetails: ProductShippingSchema.optional(),
  additionalInfo: z
    .object({
      freeShipping: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
      isOnSale: z.boolean().default(false),
      estimatedDelivery: z.string().optional(),
      returnPolicy: z.string().optional(),
      warranty: z.string().optional(),
      landingPageTemplate: z.string().optional(),
    })
    .optional(),
  seo: ProductSEOSchema.optional(),
}).refine((data) => {
  if (data.price?.regular) return true;
  // If regular price is not specified, check if there is a variant item marked as base variant
  const hasBaseVariant = data.variants?.some((group) =>
    group.items?.some((item) => item.isBase === true)
  );
  return !!hasBaseVariant;
}, {
  message: "Please specify either a Regular Price or select a variant item as the Base Variant.",
  path: ["price.regular"],
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
