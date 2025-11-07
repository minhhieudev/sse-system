"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Building2,
  ShieldCheck,
  ServerCog,
  Globe,
  Database,
  Wallet,
  Lock,
  KeyRound,
  AlertTriangle,
  Settings2,
  TrendingUp,
  CheckCircle2,
  Save,
  MapPin,
  Phone,
  Mail,
  DollarSign,
} from "lucide-react";

import { showSuccess } from "@/lib/toast";

const highlightCards = [
  {
    id: "branches",
    label: "Chi nhánh đang hoạt động",
    value: "12",
    description: "HCM, Hà Nội, Đà Nẵng, Cần Thơ...",
    icon: Building2,
    color: "blue",
  },
  {
    id: "security",
    label: "Bảo mật",
    value: "2FA + SSO",
    description: "Bắt buộc cho cấp quản lý",
    icon: ShieldCheck,
    color: "purple",
  },
  {
    id: "integrations",
    label: "Tích hợp ngoài",
    value: "9 API",
    description: "DHL, FedEx, UPS, TrackingMore...",
    icon: ServerCog,
    color: "green",
  },
  {
    id: "finance",
    label: "Chu kỳ đối soát",
    value: "Hằng ngày",
    description: "Auto reconcile COD & công nợ",
    icon: Wallet,
    color: "amber",
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

export default function SystemConfigurationPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Saigon Speed Express",
    brandName: "SSE Express",
    hotline: "(028) 1234 5678",
    supportEmail: "support@sse.vn",
    timezone: "Asia/Ho_Chi_Minh",
    defaultLanguage: "vi",
    landingPage: true,
    autoAssignBranch: true,
  });

  const [financeSettings, setFinanceSettings] = useState({
    baseCurrency: "VND",
    secondaryCurrency: "USD",
    vatRate: "8",
    fuelSurcharge: "12",
    codFee: "1.2",
    domesticMargin: "18",
    internationalMargin: "22",
    autoLockInvoices: true,
    autoReconcileCod: true,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    trackingMore: true,
    dhl: true,
    ups: true,
    fedex: false,
    zalo: true,
    email: true,
    aws: true,
    webhookEndpoint: "https://api.sse.vn/webhooks",
    ipWhitelist: "118.69.123.0/24, 203.113.0.0/24",
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforce2FA: true,
    ipRestriction: true,
    sessionTimeout: "30",
    approvalWorkflow: true,
    logRetention: "365",
    notifyOwner: true,
  });

  const languageOptions = useMemo(
    () => [
      { value: "vi", label: "Tiếng Việt" },
      { value: "en", label: "English" },
      { value: "zh", label: "中文" },
    ],
    [],
  );

  const timezoneOptions = useMemo(
    () => [
      { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh (GMT+7)" },
      { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
      { value: "America/Los_Angeles", label: "America/Los Angeles (GMT-8)" },
    ],
    [],
  );

  const currencyOptions = [
    { value: "VND", label: "VND - Vietnamese Dong" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "JPY", label: "JPY - Japanese Yen" },
  ];

  const handleGeneralChange = (field, value) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinanceChange = (field, value) => {
    setFinanceSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleIntegrationChange = (field, value) => {
    setIntegrationSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showSuccess("Đã lưu cấu hình hệ thống demo thành công");
  };

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
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Cấu hình hệ thống
          </h1>
          <p className="text-base font-medium text-slate-600 max-w-3xl">
            Quản lý thông tin công ty, chính sách tài chính, tích hợp API và bảo
            mật. Mọi thay đổi quan trọng yêu cầu phê duyệt từ Chủ sở hữu (Hiền
            Nhân).
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {highlightCards.map((card, idx) => {
            const Icon = card.icon;
            const config = colorConfig[card.color];

            return (
              <Card
                key={card.id}
                className={`group relative overflow-hidden border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent}`}
                />
                <CardBody className="flex h-full flex-col gap-3 p-6 relative">
                  <div className="flex items-start justify-between">
                    <div
                      className={`relative rounded-2xl p-4 bg-gradient-to-br ${config.iconBg} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">Live</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      {card.label}
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                      {card.value}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardBody className="space-y-6 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-bold text-slate-900">
                  Bảng điều khiển cấu hình
                </p>
                <p className="text-sm font-medium text-slate-600">
                  Chỉnh sửa theo module, mọi thao tác đều được ghi log và gửi
                  thông báo tới admin.
                </p>
              </div>
              <Button
                className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                endContent={<Save className="h-4 w-4" />}
                startContent={<Settings2 className="h-4 w-4" />}
                onPress={handleSave}
              >
                Lưu cấu hình demo
              </Button>
            </div>

            {/* Beautiful Filter Bar - Full Extended Width */}
            <div className="relative mb-8 -mx-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-xl border-2 border-slate-200/60 rounded-3xl p-10 shadow-2xl mx-12">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                  {/* Filter Title */}
                  <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                      <Settings2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">
                        Bộ lọc cấu hình
                      </h3>
                      <p className="text-base text-slate-600">
                        Chọn module để chỉnh sửa cấu hình hệ thống
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-700 font-semibold">
                          Hoạt động
                        </p>
                        <p className="text-lg font-bold text-emerald-900">
                          4/4 Modules
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <ServerCog className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-semibold">
                          API tích hợp
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          9 Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Filter Buttons */}
                <div className="mt-8 pt-8 border-t border-slate-200/50">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-base font-semibold text-slate-700 mr-4">
                      Chọn module:
                    </span>

                    {[
                      {
                        key: "general",
                        label: "Thông tin hệ thống",
                        icon: Building2,
                        color: "from-blue-500 to-indigo-600",
                        bgColor: "from-blue-50 to-indigo-50",
                        borderColor: "border-blue-200",
                        active: true,
                      },
                      {
                        key: "finance",
                        label: "Tài chính & Thuế",
                        icon: Wallet,
                        color: "from-green-500 to-emerald-600",
                        bgColor: "from-green-50 to-emerald-50",
                        borderColor: "border-green-200",
                        active: true,
                      },
                      {
                        key: "integrations",
                        label: "Tích hợp & API",
                        icon: ServerCog,
                        color: "from-purple-500 to-pink-600",
                        bgColor: "from-purple-50 to-pink-50",
                        borderColor: "border-purple-200",
                        active: true,
                      },
                      {
                        key: "security",
                        label: "Bảo mật & phê duyệt",
                        icon: ShieldCheck,
                        color: "from-amber-500 to-orange-600",
                        bgColor: "from-amber-50 to-orange-50",
                        borderColor: "border-amber-200",
                        active: true,
                      },
                    ].map((module) => {
                      const Icon = module.icon;

                      return (
                        <button
                          key={module.key}
                          className={`group relative overflow-hidden flex items-center gap-4 px-8 py-4 rounded-2xl border-2 ${module.borderColor} bg-gradient-to-r ${module.bgColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                            module.active
                              ? "shadow-md ring-2 ring-blue-500/20"
                              : "opacity-60"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${module.color} text-white shadow-sm`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-slate-900 text-base">
                            {module.label}
                          </span>
                          {module.active && (
                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Tabs
              aria-label="Cấu hình hệ thống"
              classNames={{
                tabList:
                  "gap-12 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border-2 border-slate-200/50 shadow-sm -mx-16 px-20 w-screen max-w-none",
                tab: "font-bold text-slate-700 hover:text-blue-600 transition-colors duration-200 px-8 py-4 rounded-xl text-base",
                cursor:
                  "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg",
                panel: "mt-8",
              }}
              color="primary"
              variant="underlined"
            >
              <Tab key="general" title="Thông tin hệ thống">
                <div className="pt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="companyName"
                      >
                        <Building2 className="h-4 w-4 text-blue-600" />
                        Tên công ty
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="companyName"
                        placeholder={
                          generalSettings.companyName
                            ? ""
                            : "Nhập tên công ty đầy đủ"
                        }
                        value={generalSettings.companyName}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleGeneralChange("companyName", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="brandName"
                      >
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        Tên thương hiệu
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="brandName"
                        placeholder={
                          generalSettings.brandName
                            ? ""
                            : "Nhập tên thương hiệu ngắn gọn"
                        }
                        value={generalSettings.brandName}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleGeneralChange("brandName", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="hotline"
                      >
                        <Phone className="h-4 w-4 text-green-600" />
                        Hotline
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-green-400 focus:border-green-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="hotline"
                        placeholder={
                          generalSettings.hotline ? "" : "(028) 1234 5678"
                        }
                        value={generalSettings.hotline}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleGeneralChange("hotline", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="supportEmail"
                      >
                        <Mail className="h-4 w-4 text-amber-600" />
                        Email hỗ trợ
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-amber-400 focus:border-amber-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="supportEmail"
                        placeholder={
                          generalSettings.supportEmail
                            ? ""
                            : "support@company.com"
                        }
                        type="email"
                        value={generalSettings.supportEmail}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleGeneralChange("supportEmail", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="defaultLanguage"
                      >
                        <Globe className="h-4 w-4 text-indigo-600" />
                        Ngôn ngữ mặc định
                      </label>
                      <Select
                        classNames={{
                          trigger:
                            "border-2 border-slate-200 hover:border-indigo-400 focus:border-indigo-500 rounded-xl bg-white shadow-sm transition-all duration-200 h-12",
                          value: "text-slate-900 font-medium",
                          selectorIcon: "right-3",
                          popoverContent:
                            "bg-white border-2 border-slate-200 rounded-xl shadow-xl",
                          listbox: "p-4",
                        }}
                        id="defaultLanguage"
                        placeholder="Chọn ngôn ngữ"
                        selectedKeys={[generalSettings.defaultLanguage]}
                        onChange={(event) =>
                          handleGeneralChange(
                            "defaultLanguage",
                            event.target.value,
                          )
                        }
                      >
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="timezone"
                      >
                        <MapPin className="h-4 w-4 text-pink-600" />
                        Múi giờ hệ thống
                      </label>
                      <Select
                        classNames={{
                          trigger:
                            "border-2 border-slate-200 hover:border-pink-400 focus:border-pink-500 rounded-xl bg-white shadow-sm transition-all duration-200 h-12",
                          value: "text-slate-900 font-medium",
                          selectorIcon: "right-3",
                          popoverContent:
                            "bg-white border-2 border-slate-200 rounded-xl shadow-xl",
                          listbox: "p-4",
                        }}
                        id="timezone"
                        placeholder="Chọn múi giờ"
                        selectedKeys={[generalSettings.timezone]}
                        onChange={(event) =>
                          handleGeneralChange("timezone", event.target.value)
                        }
                      >
                        {timezoneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-600" />
                            Landing page tracking thương hiệu
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Hiển thị song ngữ, logo SSE, đồng bộ trạng thái
                            real-time cho khách hàng.
                          </p>
                        </div>
                        <Switch
                          isSelected={generalSettings.landingPage}
                          onValueChange={(value) =>
                            handleGeneralChange("landingPage", value)
                          }
                        />
                      </div>
                    </div>
                    <div className="rounded-2xl border-2 border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-purple-600" />
                            Tự động phân chi nhánh/đại lý
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Căn cứ địa chỉ pickup, hệ thống gán về chi nhánh gần
                            nhất.
                          </p>
                        </div>
                        <Switch
                          isSelected={generalSettings.autoAssignBranch}
                          onValueChange={(value) =>
                            handleGeneralChange("autoAssignBranch", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="finance" title="Tài chính & Thuế">
                <div className="pt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="baseCurrency"
                      >
                        <Wallet className="h-4 w-4 text-green-600" />
                        Tiền tệ chính
                      </label>
                      <Select
                        classNames={{
                          trigger:
                            "border-2 border-slate-200 hover:border-green-400 focus:border-green-500 rounded-xl bg-white shadow-sm transition-all duration-200 h-12",
                          value: "text-slate-900 font-medium",
                          selectorIcon: "right-3",
                          popoverContent:
                            "bg-white border-2 border-slate-200 rounded-xl shadow-xl",
                          listbox: "p-4",
                        }}
                        id="baseCurrency"
                        placeholder="Chọn tiền tệ chính"
                        selectedKeys={[financeSettings.baseCurrency]}
                        onChange={(event) =>
                          handleFinanceChange(
                            "baseCurrency",
                            event.target.value,
                          )
                        }
                      >
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="secondaryCurrency"
                      >
                        <Wallet className="h-4 w-4 text-blue-600" />
                        Tiền tệ thứ cấp
                      </label>
                      <Select
                        classNames={{
                          trigger:
                            "border-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-xl bg-white shadow-sm transition-all duration-200 h-12",
                          value: "text-slate-900 font-medium",
                          selectorIcon: "right-3",
                          popoverContent:
                            "bg-white border-2 border-slate-200 rounded-xl shadow-xl",
                          listbox: "p-4",
                        }}
                        id="secondaryCurrency"
                        placeholder="Chọn tiền tệ thứ cấp"
                        selectedKeys={[financeSettings.secondaryCurrency]}
                        onChange={(event) =>
                          handleFinanceChange(
                            "secondaryCurrency",
                            event.target.value,
                          )
                        }
                      >
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="vatRate"
                      >
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        VAT (%)
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="vatRate"
                        placeholder="8"
                        type="number"
                        value={financeSettings.vatRate}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleFinanceChange("vatRate", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="fuelSurcharge"
                      >
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                        Phụ phí nhiên liệu (%)
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-amber-400 focus:border-amber-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="fuelSurcharge"
                        placeholder="12"
                        type="number"
                        value={financeSettings.fuelSurcharge}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleFinanceChange("fuelSurcharge", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="codFee"
                      >
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Phí COD (‰)
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-green-400 focus:border-green-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="codFee"
                        placeholder="1.2"
                        type="number"
                        value={financeSettings.codFee}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleFinanceChange("codFee", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="domesticMargin"
                      >
                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                        Biên lợi nhuận nội địa (%)
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-indigo-400 focus:border-indigo-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="domesticMargin"
                        placeholder="18"
                        type="number"
                        value={financeSettings.domesticMargin}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleFinanceChange("domesticMargin", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="internationalMargin"
                      >
                        <TrendingUp className="h-4 w-4 text-pink-600" />
                        Biên lợi nhuận quốc tế (%)
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-pink-400 focus:border-pink-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="internationalMargin"
                        placeholder="22"
                        type="number"
                        value={financeSettings.internationalMargin}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleFinanceChange("internationalMargin", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1">
                            Khóa hóa đơn sau đối soát
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Tự động khóa và ký số sau khi công nợ đã thanh toán
                            đầy đủ.
                          </p>
                        </div>
                        <Switch
                          isSelected={financeSettings.autoLockInvoices}
                          onValueChange={(value) =>
                            handleFinanceChange("autoLockInvoices", value)
                          }
                        />
                      </div>
                    </div>
                    <div className="rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1">
                            Đối soát COD tự động
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Ghép giao dịch với đối tác ngân hàng và đẩy cảnh báo
                            nếu lệch.
                          </p>
                        </div>
                        <Switch
                          isSelected={financeSettings.autoReconcileCod}
                          onValueChange={(value) =>
                            handleFinanceChange("autoReconcileCod", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="integrations" title="Tích hợp & API">
                <div className="pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      {
                        field: "trackingMore",
                        label: "TrackingMore API",
                        color: "blue",
                      },
                      { field: "dhl", label: "DHL Express", color: "amber" },
                      { field: "ups", label: "UPS API", color: "purple" },
                      { field: "fedex", label: "FedEx", color: "green" },
                      { field: "zalo", label: "Zalo OA", color: "blue" },
                      {
                        field: "email",
                        label: "Email SMTP SendGrid",
                        color: "purple",
                      },
                      {
                        field: "aws",
                        label: "AWS S3 - Lưu chứng từ",
                        color: "amber",
                      },
                    ].map((integration) => (
                      <div
                        key={integration.field}
                        className="group relative overflow-hidden flex items-center justify-between rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colorConfig[integration.color]?.accent || "from-blue-400 to-indigo-500"}`}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1">
                            {integration.label}
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Đồng bộ trạng thái, xuất chứng từ, gửi thông báo
                            realtime.
                          </p>
                        </div>
                        <Switch
                          isSelected={integrationSettings[integration.field]}
                          onValueChange={(value) =>
                            handleIntegrationChange(integration.field, value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="webhookEndpoint"
                      >
                        <ServerCog className="h-4 w-4 text-blue-600" />
                        Webhook endpoint
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="webhookEndpoint"
                        placeholder={
                          integrationSettings.webhookEndpoint
                            ? ""
                            : "https://api.example.com/webhooks"
                        }
                        value={integrationSettings.webhookEndpoint}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleIntegrationChange("webhookEndpoint", value)
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                        htmlFor="ipWhitelist"
                      >
                        <ShieldCheck className="h-4 w-4 text-purple-600" />
                        IP whitelist
                      </label>
                      <Input
                        classNames={{
                          inputWrapper:
                            "border-2 border-slate-200 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white shadow-sm transition-all duration-200",
                          input: "text-slate-900 font-medium",
                        }}
                        id="ipWhitelist"
                        placeholder={
                          integrationSettings.ipWhitelist
                            ? ""
                            : "192.168.1.0/24, 10.0.0.0/8"
                        }
                        value={integrationSettings.ipWhitelist}
                        variant="bordered"
                        onValueChange={(value) =>
                          handleIntegrationChange("ipWhitelist", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="security" title="Bảo mật & phê duyệt">
                <div className="pt-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Lock className="h-5 w-5 text-blue-600" />
                            Bật xác thực 2 lớp
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Bắt buộc cho Admin, Điều hành, Chủ sở hữu.
                          </p>
                        </div>
                        <Switch
                          isSelected={securitySettings.enforce2FA}
                          onValueChange={(value) =>
                            handleSecurityChange("enforce2FA", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Globe className="h-5 w-5 text-purple-600" />
                            Giới hạn IP đăng nhập
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Chỉ cho phép IP whitelist truy cập hệ thống quản
                            trị.
                          </p>
                        </div>
                        <Switch
                          isSelected={securitySettings.ipRestriction}
                          onValueChange={(value) =>
                            handleSecurityChange("ipRestriction", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <KeyRound className="h-5 w-5 text-emerald-600" />
                            Thời gian session (phút)
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Tự động đăng xuất sau thời gian không hoạt động.
                          </p>
                        </div>
                        <Input
                          className="max-w-[100px]"
                          classNames={{
                            inputWrapper: "border-2 rounded-xl",
                          }}
                          labelPlacement="inside"
                          size="sm"
                          value={securitySettings.sessionTimeout}
                          onValueChange={(value) =>
                            handleSecurityChange("sessionTimeout", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Database className="h-5 w-5 text-amber-600" />
                            Lưu log thao tác (ngày)
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            Lưu toàn bộ log trên AWS S3, backup mỗi ngày.
                          </p>
                        </div>
                        <Input
                          className="max-w-[100px]"
                          classNames={{
                            inputWrapper: "border-2 rounded-xl",
                          }}
                          labelPlacement="inside"
                          size="sm"
                          value={securitySettings.logRetention}
                          onValueChange={(value) =>
                            handleSecurityChange("logRetention", value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg">
                      <p className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-3">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                        Luồng phê duyệt dữ liệu nhạy cảm
                      </p>
                      <ul className="mt-4 space-y-3 text-sm font-medium text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>
                            Xóa khách hàng, đơn hàng: yêu cầu Hiền Nhân phê
                            duyệt
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>
                            Thêm user cấp quản lý: gửi OTP tới email + SMS chủ
                            sở hữu
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>
                            Thay đổi cấu hình hệ thống: tạo ticket cho IT và
                            Admin
                          </span>
                        </li>
                      </ul>
                      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-md border-2 border-blue-200/50">
                        <span className="text-sm font-bold text-slate-900">
                          Bắt buộc phê duyệt
                        </span>
                        <Switch
                          isSelected={securitySettings.approvalWorkflow}
                          onValueChange={(value) =>
                            handleSecurityChange("approvalWorkflow", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg">
                      <p className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                        Cảnh báo tới Chủ sở hữu
                      </p>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Tự động gửi Email + SMS cho Hiền Nhân khi phát sinh thay
                        đổi quan trọng:
                      </p>
                      <ul className="mt-4 space-y-2 text-sm font-medium text-slate-700">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Thay đổi cấu hình tài chính</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Thêm/xóa user cấp cao</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Xóa dữ liệu nhạy cảm</span>
                        </li>
                      </ul>
                      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-md border-2 border-amber-200/50">
                        <span className="text-sm font-bold text-slate-900">
                          Gửi cảnh báo ngay
                        </span>
                        <Switch
                          isSelected={securitySettings.notifyOwner}
                          onValueChange={(value) =>
                            handleSecurityChange("notifyOwner", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
