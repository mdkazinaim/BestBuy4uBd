import React from 'react';
import { ProductReview } from '@/types/Product/Product';

interface CustomerReviewsProps {
  reviews: ProductReview[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => (
  reviews?.length > 0 ? (
    <section className="max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
      <div className="text-center mb-16">
        <span className="text-green-600 font-semibold mb-2 block">গ্রাহক মতামত</span>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">কাস্টমার রিভিউ</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">আমাদের গ্রাহকদের মতামত দেখুন</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-2xl">{review.user.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">{review.user}</h4>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
              </div>
              <span className="ml-auto text-sm text-gray-500">{new Date(review.date).toLocaleDateString("bn-BD")}</span>
            </div>
            <p className="text-gray-700 leading-relaxed italic">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  ) : null
);

export default CustomerReviews;
