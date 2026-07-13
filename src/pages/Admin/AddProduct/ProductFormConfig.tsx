import { FieldConfig } from "@/common/DynamicForm/FormFields/FieldTypes";

/**
 * Product Form Field Configuration
 * Maps the Mongoose Product schema to CommonForm field definitions
 */

// ============================================
// Basic Info Fields
// ============================================
export const basicInfoFields: FieldConfig[] = [
  {
    name: "basicInfo.productCode",
    type: "text",
    label: "Product Code (SKU)",
    placeholder: "e.g., PROD-12345",
    helpText: "Unique product identifier",
  },
  {
    name: "basicInfo.title",
    type: "text",
    label: "Product Title",
    placeholder: "Enter product title",
    required: true,
  },
  {
    name: "basicInfo.brand",
    type: "text",
    label: "Brand",
    placeholder: "Enter brand name",
    required: true,
  },
  {
    name: "basicInfo.category",
    type: "select",
    label: "Category",
    placeholder: "Select category",
    required: true,
    options: [
      "Electronics",
      "Clothing",
      "Home & Garden",
      "Sports",
      "Books",
      "Toys",
      "Food & Beverages",
    ],
  },
  {
    name: "basicInfo.subcategory",
    type: "text",
    label: "Subcategory",
    placeholder: "Enter subcategory",
  },
  {
    name: "basicInfo.description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter detailed product description",
    required: true,
    rows: 5,
    showCharCount: true,
    maxLength: 2000,
  },
  {
    name: "basicInfo.addDeliveryCharge",
    type: "switch",
    label: "Add Delivery Charge",
    defaultValue: false,
  },
  {
    name: "basicInfo.deliveryChargeInsideDhaka",
    type: "number",
    label: "Delivery Charge (Inside Dhaka)",
    placeholder: "0",
    showWhen: {
      field: "basicInfo.addDeliveryCharge",
      operator: "equals",
      value: true,
    },
  },
  {
    name: "basicInfo.deliveryChargeOutsideDhaka",
    type: "number",
    label: "Delivery Charge (Outside Dhaka)",
    placeholder: "0",
    showWhen: {
      field: "basicInfo.addDeliveryCharge",
      operator: "equals",
      value: true,
    },
  },
];

// ============================================
// Price & Stock Fields
// ============================================
export const priceStockFields: FieldConfig[] = [
  {
    name: "price.regular",
    type: "number",
    label: "Regular Price",
    placeholder: "0.00",
    required: true,
    prefix: "৳",
  },
  {
    name: "price.discounted",
    type: "number",
    label: "Discounted Price",
    placeholder: "0.00",
    prefix: "৳",
  },
  {
    name: "stockStatus",
    type: "select",
    label: "Stock Status",
    required: true,
    options: ["In Stock", "Out of Stock", "Pre-order"],
    defaultValue: "In Stock",
  },
  {
    name: "stockQuantity",
    type: "number",
    label: "Stock Quantity",
    placeholder: "0",
  },
  {
    name: "sold",
    type: "number",
    label: "Units Sold",
    placeholder: "0",
    defaultValue: 0,
    disabled: true,
    helpText: "Auto-calculated based on orders",
  },
];

// ============================================
// Shipping Details Fields
// ============================================
export const shippingFields: FieldConfig[] = [
  {
    name: "shippingDetails.length",
    type: "number",
    label: "Length",
    placeholder: "0",
  },
  {
    name: "shippingDetails.width",
    type: "number",
    label: "Width",
    placeholder: "0",
  },
  {
    name: "shippingDetails.height",
    type: "number",
    label: "Height",
    placeholder: "0",
  },
  {
    name: "shippingDetails.weight",
    type: "number",
    label: "Weight",
    placeholder: "0",
  },
  {
    name: "shippingDetails.dimensionUnit",
    type: "radio",
    label: "Dimension Unit",
    options: [
      { label: "Centimeters (cm)", value: "cm" },
      { label: "Inches (in)", value: "in" },
    ],
    defaultValue: "cm",
    inline: true,
  },
  {
    name: "shippingDetails.weightUnit",
    type: "radio",
    label: "Weight Unit",
    options: [
      { label: "Kilograms (kg)", value: "kg" },
      { label: "Pounds (lb)", value: "lb" },
    ],
    defaultValue: "kg",
    inline: true,
  },
];

// ============================================
// Additional Info Fields
// ============================================
export const additionalInfoFields: FieldConfig[] = [
  {
    name: "additionalInfo.freeShipping",
    type: "checkbox",
    label: "Free Shipping",
    checkboxLabel: "Offer free shipping for this product",
    defaultValue: false,
  },
  {
    name: "additionalInfo.isFeatured",
    type: "checkbox",
    label: "Featured Product",
    checkboxLabel: "Display this product in featured section",
    defaultValue: false,
  },
  {
    name: "additionalInfo.isOnSale",
    type: "checkbox",
    label: "On Sale",
    checkboxLabel: "Mark this product as on sale",
    defaultValue: false,
  },
  {
    name: "additionalInfo.estimatedDelivery",
    type: "text",
    label: "Estimated Delivery",
    placeholder: "e.g., 3-5 business days",
  },
  {
    name: "additionalInfo.returnPolicy",
    type: "textarea",
    label: "Return Policy",
    placeholder: "Enter return policy details",
    rows: 3,
  },
  {
    name: "additionalInfo.warranty",
    type: "text",
    label: "Warranty",
    placeholder: "e.g., 1 year manufacturer warranty",
  },
  {
    name: "additionalInfo.landingPageTemplate",
    type: "text",
    label: "Landing Page Template",
    placeholder: "e.g., template1, template2",
    helpText: "Specify the landing page design template for this product",
    defaultValue: "template1",
  },
];

// ============================================
// SEO Fields
// ============================================
export const seoFields: FieldConfig[] = [
  {
    name: "seo.metaTitle",
    type: "text",
    label: "Meta Title",
    placeholder: "SEO optimized title",
    maxLength: 60,
    helpText: "Recommended: 50-60 characters",
  },
  {
    name: "seo.metaDescription",
    type: "textarea",
    label: "Meta Description",
    placeholder: "SEO optimized description",
    rows: 3,
    maxLength: 160,
    showCharCount: true,
    helpText: "Recommended: 150-160 characters",
  },
  {
    name: "seo.slug",
    type: "text",
    label: "URL Slug",
    placeholder: "product-url-slug",
    helpText: "Auto-generated from title if left empty",
  },
];

// ============================================
// Tags Field
// ============================================
export const tagsField: FieldConfig[] = [
  {
    name: "tags",
    type: "tags",
    label: "Product Tags",
    placeholder: "Add tags...",
    required: true,
    helpText: "Press Enter to add tags",
    suggestions: [
      "New Arrival",
      "Best Seller",
      "Limited Edition",
      "Eco-Friendly",
      "Premium",
    ],
    allowCustom: true,
  },
];

// ============================================
// Combined Form Configuration
// ============================================
export const getAllProductFields = (): FieldConfig[] => {
  return [
    ...basicInfoFields,
    ...priceStockFields,
    ...shippingFields,
    ...additionalInfoFields,
    ...seoFields,
    ...tagsField,
  ];
};
