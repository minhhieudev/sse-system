"use client";

import { useMemo } from "react";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Building2,
  ChevronDown,
  Package,
  Plus,
  Minus,
  Trash2,
  Truck,
  User,
} from "lucide-react";

const deliveryTerms = [
  { value: "ddu", label: "DDU" },
  { value: "ddp", label: "DDP" },
];

const packageUnitOptions = [
  { value: "box", label: "Thùng" },
  { value: "carton", label: "Carton" },
  { value: "bag", label: "Bao" },
  { value: "piece", label: "Kiện" },
];

const salesOwnerOptions = [
  { value: "sale-001", label: "Đặng Văn Cường - MNV: SALE001" },
  { value: "sale-002", label: "Nguyễn Thị Thảo - MNV: SALE002" },
  { value: "sale-003", label: "Lê Hoàng Nam - MNV: SALE003" },
];

const savedSenderOptions = [
  { value: "new", label: "Nhập thông tin mới" },
  { value: "sender-1", label: "CTY NINA - KH001 - 436/8 Đường HT13, Quận 12, TP.HCM" },
];

const savedReceiverOptions = [
  { value: "new", label: "Nhập thông tin mới" },
  { value: "receiver-1", label: "Joseph - Glasgow, United Kingdom" },
];

const agentOptions = [
  { value: "ans-cargo", label: "ANS CARGO - 2.375.000 VND" },
  { value: "vietstar", label: "Vietstar - 1.950.000 VND" },
  { value: "sino-log", label: "Sino Logistics - 2.150.000 VND" },
];

const airlineOptions = [
  { value: "dhl-vn", label: "DHL VIET NAM" },
  { value: "ups-express", label: "UPS EXPRESS" },
  { value: "vietnam-air", label: "Vietnam Airlines" },
];

const transitPartnerOptions = [
  { value: "aus-post", label: "AUS POST" },
  { value: "royal-mail", label: "Royal Mail" },
  { value: "usps", label: "USPS" },
];

const processingTagOptions = [
  { value: "oversize-dimension", label: "Quá khổ kích thước" },
  { value: "oversize-weight", label: "Quá khổ cân nặng" },
  { value: "no-invoice", label: "Không xuất hóa đơn" },
];

const serviceOptions = [
  { value: "fedex-sin", label: "FEDEX SIN" },
  { value: "dhl-express", label: "DHL EXPRESS" },
  { value: "ups-worldwide", label: "UPS WORLDWIDE" },
  { value: "tnt-express", label: "TNT EXPRESS" },
];

const serviceDetailOptions = [
  { value: "express", label: "NHANH" },
  { value: "economy", label: "TIẾT KIỆM" },
  { value: "standard", label: "TIÊU CHUẨN" },
];

const branchOptions = [
  { value: "hcm", label: "HỒ CHÍ MINH" },
  { value: "hanoi", label: "HÀ NỘI" },
  { value: "danang", label: "ĐÀ NẴNG" },
];

const extraServiceOptions = [
  { value: "signature-required", label: "Chỉ ký người nhận" },
  { value: "pickup-service", label: "Lấy hàng lần nơi" },
  { value: "insurance", label: "Bảo hiểm hàng hóa" },
  { value: "wooden-crate", label: "Đóng kiện gỗ" },
  { value: "fumigation", label: "FUMIGATION" },
];

const shipmentTypeOptions = [
  { value: "pack", label: "Hàng hóa (PACK)" },
  { value: "doc", label: "Tài liệu (DOC)" },
];

const shipmentReasonOptions = [
  { value: "gift", label: "Gift (no commercial value)" },
  { value: "sample", label: "Sample" },
  { value: "commercial", label: "Commercial" },
];

const shipmentMethodOptions = [
  { value: "pickup", label: "Thu gom lần nơi" },
  { value: "drop-off", label: "Gửi hàng tại bưu cục" },
];

const sectionCard =
  "rounded-2xl border-2 border-slate-200/60 bg-white px-7 py-6 shadow-lg hover:shadow-xl transition-shadow duration-200";

