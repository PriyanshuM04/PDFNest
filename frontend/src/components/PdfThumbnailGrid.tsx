import { Document, Page, pdfjs } from "react-pdf";
import { useMemo } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfThumbnailGridProps {
  fileUrl: string | null;
  onLoadSuccess?: (numPages: number) => void;
}

export function PdfThumbnailGrid({ fileUrl, onLoadSuccess }: PdfThumbnailGridProps) {
  const content = useMemo(() => {
    if (!fileUrl) {
      return (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Page thumbnails will appear here after PDF preview is connected.
        </div>
      );
    }

    return (
      <Document file={fileUrl} onLoadSuccess={(doc) => onLoadSuccess?.(doc.numPages)}>
        {/* Render first few pages as thumbnails */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="aspect-[3/4] overflow-hidden rounded-md border border-slate-200 bg-white p-0 text-left text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Page pageNumber={idx + 1} width={200} renderText={false} />
            </div>
          ))}
        </div>
      </Document>
    );
  }, [fileUrl, onLoadSuccess]);

  return <div>{content}</div>;
}
