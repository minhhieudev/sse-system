"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building2,
  ArrowRight,
  Plane,
  Box,
  Sparkles,
} from "lucide-react";

// Mock data cho tracking
const mockTrackingData = {
  AWB123456: {
    awb: "AWB123456",
    refCode: "REF-2024-001",
    customerCode: "KH001",
    customerName: "Công ty TNHH ABC Import",
    sender: {
      company: "ABC Import Co., Ltd",
      contact: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    },
    receiver: {
      company: "XYZ Corporation",
      contact: "John Smith",
      phone: "+1 555-0123",
      address: "123 Main Street, New York, NY 10001, USA",
    },
    service: "DHL Express Worldwide",
    status: "delivering",
    estimatedDelivery: "2024-11-05",
    weight: 15.5,
    dimensions: "50x40x30 cm",
    packages: 3,
    currentStatus: "Đang vận chuyển quốc tế",
    timeline: [
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
        description: "Khai thác đã đóng gói, trọng lượng 15.5kg",
        staff: "Hoàng Văn F",
        timestamp: "2024-10-29 10:20",
        status: "completed",
      },
      {
        step: 4,
        title: "Nhập giá & Báo giá",
        description: "NV Kinh doanh đã gửi báo giá cho khách",
        staff: "Trần Thị B",
        timestamp: "2024-10-29 15:45",
        status: "completed",
      },
      {
        step: 5,
        title: "Thanh toán",
        description: "Khách hàng đã thanh toán thành công",
        timestamp: "2024-10-30 11:00",
        status: "completed",
      },
      {
        step: 6,
        title: "Xử lý chứng từ",
        description: "Đã gửi Bill DHL cho khách hàng",
        staff: "Phan Thị H",
        timestamp: "2024-10-30 16:30",
        status: "completed",
      },
      {
        step: 7,
        title: "Đang vận chuyển",
        description: "Hàng đang trên đường đến điểm đích",
        timestamp: "2024-10-31 08:00",
        status: "in_progress",
      },
      {
        step: 8,
        title: "Giao hàng thành công",
        description: "Dự kiến giao hàng",
        timestamp: "2024-11-05",
        status: "pending",
      },
    ],
  },
  "REF-2024-001": {
    awb: "AWB123456",
    refCode: "REF-2024-001",
    customerCode: "KH001",
    customerName: "Công ty TNHH ABC Import",
    sender: {
      company: "ABC Import Co., Ltd",
      contact: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    },
    receiver: {
      company: "XYZ Corporation",
      contact: "John Smith",
      phone: "+1 555-0123",
      address: "123 Main Street, New York, NY 10001, USA",
    },
    service: "DHL Express Worldwide",
    status: "delivering",
    estimatedDelivery: "2024-11-05",
    weight: 15.5,
    dimensions: "50x40x30 cm",
    packages: 3,
    currentStatus: "Đang vận chuyển quốc tế",
    timeline: [
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
        description: "Khai thác đã đóng gói, trọng lượng 15.5kg",
        staff: "Hoàng Văn F",
        timestamp: "2024-10-29 10:20",
        status: "completed",
      },
      {
        step: 4,
        title: "Nhập giá & Báo giá",
        description: "NV Kinh doanh đã gửi báo giá cho khách",
        staff: "Trần Thị B",
        timestamp: "2024-10-29 15:45",
        status: "completed",
      },
      {
        step: 5,
        title: "Thanh toán",
        description: "Khách hàng đã thanh toán thành công",
        timestamp: "2024-10-30 11:00",
        status: "completed",
      },
      {
        step: 6,
        title: "Xử lý chứng từ",
        description: "Đã gửi Bill DHL cho khách hàng",
        staff: "Phan Thị H",
        timestamp: "2024-10-30 16:30",
        status: "completed",
      },
      {
        step: 7,
        title: "Đang vận chuyển",
        description: "Hàng đang trên đường đến điểm đích",
        timestamp: "2024-10-31 08:00",
        status: "in_progress",
      },
      {
        step: 8,
        title: "Giao hàng thành công",
        description: "Dự kiến giao hàng",
        timestamp: "2024-11-05",
        status: "pending",
      },
    ],
  },
};

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    ring: "ring-green-500",
  },
  in_progress: {
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-100",
    ring: "ring-blue-500",
  },
  pending: {
    icon: Clock,
    color: "text-slate-400",
    bg: "bg-slate-100",
    ring: "ring-slate-300",
  },
};

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingNumber.toUpperCase()];

      if (data) {
        setTrackingData(data);
        setNotFound(false);
      } else {
        setTrackingData(null);
        setNotFound(true);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
                Tra cứu Vận đơn
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Theo dõi hành trình đơn hàng theo thời gian thực
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 relative">
        <div className="space-y-6">
          {/* Search Section - Enhanced */}
          <Card className="shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
            <CardBody className="p-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    classNames={{
                      inputWrapper:
                        "h-14 border-2 border-slate-300 hover:border-blue-500 bg-white shadow-sm",
                      input: "text-base",
                    }}
                    placeholder="Nhập mã vận đơn (AWB hoặc REF Code)..."
                    size="lg"
                    startContent={
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-slate-400" />
                        <div className="h-6 w-px bg-slate-300" />
                      </div>
                    }
                    value={trackingNumber}
                    onKeyPress={handleKeyPress}
                    onValueChange={setTrackingNumber}
                  />
                </div>
                <Button
                  className="h-14 px-10 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  endContent={<ArrowRight className="h-6 w-6" />}
                  isLoading={isSearching}
                  size="lg"
                  onPress={handleSearch}
                >
                  Tra cứu ngay
                </Button>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Tra cứu miễn phí 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Cập nhật realtime</span>
                  </div>
                </div>
                <div className="font-mono text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full font-semibold border border-blue-200">
                  VD: AWB123456 hoặc REF-2024-001
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Not Found State */}
        {notFound && (
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl">
            <CardBody className="p-12 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <Package className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-red-900">
                Không tìm thấy vận đơn
              </h3>
              <p className="text-red-700 mb-6 max-w-md mx-auto">
                Vui lòng kiểm tra lại mã vận đơn hoặc liên hệ bộ phận chăm sóc
                khách hàng để được hỗ trợ
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  color="danger"
                  startContent={<Phone className="h-4 w-4" />}
                  variant="flat"
                >
                  Hotline: (028) 1234 5678
                </Button>
                <Button
                  color="danger"
                  startContent={<Mail className="h-4 w-4" />}
                  variant="flat"
                >
                  support@sse.vn
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Card - More attractive */}
            <Card className="shadow-xl border-2 border-slate-100 bg-white">
              <CardBody className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg">
                      <Box className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-slate-900">
                          {trackingData.awb}
                        </h2>
                        <Chip
                          className="font-semibold"
                          color="primary"
                          size="lg"
                          variant="flat"
                        >
                          {trackingData.refCode}
                        </Chip>
                      </div>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-semibold">
                          {trackingData.customerName}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Chip
                    className="font-bold px-4 py-3"
                    color="warning"
                    size="lg"
                    startContent={<Truck className="h-5 w-5" />}
                    variant="flat"
                  >
                    {trackingData.currentStatus}
                  </Chip>
                </div>

                {/* Info Grid - More modern */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Số kiện
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          {trackingData.packages}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white shadow-sm">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Trọng lượng
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          {trackingData.weight} kg
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm">
                        <Plane className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Dịch vụ
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {trackingData.service}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Dự kiến giao
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {new Date(
                            trackingData.estimatedDelivery,
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Sender & Receiver - Side by side with arrow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-2 border-slate-100 bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Người gửi
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Building2,
                        label: "Công ty",
                        value: trackingData.sender.company,
                      },
                      {
                        icon: User,
                        label: "Người liên hệ",
                        value: trackingData.sender.contact,
                      },
                      {
                        icon: Phone,
                        label: "Điện thoại",
                        value: trackingData.sender.phone,
                      },
                      {
                        icon: MapPin,
                        label: "Địa chỉ",
                        value: trackingData.sender.address,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                          <item.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-medium mb-0.5">
                            {item.label}
                          </p>
                          <p className="font-semibold text-slate-900">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-xl border-2 border-slate-100 bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Người nhận
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Building2,
                        label: "Công ty",
                        value: trackingData.receiver.company,
                      },
                      {
                        icon: User,
                        label: "Người liên hệ",
                        value: trackingData.receiver.contact,
                      },
                      {
                        icon: Phone,
                        label: "Điện thoại",
                        value: trackingData.receiver.phone,
                      },
                      {
                        icon: MapPin,
                        label: "Địa chỉ",
                        value: trackingData.receiver.address,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                          <item.icon className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-medium mb-0.5">
                            {item.label}
                          </p>
                          <p className="font-semibold text-slate-900">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Timeline - More visual */}
            <Card className="shadow-xl border-2 border-slate-100 bg-white">
              <CardBody className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Hành trình vận chuyển
                    </h3>
                    <p className="text-sm text-slate-600">
                      Theo dõi chi tiết từng bước xử lý
                    </p>
                  </div>
                </div>

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-20" />

                  {/* Timeline Items */}
                  <div className="space-y-4">
                    {trackingData.timeline.map((item, index) => {
                      const StatusIcon = statusConfig[item.status].icon;
                      const isActive = item.status === "in_progress";

                      return (
                        <div key={item.step} className="relative flex gap-6">
                          {/* Icon with ring animation for active */}
                          <div className="relative z-[1]">
                            <div
                              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${statusConfig[item.status].bg} ${
                                isActive
                                  ? `ring-4 ${statusConfig[item.status].ring} ring-offset-2 animate-pulse`
                                  : ""
                              } shadow-lg`}
                            >
                              <StatusIcon
                                className={`h-8 w-8 ${statusConfig[item.status].color}`}
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <Card
                              className={`${isActive ? "ring-2 ring-blue-500 shadow-xl" : "shadow-md"} hover:shadow-lg transition-shadow`}
                            >
                              <CardBody className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="text-lg font-bold text-slate-900">
                                        {item.title}
                                      </h4>
                                      <Chip
                                        className="font-semibold"
                                        color={
                                          item.status === "completed"
                                            ? "success"
                                            : item.status === "in_progress"
                                              ? "primary"
                                              : "default"
                                        }
                                        size="sm"
                                        variant="flat"
                                      >
                                        Bước {item.step}
                                      </Chip>
                                    </div>
                                    <p className="text-slate-600 mb-3">
                                      {item.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-mono">
                                          {item.timestamp}
                                        </span>
                                      </div>
                                      {item.staff && (
                                        <div className="flex items-center gap-1">
                                          <User className="h-4 w-4" />
                                          <span className="font-medium">
                                            {item.staff}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Footer CTA */}
            <Card className="bg-blue-500 border-0 shadow-xl">
              <CardBody className="p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Cần hỗ trợ?</h3>
                <p className="text-blue-100 mb-6">
                  Liên hệ với chúng tôi để được tư vấn và hỗ trợ
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-white text-blue-600 font-semibold hover:bg-blue-50"
                    size="lg"
                    startContent={<Phone className="h-5 w-5" />}
                  >
                    (028) 1234 5678
                  </Button>
                  <Button
                    className="border-2 border-white text-white hover:bg-white/10"
                    size="lg"
                    startContent={<Mail className="h-5 w-5" />}
                    variant="bordered"
                  >
                    support@sse.vn
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
