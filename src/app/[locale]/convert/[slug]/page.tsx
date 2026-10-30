import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/tool/ToolPageShell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/format";
import { FORMAT_LABEL } from "@/core/converters/image/formats";
import { CONVERSION_PAIRS, findPair } from "@/core/tools";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    CONVERSION_PAIRS.map((pair) => ({ locale, slug: pair.slug })),
  );
}

function vars(from: keyof typeof FORMAT_LABEL, to: keyof typeof FORMAT_LABEL) {
  return { from: FORMAT_LABEL[from], to: FORMAT_LABEL[to] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const pair = findPair(slug);
  if (!isLocale(locale) || !pair) return {};
  const { pair: text } = getDictionary(locale);
  const v = vars(pair.from, pair.to);
  return pageMetadata({
    locale,
    path: `convert/${slug}`,
    title: interpolate(text.title, v),
    description: interpolate(text.description, v),
  });
}

export default async function ConvertPairPage({ params }: Props) {
  const { locale, slug } = await params;
  const pair = findPair(slug);
  if (!isLocale(locale) || !pair) notFound();

  const dict = getDictionary(locale);
  const text = dict.pair;
  const v = vars(pair.from, pair.to);

  return (
    <ToolPageShell
      locale={locale}
      dict={dict}
      path={`convert/${slug}`}
      h1={interpolate(text.h1, v)}
      intro={interpolate(text.intro, v)}
      defaultFormat={pair.to}
      defaultQuality={pair.to === "avif" ? 65 : 85}
    >
      <section>
        <h2 className="text-2xl font-bold">{interpolate(text.howHeading, v)}</h2>
        <ol className="mt-4 grid list-decimal gap-2 ps-6 text-slate-700 dark:text-slate-300">
          {text.steps.map((step) => (
            <li key={step}>{interpolate(step, v)}</li>
          ))}
        </ol>
      </section>

      {[pair.from, pair.to].map((format) => (
        <section key={format}>
          <h2 className="text-2xl font-bold">
            {interpolate(text.aboutHeading, { format: FORMAT_LABEL[format] })}
          </h2>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {dict.formats[format].about}
          </p>
        </section>
      ))}
    </ToolPageShell>
  );
}
