import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeUrl, type Locale } from "@/i18n/config";
import { FORMAT_LABEL } from "@/core/converters/image/formats";
import { findPair, POPULAR_PAIR_SLUGS } from "@/core/tools";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{dict.site.name}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {dict.footer.note}
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">{dict.footer.tools}</p>
          <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <Link className="hover:underline" href={localeUrl(locale, "image-converter")}>
                {dict.nav.imageConverter}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href={localeUrl(locale, "image-compressor")}>
                {dict.nav.imageCompressor}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href={localeUrl(locale, "privacy")}>
                {dict.footer.privacyLink}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">{dict.footer.popular}</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
            {POPULAR_PAIR_SLUGS.map((slug) => {
              const pair = findPair(slug);
              if (!pair) return null;
              return (
                <li key={slug}>
                  <Link className="hover:underline" href={localeUrl(locale, `convert/${slug}`)}>
                    {FORMAT_LABEL[pair.from]} → {FORMAT_LABEL[pair.to]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} {dict.site.name}. {dict.footer.rights}
      </p>
    </footer>
  );
}
