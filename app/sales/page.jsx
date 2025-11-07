"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Users, Target, DollarSign, ClipboardCheck, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const salesTeams = [
  { id: "ST01", leader: "Lê Minh Châu", members: 6, kpi: "120 mã KH mới", status: "onTrack", conversion: 36, revenue: "4,2 tỷ" },
  { id: "ST02", leader: "Nguyễn Khánh Hòa", members: 5, kpi: "100 mã KH mới", status: "warning", conversion: 28, revenue: "3,1 tỷ" },
  { id: "ST03", leader: "Phạm Quỳnh Nhi", members: 4, kpi: "80 mã KH mới", status: "excellent", conversion: 42, revenue: "3,5 tỷ" },
];

const statusConfig = {
  onTrack: { label: "Đạt tiến độ", color: "success" },
  warning: { label: "Cần hỗ trợ", color: "warning" },
  excellent: { label: "Vượt chỉ tiêu", color: "primary" },
};

const pipelineStages = [
  { stage: "Khách hàng tiềm năng", count: 212, owner: "Sales" },
  { stage: "Đang demo & báo giá", count: 86, owner: "Sales" },
  { stage: "Đang xử lý hợp đồng", count: 34, owner: "Sales + Điều hành" },
  { stage: "Đang vận hành", count: 128, owner: "Sales + Pickup" },
];

const commissionRules = [
  { metric: "Thanh toán thành công", description: "Tính doanh số ngay khi đơn hàng được khách thanh toán", detail: "Tự động tổng hợp theo mã KH" },
  { metric: "Tái hoạt khách cũ", description: "Bonus 5% doanh số cho khách 3 tháng không phát sinh", detail: "Tối đa 20 triệu/tháng" },
  { metric: "Chỉ số chăm sóc", description: "CSAT > 4.5 được cộng thêm 2% hoa hồng", detail: "Đánh giá từ khách hàng cuối" },
];

export default function SalesPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <PageHeader
        icon={Users}
        title="Nhân sự kinh doanh"
        description="Theo dõi đội ngũ kinh doanh theo KPI và pipeline khách hàng."
        action={{ props: { startContent: <ArrowUpRight className="h-4 w-4" /> }, content: "Thêm thành viên Sales" }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        {salesTeams.map((team) => (
          <Card key={team.id} className="border border-slate-200 shadow-sm">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{team.id}</p>
                  <p className="text-lg font-bold text-slate-900">Team Lead: {team.leader}</p>
                </div>
                <Chip className="font-semibold" color={statusConfig[team.status].color} variant="flat">
                  {statusConfig[team.status].label}
                </Chip>
              </div>
              <div className="rounded-2xl bg-slate-100/70 p-4 text-sm font-semibold text-slate-600">
                <p>{team.members} thành viên</p>
                <p>KPI: {team.kpi}</p>
                <p>Chuyển đổi: {team.conversion}%</p>
                <p>Doanh thu: {team.revenue}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Pipeline khách hàng</p>
              <h2 className="text-xl font-black text-slate-900">Theo dõi hành trình từ tiếp nhận đến vận hành</h2>
            </div>
            <Tabs aria-label="pipeline filter" color="primary" className="bg-slate-100/60 rounded-full p-1">
              <Tab key="all" title={<span className="px-2 text-sm font-semibold">Tất cả</span>} />
              <Tab key="new" title={<span className="px-2 text-sm font-semibold">Khách mới</span>} />
              <Tab key="return" title={<span className="px-2 text-sm font-semibold">Tái hoạt</span>} />
            </Tabs>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {pipelineStages.map((stage) => (
              <div key={stage.stage} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{stage.stage}</p>
                    <p className="text-sm font-medium text-slate-500">Phụ trách: {stage.owner}</p>
                  </div>
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">{stage.count}</p>
                <p className="text-sm font-medium text-slate-500">Tự động đồng bộ từ CRM.</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Cơ chế hoa hồng</p>
              <h2 className="text-xl font-black text-slate-900">Đảm bảo doanh số và trách nhiệm minh bạch</h2>
            </div>
            <Chip className="font-semibold" color="success" variant="flat">Tự động cập nhật theo thanh toán</Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {commissionRules.map((rule) => (
              <div key={rule.metric} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-7 w-7 text-emerald-500" />
                  <p className="text-lg font-bold text-slate-900">{rule.metric}</p>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600">{rule.description}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{rule.detail}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/70 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">
                  Nhật ký bàn giao giữa Sales và Điều hành được lưu theo từng mã KH, đảm bảo truy vết khi phát sinh phản hồi.
                </p>
              </div>
              <Chip className="font-semibold" color="success" variant="flat">SLA bàn giao: 60 phút</Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

