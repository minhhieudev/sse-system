"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";

const customerTypes = [
  { value: "enterprise", label: "Doanh nghiệp" },
  { value: "business", label: "Hộ kinh doanh" },
  { value: "individual", label: "Cá nhân" },
];

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngưng hoạt động" },
];

export default function CustomerFormModal({
  isOpen,
  onClose,
  customer = null,
  onSave,
}) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "enterprise",
    contact: "",
    phone: "",
    email: "",
    address: "",
    salesPerson: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        code: customer.code || "",
        name: customer.name || "",
        type: customer.type || "enterprise",
        contact: customer.contact || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        salesPerson: customer.salesPerson || "",
        status: customer.status || "active",
      });
    } else {
      // Reset form for new customer
      setFormData({
        code: `KH${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        name: "",
        type: "enterprise",
        contact: "",
        phone: "",
        email: "",
        address: "",
        salesPerson: "",
        status: "active",
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
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

    if (!formData.name.trim()) {
      newErrors.name = "Tên khách hàng là bắt buộc";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Người liên hệ là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const customerData = {
        ...formData,
        id: customer?.id || `CUST${Date.now()}`,
        totalOrders: customer?.totalOrders || 0,
        totalRevenue: customer?.totalRevenue || 0,
        debt: customer?.debt || 0,
        createdAt: customer?.createdAt || new Date().toISOString(),
      };

      onSave(customerData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{ zIndex: 2147483647 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{ zIndex: 2147483648 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {customer
                      ? `Mã KH: ${customer.code}`
                      : "Điền thông tin khách hàng"}
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
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Info Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">
                      Thông tin cơ bản
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      isReadOnly
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "text-slate-900",
                        inputWrapper: "border border-slate-300 bg-slate-50",
                      }}
                      label="Mã khách hàng"
                      startContent={
                        <span className="text-xs font-mono text-blue-600">
                          KH
                        </span>
                      }
                      value={formData.code}
                    />
                    <Select
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        trigger: "border border-slate-300 bg-white",
                      }}
                      label="Loại khách hàng"
                      selectedKeys={[formData.type]}
                      onSelectionChange={(keys) =>
                        handleChange("type", Array.from(keys)[0])
                      }
                    >
                      {customerTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="md:col-span-2">
                      <Input
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                          input: "placeholder:text-slate-400",
                          inputWrapper: "border border-slate-300 bg-white",
                        }}
                        errorMessage={errors.name}
                        isInvalid={!!errors.name}
                        label="Tên khách hàng"
                        placeholder="Nhập tên công ty hoặc cá nhân"
                        value={formData.name}
                        onValueChange={(value) => handleChange("name", value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Phone className="h-5 w-5 text-green-600" />
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
                      errorMessage={errors.contact}
                      isInvalid={!!errors.contact}
                      label="Người liên hệ"
                      placeholder="Nhập tên người liên hệ"
                      value={formData.contact}
                      onValueChange={(value) => handleChange("contact", value)}
                    />
                    <Input
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      errorMessage={errors.phone}
                      isInvalid={!!errors.phone}
                      label="Số điện thoại"
                      placeholder="0901234567"
                      startContent={<Phone className="h-4 w-4 text-slate-400" />}
                      value={formData.phone}
                      onValueChange={(value) => handleChange("phone", value)}
                    />
                    <div className="md:col-span-2">
                      <Input
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                          input: "placeholder:text-slate-400",
                          inputWrapper: "border border-slate-300 bg-white",
                        }}
                        errorMessage={errors.email}
                        isInvalid={!!errors.email}
                        label="Email"
                        placeholder="example@company.com"
                        startContent={<Mail className="h-4 w-4 text-slate-400" />}
                        type="email"
                        value={formData.email}
                        onValueChange={(value) => handleChange("email", value)}
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
                        errorMessage={errors.address}
                        isInvalid={!!errors.address}
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ đầy đủ"
                        startContent={<MapPin className="h-4 w-4 text-slate-400" />}
                        value={formData.address}
                        onValueChange={(value) => handleChange("address", value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">
                      Thông tin bổ sung
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        input: "placeholder:text-slate-400",
                        inputWrapper: "border border-slate-300 bg-white",
                      }}
                      label="Nhân viên phụ trách"
                      placeholder="Nhập tên NV kinh doanh"
                      value={formData.salesPerson}
                      onValueChange={(value) => handleChange("salesPerson", value)}
                    />
                    <Select
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-slate-700",
                        trigger: "border border-slate-300 bg-white",
                      }}
                      label="Trạng thái"
                      selectedKeys={[formData.status]}
                      onSelectionChange={(keys) =>
                        handleChange("status", Array.from(keys)[0])
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

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                type="button"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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
                    <Save className="w-4 h-4" />
                    {customer ? "Cập nhật" : "Thêm mới"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
