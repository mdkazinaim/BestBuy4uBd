import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, ProductFormValues } from "./Product";
import { FieldArrayButtons, Input } from "./FormHelpers";
import { JSX } from "react";

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
};

// Reusable FieldArray Section Component
function ArraySection<T>({
  label,
  fields,
  append,
  remove,
  renderItem,
}: {
  label: string;
  fields: T[];
  append: () => void;
  remove: (index: number) => void;
  renderItem: (item: T, idx: number) => JSX.Element;
}) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold">{label}</h3>
      {fields.map((item, idx) => (
        <div key={idx} className="border p-2 mb-2 rounded">
          {renderItem(item, idx)}
          <FieldArrayButtons
            append={append}
            remove={remove}
            index={idx}
            length={fields.length}
          />
        </div>
      ))}
      <button
        type="button"
        className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-sm"
        onClick={append}
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );
}

// Component for individual variant item (fixes hooks violation)
function VariantItem({
  vIdx,
  control,
  register,
  errors,
  removeVariant,
}: {
  vIdx: number;
  control: any;
  register: any;
  errors: any;
  removeVariant: (index: number) => void;
}) {
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `variants.${vIdx}.items`,
  });

  return (
    <div className="border p-2 mb-2 rounded">
      <Input
        register={register}
        name={`variants.${vIdx}.group`}
        label="Variant Group"
        error={errors.variants?.[vIdx]?.group?.message}
      />
      {items.map((_, iIdx) => (
        <div key={iIdx} className="ml-4 grid grid-cols-3 gap-2 mt-2">
          <Input
            register={register}
            name={`variants.${vIdx}.items.${iIdx}.value`}
            label="Value"
            error={errors.variants?.[vIdx]?.items?.[iIdx]?.value?.message}
          />
          <Input
            register={register}
            name={`variants.${vIdx}.items.${iIdx}.price`}
            label="Price"
            type="number"
            error={errors.variants?.[vIdx]?.items?.[iIdx]?.price?.message}
          />
          <Input
            register={register}
            name={`variants.${vIdx}.items.${iIdx}.stock`}
            label="Stock"
            type="number"
            error={errors.variants?.[vIdx]?.items?.[iIdx]?.stock?.message}
          />
        </div>
      ))}
      <FieldArrayButtons
        append={() => appendItem({ value: "", price: 0, stock: 0 })}
        remove={removeItem}
        index={0}
        length={items.length}
      />
      <button
        type="button"
        className="mt-2 px-3 py-1 rounded bg-red-500 text-white text-sm"
        onClick={() => removeVariant(vIdx)}
      >
        Remove Variant Group
      </button>
    </div>
  );
}

// Component for individual specification item (fixes hooks violation)
function SpecificationItem({
  sIdx,
  control,
  register,
  errors,
  removeSpec,
}: {
  sIdx: number;
  control: any;
  register: any;
  errors: any;
  removeSpec: (index: number) => void;
}) {
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `specifications.${sIdx}.items`,
  });

  return (
    <div className="border p-2 mb-2 rounded">
      <Input
        register={register}
        name={`specifications.${sIdx}.group`}
        label="Spec Group"
        error={errors.specifications?.[sIdx]?.group?.message}
      />
      {items.map((_, iIdx) => (
        <div key={iIdx} className="ml-4 grid grid-cols-2 gap-2 mt-2">
          <Input
            register={register}
            name={`specifications.${sIdx}.items.${iIdx}.name`}
            label="Name"
            error={
              errors.specifications?.[sIdx]?.items?.[iIdx]?.name?.message
            }
          />
          <Input
            register={register}
            name={`specifications.${sIdx}.items.${iIdx}.value`}
            label="Value"
            error={
              errors.specifications?.[sIdx]?.items?.[iIdx]?.value?.message
            }
          />
        </div>
      ))}
      <FieldArrayButtons
        append={() => appendItem({ name: "", value: "" })}
        remove={removeItem}
        index={0}
        length={items.length}
      />
      <button
        type="button"
        className="mt-2 px-3 py-1 rounded bg-red-500 text-white text-sm"
        onClick={() => removeSpec(sIdx)}
      >
        Remove Spec Group
      </button>
    </div>
  );
}

