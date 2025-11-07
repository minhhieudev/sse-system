"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Plane,
  Truck,
  Package,
  Globe,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Box,
  Calendar,
} from "lucide-react";
import * as XLSX from "xlsx";

import AWBFormModal from "@/components/awb/AWBFormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import FilterModal from "@/components/common/FilterModal";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { withHighZIndex } from "@/components/common/modalClassNames";

// Mock data
const mockAWBs = [
  {
    id: "AWB001",
    awbCode: "AWB123456",
    refCode: "REF-2024-001",
    type: "international",
    service: "DHL Express Worldwide",
    customerCode: "KH001",
    customerName: "Công ty TNHH ABC Import",
    senderName: "Nguyễn Văn A",
    senderCompany: "ABC Import Co., Ltd",
    senderPhone: "0901234567",
    senderAddress: "123 Nguyễn Huệ, Q.1, TP.HCM",
    senderCity: "TP. Hồ Chí Minh",
    senderCountry: "Vietnam",
    receiverName: "John Smith",
    receiverCompany: "XYZ Corporation",
    receiverPhone: "+1 555-0123",
    receiverAddress: "123 Main Street, New York, NY 10001, USA",
    receiverCity: "New York",
    receiverCountry: "United States",
    weight: 15.5,
    length: 50,
    width: 40,
    height: 30,
    pieces: 3,
    cargoType: "parcel",
    description: "Electronics",
    declaredValue: "1200",
    status: "in_transit",
    createdAt: "2024-10-25T10:30:00Z",
  },
  {
    id: "AWB002",
    awbCode: "AWB123457",
    refCode: "REF-2024-002",
    type: "domestic",
    service: "SSE Standard",
    customerCode: "KH002",
    customerName: "Công ty XYZ",
    senderName: "Trần Văn B",
    senderCompany: "XYZ Co.",
    senderPhone: "0902345678",
    senderAddress: "456 Lê Lợi, Q.3, TP.HCM",
    senderCity: "TP. Hồ Chí Minh",
    senderCountry: "Vietnam",
    receiverName: "Nguyễn Thị C",
    receiverCompany: "ABC Store",
    receiverPhone: "0903456789",
    receiverAddress: "789 Trần Hưng Đạo, Q.5, Hà Nội",
    receiverCity: "Hà Nội",
    receiverCountry: "Vietnam",
    weight: 8.2,
    length: 30,
    width: 25,
    height: 20,
    pieces: 1,
    cargoType: "documents",
    description: "Documents",
    declaredValue: "500",
    status: "delivered",
    createdAt: "2024-10-20T14:15:00Z",
  },
];

const typeConfig = {
  international: {
    label: "Quốc tế",
    color: "from-blue-500 to-cyan-500",
    icon: Plane,
  },
  domestic: {
    label: "Nội địa",
    color: "from-green-500 to-emerald-500",
    icon: Truck,
  },
};

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "warning", icon: Clock },
  processing: { label: "Đang xử lý", color: "primary", icon: Package },
  in_transit: { label: "Đang vận chuyển", color: "secondary", icon: Plane },
  delivered: { label: "Đã giao hàng", color: "success", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "danger", icon: AlertCircle },
};

