import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ImageFormat } from "@/core/converters/image/formats";
import ConverterApp from "@/components/converter/ConverterApp";
import AdSlot from "@/components/ads/AdSlot";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { localeUrl, type Locale } from "@/i18n/config";

/**
 * Shared layout for every tool page (converter, compressor, "png-to-jpg"…):
 * H1 + intro, the interactive tool, then crawlable SEO content and an FAQ.
 */
export default function ToolPageShell({
  locale,
  dict,
  path,
  h1,
  intro,
  defaultFormat,
  allowOriginal = false,
  defaultQuality,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  path: string;
  h1: string;
  intro: string;
  defaultFormat: ImageFormat | "original";
  allowOriginal?: boolean;
  defaultQuality?: number;
  /** Extra SEO content rendered under the tool (e.g. "How to convert X to Y"). */
  children?: ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: h1,
      description: intro,
      url: `${SITE_URL}${localeUrl(locale, path)}`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: dict.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{intro}</p>

      <div className="mt-8">
        <ConverterApp
          defaultFormat={defaultFormat}
          allowOriginal={allowOriginal}
          defaultQuality={defaultQuality}
        />
      </div>

      <div className="mt-12 grid gap-10">
        {children}

        <section>
          <h2 className="text-2xl font-bold">{dict.faq.heading}</h2>
          <div className="mt-4 grid gap-3">
            {dict.faq.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
