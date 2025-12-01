"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  Loader2,
  X,
  Trash2,
  Save,
  MessageSquare,
  UserSquare2,
  ListOrdered,
  SquareArrowOutUpRight,
  Eraser,
} from "lucide-react";

import { useLayoutStore } from "@/store/useLayoutStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ordersCRUD } from "@/hooks";
import { showInfo, showSuccess } from "@/lib/toast";
import OverlayModal from "@/components/common/OverlayModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { exportToExcel, formatOrdersForExport } from "@/lib/export";
import {
  USER_ROLES,
  WORKFLOW_STEPS,
  filterDataByRole,
  calculateCommission,
  canAdvanceWorkflow
} from "@/lib/auth";

const quickActions = [
  { icon: X, label: "Hủy", id: "cancel" },
  { icon: Trash2, label: "Xóa", id: "delete" },
  { icon: Save, label: "Lưu", id: "save" },
  { icon: Download, label: "Tải xuống", id: "download" },
  { icon: MessageSquare, label: "Nhắn tin", id: "message" },
  { icon: UserSquare2, label: "Khách hàng", id: "user" },
  { icon: ListOrdered, label: "Danh sách", id: "list" },
  { icon: SquareArrowOutUpRight, label: "Xuất", id: "export" },
  { icon: Eraser, label: "Dọn dẹp", id: "clean" },
];

const statusTokens = {
  new: {
    base: "border-[#a4c4ff] bg-[#e4efff] text-[#0f3aa6]",
    dot: "bg-[#2563eb]",
  },
  confirmed: {
    base: "border-[#96cdfc] bg-[#e1f3ff] text-[#0c4a6e]",
    dot: "bg-[#0ea5e9]",
  },
  processing: {
    base: "border-[#b4c2ff] bg-[#e9ecff] text-[#1c2d8f]",
    dot: "bg-[#3b82f6]",
  },
  delivering: {
    base: "border-[#f3d688] bg-[#fff3cf] text-[#b8580d]",
    dot: "bg-[#f59e0b]",
  },
  docked: {
    base: "border-[#9de0b8] bg-[#e8f9ef] text-[#147d3f]",
    dot: "bg-[#22c55e]",
  },
  completed: {
    base: "border-[#9ddbb7] bg-[#e6f9ed] text-[#0f6848]",
    dot: "bg-[#16a34a]",
  },
  default: {
    base: "border-[#dbe2ff] bg-[#f5f7ff] text-[#4b587a]",
    dot: "bg-[#94a3b8]",
  },
};

const statusMap = {
  all: "Tất cả",
  ready: "Ready",
  incoming: "Nhận hàng",
  "ready-to-go": "Ready to go",
  delivering: "Đang phát hàng",
  cancelled: "Hủy",
  returning: "Đang chuyển hoàn",
  issue: "Sự cố",
  completed: "Hoàn tất",
};

const statusChipClassNames = (tone) => ({
  base: `rounded-full border ${statusTokens[tone]?.base ?? statusTokens.default.base} px-2.5 py-1`,
  content: "text-xs font-semibold",
});



