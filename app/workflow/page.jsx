"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Package,
  Route,
  Search,
  Target,
  Truck,
  Users,
} from "lucide-react";

const mockWorkflowOrders = [
  {
    id: "ORD-001",
    awb: "SSE987654",
    refCode: "REF-SEA-001",
    customerCode: "KH001",
    customerName: "Alpha Import Co.",
    currentStep: 6,
    createdAt: "2024-10-28 09:30",
    steps: [
      {
        step: 1,
        name: "Tiếp nhận yêu cầu",
        staff: "Sales - Trần Minh",
        timestamp: "2024-10-28 09:30",
        status: "completed",
        note: "Đã nhập thông tin khách hàng",
      },
      {
        step: 2,
        name: "Pickup nhận hàng",
        staff: "Pickup - Nguyễn Duy",
        timestamp: "2024-10-28 11:10",
        status: "completed",
        note: "Đã đưa hàng về kho Tân Bình",
        commission: 5000,
      },
      {
        step: 3,
        name: "Khai thác đóng gói",
        staff: "Warehouse - Huỳnh Vũ",
        timestamp: "2024-10-28 15:45",
        status: "completed",
        note: "Khối lượng 18.5kg, 2 kiện",
        commission: 10000,
      },
      {
        step: 4,
        name: "Nhập giá bán",
        staff: "Sales - Trần Minh",
        timestamp: "2024-10-28 18:20",
        status: "completed",
        note: "Đã gửi báo giá qua email",
      },
      {
        step: 5,
        name: "Khách thanh toán",
        timestamp: "2024-10-29 08:10",
        status: "completed",
        note: "Khách thanh toán qua chuyển khoản",
      },
      {
        step: 6,
        name: "Xử lý chứng từ",
        staff: "Documentation - Mỹ Vân",
        timestamp: "2024-10-29 11:05",
        status: "in_progress",
        note: "Đang đối chiếu bill DHL",
      },
      {
        step: 7,
        name: "Hoàn tất",
        status: "pending",
      },
    ],
  },
  {
    id: "ORD-002",
    awb: "SSE457801",
    refCode: "REF-HAUI-215",
    customerCode: "KH002",
    customerName: "Logistics Hub VN",
    currentStep: 4,
    createdAt: "2024-10-30 10:00",
    steps: [
      {
        step: 1,
        name: "Tiếp nhận yêu cầu",
        staff: "Sales - Nguyễn An",
        timestamp: "2024-10-30 10:00",
        status: "completed",
      },
      {
        step: 2,
        name: "Pickup nhận hàng",
        staff: "Pickup - Lê Thắng",
        timestamp: "2024-10-30 14:20",
        status: "completed",
        commission: 5000,
      },
      {
        step: 3,
        name: "Khai thác đóng gói",
        staff: "Warehouse - Bảo Vy",
        timestamp: "2024-10-31 08:40",
        status: "completed",
        note: "4 kiện, tổng khối lượng 32kg",
        commission: 15000,
      },
      {
        step: 4,
        name: "Nhập giá bán",
        staff: "Sales - Nguyễn An",
        timestamp: null,
        status: "in_progress",
      },
      {
        step: 5,
        name: "Khách thanh toán",
        status: "pending",
      },
      {
        step: 6,
        name: "Xử lý chứng từ",
        status: "pending",
      },
      {
        step: 7,
        name: "Hoàn tất",
        status: "pending",
      },
    ],
  },
  {
    id: "ORD-003",
    awb: "SSE302114",
    refCode: "REF-USA-778",
    customerCode: "KH003",
    customerName: "Global Fashion US",
    currentStep: 7,
    createdAt: "2024-10-25 08:15",
    steps: [
      {
        step: 1,
        name: "Tiếp nhận yêu cầu",
        staff: "Sales - Phạm Thảo",
        timestamp: "2024-10-25 08:15",
        status: "completed",
      },
      {
        step: 2,
        name: "Pickup nhận hàng",
        staff: "Pickup - Quốc Huy",
        timestamp: "2024-10-25 09:40",
        status: "completed",
        commission: 5000,
      },
      {
        step: 3,
        name: "Khai thác đóng gói",
        staff: "Warehouse - Minh Nhật",
        timestamp: "2024-10-25 11:50",
        status: "completed",
        note: "Hàng thời trang, đã chụp hình",
        commission: 10000,
      },
      {
        step: 4,
        name: "Nhập giá bán",
        staff: "Sales - Phạm Thảo",
        timestamp: "2024-10-25 13:20",
        status: "completed",
      },
      {
        step: 5,
        name: "Khách thanh toán",
        timestamp: "2024-10-25 17:05",
        status: "completed",
      },
      {
        step: 6,
        name: "Xử lý chứng từ",
        staff: "Documentation - Mỹ Vân",
        timestamp: "2024-10-25 19:10",
        status: "completed",
      },
      {
        step: 7,
        name: "Hoàn tất",
        timestamp: "2024-10-26 09:00",
        status: "completed",
        note: "Đã giao hàng tại New York",
      },
    ],
  },
];

