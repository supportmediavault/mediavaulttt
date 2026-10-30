"use client";

import Icon from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/format";
import { formatBytes } from "@/lib/format";
import { useConverterStore, type Job } from "@/store/converter-store";

export default function FileCard({ job }: { job: Job }) {
  const { dict } = useI18n();
  const t = dict.converter;
  const removeJob = useConverterStore((s) => s.removeJob);
  const retry = useConverterStore((s) => s.retry);

  const result = job.result;
  let badge: { text: string; tone: "good" | "warn" | "neutral" } | null = null;
  if (job.status === "done" && result) {
    if (result.originalKept) {
      badge = { text: t.alreadyOptimized, tone: "neutral" };
    } else {
      const delta = Math.round((1 - result.blob.size / job.file.size) * 100);
      if (delta > 0) badge = { text: interpolate(t.saved, { percent: delta }), tone: "good" };
      else if (delta < 0) badge = { text: interpolate(t.larger, { percent: -delta }), tone: "warn" };
      else badge = { text: t.sameSize, tone: "neutral" };
    }
  }

  const statusText: Record<Job["status"], string> = {
    ready: "",
    queued: t.queued,
    processing: t.processing,
    done: t.done,
    error: t.error,
  };

  return (
    <li
      data-testid="file-card"
      data-status={job.status}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={job.previewUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-14 shrink-0 rounded-lg bg-slate-100 object-cover dark:bg-slate-800"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={job.file.name} dir="auto">
          {job.file.name}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">{formatBytes(job.file.size)}</span>
          {job.status === "done" && result && (
            <>
              <span aria-hidden="true">→</span>
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                {formatBytes(result.blob.size)}
              </span>
              {badge && (
                <span
                  className={`rounded-md px-1.5 py-0.5 font-semibold ${
                    badge.tone === "good"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : badge.tone === "warn"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {badge.text}
                </span>
              )}
            </>
          )}
          {(job.status === "queued" || job.status === "processing") && (
            <span>{statusText[job.status]}</span>
          )}
          {job.status === "error" && (
            <span className="text-red-600 dark:text-red-400" title={job.error}>
              {t.errorGeneric}
            </span>
          )}
        </p>

        {job.status === "processing" && (
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={job.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-brand-600 transition-[width]"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {job.status === "done" && result && (
          <a
            href={result.url}
            download={result.filename}
            data-testid="download-one"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Icon name="download" className="size-4" />
            <span className="hidden sm:inline">{t.download}</span>
            <span className="sr-only sm:hidden">{t.download}</span>
          </a>
        )}
        {job.status === "error" && (
          <button
            type="button"
            onClick={() => retry(job.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Icon name="retry" className="size-4" />
            <span className="hidden sm:inline">{t.retry}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => removeJob(job.id)}
          aria-label={t.remove}
          title={t.remove}
          className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Icon name="x" className="size-4" />
        </button>
      </div>
    </li>
  );
}
