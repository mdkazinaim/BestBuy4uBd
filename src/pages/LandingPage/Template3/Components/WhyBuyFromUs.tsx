// Helper component for rendering "Why Buy From Us" features
// This can be used to display product features dynamically

import React from 'react';

interface WhyBuyFromUsProps {
  features?: string[];
}

const WhyBuyFromUs: React.FC<WhyBuyFromUsProps> = ({ features }) => {
  // Default features if none provided from database
  const defaultFeatures = [
    "সারা বাংলাদেশে ৭২ ঘণ্টায় হোম ডেলিভারি করা হয়",
    "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা",
    "পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করার সুবিধা",
    "আমাদের কাছে কোনো প্রোডাক্টের বা সেবার মানের সম্পূর্ণ নিশ্চয়তা রয়েছে",
  ];

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

  return (
    <>
      {displayFeatures.map((text, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-base font-bold text-green-800"
        >
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 shadow-sm text-xs">
            {i + 1}
          </div>
          <p className="text-sm md:text-base">{text}</p>
        </div>
      ))}
    </>
  );
};

export default WhyBuyFromUs;
