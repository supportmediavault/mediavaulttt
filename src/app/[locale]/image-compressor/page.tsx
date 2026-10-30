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
  const page = getDictionary(locale).pages.imageCompressor;
  return pageMetadata({
    locale,
    path: "image-compressor",
    title: page.title,
    description: page.description,
  });
}

export default async function ImageCompressorPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = dict.pages.imageCompressor;

  return (
    <ToolPageShell
      locale={locale}
      dict={dict}
      path="image-compressor"
      h1={page.h1}
      intro={page.intro}
      defaultFormat="original"
      defaultQuality={70}
      allowOriginal
    />
  );
}
