import { Package, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Package,
      title: 'মানসম্মত পণ্য',
      description: '১০০% অরিজিনাল এবং উন্নতমানের প্রোডাক্ট নিশ্চিত করি',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Truck,
      title: 'দ্রুত ডেলিভারি',
      description: 'ঢাকার ভেতর ২৪-৪৮ ঘণ্টায় ডেলিভারি পাবেন',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      title: 'নিরাপদ পেমেন্ট',
      description: 'ক্যাশ অন ডেলিভারি সুবিধা সহ সম্পূর্ণ নিরাপদ',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: HeartHandshake,
      title: 'কাস্টমার সাপোর্ট',
      description: '২৪/৭ কাস্টমার সার্ভিস এবং সহায়তা পাবেন',
      gradient: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-purple-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            কেন আমাদের কাছ থেকে কিনবেন?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            আমরা আপনার সন্তুষ্টি এবং বিশ্বাসকে সর্বোচ্চ গুরুত্ব দিই
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Icon */}
              <div className={`mb-4 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <feature.icon className="w-full h-full text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white/70 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 -z-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
