import React from 'react';

const TrustSignals: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
      <div className="text-center">
        <div className="text-2xl mb-1">🚚</div>
        <div className="text-xs text-gray-600">Fast Delivery</div>
      </div>
      <div className="text-center">
        <div className="text-2xl mb-1">🔒</div>
        <div className="text-xs text-gray-600">Secure Payment</div>
      </div>
      <div className="text-center">
        <div className="text-2xl mb-1">↩️</div>
        <div className="text-xs text-gray-600">Easy Returns</div>
      </div>
    </div>
  );
};

export default TrustSignals;