"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Tags,
  Package,
  Gift,
  Shield,
  Filter,
  Plus,
  Sparkles,
} from "lucide-react";

const categoryGroups = [
  {
    id: "CAT-EXP",
    name: "Hàng thương mại điện tử",
    services: ["Express quốc tế", "Fulfillment"],
    restrictions: "Tuân thủ chính sách hoàn trả và kiểm đếm",
    risk: "Thấp",
  },
  {
    id: "CAT-CARGO",
    name: "Hàng nặng - pallet",
    services: ["Hàng nặng đường biển", "Economy"],
    restrictions: "Cần booking trước 48h, khai báo trọng lượng chính xác",
    risk: "Trung bình",
  },
  {
    id: "CAT-PHARMA",
    name: "Dược phẩm & y tế",
    services: ["Express quốc tế", "Kho lạnh"],
    restrictions: "Yêu cầu chứng từ kiểm định, bảo quản theo nhiệt độ",
    risk: "Cao",
  },
];

const riskConfig = {
  Thấp: { color: "success" },
  "Trung bình": { color: "warning" },
  Cao: { color: "danger" },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
              <Tags className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Phân loại hàng hóa</h1>
              <p className="text-sm font-medium text-slate-500">
                Liên kết nhóm sản phẩm với quy trình xử lý, phụ phí và phân quyền.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Tìm loại hàng"
              classNames={{ inputWrapper: "rounded-full" }}
              placeholder="Tìm kiếm loại hàng hoặc dịch vụ"
              variant="bordered"
            />
            <Button className="rounded-full" startContent={<Filter className="h-4 w-4" />} variant="flat">
              Bộ lọc nâng cao
            </Button>
            <Button className="rounded-full" color="primary" startContent={<Plus className="h-4 w-4" />}>
              Thêm phân loại
            </Button>
          </div>
        </div>
      </header>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-black text-slate-900">Nhóm hàng & chính sách</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {categoryGroups.map((group) => (
              <div key={group.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {group.id}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{group.name}</p>
                  </div>
                  <Gift className="h-6 w-6 text-rose-500" />
                </div>
                <div className="mt-3 space-y-1 text-sm font-medium text-slate-600">
                  <p>Dịch vụ áp dụng:</p>
                  {group.services.map((service) => (
                    <Chip key={service} className="font-semibold" color="secondary" size="sm" variant="flat">
                      {service}
                    </Chip>
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">{group.restrictions}</p>
                <Chip className="mt-3 font-semibold" color={riskConfig[group.risk].color} variant="flat">
                  Mức rủi ro: {group.risk}
                </Chip>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 via-purple-900 to-violet-700 text-white">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7" />
            <h2 className="text-2xl font-black">Quy trình kiểm duyệt</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Package className="h-6 w-6 text-pink-200" />
              <p className="mt-2 text-lg font-bold text-white">Mô tả hàng hóa chuẩn</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Bắt buộc ghi rõ tính chất, pháp lý, nhiệt độ bảo quản (nếu có).
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Shield className="h-6 w-6 text-pink-200" />
              <p className="mt-2 text-lg font-bold text-white">Kiểm tra điều kiện vận chuyển</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Đội điều hành xem xét phụ phí, bảo hiểm và yêu cầu chứng từ.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Sparkles className="h-6 w-6 text-pink-200" />
              <p className="mt-2 text-lg font-bold text-white">Kích hoạt tự động</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                Sau khi phê duyệt, hệ thống gợi ý dịch vụ và hoa hồng tương ứng cho Sales.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
