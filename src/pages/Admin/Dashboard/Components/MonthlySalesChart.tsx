import { Card } from "@heroui/react";
import {
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyStats {
  month: string;
  sales: number;
  revenue: number;
  [key: string]: any;
}

interface MonthlySalesChartProps {
  monthlyStats: MonthlyStats[];
}

const MonthlySalesChart = ({ monthlyStats }: MonthlySalesChartProps) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 md:p-6 ring-1 ring-gray-100 dark:ring-transparent">
      <div className="mb-4 md:mb-8">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100">Monthly Sales</h3>
        <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Gross volume</p>
      </div>
      <div className="h-[300px] w-full">
        {monthlyStats && monthlyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `৳${value.toLocaleString()}`}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value: any) => [
                  `৳${value.toLocaleString()}`,
                  "Total Sales",
                ]}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
            No sales data available for charts
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlySalesChart;
