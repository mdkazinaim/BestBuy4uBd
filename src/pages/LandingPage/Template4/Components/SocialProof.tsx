import { Quote, Star } from 'lucide-react';

export default function SocialProof() {
  const testimonials = [
    {
      name: 'মোঃ রাকিব',
      location: 'ঢাকা',
      rating: 5,
      comment: 'অসাধারণ প্রোডাক্ট কোয়ালিটি। ডেলিভারিও সময়মত পেয়েছি। খুবই সন্তুষ্ট!',
      avatar: 'https://ui-avatars.com/api/?name=Rakib&background=9333ea&color=fff',
    },
    {
      name: 'সানজিদা আক্তার',
      location: 'চট্টগ্রাম',
      rating: 5,
      comment: 'একদম অরিজিনাল প্রোডাক্ট। দাম অনুযায়ী ভ্যালুও অনেক ভালো পেয়েছি।',
      avatar: 'https://ui-avatars.com/api/?name=Sanjida&background=10b981&color=fff',
    },
    {
      name: 'তানভীর হাসান',
      location: 'সিলেট',
      rating: 5,
      comment: 'কাস্টমার সার্ভিস অসাধারণ। যেকোনো সমস্যার দ্রুত সমাধান পেয়েছি।',
      avatar: 'https://ui-avatars.com/api/?name=Tanvir&background=f59e0b&color=fff',
    },
  ];

  const stats = [
    { value: '৫০০০+', label: 'সন্তুষ্ট কাস্টমার' },
    { value: '৪.৮', label: 'গড় রেটিং' },
    { value: '৯৮%', label: 'পজিটিভ রিভিউ' },
    { value: '২৪/৭', label: 'কাস্টমার সাপোর্ট' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-900/50 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            কাস্টমাররা কী বলছেন
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            হাজারো সন্তুষ্ট কাস্টমারের মধ্যে আপনিও একজন হতে পারেন
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-white" />
              </div>

              {/* Avatar & Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full ring-2 ring-white/20"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/80 text-sm leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <span className="text-sm">১০০% নিরাপদ পেমেন্ট</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <span className="text-sm">৭ দিনের রিটার্ন পলিসি</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <span className="text-sm">ফ্রি ডেলিভারি</span>
          </div>
        </div>
      </div>
    </section>
  );
}
