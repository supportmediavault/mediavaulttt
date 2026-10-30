import { registerConverter } from "../engine/registry";
import { imageConverter } from "./image";

/**
 * Register every converter here. To add audio or video later:
 *   1. create src/core/converters/audio/ implementing `Converter`
 *   2. register it below
 *   3. add a tool entry in src/core/tools.ts
 */
registerConverter(imageConverter);

export { imageConverter };
