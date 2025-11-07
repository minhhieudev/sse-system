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
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  Shield,
  Truck,
  Package,
  FileText,
  Phone,
  CheckCircle,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";

import StaffFormModal from "@/components/staff/StaffFormModal";
import StaffDetailModal from "@/components/staff/StaffDetailModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import FilterModal from "@/components/common/FilterModal";
import { exportToExcel, formatStaffForExport } from "@/lib/export";

// Mock data nhân viên
const mockStaff = [
  {
    id: "NV001",
    code: "SALE001",
    name: "Trần Thị B",
    email: "sales@sse.vn",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    role: "sales",
    department: "Kinh doanh",
    status: "active",
    joinDate: "2023-01-15",
    salary: "15000000",
    totalOrders: 145,
    commission: 85000000,
  },
  {
    id: "NV002",
    code: "SALE002",
    name: "Phạm Văn C",
    email: "phamvanc@sse.vn",
    phone: "0902345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    role: "sales",
    department: "Kinh doanh",
    status: "active",
    joinDate: "2023-03-20",
    salary: "12000000",
    totalOrders: 98,
    commission: 52000000,
  },
  {
    id: "NV003",
    code: "PICKUP001",
    name: "Nguyễn Văn D",
    email: "pickup@sse.vn",
    phone: "0903456789",
    address: "789 Hai Bà Trưng, Q.1, TP.HCM",
    role: "pickup",
    department: "Nhận hàng",
    status: "active",
    joinDate: "2022-11-10",
    salary: "8000000",
    totalOrders: 234,
    commission: 1170000,
  },
  {
    id: "NV004",
    code: "PICKUP002",
    name: "Lê Thị E",
    email: "lethie@sse.vn",
    phone: "0904567890",
    address: "321 Điện Biên Phủ, Q.3, TP.HCM",
    role: "pickup",
    department: "Nhận hàng",
    status: "active",
    joinDate: "2023-05-12",
    salary: "7500000",
    totalOrders: 189,
    commission: 945000,
  },
  {
    id: "NV005",
    code: "KHAI001",
    name: "Hoàng Văn F",
    email: "warehouse@sse.vn",
    phone: "0905678901",
    address: "654 Trần Hưng Đạo, Q.5, TP.HCM",
    role: "warehouse",
    department: "Khai thác",
    status: "active",
    joinDate: "2022-08-25",
    salary: "9000000",
    totalOrders: 312,
    commission: 4350000,
  },
  {
    id: "NV006",
    code: "KHAI002",
    name: "Võ Thị G",
    email: "vothig@sse.vn",
    phone: "0906789012",
    address: "987 Nguyễn Thị Minh Khai, Q.3, TP.HCM",
    role: "warehouse",
    department: "Khai thác",
    status: "active",
    joinDate: "2023-02-14",
    salary: "8500000",
    totalOrders: 276,
    commission: 3864000,
  },
  {
    id: "NV007",
    code: "DOC001",
    name: "Phan Thị H",
    email: "documentation@sse.vn",
    phone: "0907890123",
    address: "147 Võ Văn Tần, Q.3, TP.HCM",
    role: "documentation",
    department: "Chứng từ",
    status: "active",
    joinDate: "2023-04-18",
    salary: "9500000",
    totalOrders: 198,
    commission: 990000,
  },
];

const roleConfig = {
  owner: {
    label: "Chủ sở hữu",
    color: "from-purple-500 to-pink-500",
    icon: Shield,
  },
  admin: { label: "Admin", color: "from-blue-500 to-cyan-500", icon: Shield },
  sales: {
    label: "NV Kinh doanh",
    color: "from-green-500 to-emerald-500",
    icon: Users,
  },
  pickup: {
    label: "NV Pickup",
    color: "from-orange-500 to-amber-500",
    icon: Truck,
  },
  warehouse: {
    label: "NV Khai thác",
    color: "from-indigo-500 to-purple-500",
    icon: Package,
  },
  documentation: {
    label: "NV Chứng từ",
    color: "from-pink-500 to-rose-500",
    icon: FileText,
  },
  it_admin: {
    label: "IT Quản trị",
    color: "from-slate-500 to-gray-500",
    icon: Shield,
  },
};

