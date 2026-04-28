import { motion } from "framer-motion";
import { Clock, Tag, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const deals = [
  {
    id: 1,
    title: "Flash Sale: Gaming Console",
    discount: 40,
    originalPrice: 599.99,
    salePrice: 359.99,
    endsIn: 3600, // seconds
    gradient: "from-primary-purple to-primary-purple-new",
  },
  {
    id: 2,
    title: "Limited: Professional Camera",
    discount: 35,
    originalPrice: 1299.99,
    salePrice: 844.99,
    endsIn: 7200,
    gradient: "from-primary-blue to-primary-cyan",
  },
  {
    id: 3,
    title: "Today Only: Smart Home Kit",
    discount: 50,
    originalPrice: 399.99,
    salePrice: 199.99,
    endsIn: 5400,
    gradient: "from-primary-orange to-primary-red",
  },
];

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const initialTime: { [key: number]: number } = {};
    deals.forEach((deal) => {
      initialTime[deal.id] = deal.endsIn;
    });
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = { ...prev };
        Object.keys(newTime).forEach((key) => {
          if (newTime[Number(key)] > 0) {
            newTime[Number(key)] -= 1;
          }
        });
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-red/10 text-primary-red px-4 py-2 rounded-full font-semibold mb-4">
            <Zap className="w-5 h-5" />
            <span>Limited Time Offers</span>
          </div>
          <h2 className="mb-4">Today's Hot Deals</h2>
          <p className="text-light-gray text-lg max-w-2xl mx-auto">
            Don't miss out on these incredible limited-time offers
          </p>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => {
            const time = formatTime(timeLeft[deal.id] || 0);
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div
                  className={`relative bg-gradient-to-br ${deal.gradient} rounded-2xl p-6 shadow-xl overflow-hidden`}
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
                  />

                  <div className="relative z-10 text-white">
                    {/* Discount Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span className="font-semibold">{deal.discount}% OFF</span>
                      </div>
                      <TrendingUp className="w-6 h-6" />
                    </div>

                    {/* Deal Title */}
                    <h3 className="text-2xl font-semibold mb-4">{deal.title}</h3>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-semibold">
                          ${deal.salePrice}
                        </span>
                        <span className="text-lg line-through opacity-70">
                          ${deal.originalPrice}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mt-1">
                        Save ${(deal.originalPrice - deal.salePrice).toFixed(2)}
                      </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Ends In:</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-2xl font-semibold">
                            {String(time.hours).padStart(2, "0")}
                          </div>
                          <div className="text-xs opacity-80">Hours</div>
                        </div>
                        <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-2xl font-semibold">
                            {String(time.minutes).padStart(2, "0")}
                          </div>
                          <div className="text-xs opacity-80">Mins</div>
                        </div>
                        <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-2xl font-semibold">
                            {String(time.secs).padStart(2, "0")}
                          </div>
                          <div className="text-xs opacity-80">Secs</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-dark-blue py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Grab This Deal
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;