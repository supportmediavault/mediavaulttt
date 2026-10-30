export type ImageFormat = "jpg" | "png" | "webp" | "avif";

export const OUTPUT_FORMATS: readonly ImageFormat[] = [
  "jpg",
  "png",
  "webp",
  "avif",
];

export const FORMAT_LABEL: Record<ImageFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
};

export const FORMAT_MIME: Record<ImageFormat, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

/** Formats the browser can read (decode). GIF/BMP are read but not written. */
const INPUT_BY_MIME: Record<string, ImageFormat | "gif" | "bmp"> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/x-ms-bmp": "bmp",
};

const INPUT_BY_EXTENSION: Record<string, ImageFormat | "gif" | "bmp"> = {
  jpg: "jpg",
  jpeg: "jpg",
  jpe: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
  gif: "gif",
  bmp: "bmp",
};

export const ACCEPT_ATTRIBUTE =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp";

export function detectInputFormat(
  file: File,
): ImageFormat | "gif" | "bmp" | null {
  const byMime = INPUT_BY_MIME[file.type.toLowerCase()];
  if (byMime) return byMime;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return INPUT_BY_EXTENSION[ext] ?? null;
}

export function fileExtension(format: ImageFormat): string {
  return format;
}
