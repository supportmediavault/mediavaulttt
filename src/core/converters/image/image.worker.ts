/**
 * Image conversion worker. Runs off the main thread so the page never freezes.
 *
 * Pipeline: decode (browser) → resize/draw on OffscreenCanvas → encode.
 * Encoding uses WebAssembly codecs (MozJPEG, libwebp, libavif via jSquash) and
 * falls back to the browser's native encoder if a codec cannot be loaded.
 */
import { encode as encodeJpeg } from "@jsquash/jpeg";
import { encode as encodeWebp } from "@jsquash/webp";
import { encode as encodeAvif } from "@jsquash/avif";
import type { EncodeOptions, WorkerRequest, WorkerResponse } from "./protocol";

const scope = self as unknown as {
  postMessage(message: WorkerResponse, transfer?: Transferable[]): void;
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
};

function post(message: WorkerResponse, transfer?: Transferable[]): void {
  scope.postMessage(message, transfer);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fitSize(
  width: number,
  height: number,
  maxWidth: number | null,
  maxHeight: number | null,
): { width: number; height: number } {
  let scale = 1;
  if (maxWidth && width > maxWidth) scale = Math.min(scale, maxWidth / width);
  if (maxHeight && height > maxHeight) {
    scale = Math.min(scale, maxHeight / height);
  }
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function nativeEncode(
  canvas: OffscreenCanvas,
  mime: string,
  quality: number,
): Promise<ArrayBuffer> {
  const blob = await canvas.convertToBlob({ type: mime, quality });
  // Browsers silently fall back to PNG when they cannot encode a type.
  if (blob.type !== mime) {
    throw new Error(`This browser cannot create ${mime} images.`);
  }
  return blob.arrayBuffer();
}

type Ctx2D = OffscreenCanvasRenderingContext2D;

async function encode(
  canvas: OffscreenCanvas,
  ctx: Ctx2D,
  options: EncodeOptions,
): Promise<{ buffer: ArrayBuffer; mime: string }> {
  const quality = clamp(Math.round(options.quality), 1, 100);

  switch (options.format) {
    case "png": {
      return {
        buffer: await nativeEncode(canvas, "image/png", 1),
        mime: "image/png",
      };
    }

    case "jpg": {
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return {
          buffer: await encodeJpeg(data, { quality }),
          mime: "image/jpeg",
        };
      } catch (error) {
        console.warn("MozJPEG unavailable, using native encoder", error);
        return {
          buffer: await nativeEncode(canvas, "image/jpeg", quality / 100),
          mime: "image/jpeg",
        };
      }
    }

    case "webp": {
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return {
          buffer: await encodeWebp(data, { quality }),
          mime: "image/webp",
        };
      } catch (error) {
        console.warn("libwebp unavailable, using native encoder", error);
        return {
          buffer: await nativeEncode(canvas, "image/webp", quality / 100),
          mime: "image/webp",
        };
      }
    }

    case "avif": {
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Newer jSquash versions use `quality` (0–100); older ones use `cqLevel`
        // (0–63, lower is better). We pass both so either version works.
        const avifOptions = {
          quality,
          cqLevel: Math.round(((100 - quality) / 100) * 63),
          speed: 7,
        };
        const buffer = await encodeAvif(data, avifOptions as never);
        return { buffer, mime: "image/avif" };
      } catch (error) {
        console.warn("libavif unavailable, trying native encoder", error);
        return {
          buffer: await nativeEncode(canvas, "image/avif", quality / 100),
          mime: "image/avif",
        };
      }
    }
  }
}

async function process(request: WorkerRequest): Promise<void> {
  const { id, file, options } = request;

  if (typeof OffscreenCanvas === "undefined") {
    throw new Error("Your browser is too old. Please update it and try again.");
  }

  // 1. Decode with the browser (handles orientation, JPG/PNG/WebP/AVIF/GIF/BMP).
  const bitmap = await createImageBitmap(file);
  post({ id, type: "progress", value: 15 });

  // 2. Resize (optional) and draw.
  const { width, height } = fitSize(
    bitmap.width,
    bitmap.height,
    options.maxWidth,
    options.maxHeight,
  );
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not create a drawing surface.");

  if (options.format === "jpg") {
    // JPG has no transparency: paint a solid background first.
    ctx.fillStyle = options.background || "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  post({ id, type: "progress", value: 45 });

  // 3. Encode.
  const { buffer, mime } = await encode(canvas, ctx, options);
  post({ id, type: "progress", value: 95 });

  post({ id, type: "done", buffer, mime, width, height }, [buffer]);
}

scope.onmessage = (event) => {
  const request = event.data;
  process(request).catch((error: unknown) => {
    post({
      id: request.id,
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  });
};
