export type UploadResult = {
    id: string;
    status: "success" | "error";
    error?: string;
  }