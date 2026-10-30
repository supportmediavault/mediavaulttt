import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getDictionary(locale).privacy;
  return pageMetadata({
    locale,
    path: "privacy",
    title: page.title,
    description: page.description,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const page = getDictionary(locale).privacy;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{page.h1}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{page.updated}</p>
      {page.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{section.text}</p>
        </section>
      ))}
    </article>
  );
}
