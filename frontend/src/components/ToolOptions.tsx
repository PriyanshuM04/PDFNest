import { useMemo } from "react";

interface ToolOptionsProps {
  toolId: string;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function ToolOptions({ toolId, values, onChange }: ToolOptionsProps) {
  const fields = useMemo(() => ({
    page_range: values.page_range ?? "",
    pages: values.pages ?? "",
    order: values.order ?? "",
    password: values.password ?? "",
    degrees: values.degrees ?? "90",
  }), [values]);

  switch (toolId) {
    case "split":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Page range</span>
          <input
            value={fields.page_range}
            onChange={(e) => onChange("page_range", e.target.value)}
            placeholder="e.g. 1-3"
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
          />
        </label>
      );
    case "remove-pages":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Pages to remove</span>
          <input
            value={fields.pages}
            onChange={(e) => onChange("pages", e.target.value)}
            placeholder="e.g. 2,4,5"
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
          />
        </label>
      );
    case "reorder-pages":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">New order</span>
          <input
            value={fields.order}
            onChange={(e) => onChange("order", e.target.value)}
            placeholder="e.g. 3,1,2"
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
          />
        </label>
      );
    case "encrypt":
    case "decrypt":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</span>
          <input
            value={fields.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="enter password"
            type="password"
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
          />
        </label>
      );
    case "rotate":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Pages</span>
            <input
              value={fields.pages}
              onChange={(e) => onChange("pages", e.target.value)}
              placeholder="e.g. 1,3"
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Degrees</span>
            <input
              value={fields.degrees}
              onChange={(e) => onChange("degrees", e.target.value)}
              placeholder="90"
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none"
            />
          </label>
        </div>
      );
    default:
      return null;
  }
}
