"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderCreationForm from "@/components/orders/OrderCreationForm";
import { showInfo, showSuccess } from "@/lib/toast";

const carrierOptions = [
  { code: "SSE", name: "SSE Express" },
  { code: "GHN", name: "Giao Hàng Nhanh" },
  { code: "GHTK", name: "Giao Hàng Tiết Kiệm" },
];

const defaultOrderForm = () => {
  const suffix = String(Date.now()).slice(-6);

  return {
    awb: `SSE${suffix}`,
    refCode: `REF${suffix}`,
    customerCode: "",
    customerName: "",
    senderCompany: "",
    senderContact: "",
    senderPhone: "",
    senderEmail: "",
    senderAddress: "",
    senderCity: "",
    senderDistrict: "",
    receiverCompany: "",
    receiverContact: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverAddress: "",
    receiverCity: "",
    receiverPostal: "",
    receiverCode: "",
    statusKey: "ready",
    carrierCode: "SSE",
    serviceCode: "fedex-sin",
    serviceDetail: "express",
    branchCode: "hcm",
    extraServices: [],
    shipmentType: "pack",
    shipmentReason: "commercial",
    shipmentMethod: "pickup",
    deliveryTerm: "ddu",
    masterProductName: "",
    dimValue: "",
    packages: [
      {
        id: "pkg-1",
        name: "",
        quantity: "1",
        unit: "box",
        length: "",
        width: "",
        height: "",
        weight: "",
      },
    ],
    saveSender: false,
    saveReceiver: false,
    acceptPolicy: false,
  };
};

export default function OrderCreatePage() {
  const router = useRouter();
  const [newOrderForm, setNewOrderForm] = useState(defaultOrderForm());
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when page loads
  useEffect(() => {
    setNewOrderForm(defaultOrderForm());
    setErrors({});
  }, []);

  const handleOrderFormChange = (field, value) => {
    setNewOrderForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmitCreateOrder = async () => {
    const requiredFields = [
      ["customerName", "tên khách hàng"],
      ["senderCompany", "đơn vị gửi"],
      ["senderContact", "tên người gửi"],
      ["senderAddress", "địa chỉ người gửi"],
      ["receiverCompany", "đơn vị nhận"],
      ["receiverContact", "tên người nhận"],
      ["receiverAddress", "địa chỉ nhận"],
    ];

    const nextErrors = {};
    let firstMissingLabel = null;

    requiredFields.forEach(([field, label]) => {
      if (!newOrderForm[field]?.trim()) {
        nextErrors[field] = `Vui lòng nhập ${label}.`;
        if (!firstMissingLabel) {
          firstMissingLabel = label;
        }
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (firstMissingLabel) {
        showInfo(`Vui lòng nhập ${firstMissingLabel}.`);
      }
      return;
    }

    if (!newOrderForm.acceptPolicy) {
      showInfo("Vui lòng đồng ý với điều khoản sử dụng trước khi tiếp tục.");
      return;
    }

    setIsCreating(true);
    const now = new Date();
    const carrier =
      carrierOptions.find((item) => item.code === newOrderForm.carrierCode) ??
      carrierOptions[0];

    const order = {
      id: `LOCAL-${now.getTime()}`,
      awb:
        newOrderForm.awb?.trim() || `SSE${String(now.getTime()).slice(-6)}`,
      refCode:
        newOrderForm.refCode?.trim() || `REF${String(now.getTime()).slice(-6)}`,
      carrier,
      createdAt: now.toISOString(),
      expectedDeliveryAt: new Date(
        now.getTime() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      statusKey: newOrderForm.statusKey,
      statusLabel: "Ready",
      statusTone: "new",
      sender: {
        company: newOrderForm.senderCompany,
        contact: newOrderForm.senderContact || "N/A",
      },
      receiver: {
        company: newOrderForm.receiverCompany,
        contact: newOrderForm.receiverContact || "N/A",
        address: newOrderForm.receiverAddress,
      },
    };

    // In a real app, this would be an API call
    // For now, we'll just simulate success and redirect back to orders
    setTimeout(() => {
      setIsCreating(false);
      setErrors({});
      showSuccess(`Đã tạo đơn hàng ${order.awb}`);
      showInfo("Đơn hàng sẽ được xử lý trong thời gian sớm nhất.");
      router.push("/order");
    }, 1000);
  };

  const handleCancel = () => {
    router.push("/order");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <OrderCreationForm
        data={newOrderForm}
        errors={errors}
        isSubmitting={isCreating}
        onCancel={handleCancel}
        onChange={handleOrderFormChange}
        onSubmit={handleSubmitCreateOrder}
      />
    </div>
  );
}
