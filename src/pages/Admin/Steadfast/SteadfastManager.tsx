import { useState } from "react";
import { Truck, RefreshCcw, Search, Package } from "lucide-react";
import {
  useGetSteadfastBalanceQuery,
  useGetSteadfastReturnRequestsQuery,
  useCheckSteadfastStatusQuery,
} from "@/store/Api/SteadfastApi";
import { toast } from "sonner";
import { Button } from "@/common/Components/Button";

export default function SteadfastManager() {
  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useGetSteadfastBalanceQuery({});
  const { data: returnsData, isLoading: returnsLoading } = useGetSteadfastReturnRequestsQuery({});

  const [trackingId, setTrackingId] = useState("");
  const [paramId, setParamId] = useState("");

  const { data: statusData, isFetching: statusFetching } = useCheckSteadfastStatusQuery(paramId, {
    skip: !paramId,
  });

  const handleCheckStatus = () => {
    if (!trackingId) return toast.error("Please enter a consignment ID");
    setParamId(trackingId);
  };

  const currentBalance = balanceData?.data?.current_balance || 0;
  const returnRequests = returnsData?.data?.data || [];

  const inputClass = "w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-emerald-600" />
          <span>Steadfast Courier</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Monitor balance, track consignments, and manage return requests
        </p>
      </div>

      {/* Stats + Tracker Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Balance Card */}
        <div className="border border-emerald-200 dark:border-emerald-900/40 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-500 uppercase tracking-wide">Current Balance</p>
            <p className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400 mt-1.5 font-mono">
              {balanceLoading ? "..." : `৳${currentBalance}`}
            </p>
          </div>
          <button
            type="button"
            onClick={refetchBalance}
            className="w-10 h-10 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer focus:outline-none"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Tracking Lookup */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Check Delivery Status</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Consignment ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheckStatus()}
                className={`${inputClass} pl-9`}
              />
            </div>
            <Button variant="primary" size="sm" onClick={handleCheckStatus} disabled={statusFetching} className="shrink-0">
              {statusFetching ? "..." : "Check"}
            </Button>
          </div>
          {statusData && (
            <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-1.5">
              <p className="text-xs text-slate-600 dark:text-slate-350">
                <span className="font-semibold">Status:</span>{" "}
                <span className="font-mono">{statusData?.data?.delivery_status || "Unknown"}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Last Updated:</span>{" "}
                {statusData?.data?.updated_at || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Return Requests Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Package className="w-4.5 h-4.5 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Return Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">CONSIGNMENT ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">REASON</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {returnsLoading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-sm text-slate-400 font-medium">Loading return requests...</td>
                </tr>
              ) : returnRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-sm text-slate-400 font-medium">No return requests found</td>
                </tr>
              ) : (
                returnRequests.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-700 dark:text-slate-300">{item.consignment_id || "N/A"}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{item.reason || "N/A"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/60"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === "pending" ? "bg-amber-500" : "bg-slate-400"}`} />
                        {item.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
