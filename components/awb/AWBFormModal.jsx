/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Save,
  X,
  Package,
  User,
  MapPin,
  Plane,
  Box,
  Globe,
  Truck,
} from "lucide-react";

const serviceOptions = [
  {
    value: "dhl_express",
    label: "DHL Express Worldwide",
    carrier: "DHL",
    estimatedDays: "2-3",
  },
  {
    value: "fedex_priority",
    label: "FedEx International Priority",
    carrier: "FedEx",
    estimatedDays: "1-2",
  },
  {
    value: "ups_express",
    label: "UPS Worldwide Express",
    carrier: "UPS",
    estimatedDays: "2-4",
  },
  {
    value: "sse_economy",
    label: "SSE Economy (Nội địa)",
    carrier: "SSE",
    estimatedDays: "3-5",
  },
  {
    value: "sse_standard",
    label: "SSE Standard (Nội địa)",
    carrier: "SSE",
    estimatedDays: "2-3",
  },
];

const awbTypeOptions = [
  { value: "international", label: "Quốc tế", icon: Plane },
  { value: "domestic", label: "Nội địa", icon: Truck },
];

const cargoTypeOptions = [
  { value: "documents", label: "Thư từ / Tài liệu" },
  { value: "parcel", label: "Hàng hóa thông thường" },
  { value: "fragile", label: "Hàng dễ vỡ" },
  { value: "valuable", label: "Hàng giá trị cao" },
];

