"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import {
  Bell,
  Mail,
  MessageCircle,
  Phone,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Filter,
  Sparkles,
  Calendar,
  History,
  Settings,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const channelConfigs = [
  {
    id: "email",
    label: "Email",
    description: "Báo giá, hóa đơn, báo cáo đối soát",
    icon: Mail,
    accent: "from-blue-500 to-indigo-500",
  },
  {
    id: "sms",
    label: "SMS",
    description: "Thông báo pickup, giao hàng",
    icon: Phone,
    accent: "from-amber-500 to-orange-500",
  },
  {
    id: "zalo",
    label: "Zalo OA",
    description: "Nhắc thanh toán, thay đổi trạng thái",
    icon: MessageCircle,
    accent: "from-sky-500 to-cyan-500",
  },
  {
    id: "inapp",
    label: "In-app",
    description: "Thông báo nội bộ cho nhân viên",
    icon: Bell,
    accent: "from-fuchsia-500 to-purple-500",
  },
];

const statusConfigs = {
  sent: { label: "Đã gửi", color: "success" },
  scheduled: { label: "Đang chờ", color: "warning" },
  failed: { label: "Lỗi", color: "danger" },
};

const categoryTabs = [
  { id: "all", label: "Tất cả" },
  { id: "orders", label: "Đơn hàng" },
  { id: "finance", label: "Tài chính" },
  { id: "customers", label: "Khách hàng" },
  { id: "operations", label: "Vận hành" },
];

const mockStatistics = [
  {
    id: "total",
    label: "Thông báo đã gửi",
    value: "1,248",
    change: "+12%",
    icon: Send,
    description: "Trong 30 ngày gần nhất",
    color: "blue",
  },
  {
    id: "automation",
    label: "Kịch bản tự động",
    value: "24",
    change: "4 mới",
    icon: Sparkles,
    description: "Đang kích hoạt",
    color: "purple",
  },
  {
    id: "delivery",
    label: "Tỉ lệ gửi thành công",
    value: "98.6%",
    change: "+1.2%",
    icon: CheckCircle2,
    description: "So với tháng trước",
    color: "green",
  },
  {
    id: "sla",
    label: "Cảnh báo SLA",
    value: "8",
    change: "-35%",
    icon: AlertTriangle,
    description: "Được xử lý trong ngày",
    color: "amber",
  },
];

const mockNotifications = [
  {
    id: "NT001",
    title: "Đơn hàng AWB123456 đã giao thành công",
    message: "Gửi email xác nhận cho khách hàng và NV Kinh doanh",
    category: "orders",
    channel: "email",
    status: "sent",
    sentAt: "31/10/2024 09:30",
    trigger: "Delivered",
    recipients: 54,
    engagement: 96,
  },
  {
    id: "NT002",
    title: "Nhắc thanh toán đơn REF-2024-002",
    message: "SMS nhắc khách hàng thanh toán trước 17h hôm nay",
    category: "finance",
    channel: "sms",
    status: "scheduled",
    sentAt: "31/10/2024 16:00",
    trigger: "Overdue",
    recipients: 12,
    engagement: 74,
  },
  {
    id: "NT003",
    title: "Cảnh báo đơn hàng pending quá 24h",
    message: "Thông báo nội bộ cho đội vận hành xử lý",
    category: "operations",
    channel: "inapp",
    status: "sent",
    sentAt: "31/10/2024 08:45",
    trigger: "Pending > 24h",
    recipients: 8,
    engagement: 88,
  },
  {
    id: "NT004",
    title: "Tự động cập nhật tracking DHL",
    message: "Zalo OA gửi tình trạng mới cho khách hàng",
    category: "orders",
    channel: "zalo",
    status: "sent",
    sentAt: "30/10/2024 21:15",
    trigger: "Status change",
    recipients: 112,
    engagement: 91,
  },
  {
    id: "NT005",
    title: "Hóa đơn tháng 10/2024",
    message: "Email kèm hóa đơn PDF cho khách hàng doanh nghiệp",
    category: "finance",
    channel: "email",
    status: "failed",
    sentAt: "30/10/2024 19:00",
    trigger: "Monthly billing",
    recipients: 18,
    engagement: 0,
  },
  {
    id: "NT006",
    title: "Chiến dịch chăm sóc khách hàng VIP",
    message: "Zalo OA gửi voucher ưu đãi cho nhóm VIP",
    category: "customers",
    channel: "zalo",
    status: "scheduled",
    sentAt: "02/11/2024 10:00",
    trigger: "Marketing",
    recipients: 35,
    engagement: 0,
  },
];

