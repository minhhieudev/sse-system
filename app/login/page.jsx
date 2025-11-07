"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building2,
  LogIn,
  Shield,
  User,
  Truck,
  Package,
  FileText,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

// Mock users với các vai trò khác nhau
const mockUsers = [
  {
    email: "hiennhan@sse.vn",
    password: "admin123",
    role: "owner",
    name: "Hiển Nhân",
    title: "Chủ sở hữu",
    permissions: "Toàn quyền hệ thống",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
  },
  {
    email: "myvan@sse.vn",
    password: "admin123",
    role: "admin",
    name: "Mỹ Vân",
    title: "Admin",
    permissions: "Xem & sử dụng tất cả chức năng",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
  },
  {
    email: "sales@sse.vn",
    password: "demo123",
    role: "sales",
    name: "Trần Thị B",
    title: "NV Kinh doanh",
    permissions: "Quản lý khách hàng & đơn hàng",
    icon: User,
    color: "from-green-500 to-emerald-500",
  },
  {
    email: "pickup@sse.vn",
    password: "demo123",
    role: "pickup",
    name: "Nguyễn Văn D",
    title: "NV Pickup",
    permissions: "Nhận hàng tại khách",
    icon: Truck,
    color: "from-orange-500 to-amber-500",
  },
  {
    email: "warehouse@sse.vn",
    password: "demo123",
    role: "warehouse",
    name: "Hoàng Văn F",
    title: "NV Khai thác",
    permissions: "Đóng gói & kiểm đếm",
    icon: Package,
    color: "from-indigo-500 to-purple-500",
  },
  {
    email: "documentation@sse.vn",
    password: "demo123",
    role: "documentation",
    name: "Phan Thị H",
    title: "NV Chứng từ",
    permissions: "Xử lý chứng từ & tracking",
    icon: FileText,
    color: "from-pink-500 to-rose-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        // Save user to localStorage (fake auth)
        localStorage.setItem(
          "sse_user",
          JSON.stringify({
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: [user.permissions],
          }),
        );

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Email hoặc mật khẩu không đúng!");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleQuickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError("");

    // Auto submit
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === userEmail);

      if (user) {
        localStorage.setItem(
          "sse_user",
          JSON.stringify({
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: [user.permissions],
          }),
        );
        router.push("/dashboard");
      }
    }, 300);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

        <div className="relative z-10 flex flex-col justify-center text-white w-full">
          {/* Logo & Title */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-md px-7 py-5 rounded-2xl border border-white/30 mb-10 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-blue-600 shadow-2xl">
                <Building2 className="h-9 w-9" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  SSE Express
                </h1>
                <p className="text-sm text-blue-100 font-medium">
                  Saigon Speed Express
                </p>
              </div>
            </div>

            <h2 className="text-6xl font-bold leading-tight mb-8 tracking-tight">
              Hệ thống quản lý
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                vận đơn chuyên nghiệp
              </span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed font-medium max-w-xl">
              Giải pháp toàn diện cho dịch vụ giao nhận quốc tế & nội địa
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                icon: Sparkles,
                text: "Quy trình 6 bước minh bạch",
                color: "from-yellow-400 to-orange-400",
              },
              {
                icon: Check,
                text: "Tính hoa hồng tự động",
                color: "from-green-400 to-emerald-400",
              },
              {
                icon: Check,
                text: "Phân quyền theo vai trò",
                color: "from-blue-400 to-cyan-400",
              },
              {
                icon: Check,
                text: "Tracking thời gian thực",
                color: "from-purple-400 to-pink-400",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-5 group hover:translate-x-2 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} backdrop-blur shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-semibold">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-y-auto">
        <div className="w-full max-w-md relative z-10 my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_20px_60px_rgba(79,70,229,0.4)]">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              SSE Express
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Đăng nhập vào hệ thống
            </p>
          </div>

          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/50 bg-white/95 backdrop-blur-md rounded-3xl transition-all duration-500 relative overflow-hidden">
            {/* Decorative gradient top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <CardBody className="p-6 lg:p-8">
              <div className="mb-6 relative">
                <div className="absolute -left-2 top-0 w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                  Đăng nhập hệ thống
                </h2>
                <p className="text-slate-600 text-sm font-medium">
                  Chọn tài khoản demo hoặc nhập thông tin của bạn
                </p>
              </div>

              {/* Quick Login Accounts */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                    <p className="text-xs font-bold text-slate-900">
                      Tài khoản demo - Click để đăng nhập
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mockUsers.slice(0, 2).map((account, idx) => {
                    const Icon = account.icon;

                    return (
                      <button
                        key={account.email}
                        className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 hover:border-transparent hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
                        style={{ animationDelay: `${idx * 100}ms` }}
                        type="button"
                        onClick={() =>
                          handleQuickLogin(account.email, account.password)
                        }
                      >
                        {/* Gradient glow on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${account.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                        />

                        <div className="relative">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${account.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                          >
                            <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <div className="text-center relative">
                          <p className="font-bold text-slate-900 text-xs mb-1">
                            {account.name}
                          </p>
                          <p className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold group-hover:bg-slate-200 transition-colors duration-300">
                            {account.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <details className="group/details">
                  <summary className="cursor-pointer list-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-blue-600 hover:text-blue-700 font-bold rounded-xl hover:bg-blue-50/50 transition-all duration-300">
                    <span>Xem thêm {mockUsers.length - 2} tài khoản khác</span>
                    <ArrowRight className="h-3.5 w-3.5 group-open/details:rotate-90 transition-transform duration-300" />
                  </summary>
                  <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    {mockUsers.slice(2).map((account, idx) => {
                      const Icon = account.icon;

                      return (
                        <button
                          key={account.email}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200/80 bg-gradient-to-r from-white to-slate-50/30 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-x-1 transition-all duration-300 group relative overflow-hidden"
                          style={{ animationDelay: `${idx * 50}ms` }}
                          type="button"
                          onClick={() =>
                            handleQuickLogin(account.email, account.password)
                          }
                        >
                          {/* Hover gradient */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${account.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                          />

                          <div className="relative">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${account.color} text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="flex-1 text-left relative">
                            <p className="font-bold text-slate-900 text-xs mb-0.5">
                              {account.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {account.title}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </button>
                      );
                    })}
                  </div>
                </details>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 py-1 text-xs text-slate-600 font-bold rounded-full border border-slate-200/50 shadow-sm">
                    hoặc đăng nhập bằng email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                  <div className="rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 p-3 text-xs text-red-700 font-medium shadow-lg shadow-red-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    htmlFor="login-email"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    Email đăng nhập
                  </label>
                  <div className="group relative">
                    {/* Animated gradient glow */}
                    <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-lg transition-all duration-500 group-focus-within:opacity-70 group-focus-within:blur-xl animate-gradient" />

                    {/* Background with glassmorphism */}
                    <div className="relative">
                      <Input
                        isRequired
                        aria-label="Email đăng nhập"
                        classNames={{
                          base: "relative",
                          innerWrapper: "bg-transparent",
                          inputWrapper:
                            "h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-sm transition-all duration-300 group-focus-within:border-transparent group-focus-within:bg-white group-focus-within:shadow-2xl group-focus-within:scale-[1.02] data-[hover=true]:border-slate-300 px-4",
                          input:
                            "text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal",
                        }}
                        id="login-email"
                        placeholder="example@sse.vn"
                        size="lg"
                        startContent={
                          <div className="flex items-center justify-center w-11 h-11 -ml-3 mr-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 group-focus-within:from-blue-200 group-focus-within:to-indigo-200 transition-all duration-300">
                            <Mail className="h-5 w-5 text-blue-600 group-focus-within:scale-110 transition-transform duration-300" />
                          </div>
                        }
                        type="email"
                        value={email}
                        variant="flat"
                        onValueChange={setEmail}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    htmlFor="login-password"
                  >
                    <Lock className="h-3.5 w-3.5 text-purple-600" />
                    Mật khẩu
                  </label>
                  <div className="group relative">
                    {/* Animated gradient glow */}
                    <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 blur-lg transition-all duration-500 group-focus-within:opacity-70 group-focus-within:blur-xl animate-gradient" />

                    {/* Background with glassmorphism */}
                    <div className="relative">
                      <Input
                        isRequired
                        aria-label="Mật khẩu đăng nhập"
                        classNames={{
                          base: "relative",
                          innerWrapper: "bg-transparent",
                          inputWrapper:
                            "h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-sm transition-all duration-300 group-focus-within:border-transparent group-focus-within:bg-white group-focus-within:shadow-2xl group-focus-within:scale-[1.02] data-[hover=true]:border-slate-300 px-4",
                          input:
                            "text-sm font-medium text-slate-900 tracking-[0.2em]",
                        }}
                        endContent={
                          <button
                            aria-label={
                              showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                            }
                            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4.5 w-4.5" />
                            ) : (
                              <Eye className="h-4.5 w-4.5" />
                            )}
                          </button>
                        }
                        id="login-password"
                        placeholder="••••••••"
                        size="lg"
                        startContent={
                          <div className="flex items-center justify-center w-11 h-11 -ml-3 mr-3 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 group-focus-within:from-purple-200 group-focus-within:to-pink-200 transition-all duration-300">
                            <Lock className="h-5 w-5 text-purple-600 group-focus-within:scale-110 transition-transform duration-300" />
                          </div>
                        }
                        type={showPassword ? "text" : "password"}
                        value={password}
                        variant="flat"
                        onValueChange={setPassword}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-bold text-sm text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden group"
                    endContent={
                      !isLoading && (
                        <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      )
                    }
                    isLoading={isLoading}
                    size="lg"
                    type="submit"
                  >
                    <span className="relative z-10">Đăng nhập ngay</span>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200/30">
                  <p className="text-center text-xs text-slate-700 font-medium flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-base">💡</span>
                    <span className="flex items-center gap-1.5 flex-wrap justify-center">
                      <span>Mật khẩu:</span>
                      <code className="px-2 py-0.5 rounded-lg bg-white/80 backdrop-blur-sm font-mono font-bold text-blue-600 border border-blue-200/50 shadow-sm text-[10px]">
                        admin123
                      </code>
                      <span>hoặc</span>
                      <code className="px-2 py-0.5 rounded-lg bg-white/80 backdrop-blur-sm font-mono font-bold text-purple-600 border border-purple-200/50 shadow-sm text-[10px]">
                        demo123
                      </code>
                    </span>
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 font-medium">
              © 2024{" "}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Saigon Speed Express
              </span>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
