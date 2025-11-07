"use client";

import { useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import {
  Search,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Truck,
  FileText,
  Calendar,
  Sparkles,
  Trophy,
  Target,
  CheckCircle,
} from "lucide-react";

import FilterModal from "@/components/common/FilterModal";
import { exportToExcel, formatCommissionForExport } from "@/lib/export";

// Mock data hoa hồng theo bộ phận
const mockCommissionData = {
  summary: {
    totalCommission: 95542500,
    totalOrders: 1686,
    salesCommission: 85000000,
    pickupCommission: 2115000,
    warehouseCommission: 8214000,
    documentationCommission: 990000,
    itCommission: 1217500,
  },
  byStaff: [
    {
      id: "NV001",
      code: "SALE001",
      name: "Trần Thị B",
      role: "sales",
      department: "Kinh doanh",
      ordersCompleted: 145,
      commission: 85000000,
      details: "145 đơn hoàn tất, doanh số được ghi nhận",
    },
    {
      id: "NV002",
      code: "SALE002",
      name: "Phạm Văn C",
      role: "sales",
      department: "Kinh doanh",
      ordersCompleted: 98,
      commission: 52000000,
      details: "98 đơn hoàn tất, doanh số được ghi nhận",
    },
    {
      id: "NV003",
      code: "PICKUP001",
      name: "Nguyễn Văn D",
      role: "pickup",
      department: "Nhận hàng",
      ordersCompleted: 234,
      commission: 1170000,
      details: "234 đơn × 5.000đ/đơn",
    },
    {
      id: "NV004",
      code: "PICKUP002",
      name: "Lê Thị E",
      role: "pickup",
      department: "Nhận hàng",
      ordersCompleted: 189,
      commission: 945000,
      details: "189 đơn × 5.000đ/đơn",
    },
    {
      id: "NV005",
      code: "KHAI001",
      name: "Hoàng Văn F",
      role: "warehouse",
      department: "Khai thác",
      ordersCompleted: 312,
      commission: 4350000,
      details: "150 đơn <20kg × 10k + 162 đơn ≥21kg × 15k",
    },
    {
      id: "NV006",
      code: "KHAI002",
      name: "Võ Thị G",
      role: "warehouse",
      department: "Khai thác",
      ordersCompleted: 276,
      commission: 3864000,
      details: "130 đơn <20kg × 10k + 146 đơn ≥21kg × 15k",
    },
    {
      id: "NV007",
      code: "DOC001",
      name: "Phan Thị H",
      role: "documentation",
      department: "Chứng từ",
      ordersCompleted: 198,
      commission: 990000,
      details: "198 bộ chứng từ quốc tế × 5.000đ",
    },
    {
      id: "NV010",
      code: "IT001",
      name: "Nguyễn Văn I",
      role: "it_admin",
      department: "IT",
      ordersCompleted: 487,
      commission: 1217500,
      details: "325 bill quốc tế × 3k + 162 bill nội địa × 1.5k",
    },
  ],
};

const roleConfig = {
  sales: {
    label: "NV Kinh doanh",
    color: "from-blue-500 to-cyan-500",
    icon: Users,
  },
  pickup: {
    label: "NV Pickup",
    color: "from-purple-500 to-pink-500",
    icon: Truck,
  },
  warehouse: {
    label: "NV Khai thác",
    color: "from-amber-500 to-orange-500",
    icon: Package,
  },
  documentation: {
    label: "NV Chứng từ",
    color: "from-green-500 to-emerald-500",
    icon: FileText,
  },
  it_admin: {
    label: "IT Quản trị",
    color: "from-slate-500 to-gray-500",
    icon: Users,
  },
};

export default function CommissionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const [advancedFilters, setAdvancedFilters] = useState({
    role: {
      label: "Vai trò",
      type: "select",
      value: "",
      options: [
        { value: "", label: "Tất cả" },
        { value: "sales", label: "NV Kinh doanh" },
        { value: "pickup", label: "NV Pickup" },
        { value: "warehouse", label: "NV Khai thác" },
        { value: "documentation", label: "NV Chứng từ" },
        { value: "it_admin", label: "IT Quản trị" },
      ],
    },
    commissionRange: {
      label: "Hoa hồng (VNĐ)",
      type: "number",
      value: { min: "", max: "" },
    },
    ordersRange: {
      label: "Số đơn",
      type: "number",
      value: { min: "", max: "" },
    },
  });

  const filteredStaff = useMemo(() => {
    return mockCommissionData.byStaff.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "all" || staff.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleExport = () => {
    const exportData = formatCommissionForExport(filteredStaff);

    exportToExcel(exportData, "bao_cao_hoa_hong");
    showSuccess("Đã xuất báo cáo thành công!");
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const { summary } = mockCommissionData;

  // Calculate top performer
  const topPerformer = filteredStaff.reduce(
    (max, staff) => (staff.commission > max.commission ? staff : max),
    filteredStaff[0],
  );

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header với Gradient */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 py-5 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg shadow-2xl">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Báo cáo Hoa hồng</h1>
                <p className="text-lg text-green-100">
                  Theo dõi chi tiết hoa hồng và hiệu suất làm việc của toàn bộ
                  nhân viên
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="border-2 border-white text-white hover:bg-white/10 font-semibold"
                size="lg"
                startContent={<Filter className="h-5 w-5" />}
                variant="bordered"
                onPress={onFilterOpen}
              >
                Lọc nâng cao
              </Button>
              <Button
                className="bg-white text-green-600 font-semibold shadow-xl hover:shadow-2xl"
                size="lg"
                startContent={<Download className="h-5 w-5" />}
                onPress={handleExport}
              >
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-900">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Period Selector - More prominent */}
          <Card className="shadow-xl border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Kỳ báo cáo
                    </h3>
                    <p className="text-sm text-slate-600">
                      Chọn thời gian để xem báo cáo
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      value: "current_month",
                      label: "Tháng này",
                      icon: Calendar,
                    },
                    {
                      value: "last_month",
                      label: "Tháng trước",
                      icon: Calendar,
                    },
                    { value: "quarter", label: "Quý này", icon: Target },
                    { value: "year", label: "Năm nay", icon: Sparkles },
                  ].map((period) => (
                    <Button
                      key={period.value}
                      className={
                        selectedPeriod === period.value
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
                          : "text-slate-700 hover:bg-slate-100"
                      }
                      size="lg"
                      startContent={<period.icon className="h-4 w-4" />}
                      variant={
                        selectedPeriod === period.value ? "solid" : "flat"
                      }
                      onPress={() => setSelectedPeriod(period.value)}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Summary Cards - More visual với Gradient */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Commission - Large card */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white shadow-2xl border-0">
              <CardBody className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <Chip className="bg-white/20 text-white font-semibold backdrop-blur">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +15%
                  </Chip>
                </div>
                <p className="text-sm opacity-90 mb-2">Tổng Hoa hồng</p>
                <p className="text-4xl font-bold mb-1">
                  {formatCurrency(summary.totalCommission)}
                </p>
                <p className="text-sm opacity-75">
                  Tổng {summary.totalOrders.toLocaleString()} đơn hàng
                </p>
              </CardBody>
            </Card>

            {/* Top Performer */}
            {topPerformer && (
              <Card className="lg:col-span-2 shadow-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardBody className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg">
                        <Trophy className="h-10 w-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
                            Nhân viên xuất sắc nhất tháng
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                          {topPerformer.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {topPerformer.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {topPerformer.ordersCompleted} đơn
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">Hoa hồng</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(topPerformer.commission)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                key: "salesCommission",
                label: "Kinh doanh",
                color: "from-blue-500 to-cyan-500",
                icon: Users,
                value: summary.salesCommission,
              },
              {
                key: "pickupCommission",
                label: "Pickup",
                color: "from-purple-500 to-pink-500",
                icon: Truck,
                value: summary.pickupCommission,
              },
              {
                key: "warehouseCommission",
                label: "Khai thác",
                color: "from-amber-500 to-orange-500",
                icon: Package,
                value: summary.warehouseCommission,
              },
              {
                key: "documentationCommission",
                label: "Chứng từ",
                color: "from-green-500 to-emerald-500",
                icon: FileText,
                value: summary.documentationCommission,
              },
              {
                key: "itCommission",
                label: "IT",
                color: "from-slate-500 to-gray-600",
                icon: Users,
                value: summary.itCommission,
              },
            ].map((dept) => (
              <Card
                key={dept.key}
                className="shadow-xl border-0 hover:shadow-2xl transition-shadow"
              >
                <CardBody className="p-6">
                  <div className="flex flex-col gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${dept.color} text-white shadow-lg`}
                    >
                      <dept.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        {dept.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(dept.value)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Commission Rules - More attractive */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Cơ chế Hoa hồng theo Quy trình
                  </h3>
                  <p className="text-sm text-slate-600">
                    Quy định tính hoa hồng cho từng bộ phận
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {[
                  {
                    role: "sales",
                    label: "NV Kinh doanh",
                    desc: "% Doanh số khi thanh toán",
                    icon: Users,
                    color: "blue",
                  },
                  {
                    role: "pickup",
                    label: "NV Pickup",
                    desc: "5.000đ / đơn hoàn tất",
                    icon: Truck,
                    color: "purple",
                  },
                  {
                    role: "warehouse",
                    label: "NV Khai thác",
                    desc: "10k (<20kg) / 15k (≥21kg)",
                    icon: Package,
                    color: "amber",
                  },
                  {
                    role: "documentation",
                    label: "NV Chứng từ",
                    desc: "5.000đ / bill quốc tế",
                    icon: FileText,
                    color: "green",
                  },
                  {
                    role: "it_admin",
                    label: "IT Quản trị",
                    desc: "3k (QT) / 1.5k (NĐ)",
                    icon: Users,
                    color: "slate",
                  },
                ].map((rule) => (
                  <div
                    key={rule.role}
                    className={`rounded-xl border-2 border-${rule.color}-200 bg-${rule.color}-50 p-5 hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${rule.color}-100`}
                      >
                        <rule.icon
                          className={`h-5 w-5 text-${rule.color}-600`}
                        />
                      </div>
                      <h4 className={`font-bold text-${rule.color}-900`}>
                        {rule.label}
                      </h4>
                    </div>
                    <p
                      className={`text-sm text-${rule.color}-700 font-semibold`}
                    >
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Table */}
          <Card className="shadow-xl border-0">
            <CardBody className="p-6">
              {/* Filter Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {["all", "sales", "pickup", "warehouse", "documentation"].map(
                    (role) => (
                      <Button
                        key={role}
                        className={
                          selectedRole === role
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
                            : "text-slate-700 hover:bg-slate-100"
                        }
                        size="md"
                        variant={selectedRole === role ? "solid" : "flat"}
                        onPress={() => setSelectedRole(role)}
                      >
                        {role === "all"
                          ? "Tất cả"
                          : role === "sales"
                            ? "Kinh doanh"
                            : role === "pickup"
                              ? "Pickup"
                              : role === "warehouse"
                                ? "Khai thác"
                                : "Chứng từ"}
                      </Button>
                    ),
                  )}
                </div>

                <Input
                  className="w-80"
                  classNames={{
                    inputWrapper:
                      "border-2 border-slate-200 hover:border-blue-400",
                  }}
                  placeholder="Tìm kiếm nhân viên..."
                  size="md"
                  startContent={<Search className="h-5 w-5 text-slate-400" />}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>

              {/* Table */}
              <Table
                removeWrapper
                aria-label="Bảng hoa hồng nhân viên"
                classNames={{
                  th: "bg-slate-100 text-slate-700 font-bold text-sm",
                  td: "py-5",
                }}
              >
                <TableHeader>
                  <TableColumn>MÃ NV</TableColumn>
                  <TableColumn>TÊN NHÂN VIÊN</TableColumn>
                  <TableColumn>BỘ PHẬN</TableColumn>
                  <TableColumn>VAI TRÒ</TableColumn>
                  <TableColumn className="text-right">SỐ ĐƠN</TableColumn>
                  <TableColumn className="text-right">HOA HỒNG</TableColumn>
                  <TableColumn>CHI TIẾT TÍNH</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => {
                    const RoleIcon = roleConfig[staff.role].icon;

                    return (
                      <TableRow
                        key={staff.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <span className="font-bold text-blue-600">
                            {staff.code}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${roleConfig[staff.role].color} text-white`}
                            >
                              <RoleIcon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-slate-900">
                              {staff.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-slate-700">
                            {staff.department}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            className={`bg-gradient-to-r ${roleConfig[staff.role].color} text-white font-semibold`}
                            size="md"
                            variant="flat"
                          >
                            {roleConfig[staff.role].label}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-slate-900">
                            {staff.ordersCompleted}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(staff.commission)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {staff.details}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        filters={advancedFilters}
        isOpen={isFilterOpen}
        onApply={handleApplyFilters}
        onClose={onFilterClose}
      />
    </div>
  );
}
