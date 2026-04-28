import React from 'react';

interface InvoiceTemplateProps {
  order: any;
}

const InvoiceTemplate4: React.FC<InvoiceTemplateProps> = ({ order }) => {
  const {
    _id,
    createdAt,
    billingInformation,
    items,
    totalAmount,
    paymentInfo,
    // courierCharge,
  } = order;

  return (
    <div className="p-10 text-slate-800 font-sans border-2 border-slate-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
        <div>
           <h1 className="text-3xl font-black text-blue-600 tracking-tighter uppercase italic">BestBuy4uBd</h1>
           <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Premium Electronics Hub</p>
        </div>
        <div className="text-right">
            <h2 className="text-xl font-black text-slate-900 uppercase">Purchase Order</h2>
            <div className="text-xs font-bold text-slate-500 mt-1">
                <p>PO No: <span className="text-blue-600">#{_id?.slice(-6).toUpperCase()}</span></p>
                <p>Date: {new Date(createdAt).toLocaleDateString()}</p>
                <p>Status: <span className="text-green-600 uppercase italic">Confirmed</span></p>
            </div>
        </div>
      </div>

      {/* Supplier & Delivery Info */}
      <div className="grid grid-cols-2 gap-0 mb-6 overflow-hidden rounded-md border border-blue-600">
        <div className="col-span-1">
            <div className="bg-blue-600 text-white p-2 text-[10px] font-black uppercase tracking-widest px-4">Supplier</div>
            <div className="p-4 space-y-1 text-sm border-r border-slate-100 h-full">
                <p className="font-black text-slate-900">BestBuy4uBd Office</p>
                <p className="text-slate-500">Suite 12, Floor 4, Plaza Tower</p>
                <p className="text-slate-500">Dhaka, Bangladesh, 1212</p>
                <p className="text-blue-600 font-bold mt-2 pt-2 border-t border-slate-50 underline underline-offset-4 decoration-blue-600">Contact: support@bb4u.com</p>
            </div>
        </div>
        <div className="col-span-1">
            <div className="bg-blue-600 text-white p-2 text-[10px] font-black uppercase tracking-widest px-4">Delivery Address</div>
            <div className="p-4 space-y-1 text-sm bg-slate-50/50 h-full">
                <p className="font-black text-slate-900">{billingInformation?.name}</p>
                <p className="text-slate-500">{billingInformation?.address}</p>
                <p className="text-slate-500">{billingInformation?.country}</p>
                <p className="text-blue-600 font-bold mt-2 pt-2 border-t border-slate-50 italic">ATTN: {billingInformation?.phone}</p>
            </div>
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-4 gap-0 mb-6 border border-slate-200 rounded-md overflow-hidden">
        <div className="p-4 border-r border-slate-200 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Order Date</p>
            <p className="text-xs font-bold">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="p-4 border-r border-slate-200 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Requested By</p>
            <p className="text-xs font-bold truncate px-2">{billingInformation?.name}</p>
        </div>
        <div className="p-4 border-r border-slate-200 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Approved By</p>
            <p className="text-xs font-bold uppercase italic text-slate-400">System Verified</p>
        </div>
        <div className="p-4 text-center bg-blue-50/30">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Method</p>
            <p className="text-xs font-bold capitalize">{paymentInfo?.paymentMethod || 'Credit'}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white uppercase text-[10px] font-black tracking-widest">
              <th className="p-3 pl-6">Item Name</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right pr-6">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 border-x border-slate-100">
            {items.map((item: any, idx: number) => (
              <tr key={idx} className="group hover:bg-slate-50 bg-white">
                <td className="p-4 pl-6">
                  <p className="font-black text-slate-800 text-xs">
                    {item.product?.basicInfo?.title || item.itemKey}
                  </p>
                  {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                    <div className="flex flex-wrap gap-x-3 mt-1 underline-offset-2 decoration-blue-100 italic">
                      {Object.entries(item.selectedVariants).map(([group, variants]: [string, any]) => (
                        Array.isArray(variants) ? variants.map((v: any, vIdx: number) => (
                          <span key={`${group}-${vIdx}`} className="text-[8px] text-blue-500 font-bold uppercase">
                            {group}: {v.value}
                          </span>
                        )) : (
                          <span key={group} className="text-[8px] text-blue-500 font-bold uppercase">
                            {group}: {variants.value}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-medium">SKU: BB-{item.product?._id?.slice(-4).toUpperCase() || 'TRK-001'}</p>
                </td>
                <td className="p-4 text-center text-xs font-bold text-slate-600">{item.quantity}</td>
                <td className="p-4 text-right text-xs text-slate-500 font-medium">৳{item.price?.toLocaleString()}</td>
                <td className="p-4 text-right pr-6 text-xs font-black text-slate-900 bg-slate-50/20">৳{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 text-white font-black text-sm">
                <td colSpan={3} className="p-3 pl-6 text-right uppercase tracking-[0.2em] text-[10px]">Grand Order Total:</td>
                <td className="p-3 text-right pr-6 text-lg tracking-tighter">৳{totalAmount?.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      <div className="mt-12 p-6 bg-slate-50 border-l-4 border-blue-600 rounded-r-md">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Internal Notes / Instructions:</p>
        <p className="text-xs leading-relaxed text-slate-600">{billingInformation?.notes || 'No additional instructions provided for this order.'}</p>
      </div>

      {/* Verification */}
      <div className="mt-12 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 BestBuy4uBd • Automated PO Generation System</p>
          <p>Verified on: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate4;
