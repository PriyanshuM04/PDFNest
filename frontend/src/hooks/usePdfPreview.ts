import { useMemo } from "react";

import type { PdfPagePreview } from "../types/pdf";

export function usePdfPreview(pageCount = 0): PdfPagePreview[] {
  return useMemo(
    () =>
      Array.from({ length: pageCount }, (_, index) => ({
        pageNumber: index + 1,
        selected: false,
        rotation: 0,
      })),
    [pageCount],
  );
}
