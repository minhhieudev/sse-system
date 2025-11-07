import { Copy, Filter, TrendingUp } from "lucide-react";

const mock = {
  total: 132,
  percent: "+11,01%",
  details: [
    {
      label: "Doanh thu:",
      value: "728,418,900đ",
      badge: "82 đơn hàng",
      badgeColor: "bg-green-100 text-green-700",
      dotColor: "border-green-500",
      textColor: "text-green-600",
    },
    {
      label: "Phụ phí:",
      value: "128,312,000đ",
      badge: "64 đơn hàng",
      badgeColor: "bg-amber-100 text-amber-600",
      dotColor: "border-amber-400",
      textColor: "text-amber-500",
    },
    {
      label: "Chưa thanh toán:",
      value: "38,224,900đ",
      badge: "11 đơn hàng",
      badgeColor: "bg-red-100 text-red-700",
      dotColor: "border-red-500",
      textColor: "text-red-600",
    },
  ],
};

export default function TotalOrdersCard() {
  return (
    <div className="h-full flex flex-col shadow-xl border-2 border-slate-100 bg-white rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-blue-400 font-bold text-sm">Doanh thu</span>
        <button className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
          <p>Lọc dữ liệu thống kê</p>
          <div className="bg-cyan-50 rounded-lg p-1">
            <Filter className="w-3.5 h-3.5 text-black hover:cursor-pointer" />
          </div>
        </button>
      </div>

      {/* Tổng đơn hàng section */}
      <div className="mb-4 bg-cyan-50 rounded-2xl shadow-sm border border-cyan-100/50 p-5">
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-xs font-medium mb-1">
            Tổng đơn hàng
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Copy className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-5xl font-bold text-slate-900">
            {mock.total}
          </span>
          <div className="flex justify-end gap-1 text-green-600 font-semibold text-sm">
            <span>{mock.percent}</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Chi tiết 3 dòng */}
      <div className="space-y-3">
        {mock.details.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full border-[5px] ${d.dotColor} flex-shrink-0`}
              />
              <span className={`font-medium text-sm ${d.textColor}`}>
                {d.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-semibold text-sm">
                {d.value}
              </span>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${d.badgeColor}`}
              >
                {d.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
