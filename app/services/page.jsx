"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Truck,
  Plane,
  Ship,
  PackageSearch,
  Sparkles,
  Zap,
  Database,
} from "lucide-react";

const serviceCatalog = [
  {
    id: "EXPRESS",
    name: "Express quốc tế",
    mode: "air",
    sla: "2-4 ngày",
    cod: false,
    description: "Kết nối DHL · UPS · FedEx qua API, hỗ trợ khai báo hải quan.",
  },
  {
    id: "ECONOMY",
    name: "Economy nội địa",
    mode: "ground",
    sla: "3-5 ngày",
    cod: true,
    description: "Tuyến liên tỉnh tối ưu chi phí, hỗ trợ thu hộ COD.",
  },
  {
    id: "FULFILL",
    name: "Fulfillment & lưu kho",
    mode: "warehouse",
    sla: "Trong ngày",
    cod: true,
    description: "Đóng gói, phân loại, dán nhãn theo chuẩn SSE.",
  },
  {
    id: "FREIGHT",
    name: "Hàng nặng đường biển",
    mode: "sea",
    sla: "7-12 ngày",
    cod: false,
    description: "Vận chuyển pallet, khai báo manifest tự động.",
  },
];

const modeConfig = {
  air: { icon: Plane, color: "from-blue-500 to-cyan-500", label: "Hàng không" },
  ground: { icon: Truck, color: "from-emerald-500 to-green-500", label: "Đường bộ" },
  warehouse: { icon: PackageSearch, color: "from-purple-500 to-violet-600", label: "Kho vận" },
  sea: { icon: Ship, color: "from-indigo-500 to-blue-700", label: "Đường biển" },
};

const automationRules = [
  {
    title: "Tự động tính cước",
    description:
      "Áp dụng bảng giá theo trọng lượng, tuyến đường và tỷ giá cập nhật thời gian thực.",
  },
  {
    title: "Theo dõi trạng thái",
    description:
      "Đồng bộ trạng thái với đối tác để gửi thông báo cho khách hàng và đội sales.",
  },
  {
    title: "Kiểm soát chứng từ",
    description:
      "Khi gắn bill hãng, hệ thống tự động đối chiếu với bill nội bộ để tránh sai sót.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Dịch vụ SSE</h1>
              <p className="text-sm font-medium text-slate-500">
                Định nghĩa sản phẩm vận chuyển để gắn với Mã K/H, SLA và chính sách hoa hồng.
              </p>
            </div>
          </div>
          <Button className="rounded-full" color="primary" startContent={<Zap className="h-4 w-4" />}>
            Tạo gói dịch vụ mới
          </Button>
        </div>
      </header>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Danh mục dịch vụ
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Phân loại theo phương thức vận chuyển
              </h2>
            </div>
            <Tabs aria-label="service mode" color="primary" className="bg-slate-100/60 rounded-full p-1">
              <Tab key="all" title={<span className="px-2 text-sm font-semibold">Tất cả</span>} />
              <Tab key="intl" title={<span className="px-2 text-sm font-semibold">Quốc tế</span>} />
              <Tab key="domestic" title={<span className="px-2 text-sm font-semibold">Nội địa</span>} />
            </Tabs>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {serviceCatalog.map((service) => {
              const mode = modeConfig[service.mode];
              const ModeIcon = mode.icon;
              return (
                <div key={service.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${mode.color} text-white shadow-lg`}>
                    <ModeIcon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                    {service.id}
                  </p>
                  <p className="text-lg font-bold text-slate-900">{service.name}</p>
                  <Chip className="mt-2 font-semibold" color="secondary" variant="flat">
                    {mode.label}
                  </Chip>
                  <p className="mt-2 text-sm font-medium text-slate-600">SLA: {service.sla}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    Thu hộ COD: {service.cod ? "Có" : "Không"}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-500">{service.description}</p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Database className="h-7 w-7" />
            <h2 className="text-2xl font-black">Tích hợp & tự động hóa</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {automationRules.map((rule) => (
              <div key={rule.title} className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
                <p className="text-lg font-bold text-white">{rule.title}</p>
                <p className="mt-2 text-sm font-medium text-white/80">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
