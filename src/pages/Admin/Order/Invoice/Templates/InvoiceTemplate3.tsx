import React from 'react';

interface InvoiceTemplateProps {
  order: any;
}

const InvoiceTemplate3: React.FC<InvoiceTemplateProps> = ({ order }) => {
  const {
    _id,
    createdAt,
    billingInformation,
    items,
    totalAmount,
  } = order;

  return (
    <div className="p-16 text-gray-800 font-sans border border-gray-100">
      {/* Top Brand */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="text-lg font-bold tracking-tight">BestBuy4u</span>
        </div>
        <div className="text-right text-[8px] text-gray-400 font-medium uppercase tracking-widest">
          <p>BestBuy4uBd Ltd.</p>
          <p>Gulshan-1, Dhaka</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-emerald-500 mb-6">Invoice</h1>
        <div className="grid grid-cols-2 gap-20">
          <div className="space-y-0.5 text-xs text-gray-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Information</p>
            <p>Invoice No: <span className="text-gray-900 font-medium">#{_id?.slice(-6).toUpperCase()}</span></p>
            <p>Date: <span className="text-gray-900 font-medium">{new Date(createdAt).toLocaleDateString()}</span></p>
          </div>
          <div className="text-right space-y-0.5 text-xs text-gray-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Bill To:</p>
            <p className="text-gray-900 font-bold">{billingInformation?.name}</p>
            <p>{billingInformation?.phone}</p>
          </div>
        </div>
      </div>

      {/* Modern Table */}
      <div className="mb-12">
        <div className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-2 mb-2 text-[8px] font-bold text-emerald-500 uppercase tracking-widest">
            <div className="col-span-6">Name</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Subtotal</div>
        </div>
        <div className="space-y-4">
            {items.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-12 gap-4 text-xs items-center pb-2 border-b border-gray-50 last:border-0 hover:bg-emerald-50/10 transition-colors">
                    <div className="col-span-6">
                        <p className="font-bold text-gray-900">
                          {item.product?.basicInfo?.title || item.itemKey}
                        </p>
                        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(item.selectedVariants).map(([group, variants]: [string, any]) => (
                              Array.isArray(variants) ? variants.map((v: any, vIdx: number) => (
                                <span key={`${group}-${vIdx}`} className="text-[9px] text-emerald-500 font-bold uppercase tracking-wide">
                                  {group}: {v.value}
                                </span>
                              )) : (
                                <span key={group} className="text-[9px] text-emerald-500 font-bold uppercase tracking-wide">
                                  {group}: {variants.value}
                                </span>
                              )
                            ))}
                          </div>
                        )}
                    </div>
                    <div className="col-span-2 text-right text-gray-500">৳{item.price?.toLocaleString()}</div>
                    <div className="col-span-2 text-center font-medium capitalize">{item.quantity}</div>
                    <div className="col-span-2 text-right font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="flex justify-end mb-24">
        <div className="w-56 space-y-4 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-bold">৳{totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Discount</span>
                <span className="font-bold">৳0.00</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="font-bold">৳0.00</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100">
                <span className="font-black uppercase text-xs">Total</span>
                <span className="text-2xl font-black text-gray-900">৳{totalAmount?.toLocaleString()}</span>
            </div>
        </div>
      </div>

      {/* Signature Area */}
      <div className="flex justify-between items-end">
        <div className="text-[10px] text-gray-400 italic leading-relaxed max-w-xs">
            This invoice reflects the items purchased by {billingInformation?.name} for their personal/professional use under the terms of service of BestBuy4uBd.
        </div>
        <div className="text-center">
            <div className="w-48 h-16 bg-emerald-50 flex items-center justify-center rounded-md mb-2 border border-emerald-100/50">
                <span className="text-emerald-300 font-serif italic text-2xl select-none opacity-50">Signature</span>
            </div>
            <p className="text-[10px] font-bold text-gray-300 uppercase italic">Digital Approval</p>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-emerald-50 text-center">
        <p className="text-[10px] font-medium text-emerald-400 tracking-[0.3em] uppercase">BestBuy4uBd • Fast • Reliable • Secure</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate3;
