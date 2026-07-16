import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => (
  <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl shadow-2xl border border-green-100 p-10 hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center shadow">
        <span className="text-green-700 text-2xl">📋</span>
      </div>
      <h3 className="text-3xl font-extrabold text-green-800 tracking-tight">পণ্যের বর্ণনা</h3>
    </div>
    <div
      className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
);

export default ProductDescription;
