"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Scale,
  Ruler,
  ArrowUpDown,
  Settings,
  Calculator,
  Plus,
} from "lucide-react";

const conversionRules = [
  {
    code: "KG",
    label: "Kilogram",
    linkedTo: "Hoa hồng Khai thác",
    min: "0.1",
    max: "30",
    rounding: "0.1 kg",
    usedIn: "Tất cả dịch vụ",
  },
  {
    code: "VOL",
    label: "Thể tích (cm³)",
    linkedTo: "Giá cước quốc tế",
    min: "1.000",
    max: "120.000",
    rounding: "50 cm³",
    usedIn: "Express, Fulfillment",
  },
  {
    code: "PALLET",
    label: "Pallet tiêu chuẩn",
    linkedTo: "Hàng nặng",
    min: "1",
    max: "30",
    rounding: "1",
    usedIn: "Đường biển",
  },
];

const surchargeMatrix = [
  {
    id: "DIM-001",
    name: "Quy đổi thể tích",
    formula: "(D x R x C) / 5000",
    note: "Áp dụng cho dịch vụ quốc tế",
  },
  {
    id: "FUEL-INT",
    name: "Phụ phí nhiên liệu",
    formula: "5% giá cước",
    note: "Điều chỉnh hàng tuần theo DHL",
  },
  {
    id: "REMOTE",
    name: "Phụ phí vùng xa",
    formula: "150.000đ / shipment",
    note: "Áp dụng theo danh sách postal code",
  },
];

export default function UnitsPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Đơn vị & quy đổi</h1>
              <p className="text-sm font-medium text-slate-500">
                Thiết lập chuẩn đo lường cho tính cước, hoa hồng và đối soát.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Tìm quy đổi"
              classNames={{ inputWrapper: "rounded-full" }}
              placeholder="Tìm đơn vị hoặc công thức"
              variant="bordered"
            />
            <Button className="rounded-full" color="primary" startContent={<Plus className="h-4 w-4" />}>
              Thêm đơn vị
            </Button>
          </div>
        </div>
      </header>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-black text-slate-900">Bảng quy đổi chuẩn SSE</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {conversionRules.map((rule) => (
              <div key={rule.code} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {rule.code}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{rule.label}</p>
                  </div>
                  <Ruler className="h-6 w-6 text-amber-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Dùng cho: {rule.usedIn}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Liên kết: {rule.linkedTo}
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Min {rule.min} · Max {rule.max} · Làm tròn {rule.rounding}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-black text-slate-900">Công thức phụ phí & hệ số</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {surchargeMatrix.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                      {item.id}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{item.name}</p>
                  </div>
                  <ArrowUpDown className="h-6 w-6 text-purple-500" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Công thức: {item.formula}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
