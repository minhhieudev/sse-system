"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

import { useLayoutStore } from "@/store/useLayoutStore";
import { siteConfig } from "@/config/site";
import { PlusSquareIcon, RefreshIcon } from "@/components/icons";

const STATUS_META = {
  all: { label: "Tat ca", tone: "default" },
  ready: { label: "Ready", tone: "info" },
  incoming: { label: "Nhan hang", tone: "secondary" },
  "ready-to-go": { label: "Ready to go", tone: "info" },
  delivering: { label: "Dang phat hang", tone: "warning" },
  cancelled: { label: "Huy", tone: "danger" },
  returning: { label: "Dang chuyen hoan", tone: "danger" },
  issue: { label: "Su co", tone: "danger" },
  completed: { label: "Hoan tat", tone: "success" },
};

const ORDERS = [
  {
    id: "1",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "ZIP EXPRESS",
    createdAt: "15/08/2024",
    createdTime: "12:33",
    status: "ready",
    statusLabel: "Moi tao don",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "ZIP EXPRESS",
    address: "34330 Pinewoods Cir #205, Romulus, MI 48174",
  },
  {
    id: "2",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "MIEN TAY EXPRESS",
    createdAt: "15/08/2024",
    createdTime: "16:12",
    status: "incoming",
    statusLabel: "Da xac nhan",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Hiep Thanh Rubber Inc Corp",
    address: "620 Maddox Road, Griffin, GA 30225, USA",
  },
  {
    id: "3",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "DAC HOI EXPRESS",
    createdAt: "15/08/2024",
    createdTime: "14:28",
    status: "delivering",
    statusLabel: "Dang xu ly hang",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Hiep Thanh Rubber Inc Corp",
    address: "620 Maddox Road, Griffin, GA 30225, USA",
  },
  {
    id: "4",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "ANH DAO EXPRESS",
    createdAt: "15/08/2024",
    createdTime: "21:11",
    status: "incoming",
    statusLabel: "Doi phe duyet",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Ly The Vinh",
    address: "3 Menusa Dr, Oceanside, CA 92058, USA",
  },
  {
    id: "5",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "NINA EXPRESS",
    createdAt: "15/08/2024",
    createdTime: "10:15",
    status: "returning",
    statusLabel: "Dang phat hang",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Nina Express",
    address: "3178 Henderson Walk, Doraville, GA 30340, USA",
  },
  {
    id: "6",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "VAU POST",
    createdAt: "15/08/2024",
    createdTime: "12:15",
    status: "completed",
    statusLabel: "Cap ben",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Hiep Thanh Rubber Inc Corp",
    address: "3178 Henderson Walk, Doraville, GA 30340, USA",
  },
  {
    id: "7",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "KANGO POST",
    createdAt: "15/08/2024",
    createdTime: "15:11",
    status: "completed",
    statusLabel: "Hoan thanh",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Dang Van Cuong",
    address: "3178 Henderson Walk, Doraville, GA 30340, Australia",
  },
  {
    id: "8",
    awb: "2410235261",
    refCode: "1ZSYW1730491854782",
    customer: "ANS CARGO",
    createdAt: "15/08/2024",
    createdTime: "15:11",
    status: "completed",
    statusLabel: "Hoan thanh",
    sender: "Cong ty TNHH TM va DV NINA",
    receiver: "Dang Van Cuong",
    address: "3178 Henderson Walk, Doraville, GA 30340, USA",
  },
];

const fetchOrders = async (status) => {
  await new Promise((resolve) => setTimeout(resolve, 280));

  if (status === "all") {
    return ORDERS;
  }

  return ORDERS.filter((order) => order.status === status);
};

const statusPillStyles = {
  default: "bg-slate-100 text-slate-600",
  info: "bg-blue-100 text-blue-600",
  danger: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
  secondary: "bg-violet-100 text-violet-600",
};

export const OrderBoard = () => {
  const { selectedStatus } = useLayoutStore();
  const { data, isFetching } = useQuery({
    queryKey: ["orders", selectedStatus],
    queryFn: () => fetchOrders(selectedStatus),
    keepPreviousData: true,
  });

  const statusTitle = useMemo(
    () => STATUS_META[selectedStatus]?.label ?? "Tat ca",
    [selectedStatus],
  );

  return (
    <div className="rounded-3xl bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
            Danh sach don hang
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            {statusTitle}
          </h1>
          <p className="text-sm text-slate-500">
            {isFetching
              ? "Dang cap nhat du lieu..."
              : `Hien thi ${data?.length ?? 0} don`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
            type="button"
          >
            <PlusSquareIcon className="text-white" />
            Tao don nhanh
          </button>
          <button
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            type="button"
          >
            <RefreshIcon className="text-inherit" />
            Lam moi
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl">
        <div className="grid grid-cols-[48px,140px,1fr,150px,140px,1fr] items-center border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="flex items-center justify-center">
            <input
              aria-label="Chon tat ca"
              className="h-5 w-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              type="checkbox"
            />
          </div>
          <span>Ma AWB / REF Code</span>
          <span>Ten khach hang</span>
          <span>Ngay tao / Ngay xuat</span>
          <span>Trang thai xu ly</span>
          <span>Thong tin giao nhan</span>
        </div>

        <div className="divide-y divide-slate-100">
          {(data ?? []).map((order) => {
            const tone = STATUS_META[order.status]?.tone ?? "default";
            const pillStyle =
              statusPillStyles[tone] ?? statusPillStyles.default;

            return (
              <div
                key={order.id}
                className="grid grid-cols-[48px,140px,1fr,150px,140px,1fr] items-center gap-3 px-6 py-4 text-sm text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center justify-center">
                  <input
                    aria-label={`Chon don ${order.awb}`}
                    className="h-5 w-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                    type="checkbox"
                  />
                </div>
                <div className="flex flex-col text-slate-800">
                  <span className="font-semibold text-blue-600">
                    {order.awb}
                  </span>
                  <span className="text-xs text-slate-400">
                    {order.refCode}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {order.customer}
                  </p>
                  <p className="text-xs text-slate-500">
                    Nguoi nhan: {order.receiver}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">
                    {order.createdAt}
                  </p>
                  <p className="text-xs text-slate-500">{order.createdTime}</p>
                </div>
                <div>
                  <span
                    className={clsx(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      pillStyle,
                    )}
                  >
                    {order.statusLabel}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{order.sender}</p>
                  <p className="text-xs text-slate-500">{order.address}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
        <p>
          Hien thi {(data ?? []).length} don - Tong{" "}
          {siteConfig.orderStatuses[0].count} don
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            type="button"
          >
            Trang truoc
          </button>
          <button
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            type="button"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};
