import React from 'react';
import { Check, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderStepperProps {
  status: string;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'পেন্ডিং', icon: Clock },
    { id: 'processing', label: 'প্রসেসিং', icon: Package },
    { id: 'shipped', label: 'শিপড', icon: Truck },
    { id: 'completed', label: 'কমপ্লিট', icon: CheckCircle2 },
  ];

  const currentStatus = status.toLowerCase();
  
  const getStatusIndex = (statusStr: string) => {
    const index = steps.findIndex(step => step.id === statusStr);
    return index !== -1 ? index : 0;
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            // const isPending = index > currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className="relative group">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCompleted || isCurrent ? '#22c55e' : 'var(--stepper-inactive-bg, #f3f4f6)',
                      borderColor: isCurrent ? '#22c55e' : isCompleted ? '#22c55e' : 'var(--stepper-inactive-border, #e5e7eb)',
                    }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 flex items-center justify-center relative z-10 transition-all duration-300 ${
                        isCurrent ? 'shadow-lg shadow-green-200 dark:shadow-green-950/50' : ''
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                        isCurrent ? 'text-white' : 'text-gray-400 dark:text-slate-500'
                      }`} />
                    )}
                  </motion.div>
                  
                  {isCurrent && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute inset-0 rounded-2xl bg-green-400 blur-md opacity-40 -z-0"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    isCurrent ? 'text-green-600 dark:text-green-400' : isCompleted ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStepper;
