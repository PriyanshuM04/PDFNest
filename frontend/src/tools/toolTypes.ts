export type ToolId =
  | "merge"
  | "split"
  | "remove-pages"
  | "reorder-pages"
  | "images-to-pdf"
  | "encrypt"
  | "decrypt"
  | "compress"
  | "rotate";

export type ToolCategory = "organize" | "convert" | "secure" | "optimize";

export interface ToolConfig {
  id: ToolId;
  name: string;
  description: string;
  category: ToolCategory;
  acceptsMultipleFiles: boolean;
  acceptsImages?: boolean;
  needsPageSelection?: boolean;
  needsPassword?: boolean;
}
