import React from 'react';

interface InvoiceTemplateProps {
  order: any;
}

const InvoiceTemplate1: React.FC<InvoiceTemplateProps> = ({ order }) => {
  const {
    _id,
    createdAt,
    billingInformation,
    items,
    totalAmount,
    paymentInfo,
  } = order;

  return (
    <div className="p-12 text-gray-800 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            BB4U
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Digital Invoice</h1>
            <p className="text-[10px] text-gray-500">Invoice ID: #{_id?.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] uppercase text-gray-400 font-semibold">Date Issued</p>
          <p className="text-sm font-medium">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        <div>
          <h2 className="text-[10px] uppercase text-blue-600 font-bold mb-2 tracking-wider">From:</h2>
          <div className="space-y-0.5">
            <p className="font-bold text-base">BestBuy4uBd</p>
            <p className="text-xs text-gray-600">Dhaka, Bangladesh</p>
            <p className="text-xs text-gray-600">support@bestbuy4ubd.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-[10px] uppercase text-blue-600 font-bold mb-2 tracking-wider">Bill To:</h2>
          <div className="space-y-0.5 text-right ml-auto">
            <p className="font-bold text-base">{billingInformation?.name || "Customer"}</p>
            <p className="text-xs text-gray-600">{billingInformation?.email}</p>
            <p className="text-xs text-gray-600">{billingInformation?.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="py-2 font-bold text-[10px] uppercase tracking-wider">Description</th>
              <th className="py-2 font-bold text-[10px] uppercase tracking-wider text-center">Qty</th>
              <th className="py-2 font-bold text-[10px] uppercase tracking-wider text-right">Rate</th>
              <th className="py-2 font-bold text-[10px] uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.product?.name} className="w-10 h-10 rounded object-cover border border-gray-100" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {item.product?.basicInfo?.title || item.itemKey}
                      </p>
                      {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-x-2 mt-1">
                          {Object.entries(item.selectedVariants).map(([group, variants]: [string, any]) => (
                            Array.isArray(variants) ? variants.map((v: any, vIdx: number) => (
                              <span key={`${group}-${vIdx}`} className="text-[10px] text-blue-600 font-bold uppercase">
                                {group}: {v.value}
                              </span>
                            )) : (
                              <span key={group} className="text-[10px] text-blue-600 font-bold uppercase">
                                {group}: {variants.value}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 text-center text-sm text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-sm text-gray-600">৳{item.price?.toLocaleString()}</td>
                <td className="py-3 text-right font-bold text-gray-900 text-sm">৳{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end pt-8">
        <div className="w-full max-w-xs space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-900">৳{totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium text-gray-900">Free</span>
          </div>
          <div className="flex justify-between items-center py-4 border-t border-gray-100">
            <span className="text-lg font-bold">Total Due</span>
            <span className="text-2xl font-black text-blue-600">৳{totalAmount?.toLocaleString()}</span>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-gray-400 font-bold mb-2">Payment Instruction</p>
            <p className="text-sm font-medium">{paymentInfo?.paymentMethod === 'bkash' ? 'bKash Payment' : 'Cash on Delivery'}</p>
            {paymentInfo?.transactionId && (
              <p className="text-xs text-gray-500 mt-1">Trx ID: {paymentInfo.transactionId}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 uppercase font-bold tracking-widest">
        <p>Thank you for your business</p>
        <p>www.bestbuy4ubd.com</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate1;
