import { useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";

interface FileDropzoneProps {
  files: File[];
  acceptsMultipleFiles: boolean;
  acceptsImages?: boolean;
  onFilesChange: (files: File[]) => void;
}

const imageAccept: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const pdfAccept: Accept = {
  "application/pdf": [".pdf"],
};

export function FileDropzone({
  files,
  acceptsMultipleFiles,
  acceptsImages = false,
  onFilesChange,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesChange(acceptsMultipleFiles ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1));
    },
    [acceptsMultipleFiles, files, onFilesChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: acceptsImages ? imageAccept : pdfAccept,
    multiple: acceptsMultipleFiles,
    onDrop,
    noClick: true,
  });

  return (
    <section
      {...getRootProps()}
      className={`grid min-h-72 place-items-center rounded-md border-2 border-dashed p-8 text-center transition ${
        isDragActive
          ? "border-nest bg-blue-50 dark:bg-blue-950/40"
          : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      <input {...getInputProps()} />
      <div className="grid max-w-md gap-4 justify-items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-50 text-nest dark:bg-blue-950">
          <UploadCloud size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">Drop files here</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {acceptsImages ? "Use JPG, PNG, or WebP images." : "Use PDF files up to the backend upload limit."}
          </p>
        </div>
        <button
          type="button"
          onClick={open}
          className="inline-flex h-11 items-center justify-center rounded-md bg-nest px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Select files
        </button>
      </div>
    </section>
  );
}