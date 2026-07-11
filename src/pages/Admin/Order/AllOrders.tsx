import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "@/store/Api/OrderApi";
import {
  useCreateSteadfastOrderMutation,
  useBulkCheckSteadfastStatusMutation,
} from "@/store/Api/SteadfastApi";
import { useGetDashboardStatsQuery } from "@/store/Api/DashboardApi";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  LayoutTemplate,
  RefreshCw,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
} from "@heroui/react";
import { useState, useEffect, useCallback, cloneElement, ReactElement } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Pagination from "@/pages/Public/Shop/Components/Pagination";

// Custom Popover Select for Status Filter
const StatusFilterPopover = ({
  statusFilter,
  onSelect,
}: {
  statusFilter: string;
  onSelect: (status: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const statusOptions = [
    { key: "all", label: "All Status" },
    { key: "pending", label: "Pending" },
    { key: "delivered_approval_pending", label: "Delivered (Approval Pending)" },
    { key: "partial_delivered_approval_pending", label: "Partial Delivered (Approval Pending)" },
    { key: "cancelled_approval_pending", label: "Cancelled (Approval Pending)" },
    { key: "unknown_approval_pending", label: "Unknown (Approval Pending)" },
    { key: "delivered", label: "Delivered" },
    { key: "partial_delivered", label: "Partial Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "hold", label: "Hold" },
    { key: "in_review", label: "In Review" },
    { key: "unknown", label: "Unknown" },
  ];

  const currentLabel = statusOptions.find((opt) => opt.key === statusFilter)?.label || "All Status";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full sm:w-48 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-slate-900 text-left h-9">
          <span>{currentLabel}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onSelect(opt.key);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === opt.key
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom Popover Select for Invoice Template
const InvoiceTemplatePopover = ({
  currentTemplate,
  onSelect,
}: {
  currentTemplate: string;
  onSelect: (template: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const templates = [
    { key: "template1", label: "Modern" },
    { key: "template2", label: "Professional" },
    { key: "template3", label: "Minimalist" },
    { key: "template4", label: "Purchase Order" },
  ];

  const currentLabel = templates.find((t) => t.key === currentTemplate)?.label || "Modern";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg min-w-[130px] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-slate-900 text-left h-8">
          <span>{currentLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="py-1">
          {templates.map((tpl) => (
            <button
              key={tpl.key}
              onClick={() => {
                onSelect(tpl.key);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentTemplate === tpl.key
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom Popover Select for Limit
const LimitPopover = ({
  limit,
  onSelect,
}: {
  limit: number;
  onSelect: (limit: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const sizes = [10, 20, 50, 100];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg min-w-[64px] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-slate-900 text-center h-8">
          <span>{limit}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-20 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="py-1">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                onSelect(size);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                limit === size
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AllOrders = () => {
  const [selectedTemplates, setSelectedTemplates] = useState<
    Record<string, string>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "createdAt", direction: "desc" });
  const [syncedPages, setSyncedPages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetAllOrdersQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: sortConfig.key,
    order: sortConfig.direction,
  });
  const { data: statsData } = useGetDashboardStatsQuery(undefined);
  const [deleteOrder] = useDeleteOrderMutation();
  const [createSteadfastOrder, { isLoading: isSendingToSteadfast }] =
    useCreateSteadfastOrderMutation();
  const [bulkCheckStatus, { isLoading: isSyncingStatus }] = useBulkCheckSteadfastStatusMutation();
  const navigate = useNavigate();

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setPage(1);
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  const handleCheckStatus = async (consignmentId: string) => {
    if (!consignmentId) return;
    try {
      const getBaseUrl = () => {
        if (typeof window !== "undefined") {
          const hostname = window.location.hostname;
          if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:5000/api/v1";
          }
        }
        return "https://spark-tech-server.vercel.app/api/v1";
      };
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/steadfast/status/${consignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        toast.success(`Status updated: ${result.data.delivery_status}`);
        refetch();
      } else {
        toast.error(result.message || "Failed to sync status");
      }
    } catch {
      toast.error("An error occurred while syncing status");
    }
  };

  const performBulkSync = useCallback(async (ordersToSync: any[]) => {
    if (ordersToSync.length === 0) return;
    const consignmentIds = ordersToSync.map((o: any) => o.consignment_id);
    try {
      await bulkCheckStatus(consignmentIds).unwrap();
      toast.success(`Synced status for ${consignmentIds.length} orders`);
      refetch();
    } catch (err) {
      console.error("Failed to sync statuses automatically", err);
    }
  }, [bulkCheckStatus, refetch]);

  useEffect(() => {
    if (!apiData?.data || isLoading || syncedPages.has(page)) return;

    const ordersToSync = apiData.data.filter((order: any) => 
      order.consignment_id && 
      !['delivered', 'cancelled', 'partial_delivered'].includes(order.status?.toLowerCase())
    );

    if (ordersToSync.length > 0) {
      performBulkSync(ordersToSync);
    }
    
    setSyncedPages(prev => new Set(prev).add(page));
  }, [apiData, page, isLoading, syncedPages, performBulkSync]);

  const handleManualSync = () => {
    if (!apiData?.data) return;
    const ordersToSync = apiData.data.filter((order: any) => order.consignment_id);
    if (ordersToSync.length === 0) {
      toast.info("No orders with consignment ID to sync");
      return;
    }
    performBulkSync(ordersToSync);
  };

  const orders = apiData?.data || [];
  const meta = apiData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
  const stats = statsData?.data?.overview;

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Pending",
      value: stats?.pendingCount || 0,
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "Processing",
      value: stats?.processingCount || 0,
      icon: <Truck className="w-5 h-5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      title: "Delivered",
      value: stats?.deliveredCount || 0,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Cancelled",
      value: stats?.canceledCount || 0,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/20",
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id).unwrap();
        toast.success("Order deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete order");
        console.error(err);
      }
    }
  };

  const handleSendToSteadfast = async (row: any) => {
    if (row.consignment_id) {
      toast.info(`Already sent! ID: ${row.consignment_id}`);
      return;
    }
    try {
      await createSteadfastOrder({ orderId: row._id }).unwrap();
      toast.success("Sent to Steadfast successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send to Steadfast");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();

    const formatStatus = (str: string) => {
      return str
        ?.split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedStatus = formatStatus(status);

    switch (s) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "processing":
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400">
            <Truck className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "pending":
      case "hold":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950/20 text-purple-800 dark:text-purple-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-350">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-805 dark:text-slate-300">
            {formattedStatus || status}
          </span>
        );
    }
  };

  const OrderCard = ({ order }: { order: any }) => {
    const template = selectedTemplates[order._id] || "template1";

    return (
      <Card className="p-4 mb-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-mono">
                #{order._id?.slice(-6).toUpperCase()}
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                {order.billingInformation?.name || "Unknown"}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-tight">
                Amount
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                ৳{order.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-tight">
                Date
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-semibold">Invoice Template</p>
            <InvoiceTemplatePopover
              currentTemplate={template}
              onSelect={(val) => {
                setSelectedTemplates((prev) => ({ ...prev, [order._id]: val }));
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/65">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Eye className="w-4 h-4" />}
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="w-full rounded-lg"
            >
              View
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              startContent={<LayoutTemplate className="w-4 h-4" />}
              onClick={() =>
                window.open(
                  `/admin/orders/invoice/${order._id}?template=${template}`,
                  "_blank",
                )
              }
              className="w-full rounded-lg"
            >
              Invoice
            </Button>
            {!order.consignment_id ? (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<Truck className="w-4 h-4" />}
                onClick={() => handleSendToSteadfast(order)}
                isLoading={isSendingToSteadfast}
                className="w-full rounded-lg"
              >
                Steadfast
              </Button>
            ) : (
              <Button
                size="sm"
                variant="flat"
                color="success"
                startContent={<RefreshCw className="w-4 h-4" />}
                onClick={() => handleCheckStatus(order.consignment_id)}
                className="w-full rounded-lg"
              >
                Check
              </Button>
            )}
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<Trash2 className="w-4 h-4" />}
              onClick={() => handleDelete(order._id)}
              className="w-full rounded-lg"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Order Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5 font-medium">
            Manage your customer orders
          </p>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<RefreshCw className={`w-4 h-4 ${isSyncingStatus ? 'animate-spin' : ''}`} />}
          onClick={handleManualSync}
          isLoading={isSyncingStatus}
          className="rounded-lg"
        >
          Sync Status
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((card, idx) => (
          <Card
            key={idx}
            className="p-3 md:p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                  {card.value}
                </h3>
              </div>
              <div
                className={`p-1.5 md:p-2 rounded-lg ${card.bg} ${card.color}`}
              >
                {cloneElement(card.icon as ReactElement, { size: 16 } as any)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Controls */}
      <div className="p-3 md:p-4 mb-4 md:mb-6 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 rounded-xl flex flex-col lg:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search ID/Name..."
            startContent={<Search className="w-4 h-4 text-slate-400" />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            size="sm"
            className="w-full"
            variant="bordered"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 shrink-0">
          <StatusFilterPopover
            statusFilter={statusFilter}
            onSelect={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Top Pagination and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 mb-4 md:mb-6 bg-white dark:bg-slate-900/40 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 px-1">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {meta.total || 0} Orders
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              SHOW:
            </span>
            <LimitPopover
              limit={limit}
              onSelect={(val) => {
                setLimit(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        {meta.totalPage > 1 && (
          <div className="w-full sm:w-auto flex justify-center py-0">
            <Pagination
              currentPage={page}
              totalPage={meta.totalPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none">
            No orders found
          </Card>
        ) : (
          orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <Card className="p-0 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none overflow-hidden hidden lg:block">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => handleSort("_id")}
                >
                  <div className="flex items-center gap-1">
                    Order ID {renderSortIcon("_id")}
                  </div>
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden xl:table-cell">
                  Contact
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date {renderSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => handleSort("totalAmount")}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Amount {renderSortIcon("totalAmount")}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Invoice
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-slate-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 italic text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any, idx: number) => {
                  const template = selectedTemplates[order._id] || "template1";
                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={order._id}
                      className={`border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                        isEven ? "bg-white dark:bg-slate-900/10" : "bg-slate-50/20 dark:bg-slate-850/10"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-[170px]">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                            {order.billingInformation?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {order.billingInformation?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden xl:table-cell whitespace-nowrap">
                        {order.billingInformation?.phone || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                          ৳{order.totalAmount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-4">
                        <InvoiceTemplatePopover
                          currentTemplate={template}
                          onSelect={(val) => {
                            setSelectedTemplates((prev) => ({
                              ...prev,
                              [order._id]: val,
                            }));
                          }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            isIconOnly
                            onClick={() =>
                              navigate(`/admin/orders/${order._id}`)
                            }
                            title="View/Edit"
                            className="rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="secondary"
                            isIconOnly
                            onClick={() =>
                              window.open(
                                `/admin/orders/invoice/${order._id}?template=${template}`,
                                "_blank",
                              )
                            }
                            title="View Invoice"
                            className="rounded-lg"
                          >
                            <LayoutTemplate className="w-4 h-4" />
                          </Button>
                          {!order.consignment_id ? (
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              isIconOnly
                              onClick={() => handleSendToSteadfast(order)}
                              isLoading={isSendingToSteadfast}
                              title="Send to Steadfast"
                              className="rounded-lg"
                            >
                              <Truck className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="flat"
                              color="success"
                              isIconOnly
                              onClick={() =>
                                handleCheckStatus(order.consignment_id)
                              }
                              title="Check Courier Status"
                              className="rounded-lg"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            isIconOnly
                            onClick={() => handleDelete(order._id)}
                            title="Delete Order"
                            className="rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 md:mt-8 bg-white dark:bg-slate-900/40 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 w-full text-center md:text-left px-1">
          Showing {Math.min((page - 1) * limit + 1, meta.total)} -{" "}
          {Math.min(page * limit, meta.total)} of {meta.total}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Rows:
            </span>
            <LimitPopover
              limit={limit}
              onSelect={(val) => {
                setLimit(val);
                setPage(1);
              }}
            />
          </div>

          {meta.totalPage > 1 && (
            <div className="py-0">
              <Pagination
                currentPage={page}
                totalPage={meta.totalPage}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
