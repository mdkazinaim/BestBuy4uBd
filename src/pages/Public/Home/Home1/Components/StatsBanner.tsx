import { motion } from "framer-motion";
import { Users, ShoppingBag, Heart, Clock } from "lucide-react";

const StatsBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 sm:divide-x divide-indigo-100 dark:divide-indigo-800/30 border border-indigo-100/50 dark:border-indigo-800/30"
    >
      <div className="flex items-center gap-4 px-4 sm:px-6 w-full sm:w-1/4 justify-center sm:justify-start">
        <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">10K+</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Happy Customers</p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 sm:px-6 w-full sm:w-1/4 justify-center sm:justify-start">
        <ShoppingBag className="w-8 h-8 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">500+</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Quality Products</p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 sm:px-6 w-full sm:w-1/4 justify-center sm:justify-start">
        <Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">99%</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Positive Reviews</p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 sm:px-6 w-full sm:w-1/4 justify-center sm:justify-start">
        <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">24/7</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Customer Support</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBanner;
