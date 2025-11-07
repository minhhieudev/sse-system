"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import {
  Search,
  Filter,
  Plane,
  Truck,
  Building,
  Globe,
  Phone,
  MapPin,
  Link,
  ArrowUpRight,
  Users,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Award,
  Star,
} from "lucide-react";

import FilterModal from "@/components/common/FilterModal";
import { withHighZIndex } from "@/components/common/modalClassNames";

const typeConfig = {
  international: {
    label: "Quốc tế",
    chipColor: "primary",
    gradient: "from-indigo-500 to-blue-500",
    icon: Plane,
  },
  domestic: {
    label: "Nội địa",
    chipColor: "success",
    gradient: "from-emerald-500 to-green-500",
    icon: Truck,
  },
};

const statusConfig = {
  active: { label: "Đang hợp tác", color: "success" },
  onboarding: { label: "Đang triển khai", color: "primary" },
  on_hold: { label: "Tạm dừng", color: "warning" },
};

const tierConfig = {
  strategic: { label: "Đối tác chiến lược", color: "purple" },
  premium: { label: "Đối tác ưu tiên", color: "blue" },
  standard: { label: "Đối tác chuẩn", color: "default" },
};

const emptyPartnerForm = {
  code: "",
  name: "",
  country: "",
  type: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  contactAddress: "",
};

