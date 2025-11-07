"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Checkbox } from "@heroui/checkbox";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  FileText,
  ChevronDown,
  ChevronUp,
  Printer,
  Trash2,
  ListTree,
  RefreshCcw,
  Share2,
  NotebookPen,
  CreditCard,
  CheckCircle2,
  CircleDollarSign,
  ClockAlert,
} from "lucide-react";
import * as XLSX from "xlsx";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

const mockDebtData = [
  {
    id: 1,
    stt: 1,
    customerName: "NINA Express",
    debtCode: "DB-5544",
    createdDate: "25-07-2025",
    accountant: "Thụy - KT02N",
    paymentStatus: "overdue",
    lifecycleStatus: "new",
    totalAmount: 5909400,
    remaining: 2000000,
    paymentDate: "Chưa có",
    salesPerson: "Cường Đặng - S02",
    customerDetails: {
      fullName: "CTY VẬN CHUYỂN NINA EXPRESS",
      contact: "Hoàng Nhân (0909 551 549)",
      totalOrders: 35,
      totalWeight: 214,
      note: "Khách hàng thanh toán tiền mặt, không xuất hóa đơn.",
    },
  },
  {
    id: 2,
    stt: 2,
    customerName: "NINA Express",
    debtCode: "DB-5543",
    createdDate: "15-07-2025",
    accountant: "Thụy - KT02N",
    paymentStatus: "paid",
    lifecycleStatus: "updated",
    totalAmount: 43210320,
    remaining: 0,
    paymentDate: "17-07-2025",
    salesPerson: "Long Trịnh - S01",
    customerDetails: {
      fullName: "CTY VẬN CHUYỂN NINA EXPRESS",
      contact: "Hoàng Nhân (0909 551 549)",
      totalOrders: 36,
      totalWeight: 220,
      note: "Đã thanh toán đầy đủ, chưa yêu cầu hóa đơn.",
    },
  },
  {
    id: 3,
    stt: 3,
    customerName: "DHL Express",
    debtCode: "DB-5542",
    createdDate: "14-07-2025",
    accountant: "Linh - KT01S",
    paymentStatus: "unpaid",
    lifecycleStatus: "updated",
    totalAmount: 3240300,
    remaining: 1000000,
    paymentDate: "Chưa có",
    salesPerson: "Xuân - S10Z",
    customerDetails: {
      fullName: "DHL EXPRESS VIETNAM",
      contact: "Nguyễn Văn A (0901 234 567)",
      totalOrders: 28,
      totalWeight: 156,
      note: "Chờ xác nhận thanh toán từ kế toán tổng.",
    },
  },
  {
    id: 4,
    stt: 4,
    customerName: "FedEx Express",
    debtCode: "DB-5541",
    createdDate: "11-07-2025",
    accountant: "Linh - KT01S",
    paymentStatus: "partial",
    lifecycleStatus: "new",
    totalAmount: 25909400,
    remaining: 3000000,
    paymentDate: "Chưa có",
    salesPerson: "Cường Đặng - S02",
    customerDetails: {
      fullName: "FEDEX EXPRESS VIETNAM",
      contact: "Trần Thị B (0902 345 678)",
      totalOrders: 52,
      totalWeight: 428,
      note: "Khách yêu cầu xuất hóa đơn gốc kèm bảng kê.",
    },
  },
  {
    id: 5,
    stt: 5,
    customerName: "UPS Express",
    debtCode: "DB-5540",
    createdDate: "10-07-2025",
    accountant: "Thụy - KT02N",
    paymentStatus: "paid",
    lifecycleStatus: "updated",
    totalAmount: 124200670,
    remaining: 0,
    paymentDate: "10-07-2025",
    salesPerson: "Thiện Trâm - S05P",
    customerDetails: {
      fullName: "UPS EXPRESS VIETNAM",
      contact: "Lê Văn C (0903 456 789)",
      totalOrders: 68,
      totalWeight: 582,
      note: "Thanh toán chuyển khoản. Đã gửi chứng từ.",
    },
  },
  {
    id: 6,
    stt: 6,
    customerName: "DPD Express",
    debtCode: "DB-5539",
    createdDate: "05-07-2025",
    accountant: "Thụy - KT02N",
    paymentStatus: "cancelled",
    lifecycleStatus: "cancelled",
    totalAmount: 187000000,
    remaining: 187000000,
    paymentDate: "Đã hủy",
    salesPerson: "Cường Đặng - S02",
    customerDetails: {
      fullName: "DPD EXPRESS VIETNAM",
      contact: "Phạm Thị D (0904 567 890)",
      totalOrders: 95,
      totalWeight: 745,
      note: "Đơn hàng hủy do khách thay đổi hợp đồng.",
    },
  },
];

