import { cloneElement, ReactElement } from "react";
import { Clock, ShoppingCart, DollarSign, TrendingUp, XCircle, Package } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryStatsCardsProps {
  overview: {
    pendingCount?: number;
    currentMonthOrders?: number;
    currentMonthSales?: number;
    revenueAmount?: number;
    canceledCount?: number;
    totalSalesAmount?: number;
    salesGrowth?: number;
  };
}

const SummaryStatsCards = ({ overview }: SummaryStatsCardsProps) => {
  const statsCards = [
    {
      title: "Pending Orders",
      value: overview?.pendingCount || 0,
      icon: <Clock />,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      trendText: "Awaiting Action",
      trendColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      title: "Sales This Month (Qty)",
      value: overview?.currentMonthOrders || 0,
      icon: <ShoppingCart />,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      trendText: "Orders Count",
      trendColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Sales This Month (Amt)",
      value: `৳${(overview?.currentMonthSales || 0).toLocaleString()}`,
      icon: <DollarSign />,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      trendText: "Gross Sales",
      trendColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "Total Revenue",
      value: `৳${(overview?.revenueAmount || 0).toLocaleString()}`,
      icon: <TrendingUp />,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      trendText: "Net Earnings",
      trendColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20",
    },
    {
      title: "Canceled Orders",
      value: overview?.canceledCount || 0,
      icon: <XCircle />,
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
      trendText: "Cancelations",
      trendColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20",
    },
    {
      title: "Total Sales (All Time)",
      value: `৳${(overview?.totalSalesAmount || 0).toLocaleString()}`,
      icon: <Package />,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
      trendText: overview?.salesGrowth !== undefined ? `${overview.salesGrowth >= 0 ? "+" : ""}${overview.salesGrowth}% MoM` : "Total Gross",
      trendColor: overview?.salesGrowth !== undefined
        ? (overview.salesGrowth >= 0 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20" : "text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20")
        : "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {statsCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}>
              {cloneElement(card.icon as ReactElement, { className: "w-4 h-4 shrink-0" } as any)}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mt-5">
            <span className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              {card.value}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full select-none ${card.trendColor}`}>
              {card.trendText}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryStatsCards;
