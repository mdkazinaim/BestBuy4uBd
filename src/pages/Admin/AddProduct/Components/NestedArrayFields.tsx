import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
  useWatch,
  useFormContext,
  UseFormWatch,
} from "react-hook-form";
import { ProductFormValues } from "./Product";
import { Plus, Trash2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { memo, useState, useEffect, useMemo } from "react";
import { Button } from "@/common/Components/Button";
import { PopoverSelect } from "./FormHelpers";

// Common input style helper
const textInputClasses = (error: boolean) => 
  `w-full px-3.5 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 ${
    error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 dark:border-slate-800"
  }`;

// ============================================
// 🖼️ Images Array Component
// ============================================
interface ImagesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch?: UseFormWatch<ProductFormValues>;
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
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Product Images
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ url: "", alt: "", file: undefined })}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Image</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <ImageUploadItem
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
              isRemovable={fields.length > 1}
              control={control}
            />
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
            <ImageIcon className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No images added yet</p>
          </div>
        )}
      </div>
    );
  },
);

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
      <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 shadow-none">
        <div className="flex items-start gap-4 flex-col md:flex-row">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                  Upload File
                </label>
                <input
                  {...register(`images.${index}.file`)}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200/85 dark:hover:file:bg-slate-700/80 transition-all cursor-pointer h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                  Image URL (alternative to upload)
                </label>
                <input
                  {...register(`images.${index}.url`)}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={textInputClasses(!!errors.images?.[index]?.url)}
                />
                {errors.images?.[index]?.url && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.images[index]?.url?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                Alt Text
              </label>
              <input
                {...register(`images.${index}.alt`)}
                type="text"
                placeholder="Descriptive alt text for SEO & accessibility"
                className={textInputClasses(!!errors.images?.[index]?.alt)}
              />
              {errors.images?.[index]?.alt && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.images[index]?.alt?.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={!isRemovable}
            className="flex-shrink-0 text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9 self-start md:self-center"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
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
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Product Videos
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                url: "",
                title: "",
                platform: "youtube",
                thumbnail: "",
                file: undefined,
              })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </Button>
        </div>

        <div className="space-y-4">
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
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
            <VideoIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No videos added yet</p>
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
      <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 shadow-none">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-450 uppercase tracking-wider">
              Video #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-8 w-8"
              title="Remove video"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {displayUrl && (
            <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center max-h-64 mx-auto border border-slate-800">
              <video
                src={displayUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                Upload Video
              </label>
              <input
                {...register(`videos.${index}.file`)}
                type="file"
                accept="video/*"
                className="w-full text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200/85 dark:hover:file:bg-slate-700/80 transition-all cursor-pointer h-10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                Video URL (alternative to upload) <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`videos.${index}.url`)}
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className={textInputClasses(!!errors.videos?.[index]?.url)}
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`videos.${index}.title`)}
                type="text"
                placeholder="Review Video, Unboxing, Demo, etc."
                className={textInputClasses(!!errors.videos?.[index]?.title)}
              />
              {errors.videos?.[index]?.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.videos[index]?.title?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                Platform
              </label>
              <PopoverSelect
                name={`videos.${index}.platform`}
                control={control}
                options={[
                  { value: "youtube", label: "YouTube" },
                  { value: "vimeo", label: "Vimeo" },
                  { value: "direct", label: "Direct URL" },
                ]}
                placeholder="Select Platform"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
              Thumbnail URL (Optional)
            </label>
            <input
              {...register(`videos.${index}.thumbnail`)}
              type="url"
              placeholder="Custom thumbnail image URL"
              className={textInputClasses(false)}
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

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">Key Features</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("" as any)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature</span>
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium border border-blue-150/40 dark:border-blue-900/30">
                {index + 1}
              </span>
              <input
                {...register(`basicInfo.keyFeatures.${index}` as const)}
                type="text"
                placeholder="Enter a highlights / selling point..."
                className={textInputClasses(false)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="flex-shrink-0 text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9"
                title="Remove feature"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
            <p className="text-sm text-slate-400 dark:text-slate-500">No key features added yet.</p>
          </div>
        )}
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
  watch?: UseFormWatch<ProductFormValues>;
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
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Product Variants
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ group: "", items: [{ value: "", price: 0, stock: 0 }] })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Variant Group</span>
          </Button>
        </div>

        <div className="space-y-6">
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

        {fields.length === 0 && (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
            <p className="text-sm text-slate-400 dark:text-slate-500">No variant groups defined (e.g. Size, Color, etc.)</p>
          </div>
        )}
      </div>
    );
  },
);