export default function OrdersPage() {
  const router = useRouter();

  const {
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedOrders,
    selectAllOrders,
    clearOrderSelection,
    pageSize,
    sortField,
    sortDirection,
  } = useLayoutStore();

  const { currentUser, hasPermission, canPerformAction } = useAuthStore();

  const [page, setPage] = useState(1);
  const [extraOrders, setExtraOrders] = useState([]);
  const [workflowModal, setWorkflowModal] = useState({ isOpen: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orders: [] });
  const [bulkActionLoading, setBulkActionLoading] = useState(null);

  // Fetch stats for filter tabs
  const { data: stats } = ordersCRUD.useStats();

  // Fetch orders based on filters
  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = ordersCRUD.useList({
    status: selectedStatus,
    search: searchQuery,
    sortField,
    sortDirection,
    page,
    pageSize,
  });

  const filteredExtraOrders = useMemo(
    () =>
      extraOrders.filter(
        (order) =>
          selectedStatus === "all" || order.statusKey === selectedStatus,
      ),
    [extraOrders, selectedStatus],
  );

  const orders = useMemo(
    () => [...filteredExtraOrders, ...(ordersData?.data ?? [])],
    [filteredExtraOrders, ordersData],
  );

  const total = (ordersData?.total ?? 0) + filteredExtraOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filters = useMemo(() => {
    const baseCounts = { ...(stats ?? {}) };
    if (baseCounts.all == null) {
      baseCounts.all = ordersData?.total ?? 0;
    }
    extraOrders.forEach((order) => {
      baseCounts.all = (baseCounts.all ?? 0) + 1;
      baseCounts[order.statusKey] =
        (baseCounts[order.statusKey] ?? 0) + 1;
    });

    return Object.keys(statusMap).map((key) => ({
      key,
      label: statusMap[key],
      count: baseCounts[key] ?? 0,
    }));
  }, [stats, extraOrders, ordersData]);

  const allVisibleSelected =
    orders.length > 0 && orders.every((order) => selectedOrders.has(order.id));
  const someVisibleSelected =
    orders.some((order) => selectedOrders.has(order.id)) && !allVisibleSelected;

  const handleToggleAll = (value) => {
    if (value) {
      selectAllOrders(orders.map((o) => o.id));
    } else {
      clearOrderSelection();
    }
  };

  const handleRowToggle = (orderId, value) => {
    const newSet = new Set(selectedOrders);

    if (value) {
      newSet.add(orderId);
    } else {
      newSet.delete(orderId);
    }

    selectAllOrders(Array.from(newSet));
  };

  // SSE Workflow Steps Mapping
  const workflowSteps = {
    [WORKFLOW_STEPS.SALES_RECEIVE]: {
      label: "NVKD tiếp nhận",
      color: "blue",
      icon: "??",
      description: "Tạo đơn hàng & nhập thông tin khách"
    },
    [WORKFLOW_STEPS.PICKUP_COLLECT]: {
      label: "NV Pickup nhận hàng",
      color: "orange",
      icon: "??",
      description: "Nhận hàng tại khách & cập nhật kho"
    },
    [WORKFLOW_STEPS.PROCESSING_PACKAGE]: {
      label: "NV Khai thác đóng gói",
      color: "purple",
      icon: "??",
      description: "Đóng gói, kiểm đảm & chụp hình"
    },
    [WORKFLOW_STEPS.SALES_PRICING]: {
      label: "NVKD nhập giá bán",
      color: "green",
      icon: "??",
      description: "Nhập giá bán & tạo link thanh toán"
    },
    [WORKFLOW_STEPS.CUSTOMER_PAYMENT]: {
      label: "Khách thanh toán",
      color: "emerald",
      icon: "??",
      description: "Khách hàng thanh toán thành công"
    },
    [WORKFLOW_STEPS.DOCUMENTATION_PROCESS]: {
      label: "NV Chứng từ xử lý",
      color: "indigo",
      icon: "??",
      description: "Xử lý chứng từ & link với hãng vận chuyển"
    },
    [WORKFLOW_STEPS.COMPLETED]: {
      label: "Hoàn tất",
      color: "gray",
      icon: "?",
      description: "Đơn hàng hoàn tất"
    }
  };

  // Filter orders based on user role - optimized dependencies
  const roleFilteredOrders = useMemo(() => {
    let filtered = orders;

    // Apply role-based filtering
    if (currentUser?.role === USER_ROLES.SALES) {
      // Sales can only see their own orders
      filtered = filtered.filter(order => order.assignedSalesId === currentUser.id);
    } else if (currentUser?.role === USER_ROLES.PICKUP) {
      // Pickup can see orders in their workflow steps
      filtered = filtered.filter(order =>
        [WORKFLOW_STEPS.SALES_RECEIVE, WORKFLOW_STEPS.PICKUP_COLLECT].includes(order.workflowStep)
      );
    } else if (currentUser?.role === USER_ROLES.PROCESSING) {
      // Processing can see orders ready for packaging
      filtered = filtered.filter(order =>
        [WORKFLOW_STEPS.PICKUP_COLLECT, WORKFLOW_STEPS.PROCESSING_PACKAGE].includes(order.workflowStep)
      );
    } else if (currentUser?.role === USER_ROLES.DOCUMENTATION) {
      // Documentation can see completed orders
      filtered = filtered.filter(order =>
        [WORKFLOW_STEPS.CUSTOMER_PAYMENT, WORKFLOW_STEPS.DOCUMENTATION_PROCESS].includes(order.workflowStep)
      );
    }

    return filtered;
  }, [orders, currentUser?.role, currentUser?.id]); // More specific dependencies

  // Apply role-based data filtering (hide sensitive info) - optimized
  const displayOrders = useMemo(() => {
    return filterDataByRole(roleFilteredOrders, 'order');
  }, [roleFilteredOrders]); // Only depends on filtered orders

  const handleWorkflowAction = (order, action) => {
    if (!canAdvanceWorkflow(order.workflowStep, action, currentUser?.role)) {
      showInfo("Bạn không có quyền thực hiện hành động này");
      return;
    }

    // Update order workflow step
    const updatedOrder = {
      ...order,
      workflowStep: action,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: currentUser?.id,
      workflowHistory: [
        ...(order.workflowHistory || []),
        {
          step: action,
          timestamp: new Date().toISOString(),
          userId: currentUser?.id,
          userName: currentUser?.name,
          userRole: currentUser?.role
        }
      ]
    };

    // Calculate commission for this action
    const commission = calculateCommission(currentUser?.role, updatedOrder);
    if (commission > 0) {
      updatedOrder.commissionEarned = (updatedOrder.commissionEarned || 0) + commission;
      showSuccess(`Đã ghi nhận hoa hồng: ${commission.toLocaleString()}đ`);
    }

    // Update the order in state
    setExtraOrders(prev =>
      prev.map(o => o.id === order.id ? updatedOrder : o)
    );

    showSuccess(`Đã cập nhật trạng thái: ${workflowSteps[action]?.label}`);
  };

  const openWorkflowModal = (order) => {
    setWorkflowModal({ isOpen: true, order });
  };

  const closeWorkflowModal = () => {
    setWorkflowModal({ isOpen: false, order: null });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} (${hours}:${minutes})`;
  };

  // Quick Actions Handlers
  const handleQuickAction = async (actionId) => {
    if (selectedOrders.size === 0) {
      showInfo("Vui lòng chọn ít nhất một đơn hàng");
      return;
    }

    const selectedOrderObjects = displayOrders.filter(order => selectedOrders.has(order.id));

    switch (actionId) {
      case "cancel":
        await handleCancelOrders(selectedOrderObjects);
        break;
      case "delete":
        setDeleteModal({ isOpen: true, orders: selectedOrderObjects });
        break;
      case "save":
        await handleSaveOrders(selectedOrderObjects);
        break;
      case "download":
        handleDownloadOrders(selectedOrderObjects);
        break;
      case "message":
        handleMessageCustomers(selectedOrderObjects);
        break;
      case "user":
        handleViewCustomers(selectedOrderObjects);
        break;
      case "list":
        handleExportList(selectedOrderObjects);
        break;
      case "export":
        handleExportToCarriers(selectedOrderObjects);
        break;
      case "clean":
        handleCleanOrders(selectedOrderObjects);
        break;
      default:
        showInfo("Chức năng đang được phát triển");
    }
  };

  const handleCancelOrders = async (orders) => {
    if (!hasPermission('cancel_orders')) {
      showInfo("Bạn không có quyền hủy đơn hàng");
      return;
    }

    setBulkActionLoading("cancel");
    try {
      // Check which orders can be cancelled
      const cancellableOrders = orders.filter(order =>
        !['completed', 'cancelled', 'delivering'].includes(order.statusKey)
      );

      if (cancellableOrders.length === 0) {
        showInfo("Không có đơn hàng nào có thể hủy");
        return;
      }

      // Update orders to cancelled status
      for (const order of cancellableOrders) {
        await ordersCRUD.useUpdate().mutateAsync({
          id: order.id,
          data: {
            statusKey: 'cancelled',
            statusLabel: 'Hủy',
            statusTone: 'default',
            cancelledAt: new Date().toISOString(),
            cancelledBy: currentUser?.id
          }
        });
      }

      showSuccess(`Đã hủy ${cancellableOrders.length} đơn hàng`);
      clearOrderSelection();
    } catch (error) {
      showInfo("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleDeleteOrders = async () => {
    if (!hasPermission('delete_orders')) {
      showInfo("Bạn không có quyền xóa đơn hàng");
      return;
    }

    setBulkActionLoading("delete");
    try {
      const { orders } = deleteModal;

      for (const order of orders) {
        await ordersCRUD.useDelete().mutateAsync(order.id);
      }

      showSuccess(`Đã xóa ${orders.length} đơn hàng`);
      clearOrderSelection();
      setDeleteModal({ isOpen: false, orders: [] });
    } catch (error) {
      showInfo("Có lỗi xảy ra khi xóa đơn hàng");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleSaveOrders = async (orders) => {
    setBulkActionLoading("save");
    try {
      // For now, just show success - in real implementation this would save bulk changes
      showSuccess(`Đã lưu ${orders.length} đơn hàng`);
      clearOrderSelection();
    } catch (error) {
      showInfo("Có lỗi xảy ra khi lưu đơn hàng");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleDownloadOrders = (orders) => {
    try {
      const formattedData = formatOrdersForExport(orders);
      exportToExcel(formattedData, `don-hang-${new Date().toISOString().slice(0, 10)}`);
      showSuccess(`Đã tải xuống ${orders.length} đơn hàng`);
    } catch (error) {
      showInfo("Có lỗi xảy ra khi tải xuống");
    }
  };

  const handleMessageCustomers = (orders) => {
    // Extract unique customer contacts
    const customerContacts = [...new Set(
      orders
        .map(order => order.receiver?.contact)
        .filter(contact => contact)
    )];

    if (customerContacts.length === 0) {
      showInfo("Không tìm thấy thông tin liên hệ khách hàng");
      return;
    }

    // For now, just show info - in real implementation this would open messaging interface
    showInfo(`Gửi tin nhắn đến ${customerContacts.length} khách hàng: ${customerContacts.join(', ')}`);
  };

  const handleViewCustomers = (orders) => {
    // Extract unique customer info
    const customers = orders.map(order => ({
      company: order.receiver?.company,
      contact: order.receiver?.contact,
      address: order.receiver?.address
    })).filter(customer => customer.company || customer.contact);

    if (customers.length === 0) {
      showInfo("Không tìm thấy thông tin khách hàng");
      return;
    }

    // For now, just show info - in real implementation this would open customer details modal
    const customerSummary = customers.map(c => `${c.company || 'N/A'} (${c.contact || 'N/A'})`).join(', ');
    showInfo(`Thông tin khách hàng: ${customerSummary}`);
  };

  const handleExportList = (orders) => {
    try {
      const formattedData = formatOrdersForExport(orders);
      exportToExcel(formattedData, `danh-sach-don-hang-${new Date().toISOString().slice(0, 10)}`);
      showSuccess(`Đã xuất danh sách ${orders.length} đơn hàng`);
    } catch (error) {
      showInfo("Có lỗi xảy ra khi xuất danh sách");
    }
  };

  const handleExportToCarriers = (orders) => {
    // Group orders by carrier
    const carrierGroups = orders.reduce((groups, order) => {
      const carrierCode = order.carrier?.code || 'UNKNOWN';
      if (!groups[carrierCode]) {
        groups[carrierCode] = [];
      }
      groups[carrierCode].push(order);
      return groups;
    }, {});

    // For now, just show summary - in real implementation this would export to carrier systems
    const summary = Object.entries(carrierGroups)
      .map(([carrier, orders]) => `${carrier}: ${orders.length} đơn`)
      .join(', ');

    showInfo(`Chuẩn bị xuất ${orders.length} đơn hàng đến các hãng vận chuyển: ${summary}`);
  };

  const handleCleanOrders = (orders) => {
    // Filter completed/cancelled orders older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldOrders = orders.filter(order =>
      ['completed', 'cancelled'].includes(order.statusKey) &&
      new Date(order.createdAt) < thirtyDaysAgo
    );

    if (oldOrders.length === 0) {
      showInfo("Không có đơn hàng cũ nào cần dọn dẹp");
      return;
    }

    // For now, just show info - in real implementation this would archive or delete old orders
    showInfo(`Tìm thấy ${oldOrders.length} đơn hàng cũ có thể dọn dẹp`);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title and Actions */}
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold uppercase tracking-wide text-slate-800">
              Danh sách đơn hàng
            </h1>

            <div className="flex items-center gap-1.5">
              <button
                className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                type="button"
                onClick={() => router.push('/quick-order')}
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn hàng</span>
              </button>

              {quickActions.map(({ icon: Icon, id, label }) => (
                <button
                  key={id}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${bulkActionLoading === id
                      ? "bg-blue-200 text-blue-800 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  title={label}
                  type="button"
                  disabled={bulkActionLoading === id}
                  onClick={() => handleQuickAction(id)}
                >
                  {bulkActionLoading === id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Page Size, Search, Filter */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              type="button"
            >
              <span>{pageSize}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <Input
              className="w-64"
              classNames={{
                inputWrapper: "h-8 border border-slate-300 bg-white hover:bg-slate-50",
                input: "text-sm",
              }}
              placeholder="Tìm kiếm đơn hàng"
              size="sm"
              startContent={<Search className="h-4 w-4 text-slate-400" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />

            <Button
              className="h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:shadow-lg"
              size="sm"
              startContent={<Filter className="h-4 w-4" />}
              onPress={() => showInfo("Tính năng bộ lọc nâng cao đang được phát triển")}
            >
              Lọc nâng cao
            </Button>

            {selectedOrders.size > 0 && (
              <Chip className="h-8" color="primary" size="sm">
                Đã chọn: {selectedOrders.size}
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {filters.map((filter, index) => {
            const isActive = selectedStatus === filter.key;

            return (
              <div key={filter.key} className="flex items-center">
                <button
                  className={
                    isActive
                      ? "rounded-full bg-blue-600 px-3 py-1.5 font-semibold text-white"
                      : "rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
                  }
                  type="button"
                  onClick={() => setSelectedStatus(filter.key)}
                >
                  {filter.label} ( {filter.count} )
                </button>
                {index < filters.length - 1 && (
                  <span className="px-2 text-slate-400">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                    >
                      <path d="M3 2 L7 5 L3 8 Z" fill="currentColor" />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <Table
            removeWrapper
            classNames={{
              table: "min-w-full",
              th: "bg-slate-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600",
              td: "px-4 py-4 text-sm",
            }}
          >
            <TableHeader>
              <TableColumn className="w-12">
                <Checkbox
                  isIndeterminate={someVisibleSelected}
                  isSelected={allVisibleSelected}
                  size="md"
                  radius="md"
                  classNames={{
                    wrapper: "w-5 h-5 before:border-1",
                    icon: "w-3.5 h-3.5"
                  }}
                  onValueChange={handleToggleAll}
                />
              </TableColumn>
              <TableColumn className="w-16">STT</TableColumn>
              <TableColumn>Mã AWB / REF Code</TableColumn>
              <TableColumn>Tên khách hàng</TableColumn>
              <TableColumn>Ngày tạo / Ngày xuất</TableColumn>
              <TableColumn>Trạng thái xử lý</TableColumn>
              <TableColumn>Tên công ty / Người gửi</TableColumn>
              <TableColumn>Tên công ty / Người nhận</TableColumn>
              <TableColumn>Địa chỉ người nhận</TableColumn>
            </TableHeader>

            <TableBody emptyContent="Không có dữ liệu">
              {displayOrders.map((order, index) => {
                const isSelected = selectedOrders.has(order.id);

                return (
                  <TableRow
                    key={order.id}
                    className={isSelected ? "bg-blue-50" : "hover:bg-slate-50"}
                  >
                    <TableCell>
                      <Checkbox
                        isSelected={isSelected}
                        size="md"
                        radius="md"
                        classNames={{
                          wrapper: "w-5 h-5 before:border-1",
                          icon: "w-3.5 h-3.5"
                        }}
                        onValueChange={(value) => handleRowToggle(order.id, value)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex h-6 w-6 items-center justify-center rounded border border-slate-300 bg-white text-xs font-semibold">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-blue-600">
                          {order.awb}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.refCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Chip className="bg-blue-100 text-blue-800" size="sm">
                          {order.carrier.code}
                        </Chip>
                        <span className="font-semibold">
                          {order.carrier.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {formatDate(order.createdAt)}
                        </p>
                        {order.expectedDeliveryAt && (
                          <p className="text-xs text-slate-500">
                            {formatDate(order.expectedDeliveryAt)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={statusChipClassNames(order.statusTone)}
                      >
                        {order.statusLabel}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.sender.company}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.sender.contact}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.receiver.company}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.receiver.contact}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-slate-600">{order.receiver.address}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Footer */}
      {!isLoading && total > 0 && (
        <div className="border-t border-slate-200 px-6 py-3">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center text-sm text-slate-600">
            <p className="pr-3">
              Hiển thị <span className="font-semibold">{displayOrders.length}</span> /{" "}
              <span className="font-semibold">{total}</span> đơn hàng
            </p>
            <div className="flex items-center justify-center gap-1">
              <button
                className="rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={page === 1}
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from(
                { length: Math.min(totalPages, 7) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  className={
                    p === page
                      ? "rounded-md bg-blue-100 px-2.5 py-1 font-semibold text-blue-700"
                      : "rounded-md px-2.5 py-1 text-slate-700 hover:bg-slate-100"
                  }
                  type="button"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={page === totalPages}
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
            {isFetching && (
              <div className="ml-auto flex items-center justify-end gap-2 pl-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang cập nhật...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SSE Workflow Modal */}
      {workflowModal.isOpen && workflowModal.order && (
        <OverlayModal
          isOpen={workflowModal.isOpen}
          onClose={closeWorkflowModal}
          title={`Quy trình xử lý đơn hàng ${workflowModal.order.awb}`}
          size="4xl"
        >
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {workflowSteps[workflowModal.order.workflowStep]?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {workflowSteps[workflowModal.order.workflowStep]?.label}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {workflowSteps[workflowModal.order.workflowStep]?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Các bước trong quy trình:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(workflowSteps).map(([stepKey, stepInfo], index) => {
                  const isCompleted = workflowModal.order.workflowHistory?.some(h => h.step === stepKey);
                  const isCurrent = workflowModal.order.workflowStep === stepKey;
                  const canAccess = canAdvanceWorkflow(workflowModal.order.workflowStep, stepKey, currentUser?.role);

                  return (
                    <div
                      key={stepKey}
                      role="button"
                      tabIndex={canAccess && !isCurrent ? 0 : -1}
                      className={`p-3 rounded-lg border-2 transition-all ${isCompleted
                          ? 'bg-green-50 border-green-300'
                          : isCurrent
                            ? 'bg-blue-50 border-blue-300'
                            : canAccess
                              ? 'bg-white border-slate-200 hover:border-blue-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
                              : 'bg-slate-50 border-slate-200 opacity-50'
                        }`}
                      onClick={() => canAccess && !isCurrent && handleWorkflowAction(workflowModal.order, stepKey)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && canAccess && !isCurrent) {
                          e.preventDefault();
                          handleWorkflowAction(workflowModal.order, stepKey);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-lg ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                          {stepInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isCompleted ? 'text-green-800' :
                                isCurrent ? 'text-blue-800' : 'text-slate-600'
                              }`}>
                              Bước {index + 1}: {stepInfo.label}
                            </span>
                            {isCompleted && <span className="text-green-600">✓</span>}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {stepInfo.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commission Info */}
            {workflowModal.order.commissionEarned > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-900">Hoa hồng đã ghi nhận</h4>
                    <p className="text-sm text-green-700">
                      Tổng hoa hồng từ đơn hàng này
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {workflowModal.order.commissionEarned.toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow History */}
            {workflowModal.order.workflowHistory && workflowModal.order.workflowHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Lịch sử xử lý:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {workflowModal.order.workflowHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                      <div className="text-sm text-slate-500 min-w-[100px]">
                        {formatDate(history.timestamp)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">{history.userName}</span>
                        <span className="text-slate-500"> ({history.userRole})</span>
                      </div>
                      <div className="text-sm text-blue-600">
                        → {workflowSteps[history.step]?.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </OverlayModal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, orders: [] })}
        onConfirm={handleDeleteOrders}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa ${deleteModal.orders.length} đơn hàng đã chọn? Hành động này không thể hoàn tác.`}
        itemName={`${deleteModal.orders.length} đơn hàng`}
        variant="danger"
      />
    </div>
  );
}
