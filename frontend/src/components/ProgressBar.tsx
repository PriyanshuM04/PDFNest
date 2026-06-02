interface ProgressBarProps {
  value: number;
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{normalizedValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${normalizedValue}%` }} />
      </div>
    </div>
  );
}
