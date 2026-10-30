export interface ZipEntry {
  name: string;
  blob: Blob;
}

function uniqueName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 2;
  while (used.has(`${base} (${i})${ext}`)) i++;
  const result = `${base} (${i})${ext}`;
  used.add(result);
  return result;
}

/**
 * Bundles files into a ZIP. Images are already compressed, so we only "store"
 * them (level 0) which is instant and keeps memory low.
 * fflate is loaded on demand so it never slows down the first page view.
 */
export async function createZip(entries: ZipEntry[]): Promise<Blob> {
  const { zipSync } = await import("fflate");
  const used = new Set<string>();
  const files: Record<string, Uint8Array> = {};
  for (const entry of entries) {
    files[uniqueName(entry.name, used)] = new Uint8Array(
      await entry.blob.arrayBuffer(),
    );
  }
  const zipped = zipSync(files, { level: 0 });
  return new Blob([zipped as BlobPart], { type: "application/zip" });
}
