"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import AdSlot from "@/components/ads/AdSlot";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/format";
import { formatBytes } from "@/lib/format";
import { triggerDownload } from "@/lib/download";
import { createZip } from "@/core/engine/zip";
import type { ImageFormat } from "@/core/converters/image/formats";
import {
  needsConversion,
  optionsKey,
  useConverterStore,
} from "@/store/converter-store";
import Dropzone from "./Dropzone";
import FileCard from "./FileCard";
import OptionsPanel from "./OptionsPanel";

interface Props {
  /** Preselected output format. "original" keeps each file's own format. */
  defaultFormat: ImageFormat | "original";
  defaultQuality?: number;
  /** Show the "Same as original" choice (used by the compressor). */
  allowOriginal?: boolean;
}

export default function ConverterApp({
  defaultFormat,
  defaultQuality = 80,
  allowOriginal = false,
}: Props) {
  const { dict } = useI18n();
  const t = dict.converter;

  const jobs = useConverterStore((s) => s.jobs);
  const options = useConverterStore((s) => s.options);
  const addFiles = useConverterStore((s) => s.addFiles);
  const setOptions = useConverterStore((s) => s.setOptions);
  const convertAll = useConverterStore((s) => s.convertAll);
  const clear = useConverterStore((s) => s.clear);

  const [skipped, setSkipped] = useState(0);
  const [zipping, setZipping] = useState(false);

  // Apply the page's preset (e.g. png-to-jpg preselects JPG).
  useEffect(() => {
    setOptions({ format: defaultFormat, quality: defaultQuality });
  }, [defaultFormat, defaultQuality, setOptions]);

  const onFiles = useCallback(
    (files: File[]) => setSkipped(addFiles(files)),
    [addFiles],
  );

  const key = optionsKey(options);
  const pending = jobs.filter((job) => needsConversion(job, key)).length;
  const busy = jobs.some((j) => j.status === "queued" || j.status === "processing");
  const finished = jobs.filter((j) => j.status === "done" && j.result);
  const totalBefore = finished.reduce((sum, j) => sum + j.file.size, 0);
  const totalAfter = finished.reduce((sum, j) => sum + (j.result?.blob.size ?? 0), 0);

  async function downloadAll() {
    setZipping(true);
    try {
      const zip = await createZip(
        finished.map((j) => ({ name: j.result!.filename, blob: j.result!.blob })),
      );
      triggerDownload(zip, "easyconvert.zip");
    } finally {
      setZipping(false);
    }
  }

  return (
    <section className="grid gap-4" aria-label="Converter">
      <Dropzone onFiles={onFiles} compact={jobs.length > 0} />

      {skipped > 0 && (
        <p role="status" className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
          {t.unsupported} ({skipped})
        </p>
      )}

      <OptionsPanel allowOriginal={allowOriginal} />

      {jobs.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="convert-button"
              onClick={convertAll}
              disabled={pending === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="zap" className="size-5" />
              {busy ? t.converting : t.convertAll}
              {pending > 0 && !busy && (
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-sm tabular-nums">
                  {pending}
                </span>
              )}
            </button>

            {finished.length > 1 && (
              <button
                type="button"
                data-testid="download-all"
                onClick={downloadAll}
                disabled={zipping}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <Icon name="download" className="size-5" />
                {t.downloadAll}
              </button>
            )}

            <button
              type="button"
              onClick={clear}
              className="ms-auto rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {t.clear}
            </button>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {interpolate(t.files, { count: jobs.length })}
            {finished.length > 0 && totalBefore > totalAfter && (
              <> · {interpolate(t.totalSaved, { size: formatBytes(totalBefore - totalAfter) })}</>
            )}
          </p>

          <ul className="grid gap-2" data-testid="file-list">
            {jobs.map((job) => (
              <FileCard key={job.id} job={job} />
            ))}
          </ul>
        </>
      )}

      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <Icon name="lock" className="size-3.5" />
        {t.privacyNote}
      </p>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} />
    </section>
  );
}
