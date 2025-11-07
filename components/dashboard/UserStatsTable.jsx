import { userStats } from "./mockUserStats";

function money(n) {
  if (n === 0) return "0 d";
  return n.toLocaleString("vi-VN").replace(/\./g, ',') + " d";
}

export default function UserStatsTable() {
  return (
    <div className="overflow-x-auto w-full">
      <div className="font-bold text-sm text-slate-700 mb-3">
        Thống kê nhân sự kinh doanh
      </div>
      <table className="min-w-full text-xs bg-white">
        <thead>
          <tr className="text-[11px] text-slate-500 bg-slate-50/50">
            <th className="py-2 px-2 text-left font-medium">Nhân viên</th>
            <th className="py-2 px-1 text-center font-medium">SL đơn hàng</th>
            <th className="py-2 px-1 text-center font-medium">Cân nặng</th>
            <th className="py-2 px-2 text-right font-medium">Doanh thu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {userStats.map((u, i) => (
            <tr
              key={u.code}
              className="hover:bg-slate-50/30 transition-colors duration-150"
            >
              <td className="py-2 px-2">
                <div className="text-xs">
                  <span className="font-medium text-slate-800">
                    {u.name}
                  </span>
                  <span className="text-slate-500"> - {u.code}</span>
                </div>
              </td>
              <td className="py-2 px-1 text-center text-xs align-middle">
                <span className="font-semibold text-blue-600">{u.orders} đơn</span>
              </td>
              <td className="py-2 px-1 text-center align-middle">
                <span className="text-xs font-semibold text-slate-800">
                  {u.weight} / {u.totalWeight} Kg
                </span>
              </td>
              <td className="py-2 px-2 text-xs font-semibold text-green-600 text-right align-middle">
                {money(u.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