export default function AWBFormModal({ isOpen, onClose, awb = null, onSave }) {
  const [formData, setFormData] = useState({
    awbCode: "",
    refCode: "",
    type: "international",
    service: "dhl_express",
    cargoType: "documents",

    // Sender
    senderName: "",
    senderCompany: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderCountry: "Vietnam",

    // Receiver
    receiverName: "",
    receiverCompany: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",
    receiverCountry: "",

    // Cargo
    weight: "",
    length: "",
    width: "",
    height: "",
    pieces: "1",
    description: "",
    declaredValue: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (awb) {
      setFormData(awb);
    } else {
      // Generate new codes
      const timestamp = Date.now().toString().slice(-8);

      setFormData({
        awbCode: `AWB${timestamp}`,
        refCode: `REF-2024-${timestamp.slice(-4)}`,
        type: "international",
        service: "dhl_express",
        cargoType: "documents",
        senderName: "",
        senderCompany: "",
        senderPhone: "",
        senderAddress: "",
        senderCity: "TP. Hồ Chí Minh",
        senderCountry: "Vietnam",
        receiverName: "",
        receiverCompany: "",
        receiverPhone: "",
        receiverAddress: "",
        receiverCity: "",
        receiverCountry: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        pieces: "1",
        description: "",
        declaredValue: "",
      });
    }
    setErrors({});
  }, [awb, isOpen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {};

    // Sender validation
    if (!formData.senderName.trim())
      newErrors.senderName = "Tên người gửi là bắt buộc";
    if (!formData.senderPhone.trim())
      newErrors.senderPhone = "SĐT người gửi là bắt buộc";
    if (!formData.senderAddress.trim())
      newErrors.senderAddress = "Địa chỉ gửi là bắt buộc";

    // Receiver validation
    if (!formData.receiverName.trim())
      newErrors.receiverName = "Tên người nhận là bắt buộc";
    if (!formData.receiverPhone.trim())
      newErrors.receiverPhone = "SĐT người nhận là bắt buộc";
    if (!formData.receiverAddress.trim())
      newErrors.receiverAddress = "Địa chỉ nhận là bắt buộc";
    if (!formData.receiverCountry.trim())
      newErrors.receiverCountry = "Quốc gia nhận là bắt buộc";

    // Cargo validation
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = "Trọng lượng phải lớn hơn 0";
    }
    if (!formData.description.trim())
      newErrors.description = "Mô tả hàng hóa là bắt buộc";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const awbData = {
        ...formData,
        id: awb?.id || `AWB_${Date.now()}`,
        status: awb?.status || "pending",
        createdAt: awb?.createdAt || new Date().toISOString(),
      };

      onSave(awbData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const selectedService = serviceOptions.find(
    (s) => s.value === formData.service,
  );

  if (!isOpen) return null;

  const modalContent = (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
      role="dialog"
      style={{ zIndex: 2147483647 }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      tabIndex={-1}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out"
        style={{
          zIndex: 2147483648,
          animation: "modalSlideIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {awb ? "Chỉnh sửa Vận đơn" : "Tạo Vận đơn mới"}
              </h2>
              <p className="text-sm text-slate-600">
                {awb
                  ? `${awb.awbCode} • ${awb.refCode}`
                  : "Điền đầy đủ thông tin để tạo vận đơn"}
              </p>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* AWB Info Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Thông tin Vận đơn
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Input
                    isReadOnly
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      input: "text-slate-900",
                      inputWrapper: "border border-slate-300 bg-slate-50",
                    }}
                    label="Mã AWB"
                    startContent={
                      <span className="text-xs font-mono text-blue-600">#</span>
                    }
                    value={formData.awbCode}
                  />
                </div>
                <div className="md:col-span-1">
                  <Input
                    isReadOnly
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      input: "text-slate-900",
                      inputWrapper: "border border-slate-300 bg-slate-50",
                    }}
                    label="REF Code"
                    startContent={
                      <span className="text-xs font-mono text-slate-600">
                        REF
                      </span>
                    }
                    value={formData.refCode}
                  />
                </div>
                <div className="md:col-span-1">
                  <Select
                    isRequired
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      trigger: "border border-slate-300 bg-white",
                    }}
                    label="Loại vận đơn"
                    selectedKeys={[formData.type]}
                    onSelectionChange={(keys) =>
                      handleChange("type", Array.from(keys)[0])
                    }
                  >
                    {awbTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Select
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    trigger: "border border-slate-300 bg-white",
                  }}
                  label="Dịch vụ vận chuyển"
                  selectedKeys={[formData.service]}
                  onSelectionChange={(keys) =>
                    handleChange("service", Array.from(keys)[0])
                  }
                >
                  {serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                {selectedService && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Nhà cung cấp:</span>
                      <span className="font-medium text-slate-900">
                        {selectedService.carrier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-600">Thời gian dự kiến:</span>
                      <span className="font-medium text-slate-900">
                        {selectedService.estimatedDays} ngày
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sender Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">
                  Thông tin Người gửi
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
                  errorMessage={errors.senderName}
                  isInvalid={!!errors.senderName}
                  label="Tên người gửi"
                  placeholder="Nguyễn Văn A"
                  value={formData.senderName}
                  onValueChange={(value) => handleChange("senderName", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Công ty"
                  placeholder="ABC Company"
                  value={formData.senderCompany}
                  onValueChange={(value) => handleChange("senderCompany", value)}
                />
                <Input
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  errorMessage={errors.senderPhone}
                  isInvalid={!!errors.senderPhone}
                  label="Số điện thoại"
                  placeholder="0901234567"
                  value={formData.senderPhone}
                  onValueChange={(value) => handleChange("senderPhone", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Thành phố"
                  placeholder="TP. Hồ Chí Minh"
                  value={formData.senderCity}
                  onValueChange={(value) => handleChange("senderCity", value)}
                />
                <div className="md:col-span-2">
                  <Input
                    isRequired
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      input: "placeholder:text-slate-400",
                      inputWrapper: "border border-slate-300 bg-white",
                    }}
                    errorMessage={errors.senderAddress}
                    isInvalid={!!errors.senderAddress}
                    label="Địa chỉ đầy đủ"
                    placeholder="123 Nguyễn Huệ, Q.1"
                    value={formData.senderAddress}
                    onValueChange={(value) => handleChange("senderAddress", value)}
                  />
                </div>
              </div>
            </div>

            {/* Receiver Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">
                  Thông tin Người nhận
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
                  errorMessage={errors.receiverName}
                  isInvalid={!!errors.receiverName}
                  label="Tên người nhận"
                  placeholder="John Smith"
                  value={formData.receiverName}
                  onValueChange={(value) => handleChange("receiverName", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Công ty"
                  placeholder="XYZ Corporation"
                  value={formData.receiverCompany}
                  onValueChange={(value) => handleChange("receiverCompany", value)}
                />
                <Input
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  errorMessage={errors.receiverPhone}
                  isInvalid={!!errors.receiverPhone}
                  label="Số điện thoại"
                  placeholder="+1 555-0123"
                  value={formData.receiverPhone}
                  onValueChange={(value) => handleChange("receiverPhone", value)}
                />
                <Input
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  errorMessage={errors.receiverCountry}
                  isInvalid={!!errors.receiverCountry}
                  label="Quốc gia"
                  placeholder="United States"
                  startContent={<Globe className="h-4 w-4 text-slate-400" />}
                  value={formData.receiverCountry}
                  onValueChange={(value) => handleChange("receiverCountry", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Thành phố"
                  placeholder="New York"
                  value={formData.receiverCity}
                  onValueChange={(value) => handleChange("receiverCity", value)}
                />
                <div className="md:col-span-2">
                  <Input
                    isRequired
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      input: "placeholder:text-slate-400",
                      inputWrapper: "border border-slate-300 bg-white",
                    }}
                    errorMessage={errors.receiverAddress}
                    isInvalid={!!errors.receiverAddress}
                    label="Địa chỉ đầy đủ"
                    placeholder="123 Main Street, NY 10001"
                    value={formData.receiverAddress}
                    onValueChange={(value) => handleChange("receiverAddress", value)}
                  />
                </div>
              </div>
            </div>

            {/* Cargo Section */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-2 mb-6">
                <Box className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">
                  Thông tin Hàng hóa
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <Input
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  errorMessage={errors.weight}
                  isInvalid={!!errors.weight}
                  label="Trọng lượng (kg)"
                  placeholder="15.5"
                  step="0.1"
                  type="number"
                  value={formData.weight}
                  onValueChange={(value) => handleChange("weight", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Dài (cm)"
                  placeholder="50"
                  type="number"
                  value={formData.length}
                  onValueChange={(value) => handleChange("length", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Rộng (cm)"
                  placeholder="40"
                  type="number"
                  value={formData.width}
                  onValueChange={(value) => handleChange("width", value)}
                />
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Cao (cm)"
                  placeholder="30"
                  type="number"
                  value={formData.height}
                  onValueChange={(value) => handleChange("height", value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Số kiện"
                  placeholder="1"
                  type="number"
                  value={formData.pieces}
                  onValueChange={(value) => handleChange("pieces", value)}
                />
                <Select
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    trigger: "border border-slate-300 bg-white",
                  }}
                  label="Loại hàng"
                  selectedKeys={[formData.cargoType]}
                  onSelectionChange={(keys) =>
                    handleChange("cargoType", Array.from(keys)[0])
                  }
                >
                  {cargoTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  label="Giá trị (USD)"
                  placeholder="1000"
                  startContent={<span className="text-slate-400">$</span>}
                  type="number"
                  value={formData.declaredValue}
                  onValueChange={(value) => handleChange("declaredValue", value)}
                />
              </div>
              <div className="mt-6">
                <Input
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper: "border border-slate-300 bg-white",
                  }}
                  errorMessage={errors.description}
                  isInvalid={!!errors.description}
                  label="Mô tả hàng hóa"
                  placeholder="Electronics, Documents, etc."
                  value={formData.description}
                  onValueChange={(value) => handleChange("description", value)}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-slate-200 bg-white sticky bottom-0">
          <button
            className="px-8 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
            type="button"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {awb ? "Cập nhật" : "Tạo vận đơn"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Add CSS animation styles
const styles = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");

  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
