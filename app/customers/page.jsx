"use client";

import { useState, useMemo } from "react";
import { useDisclosure } from "@heroui/modal";
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
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Phone,
  Mail,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Users,
} from "lucide-react";

import CustomerFormModal from "@/components/customers/CustomerFormModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { exportToExcel } from "@/lib/export";
import { showSuccess, showInfo } from "@/lib/toast";

// Mock data
const mockCustomers = [
  {
    id: "KH001",
    code: "KH001",
    name: "Công ty TNHH ABC Import",
    type: "enterprise",
    contact: "Nguyễn Văn A",
    phone: "0901234567",
    email: "contact@abcimport.com",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    salesPerson: "Trần Thị B",
    totalOrders: 45,
    totalRevenue: 125000000,
    debt: 0,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "KH002",
    code: "KH002",
    name: "Lê Minh Tuấn",
    type: "individual",
    contact: "Lê Minh Tuấn",
    phone: "0912345678",
    email: "leminhthuan@gmail.com",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    salesPerson: "Phạm Văn C",
    totalOrders: 12,
    totalRevenue: 15000000,
    debt: 2500000,
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "KH003",
    code: "KH003",
    name: "Công ty CP XNK Hồng Hà",
    type: "enterprise",
    contact: "Trần Văn D",
    phone: "0923456789",
    email: "info@honghaimex.vn",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    salesPerson: "Trần Thị B",
    totalOrders: 67,
    totalRevenue: 289000000,
    debt: 15000000,
    status: "active",
    createdAt: "2023-11-05",
  },
  {
    id: "KH004",
    code: "KH004",
    name: "Shop Thời Trang Nam",
    type: "business",
    contact: "Hoàng Thị E",
    phone: "0934567890",
    email: "shopnamfashion@gmail.com",
    address: "321 Phan Xích Long, Phú Nhuận, TP.HCM",
    salesPerson: "Phạm Văn C",
    totalOrders: 28,
    totalRevenue: 42000000,
    debt: 5000000,
    status: "active",
    createdAt: "2024-03-10",
  },
];

const customerTypes = {
  enterprise: {
    label: "Doanh nghiệp",
    color: "primary",
    gradient: "from-blue-500 to-cyan-500",
  },
  business: {
    label: "Hộ kinh doanh",
    color: "secondary",
    gradient: "from-purple-500 to-pink-500",
  },
  individual: {
    label: "Cá nhân",
    color: "default",
    gradient: "from-slate-500 to-slate-600",
  },
};

