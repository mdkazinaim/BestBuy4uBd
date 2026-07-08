import { Card, Chip } from "@heroui/react";
import { Calendar, ArrowRight } from "lucide-react";

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

interface RecentOrder {
  _id: string;
  customerName: string;
  date?: string;
  amount: number;
  status: string;
}

interface RecentOrdersTableProps {
  recentOrders: RecentOrder[];
  formatStatus: (status: string) => string;
}

const RecentOrdersTable = ({ recentOrders, formatStatus }: RecentOrdersTableProps) => {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase()] || "#9ca3af";
  };

  const getAvatarInitials = (name: string) => {
    if (!name) return "C";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColorClasses = [
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  ];

  return (
    <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm ring-1 ring-gray-100/50 dark:ring-transparent overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-6 mt-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Orders</h3>
        <button className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline cursor-pointer">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {recentOrders && recentOrders.length > 0 ? (
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => {
                const initials = getAvatarInitials(order.customerName);
                const colorIdx = order.customerName
                  ? order.customerName.charCodeAt(0) % avatarColorClasses.length
                  : 0;
                const avatarClass = avatarColorClasses[colorIdx];
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={order._id}
                    className={`border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                      isEven ? "bg-white dark:bg-slate-900/10" : "bg-slate-50/30 dark:bg-slate-800/10"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 select-none ${avatarClass}`}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                            {order.customerName || "Customer"}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Order #{order._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-100">
                      ৳{order.amount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="font-medium uppercase text-[10px] px-3 border-none"
                          style={{
                            backgroundColor: `${getStatusColor(
                              order.status || ""
                            )}20`,
                            color: getStatusColor(order.status || ""),
                          }}
                        >
                          {formatStatus(order.status || "Unknown")}
                        </Chip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400 dark:text-slate-500 italic">
          No recent orders found
        </div>
      )}
    </Card>
  );
};

export default RecentOrdersTable;
