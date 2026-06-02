import type { ProcessResponse } from "../types/api";

export async function processTool(
  toolId: string,
  files: File[],
  fields?: Record<string, string>,
  onProgress?: (percent: number) => void,
): Promise<ProcessResponse> {
  const base = (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000";
  const url = `${base}/api/process/${toolId}`;

  const form = new FormData();
  // backend accepts 'files' for multi-file endpoints, 'file' for single-file
  const multi = toolId === "merge" || toolId === "images-to-pdf";
  if (multi) {
    files.forEach((f) => form.append("files", f));
  } else {
    // single file expected
    if (files.length > 0) form.append("file", files[0]);
  }

  if (fields) {
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json as ProcessResponse);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Server error ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(form);
  });
}
import type { HealthResponse, ToolInfoResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export function getTools(): Promise<ToolInfoResponse[]> {
  return request<ToolInfoResponse[]>("/tools");
}
