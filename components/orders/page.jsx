"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
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
  Filter,
  Download,
  Building2,
  Users,
  Handshake,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Edit,
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";

import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { withHighZIndex } from "@/components/common/modalClassNames";

// Mock data đại lý & đối tác
const mockPartnerData = [
  {
    id: "PARTNER001",
    code: "DL001",
    name: "Công ty TNHH ABC Logistics",
    type: "agency",
    category: "logistics",
    contactPerson: "Nguyễn Văn A",
    phone: "0901234567",
    email: "contact@abclogistics.vn",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    website: "https://abclogistics.vn",
    status: "active",
    joinDate: "2023-01-15",
    totalOrders: 1250,
    totalRevenue: 2500000000,
    rating: 4.8,
    services: ["Express Delivery", "Warehousing", "Customs Clearance"],
    description:
      "Đối tác logistics hàng đầu tại TP.HCM, chuyên cung cấp dịch vụ giao nhận nhanh chóng và an toàn.",
  },
  {
    id: "PARTNER002",
    code: "DT002",
    name: "FedEx Việt Nam",
    type: "partner",
    category: "shipping",
    contactPerson: "Trần Thị B",
    phone: "0902345678",
    email: "vietnam@fedex.com",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    website: "https://fedex.com/vn",
    status: "active",
    joinDate: "2022-06-20",
    totalOrders: 3200,
    totalRevenue: 8500000000,
    rating: 4.9,
    services: ["International Shipping", "Express Delivery", "Tracking"],
    description:
      "Đối tác chiến lược toàn cầu, cung cấp dịch vụ chuyển phát quốc tế chuyên nghiệp.",
  },
  {
    id: "PARTNER003",
    code: "DL003",
    name: "DHL Express Việt Nam",
    type: "partner",
    category: "shipping",
    contactPerson: "Lê Văn C",
    phone: "0903456789",
    email: "info@dhl.com.vn",
    address: "789 Hai Bà Trưng, Q.1, TP.HCM",
    website: "https://dhl.com.vn",
    status: "active",
    joinDate: "2022-03-10",
    totalOrders: 2800,
    totalRevenue: 7200000000,
    rating: 4.7,
    services: ["Express Delivery", "International Shipping", "Logistics"],
    description:
      "Đối tác logistics quốc tế với mạng lưới toàn cầu, đảm bảo giao hàng đúng hẹn.",
  },
  {
    id: "PARTNER004",
    code: "DT004",
    name: "Công ty CP Thương Mại Quốc Tế",
    type: "agency",
    category: "trading",
    contactPerson: "Phạm Thị D",
    phone: "0904567890",
    email: "sales@internationaltrading.vn",
    address: "321 Điện Biên Phủ, Q.3, TP.HCM",
    website: "https://internationaltrading.vn",
    status: "active",
    joinDate: "2023-08-25",
    totalOrders: 890,
    totalRevenue: 1800000000,
    rating: 4.5,
    services: ["Import/Export", "Customs Brokerage", "Documentation"],
    description:
      "Chuyên cung cấp dịch vụ thương mại quốc tế và thủ tục hải quan chuyên nghiệp.",
  },
  {
    id: "PARTNER005",
    code: "DL005",
    name: "UPS Việt Nam",
    type: "partner",
    category: "shipping",
    contactPerson: "Hoàng Văn E",
    phone: "0905678901",
    email: "vietnam@ups.com",
    address: "654 Trần Hưng Đạo, Q.5, TP.HCM",
    website: "https://ups.com/vn",
    status: "active",
    joinDate: "2022-11-12",
    totalOrders: 2100,
    totalRevenue: 5600000000,
    rating: 4.6,
    services: ["Package Delivery", "Freight Services", "Supply Chain"],
    description:
      "Đối tác chuyển phát toàn cầu với công nghệ theo dõi tiên tiến.",
  },
  {
    id: "PARTNER006",
    code: "DT006",
    name: "Công ty TNHH Vận Tải Minh Anh",
    type: "agency",
    category: "transportation",
    contactPerson: "Võ Thị F",
    phone: "0906789012",
    email: "info@minhanh.vn",
    address: "987 Nguyễn Thị Minh Khai, Q.3, TP.HCM",
    website: "https://minhanh.vn",
    status: "inactive",
    joinDate: "2021-05-18",
    totalOrders: 450,
    totalRevenue: 950000000,
    rating: 4.2,
    services: ["Local Delivery", "Warehousing", "Distribution"],
    description:
      "Dịch vụ vận tải nội địa với đội xe chuyên nghiệp và hiện đại.",
  },
];

