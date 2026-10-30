import type { ImageFormat } from "./formats";

/** Options after "same as original" has been resolved to a real format. */
export interface EncodeOptions {
  format: ImageFormat;
  /** 1–100 */
  quality: number;
  maxWidth: number | null;
  maxHeight: number | null;
  /** CSS color used to fill transparent pixels when writing JPG. */
  background: string;
}

export interface WorkerRequest {
  id: number;
  file: File;
  options: EncodeOptions;
}

export type WorkerResponse =
  | { id: number; type: "progress"; value: number }
  | {
      id: number;
      type: "done";
      buffer: ArrayBuffer;
      mime: string;
      width: number;
      height: number;
    }
  | { id: number; type: "error"; message: string };
