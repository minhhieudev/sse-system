"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import {
  DollarSign,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const rateSnapshots = [
  {
    code: "USD/VND",
    buy: 24550,
    sell: 24820,
    change: "+0.32%",
    source: "Vietcombank",
    updatedAt: "31/10/2024 09:00",
  },
  {
    code: "EUR/VND",
    buy: 26010,
    sell: 26340,
    change: "-0.18%",
    source: "SSE Treasury",
    updatedAt: "31/10/2024 09:00",
  },
  {
    code: "SGD/VND",
    buy: 17850,
    sell: 18120,
    change: "+0.12%",
    source: "SSE Treasury",
    updatedAt: "31/10/2024 09:00",
  },
];

const historicalSeries = [
  {
    date: "Tháng 8",
    usd: 24280,
    eur: 25890,
    sgd: 17650,
  },
  {
    date: "Tháng 9",
    usd: 24410,
    eur: 25980,
    sgd: 17730,
  },
  {
    date: "Tháng 10",
    usd: 24700,
    eur: 26220,
    sgd: 18010,
  },
];

export default function RatesPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Tỷ giá & quy đổi</h1>
              <p className="text-sm font-medium text-slate-500">
                Đồng bộ tỷ giá để tính cước quốc tế, hoa hồng và đối soát.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Tìm tỷ giá"
              classNames={{ inputWrapper: "rounded-full" }}
              placeholder="Tìm theo mã tiền tệ"
              variant="bordered"
            />
            <Button className="rounded-full" color="primary" startContent={<RefreshCw className="h-4 w-4" />}>
              Đồng bộ ngay
            </Button>
          </div>
        </div>
      </header>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Bảng tỷ giá hiện hành
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Nguồn: SSE Treasury & ngân hàng đối tác
              </h2>
            </div>
            <Chip className="font-semibold" color="success" variant="flat">
              Tự động cập nhật mỗi 4 tiếng
            </Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {rateSnapshots.map((rate) => (
              <div key={rate.code} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  {rate.code}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">Nguồn: {rate.source}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-medium text-slate-600">
                  <div>
                    <p className="text-xs text-slate-400">Giá mua</p>
                    <p className="text-base font-semibold text-emerald-600">
                      {rate.buy.toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Giá bán</p>
                    <p className="text-base font-semibold text-rose-600">
                      {rate.sell.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <Chip
                  className="mt-3 font-semibold"
                  color={rate.change.startsWith("-") ? "danger" : "success"}
                  variant="flat"
                >
                  Thay đổi: {rate.change}
                </Chip>
                <p className="mt-3 text-xs font-semibold text-slate-400">
                  Cập nhật: {rate.updatedAt}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                Biểu đồ xu hướng 3 tháng
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Theo dõi biến động để điều chỉnh bảng giá
              </h2>
            </div>
            <Tabs aria-label="currency filter" color="primary" className="bg-slate-100/60 rounded-full p-1">
              <Tab key="usd" title={<span className="px-2 text-sm font-semibold">USD</span>} />
              <Tab key="eur" title={<span className="px-2 text-sm font-semibold">EUR</span>} />
              <Tab key="sgd" title={<span className="px-2 text-sm font-semibold">SGD</span>} />
            </Tabs>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {historicalSeries.map((item) => (
              <div key={item.date} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  {item.date}
                </p>
                <div className="mt-2 space-y-2 text-sm font-medium text-slate-600">
                  <p className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" /> USD: {item.usd.toLocaleString("vi-VN")}
                  </p>
                  <p className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-rose-500" /> EUR: {item.eur.toLocaleString("vi-VN")}
                  </p>
                  <p className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-indigo-500" /> SGD: {item.sgd.toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7" />
            <h2 className="text-2xl font-black">Chuẩn xác & phê duyệt</h2>
          </div>
          <p className="text-sm font-medium text-white/80">
            Tỷ giá được khóa sau khi IT quản trị kiểm tra, chỉ chủ sở hữu mới có quyền thay đổi thủ công. Mọi cập nhật tự động gửi thông báo tới bộ phận Sales và Điều hành để áp dụng vào bảng giá.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
