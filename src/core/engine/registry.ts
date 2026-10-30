import type { Converter } from "./types";

const converters = new Map<string, Converter<never>>();

/** Register a converter. Called once per tool from core/converters/index.ts. */
export function registerConverter<O>(converter: Converter<O>): void {
  converters.set(converter.id, converter as unknown as Converter<never>);
}

export function getConverter<O>(id: string): Converter<O> {
  const found = converters.get(id);
  if (!found) throw new Error(`Converter "${id}" is not registered`);
  return found as unknown as Converter<O>;
}

export function listConverters(): Converter<never>[] {
  return [...converters.values()];
}
