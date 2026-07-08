import React from 'react';

interface InvoiceTemplateProps { order: any; buyerInfo: any; sellerInfo: any; }

const InvoiceTemplate5: React.FC<InvoiceTemplateProps> = ({ order, buyerInfo, sellerInfo }) => {
  const { _id, createdAt, items, totalAmount, paymentInfo, deliveryCharge, discount } = order;
  const subtotal = totalAmount - (deliveryCharge || 0) + (discount || 0);

  return (
    <div className="py-12 px-4 bg-[#E5E5E5] print:bg-white print:py-0 print:px-0">
      <style>{`
        .zigzag-bottom {
          position: relative;
        }
        .zigzag-bottom::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -10px;
          right: 0;
          height: 10px;
          background-image: linear-gradient(135deg, white 50%, transparent 50%), linear-gradient(-135deg, white 50%, transparent 50%);
          background-position: left bottom;
          background-repeat: repeat-x;
          background-size: 10px 10px;
        }
        .zigzag-top {
          position: relative;
        }
        .zigzag-top::before {
          content: "";
          position: absolute;
          left: 0;
          top: -10px;
          right: 0;
          height: 10px;
          background-image: linear-gradient(45deg, white 50%, transparent 50%), linear-gradient(-45deg, white 50%, transparent 50%);
          background-position: left top;
          background-repeat: repeat-x;
          background-size: 10px 10px;
        }
        .barcode-strip {
          height: 40px;
          background-image: repeating-linear-gradient(90deg, #111, #111 2px, transparent 2px, transparent 4px, #111 4px, #111 5px, transparent 5px, transparent 8px, #111 8px, #111 12px, transparent 12px, transparent 14px, #111 14px, #111 15px, transparent 15px, transparent 19px, #111 19px, #111 20px, transparent 20px, transparent 22px);
        }
        .stamp-rotate {
          transform: rotate(-10deg);
        }
      `}</style>
      <div className="w-full max-w-[380px] mx-auto print:mx-0 print:ml-0 print:mr-auto filter drop-shadow-sm print:drop-shadow-none mb-10">
        <div className="zigzag-top bg-white pt-6 px-6">
          <div className="text-center font-mono">
            <p className="font-bold text-base tracking-wide">{sellerInfo?.name}</p>
            <p className="text-[11px] text-[#666] mt-0.5">{sellerInfo?.web || sellerInfo?.email}</p>
            <p className="text-[11px] text-[#666]">Phone: {sellerInfo?.phone}</p>
            <p className="text-[11px] text-[#666]">Order confirmation receipt</p>
          </div>
  
          <div className="border-t border-dashed border-[#999] my-4"></div>
  
          <div className="font-mono text-[12px] leading-6 text-[#111]">
            <div className="flex justify-between"><span>Order #</span><span>{_id?.slice(-6).toUpperCase()}</span></div>
            <div className="flex justify-between"><span>Date</span><span>{new Date(createdAt).toLocaleDateString()}</span></div>
            
            <div className="flex justify-between items-start mt-2 mb-2">
              <span>Customer</span>
              <div className="text-right ml-4 leading-tight">
                <span className="block font-bold">{buyerInfo?.name}</span>
                {buyerInfo?.phone && <span className="block text-[#444] mt-1">{buyerInfo.phone}</span>}
                {buyerInfo?.address && <span className="block text-[10px] text-[#666] mt-1 max-w-[180px] break-words">{buyerInfo.address}</span>}
              </div>
            </div>

            <div className="flex justify-between"><span>Payment</span><span className="capitalize">{paymentInfo?.paymentMethod || order.paymentMethod || 'COD'}</span></div>
          </div>
  
          <div className="border-t border-dashed border-[#999] my-4"></div>
  
          <div className="font-mono text-[12px]">
            <div className="flex justify-between font-semibold text-[#666] uppercase text-[10px] tracking-wide mb-2">
              <span>Item</span><span>Total</span>
            </div>
            {items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between mb-2">
                <span className="pr-2 text-left">
                  {item.product?.basicInfo?.title || item.product?.title || item.itemKey}
                  <br/>
                  <span className="text-[10px] text-[#666]">
                    {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 
                      ? Object.entries(item.selectedVariants).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v[0]?.value : v?.value}`).join(' · ') + ` x${item.quantity}`
                      : `x${item.quantity}`
                    }
                  </span>
                </span>
                <span className="whitespace-nowrap pt-1">৳{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
  
          <div className="border-t border-dashed border-[#999] my-4"></div>
  
          <div className="font-mono text-[12px] leading-6">
            <div className="flex justify-between text-[#444]"><span>Subtotal</span><span>৳{subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between text-[#444]"><span>Shipping</span><span>{deliveryCharge ? `৳${deliveryCharge.toLocaleString()}` : 'Free'}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-[#444]"><span>Discount</span><span>-৳{discount?.toLocaleString()}</span></div>
            )}
            <div className="flex justify-between font-bold text-[14px] mt-1 pt-2 border-t border-[#111]">
              <span>TOTAL</span><span>৳{totalAmount?.toLocaleString()}</span>
            </div>
          </div>
  
          <div className="text-center mt-5">
            <span className="inline-block border-2 border-[#15803D] text-[#15803D] font-bold text-sm px-4 py-1 rounded stamp-rotate tracking-widest">
              {paymentInfo?.status?.toLowerCase() === 'paid' ? 'PAID' : (order.paymentMethod?.toLowerCase() === 'cod' ? 'COD' : 'DUE')}
            </span>
          </div>
  
          <p className="text-center text-[11px] text-[#666] mt-5">Thank you for your order!<br/>support@bestbuy4ubd.com</p>
  
          <div className="barcode-strip mt-6"></div>
          <p className="text-center text-[10px] tracking-[0.3em] text-[#666] mt-1 pb-6 uppercase">{_id}</p>
        </div>
        <div className="zigzag-bottom bg-white h-3 mb-10"></div>
      </div>
    </div>
  );
};

export default InvoiceTemplate5;