// Styled input configuration for consistent beautiful inputs
const inputClassNames = {
  label: "text-sm font-semibold text-slate-700 mb-1.5",
  inputWrapper: [
    "bg-white",
    "border-2",
    "border-slate-200",
    "hover:border-blue-300",
    "focus-within:!border-blue-500",
    "rounded-xl",
    "shadow-sm",
    "transition-all",
    "duration-200",
    "group-data-[invalid=true]:border-red-400",
    "group-data-[invalid=true]:hover:border-red-500",
  ],
  input: "text-slate-900 placeholder:text-slate-400",
  errorMessage: "text-xs text-red-600 mt-1",
};

const selectClassNames = {
  label: "text-sm font-semibold text-slate-700 !mb-0",
  trigger: [
    "bg-white",
    "border-2",
    "border-slate-200",
    "hover:border-blue-300",
    "data-[open=true]:border-blue-500",
    "rounded-xl",
    "shadow-sm",
    "transition-all",
    "duration-200",
    "h-12",
    "min-h-12",
  ],
  value: "text-slate-900",
  popover: "rounded-xl",
};

const defaultPackage = (index) => ({
  id: `pkg-${index + 1}`,
  quantity: "1",
  unit: "box",
  length: "",
  width: "",
  height: "",
  weight: "",
});

const numberFormatter = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const dimensionFieldConfig = [
  { key: "length", placeholder: "Dài", step: 0.5 },
  { key: "width", placeholder: "Rộng", step: 0.5 },
  { key: "height", placeholder: "Cao", step: 0.5 },
  { key: "weight", placeholder: "Nặng", step: 0.1 },
];

const isMissingDimension = (value) => value === "" || Number(value) <= 0;

