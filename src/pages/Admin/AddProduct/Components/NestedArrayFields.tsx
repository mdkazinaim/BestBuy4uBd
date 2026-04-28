import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { ProductFormValues } from "./Product";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { memo, useState, useEffect } from "react";

// ============================================
// 🖼️ Images Array Component
// ============================================
interface ImagesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const ImagesField = memo(
  ({ control, register, errors }: ImagesFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "images",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Product Images
          </h3>
          <button
            type="button"
            onClick={() => append({ url: "", alt: "", file: undefined })}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            // Keep a temporary preview URL in state for user-selected files
            // We can't use React state easily in this map without a sub-component,
            // but we can register an onChange to intercept and store the file in RHF.
            // Wait, we can extract a subcomponent or just use `watch("images")` but we don't have `watch` prop here.
            // Since we want previews, let's actually just use a simple sub-component or let the user see the file path.
            return (
              <ImageUploadItem
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={() => remove(index)}
                isRemovable={fields.length > 1}
                control={control}
              />
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No images added yet</p>
          </div>
        )}
      </div>
    );
  },
);

// Extracted sub-component to handle local state for file preview
import { useWatch } from "react-hook-form";

const ImageUploadItem = memo(
  ({ index, register, errors, onRemove, isRemovable, control }: any) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileField = useWatch({ control, name: `images.${index}.file` });
    const urlField = useWatch({ control, name: `images.${index}.url` });

    useEffect(() => {
      if (fileField && fileField.length > 0) {
        const pUrl = URL.createObjectURL(fileField[0]);
        setPreviewUrl(pUrl);
        return () => URL.revokeObjectURL(pUrl);
      } else {
        setPreviewUrl(null);
      }
    }, [fileField]);

    const displayUrl = previewUrl || urlField || null;

    return (
      <div className="p-4 border border-border rounded-xl bg-white shadow-sm">
        <div className="flex items-start gap-4 flex-col md:flex-row">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File OR
                </label>
                <input
                  {...register(`images.${index}.file`)}
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-blue/10 file:text-primary-blue hover:file:bg-primary-blue/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (if not uploading){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register(`images.${index}.url`)}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                {errors.images?.[index]?.url && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.images[index]?.url?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`images.${index}.alt`)}
                type="text"
                placeholder="Descriptive alt text for accessibility"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              {errors.images?.[index]?.alt && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.images[index]?.alt?.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={!isRemovable}
            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove image"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  },
);

ImagesField.displayName = "ImagesField";

// ============================================
// 🎥 Videos Array Component
// ============================================
interface VideosFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const VideosField = memo(
  ({ control, register, errors }: VideosFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "videos",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Product Videos
          </h3>
          <button
            type="button"
            onClick={() =>
              append({
                url: "",
                title: "",
                platform: "youtube",
                thumbnail: "",
                file: undefined,
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <VideoUploadItem
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
              control={control}
            />
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No videos added yet</p>
          </div>
        )}
      </div>
    );
  },
);

VideosField.displayName = "VideosField";

const VideoUploadItem = memo(
  ({ index, register, errors, onRemove, control }: any) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileField = useWatch({ control, name: `videos.${index}.file` });
    const urlField = useWatch({ control, name: `videos.${index}.url` });

    useEffect(() => {
      if (fileField && fileField.length > 0) {
        const pUrl = URL.createObjectURL(fileField[0]);
        setPreviewUrl(pUrl);
        return () => URL.revokeObjectURL(pUrl);
      } else {
        setPreviewUrl(null);
      }
    }, [fileField]);

    const displayUrl = previewUrl || urlField || null;

    return (
      <div className="p-4 border border-border rounded-xl bg-white shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-primary-blue">
              Video #{index + 1}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove video"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {displayUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center h-48 sm:h-64">
              <video
                src={displayUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video OR
              </label>
              <input
                {...register(`videos.${index}.file`)}
                type="file"
                accept="video/*"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-blue/10 file:text-primary-blue hover:file:bg-primary-blue/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL (if not uploading){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`videos.${index}.url`)}
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              {errors.videos?.[index]?.url && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.videos[index]?.url?.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`videos.${index}.title`)}
                type="text"
                placeholder="Review Video, Unboxing, etc."
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              {errors.videos?.[index]?.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.videos[index]?.title?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                {...register(`videos.${index}.platform`)}
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="direct">Direct URL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL (Optional)
            </label>
            <input
              {...register(`videos.${index}.thumbnail`)}
              type="url"
              placeholder="Custom thumbnail image URL"
              className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        </div>
      </div>
    );
  },
);

// ============================================
// 🔑 Key Features Array Component
// ============================================
interface KeyFeaturesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

