"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  PlusCircle,
  CreditCard,
  BarChart3,
  Users,
  MapPin,
  UserPlus,
  UserCheck,
  Building,
  Settings,
  Settings2,
  FileText,
  FolderTree,
  Globe,
  Store,
  ChevronLeft,
  ChevronRight,
  Plane,
  GitBranch,
  DollarSign,
  Bell,
  Search as SearchIcon,
} from "lucide-react";

import { siteConfig } from "../config/site.js";
import { useLayoutStore } from "../store/useLayoutStore.js";

const { name, shortName } = siteConfig;

const iconMap = {
  dashboard: BarChart3,
  orders: Package,
  awb: Plane,
  workflow: GitBranch,
  tracking: SearchIcon,
  debt: CreditCard,
  commission: DollarSign,
  reports: BarChart3,
  customers: Users,
  staff: UserCheck,
  "quick-order": PlusCircle,
  addresses: MapPin,
  collaborators: UserPlus,
  sales: UserCheck,
  internal: Building,
  managers: Settings,
  services: FileText,
  units: FolderTree,
  categories: FolderTree,
  countries: Globe,
  agents: Store,
  notifications: Bell,
  system: Settings2,
  rates: DollarSign,
  // Fallback
  default: FileText,
};

const menuItemConfig = {
  dashboard: { icon: "dashboard", path: "/dashboard" },
  orders: { icon: "orders", path: "/order" },
  "quick-order": { icon: "quick-order", path: "/quick-order" },
  debt: { icon: "debt", path: "/debt" },
  reports: { icon: "reports", path: "/reports" },
  awb: { icon: "awb", path: "/awb" },
  tracking: { icon: "tracking", path: "/tracking" },
  workflow: { icon: "workflow", path: "/workflow" },
  commission: { icon: "commission", path: "/commission" },
  customers: { icon: "customers", path: "/customers" },
  staff: { icon: "staff", path: "/staff" },
  addresses: { icon: "addresses", path: "/addresses" },
  collaborators: { icon: "collaborators", path: "/collaborators" },
  sales: { icon: "sales", path: "/sales" },
  internal: { icon: "internal", path: "/internal" },
  managers: { icon: "managers", path: "/managers" },
  services: { icon: "services", path: "/services" },
  units: { icon: "units", path: "/units" },
  categories: { icon: "categories", path: "/categories" },
  countries: { icon: "countries", path: "/countries" },
  agents: { icon: "agents", path: "/agents" },
  notifications: { icon: "notifications", path: "/notifications" },
  system: { icon: "system", path: "/system" },
  rates: { icon: "rates", path: "/rates" },
};

const baseSections =
  siteConfig.navigationSections?.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const metadata =
        menuItemConfig[item.id] ?? {
          icon: "default",
          path: "/" + item.id,
        };

      return {
        ...item,
        ...metadata,
      };
    }),
  })) ?? [];

// Normalize HR (Nhân sự) section labels and grouping without touching siteConfig
const HR_IDS = ["staff", "managers", "internal", "sales"];
const hrSection = {
  title: "NHÂN SỰ",
  items: [
    { id: "staff", label: "Danh sách nhân sự", badge: "NV", ...menuItemConfig["staff"] },
    { id: "managers", label: "Quản trị & phê duyệt", badge: "QL", ...menuItemConfig["managers"] },
    { id: "internal", label: "Đội nhóm nội bộ", badge: "NB", ...menuItemConfig["internal"] },
    { id: "sales", label: "Nhân sự kinh doanh", badge: "KD", ...menuItemConfig["sales"] },
  ],
};

const navigationSections = (() => {
  const filtered = baseSections.filter((section) => section.title !== "NHÂN SỰ");
  return [
    ...filtered.slice(0, 3),
    hrSection,
    ...filtered.slice(3),
  ];
})();

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "relative hidden h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:flex",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
          <Link
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            href="/dashboard"
          >
            {shortName}
          </Link>
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900">{name}</p>
              <p className="truncate text-xs text-slate-500">
                Khách hàng & Logistics
              </p>
            </div>
          )}

          {/* Toggle Button */}
          <button
            aria-label={sidebarCollapsed ? "Mở sidebar" : "Đóng sidebar"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            type="button"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (pathname === "/" && item.path === "/dashboard");
                  const Icon = iconMap[item.icon] || iconMap.default;

                  return (
                    <li key={item.id}>
                      <Link
                        className={clsx(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                        href={item.path}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon
                          className={clsx(
                            "h-5 w-5 shrink-0 transition-colors",
                            isActive
                              ? "text-blue-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          )}
                        />
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      <div className="lg:hidden">{/* Mobile menu button can be added here */}</div>
    </>
  );
};