export default function AWBPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [awbs, setAwbs] = useState(mockAWBs);
  const [awbToEdit, setAwbToEdit] = useState(null);
  const [awbToDelete, setAwbToDelete] = useState(null);
  const [selectedAWB, setSelectedAWB] = useState(null);
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
    type: {
      label: "Loại vận đơn",
      type: "select",
      value: "",
      options: [
        { value: "", label: "Tất cả" },
        { value: "international", label: "Quốc tế" },
        { value: "domestic", label: "Nội địa" },
      ],
    },
    status: {
      label: "Trạng thái",
      type: "select",
      value: "",
      options: [
        { value: "", label: "Tất cả" },
        { value: "pending", label: "Chờ xử lý" },
        { value: "processing", label: "Đang xử lý" },
        { value: "in_transit", label: "Đang vận chuyển" },
        { value: "delivered", label: "Đã giao hàng" },
        { value: "cancelled", label: "Đã hủy" },
      ],
    },
    dateRange: {
      label: "Ngày tạo",
      type: "dateRange",
      value: { from: "", to: "" },
    },
    weightRange: {
      label: "Trọng lượng (kg)",
      type: "number",
      value: { min: "", max: "" },
    },
  });

  const filteredAWBs = useMemo(() => {
    return awbs.filter((awb) => {
      const matchesSearch =
        awb.awbCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        awb.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        awb.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || awb.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || awb.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [awbs, searchQuery, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: awbs.length,
      international: awbs.filter((a) => a.type === "international").length,
      domestic: awbs.filter((a) => a.type === "domestic").length,
      inTransit: awbs.filter((a) => a.status === "in_transit").length,
      delivered: awbs.filter((a) => a.status === "delivered").length,
      totalWeight: awbs.reduce((sum, a) => sum + parseFloat(a.weight || 0), 0),
    };
  }, [awbs]);

  const statusCounts = useMemo(() => {
    return awbs.reduce(
      (acc, awb) => {
        acc[awb.status] = (acc[awb.status] ?? 0) + 1;
        acc.all += 1;

        return acc;
      },
      { all: 0 },
    );
  }, [awbs]);

  const summaryCards = [
    {
      key: "total",
      title: "Tổng vận đơn",
      value: stats.total,
      subtitle: `${stats.inTransit} đang vận chuyển`,
      icon: Package,
      gradient: "from-indigo-600 via-blue-600 to-sky-500",
    },
    {
      key: "international",
      title: "AWB Quốc tế",
      value: stats.international,
      subtitle: `${stats.domestic} AWB nội địa`,
      icon: Plane,
      gradient: "from-blue-500 via-cyan-500 to-teal-400",
    },
    {
      key: "delivered",
      title: "Đã giao thành công",
      value: stats.delivered,
      subtitle: `${stats.total - stats.delivered} đang xử lý`,
      icon: CheckCircle,
      gradient: "from-emerald-500 via-green-500 to-lime-400",
    },
    {
      key: "weight",
      title: "Khối lượng luỹ kế",
      value: `${stats.totalWeight.toFixed(1)} kg`,
      subtitle: "Tính từ đầu tháng",
      icon: Box,
      gradient: "from-slate-700 via-slate-600 to-slate-500",
    },
  ];

  const typeFilters = [
    { key: "all", label: "Tất cả", description: "Quốc tế + Nội địa" },
    {
      key: "international",
      label: "Quốc tế",
      description: "Khai thác DHL/UPS",
    },
    { key: "domestic", label: "Nội địa", description: "Mạng lưới SSE VN" },
  ];

  const statusFilters = [
    { key: "all", label: "Tất cả" },
    ...Object.entries(statusConfig).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  ];

  const statusSequence = ["pending", "processing", "in_transit", "delivered"];
  const isSelectedCancelled = selectedAWB?.status === "cancelled";
  const timelineSteps = isSelectedCancelled
    ? [...statusSequence, "cancelled"]
    : statusSequence;
  const currentTimelineIndex = selectedAWB
    ? isSelectedCancelled
      ? timelineSteps.length - 1
      : statusSequence.indexOf(selectedAWB.status)
    : -1;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAdd = () => {
    setAwbToEdit(null);
    onFormOpen();
  };

  const handleEdit = (awb) => {
    setAwbToEdit(awb);
    onFormOpen();
  };

  const handleDelete = (awb) => {
    setAwbToDelete(awb);
    onDeleteOpen();
  };

  const handleViewDetail = (awb) => {
    setSelectedAWB(awb);
    onDetailOpen();
  };

  const confirmDelete = () => {
    if (awbToDelete) {
      setAwbs((prev) => {
        const updated = prev.filter((a) => a.id !== awbToDelete.id);

        if (updated.length === 0) {
          setSelectedAWB(null);
        } else if (selectedAWB?.id === awbToDelete.id) {
          setSelectedAWB(updated[0]);
        }

        return updated;
      });
      showSuccess(`Đã xóa vận đơn ${awbToDelete.awbCode}`);
      setAwbToDelete(null);
    }
  };

  const handleSave = (awbData) => {
    if (awbToEdit) {
      setAwbs((prev) =>
        prev.map((a) =>
          a.id === awbToEdit.id ? { ...awbData, id: awbToEdit.id } : a,
        ),
      );
      setSelectedAWB({ ...awbData, id: awbToEdit.id });
      showSuccess(`Đã cập nhật vận đơn ${awbData.awbCode}`);
    } else {
      const newRecord = {
        ...awbData,
        id: awbData.id || `AWB-${Date.now()}`,
      };

      setAwbs((prev) => [newRecord, ...prev]);
      setSelectedAWB(newRecord);
      showSuccess(`Đã tạo vận đơn ${newRecord.awbCode}`);
    }
    setAwbToEdit(null);
  };

  const showSuccess = (message) => {
    showSuccessToast(message);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
  };

  useEffect(() => {
    if (!selectedAWB && awbs.length > 0) {
      setSelectedAWB(awbs[0]);
    }
  }, [awbs, selectedAWB]);

  const handleExport = () => {
    try {
      const exportData = filteredAWBs.map((awb) => ({
        "Mã AWB": awb.awbCode,
        "REF Code": awb.refCode,
        Loại: typeConfig[awb.type]?.label ?? awb.type,
        "Dịch vụ": awb.service,
        "Khách hàng": awb.customerName,
        "Người gửi": awb.senderCompany,
        "Người nhận": awb.receiverCompany,
        "Địa chỉ nhận": awb.receiverAddress,
        "Trạng thái": statusConfig[awb.status]?.label ?? awb.status,
        "Khối lượng (kg)": awb.weight,
        "Số kiện": awb.pieces,
        "Ngày tạo": awb.createdAt,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "AWB");

      const fileName = `AWB_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      showSuccessToast(`Đã xuất ${filteredAWBs.length} vận đơn thành công!`);
    } catch (error) {
      showErrorToast("Không thể xuất file. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative">
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
                Quản lý Vận đơn (AWB)
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Theo dõi vận đơn quốc tế & nội địa, cập nhật trạng thái realtime
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="rounded-xl bg-green-100 font-semibold text-green-700 hover:bg-green-200"
                size="lg"
                startContent={<Download className="h-5 w-5" />}
                onPress={handleExport}
              >
                Xuất Excel
              </Button>
              <Button
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                size="lg"
                startContent={
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                }
                onPress={handleAdd}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                Tạo vận đơn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 relative">
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-900">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.key}
                  className="group relative overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Decorative gradient line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}
                  />

                  {/* Background glow effect */}
                  <div
                    className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`}
                  />

                  <CardBody className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`relative rounded-2xl p-3 bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      {stat.key === "total" && (
                        <Chip
                          className="font-semibold"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          <TrendingUp className="mr-1 h-3 w-3" />
                          +18%
                        </Chip>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-semibold mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-black text-slate-900 mb-0.5">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500">{stat.subtitle}</p>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Quick Filter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                key: "all",
                label: "Tất cả",
                color: "from-slate-500 to-gray-600",
                icon: Package,
                count: stats.total,
              },
              {
                key: "international",
                label: "Quốc tế",
                color: "from-blue-500 to-cyan-500",
                icon: Plane,
                count: stats.international,
              },
              {
                key: "domestic",
                label: "Nội địa",
                color: "from-green-500 to-emerald-500",
                icon: Truck,
                count: stats.domestic,
              },
              {
                key: "in_transit",
                label: "Đang chuyển",
                color: "from-purple-500 to-pink-500",
                icon: Globe,
                count: stats.inTransit,
              },
              {
                key: "delivered",
                label: "Đã giao",
                color: "from-emerald-500 to-teal-500",
                icon: CheckCircle,
                count: stats.delivered,
              },
            ].map((filter) => (
              <Button
                key={filter.key}
                className={`h-auto p-4 bg-gradient-to-br ${filter.color} text-white shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  filter.key === selectedType ||
                  filter.key === selectedStatus ||
                  (filter.key === "all" &&
                    selectedType === "all" &&
                    selectedStatus === "all")
                    ? "ring-2 ring-white ring-opacity-50 scale-105"
                    : ""
                }`}
                onPress={() => {
                  if (filter.key === "all") {
                    setSelectedType("all");
                    setSelectedStatus("all");
                  } else if (
                    filter.key === "international" ||
                    filter.key === "domestic"
                  ) {
                    setSelectedType(filter.key);
                    setSelectedStatus("all");
                  } else {
                    setSelectedStatus(filter.key);
                    setSelectedType("all");
                  }
                }}
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <filter.icon className="h-6 w-6 text-white" />
                  <span className="text-sm font-semibold">{filter.label}</span>
                  <span className="text-2xl font-bold">{filter.count}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Table */}
          <Card className="shadow-xl border-2 border-slate-100 bg-white">
            <CardBody className="p-6">
              {/* Search Bar */}
              <div className="flex items-center justify-between mb-6">
                <Input
                  className="max-w-2xl"
                  classNames={{
                    inputWrapper:
                      "border-2 border-slate-200 hover:border-blue-400",
                  }}
                  placeholder="Tìm kiếm vận đơn theo AWB, REF Code hoặc khách hàng..."
                  size="lg"
                  startContent={<Search className="h-5 w-5 text-slate-400" />}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>

              {/* Table */}
              <Table
                removeWrapper
                aria-label="Bảng vận đơn"
                classNames={{
                  th: "bg-slate-100 text-slate-700 font-bold text-sm",
                  td: "py-5",
                }}
              >
                <TableHeader>
                  <TableColumn>MÃ VẬN ĐƠN</TableColumn>
                  <TableColumn>LOẠI</TableColumn>
                  <TableColumn>KHÁCH HÀNG</TableColumn>
                  <TableColumn>NGƯỜI GỬI → NHẬN</TableColumn>
                  <TableColumn className="text-right">TL (kg)</TableColumn>
                  <TableColumn className="text-right">SỐ KIỆN</TableColumn>
                  <TableColumn>DỊCH VỤ</TableColumn>
                  <TableColumn>TRẠNG THÁI</TableColumn>
                  <TableColumn className="text-center">THAO TÁC</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredAWBs.map((awb) => {
                    const TypeIcon = typeConfig[awb.type].icon;
                    const StatusIcon = statusConfig[awb.status].icon;

                    return (
                      <TableRow
                        key={awb.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-bold text-blue-600">
                              {awb.awbCode}
                            </p>
                            <p className="text-xs text-slate-500">
                              {awb.refCode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            className={`bg-gradient-to-r ${typeConfig[awb.type].color} text-white font-semibold`}
                            size="md"
                            startContent={<TypeIcon className="h-4 w-4" />}
                            variant="flat"
                          >
                            {typeConfig[awb.type].label}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {awb.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {awb.customerCode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <User className="h-3 w-3 text-green-600 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-medium text-slate-900">
                                  {awb.senderName}
                                </p>
                                <p className="text-slate-500">
                                  {awb.senderCity}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3 w-3 text-purple-600 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-medium text-slate-900">
                                  {awb.receiverName}
                                </p>
                                <p className="text-slate-500">
                                  {awb.receiverCity}, {awb.receiverCountry}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-slate-900">
                            {awb.weight}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-slate-900">
                            {awb.pieces}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-slate-700">
                            {awb.service}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={statusConfig[awb.status].color}
                            size="sm"
                            startContent={<StatusIcon className="h-3 w-3" />}
                            variant="flat"
                          >
                            {statusConfig[awb.status].label}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              isIconOnly
                              size="sm"
                              title="Xem chi tiết"
                              variant="light"
                              onPress={() => handleViewDetail(awb)}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              title="Chỉnh sửa"
                              variant="light"
                              onPress={() => handleEdit(awb)}
                            >
                              <Edit className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              title="Xóa"
                              variant="light"
                              onPress={() => handleDelete(awb)}
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
      {isFormOpen && (
        <AWBFormModal
          awb={awbToEdit}
          isOpen={isFormOpen}
          onClose={onFormClose}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={awbToDelete?.awbCode}
        message="Bạn có chắc chắn muốn xóa vận đơn này? Hành động này không thể hoàn tác."
        title="Xác nhận xóa vận đơn"
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
      {selectedAWB && (
        <Modal
          classNames={{
            ...withHighZIndex({
              base: "bg-white max-h-[85vh] overflow-hidden rounded-3xl shadow-xl",
              backdrop: "bg-slate-900/60 backdrop-blur-sm",
            }),
            body: "p-0",
          }}
          isOpen={isDetailOpen}
          scrollBehavior="inside"
          size="5xl"
          onClose={onDetailClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b-2 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${typeConfig[selectedAWB.type].color} text-white shadow-lg`}
                    >
                      <Plane className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Chi tiết Vận đơn {selectedAWB.awbCode}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {selectedAWB.refCode} •{" "}
                        {typeConfig[selectedAWB.type].label}
                      </p>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody className="bg-white px-6 py-6 max-h-[65vh] overflow-y-auto">
                  <div className="grid auto-rows-max gap-6 lg:grid-cols-2">
                    {/* AWB Info Section */}
                    <div className="lg:col-span-2 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-900">
                          Thông tin Vận đơn
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">Mã AWB</p>
                          <p className="font-bold text-blue-600 text-lg">
                            {selectedAWB.awbCode}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            REF Code
                          </p>
                          <p className="font-bold text-slate-900">
                            {selectedAWB.refCode}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Loại vận đơn
                          </p>
                          <Chip
                            className={`bg-gradient-to-r ${typeConfig[selectedAWB.type].color} text-white font-semibold`}
                            size="sm"
                            variant="flat"
                          >
                            {typeConfig[selectedAWB.type].label}
                          </Chip>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Trạng thái
                          </p>
                          <Chip
                            color={statusConfig[selectedAWB.status].color}
                            size="sm"
                            variant="flat"
                          >
                            {statusConfig[selectedAWB.status].label}
                          </Chip>
                        </div>
                      </div>
                      <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 mb-1">
                          Dịch vụ vận chuyển
                        </p>
                        <p className="font-semibold text-slate-900">
                          {selectedAWB.service}
                        </p>
                      </div>
                    </div>

                    {/* Sender Section */}
                    <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-900">
                          Thông tin Người gửi
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Tên người gửi
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.senderName}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">Công ty</p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.senderCompany}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.senderPhone}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Thành phố
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.senderCity}
                          </p>
                        </div>
                        <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Địa chỉ đầy đủ
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.senderAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Receiver Section */}
                    <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-purple-900">
                          Thông tin Người nhận
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Tên người nhận
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverName}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">Công ty</p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverCompany}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverPhone}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Quốc gia
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverCountry}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Thành phố
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverCity}
                          </p>
                        </div>
                        <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Địa chỉ đầy đủ
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.receiverAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cargo Section */}
                    <div className="lg:col-span-2 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Box className="h-5 w-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-orange-900">
                          Thông tin Hàng hóa
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-sm text-slate-600 mb-1">
                            Trọng lượng
                          </p>
                          <p className="font-bold text-2xl text-slate-900">
                            {selectedAWB.weight} kg
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-sm text-slate-600 mb-1">Dài</p>
                          <p className="font-bold text-2xl text-slate-900">
                            {selectedAWB.length || "-"} cm
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-sm text-slate-600 mb-1">Rộng</p>
                          <p className="font-bold text-2xl text-slate-900">
                            {selectedAWB.width || "-"} cm
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-sm text-slate-600 mb-1">Cao</p>
                          <p className="font-bold text-2xl text-slate-900">
                            {selectedAWB.height || "-"} cm
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-sm text-slate-600 mb-1">Số kiện</p>
                          <p className="font-bold text-2xl text-slate-900">
                            {selectedAWB.pieces}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Loại hàng
                          </p>
                          <p className="font-semibold text-slate-900">
                            {selectedAWB.cargoType}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600 mb-1">
                            Giá trị khai báo
                          </p>
                          <p className="font-semibold text-slate-900">
                            ${selectedAWB.declaredValue || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 mb-1">
                          Mô tả hàng hóa
                        </p>
                        <p className="font-semibold text-slate-900">
                          {selectedAWB.description}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="lg:col-span-2 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                          <Truck className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-indigo-900">
                            Hành trình vận chuyển
                          </h3>
                          <p className="text-sm text-indigo-700">
                            Theo dõi chi tiết từng bước xử lý
                          </p>
                        </div>
                      </div>

                      <div className="relative max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-30" />

                        {/* Timeline Items */}
                        <div className="space-y-3">
                          {[
                            {
                              step: 1,
                              title: "Tiếp nhận yêu cầu",
                              description: "NV Kinh doanh tiếp nhận đơn hàng",
                              staff: "Trần Thị B",
                              timestamp: "2024-10-28 09:30",
                              status: "completed",
                            },
                            {
                              step: 2,
                              title: "Nhận hàng tại khách",
                              description: "NV Pickup đã nhận hàng về kho",
                              staff: "Nguyễn Văn D",
                              timestamp: "2024-10-28 14:15",
                              status: "completed",
                            },
                            {
                              step: 3,
                              title: "Đóng gói & Kiểm đếm",
                              description: `Khai thác đã đóng gói, trọng lượng ${selectedAWB.weight}kg`,
                              staff: "Hoàng Văn F",
                              timestamp: "2024-10-29 10:20",
                              status: "completed",
                            },
                            {
                              step: 4,
                              title: "Nhập giá & Báo giá",
                              description:
                                "NV Kinh doanh đã gửi báo giá cho khách",
                              staff: "Trần Thị B",
                              timestamp: "2024-10-29 15:45",
                              status: "completed",
                            },
                            {
                              step: 5,
                              title: "Thanh toán",
                              description:
                                "Khách hàng đã thanh toán thành công",
                              timestamp: "2024-10-30 11:00",
                              status: "completed",
                            },
                            {
                              step: 6,
                              title: "Xử lý chứng từ",
                              description: "Đã gửi Bill cho khách hàng",
                              staff: "Phan Thị H",
                              timestamp: "2024-10-30 16:30",
                              status: "completed",
                            },
                            {
                              step: 7,
                              title:
                                selectedAWB.status === "delivered"
                                  ? "Đã giao hàng"
                                  : "Đang vận chuyển",
                              description:
                                selectedAWB.status === "delivered"
                                  ? "Giao hàng thành công"
                                  : "Hàng đang trên đường đến điểm đích",
                              timestamp:
                                selectedAWB.status === "delivered"
                                  ? "2024-11-01 14:00"
                                  : "2024-10-31 08:00",
                              status:
                                selectedAWB.status === "delivered"
                                  ? "completed"
                                  : "in_progress",
                            },
                          ].map((item, index) => {
                            const StatusIcon =
                              statusConfig[item.status]?.icon || Clock;
                            const isActive = item.status === "in_progress";

                            return (
                              <div
                                key={item.step}
                                className="relative flex gap-6"
                              >
                                {/* Icon */}
                                <div className="relative z-[1]">
                                  <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                      item.status === "completed"
                                        ? "bg-green-100 text-green-600 shadow-lg"
                                        : item.status === "in_progress"
                                          ? "bg-blue-100 text-blue-600 ring-4 ring-blue-500 ring-offset-2 animate-pulse shadow-lg"
                                          : "bg-slate-100 text-slate-400 shadow-lg"
                                    }`}
                                  >
                                    <StatusIcon className="h-6 w-6" />
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-4">
                                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <h5 className="text-base font-bold text-slate-900">
                                            {item.title}
                                          </h5>
                                          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                            Bước {item.step}
                                          </span>
                                        </div>
                                        <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                                          {item.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-500" />
                                            <span className="font-mono font-semibold">
                                              {item.timestamp}
                                            </span>
                                          </div>
                                          {item.staff && (
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-slate-500" />
                                              <span className="font-semibold">
                                                {item.staff}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="bg-slate-50 border-t-2 border-slate-200">
                  <Button variant="light" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button
                    color="primary"
                    startContent={<Edit className="h-4 w-4" />}
                    onPress={() => {
                      onDetailClose();
                      handleEdit(selectedAWB);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
