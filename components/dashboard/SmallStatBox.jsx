export default function SmallStatBox({
  title,
  value,
  valueSub,
  percent,
  percentColor = "",
  icon,
  bg = "",
  borderColor = "",
  textColor = "text-slate-900",
  unit = "",
  percentOnBottom = false,
}) {
  return (
    <div
      className={`relative rounded-[20px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.15)] px-6 py-5 flex flex-col border-l-[5px] ${borderColor} ${bg} h-full transition-all duration-200 justify-between`}
    >
      {/* Icon góc phải lớn */}
      {icon && (
        <div className="absolute top-4 right-5 text-2xl opacity-70">{icon}</div>
      )}
      {/* Title */}
      <span className="uppercase text-slate-500 text-[11px] font-bold mb-2 tracking-wider">
        {title}
      </span>
      {/* Value + unit */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className={`text-[2.5rem] font-black ${textColor} leading-none`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold mb-0.5 text-slate-600">
            {unit}
          </span>
        )}
        {valueSub && (
          <span className="text-sm font-semibold text-green-600 ml-1">
            {valueSub}
          </span>
        )}
      </div>
      {/* Percent dưới value */}
      {percent && (
        <span className={`block mt-2 text-base font-bold ${percentColor}`}>
          {percent}
        </span>
      )}
    </div>
  );
}
