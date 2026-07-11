import React from 'react';

interface InvoiceTemplateProps { order: any; buyerInfo: any; sellerInfo: any; }

const InvoiceTemplate2: React.FC<InvoiceTemplateProps> = ({ order, buyerInfo, sellerInfo }) => {
  const { _id, createdAt, items, totalAmount, paymentInfo, deliveryCharge, discount } = order;
  const subtotal = totalAmount - (deliveryCharge || 0) + (discount || 0);

  return (
    <div className="p-10 font-sans text-slate-800 bg-white">
      <div className="border-b-4 border-slate-900 pb-8 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-widest mb-2">Invoice</h1>
          <p className="text-slate-500 font-mono text-sm">REF: #{_id?.slice(-6).toUpperCase()}</p>
          <p className="text-slate-500 font-mono text-sm">DATE: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          {sellerInfo?.logo && <img src={sellerInfo.logo} alt="Logo" className="h-12 object-contain mb-2" />}
          {sellerInfo?.name && <h2 className="text-2xl font-bold text-slate-900">{sellerInfo?.name}</h2>}
          <p className="text-sm text-slate-600 mt-1">{sellerInfo?.address}</p>
          <p className="text-sm text-slate-600">Phone: {sellerInfo?.phone}</p>
          <p className="text-sm text-slate-600">{sellerInfo?.email}</p>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        <div className="w-1/2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Bill To</h3>
          <p className="font-bold text-slate-900">{buyerInfo?.name}</p>
          {buyerInfo?.address && <p className="text-slate-600 text-sm mt-1">{buyerInfo.address}</p>}
          {buyerInfo?.phone && <p className="text-slate-600 text-sm">{buyerInfo.phone}</p>}
        </div>
      </div>

      <table className="w-full text-left mb-8 border-collapse">
        <thead className="bg-slate-900 text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <tr>
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider border border-slate-900">Description</th>
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-center border border-slate-900">Qty</th>
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-right border border-slate-900">Unit Price</th>
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-right border border-slate-900">Total</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item: any, idx: number) => (
            <tr key={idx} className="border-b border-slate-200">
              <td className="py-4 px-4">
                <p className="font-semibold text-slate-900">{item.product?.basicInfo?.title || item.product?.title || item.itemKey}</p>
                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {Object.entries(item.selectedVariants)
                      .filter(([k]) => k.toLowerCase() !== 'quantity')
                      .map(([k, v]: any) => (
                       <span key={k} className="text-xs text-slate-500">
                         {k}: {Array.isArray(v) ? v[0]?.value : v?.value}
                       </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-4 px-4 text-center text-slate-700">{item.quantity}</td>
              <td className="py-4 px-4 text-right text-slate-700">৳{item.price?.toLocaleString()}</td>
              <td className="py-4 px-4 text-right font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-1/2 max-w-sm">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 text-slate-600">Subtotal</td>
                <td className="py-2 text-right font-medium">৳{subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-600">Shipping</td>
                <td className="py-2 text-right font-medium">{deliveryCharge ? `৳${deliveryCharge.toLocaleString()}` : 'Free'}</td>
              </tr>
              {discount > 0 && (
                <tr>
                  <td className="py-2 text-emerald-600">Discount</td>
                  <td className="py-2 text-right font-medium text-emerald-600">-৳{discount?.toLocaleString()}</td>
                </tr>
              )}
              <tr className="border-t-2 border-slate-900">
                <td className="py-3 font-bold text-slate-900">Total Amount</td>
                <td className="py-3 text-right font-bold text-xl text-slate-900">৳{totalAmount?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mt-16 text-sm text-slate-500 text-center">
        <p className="font-bold text-slate-900 mb-1">Thank you for your business</p>
        <p>Payment Method: {paymentInfo?.paymentMethod || order.paymentMethod || 'COD'} {(paymentInfo?.transactionId || order.transactionId) && `| TrxID: ${paymentInfo?.transactionId || order.transactionId}`}</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate2;