VariantsField.displayName = "VariantsField";

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

  const { watch, setValue } = useFormContext<ProductFormValues>();
  const itemsWatch = watch(`variants.${variantIndex}.items`) || [];

  return (
    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 shadow-none">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          {...register(`variants.${variantIndex}.group`)}
          type="text"
          placeholder="Variant group name (e.g., Color, Size)"
          className={textInputClasses(!!errors.variants?.[variantIndex]?.group)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9 shrink-0"
          title="Remove variant group"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {errors.variants?.[variantIndex]?.group && (
        <p className="text-xs text-red-500 mb-3 -mt-2">
          {errors.variants[variantIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-3">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Value
              </label>
              <input
                {...register(`variants.${variantIndex}.items.${itemIndex}.value`)}
                type="text"
                placeholder="e.g., XL, Blue"
                className={textInputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Image
              </label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {(() => {
                    const file = watch(`variants.${variantIndex}.items.${itemIndex}.file`);
                    const existingUrl = watch(`variants.${variantIndex}.items.${itemIndex}.image.url`);
                    const preview = (file && file.length > 0) ? URL.createObjectURL(file[0]) : existingUrl;
                    return preview ? (
                      <img src={preview} alt="variant" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    );
                  })()}
                </div>
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`variants.${variantIndex}.items.${itemIndex}.file`)}
                    className="hidden"
                    id={`file-upload-${variantIndex}-${itemIndex}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full h-[38px] text-[11px] font-medium"
                    onClick={() => {
                      const el = document.getElementById(`file-upload-${variantIndex}-${itemIndex}`);
                      if (el) el.click();
                    }}
                  >
                    Select
                  </Button>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Price (৳)
              </label>
              <input
                {...register(`variants.${variantIndex}.items.${itemIndex}.price`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="0"
                className={textInputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Stock
              </label>
              <input
                {...register(`variants.${variantIndex}.items.${itemIndex}.stock`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="0"
                className={textInputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Base Variant
              </label>
              <label className="flex items-center h-[38px] gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`variants.${variantIndex}.isBaseGroup`}
                  checked={!!itemsWatch[itemIndex]?.isBase}
                  onChange={() => {
                    // Set all items in this variant group to isBase = false, and this one to true
                    itemsWatch.forEach((_, idx) => {
                      setValue(`variants.${variantIndex}.items.${idx}.isBase`, idx === itemIndex);
                    });
                  }}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Make Base</span>
              </label>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 border border-transparent disabled:opacity-30 disabled:pointer-events-none"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ value: "", price: 0, stock: 0, isBase: false })}
        className="mt-3 w-full border border-dashed border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 bg-transparent text-xs"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Item
      </Button>
    </div>
  );
}

// ============================================
// 📋 Specifications Array Component
// ============================================
interface SpecificationsFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors?: FieldErrors<ProductFormValues>;
}

export const SpecificationsField = memo(
  ({ control, register, errors = {} }: SpecificationsFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "specifications",
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Technical Specifications
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                group: "General",
                items: [{ name: "", value: "" }],
              })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Spec Category</span>
          </Button>
        </div>

        <div className="space-y-6">
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

        {fields.length === 0 && (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
            <p className="text-sm text-slate-400 dark:text-slate-500">No specifications defined (e.g. Dimensions, Processor, etc.)</p>
          </div>
        )}
      </div>
    );
  },
);

SpecificationsField.displayName = "SpecificationsField";

function SpecificationGroup({
  specIndex,
  control,
  register,
  errors = {},
  onRemove,
}: {
  specIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors?: FieldErrors<ProductFormValues>;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `specifications.${specIndex}.items`,
  });

  return (
    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 shadow-none">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          {...register(`specifications.${specIndex}.group`)}
          type="text"
          placeholder="Specification group name (e.g., Technical specs, General)"
          className={textInputClasses(!!errors.specifications?.[specIndex]?.group)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9 shrink-0"
          title="Remove specification group"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {errors.specifications?.[specIndex]?.group && (
        <p className="text-xs text-red-500 mb-3 -mt-2">
          {errors.specifications[specIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-3">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Name
              </label>
              <input
                {...register(`specifications.${specIndex}.items.${itemIndex}.name`)}
                type="text"
                placeholder="e.g., Screen Size, Material"
                className={textInputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Value
              </label>
              <input
                {...register(`specifications.${specIndex}.items.${itemIndex}.value`)}
                type="text"
                placeholder="e.g., 6.5 inches, Leather"
                className={textInputClasses(false)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 border border-transparent disabled:opacity-30 disabled:pointer-events-none"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", value: "" })}
        className="mt-3 w-full border border-dashed border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 bg-transparent text-xs"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Item
      </Button>
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

    const watchVariants = watch("variants") || [];
    const baseVariantName = watch("price.baseVariantName") || "Standard";

    const variantOptions = useMemo(() => {
      const options = [{ value: "", label: "All / No Variant Specific" }];
      
      // Add the base variant option
      options.push({ value: baseVariantName, label: `${baseVariantName} (Base Variant)` });

      // Add all other variants from the variants field array
      watchVariants.forEach((group: any) => {
        if (group?.items && Array.isArray(group.items)) {
          group.items.forEach((item: any) => {
            if (item?.value && item.value !== baseVariantName) {
              options.push({
                value: item.value,
                label: `${item.value} (${group.group || "Variant"})`
              });
            }
          });
        }
      });

      return options;
    }, [watchVariants, baseVariantName]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Combo Pricing (Buy More, Save More)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ minQuantity: 2, discount: 0, discountType: "total", variantValue: "" })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Offer Tier</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 shadow-none space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                    Min Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`comboPricing.${index}.minQuantity`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="2"
                    className={textInputClasses(!!errors.comboPricing?.[index]?.minQuantity)}
                  />
                  {errors.comboPricing?.[index]?.minQuantity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.comboPricing[index]?.minQuantity?.message}
                    </p>
                  )}
                </div>

                {["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(watch(`comboPricing.${index}.discountType`)) ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                      Discount Amount (৳)
                    </label>
                    <div className="h-10 px-3 flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-450 italic">
                      N/A (Free Shipping)
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                      Discount Amount (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`comboPricing.${index}.discount`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="0"
                      className={textInputClasses(!!errors.comboPricing?.[index]?.discount)}
                    />
                    {errors.comboPricing?.[index]?.discount && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.comboPricing[index]?.discount?.message}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                    Apply Discount To <span className="text-red-500">*</span>
                  </label>
                  <PopoverSelect
                    name={`comboPricing.${index}.discountType`}
                    control={control}
                    options={[
                      { value: "total", label: "Total Amount" },
                      { value: "per_product", label: "Each Product" },
                      { value: "free_delivery", label: "Free Delivery (All)" },
                      { value: "free_delivery_inside", label: "Free Delivery (Dhaka)" },
                      { value: "free_delivery_outside", label: "Free Delivery (Outside)" },
                    ]}
                    placeholder="Select Type"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                    For Variant <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <PopoverSelect
                    name={`comboPricing.${index}.variantValue`}
                    control={control}
                    options={variantOptions}
                    placeholder="All Pricing"
                  />
                </div>

                <div className="flex justify-end md:justify-center md:pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9"
                    title="Remove tier"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">
                {watch(`comboPricing.${index}.discountType`) === "free_delivery"
                  ? `Customer receives FREE delivery when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more.`
                  : watch(`comboPricing.${index}.discountType`) === "free_delivery_inside"
                  ? `Customer receives FREE delivery INSIDE Dhaka when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more.`
                  : watch(`comboPricing.${index}.discountType`) === "free_delivery_outside"
                  ? `Customer receives FREE delivery OUTSIDE Dhaka when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more.`
                  : watch(`comboPricing.${index}.discountType`) === "per_product"
                  ? `Customer receives ৳${watch(`comboPricing.${index}.discount`) || 0} OFF on EACH unit purchased when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more (Total: ৳${(watch(`comboPricing.${index}.discount`) || 0) * (watch(`comboPricing.${index}.minQuantity`) || 0)} discount).`
                  : `Customer receives ৳${watch(`comboPricing.${index}.discount`) || 0} OFF the aggregate total when buying ${watch(`comboPricing.${index}.minQuantity`) || 0} or more.`}
              </p>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-900/10">
            <p className="text-sm text-slate-400 dark:text-slate-500">No bulk pricing tier guidelines defined.</p>
          </div>
        )}
      </div>
    );
  },
);

ComboPricingField.displayName = "ComboPricingField";

interface BundlesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors?: FieldErrors<ProductFormValues>;
  watch?: any;
  setValue?: any;
}

export const BundlesField = memo(
  ({ control, register, errors = {}, watch, setValue }: BundlesFieldProps) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: "bundles",
    });

    const watchVariants = watch("variants") || [];
    const baseVariantName = watch("price.baseVariantName") || "Standard";

    const availableVariantValues = useMemo(() => {
      const vals: string[] = [];
      vals.push(baseVariantName);
      watchVariants.forEach((group: any) => {
        if (group?.items && Array.isArray(group.items)) {
          group.items.forEach((item: any) => {
            if (item?.value && item.value !== baseVariantName) {
              vals.push(item.value);
            }
          });
        }
      });
      return vals;
    }, [watchVariants, baseVariantName]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Variant Combination Bundles
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ name: "", variants: [] as unknown as [string, ...string[]], discount: 0, discountType: "flat" })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bundle Offer</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const currentVariants: string[] = watch(`bundles.${index}.variants`) || [];
            const discountType = watch(`bundles.${index}.discountType`) || "flat";

            return (
              <div
                key={field.id}
                className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 shadow-none space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                      Bundle Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      {...register(`bundles.${index}.name`)}
                      type="text"
                      placeholder="e.g. Super Combo Pack"
                      className={textInputClasses(!!errors.bundles?.[index]?.name)}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <PopoverSelect
                      name={`bundles.${index}.discountType`}
                      control={control}
                      options={[
                        { value: "flat", label: "Flat Discount (৳)" },
                        { value: "percentage", label: "Percentage (%)" },
                        { value: "free_delivery", label: "Free Delivery (All)" },
                        { value: "free_delivery_inside", label: "Free Delivery (Dhaka)" },
                        { value: "free_delivery_outside", label: "Free Delivery (Outside Dhaka)" },
                      ]}
                      placeholder="Select Type"
                    />
                  </div>

                  {!["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(discountType) && (
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5">
                        Discount Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register(`bundles.${index}.discount`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder={discountType === "percentage" ? "10" : "200"}
                        className={textInputClasses(!!errors.bundles?.[index]?.discount)}
                      />
                    </div>
                  )}

                  <div className={["free_delivery", "free_delivery_inside", "free_delivery_outside"].includes(discountType) ? "md:col-span-4 flex justify-end md:pb-1" : "md:col-span-1 flex justify-end md:pb-1"}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 rounded-lg p-2 h-9 w-9"
                      title="Remove Bundle"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </div>

                {/* Selected Variants Checkboxes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350">
                    Included Variant Items <span className="text-red-500">*</span> (Select 2 or more)
                  </label>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {availableVariantValues.map((vVal) => {
                      const isChecked = currentVariants.includes(vVal);
                      return (
                        <label
                          key={vVal}
                          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-all text-xs font-medium select-none ${
                            isChecked
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? currentVariants.filter((v) => v !== vVal)
                                : [...currentVariants, vVal];
                              setValue(`bundles.${index}.variants`, updated, { shouldValidate: true });
                            }}
                          />
                          <span>{vVal}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.bundles?.[index]?.variants && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.bundles[index]?.variants?.message}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                  {discountType === "free_delivery"
                    ? `Customers receive FREE delivery (all zones) when purchasing: ${currentVariants.join(" + ") || "None"}.`
                    : discountType === "free_delivery_inside"
                    ? `Customers receive FREE delivery INSIDE Dhaka when purchasing: ${currentVariants.join(" + ") || "None"}.`
                    : discountType === "free_delivery_outside"
                    ? `Customers receive FREE delivery OUTSIDE Dhaka when purchasing: ${currentVariants.join(" + ") || "None"}.`
                    : discountType === "percentage"
                    ? `Customers receive ${watch(`bundles.${index}.discount`) || 0}% OFF the combined price of: ${currentVariants.join(" + ") || "None"}.`
                    : `Customers receive ৳${watch(`bundles.${index}.discount`) || 0} OFF the combined price of: ${currentVariants.join(" + ") || "None"}.`}
                </p>
              </div>
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-900/10">
            <p className="text-sm text-slate-400 dark:text-slate-500">No variant combination bundle offers defined.</p>
          </div>
        )}
      </div>
    );
  },
);

BundlesField.displayName = "BundlesField";
