import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/tool/ToolPageShell";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getDictionary(locale).pages.imageConverter;
  return pageMetadata({
    locale,
    path: "image-converter",
    title: page.title,
    description: page.description,
  });
}

export default async function ImageConverterPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = dict.pages.imageConverter;

  return (
    <ToolPageShell
      locale={locale}
      dict={dict}
      path="image-converter"
      h1={page.h1}
      intro={page.intro}
      defaultFormat="webp"
      defaultQuality={80}
    />
  );
}
