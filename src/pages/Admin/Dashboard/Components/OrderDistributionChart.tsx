import { Card } from "@heroui/react";
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  completed: "#10b981",
  delivered: "#10b981",
  processing: "#3b82f6",
  pending: "#eab308",
  cancelled: "#ef4444",
  canceled: "#ef4444",
  shipped: "#8b5cf6",
  delivered_approval_pending: "#14b8a6",
  partial_delivered_approval_pending: "#06b6d4",
  cancelled_approval_pending: "#f97316",
  unknown_approval_pending: "#a855f7",
  partial_delivered: "#34d399",
  hold: "#f59e0b",
  in_review: "#6366f1",
  unknown: "#6b7280",
};

interface StatusItem {
  status: string;
  count: number;
  [key: string]: any;
}

interface OrderDistributionChartProps {
  statusBreakdown: StatusItem[];
  formatStatus: (status: string) => string;
}

const OrderDistributionChart = ({ statusBreakdown, formatStatus }: OrderDistributionChartProps) => {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase()] || "#9ca3af";
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 ring-1 ring-gray-100 dark:ring-transparent">
      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">
        Order Distribution
      </h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">Performance by status</p>
      <div className="h-[250px] w-full">
        {statusBreakdown && statusBreakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.status || "")}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
            No distribution data
          </div>
        )}
      </div>
      <div className="space-y-4 mt-6">
        {statusBreakdown.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: getStatusColor(entry.status || ""),
                }}
              />
              <span className="text-sm font-bold text-gray-700 dark:text-slate-300 capitalize">
                {formatStatus(entry.status || "Unknown")}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-900 dark:text-slate-100">
                {entry.count}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Orders
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderDistributionChart;
