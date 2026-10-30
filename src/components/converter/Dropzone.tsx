"use client";

import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { ACCEPT_ATTRIBUTE } from "@/core/converters/image/formats";

export default function Dropzone({
  onFiles,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  compact?: boolean;
}) {
  const { dict } = useI18n();
  const t = dict.converter;
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);

  // Paste images straight from the clipboard (Ctrl/Cmd+V).
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const files = event.clipboardData?.files;
      if (files && files.length > 0) onFiles(Array.from(files));
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onFiles]);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setActive(false);
    if (event.dataTransfer.files.length > 0) {
      onFiles(Array.from(event.dataTransfer.files));
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="dropzone"
      onClick={() => inputRef.current?.click()}
      onKeyDown={onKeyDown}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      className={`group cursor-pointer rounded-2xl border-2 border-dashed text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        active
          ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
          : "border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-900/70"
      } ${compact ? "px-4 py-5" : "px-4 py-12 sm:py-16"}`}
    >
      <input
        ref={inputRef}
        data-testid="file-input"
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files));
          e.target.value = ""; // allow choosing the same file again
        }}
      />
      <div className="flex flex-col items-center gap-3">
        {!compact && (
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <Icon name="upload" className="size-7" />
          </span>
        )}
        <p className="text-lg font-semibold">
          {compact ? t.addMore : active ? t.dropActive : t.dropTitle}
        </p>
        <span className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm group-hover:bg-brand-700">
          <Icon name="image" className="size-4" />
          {t.browse}
        </span>
        {!compact && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.dropHint}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t.acceptedHint}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
