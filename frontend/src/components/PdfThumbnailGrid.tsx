import { Document, Page, pdfjs } from "react-pdf";
import { useMemo, useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfThumbnailGridProps {
  fileUrl: string | null;
  onLoadSuccess?: (numPages: number) => void;
  enableReorder?: boolean;
  onOrderChange?: (order: number[]) => void;
}

export function PdfThumbnailGrid({ fileUrl, onLoadSuccess, enableReorder = false, onOrderChange }: PdfThumbnailGridProps) {
  const [numPages, setNumPages] = useState(0);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    if (numPages > 0) setOrder(Array.from({ length: numPages }, (_, i) => i + 1));
  }, [numPages]);

  useEffect(() => {
    if (onOrderChange) onOrderChange(order);
  }, [order, onOrderChange]);

  if (!fileUrl) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Page thumbnails will appear here after PDF preview is connected.
      </div>
    );
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, idx: number) {
    e.dataTransfer.setData("text/plain", String(idx));
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, targetIdx: number) {
    e.preventDefault();
    const src = Number(e.dataTransfer.getData("text/plain"));
    if (isNaN(src)) return;
    if (src === targetIdx) return;
    setOrder((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(src, 1);
      arr.splice(targetIdx, 0, moved);
      return arr;
    });
  }

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={(doc) => {
        setNumPages(doc.numPages);
        onLoadSuccess?.(doc.numPages);
      }}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {order.map((pageNumber, idx) => (
          <div
            key={pageNumber}
            draggable={enableReorder}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
            className={`aspect-[3/4] overflow-hidden rounded-md border border-slate-200 bg-white p-0 text-left text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
              enableReorder ? "cursor-grab" : ""
            }`}
          >
            <Page pageNumber={pageNumber} width={200} renderTextLayer={false} />
            {enableReorder && (
              <div className="absolute mt-1 ml-1 rounded-sm bg-white/80 px-2 py-1 text-xs font-medium">{pageNumber}</div>
            )}
          </div>
        ))}
      </div>
    </Document>
  );
}
