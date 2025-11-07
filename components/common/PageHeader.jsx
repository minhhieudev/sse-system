"use client";

import { Button } from "@heroui/button";

export default function PageHeader({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <header className={`rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm ${className}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            {description && (
              <p className="text-sm font-medium text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {action && (
          <Button className="rounded-full" color="primary" {...action.props}>
            {action.content}
          </Button>
        )}
      </div>
    </header>
  );
}

