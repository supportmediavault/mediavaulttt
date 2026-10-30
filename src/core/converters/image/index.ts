import type { Converter } from "../../engine/types";
import {
  FORMAT_MIME,
  detectInputFormat,
  fileExtension,
  type ImageFormat,
} from "./formats";
import type { EncodeOptions } from "./protocol";
import { ImageWorkerPool } from "./worker-pool";

export interface ImageOptions {
  /** "original" keeps each file's own format (used for compression). */
  format: ImageFormat | "original";
  /** 1–100 */
  quality: number;
  maxWidth: number | null;
  maxHeight: number | null;
  background: string;
}

export const DEFAULT_IMAGE_OPTIONS: ImageOptions = {
  format: "webp",
  quality: 80,
  maxWidth: null,
  maxHeight: null,
  background: "#ffffff",
};

function poolSize(): number {
  const cores =
    typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2;
  // Image encoding is memory hungry; stay conservative, especially on phones.
  return Math.max(1, Math.min(3, cores - 1));
}

let pool: ImageWorkerPool | null = null;
function getPool(): ImageWorkerPool {
  pool ??= new ImageWorkerPool(poolSize());
  return pool;
}

function resolveFormat(file: File, requested: ImageOptions["format"]): ImageFormat {
  if (requested !== "original") return requested;
  const input = detectInputFormat(file);
  // GIF/BMP cannot be written; WebP is the best general-purpose replacement.
  return input && input !== "gif" && input !== "bmp" ? input : "webp";
}

export const imageConverter: Converter<ImageOptions> = {
  id: "image",
  category: "image",

  canHandle: (file) => detectInputFormat(file) !== null,

  getConcurrency: poolSize,

  async convert(file, options, { onProgress, signal }) {
    const format = resolveFormat(file, options.format);
    const encodeOptions: EncodeOptions = {
      format,
      quality: options.quality,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      background: options.background,
    };

    const result = await getPool().run(file, encodeOptions, onProgress, signal);
    onProgress(100);

    const blob = new Blob([result.buffer], { type: FORMAT_MIME[format] });

    // Compressing a file into its own format must never make it bigger:
    // if that happens (and no resize was requested) keep the original bytes.
    const sameFormat = detectInputFormat(file) === format;
    const resized = options.maxWidth !== null || options.maxHeight !== null;
    if (sameFormat && !resized && blob.size >= file.size) {
      return {
        blob: file,
        extension: fileExtension(format),
        width: result.width,
        height: result.height,
        originalKept: true,
      };
    }

    return {
      blob,
      extension: fileExtension(format),
      width: result.width,
      height: result.height,
    };
  },
};
