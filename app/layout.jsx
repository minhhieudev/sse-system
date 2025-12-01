"use client";

import "@/styles/globals.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { Providers } from "./providers";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname.startsWith("/auth");
  const isTrackingPage = pathname === "/tracking";

  return (
    <html suppressHydrationWarning lang="vi">
      <head>
        <title>SSE Express - Hệ thống quản lý vận đơn</title>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-slate-100 font-sans text-slate-900 antialiased",
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {isLoginPage || isTrackingPage ? (
            // Full page layout for login and tracking
            children
          ) : (
            // App layout with sidebar and header
            <div className="flex gap-0 h-screen bg-slate-50">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                  {children}
                </main>
              </div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
