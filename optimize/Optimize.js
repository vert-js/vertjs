/* eslint-disable no-undef */
import { mkdirSync, existsSync, rmSync } from "fs";
// import optimizerCSS from "./optimizer/css";
// import calcFinalSize from "./steps/calcFinalSize";
import copyStatic from "./steps/copyStatic";
import transformSrc from "./steps/tranformSrc";
import humanFileSize from "./utils/human";

export default class Optimize {
  static async optim() {
    globalThis.dirs = {
      dist: Bun.env.DIST || `dist`,
      src: Bun.env.SRC || `src`,
      static: Bun.env.STATIC || `static`,
    };

    globalThis.files = {
      html: [],
      css: [],
    };

    if (existsSync(globalThis.dirs.dist))
      rmSync(globalThis.dirs.dist, { recursive: true, force: true });
    mkdirSync(globalThis.dirs.dist);

    globalThis.sizes = {
      origin: 0,
      final: 0,
    };

    let time = performance.now();

    if (existsSync(globalThis.dirs.static)) copyStatic();
    transformSrc();
    // await optimizerCSS();
    // calcFinalSize();

    time = performance.now() - time;

    // eslint-disable-next-line no-console
    console.log(
      `🌱 Original size : ${humanFileSize(globalThis.sizes.origin)}
   Final size : ${humanFileSize(globalThis.sizes.final)}
   Gained size : ${humanFileSize(
     globalThis.sizes.origin - globalThis.sizes.final
   )} (${(
        (100 * (globalThis.sizes.origin - globalThis.sizes.final)) /
        globalThis.sizes.origin
      ).toFixed(0)}%)
   in ${time.toFixed(3)} ms`
    );
  }
}
