import { motion } from "framer-motion";

interface VerticalPaginationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

const VerticalPagination = ({ total, current, onChange }: VerticalPaginationProps) => {
  return (
    <div className="flex flex-col items-center gap-2 py-4 bg-gray-100/50 rounded-full w-8">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className="relative w-4 h-4 flex items-center justify-center focus:outline-none"
        >
          {/* Dot */}
          <motion.div
            initial={false}
            animate={{
              width: current === index ? 6 : 4,
              height: current === index ? 6 : 4,
              backgroundColor: current === index ? "#124E66" : "#cbd5e1", // utilizing website primary color
            }}
            className="rounded-full"
          />
          
          {/* Active Ring (Optional for extra emphasis) */}
          {current === index && (
             <motion.div
             layoutId="active-ring"
             className="absolute inset-0 border border-primary-green rounded-full opacity-50"
             initial={{ scale: 0.8 }}
             animate={{ scale: 1.5 }}
             transition={{ duration: 0.3 }}
           />
          )}
        </button>
      ))}
    </div>
  );
};

export default VerticalPagination;
