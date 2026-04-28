import React from 'react';

interface SpecificationItem {
  name: string;
  value: string;
}

interface SpecificationGroup {
  group: string;
  items: SpecificationItem[];
}

interface SpecificationsProps {
  specifications: SpecificationGroup[];
}

const Specifications: React.FC<SpecificationsProps> = ({ specifications }) => (
  specifications?.length > 0 ? (
    <section className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-green-600 font-semibold mb-2 block">স্পেসিফিকেশন</span>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">প্রযুক্তিগত তথ্য</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">সম্পূর্ণ প্রযুক্তিগত স্পেসিফিকেশন</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {specifications.map((spec, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{spec.group}</h3>
            <div className="space-y-4">
              {spec.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-gray-900 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null
);

export default Specifications;