const statusConfig = {
  active: { label: "Đang làm việc", color: "success" },
  inactive: { label: "Nghỉ việc", color: "danger" },
  probation: { label: "Thử việc", color: "warning" },
};

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [staff, setStaff] = useState(mockStaff);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
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
      ],
    },
    status: {
      label: "Trạng thái",
      type: "select",
      value: "",
      options: [
        { value: "", label: "Tất cả" },
        { value: "active", label: "Đang làm việc" },
        { value: "inactive", label: "Nghỉ việc" },
        { value: "probation", label: "Thử việc" },
      ],
    },
    joinDateRange: {
      label: "Ngày vào làm",
      type: "dateRange",
      value: { from: "", to: "" },
    },
  });

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "all" || s.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [staff, searchQuery, selectedRole]);

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter((s) => s.status === "active").length,
      sales: staff.filter((s) => s.role === "sales").length,
      pickup: staff.filter((s) => s.role === "pickup").length,
      warehouse: staff.filter((s) => s.role === "warehouse").length,
      documentation: staff.filter((s) => s.role === "documentation").length,
    };
  }, [staff]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAdd = () => {
    setStaffToEdit(null);
    onFormOpen();
  };

  const handleEdit = (staffMember) => {
    setStaffToEdit(staffMember);
    onFormOpen();
  };

  const handleDelete = (staffMember) => {
    setStaffToDelete(staffMember);
    onDeleteOpen();
  };

  const handleViewDetail = (staffMember) => {
    setSelectedStaff(staffMember);
    onDetailOpen();
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      setStaff((prev) => prev.filter((s) => s.id !== staffToDelete.id));
      showSuccess(`Đã xóa nhân viên ${staffToDelete.name}`);
      setStaffToDelete(null);
    }
  };

  const handleSave = (staffData) => {
    if (staffToEdit) {
      // Update existing
      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffToEdit.id ? { ...staffData, id: staffToEdit.id } : s,
        ),
      );
      showSuccess(`Đã cập nhật nhân viên ${staffData.name}`);
    } else {
      // Add new
      setStaff((prev) => [...prev, staffData]);
      showSuccess(`Đã thêm nhân viên ${staffData.name}`);
    }
    setStaffToEdit(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleExport = () => {
    const exportData = formatStaffForExport(filteredStaff);

    exportToExcel(exportData, "danh_sach_nhan_vien");
    showSuccess("Đã xuất dữ liệu thành công!");
  };

  // Find top performer
  const topPerformer = staff.reduce(
    (max, s) => (s.commission > max.commission ? s : max),
    staff[0],
  );

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-12 text-white overflow-hidden">
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
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Quản lý Nhân viên</h1>
                <p className="text-lg text-blue-100">
                  Quản lý thông tin, phân quyền và theo dõi hiệu suất làm việc
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
                className="border-2 border-white text-white hover:bg-white/10 font-semibold"
                size="lg"
                startContent={<Download className="h-5 w-5" />}
                variant="bordered"
                onPress={handleExport}
              >
                Xuất Excel
              </Button>
              <Button
                className="bg-white text-blue-600 font-semibold shadow-xl hover:shadow-2xl"
                size="lg"
                startContent={<Plus className="h-5 w-5" />}
                onPress={handleAdd}
              >
                Thêm nhân viên
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Staff - Large */}
            <Card className="shadow-xl border-2 border-slate-200 bg-white text-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardBody className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <Users className="h-8 w-8" />
                  </div>
                  <Chip className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-sm">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12%
                  </Chip>
                </div>
                <p className="text-sm text-slate-600 mb-2">Tổng nhân viên</p>
                <p className="text-5xl font-bold mb-1 text-slate-900">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-500">
                  {stats.active} đang hoạt động
                </p>
              </CardBody>
            </Card>

            {/* Top Performer */}
            {topPerformer && (
              <Card className="lg:col-span-2 shadow-xl border-2 border-slate-200 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardBody className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg">
                        <Award className="h-10 w-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
                            Nhân viên xuất sắc nhất
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                          {topPerformer.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            {roleConfig[topPerformer.role]?.label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {topPerformer.totalOrders} đơn
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

          {/* Department Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                key: "sales",
                label: "Kinh doanh",
                color: "from-green-500 to-emerald-500",
                icon: Users,
                count: stats.sales,
              },
              {
                key: "pickup",
                label: "Pickup",
                color: "from-orange-500 to-amber-500",
                icon: Truck,
                count: stats.pickup,
              },
              {
                key: "warehouse",
                label: "Khai thác",
                color: "from-indigo-500 to-purple-500",
                icon: Package,
                count: stats.warehouse,
              },
              {
                key: "documentation",
                label: "Chứng từ",
                color: "from-pink-500 to-rose-500",
                icon: FileText,
                count: stats.documentation,
              },
            ].map((dept) => (
              <Card
                key={dept.key}
                className="shadow-xl border-2 border-slate-200 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        {dept.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {dept.count}
                      </p>
                    </div>
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${dept.color} text-white shadow-lg`}
                    >
                      <dept.icon className="h-7 w-7" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card className="shadow-xl border-2 border-slate-200 bg-white">
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
                aria-label="Bảng nhân viên"
                classNames={{
                  th: "bg-slate-100 text-slate-700 font-bold text-sm",
                  td: "py-5",
                }}
              >
                <TableHeader>
                  <TableColumn>MÃ NV</TableColumn>
                  <TableColumn>TÊN NHÂN VIÊN</TableColumn>
                  <TableColumn>VAI TRÒ</TableColumn>
                  <TableColumn>BỘ PHẬN</TableColumn>
                  <TableColumn>LIÊN HỆ</TableColumn>
                  <TableColumn className="text-right">TỔNG ĐƠN</TableColumn>
                  <TableColumn className="text-right">HOA HỒNG</TableColumn>
                  <TableColumn>TRẠNG THÁI</TableColumn>
                  <TableColumn className="text-center">THAO TÁC</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staffMember) => {
                    const RoleIcon = roleConfig[staffMember.role].icon;

                    return (
                      <TableRow
                        key={staffMember.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <span className="font-bold text-blue-600">
                            {staffMember.code}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${roleConfig[staffMember.role].color} text-white`}
                            >
                              <RoleIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {staffMember.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {staffMember.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            className={`bg-gradient-to-r ${roleConfig[staffMember.role].color} text-white font-semibold`}
                            size="md"
                            variant="flat"
                          >
                            {roleConfig[staffMember.role].label}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-slate-700">
                            {staffMember.department}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {staffMember.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-slate-900">
                            {staffMember.totalOrders}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(staffMember.commission)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={statusConfig[staffMember.status].color}
                            size="sm"
                            variant="flat"
                          >
                            {statusConfig[staffMember.status].label}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              isIconOnly
                              size="sm"
                              title="Xem chi tiết"
                              variant="light"
                              onPress={() => handleViewDetail(staffMember)}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              title="Chỉnh sửa"
                              variant="light"
                              onPress={() => handleEdit(staffMember)}
                            >
                              <Edit className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              title="Xóa"
                              variant="light"
                              onPress={() => handleDelete(staffMember)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
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

      {/* Modals */}
      <StaffFormModal
        isOpen={isFormOpen}
        staff={staffToEdit}
        onClose={onFormClose}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={staffToDelete?.name}
        message="Bạn có chắc chắn muốn xóa nhân viên này? Tất cả dữ liệu liên quan sẽ bị mất."
        title="Xác nhận xóa nhân viên"
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
      />

      <FilterModal
        filters={advancedFilters}
        isOpen={isFilterOpen}
        onApply={handleApplyFilters}
        onClose={onFilterClose}
      />

      {/* Detail Modal */}
      {selectedStaff && (
        <StaffDetailModal
          isOpen={isDetailOpen}
          staff={selectedStaff}
          onClose={onDetailClose}
        />
      )}
    </div>
  );
}
