/* eslint-disable no-undef */
import { existsSync } from "fs";
import bundle from "./steps/bundle";
import copyStatic from "./steps/copyStatic";
import humanFileSize from "./utils/human";
import clean from "./steps/clean";
import copyIndexHtml from "./steps/copyIndexHtml";
import optimize from "./steps/optimize";
import calcSize from "./steps/calcSize";

export default class Optimize {
  static async optim() {
    globalThis.dirs = {
      dest: Bun.env.DIST || `dist`,
      src: Bun.env.SRC || `src`,
      static: Bun.env.STATIC || `static`,
    };

    let time = performance.now();
    clean();
    const indexJS = await bundle();
    await copyIndexHtml(indexJS);
    let staticSize = 0;
    if (existsSync(globalThis.dirs.static)) {
      copyStatic();
      staticSize = calcSize(globalThis.dirs.static);
    }
    await optimize();
    const srcSize = calcSize(globalThis.dirs.src) + staticSize;
    const destSize = calcSize(globalThis.dirs.dest);
    time = performance.now() - time;

    // eslint-disable-next-line no-console
    console.log(
      `
Original size : ${humanFileSize(srcSize)}
Final size : ${humanFileSize(destSize)}
Gained size : ${humanFileSize(srcSize - destSize)} (${(
        (100 * (srcSize - destSize)) /
        srcSize
      ).toFixed(0)}%)
   in ${time.toFixed(3)} ms`
    );
  }
}
