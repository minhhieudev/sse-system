"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Building2,
} from "lucide-react";

const roleConfig = {
  owner: { label: "Chủ sở hữu", color: "bg-purple-100 text-purple-800" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-800" },
  sales: { label: "NV Kinh doanh", color: "bg-green-100 text-green-800" },
  pickup: { label: "NV Pickup", color: "bg-yellow-100 text-yellow-800" },
  warehouse: { label: "NV Khai thác", color: "bg-orange-100 text-orange-800" },
  documentation: { label: "NV Chứng từ", color: "bg-pink-100 text-pink-800" },
  it_admin: { label: "IT Quản trị", color: "bg-indigo-100 text-indigo-800" },
};

const statusConfig = {
  active: { label: "Đang làm việc", color: "success" },
  inactive: { label: "Nghỉ việc", color: "danger" },
};

function withHighZIndex() {
  return {
    wrapper: "z-[9999]",
    backdrop: "z-[9998] bg-black/60 backdrop-blur-sm",
  };
}

export default function StaffDetailModal({ isOpen, staff, onClose }) {
  if (!staff) return null;

  const roleInfo = roleConfig[staff.role] || roleConfig.admin;
  const statusInfo = statusConfig[staff.status] || statusConfig.active;

  return (
    <Modal
      classNames={{
        ...withHighZIndex({
          base: "bg-white max-h-[85vh] overflow-hidden rounded-3xl shadow-xl",
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
        }),
        body: "p-0",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b-2 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg">
                    {staff.name?.charAt(0) || "N"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {staff.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-600 font-medium">
                        {staff.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                      <Chip color={statusInfo.color} size="sm" variant="flat">
                        {statusInfo.label}
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="bg-white px-6 py-6 max-h-[65vh] overflow-y-auto">
              <div className="grid auto-rows-max gap-6 lg:grid-cols-2">
                {/* Thông tin cơ bản */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-bold text-slate-800">
                      Thông tin cơ bản
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {staff.email}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">Số điện thoại</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {staff.phone}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100 md:col-span-2">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Địa chỉ</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {staff.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông tin công việc */}
                <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <h4 className="text-lg font-bold text-slate-800">
                      Thông tin công việc
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Chức vụ</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {roleInfo.label}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">Bộ phận</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {staff.department}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Ngày vào làm</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {new Date(staff.joinDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Lương cơ bản</span>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {parseInt(staff.salary || 0).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thống kê hiệu suất */}
                <div className="lg:col-span-2 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h4 className="text-lg font-bold text-slate-800">
                      Thống kê hiệu suất
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Package className="h-4 w-4" />
                        <span className="font-medium">Tổng đơn hàng</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {(staff.totalOrders || 0).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Tổng hoa hồng</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {parseInt(staff.commission || 0).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t-2 bg-slate-50">
              <Button
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                onPress={onClose}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
