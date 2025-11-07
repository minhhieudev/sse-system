"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Users,
  DollarSign,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const summaryCards = [
  {
    id: "revenue",
    title: "Doanh thu",
    value: "12,8 tỷ",
    change: "+18% so với cùng kỳ",
    icon: DollarSign,
    accent: "from-blue-500/90 to-blue-700",
  },
  {
    id: "commission",
    title: "Hoa hồng đã ghi nhận",
    value: "426 triệu",
    change: "+9% | 5 phòng ban",
    icon: TrendingUp,
    accent: "from-purple-500 to-indigo-600",
  },
  {
    id: "completed",
    title: "Đơn hoàn tất",
    value: "1.286",
    change: "Tỷ lệ 96,3%",
    icon: CheckCircle2,
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    id: "sla",
    title: "Cảnh báo SLA",
    value: "12 vụ",
    change: "-35% sau 7 ngày",
    icon: AlertTriangle,
    accent: "from-amber-500 to-orange-500",
  },
];

const workflowKpis = [
  {
    step: "Tiếp nhận yêu cầu",
    owner: "Sales",
    avgDuration: "35 phút",
    successRate: 98,
    sla: "< 2 giờ",
  },
  {
    step: "Pickup",
    owner: "Đội hiện trường",
    avgDuration: "1h 12m",
    successRate: 94,
    sla: "Trong ngày",
  },
  {
    step: "Khai thác",
    owner: "Kho khai thác",
    avgDuration: "58 phút",
    successRate: 92,
    sla: "< 3 giờ",
  },
  {
    step: "Xử lý chứng từ",
    owner: "Điều hành",
    avgDuration: "42 phút",
    successRate: 95,
    sla: "< 6 giờ",
  },
  {
    step: "Thanh toán",
    owner: "Kế toán",
    avgDuration: "1,8 giờ",
    successRate: 88,
    sla: "Trong ngày",
  },
];

const revenueBySegment = [
  { segment: "Quốc tế", value: 58, change: "+6%" },
  { segment: "Nội địa", value: 31, change: "+11%" },
  { segment: "Thương mại điện tử", value: 8, change: "+4%" },
  { segment: "Khác", value: 3, change: "-2%" },
];

const commissionMatrix = [
  {
    role: "Pickup",
    detail: "5.000đ / đơn hoàn tất",
    month: "126 đơn",
    payout: "630.000đ",
  },
  {
    role: "Khai thác",
    detail: "10.000đ <20kg | 15.000đ ≥21kg",
    month: "284 kiện",
    payout: "3,18 triệu",
  },
  {
    role: "Sales",
    detail: "Doanh số theo thanh toán",
    month: "12,8 tỷ",
    payout: "3,8 triệu",
  },
  {
    role: "Chứng từ",
    detail: "5.000đ / bill quốc tế",
    month: "214 bill",
    payout: "1,07 triệu",
  },
  {
    role: "IT quản trị",
    detail: "3.000đ quốc tế | 1.500đ nội địa",
    month: "428 bill",
    payout: "1,07 triệu",
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.35), transparent 55%)" }} />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200 font-semibold">
              SSE Express
            </p>
            <h1 className="mt-2 text-3xl lg:text-4xl font-black">
              Báo cáo điều hành & năng suất
            </h1>
            <p className="mt-3 max-w-2xl text-white/80 font-medium">
              Theo dõi hiệu quả từng bước quy trình, doanh số theo Mã K/H và trạng thái hoa hồng để đáp ứng yêu cầu minh bạch, phân quyền và trách nhiệm trong vận hành.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Chip className="bg-white/15 text-white backdrop-blur font-semibold" size="lg" variant="flat">
              Chu kỳ: Tháng 10/2024
            </Chip>
            <Button className="bg-white text-slate-900 font-semibold rounded-full px-6" startContent={<BarChart3 className="h-4 w-4" />}>
              Xuất báo cáo PDF
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.id} className="border border-slate-200 shadow-sm">
              <CardBody className="space-y-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}> 
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="text-3xl font-black text-slate-900">{card.value}</p>
                <p className="text-sm font-medium text-slate-500">{card.change}</p>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="border border-slate-200 shadow-sm xl:col-span-3">
          <CardBody className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Theo dõi SLA quy trình
                </p>
                <h2 className="text-2xl font-black text-slate-900">
                  KPI từng bước theo Mã K/H
                </h2>
              </div>
              <Chip className="font-semibold" color="primary" variant="flat">
                SLA mục tiêu: 6 giờ
              </Chip>
            </div>
            <div className="space-y-4">
              {workflowKpis.map((item) => (
                <div key={item.step} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{item.step}</p>
                      <p className="text-sm font-medium text-slate-500">
                        Phụ trách: {item.owner} · SLA: {item.sla}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip className="font-semibold" color="secondary" variant="flat">
                        Thời gian TB: {item.avgDuration}
                      </Chip>
                      <Chip className="font-semibold" color="success" variant="flat">
                        Tỉ lệ hoàn thành {item.successRate}%
                      </Chip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card className="border border-slate-200 shadow-sm">
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                    Cơ cấu doanh thu
                  </p>
                  <h2 className="text-xl font-black text-slate-900">
                    Tỷ trọng theo phân khúc khách hàng
                  </h2>
                </div>
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="space-y-3">
                {revenueBySegment.map((item) => (
                  <div key={item.segment} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-slate-600">
                      {item.segment}
                    </div>
                    <div className="flex-1 rounded-full bg-slate-100">
                      <div
                        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 py-1 text-right text-xs font-semibold text-white pr-2"
                        style={{ width: `${item.value}%` }}
                      >
                        {item.value}%
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-slate-500">
                      {item.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    Cơ chế hoa hồng
                  </p>
                  <h2 className="text-xl font-black text-slate-900">
                    Tổng quan chi trả theo vai trò
                  </h2>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
              <div className="space-y-3">
                {commissionMatrix.map((item) => (
                  <div key={item.role} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{item.role}</p>
                        <p className="text-sm font-medium text-slate-500">{item.detail}</p>
                      </div>
                      <Chip className="font-semibold" color="secondary" variant="flat">
                        {item.month}
                      </Chip>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-emerald-600">
                      Chi trả tháng: {item.payout}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Giám sát phân quyền
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Cảnh báo quyền truy cập cần phê duyệt
              </h2>
            </div>
            <Tabs aria-label="Alert filters" color="primary" className="bg-slate-100/60 rounded-full p-1">
              <Tab key="all" title={<span className="px-2 text-sm font-semibold">Tất cả</span>} />
              <Tab key="pending" title={<span className="px-2 text-sm font-semibold">Đang chờ</span>} />
              <Tab key="resolved" title={<span className="px-2 text-sm font-semibold">Đã xử lý</span>} />
            </Tabs>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <Clock className="h-10 w-10 text-amber-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">05 yêu cầu cấp quản lý chờ duyệt</p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Hệ thống tự động khóa sau 24h nếu chưa được Hiển Nhân phê duyệt.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <Users className="h-10 w-10 text-blue-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">02 tài khoản cần xác minh email</p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Mỹ Vân và IT quản trị đã được thông báo tự động.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <ShieldCheck className="h-10 w-10 text-emerald-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">Không có sự cố bảo mật nghiêm trọng</p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Nhật ký truy cập được lưu trữ đầy đủ theo chuẩn bảo mật nội bộ.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
