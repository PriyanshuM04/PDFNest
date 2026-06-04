import { useMemo, useState } from "react";
import { FileText, Play } from "lucide-react";

import { DownloadResult } from "../components/DownloadResult";
import { FileDropzone } from "../components/FileDropzone";
import { PdfThumbnailGrid } from "../components/PdfThumbnailGrid";
import { ProgressBar } from "../components/ProgressBar";
import { ToolSelector } from "../components/ToolSelector";
import { ToolOptions } from "../components/ToolOptions";
import { usePdfPreview } from "../hooks/usePdfPreview";
import { tools } from "../tools/toolConfig";
import type { ToolId } from "../tools/toolTypes";

export function HomePage() {
  const [selectedToolId, setSelectedToolId] = useState<ToolId>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ filename: string; downloadUrl: string } | null>(null);
  const [options, setOptions] = useState<Record<string, string>>({});
  const selectedTool = useMemo(
    () => tools.find((tool) => tool.id === selectedToolId) ?? tools[0],
    [selectedToolId],
  );
  const previewPages = usePdfPreview(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  function handleSelectTool(toolId: ToolId) {
    setSelectedToolId(toolId);
    setFiles([]);
  }

  useEffect(() => {
    // show preview for the first selected PDF file
    if (files.length > 0) {
      const f = files[0];
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }

    setPreviewUrl(null);
    setPageCount(0);
  }, [files]);

  async function handleProcess() {
    setProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      const { processTool } = await import("../services/api");
      const fields: Record<string, string> = { ...options };
      const resp = await processTool(selectedTool.id, files, fields, (p) => setProgress(p));
      // support both snake_case and camelCase responses
      const filename = (resp as any).filename ?? (resp as any).fileName ?? (resp as any).file_id;
      const downloadUrl = (resp as any).download_url ?? (resp as any).downloadUrl ?? (resp as any).downloadUrl;
      if (filename && downloadUrl) {
        const base = (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000";
        const finalUrl = downloadUrl.startsWith("/") ? `${base}${downloadUrl}` : downloadUrl;
        setResult({ filename, downloadUrl: finalUrl });
      } else {
        console.error("Unexpected process response", resp);
      }
      setProgress(100);
    } catch (err) {
      // TODO: surface error to the user
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  function handleOptionChange(name: string, value: string) {
    setOptions((s) => ({ ...s, [name]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <ToolSelector tools={tools} selectedToolId={selectedToolId} onSelectTool={handleSelectTool} />
          <button
            type="button"
            disabled={files.length === 0 || processing}
            onClick={handleProcess}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            <Play size={16} />
            {processing ? "Processing..." : "Process"}
          </button>
        </div>

        <FileDropzone
          files={files}
          acceptsMultipleFiles={selectedTool.acceptsMultipleFiles}
          acceptsImages={selectedTool.acceptsImages}
          onFilesChange={setFiles}
        />

        <div className="mt-4">
          <ToolOptions toolId={selectedTool.id} values={options} onChange={handleOptionChange} />
        </div>

        <ProgressBar value={progress} label="Processing progress" />
        <DownloadResult filename={result?.filename} downloadUrl={result?.downloadUrl} />
      </section>

      <aside className="grid content-start gap-4">
        <section className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{selectedTool.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedTool.description}</p>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <FileText size={16} />
            Files
          </div>
          {files.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No files selected.</p>
          ) : (
            <ul className="grid gap-2">
              {files.map((file) => (
                <li key={`${file.name}-${file.lastModified}`} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{file.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <PdfThumbnailGrid
          fileUrl={previewUrl}
          onLoadSuccess={(numPages) => setPageCount(numPages)}
          enableReorder={selectedTool.id === "reorder-pages"}
          onOrderChange={(order) => setOptions((s) => ({ ...s, order: order.join(",") }))}
        />
      </aside>
    </div>
  );
}
