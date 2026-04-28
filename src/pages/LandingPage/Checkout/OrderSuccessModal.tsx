
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useTracking } from '@/hooks/useTracking';

interface OrderDetails {
  orderId: string; // Human-readable ID from backend (e.g., ORD-2026-1001)
  subTotal?: number; // Subtotal before discounts
  totalDiscount?: number; // Total savings (Combo + Coupon)
  productPrice: number; // For backward compatibility
  deliveryCharge: number;
  totalAmount: number;
  comboInfo?: string; // Description of combo applied
  appliedCoupon?: {
    code: string;
    discount: number;
  };
  billingInformation?: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    email?: string;
  };
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails;
}

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }: OrderSuccessModalProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { trackPurchase } = useTracking();

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFC107', '#2196F3']
      });

      // Track Purchase
      trackPurchase({
        transaction_id: orderDetails.orderId,
        value: orderDetails.totalAmount,
        shipping: orderDetails.deliveryCharge,
        coupon: orderDetails.appliedCoupon?.code,
        items: [
          {
            item_id: "order_" + orderDetails.orderId,
            item_name: "Order Total", // Ideally we should pass items list here too
            price: orderDetails.productPrice,
            quantity: 1
          }
        ],
        user_data: {
          email: orderDetails.billingInformation?.email,
          phone_number: orderDetails.billingInformation?.phone,
          address: {
            first_name: orderDetails.billingInformation?.name,
            street: orderDetails.billingInformation?.address,
            city: orderDetails.billingInformation?.city || "Unknown", // Assuming city might not be separated or handled
          }
        }
      });
    }
  }, [isOpen, orderDetails, trackPurchase]);

  if (!isOpen) {
    return null;
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId);
    setCopied(true);
    toast.info('অর্ডার আইডি কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 1000);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="z-50 fixed inset-0 w-full overflow-y-auto">
      <div className="flex justify-center items-center px-4 min-h-screen">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-gradient-to-br from-white to-green-50 shadow-2xl mx-auto p-10 border border-green-100 rounded-3xl w-full max-w-6xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex justify-center items-center bg-gradient-to-br from-green-400 to-green-600 shadow-lg rounded-full w-24 h-24 hover:scale-105 transition-transform duration-300 transform">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-bold text-gray-800 text-3xl">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="mb-8 text-gray-600 text-lg">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অনুগ্রহ করে অর্ডার আইডিটি সংরক্ষণ করুন।
            </p>

            {/* Order Details */}
            <div className="bg-white/80 shadow-inner backdrop-blur-sm mb-8 p-8 border border-green-100 rounded-xl">
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">অর্ডার আইডি:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">{orderDetails.orderId}</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="hover:bg-green-100 p-2 rounded-full transition-colors"
                      title="Copy Order ID"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Subtotal */}
                {orderDetails.subTotal !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">সাবটোটাল:</span>
                    <span className="font-medium">৳{orderDetails.subTotal}</span>
                  </div>
                )}
                
                {/* Combo Savings - Highlighted in Green */}
                {orderDetails.totalDiscount !== undefined && orderDetails.totalDiscount > 0 && (
                  <>
                    <div className="flex justify-between items-center bg-green-50 -mx-2 px-2 py-2 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-700 font-semibold">কম্বো সেভিংস:</span>
                      </div>
                      <span className="font-bold text-green-700">-৳{orderDetails.totalDiscount}</span>
                    </div>
                    
                    {/* Combo Info Description */}
                    {/* {orderDetails.comboInfo && (
                      <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md italic border-l-4 border-green-400">
                        {orderDetails.comboInfo}
                      </div>
                    )} */}
                  </>
                )}
                
                {/* Delivery Charge */}
                <div className="flex justify-between">
                  <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                  <span className="font-medium">৳{orderDetails.deliveryCharge}</span>
                </div>
                
                {/* Coupon Discount (if separate from combo) */}
                {
                  orderDetails.appliedCoupon && orderDetails.appliedCoupon.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">কুপন ডিস্কাউন্ট:</span>
                      <span className="font-medium">{orderDetails.appliedCoupon.code} : -৳{orderDetails.appliedCoupon.discount}</span>
                    </div>
                  )
                }
                
                {/* Total */}
                <div className="flex justify-between pt-2 border-green-200 border-t font-bold text-green-700 text-lg">
                  <span>মোট মূল্য:</span>
                  <span>৳{orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopyOrderId}
              className="bg-gradient-to-r from-green-500 hover:from-green-600 to-green-600 hover:to-green-700 shadow-lg py-4 rounded-xl w-full font-medium text-white text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              অর্ডার আইডি কপি করুন
            </button>
            <button
              onClick={onClose}
              className="bg-white hover:bg-gray-50 shadow-md py-4 border border-gray-200 rounded-xl w-full font-medium text-gray-700 text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              ঠিক আছে
            </button>
            <button
              onClick={handleGoHome}
              className="bg-blue-50 hover:bg-blue-100 shadow-md py-4 border border-blue-200 rounded-xl w-full font-medium text-blue-700 text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              হোম পেজে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