export default function ProductForm({ defaultValues, onSubmit }: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultValues ?? {
      basicInfo: { keyFeatures: [], addDeliveryCharge: false },
      price: {},
      stockStatus: "In Stock",
      sold: 0,
      images: [{ url: "", alt: "" }],
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
    formState: { errors },
  } = form;

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specifications" });
  const {
    fields: keyFeatureFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({ control, name: "basicInfo.keyFeatures" as any });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto p-4 space-y-6">
      {/* Basic Info */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Basic Info</h2>
        <Input
          register={register}
          name="basicInfo.title"
          label="Title"
          error={errors.basicInfo?.title?.message}
        />
        <Input
          register={register}
          name="basicInfo.productCode"
          label="Product Code (SKU)"
          error={errors.basicInfo?.productCode?.message}
        />
        <Input
          register={register}
          name="basicInfo.brand"
          label="Brand"
          error={errors.basicInfo?.brand?.message}
        />
        <Input
          register={register}
          name="basicInfo.category"
          label="Category"
          error={errors.basicInfo?.category?.message}
        />
        <Input
          register={register}
          name="basicInfo.subcategory"
          label="Subcategory"
          error={errors.basicInfo?.subcategory?.message}
        />

        <label className="block mt-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            {...register("basicInfo.description")}
            rows={3}
            className="mt-1 block w-full rounded border px-2 py-1"
          />
          {errors.basicInfo?.description && (
            <p className="text-xs text-red-600">
              {errors.basicInfo.description.message}
            </p>
          )}
        </label>

        <ArraySection
          label="Key Features"
          fields={keyFeatureFields}
          append={() => appendKeyFeature("" as any)}
          remove={removeKeyFeature}
          renderItem={(_, idx) => (
            <input
              {...register(`basicInfo.keyFeatures.${idx}`)}
              className="mt-1 block w-full rounded border px-2 py-1"
            />
          )}
        />
      </section>

      {/* Images */}
      <ArraySection
        label="Images"
        fields={imageFields}
        append={() => appendImage({ url: "", alt: "" })}
        remove={removeImage}
        renderItem={(_, idx) => (
          <div className="grid grid-cols-2 gap-2">
            <Input
              register={register}
              name={`images.${idx}.url`}
              label="Image URL"
              error={errors.images?.[idx]?.url?.message}
            />
            <Input
              register={register}
              name={`images.${idx}.alt`}
              label="Alt Text"
              error={errors.images?.[idx]?.alt?.message}
            />
          </div>
        )}
      />

      {/* Price & Inventory */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Price & Inventory</h2>
        <div className="grid grid-cols-3 gap-4">
          <Input
            register={register}
            name="price.regular"
            label="Regular Price"
            type="number"
            error={errors.price?.regular?.message}
          />
          <Input
            register={register}
            name="price.discounted"
            label="Discounted Price"
            type="number"
            error={errors.price?.discounted?.message}
          />
          <Input
            register={register}
            name="price.baseVariantName"
            label="Base Variant Name (e.g. 250 ML)"
            placeholder="e.g. 250 ML"
            error={errors.price?.baseVariantName?.message}
          />
        </div>

        <label className="block mt-2">
          <span className="text-sm font-medium">Stock Status</span>
          <select
            {...register("stockStatus")}
            className="mt-1 block rounded border px-2 py-1"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre-order">Pre-order</option>
          </select>
        </label>

        <Input
          register={register}
          name="stockQuantity"
          label="Stock Quantity"
          type="number"
          error={errors.stockQuantity?.message}
        />
      </section>

      {/* Variants */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Variants</h2>
        {variantFields.map((field, vIdx) => (
          <VariantItem
            key={field.id}
            vIdx={vIdx}
            control={control}
            register={register}
            errors={errors}
            removeVariant={removeVariant}
          />
        ))}
        <button
          type="button"
          className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-sm"
          onClick={() => appendVariant({ group: "", items: [] })}
        >
          Add Variant
        </button>
      </section>

      {/* Specifications */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Specifications</h2>
        {specFields.map((field, sIdx) => (
          <SpecificationItem
            key={field.id}
            sIdx={sIdx}
            control={control}
            register={register}
            errors={errors}
            removeSpec={removeSpec}
          />
        ))}
        <button
          type="button"
          className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-sm"
          onClick={() => appendSpec({ group: "", items: [] })}
        >
          Add Specification
        </button>
      </section>

      {/* Shipping */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Shipping Details</h2>
        <div className="grid grid-cols-3 gap-2">
          <Input
            register={register}
            name="shippingDetails.length"
            label="Length"
            type="number"
            error={errors.shippingDetails?.length?.message}
          />
          <Input
            register={register}
            name="shippingDetails.width"
            label="Width"
            type="number"
            error={errors.shippingDetails?.width?.message}
          />
          <Input
            register={register}
            name="shippingDetails.height"
            label="Height"
            type="number"
            error={errors.shippingDetails?.height?.message}
          />
          <Input
            register={register}
            name="shippingDetails.weight"
            label="Weight"
            type="number"
            error={errors.shippingDetails?.weight?.message}
          />
          <label>
            <span className="text-sm font-medium">Dimension Unit</span>
            <select
              {...register("shippingDetails.dimensionUnit")}
              className="mt-1 block rounded border px-2 py-1"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium">Weight Unit</span>
            <select
              {...register("shippingDetails.weightUnit")}
              className="mt-1 block rounded border px-2 py-1"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </label>
        </div>
      </section>

      {/* SEO */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">SEO</h2>
        <Input
          register={register}
          name="seo.metaTitle"
          label="Meta Title"
          error={errors.seo?.metaTitle?.message}
        />
        <label>
          <span className="text-sm font-medium">Meta Description</span>
          <textarea
            {...register("seo.metaDescription")}
            rows={2}
            className="mt-1 block w-full rounded border px-2 py-1"
          />
          {errors.seo?.metaDescription && (
            <p className="text-xs text-red-600">
              {errors.seo.metaDescription.message}
            </p>
          )}
        </label>
        <Input
          register={register}
          name="seo.slug"
          label="Slug"
          error={errors.seo?.slug?.message}
        />
      </section>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}
