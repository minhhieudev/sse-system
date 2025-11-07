"use client";

import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  Plane,
} from "lucide-react";

import TotalOrdersCard from "@/components/dashboard/TotalOrdersCard";
import NotificationWidget from "@/components/dashboard/NotificationWidget";
import CountryServiceTable from "@/components/dashboard/CountryServiceTable";
import UserStatsTable from "@/components/dashboard/UserStatsTable";
import RankingBarChart from "@/components/dashboard/RankingBarChart";
import SSEStatBox from "@/components/dashboard/SSEStatBox";
import WorkflowProgressCard from "@/components/dashboard/WorkflowProgressCard";

// Mock data cho SSE Dashboard
const sseStats = {
  totalOrders: {
    value: "1,686",
    trend: "up",
    trendValue: "+12%",
    description: "Tổng đơn hàng tháng này",
  },
  revenue: {
    value: "₫95.5M",
    trend: "up",
    trendValue: "+18%",
    description: "Doanh thu tháng này",
  },
  commission: {
    value: "₫8.2M",
    trend: "up",
    trendValue: "+8%",
    description: "Hoa hồng tháng này",
  },
  activeCustomers: {
    value: "142",
    trend: "up",
    trendValue: "+5%",
    description: "Khách hàng hoạt động",
  },
  pendingPayment: {
    value: "₫22.5M",
    trend: "down",
    trendValue: "-3%",
    description: "Chờ thanh toán",
  },
  overdueDebt: {
    value: "₫7M",
    trend: "down",
    trendValue: "-15%",
    description: "Nợ quá hạn",
  },
  international: {
    value: "487",
    trend: "up",
    trendValue: "+20%",
    description: "Vận đơn quốc tế",
  },
  domestic: {
    value: "1,199",
    trend: "up",
    trendValue: "+10%",
    description: "Vận đơn nội địa",
  },
};

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <h1 className="text-xl py-2 px-6 font-black">
        Thống kê
      </h1>

      <main className="flex-1 overflow-auto p-6 relative">
        {/* Stats Grid - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
          <SSEStatBox
            color="blue"
            description={sseStats.totalOrders.description}
            icon={Package}
            title="Tổng đơn hàng"
            trend={sseStats.totalOrders.trend}
            trendValue={sseStats.totalOrders.trendValue}
            value={sseStats.totalOrders.value}
          />
          <SSEStatBox
            color="green"
            description={sseStats.revenue.description}
            icon={DollarSign}
            title="Doanh thu"
            trend={sseStats.revenue.trend}
            trendValue={sseStats.revenue.trendValue}
            value={sseStats.revenue.value}
          />
          <SSEStatBox
            color="purple"
            description={sseStats.commission.description}
            icon={TrendingUp}
            title="Hoa hồng"
            trend={sseStats.commission.trend}
            trendValue={sseStats.commission.trendValue}
            value={sseStats.commission.value}
          />
          <SSEStatBox
            color="indigo"
            description={sseStats.activeCustomers.description}
            icon={Users}
            title="Khách hàng"
            trend={sseStats.activeCustomers.trend}
            trendValue={sseStats.activeCustomers.trendValue}
            value={sseStats.activeCustomers.value}
          />
        </div>

        {/* Secondary Stats - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <SSEStatBox
            color="amber"
            description={sseStats.pendingPayment.description}
            icon={Clock}
            title="Chờ thanh toán"
            trend={sseStats.pendingPayment.trend}
            trendValue={sseStats.pendingPayment.trendValue}
            value={sseStats.pendingPayment.value}
          />
          <SSEStatBox
            color="red"
            description={sseStats.overdueDebt.description}
            icon={AlertCircle}
            title="Nợ quá hạn"
            trend={sseStats.overdueDebt.trend}
            trendValue={sseStats.overdueDebt.trendValue}
            value={sseStats.overdueDebt.value}
          />
          <SSEStatBox
            color="indigo"
            description={sseStats.international.description}
            icon={Plane}
            title="Vận đơn quốc tế"
            trend={sseStats.international.trend}
            trendValue={sseStats.international.trendValue}
            value={sseStats.international.value}
          />
          <SSEStatBox
            color="blue"
            description={sseStats.domestic.description}
            icon={Package}
            title="Vận đơn nội địa"
            trend={sseStats.domestic.trend}
            trendValue={sseStats.domestic.trendValue}
            value={sseStats.domestic.value}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Workflow Progress */}
          <div className="lg:col-span-1">
            <WorkflowProgressCard />
          </div>

          {/* Total Orders Card */}
          <div className="lg:col-span-1">
            <TotalOrdersCard />
          </div>

          {/* Notifications */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl border-2 border-slate-100 rounded-[20px] h-full p-5">
              <NotificationWidget />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white rounded-[20px] shadow-xl border-2 border-slate-100 p-6">
            <CountryServiceTable />
          </div>
          <div className="lg:col-span-5 bg-white rounded-[20px] shadow-xl border-2 border-slate-100 p-6">
            <div className="flex flex-col lg:flex-row gap-6 min-h-[320px]">
              <div className="lg:w-3/5 flex-1">
                <UserStatsTable />
              </div>
              <div className="lg:w-2/5 flex-shrink-0">
                <RankingBarChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
