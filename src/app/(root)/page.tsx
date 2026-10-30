import type { Metadata } from "next";
import { defaultLocale, LOCALE_STORAGE_KEY, localeMeta, localeUrl, locales } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} – Free Online Image Converter`,
  alternates: { canonical: localeUrl(defaultLocale) },
};

/**
 * "/" has no content of its own. Visitors are sent to their language
 * (saved choice → browser language → default). The links below are what
 * search engines and no-JS visitors follow.
 */
export default function RootRedirectPage() {
  const script = `(function(){try{var L=${JSON.stringify(locales)};var s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});var b=(navigator.language||"").slice(0,2).toLowerCase();var l=L.indexOf(s)>-1?s:(L.indexOf(b)>-1?b:${JSON.stringify(defaultLocale)});location.replace("/"+l+"/");}catch(e){location.replace("/${defaultLocale}/");}})();`;

  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">{SITE_NAME}</h1>
        <p className="mt-6 flex flex-wrap justify-center gap-3">
          {locales.map((locale) => (
            <a
              key={locale}
              href={localeUrl(locale)}
              hrefLang={localeMeta[locale].htmlLang}
              className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white"
            >
              {localeMeta[locale].label}
            </a>
          ))}
        </p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </main>
  );
}