function SteppedInput({ value, onChange, placeholder, step, min = 0 }) {
  const missing = isMissingDimension(value);
  const handleStep = (direction) => {
    const current = Number(value) || 0;
    const next = Math.max(min, Number((current + direction * step).toFixed(2)));
    onChange(String(next));
  };
  return (
    <div
      className={`flex items-center overflow-hidden rounded-lg border bg-white transition min-w-[120px] ${missing
        ? "border-red-300"
        : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <button
        type="button"
        className="px-2 py-2 text-slate-400 hover:text-slate-600 transition flex-shrink-0"
        onClick={() => handleStep(-1)}
        aria-label="Giảm giá trị"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        className={`w-full grow border-x border-slate-100 px-3 py-2 text-center text-xs font-normal text-slate-700 outline-none focus:border-transparent focus:outline-none focus:ring-0 ${missing ? "placeholder:text-red-400 text-red-600" : ""
        }`}
        inputMode="decimal"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={missing}
      />
      <button
        type="button"
        className="px-2 py-2 text-slate-400 hover:text-slate-600 transition flex-shrink-0"
        onClick={() => handleStep(1)}
        aria-label="Tăng giá trị"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function OrderCreationForm({
  data,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const formData = useMemo(
    () => ({
      packages: [defaultPackage(0)],
      processingTag: "",
      salesOwnerId: "sale-001",
      deliveryTerm: "ddu",
      processingAgent: "ans-cargo",
      processingCarrier: "dhl-vn",
      processingTransitPartner: "aus-post",
      savedSenderId: "new",
      savedReceiverId: "new",
      ...data,
    }),
    [data],
  );

  const packages =
    formData.packages && formData.packages.length > 0
      ? formData.packages
      : [defaultPackage(0)];

  const segmentedButtonClass = (active) =>
    active
      ? "rounded-full border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
      : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600";

  const handleFieldChange = (field, value) => {
    onChange?.(field, value);
  };

  const handlePackageChange = (index, field, value) => {
    const updated = packages.map((pkg, idx) =>
      idx === index ? { ...pkg, [field]: value } : pkg,
    );

    onChange?.("packages", updated);
  };

  const handleAddPackage = () => {
    const nextIndex = packages.length;
    const nextPackages = [...packages, defaultPackage(nextIndex)];
    onChange?.("packages", nextPackages);
  };

  const handleDuplicatePackage = (index) => {
    const source = packages[index];
    const next = {
      ...source,
      id: `pkg-${packages.length + 1}`,
    };
    const nextPackages = [...packages];
    nextPackages.splice(index + 1, 0, next);
    onChange?.("packages", nextPackages);
  };

  const handleRemovePackage = (index) => {
    if (packages.length === 1) return;
    const nextPackages = packages.filter((_, idx) => idx !== index);
    onChange?.("packages", nextPackages);
  };

  const handleQuantityStep = (index, step) => {
    const current = Math.max(1, Number(packages[index]?.quantity) || 1);
    const next = Math.max(1, current + step);
    handlePackageChange(index, "quantity", String(next));
  };

  const handleQuantityInput = (index, value) => {
    const parsed = Math.max(1, Number(value) || 1);
    handlePackageChange(index, "quantity", String(parsed));
  };

  const handleExtraServiceToggle = (value) => {
    const current = new Set(formData.extraServices ?? []);

    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }

    onChange?.("extraServices", Array.from(current));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  const packageSummary = useMemo(() => {
    const totals = packages.reduce(
      (accumulator, pkg) => {
        const quantity = Number(pkg.quantity) || 0;
        const length = Number(pkg.length) || 0;
        const width = Number(pkg.width) || 0;
        const height = Number(pkg.height) || 0;
        const weight = Number(pkg.weight) || 0;
        const volumetric = (length * width * height) / 5000;

        return {
          totalPackages: accumulator.totalPackages + quantity,
          actualWeight: accumulator.actualWeight + quantity * weight,
          volumetricWeight:
            accumulator.volumetricWeight + quantity * volumetric,
        };
      },
      { totalPackages: 0, actualWeight: 0, volumetricWeight: 0 },
    );

    return {
      ...totals,
      chargeableWeight: Math.max(totals.actualWeight, totals.volumetricWeight),
    };
  }, [packages]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 min-h-screen">
      <form
        className="mx-auto flex container flex-col gap-6 px-4 pb-8 pt-4 sm:px-8"
        onSubmit={handleSubmit}
      >
        {/* Main Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 shadow-xl">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/10 to-blue-400/10 blur-2xl"></div>
          
          <div className="relative flex flex-col gap-6 px-8 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                TẠO ĐƠN HÀNG MỚI
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Hàng thường (Việt Nam → United Kingdom)
              </h1>
            </div>
            <div className="flex w-full flex-col gap-3 lg:w-auto">
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-4 shadow-lg">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br from-blue-300/20 to-transparent blur-2xl"></div>
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      NVKD phụ trách
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {
                        salesOwnerOptions.find(
                          (option) => option.value === formData.salesOwnerId,
                        )?.label ?? "Đặng Văn Cường - MNV: SALE001"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================            */}
        <div className="flex gap-5 justify-between">
          {/* Service Section */}
          <div className={`${sectionCard} relative overflow-hidden border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30`}>
            {/* Decorative corner element */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/10 blur-2xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dịch vụ</h3>
                  <p className="text-sm text-slate-600">
                    Chọn dịch vụ vận chuyển và các tùy chọn đi kèm
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all hover:scale-105"
                aria-label="Thu gọn section"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Select
                label="Chọn dịch vụ *"
                placeholder="Chọn dịch vụ"
                classNames={selectClassNames}
                selectedKeys={[formData.serviceCode ?? "fedex-sin"]}
                onSelectionChange={(keys) =>
                  handleFieldChange("serviceCode", Array.from(keys)[0])
                }
              >
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Chỉ tiết dịch vụ"
                placeholder="Chọn loại"
                classNames={selectClassNames}
                selectedKeys={[formData.serviceDetail ?? "express"]}
                onSelectionChange={(keys) =>
                  handleFieldChange("serviceDetail", Array.from(keys)[0])
                }
              >
                {serviceDetailOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Chỉ nhận nhận hàng"
                placeholder="Chọn chi nhánh"
                classNames={selectClassNames}
                selectedKeys={[formData.branchCode ?? "hcm"]}
                onSelectionChange={(keys) =>
                  handleFieldChange("branchCode", Array.from(keys)[0])
                }
              >
                {branchOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="mt-5 flex gap-3">
              <p className="text-sm font-semibold text-slate-700 w-[13%]">
                Dịch vụ đi kèm:
              </p>
              <div className="flex gap-4 text-xs justify-center font-medium text-slate-700 flex-wrap">
                {extraServiceOptions.map((service) => (
                  <Checkbox
                    key={service.value}
                    isSelected={formData.extraServices?.includes(service.value)}
                    onValueChange={() => handleExtraServiceToggle(service.value)}
                  >
                    <span className="text-sm">{service.label}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>

          {/* Hình thức gửi hàng Section */}
          <div
            className={`${sectionCard} relative overflow-hidden border-purple-200/60 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30`}
          >
            {/* Decorative corner element */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-2xl"></div>
            
            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Hình thức gửi hàng
                  </h3>
                  <p className="text-sm text-slate-600">
                    Chọn loại bưu gửi và phương thức vận chuyển
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300 transition-all hover:scale-105"
                aria-label="Thu gọn section"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              {/* Loại bưu gửi */}
              <div className="grid grid-cols-[160px_1fr] items-start gap-2">
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Loại bưu gửi <span className="text-red-500">*</span>:
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  {shipmentTypeOptions.map((item) => {
                    const active = formData.shipmentType === item.value;
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="shipmentType"
                          checked={active}
                          onChange={() =>
                            handleFieldChange("shipmentType", item.value)
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
              </span>
                      </label>
                    );
                  })}
            </div>
              </div>

              {/* Lý do gửi hàng */}
              <div className="grid grid-cols-[160px_1fr] items-start gap-2">
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Lý do gửi hàng <span className="text-red-500">*</span>:
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  {shipmentReasonOptions.map((item) => {
                    const active = formData.shipmentReason === item.value;
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="shipmentReason"
                          checked={active}
                          onChange={() =>
                            handleFieldChange("shipmentReason", item.value)
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
          </div>
        </div>

              {/* Hình thức gửi hàng */}
              <div className="grid grid-cols-[160px_1fr] items-start gap-2">
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Hình thức gửi hàng <span className="text-red-500">*</span>:
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  {shipmentMethodOptions.map((item) => {
                    const active = formData.shipmentMethod === item.value;
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="shipmentMethod"
                          checked={active}
                          onChange={() =>
                            handleFieldChange("shipmentMethod", item.value)
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Term */}
              <div className="grid grid-cols-[160px_1fr] items-start gap-2">
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Delivery Term <span className="text-red-500">*</span>:
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  {deliveryTerms.map((item) => {
                    const active = formData.deliveryTerm === item.value;
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="deliveryTerm"
                          checked={active}
                          onChange={() =>
                            handleFieldChange("deliveryTerm", item.value)
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-center">
          <div className="flex gap-5 flex-col w-[58%]">
            {/* Thông số kiện hàng Section */}
          <div className={`${sectionCard} relative overflow-hidden border-blue-200/60 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30`}>
              {/* Decorative corner element */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-2xl"></div>
              
              <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Thông số kiện hàng
                  </h3>
                  <p className="text-sm text-slate-600">
                    Nhập thông tin từng kiện để hệ thống tính trọng lượng và chi phí
                  </p>
                </div>
              </div>
                <div className="flex items-center gap-3">
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                size="md"
                startContent={<Plus className="h-4 w-4" />}
                onPress={handleAddPackage}
              >
                Thêm kiện hàng
              </Button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all hover:scale-105"
                    aria-label="Thu gọn section"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
            </div>

              <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]">
                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                    Tên sản phẩm
                  </p>
                  <Input
                    placeholder="Ví dụ: Quần áo Jeans xuất khẩu"
                      classNames={inputClassNames}
                    value={formData.masterProductName ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("masterProductName", value)
                    }
                  />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                    DIM
                  </p>
                  <Input
                    placeholder="5000"
                      classNames={inputClassNames}
                    value={formData.dimValue ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("dimValue", value)
                    }
                  />
              </div>
            </div>

                <div className="mt-6 space-y-2">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                      className="rounded-lg border border-slate-200 bg-slate-50/30 px-3 py-2"
                    >
                      <div className="grid items-center gap-3 lg:grid-cols-[100px_100px_1fr_1fr_1fr_1fr_50px]">
                        {/* Label + STT */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-600 whitespace-nowrap">Kích thước:</span>
                          <div className="flex rounded-lg py-1 px-2 items-center justify-center border border-slate-300 bg-white text-xs font-semibold text-slate-700">
                        {index + 1}
                      </div>
                        </div>

                        {/* Đơn vị */}
                    <div>
                      <Select
                            classNames={{
                              ...selectClassNames,
                              label: "",
                              trigger: [
                                "bg-white",
                                "border-2",
                                "border-slate-200",
                                "hover:border-blue-300",
                                "data-[open=true]:border-blue-500",
                                "rounded-lg",
                                "shadow-sm",
                                "transition-all",
                                "h-9",
                                "min-h-9",
                              ],
                            }}
                        selectedKeys={[pkg.unit ?? "box"]}
                        onSelectionChange={(keys) =>
                          handlePackageChange(index, "unit", Array.from(keys)[0])
                        }
                      >
                        {packageUnitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                        {/* Dimension inputs */}
                    {dimensionFieldConfig.map(({ key, placeholder, step }) => (
                          <div key={key}>
                      <SteppedInput
                        placeholder={placeholder}
                        step={step}
                        value={pkg[key] ?? ""}
                        className='text-sm font-medium text-slate-700'
                        onChange={(value) => handlePackageChange(index, key, value)}
                      />
                          </div>
                        ))}

                        {/* Action button */}
                        <div className="flex items-center justify-center">
                      {packages.length > 1 && (
                        <button
                          type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                          onClick={() => handleRemovePackage(index)}
                          aria-label={`Xóa kiện hàng ${index + 1}`}
                              title="Xóa"
                        >
                              <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Tổng số kiện:
                </span>
                <div className="flex h-11 min-w-[80px] items-center justify-center rounded-xl bg-white px-4 text-base font-semibold text-slate-900 shadow-inner">
                  {packageSummary.totalPackages}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-3">
                <span className="font-semibold text-slate-700">
                  Tổng cân nặng Quy đổi / Tính phí (Kg):
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-11 min-w-[90px] items-center justify-center rounded-xl bg-white px-4 text-base font-semibold text-slate-900 shadow-inner">
                    {numberFormatter(packageSummary.volumetricWeight)}
                  </div>
                  <div className="flex h-11 min-w-[90px] items-center justify-center rounded-xl bg-white px-4 text-base font-semibold text-slate-900 shadow-inner">
                    {numberFormatter(packageSummary.chargeableWeight)}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Yêu cầu xử lý Section */}
            <div className={`${sectionCard} relative overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30`}>
              {/* Decorative corner element */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/10 blur-2xl"></div>
              
              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Yêu cầu xử lý
                    </h3>
                    <p className="text-sm text-slate-600">
                      Chọn đại lý và hãng vận chuyển để xử lý đơn hàng
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all hover:scale-105"
                  aria-label="Thu gọn section"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                  <Select
                  label="Chọn đại lý (nếu có)"
                  placeholder="Chọn đại lý"
                  classNames={selectClassNames}
                  selectedKeys={[formData.processingAgent ?? "ans-cargo"]}
                    onSelectionChange={(keys) =>
                    handleFieldChange("processingAgent", Array.from(keys)[0])
                    }
                  >
                  {agentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                <Select
                  label="Hãng bay"
                  placeholder="Chọn hãng bay"
                  classNames={selectClassNames}
                  selectedKeys={[formData.processingCarrier ?? "dhl-vn"]}
                  onSelectionChange={(keys) =>
                    handleFieldChange("processingCarrier", Array.from(keys)[0])
                  }
                >
                  {airlineOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Đối tác trung chuyển"
                  placeholder="Chọn đối tác"
                  classNames={selectClassNames}
                  selectedKeys={[formData.processingTransitPartner ?? "aus-post"]}
                  onSelectionChange={(keys) =>
                    handleFieldChange(
                      "processingTransitPartner",
                      Array.from(keys)[0],
                    )
                  }
                >
                  {transitPartnerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Tình trạng đơn:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {processingTagOptions.map((tag) => {
                      const active = formData.processingTag === tag.value;
                      return (
                        <label
                          key={tag.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="processingTag"
                            checked={active}
                            onChange={() => handleFieldChange("processingTag", tag.value)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {tag.label}
                          </span>
                        </label>
                      );
                    })}
                </div>
                </div>
              </div>
            </div>
          </div>
          {/* Người nhận (Receiver) Section */}
          <div className={`${sectionCard} relative overflow-hidden border-rose-200/60 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30`}>
            {/* Decorative corner element */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-rose-400/10 to-pink-400/10 blur-2xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Người nhận (Receiver)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Điền chính xác thông tin để bàn giao cho hãng vận chuyển
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-all hover:scale-105"
                aria-label="Thu gọn section"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
              </div>

            <div className="space-y-4">
                <Select
                  label="Người nhận đã lưu sẵn"
                  placeholder="Chọn người nhận"
                classNames={selectClassNames}
                  selectedKeys={[formData.savedReceiverId ?? "new"]}
                  onSelectionChange={(keys) =>
                    handleFieldChange("savedReceiverId", Array.from(keys)[0])
                  }
                >
                  {savedReceiverOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  errorMessage={errors.receiverCompany}
                  isInvalid={Boolean(errors.receiverCompany)}
                  label="Tên công ty người nhận *"
                  placeholder="KPOP Woo Chun Pyoh COMPANY"
                classNames={inputClassNames}
                  value={formData.receiverCompany ?? ""}
                  onValueChange={(value) =>
                    handleFieldChange("receiverCompany", value)
                  }
                />
              <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    isRequired
                    errorMessage={errors.receiverContact}
                    isInvalid={Boolean(errors.receiverContact)}
                    label="Tên người nhận *"
                    placeholder="Joseph"
                  classNames={inputClassNames}
                    value={formData.receiverContact ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverContact", value)
                    }
                  />
                  <Input
                    label="Số điện thoại"
                    placeholder="+12 238175859"
                  classNames={inputClassNames}
                    value={formData.receiverPhone ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverPhone", value)
                    }
                  />
                  <Input
                    label="Email"
                    placeholder="joseph.nina@gmail.com"
                  classNames={inputClassNames}
                    value={formData.receiverEmail ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverEmail", value)
                    }
                  />
                </div>
                <Input
                  isRequired
                  errorMessage={errors.receiverAddress}
                  isInvalid={Boolean(errors.receiverAddress)}
                  label="Địa chỉ người nhận *"
                  placeholder="2/1, 148 Norfolk St, Glasgow G5 9EQ, UK"
                classNames={inputClassNames}
                  value={formData.receiverAddress ?? ""}
                  onValueChange={(value) =>
                    handleFieldChange("receiverAddress", value)
                  }
                />
              <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Tỉnh / Bang"
                    placeholder="Norfolk"
                  classNames={inputClassNames}
                    value={formData.receiverState ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverState", value)
                    }
                  />
                  <Input
                    label="Thành phố"
                    placeholder="Glasgow"
                  classNames={inputClassNames}
                    value={formData.receiverCity ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverCity", value)
                    }
                  />
                <Input
                  label="Quốc gia"
                  placeholder="United Kingdom"
                  classNames={inputClassNames}
                  value={formData.receiverCountry ?? ""}
                  onValueChange={(value) =>
                    handleFieldChange("receiverCountry", value)
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Postcode"
                    placeholder="238175125"
                  classNames={inputClassNames}
                    value={formData.receiverPostal ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverPostal", value)
                    }
                  />
                  <Input
                    label="Mã khách hàng"
                    placeholder="VSXV1"
                  classNames={inputClassNames}
                    value={formData.receiverCode ?? ""}
                    onValueChange={(value) =>
                      handleFieldChange("receiverCode", value)
                    }
                  />
                </div>
                <Checkbox
                  isSelected={Boolean(formData.saveReceiver)}
                  onValueChange={(value) =>
                    handleFieldChange("saveReceiver", value)
                  }
                >
                  Lưu thông tin người nhận cho lần sau
                </Checkbox>
            </div>
          </div>
        </div>

        <div className={`${sectionCard} relative overflow-hidden border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30`}>
          {/* Decorative corner element */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-2xl"></div>
          
          <div className="relative mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Người gửi (Shipper)
              </h3>
              <p className="text-sm text-slate-600">
                Thông tin người gửi sẽ hỗ trợ đối soát và nhắc lịch lấy hàng
              </p>
            </div>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-300 transition-all hover:scale-105"
              aria-label="Thu gọn section"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4">
            <Select
              label="Người gửi đã lưu sẵn"
              placeholder="Chọn người gửi"
              classNames={selectClassNames}
              selectedKeys={[formData.savedSenderId ?? "new"]}
              onSelectionChange={(keys) =>
                handleFieldChange("savedSenderId", Array.from(keys)[0])
              }
            >
              {savedSenderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              errorMessage={errors.customerName}
              isInvalid={Boolean(errors.customerName)}
              label="Tên khách hàng *"
              placeholder="CTY NINA EXPRESS"
              classNames={inputClassNames}
              value={formData.customerName ?? ""}
              onValueChange={(value) => handleFieldChange("customerName", value)}
            />
            <Input
              isRequired
              errorMessage={errors.senderCompany}
              isInvalid={Boolean(errors.senderCompany)}
              label="Tên công ty gửi *"
              placeholder="CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ NINA"
              classNames={inputClassNames}
              value={formData.senderCompany ?? ""}
              onValueChange={(value) =>
                handleFieldChange("senderCompany", value)
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                isRequired
                errorMessage={errors.senderContact}
                isInvalid={Boolean(errors.senderContact)}
                label="Tên người gửi *"
                placeholder="Trịnh Trọng Long"
                classNames={inputClassNames}
                value={formData.senderContact ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("senderContact", value)
                }
              />
              <Input
                label="Số điện thoại"
                placeholder="0123 456 789"
                classNames={inputClassNames}
                value={formData.senderPhone ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("senderPhone", value)
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                placeholder="sender@email.com"
                classNames={inputClassNames}
                value={formData.senderEmail ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("senderEmail", value)
                }
              />
              <Input
                label="Mã khách hàng"
                placeholder="KH-001"
                classNames={inputClassNames}
                value={formData.customerCode ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("customerCode", value)
                }
              />
            </div>
            <Input
              isRequired
              errorMessage={errors.senderAddress}
              isInvalid={Boolean(errors.senderAddress)}
              label="Địa chỉ người gửi *"
              placeholder="436/8 Đường HT13, Phường Hiệp Thành, Quận 12, TP.HCM"
              classNames={inputClassNames}
              value={formData.senderAddress ?? ""}
              onValueChange={(value) =>
                handleFieldChange("senderAddress", value)
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Tỉnh / Thành phố"
                placeholder="TP. Hồ Chí Minh"
                classNames={inputClassNames}
                value={formData.senderCity ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("senderCity", value)
                }
              />
              <Input
                label="Phường / Quận"
                placeholder="Phường Hiệp Thành"
                classNames={inputClassNames}
                value={formData.senderDistrict ?? ""}
                onValueChange={(value) =>
                  handleFieldChange("senderDistrict", value)
                }
              />
            </div>
            <Checkbox
              isSelected={Boolean(formData.saveSender)}
              onValueChange={(value) => handleFieldChange("saveSender", value)}
            >
              Lưu thông tin người gửi cho lần sau
            </Checkbox>
          </div>
        </div>

        {/* Submit Section */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 px-8 py-6 shadow-xl">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-2xl"></div>
          
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Checkbox
                size="lg"
                isSelected={Boolean(formData.acceptPolicy)}
                onValueChange={(value) =>
                  handleFieldChange("acceptPolicy", value)
                }
              />
              <div className="text-sm text-slate-700 font-medium">
                Tôi đã đọc và đồng ý với{" "}
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  điều khoản sử dụng
                </span>{" "}
                của SSE Express.
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                size="lg"
                variant="bordered"
                onPress={onCancel}
              >
                Hủy bỏ
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                size="lg"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                type="submit"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Tạo đơn hàng
                </span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center space-y-2 pb-4">
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-blue-600 hover:underline cursor-pointer">Chính sách & Điều khoản</span>
            {" · "}
            <span className="text-blue-600 hover:underline cursor-pointer">Bảo mật thông tin</span>
            {" · "}
            <span className="text-blue-600 hover:underline cursor-pointer">Hỗ trợ khách hàng 24/7</span>
          </p>
          <p className="text-xs text-slate-400">
            © 2024 Saigon Speed Express. All rights reserved.
          </p>
        </div>
      </form>
    </div>
  );
}
