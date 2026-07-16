import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, ProductFormValues } from "./Product";
import { uploadToCloudinary } from "@/utils/cloudinary";
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
import {
  FileText,
  Image as ImageIcon,
  Coins,
  Sliders,
  Truck,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Button } from "@/common/Components/Button";
import { PopoverSelect } from "./FormHelpers";
import RichTextEditor from "./RichTextEditor";
import { motion } from "framer-motion";

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
};

// ============================================
// 🏷️ Tags Input Component
// ============================================
const TagsInput = memo(({ value = [], onChange, placeholder, suggestions }: any) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/,$/, "");
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((t: string) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 min-h-10">
        {value.map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors text-xs font-semibold"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : "Add tag..."}
          className="flex-1 min-w-[120px] bg-transparent border-0 p-0 text-sm focus:ring-0 focus:outline-none text-slate-800 dark:text-slate-150"
        />
      </div>
      {suggestions && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 flex items-center">Suggestions:</span>
          {suggestions.map((suggestion: string) => {
            const isAdded = value.includes(suggestion);
            return (
              <button
                key={suggestion}
                type="button"
                disabled={isAdded}
                onClick={() => onChange([...value, suggestion])}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                  isAdded
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-300 dark:text-slate-600"
                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer"
                }`}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

TagsInput.displayName = "TagsInput";

// ============================================
// 🎨 Field Renderer for Simple Fields (Memoized)
// ============================================
const FieldRenderer = memo(({ field, register, errors, watch, control }: any) => {
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

  const inputClasses = `w-full px-3.5 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 ${
    error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 dark:border-slate-800"
  } ${field.disabled ? "bg-slate-50 dark:bg-slate-805 text-slate-400 dark:text-slate-500 cursor-not-allowed" : "bg-white dark:bg-slate-955/20"}`;

  switch (field.type) {
    case "text":
    case "email":
    case "url":
    case "number":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            {field.prefix && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                {field.prefix}
              </div>
            )}
            <input
              type={field.type}
              {...register(field.name, {
                valueAsNumber: field.type === "number",
              })}
              step={field.type === "number" ? "any" : undefined}
              placeholder={field.placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={`${inputClasses} ${field.prefix ? "pl-8" : ""}`}
            />
          </div>
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "richtext":
      return (
        <div key={field.name} className={`${field.className || ""} md:col-span-2`}>
          <Controller
            name={field.name}
            control={control}
            render={({ field: { value, onChange } }) => (
              <RichTextEditor
                value={value || ""}
                onChange={onChange}
                placeholder={field.placeholder}
                label={field.label}
                required={field.required}
                error={errorMessage}
              />
            )}
          />
        </div>
      );

    case "textarea":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5">
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
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
              {watch(field.name)?.length || 0}/{field.maxLength}
            </p>
          )}
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <PopoverSelect
            name={field.name}
            control={control}
            options={field.options || []}
            placeholder={field.placeholder}
            error={errorMessage}
            disabled={field.disabled}
          />
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "radio":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className={`space-y-2 ${field.inline ? "flex flex-wrap gap-4" : ""}`}>
            {field.options?.map((opt: any) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register(field.name)}
                    className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div key={field.name} className={field.className}>
          <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
            <input
              type="checkbox"
              {...register(field.name)}
              disabled={field.disabled}
              className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
            />
            <span>
              {field.checkboxLabel || field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-6.5">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1 ml-6.5">{errorMessage}</p>
          )}
        </div>
      );

    case "switch":
      return (
        <div key={field.name} className={field.className}>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-355">
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
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      );

    case "tags":
      return (
        <div key={field.name} className={field.className}>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-355 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: { value, onChange } }) => (
              <TagsInput
                value={value}
                onChange={onChange}
                placeholder={field.placeholder}
                suggestions={field.suggestions}
              />
            )}
          />
          {field.helpText && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helpText}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
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

  // Tabbed wizard states & memoized tabs configurations
  const TABS = useMemo(() => [
    { id: "basic", label: "Basic Info", icon: FileText, fields: ["basicInfo"] },
    { id: "media", label: "Images & Videos", icon: ImageIcon, fields: ["images", "videos"] },
    { id: "pricing", label: "Price & Stock", icon: Coins, fields: ["price", "stockStatus", "stockQuantity", "comboPricing"] },
    { id: "variants", label: "Variants & Specs", icon: Sliders, fields: ["variants", "specifications"] },
    { id: "shipping", label: "Shipping & Extra", icon: Truck, fields: ["shippingDetails", "additionalInfo"] },
    { id: "seo", label: "SEO & Tags", icon: Search, fields: ["seo", "tags"] },
  ], []);

  const [activeTab, setActiveTab] = useState("basic");

  const getTabErrors = useCallback((tabFields: string[]) => {
    return tabFields.some((field) => !!errors[field as keyof typeof errors]);
  }, [errors]);

  const handlePrevTab = useCallback(() => {
    const currentIdx = TABS.findIndex((t) => t.id === activeTab);
    if (currentIdx > 0) {
      setActiveTab(TABS[currentIdx - 1].id);
    }
  }, [activeTab, TABS]);

  const handleNextTab = useCallback(() => {
    const currentIdx = TABS.findIndex((t) => t.id === activeTab);
    if (currentIdx < TABS.length - 1) {
      setActiveTab(TABS[currentIdx + 1].id);
    }
  }, [activeTab, TABS]);

  const onValidationError = useCallback((errs: any) => {
    console.log("Form validation failed:", errs);
    // Find the first tab that has fields with errors and navigate there
    const firstTabWithError = TABS.find((tab) =>
      tab.fields.some((field) => !!errs[field])
    );
    if (firstTabWithError) {
      setActiveTab(firstTabWithError.id);
    }
  }, [TABS]);

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
  const activeIdx = TABS.findIndex((t) => t.id === activeTab);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onValidationError)}
      className="w-full space-y-6"
    >
      {/* Horizontal Tabs / Step Indicator */}
      <div className="relative mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Horizontal Connecting Line (Background) */}
        <div className="absolute top-6 left-[8%] right-[8%] h-0.5 bg-slate-100 dark:bg-slate-850 -z-0 hidden md:block" />

        {/* Horizontal Connecting Line (Active Blue Progress animation) */}
        <div className="absolute top-6 left-[8%] right-[8%] h-0.5 -z-0 hidden md:block">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(activeIdx / (TABS.length - 1)) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>

        <div className="relative flex flex-row justify-between items-center z-10 w-full overflow-x-auto gap-4 py-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasError = getTabErrors(tab.fields);
            const tabIdx = TABS.findIndex((t) => t.id === tab.id);
            const isCompletedOrActive = tabIdx <= activeIdx;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-2 text-center group cursor-pointer focus:outline-none flex-1 min-w-[75px]"
              >
                {/* Active Indicator Spring Scale Animation */}
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all relative ${
                    hasError
                      ? "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-500"
                      : isCompletedOrActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-none"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {hasError && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      !
                    </span>
                  )}
                </motion.div>
                <span
                  className={`text-[10px] md:text-xs font-semibold tracking-wide transition-colors ${
                    hasError
                      ? "text-red-500"
                      : isActive
                      ? "text-blue-600 dark:text-blue-450"
                      : isCompletedOrActive
                      ? "text-blue-600/80 dark:text-blue-450/80"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB CONTENTS (Animate Entrance Switch)                          */}
      {/* ============================================================== */}

      {/* Tab 1: Basic Info */}
      <div className={activeTab === "basic" ? "block" : "hidden"}>
        <motion.div
          key="basic"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-3 border-b border-slate-100 dark:border-slate-850">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {basicInfoFieldsSlice1.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  watch={watch}
                  control={control}
                />
              ))}
            </div>
            <div className="mt-4">
              <FieldRenderer
                field={basicInfoFields[6]}
                register={register}
                errors={errors}
                watch={watch}
                control={control}
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
                  control={control}
                />
              ))}
            </div>
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
              <KeyFeaturesField control={control} register={register} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 2: Media */}
      <div className={activeTab === "media" ? "block" : "hidden"}>
        <motion.div
          key="media"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
            <ImagesField control={control} register={register} errors={errors} />
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <VideosField
                control={control}
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 3: Price & Inventory */}
      <div className={activeTab === "pricing" ? "block" : "hidden"}>
        <motion.div
          key="pricing"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-3 border-b border-slate-100 dark:border-slate-850">
              Price & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priceStockFields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  watch={watch}
                  control={control}
                />
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
              <ComboPricingField
                control={control}
                register={register}
                errors={errors}
                watch={watch}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 4: Variants & Specs */}
      <div className={activeTab === "variants" ? "block" : "hidden"}>
        <motion.div
          key="variants"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
            <VariantsField control={control} register={register} errors={errors} />
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <SpecificationsField
                control={control}
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 5: Shipping & Delivery */}
      <div className={activeTab === "shipping" ? "block" : "hidden"}>
        <motion.div
          key="shipping"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-3 border-b border-slate-100 dark:border-slate-850">
              Shipping & Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shippingFieldsSlice1.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  watch={watch}
                  control={control}
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
                  control={control}
                />
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 space-y-6">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-2 border-b border-slate-100 dark:border-slate-850">
                Warranty & Return Policies
              </h2>
              <div className="space-y-4">
                {additionalInfoFields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 6: SEO & Tags */}
      <div className={activeTab === "seo" ? "block" : "hidden"}>
        <motion.div
          key="seo"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-3 border-b border-slate-100 dark:border-slate-850">
                Search Engine Optimization (SEO)
              </h2>
              <div className="space-y-4">
                {seoFields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                  />
                ))}
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 md:p-6 space-y-6">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-205 pb-3 border-b border-slate-100 dark:border-slate-850">
                Tags & Categorization
              </h2>
              <div className="space-y-4">
                {tagsField.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Linear Navigation Controls & Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevTab}
            disabled={activeTab === TABS[0].id}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleNextTab}
            disabled={activeTab === TABS[TABS.length - 1].id}
            className="flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => form.reset()}
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto"
          >
            {isSubmitting || isUploading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
