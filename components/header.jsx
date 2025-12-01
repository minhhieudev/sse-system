"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navigation,
  LogOut,
  User as UserIcon,
  Shield,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";

import { siteConfig } from "../config/site.js";
import { getRoleInfo } from "../lib/auth.js";
import { useAuthStore } from "../store/useAuthStore.js";

export const Header = () => {
  const router = useRouter();
  const { trackingPlaceholder } = siteConfig;
  const [now, setNow] = useState(() => new Date());
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  const timeInfo = useMemo(() => {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(now);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const formattedDate = `${weekday}, ${day} - ${month} - ${year}`;

    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = String(hours % 12 || 12).padStart(2, "0");
    const formattedTime = `${displayHours} : ${minutes} : ${seconds} ${ampm}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }, [now]);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative flex w-full max-w-lg items-center">
            <Input
              classNames={{
                base: "w-full",
                mainWrapper: "w-full",
                inputWrapper: "h-11 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white transition-all data-[hover=true]:bg-white",
                input: "text-sm text-slate-600 placeholder:text-slate-400",
              }}
              endContent={
                <button
                  aria-label="Tìm kiếm"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-blue-500 transition-all hover:bg-blue-50"
                  type="button"
                >
                  <Navigation className="h-5 w-5" />
                </button>
              }
              placeholder={trackingPlaceholder}
              type="search"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              {timeInfo.date}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              {timeInfo.time}
            </span>
          </div>

          {/* Notification Bell */}
          <Dropdown placement="bottom-end" className="p-0">
            <DropdownTrigger>
              <Button
                aria-label="Thông báo"
                className="group relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                variant="light"
              >
                <div className="relative">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                    3
                  </span>
                </div>
              </Button>
            </DropdownTrigger>

            {/* --- DROPDOWN MENU (THÔNG BÁO) --- */}
            <DropdownMenu
              aria-label="Notification menu"
              className="relative z-10 overflow-visible min-w-[400px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl before:content-[''] before:absolute before:-top-3 before:right-6 before:border-l-[12px] before:border-r-[12px] before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-white before:z-10 after:content-[''] after:absolute after:-top-[13px] after:right-6 after:border-l-[13px] after:border-r-[13px] after:border-b-[13px] after:border-l-transparent after:border-r-transparent after:border-b-slate-200 after:z-0"
              itemClasses={{
                base: "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-blue-50 data-[hover=true]:to-indigo-50 data-[hover=true]:text-slate-900 data-[hover=true]:shadow-sm transition-all duration-200",
              }}
            >
              <DropdownItem
                key="header"
                isReadOnly
                className="h-12 mb-2 border-b border-slate-100 pb-2 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">Thông báo</p>
                  <span className="text-xs text-slate-500">3 chưa đọc</span>
                </div>
              </DropdownItem>

              <DropdownItem
                key="notif1"
                startContent={
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold shadow-md">
                      NA
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                }
              >
                <div>
                  <p className="font-semibold">Giao hàng thành công</p>
                  <p className="text-xs text-slate-500">
                    Đơn hàng AWB123456 đã được giao thành công
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    2 phút trước • Nguyễn Văn A
                  </p>
                </div>
              </DropdownItem>

              <DropdownItem
                key="notif2"
                startContent={
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold shadow-md">
                      TB
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Truck className="h-4 w-4" />
                    </div>
                  </div>
                }
              >
                <div>
                  <p className="font-semibold">Đang vận chuyển</p>
                  <p className="text-xs text-slate-500">
                    Đơn hàng AWB123457 đang trên đường vận chuyển
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    15 phút trước • Trần Thị B
                  </p>
                </div>
              </DropdownItem>

              <DropdownItem
                key="notif3"
                startContent={
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold shadow-md">
                      LC
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                }
              >
                <div>
                  <p className="font-semibold">Công nợ quá hạn</p>
                  <p className="text-xs text-slate-500">
                    Khách hàng ABC Import có công nợ quá hạn
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1 giờ trước • Lê Minh C
                  </p>
                </div>
              </DropdownItem>

              <DropdownItem
                key="view-all"
                className="mt-2 border-t border-slate-100 pt-2"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Eye className="h-4 w-4" />
                  </div>
                }
              >
                <div>
                  <p className="font-semibold">Xem tất cả thông báo</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    12 thông báo chưa đọc
                  </p>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* User Role Switcher */}

          {/* USER DROPDOWN */}
          {currentUser ? (
            <Dropdown placement="bottom-end" className="p-0">
              <DropdownTrigger>
                <Button
                  className="group flex items-center gap-2.5 rounded-lg bg-white px-2 py-1.5 text-slate-700 transition-all hover:bg-slate-50"
                  variant="light"
                >
                  {/* User Info - Text First */}
                  <div className="leading-tight text-left">
                    <p className="text-sm font-medium text-slate-700">
                      {currentUser.name || currentUser.username}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getRoleInfo(currentUser.role)?.label || currentUser.role}
                    </p>
                  </div>

                  {/* Avatar - Round Photo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                      alt={currentUser.name}
                      className="h-9 w-9 rounded-full object-cover border-2 border-blue-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 shadow-sm" />
                  </div>
                </Button>
              </DropdownTrigger>

              {/* --- DROPDOWN MENU (USER) --- */}
              <DropdownMenu
                aria-label="User menu"
                className="relative z-10 overflow-visible min-w-[400px] rounded-2xl border border-slate-200 bg-white p- shadow-xl before:content-[''] before:absolute before:-top-3 before:right-16 before:border-l-[12px] before:border-r-[12px] before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-white before:z-10 after:content-[''] after:absolute after:-top-[13px] after:right-16 after:border-l-[13px] after:border-r-[13px] after:border-b-[13px] after:border-l-transparent after:border-r-transparent after:border-b-slate-200 after:z-0"
                itemClasses={{
                  base: "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-blue-50 data-[hover=true]:to-indigo-50 data-[hover=true]:text-slate-900 data-[hover=true]:shadow-sm transition-all duration-200",
                }}
              >
                <DropdownItem
                  key="profile"
                  className="h-16 mb-2 border-b border-slate-100 pb-3"
                  description={currentUser.email}
                  startContent={
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  }
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {currentUser.name || currentUser.username}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Xem hồ sơ cá nhân
                    </p>
                  </div>
                </DropdownItem>

                <DropdownItem
                  key="role"
                  description={getRoleInfo(currentUser.role)?.description}
                  startContent={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Shield className="h-4 w-4" />
                    </div>
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Vai trò:</span>
                    <Chip
                      className="font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                      size="sm"
                      variant="flat"
                    >
                      {getRoleInfo(currentUser.role)?.label}
                    </Chip>
                  </div>
                </DropdownItem>

                <DropdownItem
                  key="settings"
                  startContent={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  }
                >
                  <div>
                    <p className="font-semibold">Cài đặt</p>
                    <p className="text-xs text-slate-500">Quản lý tài khoản</p>
                  </div>
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  className="mt-2 border-t border-slate-100 pt-2"
                  color="danger"
                  startContent={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white">
                      <LogOut className="h-4 w-4" />
                    </div>
                  }
                  onPress={handleLogout}
                >
                  <div>
                    <p className="font-semibold">Đăng xuất</p>
                    <p className="text-xs text-red-500">Thoát khỏi hệ thống</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-bold text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 relative overflow-hidden group"
              size="sm"
              startContent={
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              }
              onPress={() => router.push("/auth")}
            >
              <span className="relative z-10">Đăng nhập</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
