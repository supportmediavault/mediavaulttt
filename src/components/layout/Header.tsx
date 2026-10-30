import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeUrl, type Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href={localeUrl(locale)} className="flex items-center gap-2 text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white" aria-hidden="true">
            ⇄
          </span>
          {dict.site.name}
        </Link>

        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto text-sm font-medium sm:order-none sm:mx-0 sm:w-auto sm:flex-1">
          <Link
            href={localeUrl(locale, "image-converter")}
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dict.nav.imageConverter}
          </Link>
          <Link
            href={localeUrl(locale, "image-compressor")}
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dict.nav.imageCompressor}
          </Link>
        </nav>

        <div className="ms-auto sm:ms-0">
          <LanguageSwitcher current={locale} label={dict.nav.language} />
        </div>
      </div>
    </header>
  );
}