const automationRules = [
  {
    id: "AUTO001",
    name: "Nhắc thanh toán tự động",
    description: "Gửi SMS + Email khi đơn hàng quá hạn 2 ngày",
    channels: ["sms", "email"],
    schedule: "Mỗi 09:00 hàng ngày",
    owner: "Kế toán",
    status: "active",
  },
  {
    id: "AUTO002",
    name: "Tracking quốc tế",
    description: "Tự động đồng bộ trạng thái từ DHL/FedEx mỗi 30 phút",
    channels: ["zalo", "email"],
    schedule: "Cron: */30 * * * *",
    owner: "Điều hành",
    status: "active",
  },
  {
    id: "AUTO003",
    name: "Cảnh báo SLA kho",
    description: "Thông báo nội bộ khi hàng lưu kho > 12h",
    channels: ["inapp"],
    schedule: "Realtime",
    owner: "Kho vận",
    status: "draft",
  },
];

const activityTimeline = [
  {
    time: "31/10/2024 10:15",
    action: "Bật cảnh báo SLA kho",
    actor: "Hiền Nhân",
    details: "Áp dụng cho tất cả chi nhánh",
    icon: Settings,
  },
  {
    time: "31/10/2024 09:45",
    action: "Gửi 58 email xác nhận giao hàng",
    actor: "Hệ thống tự động",
    details: "Chiến dịch: Delivered update",
    icon: Send,
  },
  {
    time: "30/10/2024 21:30",
    action: "Tự động đồng bộ tracking DHL",
    actor: "API TrackingMore",
    details: "112 bản ghi cập nhật",
    icon: History,
  },
  {
    time: "30/10/2024 18:05",
    action: "Phê duyệt chiến dịch chăm sóc khách hàng VIP",
    actor: "Mỹ Vân",
    details: "Kênh Zalo OA + Email",
    icon: Sparkles,
  },
];

const colorConfig = {
  blue: {
    gradient: "from-blue-500/10 via-indigo-500/10 to-cyan-500/10",
    border: "border-blue-200/50",
    iconBg: "from-blue-500 to-indigo-600",
    accent: "from-blue-400 to-indigo-500",
  },
  purple: {
    gradient: "from-purple-500/10 via-fuchsia-500/10 to-pink-500/10",
    border: "border-purple-200/50",
    iconBg: "from-purple-500 to-fuchsia-600",
    accent: "from-purple-400 to-fuchsia-500",
  },
  green: {
    gradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
    border: "border-emerald-200/50",
    iconBg: "from-emerald-500 to-green-600",
    accent: "from-emerald-400 to-green-500",
  },
  amber: {
    gradient: "from-amber-500/10 via-orange-500/10 to-yellow-500/10",
    border: "border-amber-200/50",
    iconBg: "from-amber-500 to-orange-600",
    accent: "from-amber-400 to-orange-500",
  },
};

