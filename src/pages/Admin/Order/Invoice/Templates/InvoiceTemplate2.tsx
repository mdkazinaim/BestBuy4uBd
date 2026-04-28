import React from 'react';

interface InvoiceTemplateProps {
  order: any;
}

const InvoiceTemplate2: React.FC<InvoiceTemplateProps> = ({ order }) => {
  const {
    _id,
    createdAt,
    billingInformation,
    items,
    totalAmount,
    paymentInfo,
  } = order;

  return (
    <div className="p-12 text-gray-700 font-sans border-t-[12px] border-teal-600">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 uppercase">Invoice</h1>
          <div className="space-y-1">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">BestBuy4uBd</p>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-gray-900 flex items-center justify-center text-white text-2xl font-black rounded-sm ml-auto mb-2">
            BB
          </div>
          <div className="space-y-1 text-[10px] uppercase font-bold text-gray-400">
            <p>Invoice No: <span className="text-gray-900">#{_id?.slice(-6).toUpperCase()}</span></p>
            <p>Date: <span className="text-gray-900">{new Date(createdAt).toLocaleDateString()}</span></p>
          </div>
        </div>
      </div>

      {/* Hero Info */}
      <div className="grid grid-cols-4 gap-0 mb-8 bg-gray-900 text-white">
        <div className="p-4 col-span-1 border-r border-gray-800">
          <p className="text-[8px] uppercase font-bold text-teal-400 mb-1">Customer</p>
          <p className="text-xs font-bold truncate">{billingInformation?.name || "Customer"}</p>
        </div>
        <div className="p-4 col-span-1 border-r border-gray-800">
          <p className="text-[8px] uppercase font-bold text-teal-400 mb-1">Issue Date</p>
          <p className="text-xs font-bold">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="p-4 col-span-1 border-r border-gray-800">
          <p className="text-[8px] uppercase font-bold text-teal-400 mb-1">Status</p>
          <p className="text-xs font-bold capitalize">{paymentInfo?.status || "Pending"}</p>
        </div>
        <div className="p-4 col-span-1 bg-teal-600">
          <p className="text-[8px] uppercase font-bold text-white/70 mb-1">Total Due</p>
          <p className="text-lg font-black">৳{totalAmount?.toLocaleString()}</p>
        </div>
      </div>

      {/* Bill To Info */}
      <div className="mb-8">
        <h2 className="text-[10px] uppercase font-bold text-gray-400 mb-2 border-b pb-1">Billing Information</h2>
        <div className="grid grid-cols-2 gap-12 text-xs">
          <div>
            <p className="font-bold text-gray-900">{billingInformation?.name}</p>
            <p className="text-gray-500">{billingInformation?.address}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">{billingInformation?.phone}</p>
            <p className="text-gray-500">{billingInformation?.email}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-16">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-500 border-y border-gray-100">
              <th className="p-4">Item Description</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-right">Rate</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any, idx: number) => (
              <tr key={idx} className="group hover:bg-teal-50/20 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-gray-900 text-sm">
                    {item.product?.basicInfo?.title || item.itemKey}
                  </p>
                  {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {Object.entries(item.selectedVariants).map(([group, variants]: [string, any]) => (
                        Array.isArray(variants) ? variants.map((v: any, vIdx: number) => (
                          <span key={`${group}-${vIdx}`} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                            {group}: {v.value}
                          </span>
                        )) : (
                          <span key={group} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                            {group}: {variants.value}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 uppercase mt-1">PRODUCT ID: {item.product?._id?.slice(-6) || 'N/A'}</p>
                </td>
                <td className="p-4 text-center text-sm font-medium">{item.quantity}</td>
                <td className="p-4 text-right text-sm text-gray-500">৳{item.price?.toLocaleString()}</td>
                <td className="p-4 text-right text-sm font-black text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subtotal & Footer Info */}
      <div className="grid grid-cols-2 gap-16">
        <div>
          <div className="pt-20">
            <div className="w-48 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-[10px] font-black uppercase text-gray-400">Authorized Signature</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-400 uppercase text-[10px]">Subtotal:</span>
            <span className="font-bold">৳{totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
            <span className="font-black text-teal-600 uppercase text-xs">Total Amount:</span>
            <span className="text-2xl font-black text-gray-900">৳{totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-24 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
        BestBuy4uBd • Trusted Electronics Partner • Dhaka
      </div>
    </div>
  );
};

export default InvoiceTemplate2;
