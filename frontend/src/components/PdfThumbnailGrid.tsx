import type { PdfPagePreview } from "../types/pdf";

interface PdfThumbnailGridProps {
  pages: PdfPagePreview[];
}

export function PdfThumbnailGrid({ pages }: PdfThumbnailGridProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Page thumbnails will appear here after PDF preview is connected.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {pages.map((page) => (
        <button
          type="button"
          key={page.pageNumber}
          className="aspect-[3/4] rounded-md border border-slate-200 bg-white p-3 text-left text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          Page {page.pageNumber}
        </button>
      ))}
    </div>
  );
}