const paymentStatusConfig = {
  paid: { label: "Đã thanh toán", color: "success" },
  unpaid: { label: "Chưa thanh toán", color: "warning" },
  partial: { label: "Thanh toán 1 phần", color: "primary" },
  overdue: { label: "Quá hạn", color: "danger" },
  cancelled: { label: "Đã hủy", color: "danger" },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
const formatPercent = (value) =>
  `${value.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
const normalizeText = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const summaryCards = [
  {
    key: "total",
    label: "Tổng công nợ",
    border: "border-blue-500",
    gradient: "from-blue-50 to-blue-100",
    textColor: "text-blue-900",
    badgeColor: "text-blue-600",
    icon: CreditCard,
    valueAccessor: (stats) => formatCurrency(stats.totalDebt),
    badgeAccessor: (stats) => `${stats.totalDebtCount} hóa đơn`,
    sublineAccessor: (stats) => `${stats.totalDebtCount} hóa đơn`,
  },
  {
    key: "paid",
    label: "Đã thanh toán",
    border: "border-emerald-500",
    gradient: "from-emerald-50 to-emerald-100",
    textColor: "text-emerald-900",
    badgeColor: "text-emerald-600",
    icon: CheckCircle2,
    valueAccessor: (stats) => formatCurrency(stats.totalPaid),
    badgeAccessor: (stats) => `${stats.paidCount} hóa đơn`,
    sublineAccessor: () => "Dòng tiền đã thu",
  },
  {
    key: "unpaid",
    label: "Chưa thanh toán",
    border: "border-amber-500",
    gradient: "from-amber-50 to-amber-100",
    textColor: "text-amber-900",
    badgeColor: "text-amber-600",
    icon: ClockAlert,
    valueAccessor: (stats) => formatCurrency(stats.totalUnpaid),
    badgeAccessor: (stats) => `${stats.unpaidCount} hóa đơn`,
    sublineAccessor: () => "Cần nhắc khách",
  },
  {
    key: "overdue",
    label: "Quá hạn",
    border: "border-rose-500",
    gradient: "from-rose-50 to-rose-100",
    textColor: "text-rose-900",
    badgeColor: "text-rose-600",
    icon: RefreshCcw,
    valueAccessor: (stats) => formatCurrency(stats.overdue),
    badgeAccessor: (stats) => `${stats.overdueCount} hóa đơn`,
    sublineAccessor: () => "Cảnh báo rủi ro",
  },
  {
    key: "commission",
    label: "Hoa hồng kinh doanh",
    border: "border-teal-500",
    gradient: "from-teal-50 to-teal-100",
    textColor: "text-teal-900",
    badgeColor: "text-teal-600",
    icon: CircleDollarSign,
    valueAccessor: (stats) => formatCurrency(stats.commission),
    badgeAccessor: (stats) => `${stats.paidCount} giao dịch`,
    sublineAccessor: (stats) => formatPercent(stats.commissionRate),
  },
];

export default function DebtPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(() => new Set([mockDebtData[0]?.id].filter(Boolean)));
  const [debts] = useState(mockDebtData);

  const stats = useMemo(() => {
    const commissionRate = 30.25;
    const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
    const totalPaid = debts
      .filter((debt) => debt.paymentStatus === "paid")
      .reduce((sum, debt) => sum + debt.totalAmount, 0);
    const totalUnpaid = debts
      .filter((debt) => ["unpaid", "partial"].includes(debt.paymentStatus))
      .reduce((sum, debt) => sum + debt.remaining, 0);
    const overdue = debts
      .filter((debt) => debt.paymentStatus === "overdue")
      .reduce((sum, debt) => sum + debt.remaining, 0);

    return {
      totalDebt,
      totalDebtCount: debts.length,
      totalPaid,
      paidCount: debts.filter((debt) => debt.paymentStatus === "paid").length,
      totalUnpaid,
      unpaidCount: debts.filter((debt) => ["unpaid", "partial"].includes(debt.paymentStatus)).length,
      overdue,
      overdueCount: debts.filter((debt) => debt.paymentStatus === "overdue").length,
      commissionRate,
      commission: Math.round(totalPaid * (commissionRate / 100)),
      cancelledCount: debts.filter((debt) => debt.paymentStatus === "cancelled").length,
      newlyCreatedCount: debts.filter((debt) => debt.lifecycleStatus === "new").length,
      updatedCount: debts.filter((debt) => debt.lifecycleStatus === "updated").length,
    };
  }, [debts]);

  const tabs = useMemo(() => {
    const baseTabs = [
      { key: "all", label: "Tất cả", color: "primary", icon: ListTree, filter: () => true },
      { key: "new", label: "Mới tạo", color: "default", icon: Plus, filter: (debt) => debt.lifecycleStatus === "new" },
      {
        key: "updated",
        label: "Đã cập nhật",
        color: "default",
        icon: RefreshCcw,
        filter: (debt) => debt.lifecycleStatus === "updated",
      },
      {
        key: "unpaid",
        label: "Chưa thanh toán",
        color: "warning",
        icon: ClockAlert,
        filter: (debt) => ["unpaid", "partial"].includes(debt.paymentStatus),
      },
      {
        key: "paid",
        label: "Đã thanh toán",
        color: "success",
        icon: CheckCircle2,
        filter: (debt) => debt.paymentStatus === "paid",
      },
      { key: "cancelled", label: "Hủy", color: "danger", icon: Trash2, filter: (debt) => debt.paymentStatus === "cancelled" },
      {
        key: "overdue",
        label: "Quá hạn thanh toán",
        color: "danger",
        icon: Printer,
        filter: (debt) => debt.paymentStatus === "overdue",
      },
    ];

    return baseTabs.map((tab) => ({
      ...tab,
      count: debts.filter(tab.filter).length,
    }));
  }, [debts]);

  const activeTab = useMemo(() => tabs.find((tab) => tab.key === selectedTab) ?? tabs[0], [tabs, selectedTab]);
  const normalizedQuery = useMemo(() => normalizeText(searchQuery), [searchQuery]);

  const filteredDebts = useMemo(() => {
    const filterFn = activeTab?.filter ?? (() => true);
    return debts.filter((debt) => {
      const haystack = [
        debt.customerName,
        debt.debtCode,
        debt.accountant,
        debt.salesPerson,
        debt.customerDetails.fullName,
        debt.customerDetails.contact,
      ]
        .map((field) => normalizeText(field))
        .join(" ");

      const matchesSearch = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesSearch && filterFn(debt);
    });
  }, [debts, activeTab, normalizedQuery]);

  const handleSelectAll = () => {
    if (selectedRows.size === filteredDebts.length) {
      setSelectedRows(new Set());
      return;
    }

    setSelectedRows(new Set(filteredDebts.map((debt) => debt.id)));
  };

  const handleSelectRow = (id) => {
    const nextSelection = new Set(selectedRows);
    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }
    setSelectedRows(nextSelection);
  };

  const toggleRowExpansion = (id) => {
    const nextExpanded = new Set(expandedRows);
    if (nextExpanded.has(id)) {
      nextExpanded.delete(id);
    } else {
      nextExpanded.add(id);
    }
    setExpandedRows(nextExpanded);
  };

  const handleExport = () => {
    try {
      const exportData = filteredDebts.map((debt) => ({
        STT: debt.stt,
        "Tên khách hàng": debt.customerName,
        "Mã công nợ": debt.debtCode,
        "Ngày tạo": debt.createdDate,
        "Kế toán phụ trách": debt.accountant,
        "Trạng thái thanh toán": paymentStatusConfig[debt.paymentStatus].label,
        "Tổng tiền": debt.totalAmount,
        "Còn lại": debt.remaining,
        "Ngày thanh toán": debt.paymentDate,
        "Sale phụ trách": debt.salesPerson,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "CongNo");
      XLSX.writeFile(workbook, `CongNo_${new Date().toISOString().split("T")[0]}.xlsx`);
      showSuccessToast(`Đã xuất ${filteredDebts.length} bản ghi`);
    } catch (error) {
      showErrorToast("Không thể xuất file. Vui lòng thử lại!");
    }
  };

  const handleExportDebit = (debt) => {
    try {
      const exportData = [
        {
          "Tên khách hàng": debt.customerDetails.fullName,
          "Liên hệ": debt.customerDetails.contact,
          "Mã công nợ": debt.debtCode,
          "Ngày tạo": debt.createdDate,
          "Tổng đơn hàng": debt.customerDetails.totalOrders,
          "Tổng cân nặng": `${debt.customerDetails.totalWeight} KG`,
          "Tổng tiền": debt.totalAmount,
          "Còn lại": debt.remaining,
          "Ghi chú": debt.customerDetails.note,
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DebitDetail");
      XLSX.writeFile(workbook, `Debit_${debt.debtCode}_${new Date().toISOString().split("T")[0]}.xlsx`);
      showSuccessToast("Đã xuất file excel debit");
    } catch (error) {
      showErrorToast("Không thể xuất file. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white shadow-sm">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-bold text-slate-900">Quản lý công nợ</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.key}
              className={`group relative overflow-hidden border-l-4 ${card.border} bg-gradient-to-br ${card.gradient} shadow-md`}
            >
              <CardBody className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className={`uppercase tracking-wide ${card.badgeColor}`}>{card.label}</span>
                  {card.badgeAccessor ? (
                    <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      {card.badgeAccessor(stats)}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className={`text-3xl font-bold ${card.textColor}`}>{card.valueAccessor(stats)}</div>
                    <div className={`mt-1 text-sm font-medium ${card.badgeColor}`}>{card.sublineAccessor(stats)}</div>
                  </div>
                  <div className="rounded-full bg-white/80 p-2 text-slate-500 shadow-sm transition group-hover:scale-110">
                    <Icon size={26} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <NotebookPen size={18} className="text-primary" />
                Danh sách công nợ
              </div>
              <div className="flex items-center gap-2">
                <Button isIconOnly size="sm" variant="flat" color="primary">
                  <Download size={16} />
                </Button>
                <Button isIconOnly size="sm" variant="flat" color="secondary">
                  <Printer size={16} />
                </Button>
                <Button isIconOnly size="sm" variant="flat" color="warning">
                  <Share2 size={16} />
                </Button>
              </div>
              <Button size="sm" startContent={<Plus size={16} />} color="primary">
                Tạo công nợ
              </Button>
              <Button size="sm" startContent={<Trash2 size={16} />} variant="bordered" color="danger">
                Xóa
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Tìm kiếm ghi nợ khách"
                size="sm"
                variant="bordered"
                className="w-72"
                startContent={<Search size={16} />}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <Button size="sm" startContent={<Download size={16} />} color="primary" onClick={handleExport}>
                Xuất excel
              </Button>
              <Button size="sm" startContent={<Filter size={16} />} variant="bordered">
                Bộ lọc
              </Button>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.key}
                  size="sm"
                  variant={selectedTab === tab.key ? "solid" : "bordered"}
                  color={selectedTab === tab.key ? tab.color : "default"}
                  onClick={() => setSelectedTab(tab.key)}
                  startContent={Icon ? <Icon size={16} /> : undefined}
                >
                  {tab.label} ({tab.count})
                </Button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <Table aria-label="Debt table" removeWrapper>
              <TableHeader>
                <TableColumn>
                  <Checkbox
                    isSelected={filteredDebts.length > 0 && selectedRows.size === filteredDebts.length}
                    isIndeterminate={selectedRows.size > 0 && selectedRows.size < filteredDebts.length}
                    onChange={handleSelectAll}
                  />
                </TableColumn>
                <TableColumn>STT</TableColumn>
                <TableColumn>TÊN KHÁCH HÀNG</TableColumn>
                <TableColumn>MÃ CÔNG NỢ</TableColumn>
                <TableColumn>NGÀY TẠO</TableColumn>
                <TableColumn>KẾ TOÁN PHỤ TRÁCH</TableColumn>
                <TableColumn>TRẠNG THÁI THANH TOÁN</TableColumn>
                <TableColumn>TỔNG TIỀN</TableColumn>
                <TableColumn>CÒN LẠI</TableColumn>
                <TableColumn>NGÀY THANH TOÁN</TableColumn>
                <TableColumn>SALE PHỤ TRÁCH</TableColumn>
                <TableColumn />
              </TableHeader>
              <TableBody emptyContent="Không có dữ liệu phù hợp">
                {filteredDebts.map((debt) => (
                  <React.Fragment key={debt.id}>
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <Checkbox
                          isSelected={selectedRows.has(debt.id)}
                          onChange={() => handleSelectRow(debt.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button isIconOnly size="sm" variant="light" onClick={() => toggleRowExpansion(debt.id)}>
                            {expandedRows.has(debt.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                          {debt.stt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-600">{debt.customerName}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{debt.debtCode}</span>
                      </TableCell>
                      <TableCell>{debt.createdDate}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="warning">
                          {debt.accountant}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" color={paymentStatusConfig[debt.paymentStatus].color}>
                          {paymentStatusConfig[debt.paymentStatus].label}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900">{formatCurrency(debt.totalAmount)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={debt.remaining > 0 ? "font-semibold text-red-600" : "text-slate-400"}>
                          {formatCurrency(debt.remaining)}
                        </span>
                      </TableCell>
                      <TableCell>{debt.paymentDate}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">
                          {debt.salesPerson}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="debit"
                              startContent={<FileText size={16} />}
                              onClick={() => handleExportDebit(debt)}
                            >
                              Xuất file excel debit
                            </DropdownItem>
                            <DropdownItem key="print" startContent={<Printer size={16} />}>
                              In
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(debt.id) && (
                      <TableRow>
                        <TableCell colSpan={12} className="bg-blue-50">
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                              <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2 sm:gap-x-8">
                                <div>
                                  <span className="font-semibold text-slate-900">Tên khách hàng:</span>{" "}
                                  {debt.customerDetails.fullName}
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-900">Tổng đơn hàng:</span>{" "}
                                  {debt.customerDetails.totalOrders} đơn
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-900">Liên hệ:</span>{" "}
                                  {debt.customerDetails.contact}
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-900">Tổng cân nặng:</span>{" "}
                                  {debt.customerDetails.totalWeight} KG
                                </div>
                              </div>
                              <div className="flex items-center gap-3 lg:items-end">
                                <div className="max-w-sm text-sm text-slate-700">
                                  <span className="font-semibold text-slate-900">Ghi chú:</span>{" "}
                                  {debt.customerDetails.note}
                                </div>
                                <Button
                                  size="sm"
                                  startContent={<FileText size={16} />}
                                  onClick={() => handleExportDebit(debt)}
                                >
                                  Xuất file excel debit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
