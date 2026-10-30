import { create } from "zustand";
import "@/core/converters"; // registers all converters (side effect)
import { getConverter } from "@/core/engine/registry";
import { TaskQueue } from "@/core/engine/queue";
import { isAbortError, type JobStatus } from "@/core/engine/types";
import {
  DEFAULT_IMAGE_OPTIONS,
  type ImageOptions,
} from "@/core/converters/image";

export interface JobOutput {
  blob: Blob;
  filename: string;
  url: string;
  width?: number;
  height?: number;
  originalKept?: boolean;
  /** The settings this output was created with (to detect stale results). */
  optionsKey: string;
}

export interface Job {
  id: string;
  file: File;
  previewUrl: string;
  status: JobStatus;
  progress: number;
  result?: JobOutput;
  error?: string;
}

interface ConverterState {
  jobs: Job[];
  options: ImageOptions;
  /** Adds files and returns how many were skipped as unsupported. */
  addFiles: (files: File[]) => number;
  removeJob: (id: string) => void;
  clear: () => void;
  setOptions: (patch: Partial<ImageOptions>) => void;
  convertAll: () => void;
  retry: (id: string) => void;
}

const queue = new TaskQueue(2);
const controllers = new Map<string, AbortController>();
let counter = 0;

export function optionsKey(options: ImageOptions): string {
  return JSON.stringify([
    options.format,
    options.quality,
    options.maxWidth,
    options.maxHeight,
    options.background,
  ]);
}

/** True when a job still has to be (re)converted with the current settings. */
export function needsConversion(job: Job, key: string): boolean {
  if (job.status === "processing" || job.status === "queued") return false;
  if (job.status === "done") return job.result?.optionsKey !== key;
  return true; // ready or error
}

function splitName(name: string): { base: string; ext: string } {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { base: name, ext: "" };
  const ext = name.slice(dot + 1).toLowerCase();
  return { base: name.slice(0, dot), ext: ext === "jpeg" ? "jpg" : ext };
}

function revoke(job: Job): void {
  URL.revokeObjectURL(job.previewUrl);
  if (job.result) URL.revokeObjectURL(job.result.url);
}

export const useConverterStore = create<ConverterState>((set, get) => {
  const patch = (id: string, changes: Partial<Job>) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...changes } : job,
      ),
    }));

  const runJob = async (id: string, options: ImageOptions, key: string) => {
    const job = get().jobs.find((j) => j.id === id);
    if (!job || job.status !== "queued") return; // removed or cancelled meanwhile

    const converter = getConverter<ImageOptions>("image");
    const controller = new AbortController();
    controllers.set(id, controller);
    patch(id, { status: "processing", progress: 2 });

    try {
      const result = await converter.convert(job.file, options, {
        onProgress: (percent) => patch(id, { progress: percent }),
        signal: controller.signal,
      });

      const current = get().jobs.find((j) => j.id === id);
      if (!current) return; // removed while converting
      if (current.result) URL.revokeObjectURL(current.result.url);

      const { base, ext } = splitName(job.file.name);
      const filename = result.originalKept
        ? job.file.name
        : ext === result.extension
          ? `${base}-compressed.${result.extension}`
          : `${base}.${result.extension}`;

      patch(id, {
        status: "done",
        progress: 100,
        error: undefined,
        result: {
          blob: result.blob,
          filename,
          url: URL.createObjectURL(result.blob),
          width: result.width,
          height: result.height,
          originalKept: result.originalKept,
          optionsKey: key,
        },
      });
    } catch (error) {
      if (isAbortError(error)) return;
      patch(id, {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      controllers.delete(id);
    }
  };

  const enqueue = (ids: string[]) => {
    const { options } = get();
    const key = optionsKey(options);
    const converter = getConverter<ImageOptions>("image");
    queue.setConcurrency(converter.getConcurrency());
    set((state) => ({
      jobs: state.jobs.map((job) =>
        ids.includes(job.id)
          ? { ...job, status: "queued" as const, progress: 0, error: undefined }
          : job,
      ),
    }));
    for (const id of ids) void queue.add(() => runJob(id, options, key));
  };

  return {
    jobs: [],
    options: DEFAULT_IMAGE_OPTIONS,

    addFiles: (files) => {
      const converter = getConverter<ImageOptions>("image");
      const accepted = files.filter((file) => converter.canHandle(file));
      const jobs: Job[] = accepted.map((file) => ({
        id: `job-${Date.now().toString(36)}-${counter++}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "ready",
        progress: 0,
      }));
      if (jobs.length) set((state) => ({ jobs: [...state.jobs, ...jobs] }));
      return files.length - accepted.length;
    },

    removeJob: (id) => {
      controllers.get(id)?.abort();
      const job = get().jobs.find((j) => j.id === id);
      if (job) revoke(job);
      set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
    },

    clear: () => {
      for (const controller of controllers.values()) controller.abort();
      get().jobs.forEach(revoke);
      set({ jobs: [] });
    },

    setOptions: (patchOptions) =>
      set((state) => ({ options: { ...state.options, ...patchOptions } })),

    convertAll: () => {
      const key = optionsKey(get().options);
      const ids = get()
        .jobs.filter((job) => needsConversion(job, key))
        .map((job) => job.id);
      if (ids.length) enqueue(ids);
    },

    retry: (id) => enqueue([id]),
  };
});
