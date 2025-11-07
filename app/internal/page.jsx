"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Users, ClipboardList, Wrench, Shield, Truck, Camera, Timer, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const squads = [
  { id: "OP-PICKUP", name: "Đội Pickup", leads: "Dương Minh Phú", members: 18, kpi: "Hoàn tất nhiệm vụ trong ngày", commission: "5.000đ/đơn", focus: "Nhận hàng, cập nhật hình ảnh", icon: Truck, color: "from-blue-500 to-indigo-500" },
  { id: "OP-WAREHOUSE", name: "Đội Khai thác", leads: "Trần Bích Hạnh", members: 12, kpi: "Đóng gói < 90 phút", commission: "10.000đ <20kg • 15.000đ ≥21kg", focus: "Đo kích thước, cân nặng, lưu kho", icon: Camera, color: "from-emerald-500 to-emerald-600" },
  { id: "OP-OPS", name: "Điều hành & chứng từ", leads: "Phạm Quốc Vinh", members: 9, kpi: "Liên kết bill trong 4 giờ", commission: "5.000đ/bộ chứng từ quốc tế", focus: "Gắn bill hãng, gửi thông báo", icon: ClipboardList, color: "from-purple-500 to-violet-600" },
  { id: "OP-IT", name: "IT quản trị", leads: "Ngô Mỹ Vân", members: 4, kpi: "99,9% uptime", commission: "3.000đ quốc tế • 1.500đ nội địa", focus: "Bảo trì hệ thống, phân quyền", icon: Shield, color: "from-amber-500 to-orange-500" },
];

const policyNotes = [
  { title: "Kiểm soát phân quyền", description: "Mọi thay đổi quyền quản lý phải được chủ sở hữu phê duyệt qua email và SMS. Log lưu 10 năm." },
  { title: "Nhật ký thao tác", description: "Mỗi bước quy trình gắn nhân viên thực hiện, thời gian bắt đầu và hoàn thành để truy vết." },
  { title: "Cảnh báo SLA", description: "Hệ thống gửi thông báo tới leader khi nhiệm vụ quá hạn theo từng bước workflow." },
];

export default function InternalStaffPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <PageHeader
        icon={Users}
        title="Nhân viên nội bộ"
        description="Tổ chức đội ngũ vận hành theo trách nhiệm và hoa hồng, đúng phân quyền."
        action={{ content: "Lịch trực & đào tạo tuần này" }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {squads.map((squad) => {
          const Icon = squad.icon;
          return (
            <Card key={squad.id} className="border border-slate-200 shadow-sm">
              <CardBody className="space-y-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${squad.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{squad.id}</p>
                <p className="text-lg font-bold text-slate-900">{squad.name}</p>
                <div className="rounded-2xl bg-slate-100/70 p-4 text-sm font-semibold text-slate-600 space-y-1">
                  <p>Leader: {squad.leads}</p>
                  <p>{squad.members} thành viên</p>
                  <p>KPI: {squad.kpi}</p>
                  <p>Hoa hồng: {squad.commission}</p>
                </div>
                <p className="text-sm font-medium text-slate-500">{squad.focus}</p>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Chuỗi trách nhiệm</p>
              <h2 className="text-xl font-black text-slate-900">Bàn giao nhiệm vụ theo workflow 6 bước SSE</h2>
            </div>
            <Chip className="font-semibold" color="primary" variant="flat">SLA tổng: 6 giờ</Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <Timer className="h-6 w-6 text-blue-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">Pickup → Khai thác</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Cập nhật hình ảnh và cân nặng trước bàn giao, cảnh báo nếu thiếu dữ liệu.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">Khai thác → Sales</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Không thay đổi trọng lượng, bắt buộc xác nhận song phương trước báo giá.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <Wrench className="h-6 w-6 text-purple-500" />
              <p className="mt-3 text-lg font-bold text-slate-900">Điều hành → IT quản trị</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Giám sát kết nối API với đối tác, cảnh báo khi không đồng bộ bill.</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <CardBody className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200 font-semibold">Chính sách & an toàn</p>
          <h2 className="text-2xl font-black">Quy định vận hành bắt buộc</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {policyNotes.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
                <p className="text-lg font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm font-medium text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

