"use client";

import { useI18n } from "@/i18n/I18nProvider";
import {
  FORMAT_LABEL,
  OUTPUT_FORMATS,
  type ImageFormat,
} from "@/core/converters/image/formats";
import { useConverterStore } from "@/store/converter-store";

const RESIZE_PRESETS = [3840, 2560, 1920, 1280, 1024, 800] as const;

export default function OptionsPanel({
  allowOriginal,
}: {
  allowOriginal: boolean;
}) {
  const { dict } = useI18n();
  const t = dict.converter;
  const options = useConverterStore((s) => s.options);
  const setOptions = useConverterStore((s) => s.setOptions);

  const formats: readonly (ImageFormat | "original")[] = allowOriginal
    ? ["original", ...OUTPUT_FORMATS]
    : OUTPUT_FORMATS;
  const showQuality = options.format !== "png";
  const showBackground = options.format === "jpg" || options.format === "original";
  const resizeValue = options.maxWidth ?? 0;

  return (
    <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="mb-2 text-sm font-semibold">{t.outputFormat}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.outputFormat}>
          {formats.map((format) => {
            const selected = options.format === format;
            return (
              <button
                key={format}
                type="button"
                role="radio"
                aria-checked={selected}
                data-testid={`format-${format}`}
                onClick={() => setOptions({ format })}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white hover:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
                }`}
              >
                {format === "original" ? t.keepOriginal : FORMAT_LABEL[format]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {showQuality && (
          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-semibold">
              {t.quality}
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs tabular-nums dark:bg-slate-800">
                {options.quality}
              </span>
            </span>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={options.quality}
              data-testid="quality"
              onChange={(e) => setOptions({ quality: Number(e.target.value) })}
              className="w-full accent-brand-600"
            />
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              {t.qualityHint}
            </span>
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{t.resize}</span>
          <select
            value={resizeValue}
            data-testid="resize"
            onChange={(e) => {
              const value = Number(e.target.value);
              setOptions({
                maxWidth: value || null,
                maxHeight: value || null,
              });
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value={0}>{t.resizeOff}</option>
            {RESIZE_PRESETS.map((px) => (
              <option key={px} value={px}>
                ≤ {px} px
              </option>
            ))}
          </select>
        </label>

        {showBackground && (
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input
              type="color"
              value={options.background}
              onChange={(e) => setOptions({ background: e.target.value })}
              className="size-9 cursor-pointer rounded-lg border border-slate-300 bg-transparent p-0.5 dark:border-slate-700"
            />
            <span className="text-slate-600 dark:text-slate-300">{t.background}</span>
          </label>
        )}
      </div>
    </div>
  );
}
