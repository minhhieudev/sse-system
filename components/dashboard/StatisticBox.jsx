export default function StatisticBox({
  title,
  value,
  unit,
  icon,
  color = "sky",
  percentChange,
  percentColor = "",
  action,
  subRows = [], // mảng { label, value, color, badge, ... }
  faded = false,
}) {
  return (
    <div
      className={`rounded-xl shadow p-4 h-full bg-white flex flex-col ${
        faded ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="uppercase text-xs font-semibold tracking-wide mb-2 text-slate-400 flex-1">
          {title}
        </div>
        {icon && <div className="ml-2 text-xl text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && (
          <span className="font-medium text-base text-slate-500">{unit}</span>
        )}
        {percentChange !== undefined && (
          <span className={`ml-2 text-sm font-semibold ${percentColor}`}>
            {percentChange}
          </span>
        )}
      </div>
      {subRows.length > 0 && (
        <div className="mt-2 space-y-1">
          {subRows.map((row, i) => (
            <div key={i} className="flex items-center text-xs justify-between">
              <div
                className={`flex items-center ${row.dotColor ? "gap-1" : ""}`}
              >
                {row.dotColor && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1`}
                    style={{ background: row.dotColor }}
                  />
                )}
                <span className="text-slate-500">{row.label}</span>
              </div>
              <div>
                {row.badge ? (
                  <span
                    className={`ml-2 px-2 py-0.5 bg-${row.badgeColor || "slate"}-100 text-${row.badgeColor || "slate"}-700 rounded-lg text-xs font-semibold`}
                  >
                    {row.badge}
                  </span>
                ) : (
                  <span className="font-bold text-slate-700">{row.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
