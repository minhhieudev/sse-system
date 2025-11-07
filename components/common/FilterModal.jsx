"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Filter, X, RotateCcw } from "lucide-react";

import OverlayModal from "./OverlayModal";

export default function FilterModal({ isOpen, onClose, filters, onApply }) {
  const [localFilters, setLocalFilters] = useState({});

  const activeFilterCount = Object.values(localFilters).reduce(
    (count, filter) => {
      if (!filter) return count;
      if (filter.type === "checkbox") {
        return count + ((filter.value || []).length > 0 ? 1 : 0);
      }
      if (filter.type === "dateRange") {
        return count + (filter.value?.from || filter.value?.to ? 1 : 0);
      }
      if (filter.type === "number") {
        return count + (filter.value?.min || filter.value?.max ? 1 : 0);
      }

      return count + (filter.value ? 1 : 0);
    },
    0,
  );
  const hasActiveFilters = activeFilterCount > 0;
  const inputClassNames = {
    label: "text-sm font-semibold text-slate-600",
    input: "text-sm text-slate-900",
    inputWrapper:
      "rounded-xl border-2 border-slate-200 bg-white hover:border-blue-300 group-data-[focus=true]:border-blue-500/80",
  };

  useEffect(() => {
    if (isOpen && filters) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key].type === "checkbox") {
        resetFilters[key] = { ...filters[key], value: [] };
      } else {
        resetFilters[key] = { ...filters[key], value: "" };
      }
    });

    setLocalFilters(resetFilters);
  };

  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  return (
    <OverlayModal
      contentClassName="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20"
      isOpen={isOpen}
      widthClass="w-full max-w-3xl"
      onClose={onClose}
    >
      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between border-b-2 border-blue-100 pb-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <Filter className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Bo loc nang cao
              </h3>
            </div>
            <p className="ml-12 text-sm text-slate-600">
              Tuỳ chỉnh tiêu chí để thu hẹp danh sách dữ liệu.
            </p>
          </div>
          <Button
            isIconOnly
            className="hover:bg-slate-100"
            variant="light"
            onPress={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-blue-100/60 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <span>
            {hasActiveFilters
              ? `${activeFilterCount} filters active`
              : "Ch��a ch��n b��T l��?c nA�o"}
          </span>
          {hasActiveFilters && (
            <Chip
              className="bg-blue-500/10"
              color="primary"
              size="sm"
              variant="flat"
            >
              {activeFilterCount}
            </Chip>
          )}
        </div>

        <div className="max-h-[60vh] grid grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2">
          {Object.entries(localFilters).map(([key, filter]) => (
            <div
              key={key}
              className={`space-y-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md ${["checkbox", "number", "dateRange"].includes(filter.type) ? "md:col-span-2" : ""}`}
            >
              {filter.type === "select" && (
                <Select
                  classNames={{
                    label: "text-sm font-semibold text-slate-600",
                    trigger:
                      "mt-1 rounded-xl border-2 border-slate-200 bg-white text-slate-900 transition-all focus:outline-none data-[hover=true]:border-blue-300 data-[open=true]:border-blue-500",
                    value: "font-medium text-slate-900",
                  }}
                  label={filter.label}
                  placeholder={
                    filter.placeholder || `Chọn ${filter.label.toLowerCase()}`
                  }
                  popoverProps={{
                    classNames: {
                      base: "rounded-xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur",
                    },
                  }}
                  selectedKeys={filter.value ? [filter.value] : []}
                  variant="bordered"
                  onChange={(event) => updateFilter(key, event.target.value)}
                >
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {filter.type === "date" && (
                <Input
                  classNames={inputClassNames}
                  label={filter.label}
                  type="date"
                  value={filter.value || ""}
                  variant="bordered"
                  onChange={(event) => updateFilter(key, event.target.value)}
                />
              )}

              {filter.type === "dateRange" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {filter.label}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      classNames={inputClassNames}
                      label="Từ ngày"
                      size="sm"
                      type="date"
                      value={filter.value?.from || ""}
                      variant="bordered"
                      onChange={(event) =>
                        updateFilter(key, {
                          ...filter.value,
                          from: event.target.value,
                        })
                      }
                    />
                    <Input
                      classNames={inputClassNames}
                      label="Đến ngày"
                      size="sm"
                      type="date"
                      value={filter.value?.to || ""}
                      variant="bordered"
                      onChange={(event) =>
                        updateFilter(key, {
                          ...filter.value,
                          to: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {filter.type === "checkbox" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {filter.label}
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {filter.options.map((option) => (
                      <Checkbox
                        key={option.value}
                        classNames={{
                          label: "text-sm font-medium text-slate-700",
                        }}
                        isSelected={filter.value?.includes(option.value)}
                        onValueChange={(checked) => {
                          const newValue = checked
                            ? [...(filter.value || []), option.value]
                            : (filter.value || []).filter(
                                (v) => v !== option.value,
                              );

                          updateFilter(key, newValue);
                        }}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              )}

              {filter.type === "number" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {filter.label}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      classNames={inputClassNames}
                      label="Từ"
                      size="sm"
                      type="number"
                      value={filter.value?.min || ""}
                      variant="bordered"
                      onChange={(event) =>
                        updateFilter(key, {
                          ...filter.value,
                          min: event.target.value,
                        })
                      }
                    />
                    <Input
                      classNames={inputClassNames}
                      label="Đến"
                      size="sm"
                      type="number"
                      value={filter.value?.max || ""}
                      variant="bordered"
                      onChange={(event) =>
                        updateFilter(key, {
                          ...filter.value,
                          max: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 border-t-2 border-blue-100 pt-6">
          <Button
            className="font-semibold"
            size="lg"
            startContent={<RotateCcw className="h-4 w-4" />}
            variant="flat"
            onPress={handleReset}
          >
            Đặt lại
          </Button>
          <Button
            className="font-semibold"
            size="lg"
            startContent={<X className="h-4 w-4" />}
            variant="light"
            onPress={onClose}
          >
            Hủy
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl"
            size="lg"
            startContent={<Filter className="h-4 w-4" />}
            onPress={handleApply}
          >
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    </OverlayModal>
  );
}
