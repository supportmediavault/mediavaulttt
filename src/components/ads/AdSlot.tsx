"use client";

import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * A reserved-height ad container (prevents layout shift).
 * - Without AdSense env vars it renders nothing in production
 *   (and a dashed placeholder in development so you can see the position).
 * - Set NEXT_PUBLIC_ADSENSE_CLIENT and a slot id to turn it on.
 */
export default function AdSlot({
  slot,
  minHeight = 250,
}: {
  slot?: string;
  minHeight?: number;
}) {
  const pushed = useRef(false);
  const enabled = Boolean(CLIENT && slot);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* ad blockers etc. – ignore */
    }
  }, [enabled]);

  if (!enabled) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className="my-6 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-700"
        style={{ minHeight }}
      >
        Ad slot (dev placeholder)
      </div>
    );
  }

  return (
    <div className="my-6" style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
