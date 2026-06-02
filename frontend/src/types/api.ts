export interface HealthResponse {
  status: string;
  app: string;
  version: string;
}

export interface ToolInfoResponse {
  id: string;
  name: string;
  description: string;
  accepts_multiple_files: boolean;
  needs_page_selection: boolean;
  needs_password: boolean;
}

export interface ProcessResponse {
  success: boolean;
  file_id: string;
  filename: string;
  download_url: string;
}
