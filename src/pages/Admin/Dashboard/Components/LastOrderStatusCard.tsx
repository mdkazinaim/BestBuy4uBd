import { Card, CardBody, Chip } from "@heroui/react";
import { Package } from "lucide-react";

interface LastOrderStatusCardProps {
  lastOrder: {
    _id: string;
    status: string;
    totalAmount: number;
  };
  formatStatus: (status: string) => string;
}

const LastOrderStatusCard = ({ lastOrder, formatStatus }: LastOrderStatusCardProps) => {
  return (
    <Card className="border-none shadow-sm bg-gradient-to-r from-yellow-500 to-amber-100 text-white rounded-xl">
      <CardBody className="p-3 md:p-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-full shrink-0">
            <Package className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-medium opacity-90 text-white uppercase tracking-wider">
              Last Order Status
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-lg md:text-2xl font-bold capitalize text-white">
                {formatStatus(lastOrder.status)}
              </h2>
              <Chip
                variant="flat"
                className="bg-white/20 text-white border-none text-[10px] font-bold uppercase"
                size="sm"
              >
                ID: {lastOrder._id.slice(-6)}
              </Chip>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-base opacity-80 uppercase tracking-widest font-medium text-black">
            Amount
          </p>
          <p className="text-lg md:text-2xl font-bold text-black mt-0.5">
            ৳{lastOrder.totalAmount.toLocaleString()}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default LastOrderStatusCard;
