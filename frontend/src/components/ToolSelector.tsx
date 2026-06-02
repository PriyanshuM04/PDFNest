import type { ToolConfig, ToolId } from "../tools/toolTypes";

interface ToolSelectorProps {
  tools: ToolConfig[];
  selectedToolId: ToolId;
  onSelectTool: (toolId: ToolId) => void;
}

export function ToolSelector({ tools, selectedToolId, onSelectTool }: ToolSelectorProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Tool</span>
      <select
        value={selectedToolId}
        onChange={(event) => onSelectTool(event.target.value as ToolId)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-nest focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-950"
      >
        {tools.map((tool) => (
          <option key={tool.id} value={tool.id}>
            {tool.name}
          </option>
        ))}
      </select>
    </label>
  );
}
