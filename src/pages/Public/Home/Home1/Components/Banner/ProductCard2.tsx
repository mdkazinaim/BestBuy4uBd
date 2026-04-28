import { motion } from "framer-motion";
import { BannerData } from "./types";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  data: BannerData;
  index: number;
}

const ProductCard2 = ({ data, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="relative rounded-component overflow-hidden h-[250px] shadow-lg cursor-pointer transition-all duration-300 border border-border-main"
    >
      {/* Background Image */}
      {data.image ? (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${data.bgColor}`} />
      )}

      {/* Content with overlay background */}
      <div className="relative z-10 h-full grid p-6">
        {/* Top Content */}

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mt-4 w-fit place-self-end">
          <motion.a
            href={data.ctaLink}
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 font-semibold text-sm text-white hover:gap-3 transition-all duration-300 no-underline"
          >
            {data.ctaText}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard2;

// <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
//         {data.brand && (
//           <div className="mb-2">
//             <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
//               {data.brand}
//             </span>
//           </div>
//         )}
//         <h3
//           className={`${
//             isLarge ? "text-2xl md:text-3xl" : "text-xl"
//           } font-bold mb-2 leading-tight text-white`}
//         >
//           {data.title}
//         </h3>
//         {data.subtitle && (
//           <p className="text-sm text-white/90 mb-3">
//             {data.subtitle}
//           </p>
//         )}
//         {data.price && (
//           <div className="mb-2">
//             {data.price.toLowerCase().includes("from") ? (
//               <div>
//                 <span className="text-xs text-white/70 uppercase">
//                   FROM
//                 </span>
//                 <p className="text-3xl font-bold text-primary-green">
//                   {data.price.replace(/from\s*/i, "")}
//                 </p>
//               </div>
//             ) : (
//               <p className="text-lg font-semibold text-white">
//                 from{" "}
//                 <span className="text-2xl text-primary-green">
//                   {data.price}
//                 </span>
//               </p>
//             )}
//           </div>
//         )}
//       </div>
