# EasyConvert

Free, fast and private media converter. **Phase 1: image converter & compressor** (JPG, PNG, WebP, AVIF).
Everything runs inside the visitor's browser (Web Workers + WebAssembly codecs) — no uploads, no server cost.

- **Stack:** Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS 4 · Zustand · jSquash (MozJPEG / libwebp / libavif WASM) · fflate
- **Languages:** English (default) + Arabic (RTL). Adding a language = 3 small steps (see below).
- **SEO:** one static page per tool and per conversion (`/en/convert/png-to-jpg/` …), hreflang, sitemap, robots, JSON-LD.

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /en/)
npm run build      # static site in ./out
```

No computer set up? Open the repo in **GitHub Codespaces** (Code → Codespaces → Create) and run the same commands.

## Deploy (free)

The build output is plain static files, so any static host works.

| Host | Settings |
|---|---|
| **Vercel** | Import the GitHub repo → framework "Next.js" is detected → Deploy |
| **Cloudflare Pages** | Build command `npm run build` · Output directory `out` |
| **Netlify** | Build command `npm run build` · Publish directory `out` |

After deploying, set the environment variable `NEXT_PUBLIC_SITE_URL` to your real domain
(e.g. `https://easyconvert.com`) and redeploy — it is used for the sitemap and canonical/hreflang links.
Then submit `https://your-domain/sitemap.xml` to Google Search Console.

## Project structure

```
src/
├── app/
│   ├── (root)/page.tsx          "/" → redirects to the visitor's language
│   ├── [locale]/                one folder per page type
│   │   ├── page.tsx             home
│   │   ├── image-converter/     tool page
│   │   ├── image-compressor/    tool page
│   │   ├── convert/[slug]/      programmatic SEO pages (png-to-jpg, …)
│   │   └── privacy/
│   ├── sitemap.ts · robots.ts
├── core/                        engine — independent of the UI
│   ├── engine/                  Converter contract, registry, task queue, zip
│   ├── converters/image/        worker pool + Web Worker (decode → resize → encode)
│   └── tools.ts                 tool catalogue + conversion pairs
├── components/                  converter UI, layout, ads
├── store/converter-store.ts     file queue state (Zustand)
└── i18n/                        config, dictionaries (en.ts, ar.ts), provider
```

## How to extend

**Add a language** (e.g. French)
1. `src/i18n/config.ts` → add `"fr"` to `locales` and an entry in `localeMeta`.
2. Copy `src/i18n/dictionaries/en.ts` → `fr.ts` and translate (TypeScript lists missing keys).
3. Register it in `src/i18n/dictionaries/index.ts`.

**Add a tool** (audio, video …)
1. Create `src/core/converters/<name>/` implementing the `Converter` interface from `core/engine/types.ts`.
2. Register it in `src/core/converters/index.ts`.
3. Add an entry to `src/core/tools.ts`, strings to the dictionaries, and a page under `src/app/[locale]/`.

**Add a conversion page** — add the format to `PAIR_FORMATS` in `src/core/tools.ts`; the page, sitemap entry and hreflang tags are generated automatically.

## Google AdSense

Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_ADSENSE_CLIENT` and the slot ids once your account is approved.
`<AdSlot />` reserves its height (no layout shift) and renders nothing when AdSense is not configured.
For visitors in the EU/UK you will also need a consent banner (CMP) before enabling personalised ads.

## Roadmap

1. ✅ Image converter & compressor
2. Audio converter (FFmpeg.wasm single-thread — no special headers needed)
3. Video compressor/converter (FFmpeg.wasm multi-thread + WebCodecs fast path). Needs `COOP/COEP` headers on those pages only (host `_headers` / `vercel.json`) — isolate them so they do not conflict with ads.
4. Image extras: HEIC input, animated GIF/WebP, PNG optimisation (oxipng), crop/rotate.
5. Consent banner, analytics, more languages.

## Known limits (phase 1)

- Animated GIFs are converted as a single frame.
- SVG and HEIC input are not supported yet.
- Very large photos (50+ MP) can fail on low-memory phones; the file card shows the error with a Retry button.
