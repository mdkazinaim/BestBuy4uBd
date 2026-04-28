import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, ProductFormValues } from "./Product";
import {
  basicInfoFields,
  priceStockFields,
  shippingFields,
  additionalInfoFields,
  seoFields,
  tagsField,
} from "../ProductFormConfig";
import {
  ImagesField,
  VideosField,
  KeyFeaturesField,
  VariantsField,
  SpecificationsField,
  ComboPricingField,
} from "./NestedArrayFields";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useCallback, useMemo, memo, useEffect } from "react";

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
};

// ============================================
// 🎨 Collapsible Section Component (Memoized)
// ============================================
const CollapsibleSection = memo(
  ({
    title,
    children,
    defaultOpen = true,
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    return (
      <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-gradient-to-r from-primary-blue/5 to-transparent hover:from-primary-blue/10 transition-colors"
        >
          <h2 className="text-base md:text-xl font-bold text-gray-800">
            {title}
          </h2>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          )}
        </button>
        {isOpen && <div className="p-3 md:p-6">{children}</div>}
      </div>
    );
  },
);

CollapsibleSection.displayName = "CollapsibleSection";

// ============================================
// 🎨 Field Renderer for Simple Fields (Memoized)
// ============================================
const FieldRenderer = memo(({ field, register, errors, watch }: any) => {
  const error = errors[field.name.split(".")[0]]?.[field.name.split(".")[1]];
  const errorMessage = error?.message as string | undefined;

  // Check conditional rendering
  if (field.showWhen) {
    const { field: dependentField, operator, value } = field.showWhen;
    const dependentValue = watch(dependentField);

    if (operator === "equals" && dependentValue !== value) {
      return null;
    }
  }

  const inputClasses = `w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue ${
    error ? "border-red-500" : "border-border"
  } ${field.disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

  switch (field.type) {
    case "text":
    case "email":
    case "url":
    case "number":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            {field.prefix && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {field.prefix}
              </div>
            )}
            <input
              type={field.type}
              {...register(field.name, {
                valueAsNumber: field.type === "number",
              })}
              placeholder={field.placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={`${inputClasses} ${field.prefix ? "pl-10" : ""}`}
            />
          </div>
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "textarea":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            {...register(field.name)}
            rows={field.rows || 4}
            placeholder={field.placeholder}
            disabled={field.disabled}
            maxLength={field.maxLength}
            className={inputClasses}
          />
          {field.showCharCount && field.maxLength && (
            <p className="text-xs text-gray-500 mt-1 text-right">
              {watch(field.name)?.length || 0}/{field.maxLength}
            </p>
          )}
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select {...register(field.name)} className={inputClasses}>
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((opt: any) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "radio":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className={`space-y-2 ${field.inline ? "flex gap-4" : ""}`}>
            {field.options?.map((opt: any) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register(field.name)}
                    className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-2 focus:ring-primary-blue"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              );
            })}
          </div>
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div key={field.name} className={field.className}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register(field.name)}
              disabled={field.disabled}
              className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
            />
            <span className="text-sm font-medium text-gray-700">
              {field.checkboxLabel || field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1 ml-6">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1 ml-6">{errorMessage}</p>
          )}
        </div>
      );

    case "switch":
      return (
        <div key={field.name} className={field.className}>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                {...register(field.name)}
                disabled={field.disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
            </div>
          </label>
          {field.helpText && (
            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    default:
      return null;
  }
});

FieldRenderer.displayName = "FieldRenderer";

// ============================================
// 📝 Main Product Form Component
// ============================================
export default function ProductFormNew({ defaultValues, onSubmit }: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultValues ?? {
      basicInfo: {
        keyFeatures: [],
        addDeliveryCharge: false,
        deliveryChargeInsideDhaka: 0,
        deliveryChargeOutsideDhaka: 0,
      },
      price: {},
      stockStatus: "In Stock",
      sold: 0,
      images: [{ url: "", alt: "", file: undefined }],
      videos: [],
      variants: [],
      specifications: [],
      reviews: [],
      rating: { average: 0, count: 0 },
      relatedProducts: [],
      tags: [],
      additionalInfo: {
        freeShipping: false,
        isFeatured: false,
        isOnSale: false,
      },
      seo: {},
      shippingDetails: { dimensionUnit: "cm", weightUnit: "kg" },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (
    file: File,
    resourceType: "image" | "video" = "image",
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    // Replace these or set them in your .env file
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "preset_here",
    );
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "cloud_name";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!res.ok) throw new Error(`${resourceType} upload failed`);
    const data = await res.json();
    return data.secure_url;
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      setIsUploading(true);

      const processedImages = await Promise.all(
        data.images.map(async (img: any) => {
          if (img.file && img.file.length > 0) {
            const url = await uploadToCloudinary(img.file[0], "image");
            return { url, alt: img.alt };
          }
          return { url: img.url || "", alt: img.alt };
        }),
      );

      const processedVideos = await Promise.all(
        (data.videos || []).map(async (vid: any) => {
          if (vid.file && vid.file.length > 0) {
            const url = await uploadToCloudinary(vid.file[0], "video");
            return { ...vid, url };
          }
          return { ...vid, url: vid.url || "" };
        }),
      );

      onSubmit({ ...data, images: processedImages, videos: processedVideos });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      alert(
        "Failed to upload images. Please check your Cloudinary configuration.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Populate form when defaultValues arrive (e.g., when editing)
  // Note: We don't populate deprecated bulkPricing if it exists in old data
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Memoize field groups to prevent re-renders
  const basicInfoFieldsSlice1 = useMemo(() => basicInfoFields.slice(0, 6), []);
  const basicInfoFieldsSlice2 = useMemo(() => basicInfoFields.slice(7), []);
  const shippingFieldsSlice1 = useMemo(() => shippingFields.slice(0, 4), []);
  const shippingFieldsSlice2 = useMemo(() => shippingFields.slice(4), []);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full mx-auto p-2 md:p-6 space-y-4 md:space-y-6"
    >
      {/* Basic Information */}
      <CollapsibleSection title="📋 Basic Information" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {basicInfoFieldsSlice1.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
        <div className="mt-4">
          <FieldRenderer
            field={basicInfoFields[6]}
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {basicInfoFieldsSlice2.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
        <div className="mt-6">
          <KeyFeaturesField control={control} register={register} />
        </div>
      </CollapsibleSection>

      {/* Images */}
      <CollapsibleSection title="🖼️ Product Images & Videos" defaultOpen={true}>
        <div className="space-y-8">
          <ImagesField control={control} register={register} errors={errors} />
          <div className="border-t border-border pt-8">
            <VideosField
              control={control}
              register={register}
              errors={errors}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Price & Stock */}
      <CollapsibleSection title="💰 Price & Inventory" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priceStockFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <ComboPricingField
            control={control}
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>
      </CollapsibleSection>

      {/* Variants */}
      <CollapsibleSection title="🎨 Product Variants" defaultOpen={false}>
        <VariantsField control={control} register={register} errors={errors} />
      </CollapsibleSection>

      {/* Specifications */}
      <CollapsibleSection title="📋 Specifications" defaultOpen={false}>
        <SpecificationsField
          control={control}
          register={register}
          errors={errors}
        />
      </CollapsibleSection>

      {/* Shipping Details */}
      <CollapsibleSection title="📦 Shipping Details" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shippingFieldsSlice1.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {shippingFieldsSlice2.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Additional Info */}
      <CollapsibleSection title="ℹ️ Additional Information" defaultOpen={false}>
        <div className="space-y-4">
          {additionalInfoFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* SEO */}
      <CollapsibleSection title="🔍 SEO Settings" defaultOpen={false}>
        <div className="space-y-4">
          {seoFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Tags */}
      <CollapsibleSection title="🏷️ Tags" defaultOpen={false}>
        <div className="space-y-4">
          {tagsField.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white border-t border-border p-3 md:p-6 -mx-2 md:-mx-6 -mb-2 md:-mb-6 rounded-b-xl shadow-lg z-10">
        <div className="flex gap-2 md:gap-4 justify-end">
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 md:px-8 py-2 md:py-3 bg-gray-100 text-gray-700 text-sm md:text-base font-medium rounded-lg md:rounded-xl hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-primary-blue to-blue-600 text-white text-sm md:text-base font-medium rounded-lg md:rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting || isUploading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
