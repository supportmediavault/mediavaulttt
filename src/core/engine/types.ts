/**
 * The core contract of EasyConvert.
 *
 * Every tool (image, audio, video…) is a `Converter`. The UI and the job queue
 * only know this interface, so adding a new tool never requires touching them.
 */
export type MediaCategory = "image" | "audio" | "video";

export interface ConvertContext {
  /** Report progress as a number from 0 to 100. */
  onProgress: (percent: number) => void;
  /** Aborting must stop the work and reject with an AbortError. */
  signal?: AbortSignal;
}

export interface ConvertResult {
  blob: Blob;
  /** File extension without the dot, e.g. "webp". */
  extension: string;
  width?: number;
  height?: number;
  /** Set when the converter decided the original file was already optimal. */
  originalKept?: boolean;
}

export interface Converter<Options = unknown> {
  id: string;
  category: MediaCategory;
  /** Can this converter read the given file? */
  canHandle(file: File): boolean;
  /** How many files may be processed at the same time on this device. */
  getConcurrency(): number;
  convert(
    file: File,
    options: Options,
    context: ConvertContext,
  ): Promise<ConvertResult>;
}

/** ready = added by the user, waiting for the "Convert" button. */
export type JobStatus = "ready" | "queued" | "processing" | "done" | "error";

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
