/* eslint-disable no-undef */
import { existsSync } from "fs";
import jsBundler from "./steps/jsBundler";
import copyStatic from "./steps/copyStatic";
import humanFileSize from "./utils/human";
import clean from "./steps/clean";
import copyIndexHtml from "./steps/copyIndexHtml";
import optimize from "./steps/optimize";
import calcSize from "./steps/calcSize";
import cssBundler from "./steps/cssBundler";

export default class Optimize {
  static async optim(path) {
    globalThis.dirs = {
      dest: `${globalThis.path}/${globalThis.env.DEST || "dest"}`,
      src: `${globalThis.path}/${globalThis.env.SRC || "src"}`,
      static: `${globalThis.path}/${globalThis.env.STATIC || "static"}`,
    };
    let time = performance.now();
    clean();
    let staticSize = 0;
    if (existsSync(globalThis.dirs.static)) {
      await copyStatic();
      staticSize = calcSize(globalThis.dirs.static);
    }
    await copyIndexHtml(await jsBundler(), await cssBundler());
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