const stepConfig = {
  1: { icon: Users, label: "Sales tiếp nhận" },
  2: { icon: Truck, label: "Pickup" },
  3: { icon: Package, label: "Khai thác" },
  4: { icon: DollarSign, label: "Nhập giá" },
  5: { icon: CheckCircle2, label: "Thanh toán" },
  6: { icon: FileText, label: "Chứng từ" },
  7: { icon: CheckCircle2, label: "Hoàn tất" },
};

const statusConfig = {
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  in_progress: {
    label: "Đang xử lý",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  pending: {
    label: "Chờ xử lý",
    icon: Clock,
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
};

export default function WorkflowPage() {
  const [orders] = useState(mockWorkflowOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStep, setFilterStep] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.awb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.refCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStep =
        filterStep === "all" ||
        order.currentStep === Number.parseInt(filterStep, 10);

      return matchesSearch && matchesStep;
    });
  }, [orders, searchQuery, filterStep]);

  useEffect(() => {
    if (!selectedOrderId && filteredOrders.length > 0) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [selectedOrderId, filteredOrders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) {
      return filteredOrders[0] ?? null;
    }

    return (
      filteredOrders.find((order) => order.id === selectedOrderId) ??
      orders.find((order) => order.id === selectedOrderId) ??
      null
    );
  }, [filteredOrders, orders, selectedOrderId]);

  const stats = useMemo(() => {
    const total = orders.length;
    const perStep = {
      total,
    };

    Object.keys(stepConfig).forEach((step) => {
      perStep[`step${step}`] = orders.filter(
        (order) => order.currentStep === Number(step),
      ).length;
    });

    return perStep;
  }, [orders]);

  const overviewCards = useMemo(() => {
    const completed = stats.step7 ?? 0;
    const completionRate =
      stats.total === 0 ? 0 : Math.round((completed / stats.total) * 100);

    return [
      {
        id: "total",
        title: "Đơn đang xử lý",
        value: stats.total,
        description: "Pipeline realtime toàn hệ thống",
        accent: "from-blue-500 to-indigo-500",
        icon: Route,
      },
      {
        id: "completed",
        title: "Hoàn tất hôm nay",
        value: completed,
        description: `${completionRate}% đơn đã hoàn thành`,
        accent: "from-emerald-500 to-teal-500",
        icon: CheckCircle2,
      },
      {
        id: "sla",
        title: "Pickup đúng SLA",
        value: "92%",
        description: "Theo dõi pickup & chứng từ đúng hạn",
        accent: "from-purple-500 to-pink-500",
        icon: Activity,
      },
      {
        id: "attention",
        title: "Cần xử lý",
        value: (stats.step3 ?? 0) + (stats.step4 ?? 0),
        description: "Đơn đang chờ khai thác / báo giá",
        accent: "from-amber-500 to-orange-500",
        icon: Target,
      },
    ];
  }, [stats]);

  const alerts = useMemo(() => {
    return [
      {
        id: "warehouse",
        title: "Chờ khai thác",
        value: stats.step3 ?? 0,
        description: "Cần đóng gói trong 120 phút",
        tone: "warning",
      },
      {
        id: "quotation",
        title: "Chờ báo giá",
        value: stats.step4 ?? 0,
        description: "Sales cần gửi báo giá cho khách",
        tone: "info",
      },
      {
        id: "documents",
        title: "Đang chứng từ",
        value: stats.step6 ?? 0,
        description: "Theo dõi bill hãng & phát hành chứng từ",
        tone: "success",
      },
    ];
  }, [stats]);

  const toneStyles = {
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <header className="border-b border-slate-200/50 bg-white/90 backdrop-blur-xl shadow-lg relative">
        <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Logistics Workflow Control
              </span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Quy trình xử lý đơn hàng
            </h1>
            <p className="text-base font-medium text-slate-600 max-w-2xl">
              Theo dõi pipeline 7 bước từ tiếp nhận, pickup, khai thác tới chứng
              từ & hoàn tất.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card, idx) => {
              const Icon = card.icon;

              return (
                <Card
                  key={card.id}
                  className="group relative overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Decorative gradient line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`}
                  />

                  {/* Static glow effect */}
                  <div
                    className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${card.accent} opacity-5 rounded-full blur-3xl`}
                  />

                  <CardBody className="space-y-4 p-6 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                          {card.title}
                        </p>
                        <p className="text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                          {card.value}
                        </p>
                        <p className="text-sm font-medium text-slate-600">
                          {card.description}
                        </p>
                      </div>
                      <div
                        className={`relative rounded-2xl p-3.5 bg-gradient-to-br ${card.accent} text-white shadow-lg`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative">
        <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
          <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardBody className="space-y-5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative lg:w-[420px] group">
                  {/* Gradient glow on focus */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur-lg transition-all duration-500 group-focus-within:opacity-30" />
                  <Input
                    classNames={{
                      inputWrapper:
                        "relative border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm transition-all duration-300 group-focus-within:border-transparent group-focus-within:shadow-xl px-4",
                      input: "text-sm font-medium text-slate-900",
                    }}
                    placeholder="Tìm AWB, REF Code, khách hàng..."
                    size="lg"
                    startContent={
                      <div className="flex items-center justify-center w-10 h-10 -ml-3 mr-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 group-focus-within:from-blue-200 group-focus-within:to-indigo-200 transition-all duration-300">
                        <Search className="h-5 w-5 text-blue-600 group-focus-within:scale-110 transition-transform duration-300" />
                      </div>
                    }
                    value={searchQuery}
                    variant="bordered"
                    onValueChange={setSearchQuery}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={`rounded-full font-bold transition-all duration-300 ${filterStep === "all" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105" : "hover:bg-slate-100"}`}
                    size="sm"
                    variant={filterStep === "all" ? "solid" : "flat"}
                    onPress={() => setFilterStep("all")}
                  >
                    Tất cả ({stats.total})
                  </Button>
                  {Object.keys(stepConfig).map((step) => (
                    <Button
                      key={step}
                      className={`rounded-full font-bold transition-all duration-300 ${filterStep === step ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105" : "hover:bg-slate-100"}`}
                      size="sm"
                      variant={filterStep === step ? "solid" : "flat"}
                      onPress={() => setFilterStep(step)}
                    >
                      Bước {step} ({stats[`step${step}`] ?? 0})
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={alert.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${toneStyles[alert.tone]}`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Decorative gradient on top */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${alert.tone === "warning" ? "bg-gradient-to-r from-amber-400 to-orange-500" : alert.tone === "info" ? "bg-gradient-to-r from-blue-400 to-cyan-500" : "bg-gradient-to-r from-emerald-400 to-green-500"}`}
                    />

                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-base">{alert.title}</p>
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg font-black">
                          {alert.value}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium opacity-90">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
            <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardBody className="space-y-4 p-6">
                {filteredOrders.length === 0 ? (
                  <div className="flex min-h-[200px] flex-col items-center justify-center text-slate-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                      <AlertCircle className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="font-semibold text-lg">
                      Không tìm thấy đơn hàng phù hợp
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order, idx) => {
                    const progress = Math.min(
                      ((order.currentStep - 1) / 6) * 100,
                      100,
                    );

                    return (
                      <button
                        key={order.id}
                        className={`group w-full rounded-2xl border-2 bg-gradient-to-br from-white to-slate-50/50 p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                          selectedOrderId === order.id
                            ? "border-blue-500 ring-4 ring-blue-500/20"
                            : "border-slate-200/80"
                        }`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-slate-900">
                                {order.awb}
                              </h3>
                              <Chip color="primary" size="sm" variant="flat">
                                {order.refCode}
                              </Chip>
                            </div>
                            <p className="text-sm text-slate-600">
                              {order.customerName} • {order.customerCode}
                            </p>
                            <p className="text-xs text-slate-500">
                              Tạo lúc: {order.createdAt}
                            </p>
                          </div>
                          <Chip
                            color={
                              order.currentStep >= 7 ? "success" : "warning"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {order.currentStep >= 7
                              ? "Hoàn tất"
                              : `Đang ở bước ${order.currentStep}/7`}
                          </Chip>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{order.steps[0]?.name}</span>
                            <span>
                              {order.steps[order.steps.length - 1]?.name}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </CardBody>
            </Card>

            <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardBody className="space-y-5 p-6">
                {selectedOrder ? (
                  <>
                    <div className="space-y-3 relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl" />
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                            Đang theo dõi
                          </p>
                          <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            {selectedOrder.awb}
                          </h3>
                          <p className="text-sm font-medium text-slate-600 mt-1">
                            REF: {selectedOrder.refCode} •{" "}
                            {selectedOrder.customerName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50 p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
                      <div className="flex items-center justify-between text-sm font-bold text-emerald-700 mb-3">
                        <span>Tiến độ tổng thể</span>
                        <span className="text-xl">
                          {Math.round(
                            Math.min(
                              ((selectedOrder.currentStep - 1) / 6) * 100,
                              100,
                            ),
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-white/80 backdrop-blur-sm shadow-inner overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg transition-all duration-500"
                          style={{
                            width: `${Math.min(((selectedOrder.currentStep - 1) / 6) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.steps.map((step, idx) => {
                        const config = statusConfig[step.status];

                        return (
                          <div
                            key={step.step}
                            className={`group relative overflow-hidden flex items-center justify-between rounded-2xl border-2 bg-gradient-to-br from-white to-slate-50 px-4 py-3.5 text-sm transition-all duration-300 hover:-translate-x-1 ${
                              step.status === "in_progress"
                                ? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg"
                                : "border-slate-200/80 hover:shadow-md"
                            }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            {/* Gradient indicator */}
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-1 ${step.status === "completed" ? "bg-gradient-to-b from-emerald-500 to-green-500" : step.status === "in_progress" ? "bg-gradient-to-b from-blue-500 to-indigo-500" : "bg-slate-300"}`}
                            />

                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${config.bg} ${config.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
                              >
                                <config.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-slate-900 mb-0.5">
                                  Bước {step.step}: {step.name}
                                </p>
                                <p className="text-xs font-medium text-slate-600">
                                  {step.timestamp || "Chờ cập nhật"}
                                </p>
                              </div>
                            </div>
                            <Chip
                              className={`font-bold shadow-sm ${
                                step.status === "completed"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : step.status === "in_progress"
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                              size="sm"
                              variant="flat"
                            >
                              {config.label}
                            </Chip>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[240px] flex-col items-center justify-center text-center text-sm text-slate-500">
                    <AlertCircle className="mb-3 h-8 w-8 text-slate-300" />
                    Chọn một đơn ở danh sách bên trái để xem chi tiết timeline.
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
