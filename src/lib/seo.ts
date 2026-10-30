import type { Metadata } from "next";
import {
  defaultLocale,
  localeMeta,
  localeUrl,
  locales,
  type Locale,
} from "@/i18n/config";
import { SITE_NAME } from "./site";

/** Builds title, description, canonical, hreflang and social tags for a page. */
export function pageMetadata(args: {
  locale: Locale;
  /** Path without locale, e.g. "image-converter" or "" for the home page. */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, path, title, description } = args;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].htmlLang] = localeUrl(l, path);
  languages["x-default"] = localeUrl(defaultLocale, path);

  return {
    title,
    description,
    alternates: { canonical: localeUrl(locale, path), languages },
    openGraph: {
      title,
      description,
      url: localeUrl(locale, path),
      siteName: SITE_NAME,
      locale: localeMeta[locale].ogLocale,
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
