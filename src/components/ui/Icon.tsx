const PATHS = {
  upload: "M12 16V4m0 0L7 9m5-5 5 5M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  download: "M12 4v12m0 0 5-5m-5 5-5-5M4 20h16",
  x: "M6 6l12 12M18 6 6 18",
  check: "M5 13l4 4L19 7",
  retry: "M4 4v6h6M20 20v-6h-6M5.6 15A8 8 0 0 0 20 14M18.4 9A8 8 0 0 0 4 10",
  image:
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 4.5a1.5 1.5 0 1 0 0 .01M21 16l-5-5-8 8",
  compress:
    "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7",
  audio: "M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  video: "M3 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm14 4 6-3v10l-6-3",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z",
  zap: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5",
  device:
    "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm5 17h.01",
  arrow: "M5 12h14m0 0-6-6m6 6-6 6",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
