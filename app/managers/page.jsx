"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { ShieldCheck, UserCog, BarChart3, KeyRound, AlertTriangle, Activity } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const managerRoster = [
  { role: "Admin / Chủ sở hữu", owner: "Hiền Nhân", responsibilities: ["Phê duyệt phân quyền cấp quản lý", "Xác nhận thay đổi dữ liệu quan trọng", "Giám sát toàn bộ hệ thống"], approvalsPending: 2 },
  { role: "Điều hành", owner: "Phạm Quốc Vinh", responsibilities: ["Điều phối workflow 6 bước", "Gán nhiệm vụ cho Pickup & Khai thác", "Kiểm soát chứng từ với đối tác"], approvalsPending: 1 },
  { role: "Kinh doanh", owner: "Lê Minh Châu", responsibilities: ["Tiếp nhận khách mới", "Tạo link báo giá", "Theo dõi thanh toán & công nợ"], approvalsPending: 0 },
  { role: "IT quản trị", owner: "Ngô Mỹ Vân", responsibilities: ["Vận hành hạ tầng phần mềm", "Quản lý tích hợp API đối tác", "Theo dõi nhật ký thao tác"], approvalsPending: 3 },
];

const approvalAlerts = [
  { id: "AP001", title: "Yêu cầu mở quyền Manager", requester: "Nguyễn Khánh Hòa", submittedAt: "31/10/2024 09:20", status: "pending" },
  { id: "AP002", title: "Cập nhật hạn mức đối soát", requester: "Hiền Nhân", submittedAt: "30/10/2024 21:15", status: "approved" },
  { id: "AP003", title: "Thêm đối tác vận chuyển UPS", requester: "Ngô Mỹ Vân", submittedAt: "29/10/2024 14:05", status: "pending" },
];

const statusConfig = { pending: { label: "Đang chờ", color: "warning" }, approved: { label: "Đã duyệt", color: "success" } };

export default function ManagersPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 space-y-6">
      <PageHeader
        icon={UserCog}
        title="Quản trị & phê duyệt"
        description="Theo dõi trách nhiệm, phê duyệt và bảo mật theo tiêu chuẩn SSE."
        action={{ content: "Nhật ký phân quyền" }}
      />

      <section className="grid gap-4 md:grid-cols-2">
        {managerRoster.map((manager) => (
          <Card key={manager.role} className="border border-slate-200 shadow-sm">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{manager.role}</p>
                  <p className="text-lg font-bold text-slate-900">{manager.owner}</p>
                </div>
                <Chip className="font-semibold" color={manager.approvalsPending > 0 ? "warning" : "success"} variant="flat">
                  Chờ duyệt: {manager.approvalsPending}
                </Chip>
              </div>
              <ul className="space-y-2 text-sm font-medium text-slate-600">
                {manager.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="mt-1 h-4 w-4 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Phê duyệt bảo mật</p>
              <h2 className="text-xl font-black text-slate-900">Tình trạng yêu cầu gần nhất</h2>
            </div>
            <Tabs aria-label="filter" color="primary" className="bg-slate-100/60 rounded-full p-1">
              <Tab key="all" title={<span className="px-2 text-sm font-semibold">Tất cả</span>} />
              <Tab key="pending" title={<span className="px-2 text-sm font-semibold">Đang chờ</span>} />
              <Tab key="approved" title={<span className="px-2 text-sm font-semibold">Đã duyệt</span>} />
            </Tabs>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {approvalAlerts.map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{alert.id}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{alert.title}</p>
                    <p className="mt-2 text-sm font-medium text-slate-500">Người yêu cầu: {alert.requester}</p>
                    <p className="text-xs font-semibold text-slate-400">{alert.submittedAt}</p>
                  </div>
                  <Chip className="font-semibold" color={statusConfig[alert.status].color} variant="flat">
                    {statusConfig[alert.status].label}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <CardBody className="space-y-3">
          <div className="flex items-center gap-3">
            <KeyRound className="h-8 w-8" />
            <h2 className="text-2xl font-black">Quy định quyền truy cập</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <BarChart3 className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">Báo cáo & giám sát</p>
              <p className="mt-1 text-sm font-medium text-white/80">Truy cập báo cáo tài chính được ghi nhận và cảnh báo email tới chủ sở hữu.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <Activity className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">SLO hệ thống</p>
              <p className="mt-1 text-sm font-medium text-white/80">IT quản trị chịu trách nhiệm uptime, đồng thời có hoa hồng bảo trì theo bill.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur">
              <AlertTriangle className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-lg font-bold text-white">Cảnh báo bảo mật</p>
              <p className="mt-1 text-sm font-medium text-white/80">Mọi yêu cầu xóa dữ liệu phải xác nhận OTP của chủ sở hữu trước khi thực thi.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

