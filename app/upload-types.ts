export type UploadState = {
  status: "idle" | "success" | "partial" | "error";
  message?: string;
  successfulCount?: number;
  failedCount?: number;
};