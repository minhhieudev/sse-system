"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Globe,
  Plane,
  Building,
  Wifi,
  ShieldCheck,
  Filter,
  Route,
} from "lucide-react";

const countryMatrix = [
  {
    code: "VN",
    name: "Việt Nam",
    hubs: ["TP.HCM", "Hà Nội"],
    partner: "SSE Express",
    apiStatus: "active",
    transitTime: "Nội địa 1-3 ngày",
  },
  {
    code: "SG",
    name: "Singapore",
    hubs: ["Changi Hub"],
    partner: "DHL Express",
    apiStatus: "active",
    transitTime: "Quốc tế 2 ngày",
  },
  {
    code: "US",
    name: "United States",
    hubs: ["Los Angeles", "New York"],
    partner: "UPS",
    apiStatus: "syncing",
    transitTime: "Quốc tế 4-5 ngày",
  },
  {
    code: "KR",
    name: "Korea",
    hubs: ["Incheon"],
    partner: "FedEx",
    apiStatus: "pending",
    transitTime: "Quốc tế 3 ngày",
  },
];

const statusConfig = {
  active: { label: "Đồng bộ API", color: "success" },
  syncing: { label: "Đang đồng bộ", color: "warning" },
  pending: { label: "Chờ thiết lập", color: "default" },
};

export default function CountriesPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-lg">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Quốc gia & tuyến vận chuyển</h1>
              <p className="text-sm font-medium text-slate-500">
                Theo dõi các tuyến quốc tế, đối tác kết nối API và SLA vận chuyển.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Tìm quốc gia"
              classNames={{ inputWrapper: "rounded-full" }}
              placeholder="Tìm kiếm quốc gia hoặc đối tác"
              variant="bordered"
            />
            <Button className="rounded-full" startContent={<Filter className="h-4 w-4" />} variant="flat">
              Bộ lọc vùng
            </Button>
            <Button className="rounded-full" color="primary" startContent={<Route className="h-4 w-4" />}>
              Thêm tuyến mới
            </Button>
          </div>
        </div>
      </header>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Plane className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-black text-slate-900">Bảng kết nối quốc tế</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {countryMatrix.map((country) => (
              <div key={country.code} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {country.code}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{country.name}</p>
                  </div>
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Hubs: {country.hubs.join(", ")}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Đối tác: {country.partner}
                </p>
                <Chip className="mt-3 font-semibold" color={statusConfig[country.apiStatus].color} variant="flat">
                  {statusConfig[country.apiStatus].label}
                </Chip>
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  SLA: {country.transitTime}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-7 w-7" />
            <h2 className="text-2xl font-black">API & bảo mật kết nối</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <ShieldCheck className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">OAuth 2.0 & IP Whitelist</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Tất cả API đối tác đều yêu cầu đăng ký IP và xác nhận từ chủ sở hữu.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Plane className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">Đồng bộ tracking</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Gửi đường link tracking cho khách ngay khi bill hãng được gắn.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Building className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">Theo dõi đối tác</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Báo cáo hiệu suất từng hãng vận chuyển, tự động cảnh báo trễ chuyến.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