const statusConfig = {
  active: { label: "Hoạt động", color: "success" },
  inactive: { label: "Ngưng hoạt động", color: "danger" },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState(mockCustomers);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "individual",
    contact: "",
    phone: "",
    email: "",
    address: "",
    salesPerson: "Trần Thị B",
    status: "active",
  });

  const formModal = useDisclosure();
  const deleteModal = useDisclosure();
  const filterModal = useDisclosure();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "all" || customer.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, selectedType]);

  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalRevenue, 0);
    const totalDebt = customers.reduce((acc, c) => acc + c.debt, 0);
    const totalOrders = customers.reduce((acc, c) => acc + c.totalOrders, 0);

    return {
      total: customers.length,
      enterprise: customers.filter((c) => c.type === "enterprise").length,
      business: customers.filter((c) => c.type === "business").length,
      individual: customers.filter((c) => c.type === "individual").length,
      active: customers.filter((c) => c.status === "active").length,
      totalRevenue,
      totalDebt,
      totalOrders,
    };
  }, [customers]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "individual",
      contact: "",
      phone: "",
      email: "",
      address: "",
      salesPerson: "Trần Thị B",
      status: "active",
    });
    setCustomerToEdit(null);
  };

  const handleAdd = () => {
    resetForm();
    formModal.onOpen();
  };

  const handleEdit = (customer) => {
    setCustomerToEdit(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      type: customer.type,
      contact: customer.contact,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      salesPerson: customer.salesPerson,
      status: customer.status,
    });
    formModal.onOpen();
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.phone) {
      showInfo("Vui lòng nhập đầy đủ thông tin bắt buộc!");

      return;
    }

    if (customerToEdit) {
      // Edit existing
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerToEdit.id
            ? {
                ...customerToEdit,
                ...formData,
              }
            : c,
        ),
      );
      showSuccess(`Đã cập nhật khách hàng ${formData.name}`);
    } else {
      // Add new
      const newCustomer = {
        id: `KH${String(customers.length + 1).padStart(3, "0")}`,
        code:
          formData.code || `KH${String(customers.length + 1).padStart(3, "0")}`,
        ...formData,
        totalOrders: 0,
        totalRevenue: 0,
        debt: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setCustomers((prev) => [newCustomer, ...prev]);
      showSuccess(`Đã thêm khách hàng ${formData.name}`);
    }

    formModal.onClose();
    resetForm();
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    deleteModal.onOpen();
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      showSuccess(`Đã xóa khách hàng ${customerToDelete.name}`);
      setCustomerToDelete(null);
      deleteModal.onClose();
    }
  };

  const handleExport = () => {
    const exportData = filteredCustomers.map((c) => ({
      "Mã KH": c.code,
      "Tên khách hàng": c.name,
      "Loại KH": customerTypes[c.type].label,
      "Người liên hệ": c.contact,
      "Số điện thoại": c.phone,
      Email: c.email,
      "Địa chỉ": c.address,
      "NV phụ trách": c.salesPerson,
      "Số đơn hàng": c.totalOrders,
      "Doanh số": c.totalRevenue,
      "Công nợ": c.debt,
      "Trạng thái": statusConfig[c.status].label,
      "Ngày tạo": c.createdAt,
    }));

    exportToExcel(exportData, "danh_sach_khach_hang");
    showSuccess("Đã xuất dữ liệu thành công!");
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
                Quản lý Khách hàng
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Quản lý thông tin khách hàng và theo dõi lịch sử giao dịch
              </p>
            </div>
            <Button
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              size="lg"
              startContent={
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              }
              onPress={handleAdd}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              Thêm khách hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 relative">
        {[
          {
            label: "Tổng khách hàng",
            value: stats.total,
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
            accent: "from-blue-500 to-cyan-500",
          },
          {
            label: "Tổng doanh số",
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            gradient: "from-emerald-500 to-green-500",
            accent: "from-emerald-500 to-green-500",
          },
          {
            label: "Tổng đơn hàng",
            value: stats.totalOrders,
            icon: ShoppingCart,
            gradient: "from-purple-500 to-pink-500",
            accent: "from-purple-500 to-pink-500",
          },
          {
            label: "Công nợ",
            value: formatCurrency(stats.totalDebt),
            icon: AlertCircle,
            gradient: "from-amber-500 to-orange-500",
            accent: "from-amber-500 to-orange-500",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <Card
              key={idx}
              className="group relative overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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

      {/* Filters & Search */}
      <div className="px-6 pb-4 relative">
        <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardBody className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Tất cả", count: stats.total },
                  {
                    key: "enterprise",
                    label: "Doanh nghiệp",
                    count: stats.enterprise,
                  },
                  { key: "business", label: "Hộ KD", count: stats.business },
                  {
                    key: "individual",
                    label: "Cá nhân",
                    count: stats.individual,
                  },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    className={`rounded-full font-bold transition-all duration-300 ${
                      selectedType === filter.key
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    size="sm"
                    onPress={() => setSelectedType(filter.key)}
                  >
                    {filter.label} ({filter.count})
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative group">
                  <Input
                    className="w-72"
                    classNames={{
                      inputWrapper:
                        "border-slate-300 group-data-[focus=true]:border-blue-500",
                    }}
                    placeholder="Tìm kiếm khách hàng..."
                    size="sm"
                    startContent={<Search className="h-4 w-4 text-slate-400" />}
                    value={searchQuery}
                    variant="bordered"
                    onValueChange={setSearchQuery}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-xl opacity-50" />
                  <Button
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                    size="sm"
                    startContent={
                      <Filter className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    }
                    onPress={filterModal.onOpen}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    Lọc nâng cao
                  </Button>
                </div>
                <Button
                  className="rounded-xl bg-green-100 font-semibold text-green-700 hover:bg-green-200"
                  size="sm"
                  startContent={<Download className="h-4 w-4" />}
                  onPress={handleExport}
                >
                  Xuất Excel
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6 relative">
        <Card className="border border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
          <Table
            removeWrapper
            aria-label="Bảng danh sách khách hàng"
            classNames={{
              th: "bg-slate-50 text-slate-600 font-semibold",
              td: "py-4",
            }}
          >
            <TableHeader>
              <TableColumn>MÃ KH</TableColumn>
              <TableColumn>TÊN KHÁCH HÀNG</TableColumn>
              <TableColumn>LOẠI KH</TableColumn>
              <TableColumn>LIÊN HỆ</TableColumn>
              <TableColumn>NV KINH DOANH</TableColumn>
              <TableColumn className="text-right">SỐ ĐH</TableColumn>
              <TableColumn className="text-right">DOANH SỐ</TableColumn>
              <TableColumn className="text-right">CÔNG NỢ</TableColumn>
              <TableColumn>TRẠNG THÁI</TableColumn>
              <TableColumn>THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="bg-slate-50/30 hover:bg-slate-50"
                >
                  <TableCell>
                    <span className="font-semibold text-blue-600">
                      {customer.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {customer.contact}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="font-semibold"
                      color={customerTypes[customer.type].color}
                      size="sm"
                      variant="flat"
                    >
                      {customerTypes[customer.type].label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                          <Phone className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-green-800">
                          {customer.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                          <Mail className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-blue-800">
                          {customer.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">
                      {customer.salesPerson}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-slate-900">
                      {customer.totalOrders}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(customer.totalRevenue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${
                        customer.debt > 0 ? "text-red-600" : "text-slate-400"
                      }`}
                    >
                      {formatCurrency(customer.debt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="font-semibold"
                      color={statusConfig[customer.status].color}
                      size="sm"
                      variant="flat"
                    >
                      {statusConfig[customer.status].label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        className="hover:bg-slate-100"
                        size="sm"
                        title="Chỉnh sửa"
                        variant="light"
                        onPress={() => handleEdit(customer)}
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        isIconOnly
                        className="hover:bg-red-100"
                        size="sm"
                        title="Xóa"
                        variant="light"
                        onPress={() => handleDelete(customer)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        customer={customerToEdit}
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.onClose();
          resetForm();
        }}
        onSave={(customerData) => {
          if (customerToEdit) {
            // Edit existing
            setCustomers((prev) =>
              prev.map((c) => (c.id === customerToEdit.id ? customerData : c)),
            );
            showSuccess(`Đã cập nhật khách hàng ${customerData.name}`);
          } else {
            // Add new
            setCustomers((prev) => [customerData, ...prev]);
            showSuccess(`Đã thêm khách hàng ${customerData.name}`);
          }
          formModal.onClose();
          setCustomerToEdit(null);
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={customerToDelete?.name}
        message="Bạn có chắc chắn muốn xóa khách hàng này? Tất cả dữ liệu liên quan sẽ bị mất."
        title="Xác nhận xóa khách hàng"
        onClose={deleteModal.onClose}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
