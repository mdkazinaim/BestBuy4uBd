import { useNavigate } from "react-router-dom";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Users, Eye, MousePointerClick, AlertTriangle, Settings } from "lucide-react";
import { useGetAnalyticsDashboardQuery } from "@/store/Api/TrackingApi";
import { Button } from "@/common/Components/Button";

const MetricCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</h4>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { data: analyticsRes, isLoading } = useGetAnalyticsDashboardQuery({});

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="text-center text-slate-500 animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading Analytics Data...
        </div>
      </div>
    );
  }

  // Handle errors or missing configuration
  if (!analyticsRes?.success) {
    return (
      <div className="w-full space-y-6 max-w-4xl mx-auto py-10">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-8 text-center flex flex-col items-center">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analytics Not Configured</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
            {analyticsRes?.message || "We couldn't connect to Google Analytics. Make sure you have uploaded the Service Account JSON and set your Property ID."}
          </p>
          <Button variant="primary" onClick={() => navigate("/admin/services")}>
            <Settings className="w-4 h-4 mr-2 inline" /> Configure Analytics
          </Button>
        </div>
      </div>
    );
  }

  const { chartData, totals } = analyticsRes.data;

  return (
    <div className="w-full space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            Google Analytics (Last 30 Days)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Overview of your website traffic and user engagement
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/services")}>
          <Settings className="w-4 h-4 mr-2 inline" /> Settings
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard 
          title="Active Users" 
          value={totals?.activeUsers || 0} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
        />
        <MetricCard 
          title="Total Page Views" 
          value={totals?.pageViews || 0} 
          icon={Eye} 
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
        />
        <MetricCard 
          title="Total Events" 
          value={totals?.eventCount || 0} 
          icon={MousePointerClick} 
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-6">Traffic Overview</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
