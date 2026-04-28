import React from 'react';
import { ProductShippingDetails, AdditionalInfo } from '@/types/Product/Product';

interface PolicyAndShippingProps {
  shippingDetails: ProductShippingDetails;
  additionalInfo?: AdditionalInfo;
}

const PolicyAndShipping: React.FC<PolicyAndShippingProps> = ({ shippingDetails, additionalInfo }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
    <div className="space-y-8">
      {/* শিপিং তথ্য */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl">📦</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">শিপিং তথ্য</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">ডাইমেনশন</p>
            <p className="font-medium text-gray-900">
              {shippingDetails.length} x {shippingDetails.width} x {shippingDetails.height} {shippingDetails.dimensionUnit}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">ওজন</p>
            <p className="font-medium text-gray-900">
              {shippingDetails.weight} {shippingDetails.weightUnit}
            </p>
          </div>
        </div>
        {additionalInfo?.estimatedDelivery && (
          <div className="mt-4 bg-blue-50 p-4 rounded-2xl">
            <p className="text-sm text-blue-800 font-medium mb-2">আনুমানিক ডেলিভারি</p>
            {additionalInfo.estimatedDelivery.split("\n").map((line: string, idx: number) => (
              <p key={idx} className="text-blue-600 text-sm">{line}</p>
            ))}
          </div>
        )}
      </div>
      {/* রিটার্ন নীতিমালা */}
      {additionalInfo?.returnPolicy && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">↩️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">রিটার্ন নীতিমালা</h3>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl space-y-2">
            {additionalInfo.returnPolicy.split("\n").map((line: string, idx: number) => (
              <p key={idx} className="text-purple-600 text-sm">{line}</p>
            ))}
          </div>
        </div>
      )}
      {/* ওয়ারেন্টি */}
      {additionalInfo?.warranty && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">🔧</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">ওয়ারেন্টি</h3>
          </div>
          <div className="p-6 space-y-2 bg-yellow-50 rounded-2xl">
            {additionalInfo.warranty.split("\n").map((line: string, idx: number) => (
              <p key={idx} className="text-yellow-600 text-sm">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default PolicyAndShipping;
