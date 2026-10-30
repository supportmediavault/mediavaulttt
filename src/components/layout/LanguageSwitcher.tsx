"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  localeMeta,
  locales,
  type Locale,
} from "@/i18n/config";

/** Swaps the first path segment (/en/… → /ar/…) and remembers the choice. */
export default function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? `/${current}/`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}/${rest}`}
          hrefLang={localeMeta[locale].htmlLang}
          lang={localeMeta[locale].htmlLang}
          aria-current={locale === current ? "true" : undefined}
          onClick={() => {
            try {
              localStorage.setItem(LOCALE_STORAGE_KEY, locale);
            } catch {
              /* storage can be unavailable – ignore */
            }
          }}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            locale === current
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {localeMeta[locale].label}
        </Link>
      ))}
    </nav>
  );
}