const defaultAdvancedFilters = {
  region: {
    type: "select",
    label: "Khu v???c giao nh??-n",
    value: "",
    options: [
      { value: "asia", label: "ChA?u A?" },
      { value: "europe", label: "ChA?u A,u" },
      { value: "americas", label: "ChA?u M??1" },
      { value: "domestic", label: "N??Ti ?`??<a" },
    ],
  },
  mainService: {
    type: "select",
    label: "D??<ch v??? chA-nh",
    value: "",
    options: [
      { value: "express", label: "Chuy???n phA?t nhanh" },
      { value: "economy", label: "Chuy???n phA?t ti???t ki???m" },
      { value: "freight", label: "C????>c hA?ng n???ng" },
      { value: "cod", label: "COD n??Ti ?`??<a" },
    ],
  },
  integrations: {
    type: "checkbox",
    label: "KA?nh tA-ch h???p",
    value: [],
    options: [
      { value: "tracking", label: "Tracking API" },
      { value: "billing", label: "HA3a ?`??n ?`i???n t??-" },
      { value: "cod", label: "????`i soA?t COD" },
      { value: "notification", label: "ThA'ng bA?o t??? ?`??Tng" },
    ],
  },
  certifications: {
    type: "checkbox",
    label: "Ch??cng nh??-n",
    value: [],
    options: [
      { value: "iata", label: "IATA" },
      { value: "customs", label: "Khai bA?o H???i quan" },
      { value: "gdp", label: "GDP Pharma" },
      { value: "warehouse", label: "Kho bA?i tiA?u chu??cn" },
    ],
  },
};
const mockAgents = [
  {
    id: "AG001",
    code: "INT-DHL-VN",
    name: "DHL Express Vietnam",
    type: "international",
    tier: "strategic",
    country: "Vietnam",
    region: "asia",
    hubs: ["HCM", "HN"],
    contact: {
      person: "Nguyễn Hải Long",
      phone: "(028) 3899 1888",
      email: "long.nguyen@dhl.com",
      address: "39B Trường Sơn, Tân Bình, TP.HCM",
    },
    services: ["express", "economy", "freight"],
    integrations: ["tracking", "billing", "notification"],
    certifications: ["iata", "customs"],
    netRate: 0.82,
    margin: 18,
    currency: "USD",
    billingCycle: "14 ngày",
    rating: 4.8,
    status: "active",
    supportChannels: ["24/7 hotline", "Portal billing", "Dedicated PIC"],
    lastSync: "2024-10-30 20:10",
  },
  {
    id: "AG002",
    code: "INT-FEDEX",
    name: "FedEx APAC",
    type: "international",
    tier: "premium",
    country: "Singapore",
    region: "asia",
    hubs: ["SIN"],
    contact: {
      person: "Sarah Chen",
      phone: "+65 6123 4567",
      email: "sarah.chen@fedex.com",
      address: "90 Airport Blvd, Singapore",
    },
    services: ["express", "freight"],
    integrations: ["tracking", "notification"],
    certifications: ["iata"],
    netRate: 0.79,
    margin: 22,
    currency: "USD",
    billingCycle: "21 ngày",
    rating: 4.6,
    status: "active",
    supportChannels: ["Portal tracking", "API webhooks"],
    lastSync: "2024-10-31 08:30",
  },
  {
    id: "AG003",
    code: "INT-UPS",
    name: "UPS Global",
    type: "international",
    tier: "premium",
    country: "United States",
    region: "americas",
    hubs: ["LAX", "ORD"],
    contact: {
      person: "Michael Brown",
      phone: "+1 213 555 0101",
      email: "michael.brown@ups.com",
      address: "1800 NFDC Way, Los Angeles, CA",
    },
    services: ["express", "economy"],
    integrations: ["tracking", "billing"],
    certifications: ["iata", "gdp"],
    netRate: 0.81,
    margin: 17,
    currency: "USD",
    billingCycle: "30 ngày",
    rating: 4.5,
    status: "onboarding",
    supportChannels: ["Quarterly review", "Dedicated account"],
    lastSync: "2024-10-28 17:45",
  },
  {
    id: "AG004",
    code: "DOM-SSE-NORTH",
    name: "SSE Hà Nội Hub",
    type: "domestic",
    tier: "strategic",
    country: "Vietnam",
    region: "domestic",
    hubs: ["Hà Nội", "Bắc Ninh", "Hải Phòng"],
    contact: {
      person: "Trần Thu Vân",
      phone: "0988 345 678",
      email: "van.tran@sse.vn",
      address: "18 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    },
    services: ["cod", "express"],
    integrations: ["tracking", "cod", "billing"],
    certifications: ["warehouse"],
    netRate: 0.68,
    margin: 25,
    currency: "VND",
    billingCycle: "7 ngày",
    rating: 4.7,
    status: "active",
    supportChannels: ["Livechat", "Zalo OA", "Pickup SLA 2h"],
    lastSync: "2024-10-31 10:00",
  },
  {
    id: "AG005",
    code: "DOM-SOUTH-PARTNER",
    name: "VNPost EMS HCM",
    type: "domestic",
    tier: "standard",
    country: "Vietnam",
    region: "domestic",
    hubs: ["TP.HCM", "Cần Thơ"],
    contact: {
      person: "Phạm Đức Huy",
      phone: "0907 223 889",
      email: "huy.pham@vnpost.vn",
      address: "125 Hai Bà Trưng, Quận 1, TP.HCM",
    },
    services: ["express", "economy"],
    integrations: ["tracking"],
    certifications: ["warehouse"],
    netRate: 0.72,
    margin: 14,
    currency: "VND",
    billingCycle: "10 ngày",
    rating: 4.2,
    status: "active",
    supportChannels: ["Phone support"],
    lastSync: "2024-10-30 15:22",
  },
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState(
    defaultAdvancedFilters,
  );
  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm);

  const detailModal = useDisclosure();
  const filterModal = useDisclosure();
  const addPartnerModal = useDisclosure();

  useEffect(() => {
    if (!addPartnerModal.isOpen) {
      setPartnerForm(emptyPartnerForm);
    }
  }, [addPartnerModal.isOpen]);

  const filteredAgents = useMemo(() => {
    return mockAgents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !selectedType || agent.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const stats = useMemo(() => {
    return {
      total: mockAgents.length,
      international: mockAgents.filter((a) => a.type === "international")
        .length,
      domestic: mockAgents.filter((a) => a.type === "domestic").length,
      active: mockAgents.filter((a) => a.status === "active").length,
      avgMargin: (
        mockAgents.reduce((sum, a) => sum + a.margin, 0) / mockAgents.length
      ).toFixed(1),
      avgRating: (
        mockAgents.reduce((sum, a) => sum + a.rating, 0) / mockAgents.length
      ).toFixed(1),
    };
  }, []);

  const handlePartnerChange = (field) => (event) => {
    const { value } = event.target;

    setPartnerForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenDetail = (agent) => {
    setSelectedAgent(agent);
    detailModal.onOpen();
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
    filterModal.onClose();
  };

  const handlePartnerSubmit = () => {
    // TODO: integrate persistence when backend available
    addPartnerModal.onClose();
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="border-b border-slate-200/50 bg-white/90 backdrop-blur-xl shadow-lg relative">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Quản lý Đại lý & Đối tác
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Quản lý các đối tác vận chuyển & tích hợp dịch vụ
              </p>
            </div>
            <Button
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              size="lg"
              startContent={
                <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              }
              onPress={addPartnerModal.onOpen}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              Thêm đối tác
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-6 relative">
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                key: "all",
                label: "Tổng đối tác",
                value: stats.total,
                icon: Globe,
                gradient: "from-blue-500 to-cyan-500",
                accent: "from-blue-500 to-cyan-500",
              },
              {
                key: "international",
                label: "Quốc tế",
                value: stats.international,
                icon: Plane,
                gradient: "from-indigo-500 to-purple-500",
                accent: "from-indigo-500 to-purple-500",
              },
              {
                key: "domestic",
                label: "Nội địa",
                value: stats.domestic,
                icon: Truck,
                gradient: "from-emerald-500 to-green-500",
                accent: "from-emerald-500 to-green-500",
              },
              {
                key: "active",
                label: "Đang hợp tác",
                value: stats.active,
                icon: CheckCircle,
                gradient: "from-amber-500 to-orange-500",
                accent: "from-amber-500 to-orange-500",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              const isActive = selectedType === stat.key;

              return (
                <Card
                  key={stat.key}
                  isPressable
                  className={`group relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-blue-500 shadow-xl scale-105"
                      : "border-slate-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  } bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm`}
                  onPress={() =>
                    setSelectedType(stat.key === "all" ? "" : stat.key)
                  }
                >
                  {/* Decorative gradient line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent}`}
                  />

                  {/* Background glow effect */}
                  <div
                    className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`}
                  />

                  <CardBody className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-black text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`relative rounded-2xl p-4 bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="group relative overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white to-green-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Biên lợi nhuận trung bình
                    </p>
                    <p className="text-4xl font-black text-green-600">
                      {stats.avgMargin}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Cao nhất</p>
                    <p className="text-xl font-bold text-green-700">
                      {Math.max(...mockAgents.map((a) => a.margin))}%
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group relative overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white to-amber-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Đánh giá trung bình
                    </p>
                    <p className="text-4xl font-black text-amber-600 flex items-baseline gap-1">
                      {stats.avgRating}
                      <span className="text-xl text-slate-400">/5.0</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(stats.avgRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative group flex-1">
              <Input
                classNames={{
                  inputWrapper:
                    "border-2 border-slate-300 group-data-[focus=true]:border-blue-500 bg-white shadow-sm",
                }}
                placeholder="Tìm kiếm đối tác..."
                size="lg"
                startContent={<Search className="h-5 w-5 text-slate-400" />}
                value={searchQuery}
                variant="bordered"
                onValueChange={setSearchQuery}
              />
            </div>
            <Button
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-6 h-12"
              size="lg"
              startContent={<Filter className="h-5 w-5" />}
              onPress={filterModal.onOpen}
            >
              Lọc nâng cao
            </Button>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredAgents.map((agent) => {
              const TypeIcon = typeConfig[agent.type].icon;

              return (
                <Card
                  key={agent.id}
                  isPressable
                  className="group relative overflow-hidden border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onPress={() => handleOpenDetail(agent)}
                >
                  {/* Decorative gradient line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${typeConfig[agent.type].gradient}`}
                  />

                  <CardBody className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-2xl p-4 bg-gradient-to-br ${typeConfig[agent.type].gradient} text-white shadow-lg`}
                          >
                            <TypeIcon className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {agent.name}
                            </h3>
                            <p className="text-sm text-slate-500 font-mono">
                              {agent.code}
                            </p>
                          </div>
                        </div>
                        <Chip
                          className="font-semibold"
                          color={tierConfig[agent.tier]?.color ?? "default"}
                          size="sm"
                          startContent={<Award className="h-3 w-3" />}
                          variant="flat"
                        >
                          {tierConfig[agent.tier]?.label ?? "Đối tác"}
                        </Chip>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 bg-slate-50/70 rounded-lg p-3 border border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>
                              {agent.country} • {agent.hubs.join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span>{agent.contact.person}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{agent.contact.phone}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-right bg-green-50/70 rounded-lg p-3 border border-green-100">
                          <div>
                            <p className="text-xs text-slate-500">
                              Biên lợi nhuận
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {agent.margin}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Đánh giá</p>
                            <p className="text-lg font-bold text-amber-600 flex items-center justify-end gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {agent.rating}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Services & Integrations */}
                      <div className="space-y-3">
                        <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-2">
                            Dịch vụ
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {agent.services.map((service) => (
                              <Chip
                                key={service}
                                color="primary"
                                size="sm"
                                variant="flat"
                              >
                                {service === "express"
                                  ? "Nhanh"
                                  : service === "economy"
                                    ? "Tiết kiệm"
                                    : service === "freight"
                                      ? "Hàng nặng"
                                      : "COD"}
                              </Chip>
                            ))}
                          </div>
                        </div>
                        <div className="bg-purple-50/70 rounded-lg p-3 border border-purple-100">
                          <p className="text-xs font-semibold text-purple-700 mb-2">
                            Tích hợp
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {agent.integrations.map((integration) => (
                              <Chip
                                key={integration}
                                color="secondary"
                                size="sm"
                                startContent={<Link className="h-3 w-3" />}
                                variant="flat"
                              >
                                {integration === "tracking"
                                  ? "Tracking"
                                  : integration === "billing"
                                    ? "Billing"
                                    : integration === "cod"
                                      ? "COD"
                                      : "Thông báo"}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <Chip
                          className="font-semibold"
                          color={statusConfig[agent.status]?.color ?? "default"}
                          size="sm"
                          variant="flat"
                        >
                          {statusConfig[agent.status]?.label ?? "Khác"}
                        </Chip>
                        <Button
                          className="text-blue-600 font-semibold"
                          endContent={<ArrowUpRight className="h-4 w-4" />}
                          size="sm"
                          variant="light"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        classNames={{
          ...withHighZIndex({ base: "bg-white" }),
          header:
            "border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50",
          body: "py-6",
          footer: "border-t border-slate-200",
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
        }}
        isOpen={detailModal.isOpen}
        size="3xl"
        onOpenChange={detailModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) =>
            selectedAgent && (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-4">
                    {(() => {
                      const AgentIcon = typeConfig[selectedAgent.type].icon;

                      return (
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${typeConfig[selectedAgent.type].gradient} text-white shadow-lg`}
                        >
                          <AgentIcon className="h-7 w-7" />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {selectedAgent.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono">
                        {selectedAgent.code} • {selectedAgent.country}
                      </p>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
                        <Building className="h-5 w-5" />
                        Thông tin cơ bản
                      </h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-blue-400 group-data-[focus=true]:border-blue-500",
                          }}
                          label="Mã đối tác"
                          labelPlacement="outside"
                          placeholder="VD: INT-DHL-VN"
                          value={partnerForm.code}
                          variant="bordered"
                          onChange={handlePartnerChange("code")}
                        />
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-blue-400 group-data-[focus=true]:border-blue-500",
                          }}
                          label="Tên đối tác"
                          labelPlacement="outside"
                          placeholder="VD: DHL Express Vietnam"
                          value={partnerForm.name}
                          variant="bordered"
                          onChange={handlePartnerChange("name")}
                        />
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-blue-400 group-data-[focus=true]:border-blue-500",
                          }}
                          label="Quốc gia"
                          labelPlacement="outside"
                          placeholder="VD: Vietnam"
                          value={partnerForm.country}
                          variant="bordered"
                          onChange={handlePartnerChange("country")}
                        />
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-blue-400 group-data-[focus=true]:border-blue-500",
                          }}
                          label="Loại đối tác"
                          labelPlacement="outside"
                          placeholder="VD: Quoc te / Noi dia"
                          value={partnerForm.type}
                          variant="bordered"
                          onChange={handlePartnerChange("type")}
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900">
                        <Users className="h-5 w-5" />
                        Thông tin liên hệ
                      </h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-green-400 group-data-[focus=true]:border-green-500",
                          }}
                          label="Tên liên hệ"
                          labelPlacement="outside"
                          placeholder="VD: Nguyen Van A"
                          value={partnerForm.contactName}
                          variant="bordered"
                          onChange={handlePartnerChange("contactName")}
                        />
                        <Input
                          classNames={{
                            label: "text-slate-700 font-medium",
                            input: "bg-white text-slate-900",
                            inputWrapper:
                              "bg-white border-2 border-slate-300 hover:border-green-400 group-data-[focus=true]:border-green-500",
                          }}
                          label="Số điện thoại"
                          labelPlacement="outside"
                          placeholder="VD: 0901234567"
                          value={partnerForm.contactPhone}
                          variant="bordered"
                          onChange={handlePartnerChange("contactPhone")}
                        />
                        <div className="md:col-span-2">
                          <Input
                            classNames={{
                              label: "text-slate-700 font-medium",
                              input: "bg-white text-slate-900",
                              inputWrapper:
                                "bg-white border-2 border-slate-300 hover:border-green-400 group-data-[focus=true]:border-green-500",
                            }}
                            label="Email"
                            labelPlacement="outside"
                            placeholder="VD: contact@partner.com"
                            type="email"
                            value={partnerForm.contactEmail}
                            variant="bordered"
                            onChange={handlePartnerChange("contactEmail")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            classNames={{
                              label: "text-slate-700 font-medium",
                              input: "bg-white text-slate-900",
                              inputWrapper:
                                "bg-white border-2 border-slate-300 hover:border-green-400 group-data-[focus=true]:border-green-500",
                            }}
                            label="Địa chỉ"
                            labelPlacement="outside"
                            placeholder="VD: 123 ABC, Quan 1, TP.HCM"
                            value={partnerForm.contactAddress}
                            variant="bordered"
                            onChange={handlePartnerChange("contactAddress")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="py-2 text-center">
                      <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Tính năng đang trong giai đoạn phát triển
                      </p>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                    Chỉnh sửa
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Filter Modal */}
      <FilterModal
        filters={advancedFilters}
        isOpen={filterModal.isOpen}
        onApply={handleApplyFilters}
        onClose={filterModal.onClose}
      />

      {/* Add Partner Modal */}
      <Modal
        classNames={{
          base: "bg-white max-h-[90vh]",
          header:
            "border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50",
          body: "py-6 bg-white max-h-[calc(90vh-200px)] overflow-y-auto",
          footer: "border-t-2 border-slate-200 bg-slate-50",
          backdrop: "bg-black/60 backdrop-blur-sm",
        }}
        isOpen={addPartnerModal.isOpen}
        scrollBehavior="inside"
        size="3xl"
        onOpenChange={addPartnerModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <Globe className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Thêm đối tác mới
                    </h3>
                    <p className="text-sm text-slate-500">
                      Nhập thông tin đối tác vận chuyển
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">
                        Thông tin cơ bản
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-code"
                        >
                          Mã đối tác
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-code"
                          placeholder="VD: INT-DHL-VN"
                          type="text"
                          value={partnerForm.code}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              code: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-name"
                        >
                          Tên đối tác
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-name"
                          placeholder="Ví dụ: DHL Express Vietnam"
                          type="text"
                          value={partnerForm.name}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-country"
                        >
                          Quốc gia
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-country"
                          placeholder="Ví dụ: Vietnam"
                          type="text"
                          value={partnerForm.country}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-type"
                        >
                          Loại đối tác
                        </label>
                        <select
                          className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 appearance-none"
                          id="agent-type"
                          value={partnerForm.type}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        >
                          <option value="">Chọn loại đối tác</option>
                          <option value="international">Quốc tế</option>
                          <option value="domestic">Nội địa</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">
                        Thông tin liên hệ
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-contact-name"
                        >
                          Tên liên hệ
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-contact-name"
                          placeholder="Ví dụ: Nguyễn Văn A"
                          type="text"
                          value={partnerForm.contactName}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              contactName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-phone"
                        >
                          Số điện thoại
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-phone"
                          placeholder="Ví dụ: (028) 1234 5678"
                          type="tel"
                          value={partnerForm.contactPhone}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              contactPhone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-email"
                        >
                          Email
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-email"
                          placeholder="VD: contact@partner.com"
                          type="email"
                          value={partnerForm.contactEmail}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              contactEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label
                          className="text-sm font-medium text-slate-700"
                          htmlFor="agent-address"
                        >
                          Địa chỉ
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                          id="agent-address"
                          placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
                          type="text"
                          value={partnerForm.contactAddress}
                          onChange={(e) =>
                            setPartnerForm((prev) => ({
                              ...prev,
                              contactAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Tính năng đang trong giai đoạn phát triển
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="font-semibold"
                  size="lg"
                  variant="flat"
                  onPress={onClose}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg"
                  size="lg"
                  startContent={<Globe className="h-5 w-5" />}
                  onPress={onClose}
                >
                  Thêm đối tác
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
