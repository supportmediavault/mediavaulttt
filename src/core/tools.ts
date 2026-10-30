import type { Dictionary } from "@/i18n/dictionaries";
import type { ImageFormat } from "./converters/image/formats";

/**
 * Catalogue of tools shown on the home page and in navigation.
 * `status: "soon"` tools appear as "Coming soon" cards with no page yet.
 */
export interface ToolDefinition {
  id: string;
  /** Route segment under /[locale]/ */
  slug: string;
  /** Key inside dictionary.tools */
  dictKey: keyof Dictionary["tools"];
  icon: "image" | "compress" | "audio" | "video";
  status: "live" | "soon";
}

export const TOOLS: readonly ToolDefinition[] = [
  {
    id: "image-converter",
    slug: "image-converter",
    dictKey: "imageConverter",
    icon: "image",
    status: "live",
  },
  {
    id: "image-compressor",
    slug: "image-compressor",
    dictKey: "imageCompressor",
    icon: "compress",
    status: "live",
  },
  {
    id: "audio-converter",
    slug: "audio-converter",
    dictKey: "audioConverter",
    icon: "audio",
    status: "soon",
  },
  {
    id: "video-compressor",
    slug: "video-compressor",
    dictKey: "videoCompressor",
    icon: "video",
    status: "soon",
  },
];

/**
 * Programmatic SEO pages: one static page per conversion, e.g.
 * /en/convert/png-to-jpg/. Each targets a high-volume search query.
 */
const PAIR_FORMATS: readonly ImageFormat[] = ["jpg", "png", "webp", "avif"];

export interface ConversionPair {
  from: ImageFormat;
  to: ImageFormat;
  slug: string;
}

export const CONVERSION_PAIRS: readonly ConversionPair[] = PAIR_FORMATS.flatMap(
  (from) =>
    PAIR_FORMATS.filter((to) => to !== from).map((to) => ({
      from,
      to,
      slug: `${from}-to-${to}`,
    })),
);

export function findPair(slug: string): ConversionPair | undefined {
  return CONVERSION_PAIRS.find((pair) => pair.slug === slug);
}

/** The most searched conversions, shown as links on the home page. */
export const POPULAR_PAIR_SLUGS = [
  "png-to-jpg",
  "jpg-to-png",
  "webp-to-jpg",
  "webp-to-png",
  "jpg-to-webp",
  "png-to-webp",
  "avif-to-jpg",
  "jpg-to-avif",
] as const;
