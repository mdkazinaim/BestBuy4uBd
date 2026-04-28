import React from 'react';

interface FloatingCTAProps {
  currentPrice: number;
  quantity: number;
  scrollToCheckout: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ currentPrice, quantity, scrollToCheckout }) => (
  <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
    <div className="w-full max-w-7xl flex justify-center">
      <button
        onClick={scrollToCheckout}
        className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
      >
        <span>🛒 অর্ডার করুন</span>
        <span className="text-2xl font-bold">৳{(currentPrice * quantity).toLocaleString("bn-BD")}</span>
      </button>
    </div>
  </div>
);

export default FloatingCTA;
