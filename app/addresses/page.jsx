"use client";

import { useMemo } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  MapPin,
  Building,
  Users,
  Package,
  Search,
  Filter,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const addressBook = [
  {
    id: "ADR001",
    customer: "Công ty ABC Import",
    type: "warehouse",
    contact: "Nguyễn Văn A",
    phone: "0901 234 567",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    country: "Việt Nam",
    pickupsPerWeek: 12,
  },
  {
    id: "ADR002",
    customer: "Studio Mỹ phẩm Elly",
    type: "store",
    contact: "Phạm Thị Bích",
    phone: "0933 888 222",
    address: "68 Thảo Điền, TP. Thủ Đức",
    country: "Việt Nam",
    pickupsPerWeek: 6,
  },
  {
    id: "ADR003",
    customer: "SSE Singapore Hub",
    type: "hub",
    contact: "Alex Tan",
    phone: "+65 8899 2211",
    address: "2 Changi Business Park, Singapore",
    country: "Singapore",
    pickupsPerWeek: 9,
  },
  {
    id: "ADR004",
    customer: "Hợp tác xã Nông sản Tây Nguyên",
    type: "warehouse",
    contact: "Y Liên",
    phone: "0978 555 321",
    address: "Làng nghề Buôn Ma Thuột, Đắk Lắk",
    country: "Việt Nam",
    pickupsPerWeek: 4,
  },
];

const typeConfig = {
  warehouse: { label: "Kho chính", color: "primary" },
  store: { label: "Chuỗi cửa hàng", color: "secondary" },
  hub: { label: "Điểm trung chuyển", color: "warning" },
};

export default function AddressesPage() {
  const totalPickups = useMemo(
    () => addressBook.reduce((sum, item) => sum + item.pickupsPerWeek, 0),
    [],
  );

  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Địa chỉ nhận & giao hàng
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Quản lý điểm pickup theo Mã K/H, đảm bảo thông tin chính xác cho đội hiện trường và hệ thống định tuyến.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Tìm địa chỉ"
              classNames={{ inputWrapper: "rounded-full" }}
              endContent={<Search className="h-4 w-4 text-slate-400" />}
              placeholder="Tìm kiếm khách hàng hoặc địa chỉ"
              variant="bordered"
            />
            <Button className="rounded-full" startContent={<Filter className="h-4 w-4" />} variant="flat">
              Bộ lọc
            </Button>
            <Button className="rounded-full" color="primary" startContent={<ArrowUpRight className="h-4 w-4" />}>
              Thêm địa chỉ mới
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 uppercase">
              Tổng địa chỉ đang hoạt động
            </p>
            <p className="text-3xl font-black text-slate-900">{addressBook.length}</p>
            <p className="text-sm font-medium text-slate-500">
              Mỗi địa chỉ được gắn nhân viên phụ trách theo phân quyền.
            </p>
          </CardBody>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 uppercase">
              Lượt pickup / tuần
            </p>
            <p className="text-3xl font-black text-slate-900">{totalPickups}</p>
            <p className="text-sm font-medium text-slate-500">
              Dựa trên kế hoạch điều phối và lịch trình tự động.
            </p>
          </CardBody>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 uppercase">
              Tuyến quốc tế
            </p>
            <p className="text-3xl font-black text-slate-900">02</p>
            <p className="text-sm font-medium text-slate-500">
              Liên kết DHL & UPS đã được cấu hình API với địa chỉ này.
            </p>
          </CardBody>
        </Card>
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-900">Danh sách địa chỉ</h2>
            <Chip className="font-semibold" color="secondary" variant="flat">
              Đồng bộ với module khách hàng
            </Chip>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {addressBook.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {item.id}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {item.customer}
                    </p>
                    <Chip className="mt-2 font-semibold" color={typeConfig[item.type].color} variant="flat">
                      {typeConfig[item.type].label}
                    </Chip>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Building className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Người phụ trách: {item.contact} ({item.phone})
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    {item.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-500" />
                    {item.country}
                  </p>
                  <p className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-purple-500" />
                    Lịch pickup mỗi tuần: {item.pickupsPerWeek} chuyến
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