const partnerTypeConfig = {
  agency: { label: "Đại lý", color: "primary", icon: Building2 },
  partner: { label: "Đối tác", color: "secondary", icon: Handshake },
};

const categoryConfig = {
  logistics: { label: "Logistics", color: "blue" },
  shipping: { label: "Vận chuyển", color: "green" },
  trading: { label: "Thương mại", color: "purple" },
  transportation: { label: "Vận tải", color: "orange" },
};

const statusConfig = {
  active: { label: "Đang hợp tác", color: "success", icon: CheckCircle2 },
  inactive: { label: "Tạm ngừng", color: "warning", icon: Clock },
  terminated: { label: "Đã chấm dứt", color: "danger", icon: AlertCircle },
};

export default function DebtPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partners, setPartners] = useState(mockPartnerData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  // Advanced filter states
  const [filterForm, setFilterForm] = useState({
    minRevenue: "",
    maxRevenue: "",
    minRating: "",
    maxRating: "",
    startDate: "",
    endDate: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Add partner form state
  const [partnerForm, setPartnerForm] = useState({
    code: "",
    name: "",
    type: "",
    category: "",
    contactName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  });
  const [partnerErrors, setPartnerErrors] = useState({});

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || partner.status === selectedStatus;

      // Advanced filters
      if (
        filterForm.minRevenue &&
        partner.totalRevenue < parseInt(filterForm.minRevenue)
      )
        return false;
      if (
        filterForm.maxRevenue &&
        partner.totalRevenue > parseInt(filterForm.maxRevenue)
      )
        return false;
      if (
        filterForm.minRating &&
        partner.rating < parseFloat(filterForm.minRating)
      )
        return false;
      if (
        filterForm.maxRating &&
        partner.rating > parseFloat(filterForm.maxRating)
      )
        return false;
      if (
        filterForm.startDate &&
        new Date(partner.joinDate) < new Date(filterForm.startDate)
      )
        return false;
      if (
        filterForm.endDate &&
        new Date(partner.joinDate) > new Date(filterForm.endDate)
      )
        return false;

      return matchesSearch && matchesStatus;
    });
  }, [partners, searchQuery, selectedStatus, filterForm]);

  const stats = useMemo(() => {
    const totalRevenue = partners.reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalOrders = partners.reduce((sum, p) => sum + p.totalOrders, 0);
    const avgRating =
      partners.reduce((sum, p) => sum + p.rating, 0) / partners.length;

    return {
      totalRevenue,
      totalOrders,
      avgRating: avgRating.toFixed(1),
      active: partners.filter((p) => p.status === "active").length,
      inactive: partners.filter((p) => p.status === "inactive").length,
      agencies: partners.filter((p) => p.type === "agency").length,
      partners: partners.filter((p) => p.type === "partner").length,
    };
  }, [partners]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleViewDetail = (partner) => {
    setSelectedPartner(partner);
    onOpen();
  };

  const handleAddPartner = () => {
    onAddOpen();
  };

  const handleApplyFilter = () => {
    const filters = [];

    if (filterForm.minRevenue)
      filters.push(
        `Doanh thu tối thiểu: ${formatCurrency(parseInt(filterForm.minRevenue))}`,
      );
    if (filterForm.maxRevenue)
      filters.push(
        `Doanh thu tối đa: ${formatCurrency(parseInt(filterForm.maxRevenue))}`,
      );
    if (filterForm.minRating)
      filters.push(`Đánh giá tối thiểu: ${filterForm.minRating} sao`);
    if (filterForm.maxRating)
      filters.push(`Đánh giá tối đa: ${filterForm.maxRating} sao`);
    if (filterForm.startDate)
      filters.push(
        `Từ ngày: ${new Date(filterForm.startDate).toLocaleDateString("vi-VN")}`,
      );
    if (filterForm.endDate)
      filters.push(
        `Đến ngày: ${new Date(filterForm.endDate).toLocaleDateString("vi-VN")}`,
      );

    setActiveFilters(filters);
    onFilterClose();
    showSuccessToast(`Đã áp dụng ${filters.length} bộ lọc`);
  };

  const handleClearFilter = () => {
    setFilterForm({
      minRevenue: "",
      maxRevenue: "",
      minRating: "",
      maxRating: "",
      startDate: "",
      endDate: "",
    });
    setActiveFilters([]);
    showSuccessToast("Đã xóa tất cả bộ lọc");
  };

  const handleExport = () => {
    try {
      // Prepare data for export
      const exportData = filteredPartners.map((partner) => ({
        "Mã đối tác": partner.code,
        "Tên đối tác": partner.name,
        Loại: partnerTypeConfig[partner.type].label,
        "Lĩnh vực": categoryConfig[partner.category].label,
        "Người liên hệ": partner.contactPerson,
        Email: partner.email,
        "Điện thoại": partner.phone,
        "Tổng đơn hàng": partner.totalOrders,
        "Tổng doanh thu": partner.totalRevenue,
        "Đánh giá": partner.rating,
        "Ngày tham gia": partner.joinDate,
        "Trạng thái": statusConfig[partner.status].label,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Đối tác");

      const fileName = `DoiTac_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(wb, fileName);

      showSuccessToast(`Đã xuất ${filteredPartners.length} bản ghi`);
    } catch (error) {
      showErrorToast("Không thể xuất file. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
                <Handshake className="h-4 w-4" />
                Quản lý mạng lưới đối tác và đại lý phân phối
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                startContent={<Plus className="h-4 w-4" />}
                onPress={handleAddPartner}
              >
                Thêm đối tác
              </Button>
              <Button
                startContent={<Filter className="h-4 w-4" />}
                variant="bordered"
                onPress={onFilterOpen}
              >
                Lọc nâng cao{" "}
                {activeFilters.length > 0 && `(${activeFilters.length})`}
              </Button>
              <Button
                className="rounded-xl bg-green-100 font-semibold text-green-700 hover:bg-green-200 shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
                startContent={<Download className="h-5 w-5" />}
                onPress={handleExport}
              >
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 relative">
        <Card className="rounded-2xl bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng doanh thu</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng đơn hàng</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đánh giá trung bình</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.avgRating} ⭐
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đang hợp tác</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-3">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="px-6 pb-4">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-4 border-2 border-blue-100">
            <span className="text-sm font-semibold text-blue-900">
              Bộ lọc đang áp dụng:
            </span>
            {activeFilters.map((filter, idx) => (
              <Chip
                key={idx}
                color="primary"
                size="sm"
                variant="flat"
                onClose={() => {
                  const newFilters = activeFilters.filter((_, i) => i !== idx);

                  setActiveFilters(newFilters);
                }}
              >
                {filter}
              </Chip>
            ))}
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={handleClearFilter}
            >
              Xóa tất cả
            </Button>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-xl border-2 border-slate-100">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button
                className={`h-auto px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedStatus === "all"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg"
                }`}
                onPress={() => setSelectedStatus("all")}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-bold">Tất cả</span>
                  <span
                    className={`text-lg font-black ${selectedStatus === "all" ? "text-white" : "text-slate-900"}`}
                  >
                    {partners.length}
                  </span>
                </div>
              </Button>
              <Button
                className={`h-auto px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedStatus === "active"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 shadow-md hover:shadow-lg border border-emerald-200"
                }`}
                onPress={() => setSelectedStatus("active")}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-bold">Đang hợp tác</span>
                  <span
                    className={`text-lg font-black ${selectedStatus === "active" ? "text-white" : "text-emerald-800"}`}
                  >
                    {stats.active}
                  </span>
                </div>
              </Button>
              <Button
                className={`h-auto px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedStatus === "inactive"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 shadow-md hover:shadow-lg border border-amber-200"
                }`}
                onPress={() => setSelectedStatus("inactive")}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-bold">Tạm ngừng</span>
                  <span
                    className={`text-lg font-black ${selectedStatus === "inactive" ? "text-white" : "text-amber-800"}`}
                  >
                    {stats.inactive}
                  </span>
                </div>
              </Button>
            </div>

            <Input
              className="w-64"
              classNames={{
                inputWrapper:
                  "border-2 border-slate-200 hover:border-blue-400 rounded-xl",
              }}
              placeholder="Tìm kiếm đối tác..."
              size="lg"
              startContent={<Search className="h-5 w-5 text-slate-400" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="flex-1 overflow-auto px-6 pb-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => {
            const TypeIcon = partnerTypeConfig[partner.type].icon;
            const StatusIcon = statusConfig[partner.status].icon;

            return (
              <Card
                key={partner.id}
                className="bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onPress={() => handleViewDetail(partner)}
              >
                <CardBody className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${partnerTypeConfig[partner.type].color === "primary" ? "from-blue-500 to-indigo-600" : "from-purple-500 to-pink-600"} text-white shadow-lg`}
                      >
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <Chip
                          className={`bg-gradient-to-r ${categoryConfig[partner.category].color === "blue" ? "from-blue-500 to-indigo-600" : categoryConfig[partner.category].color === "green" ? "from-green-500 to-emerald-600" : categoryConfig[partner.category].color === "purple" ? "from-purple-500 to-pink-600" : "from-orange-500 to-amber-600"} text-white font-semibold`}
                          size="sm"
                          variant="flat"
                        >
                          {categoryConfig[partner.category].label}
                        </Chip>
                        <p className="text-xs text-slate-500 mt-1">
                          {partnerTypeConfig[partner.type].label}
                        </p>
                      </div>
                    </div>
                    <Chip
                      color={statusConfig[partner.status].color}
                      size="sm"
                      startContent={<StatusIcon className="h-3 w-3" />}
                      variant="flat"
                    >
                      {statusConfig[partner.status].label}
                    </Chip>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {partner.name}
                      </h3>
                      <p className="text-sm font-semibold text-blue-600">
                        {partner.code}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">
                          {partner.contactPerson}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{partner.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{partner.address}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {partner.totalOrders}
                        </p>
                        <p className="text-xs text-slate-500">Đơn hàng</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <p className="text-2xl font-bold text-slate-900">
                            {partner.rating}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">Đánh giá</p>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Doanh thu
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(partner.totalRevenue)}
                        </span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">
                        Dịch vụ cung cấp:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {partner.services.slice(0, 2).map((service, idx) => (
                          <Chip
                            key={idx}
                            className="text-xs bg-slate-100 text-slate-700"
                            size="sm"
                            variant="flat"
                          >
                            {service}
                          </Chip>
                        ))}
                        {partner.services.length > 2 && (
                          <Chip
                            className="text-xs bg-slate-100 text-slate-700"
                            size="sm"
                            variant="flat"
                          >
                            +{partner.services.length - 2}
                          </Chip>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        classNames={withHighZIndex()}
        isOpen={isOpen}
        size="4xl"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Chi tiết đối tác</h3>
                {selectedPartner && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-slate-500">
                      {selectedPartner.code}
                    </span>
                    <span className="text-sm font-normal text-slate-500">
                      -
                    </span>
                    <span className="text-sm font-normal text-slate-500">
                      {selectedPartner.name}
                    </span>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                {selectedPartner && (
                  <div className="space-y-6">
                    {/* Partner Info */}
                    <div className="rounded-lg bg-slate-50 p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${partnerTypeConfig[selectedPartner.type].color === "primary" ? "from-blue-500 to-indigo-600" : "from-purple-500 to-pink-600"} text-white shadow-lg`}
                        >
                          {React.createElement(
                            partnerTypeConfig[selectedPartner.type].icon,
                            { className: "h-8 w-8" },
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-900 mb-2">
                            {selectedPartner.name}
                          </h4>
                          <div className="flex items-center gap-4 mb-3">
                            <Chip
                              className={`bg-gradient-to-r ${categoryConfig[selectedPartner.category].color === "blue" ? "from-blue-500 to-indigo-600" : categoryConfig[selectedPartner.category].color === "green" ? "from-green-500 to-emerald-600" : categoryConfig[selectedPartner.category].color === "purple" ? "from-purple-500 to-pink-600" : "from-orange-500 to-amber-600"} text-white font-semibold`}
                              size="sm"
                              variant="flat"
                            >
                              {categoryConfig[selectedPartner.category].label}
                            </Chip>
                            <Chip
                              color={statusConfig[selectedPartner.status].color}
                              size="sm"
                              variant="flat"
                            >
                              {statusConfig[selectedPartner.status].label}
                            </Chip>
                          </div>
                          <p className="text-slate-600">
                            {selectedPartner.description}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">
                                Người liên hệ
                              </p>
                              <p className="font-semibold text-slate-900">
                                {selectedPartner.contactPerson}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">
                                Điện thoại
                              </p>
                              <p className="font-semibold text-slate-900">
                                {selectedPartner.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">Email</p>
                              <p className="font-semibold text-slate-900">
                                {selectedPartner.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">Website</p>
                              <p className="font-semibold text-slate-900">
                                {selectedPartner.website}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-slate-400" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-500">Địa chỉ</p>
                            <p className="font-semibold text-slate-900">
                              {selectedPartner.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <CardBody className="p-4 text-center">
                          <p className="text-3xl font-bold text-blue-600 mb-1">
                            {selectedPartner.totalOrders}
                          </p>
                          <p className="text-sm text-slate-600">
                            Tổng đơn hàng
                          </p>
                        </CardBody>
                      </Card>
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                        <CardBody className="p-4 text-center">
                          <p className="text-3xl font-bold text-green-600 mb-1">
                            {formatCurrency(selectedPartner.totalRevenue)}
                          </p>
                          <p className="text-sm text-slate-600">
                            Tổng doanh thu
                          </p>
                        </CardBody>
                      </Card>
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                        <CardBody className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-6 w-6 text-amber-500 fill-current" />
                            <p className="text-3xl font-bold text-amber-600">
                              {selectedPartner.rating}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600">Đánh giá</p>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Services */}
                    <div className="rounded-lg bg-white border-2 border-slate-200 p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">
                        Dịch vụ cung cấp
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedPartner.services.map((service, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-slate-700 font-medium">
                              {service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="rounded-lg bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">
                            Ngày tham gia
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {new Date(
                              selectedPartner.joinDate,
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Mã đối tác</p>
                          <p className="text-lg font-bold text-blue-600">
                            {selectedPartner.code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  startContent={<Edit className="h-4 w-4" />}
                >
                  Chỉnh sửa
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Partner Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            role="presentation"
            tabIndex={-1}
            onClick={onAddClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onAddClose();
              }
            }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Thêm đối tác mới
                  </h2>
                  <p className="text-sm text-slate-600">
                    Nhập thông tin đối tác vận chuyển
                  </p>
                </div>
              </div>
              <button
                aria-label="Đóng modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={onAddClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">
                      Thông tin cơ bản
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.code}
                      isInvalid={!!partnerErrors.code}
                      label="Mã đối tác"
                      placeholder="VD: DL001"
                      value={partnerForm.code}
                      onValueChange={(value) => {
                        setPartnerForm({ ...partnerForm, code: value });
                        if (partnerErrors.code) {
                          setPartnerErrors({ ...partnerErrors, code: "" });
                        }
                      }}
                    />
                    <Input
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.name}
                      isInvalid={!!partnerErrors.name}
                      label="Tên đối tác"
                      placeholder="Ví dụ: Công ty TNHH ABC Logistics"
                      value={partnerForm.name}
                      onValueChange={(value) => {
                        setPartnerForm({ ...partnerForm, name: value });
                        if (partnerErrors.name) {
                          setPartnerErrors({ ...partnerErrors, name: "" });
                        }
                      }}
                    />
                    <Select
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        trigger: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.type}
                      isInvalid={!!partnerErrors.type}
                      label="Loại đối tác"
                      placeholder="Chọn loại đối tác"
                      selectedKeys={partnerForm.type ? [partnerForm.type] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setPartnerForm({ ...partnerForm, type: selected });
                        if (partnerErrors.type) {
                          setPartnerErrors({ ...partnerErrors, type: "" });
                        }
                      }}
                    >
                      <SelectItem key="agency" value="agency">
                        Đại lý
                      </SelectItem>
                      <SelectItem key="partner" value="partner">
                        Đối tác
                      </SelectItem>
                    </Select>
                    <Select
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        trigger: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.category}
                      isInvalid={!!partnerErrors.category}
                      label="Lĩnh vực"
                      placeholder="Chọn lĩnh vực"
                      selectedKeys={partnerForm.category ? [partnerForm.category] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setPartnerForm({ ...partnerForm, category: selected });
                        if (partnerErrors.category) {
                          setPartnerErrors({ ...partnerErrors, category: "" });
                        }
                      }}
                    >
                      <SelectItem key="logistics" value="logistics">
                        Logistics
                      </SelectItem>
                      <SelectItem key="shipping" value="shipping">
                        Vận chuyển
                      </SelectItem>
                      <SelectItem key="trading" value="trading">
                        Thương mại
                      </SelectItem>
                      <SelectItem key="transportation" value="transportation">
                        Vận tải
                      </SelectItem>
                    </Select>
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
                    <Input
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.contactName}
                      isInvalid={!!partnerErrors.contactName}
                      label="Tên liên hệ"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={partnerForm.contactName}
                      onValueChange={(value) => {
                        setPartnerForm({ ...partnerForm, contactName: value });
                        if (partnerErrors.contactName) {
                          setPartnerErrors({ ...partnerErrors, contactName: "" });
                        }
                      }}
                    />
                    <Input
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      errorMessage={partnerErrors.phone}
                      isInvalid={!!partnerErrors.phone}
                      label="Số điện thoại"
                      placeholder="Ví dụ: (028) 1234 5678"
                      startContent={<Phone className="h-4 w-4 text-slate-400" />}
                      value={partnerForm.phone}
                      onValueChange={(value) => {
                        setPartnerForm({ ...partnerForm, phone: value });
                        if (partnerErrors.phone) {
                          setPartnerErrors({ ...partnerErrors, phone: "" });
                        }
                      }}
                    />
                    <div className="md:col-span-2">
                      <Input
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                          input: "placeholder:text-slate-400",
                          inputWrapper: "border border-slate-300 bg-white",
                        }}
                        errorMessage={partnerErrors.email}
                        isInvalid={!!partnerErrors.email}
                        label="Email"
                        placeholder="VD: contact@partner.com"
                        startContent={<Mail className="h-4 w-4 text-slate-400" />}
                        type="email"
                        value={partnerForm.email}
                        onValueChange={(value) => {
                          setPartnerForm({ ...partnerForm, email: value });
                          if (partnerErrors.email) {
                            setPartnerErrors({ ...partnerErrors, email: "" });
                          }
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                          input: "placeholder:text-slate-400",
                          inputWrapper: "border border-slate-300 bg-white",
                        }}
                        label="Website"
                        placeholder="Ví dụ: https://partner.com"
                        startContent={<Globe className="h-4 w-4 text-slate-400" />}
                        type="url"
                        value={partnerForm.website}
                        onValueChange={(value) => {
                          setPartnerForm({ ...partnerForm, website: value });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                          input: "placeholder:text-slate-400",
                          inputWrapper: "border border-slate-300 bg-white",
                        }}
                        errorMessage={partnerErrors.address}
                        isInvalid={!!partnerErrors.address}
                        label="Địa chỉ"
                        placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
                        startContent={<MapPin className="h-4 w-4 text-slate-400" />}
                        value={partnerForm.address}
                        onValueChange={(value) => {
                          setPartnerForm({ ...partnerForm, address: value });
                          if (partnerErrors.address) {
                            setPartnerErrors({ ...partnerErrors, address: "" });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center py-2">
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    Tính năng đang trong giai đoạn phát triển
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-slate-200 bg-white">
              <button
                className="px-8 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                type="button"
                onClick={onAddClose}
              >
                Hủy
              </button>
              <button
                className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                type="button"
                onClick={onAddClose}
              >
                <Plus className="w-5 h-5" />
                Thêm đối tác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        classNames={withHighZIndex()}
        isOpen={isFilterOpen}
        size="2xl"
        onClose={onFilterClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span>Lọc nâng cao</span>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Doanh thu */}
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Khoảng doanh thu
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Tối thiểu (VND)"
                        placeholder="0"
                        startContent={
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        }
                        type="number"
                        value={filterForm.minRevenue}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, minRevenue: value })
                        }
                      />
                      <Input
                        label="Tối đa (VND)"
                        placeholder="Không giới hạn"
                        startContent={
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        }
                        type="number"
                        value={filterForm.maxRevenue}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, maxRevenue: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Đánh giá */}
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Khoảng đánh giá
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Tối thiểu (sao)"
                        max="5"
                        min="0"
                        placeholder="0"
                        startContent={
                          <Star className="h-4 w-4 text-slate-400" />
                        }
                        step="0.1"
                        type="number"
                        value={filterForm.minRating}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, minRating: value })
                        }
                      />
                      <Input
                        label="Tối đa (sao)"
                        max="5"
                        min="0"
                        placeholder="5"
                        startContent={
                          <Star className="h-4 w-4 text-slate-400" />
                        }
                        step="0.1"
                        type="number"
                        value={filterForm.maxRating}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, maxRating: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Thời gian */}
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Ngày tham gia
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Từ ngày"
                        startContent={
                          <Calendar className="h-4 w-4 text-slate-400" />
                        }
                        type="date"
                        value={filterForm.startDate}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, startDate: value })
                        }
                      />
                      <Input
                        label="Đến ngày"
                        startContent={
                          <Calendar className="h-4 w-4 text-slate-400" />
                        }
                        type="date"
                        value={filterForm.endDate}
                        onValueChange={(value) =>
                          setFilterForm({ ...filterForm, endDate: value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={handleClearFilter}>
                  Xóa bộ lọc
                </Button>
                <Button variant="bordered" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" onPress={handleApplyFilter}>
                  Áp dụng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