export default function NotificationCenterPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [channelState, setChannelState] = useState(() =>
    channelConfigs.reduce(
      (acc, channel) => ({
        ...acc,
        [channel.id]: true,
      }),
      {},
    ),
  );

  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter((notification) => {
      if (!channelState[notification.channel]) {
        return false;
      }

      if (selectedTab !== "all" && notification.category !== selectedTab) {
        return false;
      }

      return true;
    });
  }, [selectedTab, channelState]);

  return (
    <div className="px-6 pb-12 pt-6 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 min-h-screen relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Communication Hub
            </span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-base font-medium text-slate-600 max-w-3xl">
            Quản lý toàn bộ thông báo Email, SMS, Zalo OA và in-app cho khách
            hàng & nội bộ. Giám sát kịch bản tự động, tỷ lệ gửi thành công và
            cảnh báo SLA.
          </p>
        </div>

        {/* Headline stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {mockStatistics.map((stat, idx) => {
            const Icon = stat.icon;
            const config = colorConfig[stat.color];

            return (
              <Card
                key={stat.id}
                className={`group relative overflow-hidden border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent}`}
                />
                <CardBody className="flex h-full flex-col justify-between gap-4 p-6 relative">
                  <div className="flex items-start justify-between">
                    <div
                      className={`relative rounded-2xl p-4 bg-gradient-to-br ${config.iconBg} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 shadow-sm">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {stat.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Channel toggles */}
        <Card className="mt-6 border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardBody className="space-y-5 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-bold text-slate-900">
                  Kênh thông báo đang kích hoạt
                </p>
                <p className="text-sm font-medium text-slate-600">
                  Bật/tắt nhanh từng kênh và theo dõi tỷ lệ gửi thành công
                  real-time.
                </p>
              </div>
              <Button
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                startContent={<Filter className="h-4 w-4" />}
                variant="flat"
              >
                Thiết lập ưu tiên
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {channelConfigs.map((channel, idx) => {
                const Icon = channel.icon;

                return (
                  <div
                    key={channel.id}
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${channel.accent}`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${channel.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    <div className="relative flex flex-col gap-4 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${channel.accent} text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 mb-0.5">
                              {channel.label}
                            </p>
                            <p className="text-xs font-medium text-slate-600">
                              {channel.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          isSelected={channelState[channel.id]}
                          size="lg"
                          onValueChange={(isSelected) =>
                            setChannelState((prev) => ({
                              ...prev,
                              [channel.id]: isSelected,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 p-3 shadow-inner">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Tỉ lệ thành công</span>
                          <span className="text-sm">
                            {channel.id === "email"
                              ? "99.2%"
                              : channel.id === "sms"
                                ? "97.4%"
                                : channel.id === "zalo"
                                  ? "96.8%"
                                  : "100%"}
                          </span>
                        </div>
                        <Progress
                          classNames={{
                            track: "bg-slate-200",
                            indicator: `bg-gradient-to-r ${channel.accent}`,
                          }}
                          size="sm"
                          value={
                            channel.id === "email"
                              ? 99.2
                              : channel.id === "sms"
                                ? 97.4
                                : channel.id === "zalo"
                                  ? 96.8
                                  : 100
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardBody className="space-y-5 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      Luồng thông báo theo danh mục
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      Theo dõi các thông báo tự động cho quy trình đơn hàng,
                      công nợ và chăm sóc khách hàng.
                    </p>
                  </div>
                  <Button
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    endContent={<ArrowRight className="h-4 w-4" />}
                    startContent={<Zap className="h-4 w-4" />}
                  >
                    Tạo kịch bản mới
                  </Button>
                </div>

                <Tabs
                  aria-label="Danh mục thông báo"
                  classNames={{
                    tabList: "gap-6",
                    tab: "font-bold",
                    cursor: "bg-gradient-to-r from-blue-600 to-purple-600",
                  }}
                  color="primary"
                  selectedKey={selectedTab}
                  variant="underlined"
                  onSelectionChange={(key) => setSelectedTab(String(key))}
                >
                  {categoryTabs.map((tab) => (
                    <Tab key={tab.id} title={tab.label}>
                      <div className="space-y-4 pt-4">
                        {filteredNotifications.length === 0 && (
                          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <Bell className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="font-bold text-slate-700 text-lg">
                              Chưa có thông báo phù hợp với bộ lọc hiện tại
                            </p>
                          </div>
                        )}

                        {filteredNotifications.map((item, idx) => {
                          const channelConfig = channelConfigs.find(
                            (c) => c.id === item.channel,
                          );
                          const channelColor =
                            channelConfig?.accent ||
                            "from-slate-500 to-gray-500";

                          return (
                            <div
                              key={item.id}
                              className="group flex flex-col gap-4 rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:flex-row lg:items-center lg:justify-between relative overflow-hidden"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div
                                className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${channelColor}`}
                              />

                              <div className="flex flex-1 flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <div
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${channelColor} text-white font-bold text-xs shadow-sm`}
                                  >
                                    {channelConfig && (
                                      <channelConfig.icon className="h-3 w-3" />
                                    )}
                                    <span>{item.channel.toUpperCase()}</span>
                                  </div>
                                  <Chip
                                    className="font-bold shadow-sm"
                                    color={
                                      statusConfigs[item.status]?.color ??
                                      "default"
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    {statusConfigs[item.status]?.label ??
                                      "Khác"}
                                  </Chip>
                                  <Chip
                                    className="font-semibold bg-slate-100 text-slate-700"
                                    size="sm"
                                    variant="flat"
                                  >
                                    Trigger: {item.trigger}
                                  </Chip>
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-sm font-medium text-slate-600">
                                    {item.message}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                                      <Clock className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium text-blue-800">
                                      {item.sentAt}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-100">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                                      <Calendar className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium text-green-800">
                                      {item.recipients} người nhận
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                                      <Sparkles className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium text-purple-800">
                                      Hiệu quả {item.engagement}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full lg:max-w-[220px]">
                                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200/50 p-5 shadow-inner">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                                    Đánh giá hiệu suất
                                  </p>
                                  <Progress
                                    aria-label="Hiệu suất"
                                    className="mb-3"
                                    classNames={{
                                      indicator:
                                        item.engagement > 90
                                          ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                          : item.engagement > 75
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                                            : "bg-gradient-to-r from-amber-500 to-orange-500",
                                    }}
                                    value={item.engagement}
                                  />
                                  <p className="text-sm font-bold text-slate-900">
                                    {item.engagement}% phản hồi tích cực
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Tab>
                  ))}
                </Tabs>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardBody className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Kịch bản tự động
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      Lịch chạy, kênh sử dụng và người phụ trách
                    </p>
                  </div>
                  <Button
                    className="rounded-xl font-bold"
                    size="sm"
                    variant="flat"
                  >
                    Quản lý
                  </Button>
                </div>

                <div className="space-y-3">
                  {automationRules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="group relative overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-x-1"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${rule.status === "active" ? "bg-gradient-to-b from-emerald-500 to-green-500" : "bg-gradient-to-b from-amber-500 to-orange-500"}`}
                      />

                      <p className="font-bold text-slate-900 mb-1">
                        {rule.name}
                      </p>
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        {rule.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {rule.channels.map((channel) => (
                          <Chip
                            key={channel}
                            className="font-bold"
                            size="sm"
                            variant="flat"
                          >
                            {channel.toUpperCase()}
                          </Chip>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          Phụ trách: {rule.owner}
                        </span>
                        <Chip
                          className="font-bold"
                          color={
                            rule.status === "active" ? "success" : "warning"
                          }
                          size="sm"
                          variant="flat"
                        >
                          {rule.schedule}
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardBody className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <History className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    Hoạt động gần đây
                  </p>
                </div>

                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => {
                    const Icon = activity.icon;

                    return (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-0.5">
                            {activity.action}
                          </p>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            {activity.details}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                            <span>{activity.time}</span>
                            <span>•</span>
                            <span>{activity.actor}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
