import { useGetDashboardStatsQuery } from "@/store/Api/DashboardApi";
import DashboardSkeleton from "@/common/Skeleton/DashboardSkeleton";
import LastOrderStatusCard from "./Components/LastOrderStatusCard";
import SummaryStatsCards from "./Components/SummaryStatsCards";
import MonthlySalesChart from "./Components/MonthlySalesChart";
import RevenueAnalysisChart from "./Components/RevenueAnalysisChart";
import RecentOrdersTable from "./Components/RecentOrdersTable";
import OrderDistributionChart from "./Components/OrderDistributionChart";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery(
    undefined,
    {
      pollingInterval: 60000,
    }
  );
  
  // Helper to format status text
  const formatStatus = (str: string) => {
    return str?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data || !data.data) {
    console.error("Dashboard Error:", error);
    return (
      <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-bold">
          Failed to load dashboard statistics.
        </p>
        <p className="text-xs text-red-400 mt-2">
          Please check if the server is running and the database has orders.
        </p>
      </div>
    );
  }

  const {
    overview,
    statusBreakdown = [],
    monthlyStats = [],
    recentOrders = [],
  } = data.data;

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header / Last Order Status */}
      {overview?.lastOrder && (
        <LastOrderStatusCard lastOrder={overview.lastOrder} formatStatus={formatStatus} />
      )}

      {/* Summary Cards */}
      <SummaryStatsCards overview={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Monthly Sales Bar Chart */}
        <MonthlySalesChart monthlyStats={monthlyStats} />

        {/* Monthly Revenue Area Chart */}
        <RevenueAnalysisChart monthlyStats={monthlyStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <RecentOrdersTable recentOrders={recentOrders} formatStatus={formatStatus} />

        {/* Status Breakdown (Pie) */}
        <OrderDistributionChart statusBreakdown={statusBreakdown} formatStatus={formatStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
