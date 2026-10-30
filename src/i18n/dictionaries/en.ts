/**
 * English dictionary. This file is the source of truth: the `Dictionary` type is
 * derived from it, so any other language must provide every key (TypeScript
 * will tell you what is missing).
 */
export const en = {
  site: {
    name: "EasyConvert",
    tagline: "Free, fast & private media converter",
    description:
      "Convert and compress images online for free. Everything runs inside your browser, so your files are never uploaded.",
  },
  nav: {
    home: "Home",
    imageConverter: "Image Converter",
    imageCompressor: "Image Compressor",
    privacy: "Privacy",
    language: "Language",
    menu: "Menu",
  },
  footer: {
    rights: "All rights reserved.",
    privacyLink: "Privacy Policy",
    note: "Your files never leave your device.",
    tools: "Tools",
    popular: "Popular conversions",
  },
  home: {
    title: "EasyConvert – Free Online Image Converter & Compressor",
    description:
      "Convert JPG, PNG, WebP and AVIF images and compress them for free. Fast, private and runs entirely in your browser – no upload, no sign-up.",
    heroTitle: "Convert & compress media in seconds",
    heroSubtitle:
      "Fast, free and 100% private. Your files are processed on your own device and never uploaded to a server.",
    cta: "Convert images now",
    toolsHeading: "Choose a tool",
    comingSoon: "Coming soon",
    popularHeading: "Popular conversions",
    featuresHeading: "Why EasyConvert?",
    features: [
      {
        title: "Private by design",
        text: "Files are converted locally in your browser. Nothing is uploaded, so nobody else can see your images.",
      },
      {
        title: "Blazing fast",
        text: "Modern WebAssembly codecs run on your device, with no waiting for uploads or downloads.",
      },
      {
        title: "Batch processing",
        text: "Drop dozens of images at once and download them all together as a single ZIP file.",
      },
      {
        title: "Works on every device",
        text: "A clean, touch-friendly interface that works on phones, tablets and desktops.",
      },
    ],
  },
  tools: {
    imageConverter: {
      name: "Image Converter",
      short: "Convert between JPG, PNG, WebP and AVIF.",
    },
    imageCompressor: {
      name: "Image Compressor",
      short: "Shrink image file size while keeping quality.",
    },
    audioConverter: {
      name: "Audio Converter",
      short: "Convert audio files between popular formats.",
    },
    videoCompressor: {
      name: "Video Compressor",
      short: "Reduce video size for sharing and uploading.",
    },
  },
  pages: {
    imageConverter: {
      title: "Free Image Converter – JPG, PNG, WebP, AVIF | EasyConvert",
      description:
        "Convert images between JPG, PNG, WebP and AVIF online for free. Batch conversion, adjustable quality, no upload – everything happens in your browser.",
      h1: "Image Converter",
      intro:
        "Drop your images, pick an output format and download the result. Supports JPG, PNG, WebP and AVIF.",
    },
    imageCompressor: {
      title: "Free Image Compressor – Reduce Image Size Online | EasyConvert",
      description:
        "Compress JPG, PNG and WebP images online without uploading them. Reduce file size by up to 90% with adjustable quality.",
      h1: "Image Compressor",
      intro:
        "Make your images smaller without a visible loss in quality. Files stay on your device.",
    },
  },
  pair: {
    title: "{from} to {to} Converter – Free & Private | EasyConvert",
    description:
      "Convert {from} to {to} online for free. Fast batch conversion that runs in your browser – your files are never uploaded.",
    h1: "{from} to {to} Converter",
    intro:
      "Convert your {from} images to {to} in a few clicks. Drag and drop your files, adjust the quality if you like, and download the results.",
    aboutHeading: "About {format}",
    howHeading: "How to convert {from} to {to}",
    steps: [
      "Drop your {from} files into the box above, or tap it to choose files.",
      "Check the output format ({to}) and adjust the quality if needed.",
      "Press Convert, then download your files one by one or all together as a ZIP.",
    ],
  },
  formats: {
    jpg: {
      about:
        "JPG (JPEG) is the most widely supported photo format. It uses lossy compression, which makes files small but does not support transparency.",
    },
    png: {
      about:
        "PNG is a lossless format that supports transparency. It is ideal for logos, screenshots and graphics, but photos can become large.",
    },
    webp: {
      about:
        "WebP is a modern format from Google that is typically 25–35% smaller than JPG or PNG, with support for transparency.",
    },
    avif: {
      about:
        "AVIF is a next-generation format that delivers excellent quality at very small sizes, often smaller than WebP. Support is growing quickly.",
    },
  },
  converter: {
    dropTitle: "Drop your images here",
    dropActive: "Drop to add your files",
    dropHint: "or tap to browse • you can also paste from the clipboard",
    browse: "Choose files",
    acceptedHint: "JPG, PNG, WebP, AVIF, GIF, BMP",
    outputFormat: "Output format",
    keepOriginal: "Same as original",
    quality: "Quality",
    qualityHint: "Lower quality = smaller file",
    resize: "Resize",
    resizeOff: "Keep original size",
    maxWidth: "Max width (px)",
    maxHeight: "Max height (px)",
    background: "Background for transparent areas (JPG)",
    convertAll: "Convert",
    converting: "Converting…",
    downloadAll: "Download all (ZIP)",
    download: "Download",
    clear: "Clear all",
    remove: "Remove",
    retry: "Retry",
    addMore: "Add more files",
    files: "{count} file(s)",
    queued: "Waiting",
    processing: "Processing",
    done: "Done",
    error: "Failed",
    saved: "{percent}% smaller",
    larger: "{percent}% larger",
    sameSize: "Same size",
    alreadyOptimized: "Already optimal – original kept",
    unsupported: "Unsupported file type",
    tooLarge: "File is very large and may be slow to process on this device",
    errorGeneric: "Could not convert this file",
    privacyNote:
      "Your images are processed in your browser and are never uploaded.",
    totalSaved: "Total saved: {size}",
  },
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. All conversion happens locally in your browser using WebAssembly. Your files never leave your device.",
      },
      {
        q: "Which image formats are supported?",
        a: "You can convert JPG, PNG, WebP, AVIF, GIF and BMP images to JPG, PNG, WebP or AVIF.",
      },
      {
        q: "Is there a file size limit?",
        a: "There is no fixed limit because nothing is uploaded. Very large images depend on your device's memory, so phones may be slower than computers.",
      },
      {
        q: "Is EasyConvert free?",
        a: "Yes, it is completely free. There is no sign-up and no watermark.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy | EasyConvert",
    description:
      "How EasyConvert handles your data: files are processed locally in your browser and are never uploaded.",
    h1: "Privacy Policy",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "Your files",
        text: "EasyConvert processes images entirely inside your web browser. Your files are not uploaded to our servers and we cannot see them.",
      },
      {
        heading: "Information we collect",
        text: "We do not require an account. We may use privacy-friendly analytics to understand how many people use the site, without identifying individuals.",
      },
      {
        heading: "Advertising and cookies",
        text: "We may display ads from third-party networks such as Google AdSense. These providers may use cookies to show ads based on your previous visits. You can manage ad personalization in your Google Ad Settings.",
      },
      {
        heading: "Contact",
        text: "If you have questions about this policy, please contact us using the details published on this website.",
      },
    ],
  },
};

export type Dictionary = typeof en;
