import type { MetadataRoute } from "next";
import { localeMeta, localeUrl, locales } from "@/i18n/config";
import { CONVERSION_PAIRS } from "@/core/tools";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const PATHS = [
  "",
  "image-converter",
  "image-compressor",
  "privacy",
  ...CONVERSION_PAIRS.map((pair) => `convert/${pair.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localeUrl(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("convert/") ? 0.7 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [localeMeta[l].htmlLang, `${SITE_URL}${localeUrl(l, path)}`]),
        ),
      },
    })),
  );
}
