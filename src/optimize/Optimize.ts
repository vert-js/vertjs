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
import type { OptimizeEnv } from "./Optimize.types";
import { loadEnv } from "utils/loadEnv";

export default class Optimize {
  static async optim(path: string) {
    const env: OptimizeEnv = (await loadEnv(path)) as OptimizeEnv;
    const dirs = {
      src: `${path}/${env.SRC || "src"}`,
      dest: `${path}/${env.DEST || "dest"}`,
      static: `${path}/${env.STATIC || "static"}`,
    };
    let time = performance.now();
    clean(dirs.dest);
    let staticSize = 0;
    if (existsSync(dirs.static)) {
      await copyStatic(dirs.static, dirs.dest);
      staticSize = calcSize(dirs.static);
    }
    await copyIndexHtml(
      await jsBundler(dirs.src, dirs.dest),
      await cssBundler(dirs.src, dirs.dest),
      dirs.src,
      dirs.dest
    );
    await optimize(dirs.dest);
    const srcSize = calcSize(dirs.src) + staticSize;
    const destSize = calcSize(dirs.dest);
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