export const KeyFeaturesField = memo(
  ({ control, register }: KeyFeaturesFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "basicInfo.keyFeatures" as any,
    });

    const handleAppend = () => {
      append("" as any);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
          <button
            type="button"
            onClick={handleAppend}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-blue/10 text-primary-blue rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <input
                {...register(`basicInfo.keyFeatures.${index}` as const)}
                type="text"
                placeholder="Enter a key feature"
                className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove feature"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

KeyFeaturesField.displayName = "KeyFeaturesField";

// ============================================
// 🎨 Variants Array Component
// ============================================
interface VariantsFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const VariantsField = memo(
  ({ control, register, errors }: VariantsFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "variants",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Product Variants
          </h3>
          <button
            type="button"
            onClick={() =>
              append({ group: "", items: [{ value: "", price: 0, stock: 0 }] })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variant Group
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, variantIndex) => (
            <VariantGroup
              key={field.id}
              variantIndex={variantIndex}
              control={control}
              register={register}
              errors={errors}
              onRemove={() => remove(variantIndex)}
            />
          ))}
        </div>
      </div>
    );
  },
);

VariantsField.displayName = "VariantsField";

// Variant Group Component
function VariantGroup({
  variantIndex,
  control,
  register,
  errors,
  onRemove,
}: {
  variantIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.items`,
  });

  return (
    <div className="p-4 border-2 border-border rounded-xl bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <input
          {...register(`variants.${variantIndex}.group`)}
          type="text"
          placeholder="Variant group name (e.g., Color, Size)"
          className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        />
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove variant group"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {errors.variants?.[variantIndex]?.group && (
        <p className="text-xs text-red-500 mb-2">
          {errors.variants[variantIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-4 gap-2 p-3 bg-white rounded-lg"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.value`,
                )}
                type="text"
                placeholder="e.g., Red"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.price`,
                  {
                    valueAsNumber: true,
                  },
                )}
                type="number"
                placeholder="0"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.stock`,
                  {
                    valueAsNumber: true,
                  },
                )}
                type="number"
                placeholder="0"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ value: "", price: 0, stock: 0 })}
        className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-blue hover:text-primary-blue transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}

// ============================================
// 📋 Specifications Array Component
// ============================================
interface SpecificationsFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const SpecificationsField = memo(
  ({ control, register, errors }: SpecificationsFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "specifications",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Specifications
          </h3>
          <button
            type="button"
            onClick={() =>
              append({ group: "", items: [{ name: "", value: "" }] })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Specification Group
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, specIndex) => (
            <SpecificationGroup
              key={field.id}
              specIndex={specIndex}
              control={control}
              register={register}
              errors={errors}
              onRemove={() => remove(specIndex)}
            />
          ))}
        </div>
      </div>
    );
  },
);

SpecificationsField.displayName = "SpecificationsField";

// Specification Group Component
function SpecificationGroup({
  specIndex,
  control,
  register,
  errors,
  onRemove,
}: {
  specIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `specifications.${specIndex}.items`,
  });

  return (
    <div className="p-4 border-2 border-border rounded-xl bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <input
          {...register(`specifications.${specIndex}.group`)}
          type="text"
          placeholder="Specification group name (e.g., General, Display)"
          className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        />
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove specification group"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {errors.specifications?.[specIndex]?.group && (
        <p className="text-xs text-red-500 mb-2">
          {errors.specifications[specIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-3 gap-2 p-3 bg-white rounded-lg"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                {...register(
                  `specifications.${specIndex}.items.${itemIndex}.name`,
                )}
                type="text"
                placeholder="e.g., Screen Size"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                {...register(
                  `specifications.${specIndex}.items.${itemIndex}.value`,
                )}
                type="text"
                placeholder="e.g., 6.5 inches"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ name: "", value: "" })}
        className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-blue hover:text-primary-blue transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}
// ============================================
// 💰 Combo Pricing Array Component
// ============================================
interface ComboPricingFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: any;
}

export const ComboPricingField = memo(
  ({ control, register, errors, watch }: ComboPricingFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "comboPricing",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Combo Pricing (Buy More, Save More)
          </h3>
          <button
            type="button"
            onClick={() =>
              append({ minQuantity: 2, discount: 0, discountType: "total" })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Offer
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-border rounded-xl bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`comboPricing.${index}.minQuantity`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="2"
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                  {errors.comboPricing?.[index]?.minQuantity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.comboPricing[index]?.minQuantity?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`comboPricing.${index}.discount`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                  {errors.comboPricing?.[index]?.discount && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.comboPricing[index]?.discount?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apply Discount To <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`comboPricing.${index}.discountType`)}
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
                    defaultValue="total"
                  >
                    <option value="total">Total Amount</option>
                    <option value="per_product">Each Product</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove tier"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                {watch(`comboPricing.${index}.discountType`) === "per_product"
                  ? `User will get ৳${watch(`comboPricing.${index}.discount`) || 0} OFF on EACH product when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more items (Total: ৳${(watch(`comboPricing.${index}.discount`) || 0) * (watch(`comboPricing.${index}.minQuantity`) || 0)} OFF for ${watch(`comboPricing.${index}.minQuantity`) || 0} items)`
                  : `User will get ৳${watch(`comboPricing.${index}.discount`) || 0} OFF on TOTAL amount when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more items`}
              </p>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500">No bulk pricing tiers defined.</p>
          </div>
        )}
      </div>
    );
  },
);

ComboPricingField.displayName = "ComboPricingField";
