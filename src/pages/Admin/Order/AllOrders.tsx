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
  Select,
  SelectItem,
  Button,
  Input,
  Pagination,
} from "@heroui/react";
import { useState, useEffect, useCallback, cloneElement, ReactElement } from "react";

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
    setPage(1); // Reset to first page on sort
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  const handleCheckStatus = async (consignmentId: string) => {
    if (!consignmentId) return;
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
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

  // Automatic Sync Logic
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
      bg: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stats?.pendingCount || 0,
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Processing",
      value: stats?.processingCount || 0,
      icon: <Truck className="w-5 h-5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Delivered",
      value: stats?.deliveredCount || 0,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: stats?.canceledCount || 0,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600",
      bg: "bg-red-50",
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "processing":
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "pending":
      case "hold":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {formattedStatus || status}
          </span>
        );
    }
  };

  // Mobile Card Component
  const OrderCard = ({ order }: { order: any }) => {
    const template = selectedTemplates[order._id] || "template1";

    return (
      <Card className="p-4 mb-3 border border-gray-200">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-mono">
                #{order._id?.slice(-6).toUpperCase()}
              </p>
              <p className="font-semibold text-gray-900">
                {order.billingInformation?.name || "Unknown"}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">
                Amount
              </p>
              <p className="font-bold text-gray-900 text-sm">
                ৳{order.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">
                Date
              </p>
              <p className="text-gray-700 text-sm">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Invoice Template */}
          <div >
            <p className="text-xs text-gray-500 mb-1">Invoice Template</p>
            <Select
              size="sm"
              aria-label="Select Invoice Template"
              selectedKeys={[template]}
              
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setSelectedTemplates((prev) => ({ ...prev, [order._id]: val }));
              }}
              className="bg-white"
            >
              <SelectItem key="template1" textValue="Template 1">
                Modern
              </SelectItem>
              <SelectItem key="template2" textValue="Template 2">
                Professional
              </SelectItem>
              <SelectItem key="template3" textValue="Template 3">
                Minimalist
              </SelectItem>
              <SelectItem key="template4" textValue="Template 4">
                Purchase Order
              </SelectItem>
            </Select>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Eye className="w-4 h-4" />}
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="w-full"
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
              className="w-full"
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
                className="w-full"
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
                className="w-full"
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
              className="w-full"
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">
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
        >
          Sync Status
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        {statCards.map((card, idx) => (
          <Card
            key={idx}
            className="p-3 md:p-4 border-none shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mt-0.5">
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
      <Card className="p-2 md:p-4 mb-4 md:mb-6 shadow-sm border-none bg-gray-50/50">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search ID/Name..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
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
            <div className="w-full sm:w-48">
              <Select
                aria-label="Status Filter"
                placeholder="Status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  setStatusFilter(val);
                  setPage(1);
                }}
                size="sm"
                variant="bordered"
              >
                <SelectItem key="all" textValue="All Status">
                  All Status
                </SelectItem>
                <SelectItem key="pending" textValue="Pending">
                  Pending
                </SelectItem>
                <SelectItem
                  key="delivered_approval_pending"
                  textValue="Delivered (Approval Pending)"
                >
                  Delivered (Approval Pending)
                </SelectItem>
                <SelectItem
                  key="partial_delivered_approval_pending"
                  textValue="Partial Delivered (Approval Pending)"
                >
                  Partial Delivered (Approval Pending)
                </SelectItem>
                <SelectItem
                  key="cancelled_approval_pending"
                  textValue="Cancelled (Approval Pending)"
                >
                  Cancelled (Approval Pending)
                </SelectItem>
                <SelectItem
                  key="unknown_approval_pending"
                  textValue="Unknown (Approval Pending)"
                >
                  Unknown (Approval Pending)
                </SelectItem>
                <SelectItem key="delivered" textValue="Delivered">
                  Delivered
                </SelectItem>
                <SelectItem
                  key="partial_delivered"
                  textValue="Partial Delivered"
                >
                  Partial Delivered
                </SelectItem>
                <SelectItem key="cancelled" textValue="Cancelled">
                  Cancelled
                </SelectItem>
                <SelectItem key="hold" textValue="Hold">
                  Hold
                </SelectItem>
                <SelectItem key="in_review" textValue="In Review">
                  In Review
                </SelectItem>
                <SelectItem key="unknown" textValue="Unknown">
                  Unknown
                </SelectItem>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Pagination and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 mb-4 md:mb-6 bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 px-1">
          <span className="text-sm font-medium text-gray-500">
            {meta.total || 0} Orders
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold hidden xs:block">
              SHOW:
            </span>
            <Select
              size="sm"
              className="w-20"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {meta.totalPage > 1 && (
          <div className="w-full sm:w-auto flex justify-center">
            <Pagination
              total={meta.totalPage}
              page={page}
              onChange={(newPage) => setPage(newPage)}
              showControls
              color="primary"
              size="sm"
              className="scale-[0.85] sm:scale-100"
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
          <Card className="p-8 text-center text-gray-500">No orders found</Card>
        ) : (
          orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <Card className="p-6 border border-gray-200 shadow-sm overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("_id")}
                >
                  <div className="flex items-center gap-1">
                    Order ID {renderSortIcon("_id")}
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Customer
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden xl:table-cell">
                  Contact
                </th>
                <th
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date {renderSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("totalAmount")}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Amount {renderSortIcon("totalAmount")}
                  </div>
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Invoice
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const template = selectedTemplates[order._id] || "template1";
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs text-gray-500 whitespace-nowrap">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="min-w-[150px]">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {order.billingInformation?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {order.billingInformation?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700 hidden xl:table-cell whitespace-nowrap">
                        {order.billingInformation?.phone || "N/A"}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <span className="font-bold text-gray-900 text-sm">
                          ৳{order.totalAmount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-3 py-3">
                        <Select
                          size="sm"
                          className="min-w-[120px]"
                          aria-label="Select Invoice Template"
                          selectedKeys={[template]}
                          onSelectionChange={(keys) => {
                            const val = Array.from(keys)[0] as string;
                            setSelectedTemplates((prev) => ({
                              ...prev,
                              [order._id]: val,
                            }));
                          }}
                        >
                          <SelectItem key="template1" textValue="Template 1">
                            Modern
                          </SelectItem>
                          <SelectItem key="template2" textValue="Template 2">
                            Professional
                          </SelectItem>
                          <SelectItem key="template3" textValue="Template 3">
                            Minimalist
                          </SelectItem>
                          <SelectItem key="template4" textValue="Template 4">
                            Purchase Order
                          </SelectItem>
                        </Select>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            isIconOnly
                            onClick={() =>
                              navigate(`/admin/orders/${order._id}`)
                            }
                            title="View/Edit"
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 md:mt-8 bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-xs md:text-sm font-medium text-gray-500 w-full text-center md:text-left px-1">
          Showing {Math.min((page - 1) * limit + 1, meta.total)} -{" "}
          {Math.min(page * limit, meta.total)} of {meta.total}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap font-bold uppercase">
              Rows:
            </span>
            <Select
              size="sm"
              className="w-16"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>

          {meta.totalPage > 1 && (
            <div className="scale-[0.85] sm:scale-100">
              <Pagination
                total={meta.totalPage}
                page={page}
                onChange={(newPage) => setPage(newPage)}
                showControls
                color="primary"
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
