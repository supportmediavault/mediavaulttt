import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/Icon";
import { isLocale, localeUrl } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { FORMAT_LABEL } from "@/core/converters/image/formats";
import { findPair, POPULAR_PAIR_SLUGS, TOOLS } from "@/core/tools";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "",
    title: dict.home.title,
    description: dict.home.description,
  });
}

const FEATURE_ICONS: IconName[] = ["lock", "zap", "layers", "device"];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}${localeUrl(locale)}`,
    description: dict.home.description,
  };

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-12 text-center sm:py-20">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          {dict.home.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {dict.home.heroSubtitle}
        </p>
        <Link
          href={localeUrl(locale, "image-converter")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          {dict.home.cta}
          <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
        </Link>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-2xl font-bold">
          {dict.home.toolsHeading}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => {
            const text = dict.tools[tool.dictKey];
            const live = tool.status === "live";
            const body = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <Icon name={tool.icon} className="size-6" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-semibold">
                    {text.name}
                    {!live && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {dict.home.comingSoon}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
                    {text.short}
                  </span>
                </span>
              </>
            );
            return (
              <li key={tool.id}>
                {live ? (
                  <Link
                    href={localeUrl(locale, tool.slug)}
                    className="flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-dashed border-slate-300 p-5 opacity-70 dark:border-slate-700">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-2xl font-bold">
          {dict.home.popularHeading}
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {POPULAR_PAIR_SLUGS.map((slug) => {
            const pair = findPair(slug);
            if (!pair) return null;
            return (
              <li key={slug}>
                <Link
                  href={localeUrl(locale, `convert/${slug}`)}
                  className="inline-block rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900"
                >
                  {FORMAT_LABEL[pair.from]} → {FORMAT_LABEL[pair.to]}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold">
          {dict.home.featuresHeading}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {dict.home.features.map((feature, i) => (
            <li
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Icon name={FEATURE_ICONS[i % FEATURE_ICONS.length]} />
              </span>
              <span>
                <span className="block font-semibold">{feature.title}</span>
                <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
                  {feature.text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
