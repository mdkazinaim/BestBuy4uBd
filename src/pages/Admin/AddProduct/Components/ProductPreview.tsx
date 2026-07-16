import { ProductFormValues } from "./Product";

type Props = { data: ProductFormValues };

export default function ProductPreview({ data }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{data.basicInfo.title}</h1>
      <p className="text-sm text-gray-600">Brand: {data.basicInfo.brand}</p>
      <p className="text-sm text-gray-600">
        Category: {data.basicInfo.category} / {data.basicInfo.subcategory}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {data.images.map((img, i) => (
          <img key={i} src={img.url} alt={img.alt} className="rounded border" />
        ))}
      </div>

      <div
        className="prose [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
        dangerouslySetInnerHTML={{ __html: data.basicInfo.description }}
      />

      <h2 className="text-xl font-semibold mt-4">Price</h2>
      <p>Regular: ${data.price.regular}</p>
      {data.price.discounted && <p>Discounted: ${data.price.discounted}</p>}

      <h2 className="text-xl font-semibold mt-4">Stock</h2>
      <p>{data.stockStatus}</p>
      {data.stockQuantity !== undefined && (
        <p>Quantity: {data.stockQuantity}</p>
      )}

      {data.variants && data.variants.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-4">Variants</h2>
          {data.variants.map((v, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <p className="font-medium">{v.group}</p>
              <ul className="list-disc ml-5">
                {v.items.map((it, k) => (
                  <li key={k}>
                    {it.value} – ${it.price} – stock {it.stock}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.specifications && data.specifications.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-4">Specifications</h2>
          {data.specifications.map((s, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <p className="font-medium">{s.group}</p>
              <table className="text-sm">
                <tbody>
                  {s.items.map((it, k) => (
                    <tr key={k}>
                      <td className="pr-4 font-medium">{it.name}</td>
                      <td>{it.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      <h2 className="text-xl font-semibold mt-4">Shipping</h2>
      {data.shippingDetails ? (
        <p>
          {data.shippingDetails.length || 0}×{data.shippingDetails.width || 0}×
          {data.shippingDetails.height || 0} {data.shippingDetails.dimensionUnit || 'cm'} –{" "}
          {data.shippingDetails.weight || 0} {data.shippingDetails.weightUnit || 'kg'}
        </p>
      ) : (
        <p>No shipping details provided</p>
      )}

      {data.seo?.metaTitle && (
        <>
          <h2 className="text-xl font-semibold mt-4">SEO</h2>
          <p className="text-sm">Meta title: {data.seo.metaTitle}</p>
          <p className="text-sm">
            Meta description: {data.seo.metaDescription}
          </p>
          <p className="text-sm">Slug: {data.seo.slug}</p>
        </>
      )}
    </div>
  );
}
