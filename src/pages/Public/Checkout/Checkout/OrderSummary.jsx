/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'

const OrderSummary = () => {
  const cartItems = useSelector((state) => state.cart?.cartItems)
  const deliveryCharge = 80 // Default to inside Dhaka
  const subtotal = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  const total = subtotal + deliveryCharge

  const renderVariants = (variants) => {
    if (!variants) return null;
    
    if (Array.isArray(variants)) {
      return variants.map((variant, idx) => (
        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {variant.value}
        </span>
      ));
    }

    return Object.entries(variants).map(([group, selection]) => {
      const items = Array.isArray(selection) ? selection : [selection];
      return items.map((item, idx) => (
        <span key={`${group}-${idx}`} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {item.value}
        </span>
      ));
    });
  };

  return (
    <>
      <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800 md:text-3xl md:mb-8">
        <span className="flex items-center justify-center w-8 h-8 mr-3 bg-green-100 rounded-full md:w-10 md:h-10 md:mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </span>
        অর্ডার সামারি
      </h2>

      <div className="space-y-6">
        {/* Products List */}
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div key={item.itemKey} className="flex gap-4 p-4 bg-white shadow-sm rounded-xl">
              <img 
                src={item.image} 
                alt={item.name}
                className="object-cover w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">৳{item.price} × {item.quantity}</p>
                {item.selectedVariants && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {renderVariants(item.selectedVariants)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="font-medium">৳{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="pt-4 space-y-3 border-t">
          <div className="flex justify-between text-gray-600">
            <span>সাবটোটাল</span>
            <span>৳{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>ডেলিভারি চার্জ</span>
            <span>৳{deliveryCharge}</span>
          </div>
          <div className="flex justify-between pt-3 text-xl font-bold text-gray-800 border-t">
            <span>মোট</span>
            <span>৳{total}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-800">ক্যাশ অন ডেলিভারি</p>
              <p className="text-sm text-gray-600">পণ্য হাতে পেয়ে টাকা প্রদান করুন</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSummary