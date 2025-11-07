import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Users,
  Truck,
  Package,
  DollarSign,
  CheckCircle2,
  FileText,
} from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    name: "Sales tiếp nhận",
    icon: Users,
    count: 12,
    color: "bg-blue-500",
  },
  { id: 2, name: "Pickup", icon: Truck, count: 8, color: "bg-purple-500" },
  { id: 3, name: "Khai thác", icon: Package, count: 15, color: "bg-amber-500" },
  {
    id: 4,
    name: "Sales nhập giá",
    icon: DollarSign,
    count: 6,
    color: "bg-blue-500",
  },
  {
    id: 5,
    name: "Thanh toán",
    icon: CheckCircle2,
    count: 18,
    color: "bg-green-500",
  },
  {
    id: 6,
    name: "Chứng từ",
    icon: FileText,
    count: 9,
    color: "bg-emerald-500",
  },
];

export default function WorkflowProgressCard() {
  const totalOrders = workflowSteps.reduce((sum, step) => sum + step.count, 0);

  return (
    <Card className="shadow-xl border-2 border-slate-100 bg-white p-2">
      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg text-slate-900">
          Đơn hàng theo quy trình
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {workflowSteps.map((step) => {
            const StepIcon = step.icon;
            const percentage = ((step.count / totalOrders) * 100).toFixed(0);

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${step.color} text-white`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">
                      {step.name}
                    </p>
                    <span className="text-sm font-semibold text-slate-900">
                      {step.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${step.color} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <Chip size="sm" variant="flat">
                  {percentage}%
                </Chip>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
