'use client';
import { useState } from "react";
import { countryServices } from "./mockCountryServices";

export default function CountryServiceTable() {
  const [expandedCountries, setExpandedCountries] = useState({});

  const toggleExpand = (countryName) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryName]: !prev[countryName]
    }));
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-slate-700">Quốc gia sử dụng dịch vụ</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">Tên quốc gia</th>
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">SL đơn hàng</th>
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">Cân nặng tính phí</th>
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">Doanh thu</th>
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">Tỷ suất</th>
              <th className="pb-3 px-3 text-left text-xs font-medium text-slate-500">Tỷ lệ giao</th>
            </tr>
          </thead>
          <tbody>
            {countryServices.map((country, index) => {
              const firstService = country.services[0];
              const isExpanded = expandedCountries[country.name];
              const hasMoreServices = country.services.length > 1;

              return (
                <>
                  {/* Main country row */}
                  <tr key={country.name} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        {country.avatarUrl && (
                          <img 
                            src={country.avatarUrl} 
                            alt={country.name} 
                            className="rounded-full w-7 h-7 object-cover"
                          />
                        )}
                        <span className="text-base">{country.flag}</span>
                        <span className="text-sm font-medium text-slate-900">{country.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium">
                        {firstService?.badge || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-semibold text-slate-900">{firstService?.chargedW || '-'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-bold text-slate-900">{firstService?.revenue || '-'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-medium text-slate-900">{firstService?.tisuat || '67%'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{firstService?.tigiao || '100%'}</span>
                        {hasMoreServices && (
                          <button
                            onClick={() => toggleExpand(country.name)}
                            className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
                            aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                          >
                            <svg
                              className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded service rows */}
                  {isExpanded && (
                    <>
                      {/* Sub-header for expanded section */}
                      <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="py-2 px-3 pl-10 text-left text-[11px] font-semibold text-slate-600">Dịch vụ</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Số lượng</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Gross W</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Charged W</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Re-weight</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Tiền xuất</th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-slate-600">Lợi nhuận</th>
                      </tr>
                        {country.services.slice(1).map((service, svcIndex) => (
                          <tr key={`${country.name}-service-${svcIndex}`} className="border-b border-slate-50 bg-blue-50/20 hover:bg-blue-50/40 transition-colors font-bold">
                            <td className="py-2.5 px-3 pl-10">
                              <span className="text-xs text-slate-700 font-bold">{service.name}</span>
                            </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-col gap-0">
                              <span className="text-xs font-medium text-slate-700">{service?.badge || '-'}</span>
                              <span className="text-xs text-slate-500">{service?.days ? `${service.days} đơn` : 'Đơn hàng'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs text-slate-700">{service?.grossW || '-'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-medium text-orange-400">{service?.chargedW || '-'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs text-red-600">{service?.reWeight || '-'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-semibold text-blue-500">{service?.revenue || '-'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-semibold text-green-600">{service?.profit || service?.tigiao || '-'}</span>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
