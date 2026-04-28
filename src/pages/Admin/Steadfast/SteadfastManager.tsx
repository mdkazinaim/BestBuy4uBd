import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { Truck, RefreshCcw, Search, Package } from "lucide-react";
import {
  useGetSteadfastBalanceQuery,
  useGetSteadfastReturnRequestsQuery,
  useCheckSteadfastStatusQuery
} from "@/store/Api/SteadfastApi";
import { useState } from "react";
import { toast } from "sonner";

const SteadfastManager = () => {
  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useGetSteadfastBalanceQuery({});
  const { data: returnsData, isLoading: returnsLoading } = useGetSteadfastReturnRequestsQuery({});
  
  const [trackingId, setTrackingId] = useState("");
  const [paramId, setParamId] = useState(""); // For query trigger
  
  // Conditional query for tracking status
  const { data: statusData, isFetching: statusFetching } = useCheckSteadfastStatusQuery(paramId, {
    skip: !paramId,
  });

  const handleCheckStatus = () => {
    if(!trackingId) return toast.error("Please enter a consignment ID");
    setParamId(trackingId);
  };

  const currentBalance = balanceData?.data?.current_balance || 0;
  const returnRequests = returnsData?.data?.data || []; // Assuming paginated response structure or raw array

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-8">
      <div className="px-1">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
           <Truck className="text-emerald-600 w-5 h-5 md:w-8 md:h-8"/> Steadfast Courier
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-0.5">
          Monitor balance, track consignments, and manage returns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card className="bg-emerald-50 border-emerald-100 border">
             <CardBody className="p-4 md:p-6 flex flex-row items-center justify-between">
                <div>
                    <h3 className="text-emerald-900 font-semibold text-sm md:text-lg">Current Balance</h3>
                    <p className="text-2xl md:text-4xl font-bold text-emerald-700 mt-1 md:mt-2">
                        {balanceLoading ? "..." : `৳${currentBalance}`}
                    </p>
                </div>
                <Button isIconOnly variant="light" onPress={refetchBalance} color="success">
                    <RefreshCcw size={20} />
                </Button>
             </CardBody>
        </Card>

        {/* Tracking Lookup */}
        <Card>
            <CardHeader className="font-semibold">Check Delivery Status</CardHeader>
             <CardBody className="flex flex-row gap-2">
                <Input 
                    placeholder="Enter Consignment ID" 
                    value={trackingId} 
                    onChange={(e) => setTrackingId(e.target.value)}
                    startContent={<Search size={16} className="text-gray-400"/>}
                />
                <Button color="primary" onPress={handleCheckStatus} isLoading={statusFetching}>
                    Check
                </Button>
             </CardBody>
             {statusData && (
                 <div className="p-4 bg-gray-50 border-t">
                     <p className="text-sm"><strong>Status:</strong> {statusData?.data?.delivery_status || "Unknown"}</p>
                     <p className="text-sm mt-1"><strong>Last Updated:</strong> {statusData?.data?.updated_at || "N/A"}</p>
                 </div>
             )}
        </Card>
      </div>

      {/* Return Requests Table */}
      <Card>
          <CardHeader className="flex gap-2">
              <Package size={20} className="text-gray-600"/>
              <h3 className="font-bold text-lg">Return Requests</h3>
          </CardHeader>
          <CardBody>
              <Table aria-label="Return Requests Table">
                  <TableHeader>
                      <TableColumn>CONSIGNMENT ID</TableColumn>
                      <TableColumn>REASON</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={returnsLoading ? "Loading..." : "No return requests found."}>
                      {returnRequests.map((item: any, idx: number) => (
                          <TableRow key={idx}>
                              <TableCell>{item.consignment_id || "N/A"}</TableCell>
                              <TableCell>{item.reason || "N/A"}</TableCell>
                              <TableCell>
                                  <Chip color={item.status === 'pending' ? 'warning' : 'default'} size="sm">
                                      {item.status || "Unknown"}
                                  </Chip>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardBody>
      </Card>
    </div>
  );
};

export default SteadfastManager;
