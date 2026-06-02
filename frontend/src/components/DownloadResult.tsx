import { Download } from "lucide-react";

interface DownloadResultProps {
  filename?: string;
  downloadUrl?: string;
}

export function DownloadResult({ filename, downloadUrl }: DownloadResultProps) {
  if (!filename || !downloadUrl) {
    return null;
  }

  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50">
      <p className="font-medium">Your file is ready</p>
      <a
        href={downloadUrl}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <Download size={16} />
        {filename}
      </a>
    </div>
  );
}
