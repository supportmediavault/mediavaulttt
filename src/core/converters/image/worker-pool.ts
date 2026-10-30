import type { EncodeOptions, WorkerRequest, WorkerResponse } from "./protocol";

interface Slot {
  worker: Worker;
  busy: boolean;
}

export interface WorkerJobResult {
  buffer: ArrayBuffer;
  mime: string;
  width: number;
  height: number;
}

/**
 * A small pool of Web Workers. Workers are created lazily and reused, so the
 * (large) WebAssembly codecs are only loaded once per worker.
 */
export class ImageWorkerPool {
  private slots: Slot[] = [];
  private waiting: Array<(slot: Slot) => void> = [];
  private nextId = 1;

  constructor(private readonly size: number) {}

  private createWorker(): Worker {
    // The `new URL(...)` form must stay inline so the bundler can find the file.
    return new Worker(new URL("./image.worker.ts", import.meta.url));
  }

  private acquire(): Promise<Slot> {
    const idle = this.slots.find((slot) => !slot.busy);
    if (idle) {
      idle.busy = true;
      return Promise.resolve(idle);
    }
    if (this.slots.length < this.size) {
      const slot: Slot = { worker: this.createWorker(), busy: true };
      this.slots.push(slot);
      return Promise.resolve(slot);
    }
    return new Promise((resolve) => this.waiting.push(resolve));
  }

  private release(slot: Slot): void {
    const next = this.waiting.shift();
    if (next) {
      next(slot); // hand the slot straight to the next waiting job
    } else {
      slot.busy = false;
    }
  }

  private replace(slot: Slot): void {
    slot.worker.terminate();
    slot.worker = this.createWorker();
  }

  async run(
    file: File,
    options: EncodeOptions,
    onProgress: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<WorkerJobResult> {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const slot = await this.acquire();
    const id = this.nextId++;

    if (signal?.aborted) {
      this.release(slot);
      throw new DOMException("Aborted", "AbortError");
    }

    return new Promise<WorkerJobResult>((resolve, reject) => {
      const worker = slot.worker;

      const cleanup = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        signal?.removeEventListener("abort", onAbort);
      };

      const onMessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.id !== id) return;
        if (message.type === "progress") {
          onProgress(message.value);
          return;
        }
        cleanup();
        this.release(slot);
        if (message.type === "done") {
          resolve({
            buffer: message.buffer,
            mime: message.mime,
            width: message.width,
            height: message.height,
          });
        } else {
          reject(new Error(message.message));
        }
      };

      const onError = (event: ErrorEvent) => {
        cleanup();
        this.replace(slot); // the worker may be in a broken state
        this.release(slot);
        reject(new Error(event.message || "Worker crashed"));
      };

      const onAbort = () => {
        cleanup();
        this.replace(slot); // stop the running job immediately
        this.release(slot);
        reject(new DOMException("Aborted", "AbortError"));
      };

      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      signal?.addEventListener("abort", onAbort);

      const request: WorkerRequest = { id, file, options };
      worker.postMessage(request);
    });
  }
}
