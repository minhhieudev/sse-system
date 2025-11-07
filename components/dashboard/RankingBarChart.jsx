import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

import { userStats } from "./mockUserStats";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const topUsers = userStats.slice(0, 3);
const colors = ["#2563eb", "#fb923c", "#f43f5e"];
const rings = ["ring-blue-400", "ring-orange-400", "ring-rose-400"];

const data = {
  labels: topUsers.map((u) => u.name),
  datasets: [
    {
      label: "Doanh thu",
      data: topUsers.map((u) => u.revenue),
      backgroundColor: colors,
      borderRadius: 12,
      barThickness: 40,
      barPercentage: 0.8,
    },
  ],
};
const options = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (c) => [
          `${c.dataset.label}:`,
          c.raw.toLocaleString("vi-VN") + " đ",
        ],
        labelTextColor: () => "#2563eb",
      },
      displayColors: false,
      backgroundColor: "#fff",
      titleColor: "#06092b",
      bodyColor: "#1e293b",
      borderColor: "#cbd5e1",
      borderWidth: 1,
      padding: 12,
      caretPadding: 8,
    },
  },
  scales: {
    y: { display: false, beginAtZero: true },
    x: { grid: { display: false }, ticks: { display: false } },
  },
  layout: { padding: { top: 10, left: 0, right: 0, bottom: 0 } },
  maintainAspectRatio: false,
};

export default function RankingBarChart() {
  return (
    <div className="h-full flex flex-col items-center justify-between bg-white rounded-xl">
      <div className="font-bold text-sm text-slate-700 mb-3 w-full text-center pt-2">
        Top #3 trong tháng
      </div>
      <div className="w-full flex-1 relative flex flex-col justify-end pb-12">
        <div className="absolute top-0 left-0 right-0 flex justify-around px-1 z-10">
          {topUsers.map((u, i) => (
            <div
              key={u.code}
              className="flex flex-col items-center text-center"
            >
              <span
                className={`inline-block ring-2 ${rings[i]} rounded-full`}
              >
                <img
                  alt={u.name}
                  className="rounded-full w-10 h-10"
                  src={u.avatarUrl}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="h-36 mt-12">
          <Bar data={data} options={options} />
        </div>
        <div className="flex justify-around px-1 mt-2">
          {topUsers.map((u, i) => (
            <div
              key={u.code}
              className="flex flex-col items-center text-center"
            >
              <span className="text-xs font-semibold text-slate-700">
                {u.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center w-full px-3 mt-1 text-[10px] pb-2">
        <div className="text-blue-500 font-semibold">Doanh số</div>
        <div className="text-green-500 font-semibold text-right">
          Số lượng đơn hàng
        </div>
      </div>
    </div>
  );
}
