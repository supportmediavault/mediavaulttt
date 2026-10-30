/**
 * i18n configuration.
 *
 * To add a new language (e.g. French):
 *  1. add "fr" to `locales` below and an entry in `localeMeta`
 *  2. create src/i18n/dictionaries/fr.ts (copy en.ts and translate; TypeScript
 *     lists any missing key)
 *  3. register it in src/i18n/dictionaries/index.ts
 * Pages, sitemap, hreflang tags and the language switcher pick it up automatically.
 */
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }
> = {
  en: { label: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_AR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Builds a URL like /en/ or /en/convert/png-to-jpg/ (trailing slash: static export). */
export function localeUrl(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export const LOCALE_STORAGE_KEY = "easyconvert-locale";
