/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Save, X, Package, User, MapPin, Truck, Plus } from "lucide-react";

const carrierOptions = [
  { code: "SSE", name: "SSE Express" },
  { code: "GHN", name: "Giao Hàng Nhanh" },
  { code: "GHTK", name: "Giao Hàng Tiết Kiệm" },
];

const statusOptions = [
  { value: "ready", label: "Ready" },
  { value: "incoming", label: "Nhận hàng" },
  { value: "ready-to-go", label: "Ready to go" },
  { value: "delivering", label: "Đang phát hàng" },
  { value: "completed", label: "Hoàn tất" },
];

const OrderFormModal = memo(function OrderFormModal({
  isOpen,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    awb: "",
    refCode: "",
    customerCode: "",
    customerName: "",
    senderCompany: "",
    senderContact: "",
    receiverCompany: "",
    receiverContact: "",
    receiverAddress: "",
    carrierCode: "SSE",
    statusKey: "ready",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  // Refs for input focus management
  const awbRef = useRef(null);
  const refCodeRef = useRef(null);
  const customerCodeRef = useRef(null);
  const customerNameRef = useRef(null);
  const senderCompanyRef = useRef(null);
  const senderContactRef = useRef(null);
  const receiverCompanyRef = useRef(null);
  const receiverContactRef = useRef(null);
  const receiverAddressRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Generate new codes
      const timestamp = Date.now().toString().slice(-8);

      setFormData({
        awb: `SSE${timestamp.slice(-6)}`,
        refCode: `REF-2024-${timestamp.slice(-4)}`,
        customerCode: "",
        customerName: "",
        senderCompany: "",
        senderContact: "",
        receiverCompany: "",
        receiverContact: "",
        receiverAddress: "",
        carrierCode: "SSE",
        statusKey: "ready",
      });
    }
    setErrors({});
  }, [isOpen]);

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

  // Focus management - prevent focus loss during typing
  useEffect(() => {
    if (awbRef.current && formData.awb) {
      awbRef.current.focus();
    }
  }, [formData.awb]);

  useEffect(() => {
    if (refCodeRef.current && formData.refCode) {
      refCodeRef.current.focus();
    }
  }, [formData.refCode]);

  useEffect(() => {
    if (customerCodeRef.current && formData.customerCode) {
      customerCodeRef.current.focus();
    }
  }, [formData.customerCode]);

  useEffect(() => {
    if (customerNameRef.current && formData.customerName) {
      customerNameRef.current.focus();
    }
  }, [formData.customerName]);

  useEffect(() => {
    if (senderCompanyRef.current && formData.senderCompany) {
      senderCompanyRef.current.focus();
    }
  }, [formData.senderCompany]);

  useEffect(() => {
    if (senderContactRef.current && formData.senderContact) {
      senderContactRef.current.focus();
    }
  }, [formData.senderContact]);

  useEffect(() => {
    if (receiverCompanyRef.current && formData.receiverCompany) {
      receiverCompanyRef.current.focus();
    }
  }, [formData.receiverCompany]);

  useEffect(() => {
    if (receiverContactRef.current && formData.receiverContact) {
      receiverContactRef.current.focus();
    }
  }, [formData.receiverContact]);

  useEffect(() => {
    if (receiverAddressRef.current && formData.receiverAddress) {
      receiverAddressRef.current.focus();
    }
  }, [formData.receiverAddress]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim())
      newErrors.customerName = "Tên khách hàng là bắt buộc";
    if (!formData.senderCompany.trim())
      newErrors.senderCompany = "Đơn vị gửi là bắt buộc";
    if (!formData.receiverCompany.trim())
      newErrors.receiverCompany = "Đơn vị nhận là bắt buộc";
    if (!formData.receiverAddress.trim())
      newErrors.receiverAddress = "Địa chỉ nhận là bắt buộc";

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
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Only clear error for this field if it exists
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      }

      return prev;
    });
  }, []); // No dependencies to prevent re-creation

  if (!isOpen) return null;

  const modalContent = (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
      role="dialog"
      style={{ zIndex: 2147483647 }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out"
        style={{
          zIndex: 2147483648,
          animation: "modalSlideIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tạo đơn hàng demo
              </h2>
              <p className="text-sm text-slate-600">
                Nhập dữ liệu mẫu để trình bày quy trình xử lý đơn
              </p>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Info Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Thông tin cơ bản
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  ref={awbRef}
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
                  }}
                  label="Mã AWB"
                  placeholder="SSE123456"
                  startContent={
                    <span className="text-xs font-mono text-blue-600">#</span>
                  }
                  value={formData.awb}
                  onValueChange={(value) =>
                    handleChange("awb", value.toUpperCase())
                  }
                />
                <Input
                  ref={refCodeRef}
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
                  }}
                  label="REF Code"
                  placeholder="REF2024-001"
                  startContent={
                    <span className="text-xs font-mono text-slate-600">
                      REF
                    </span>
                  }
                  value={formData.refCode}
                  onValueChange={(value) =>
                    handleChange("refCode", value.toUpperCase())
                  }
                />
                <Input
                  ref={customerCodeRef}
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
                  }}
                  label="Mã khách hàng"
                  placeholder="KH001"
                  value={formData.customerCode}
                  onValueChange={(value) =>
                    handleChange("customerCode", value.toUpperCase())
                  }
                />
                <Input
                  ref={customerNameRef}
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
                  }}
                  errorMessage={errors.customerName}
                  isInvalid={!!errors.customerName}
                  label="Tên khách hàng"
                  placeholder="Công ty TNHH ABC"
                  value={formData.customerName}
                  onValueChange={(value) => handleChange("customerName", value)}
                />
              </div>
            </div>

            {/* Sender Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">
                  Thông tin người gửi
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  ref={senderCompanyRef}
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200",
                  }}
                  errorMessage={errors.senderCompany}
                  isInvalid={!!errors.senderCompany}
                  label="Đơn vị gửi"
                  placeholder="SSE – Kho Tân Bình"
                  value={formData.senderCompany}
                  onValueChange={(value) =>
                    handleChange("senderCompany", value)
                  }
                />
                <Input
                  ref={senderContactRef}
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200",
                  }}
                  label="Liên hệ gửi"
                  placeholder="Nguyễn Văn A"
                  value={formData.senderContact}
                  onValueChange={(value) =>
                    handleChange("senderContact", value)
                  }
                />
              </div>
            </div>

            {/* Receiver Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">
                  Thông tin người nhận
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  ref={receiverCompanyRef}
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200",
                  }}
                  errorMessage={errors.receiverCompany}
                  isInvalid={!!errors.receiverCompany}
                  label="Đơn vị nhận"
                  placeholder="Alpha Logistics USA"
                  value={formData.receiverCompany}
                  onValueChange={(value) =>
                    handleChange("receiverCompany", value)
                  }
                />
                <Input
                  ref={receiverContactRef}
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    input: "placeholder:text-slate-400",
                    inputWrapper:
                      "border-slate-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200",
                  }}
                  label="Liên hệ nhận"
                  placeholder="John Smith"
                  value={formData.receiverContact}
                  onValueChange={(value) =>
                    handleChange("receiverContact", value)
                  }
                />
                <div className="md:col-span-2">
                  <Input
                    ref={receiverAddressRef}
                    isRequired
                    classNames={{
                      label: "text-sm font-medium text-slate-700",
                      input: "placeholder:text-slate-400",
                      inputWrapper:
                        "border-slate-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200",
                    }}
                    errorMessage={errors.receiverAddress}
                    isInvalid={!!errors.receiverAddress}
                    label="Địa chỉ nhận hàng"
                    placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                    value={formData.receiverAddress}
                    onValueChange={(value) =>
                      handleChange("receiverAddress", value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Shipment Details Section */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">
                  Chi tiết vận chuyển
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    trigger:
                      "border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200",
                  }}
                  label="Hãng vận chuyển"
                  placeholder="Chọn hãng vận chuyển"
                  selectedKeys={[formData.carrierCode]}
                  onSelectionChange={(keys) =>
                    handleChange("carrierCode", Array.from(keys)[0])
                  }
                >
                  {carrierOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-slate-700",
                    trigger:
                      "border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200",
                  }}
                  label="Trạng thái xử lý"
                  placeholder="Chọn trạng thái"
                  selectedKeys={[formData.statusKey]}
                  onSelectionChange={(keys) =>
                    handleChange("statusKey", Array.from(keys)[0])
                  }
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
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
                Tạo đơn demo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

OrderFormModal.displayName = "OrderFormModal";

export default OrderFormModal;

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
