"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  UserPlus,
  Handshake,
  Building2,
  Globe2,
  Award,
  Phone,
  Mail,
  Filter,
  Search,
} from "lucide-react";

const collaboratorSegments = [
  {
    id: "c1",
    name: "Đối tác last-mile",
    description: "Phủ sóng 18 tỉnh thành, hỗ trợ pickup và giao nội địa",
    partners: 12,
    sla: "98% đúng hẹn",
    icon: Handshake,
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    id: "c2",
    name: "Đối tác quốc tế",
    description: "Kết nối DHL · UPS · FedEx qua API, xử lý chứng từ",
    partners: 6,
    sla: "100% chuẩn chứng từ",
    icon: Globe2,
    accent: "from-blue-500 to-indigo-600",
  },
  {
    id: "c3",
    name: "Kênh fulfillment",
    description: "Điều phối kho ngoại quan và dịch vụ giá trị gia tăng",
    partners: 4,
    sla: "92% đúng tiến độ",
    icon: Building2,
    accent: "from-purple-500 to-pink-500",
  },
];

const collaboratorList = [
  {
    id: "CTV001",
    name: "SSE Partner Hub - Hà Nội",
    segment: "lastmile",
    contact: "Nguyễn Quốc Long",
    phone: "0912 345 678",
    email: "long.nguyen@ssepartner.vn",
    scope: "Pickup & giao hàng khu vực miền Bắc",
    rating: "4.8/5",
  },
  {
    id: "CTV002",
    name: "DHL Express VN",
    segment: "international",
    contact: "Lan Phạm",
    phone: "0909 777 888",
    email: "lan.pham@dhl.com",
    scope: "Kết nối API · Khai báo hải quan",
    rating: "4.9/5",
  },
  {
    id: "CTV003",
    name: "SSE Fulfillment Hub",
    segment: "fulfillment",
    contact: "Trần Gia Huy",
    phone: "0988 456 321",
    email: "gia.huy@fulfill-sse.com",
    scope: "Đóng gói - kiểm đếm - lưu kho",
    rating: "4.6/5",
  },
];

const segmentConfig = {
  lastmile: { label: "Last-mile", color: "success" },
  international: { label: "Quốc tế", color: "primary" },
  fulfillment: { label: "Fulfillment", color: "secondary" },
};

export default function CollaboratorsPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Cộng tác viên & đối tác vận hành
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Liên kết trách nhiệm, hoa hồng và SLA theo yêu cầu minh bạch của hệ thống.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              aria-label="Tìm cộng tác viên"
              classNames={{ inputWrapper: "rounded-full" }}
              endContent={<Search className="h-4 w-4 text-slate-400" />}
              placeholder="Tìm theo tên, khu vực hoặc vai trò"
              variant="bordered"
            />
            <Button className="rounded-full" startContent={<Filter className="h-4 w-4" />} variant="flat">
              Bộ lọc nâng cao
            </Button>
            <Button className="rounded-full" color="primary" startContent={<UserPlus className="h-4 w-4" />}>
              Thêm đối tác mới
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {collaboratorSegments.map((segment) => {
          const Icon = segment.icon;
          return (
            <Card key={segment.id} className="border border-slate-200 shadow-sm">
              <CardBody className="space-y-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${segment.accent} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-lg font-bold text-slate-900">{segment.name}</p>
                <p className="text-sm font-medium text-slate-500">{segment.description}</p>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{segment.partners} đối tác</span>
                  <Chip color="primary" variant="flat" className="font-semibold">
                    SLA {segment.sla}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-900">Danh sách cộng tác viên chiến lược</h2>
            <Chip className="font-semibold" color="warning" variant="flat">
              Gắn quyền truy cập theo vai trò trong hệ thống
            </Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collaboratorList.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-purple-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {item.id}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {item.name}
                    </p>
                    <Chip className="mt-2 font-semibold" color={segmentConfig[item.segment].color} variant="flat">
                      {segmentConfig[item.segment].label}
                    </Chip>
                  </div>
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
                <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                  <p className="flex items-center gap-2">
                    <Handshake className="h-4 w-4 text-blue-500" />
                    Phạm vi: {item.scope}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    {item.contact} · {item.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    {item.email}
                  </p>
                  <p className="text-sm font-semibold text-purple-600">
                    Đánh giá SLA: {item.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
