import { Lock, Bell, User2 } from "lucide-react";

import { notifications } from "./mockNotifications";

const colorMap = {
  warning: "bg-[#FFCB2E]/90 text-[#F8B400]", // vàng
  info: "bg-[#B3F1DD]/90 text-[#20B486]", // xanh mint
  success: "bg-[#B3F1DD]/90 text-[#20B486]", // dùng xanh mint cho success nếu muốn
};

export default function NotificationWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold text-slate-900">
          Thông báo mới
        </span>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Xem tất cả
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-slate-500 bg-slate-50">
              <th className="py-2 px-3 font-semibold text-left">Tiêu đề</th>
              <th className="py-2 px-3 font-semibold text-left">Người tạo</th>
              <th className="py-2 px-3 font-semibold text-left">Thời gian</th>
              <th className="py-2 px-3 font-semibold text-left">Loại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notifications.map((noti) => (
              <tr
                key={noti.id}
                className="hover:bg-slate-50 transition cursor-pointer"
              >
                <td className="py-2 px-3">
                  <a
                    className="text-blue-700 font-medium hover:underline flex items-center gap-2"
                    href="#"
                  >
                    {noti.title}
                    {noti.locked && (
                      <Lock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    )}
                  </a>
                </td>
                <td className="py-2 px-3">
                  <span className="flex items-center gap-1.5">
                    <User2 className="w-4 h-4 text-slate-400" />
                    <span>{noti.user}</span>
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-500">{noti.time}</td>
                <td className="py-2 px-3">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${colorMap[noti.type]}`}
                  >
                    <Bell className="w-5 h-5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
