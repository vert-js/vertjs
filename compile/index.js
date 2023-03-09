/* eslint-disable no-undef */
import { mkdirSync, existsSync, rmSync } from "fs";
import calcFinalSize from "./steps/calcFinalSize";
import copyStatic from "./steps/copyStatic";
import transformSrc from "./steps/tranformSrc";
import humanFileSize from "./utils/human";

globalThis.dirs = {
  dist: Bun.env.DIST || `dist`,
  src: Bun.env.SRC || `src`,
  static: Bun.env.STATIC || `static`,
};

if (existsSync(globalThis.dirs.dist))
  rmSync(globalThis.dirs.dist, { recursive: true, force: true });
mkdirSync(globalThis.dirs.dist);

globalThis.sizes = {
  origin: 0,
  final: 0,
};

let time = performance.now();

copyStatic();
await transformSrc();
calcFinalSize();

time = performance.now() - time;

// eslint-disable-next-line no-console
console.log(
  `🌱 Original size : ${humanFileSize(globalThis.sizes.origin)}
   Final size : ${humanFileSize(globalThis.sizes.final)}
   in ${time.toFixed(3)} ms`
);
