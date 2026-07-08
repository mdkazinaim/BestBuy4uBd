import React from 'react';

interface InvoiceTemplateProps { order: any; buyerInfo: any; sellerInfo: any; }

const InvoiceTemplate3: React.FC<InvoiceTemplateProps> = ({ order, buyerInfo, sellerInfo }) => {
  const { _id, createdAt, items, totalAmount, paymentInfo, deliveryCharge, discount } = order;
  const subtotal = totalAmount - (deliveryCharge || 0) + (discount || 0);

  return (
    <div className="p-12 font-sans text-slate-600 bg-white">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-light text-slate-900 tracking-widest uppercase mb-4">Invoice</h1>
        <p className="text-xs uppercase tracking-widest">#{_id?.slice(-6).toUpperCase()} • {new Date(createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex justify-between mb-16">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Billed To</p>
          <p className="font-medium text-slate-800">{buyerInfo?.name}</p>
          {buyerInfo?.address && <p className="text-sm mt-1">{buyerInfo.address}</p>}
          {buyerInfo?.phone && <p className="text-sm">{buyerInfo.phone}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">From</p>
          <p className="font-medium text-slate-800">{sellerInfo?.name}</p>
          <p className="text-sm mt-1">{sellerInfo?.address}</p>
          <p className="text-sm">Phone: {sellerInfo?.phone}</p>
          <p className="text-sm">{sellerInfo?.email}</p>
        </div>
      </div>

      <div className="mb-16">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-4 border-b border-slate-200 font-normal text-xs uppercase tracking-widest text-slate-400">Description</th>
              <th className="py-4 border-b border-slate-200 font-normal text-xs uppercase tracking-widest text-slate-400 text-center">Qty</th>
              <th className="py-4 border-b border-slate-200 font-normal text-xs uppercase tracking-widest text-slate-400 text-right">Price</th>
              <th className="py-4 border-b border-slate-200 font-normal text-xs uppercase tracking-widest text-slate-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="py-5 border-b border-slate-100">
                  <p className="text-slate-800">{item.product?.basicInfo?.title || item.product?.title || item.itemKey}</p>
                  {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      {Object.entries(item.selectedVariants)
                        .filter(([k]) => k.toLowerCase() !== 'quantity')
                        .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v[0]?.value : v?.value}`)
                        .join(' • ')}
                    </p>
                  )}
                </td>
                <td className="py-5 border-b border-slate-100 text-center">{item.quantity}</td>
                <td className="py-5 border-b border-slate-100 text-right">৳{item.price?.toLocaleString()}</td>
                <td className="py-5 border-b border-slate-100 text-right text-slate-800">৳{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between py-2 text-sm">
            <span>Subtotal</span>
            <span className="text-slate-800">৳{subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Shipping</span>
            <span className="text-slate-800">{deliveryCharge ? `৳${deliveryCharge.toLocaleString()}` : 'Free'}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-2 text-sm text-slate-400">
              <span>Discount</span>
              <span>-৳{discount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between py-6 mt-4 border-t border-slate-200">
            <span className="text-xs uppercase tracking-widest">Total</span>
            <span className="text-2xl text-slate-900">৳{totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-24 text-center space-y-2">
        <p className="text-sm">Payment: {paymentInfo?.paymentMethod || order.paymentMethod || 'COD'}</p>
        <p className="text-xl uppercase tracking-wide text-slate-400 mb-2">Thank you</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate3;
