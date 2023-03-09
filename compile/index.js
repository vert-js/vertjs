/* eslint-disable no-undef */
import { mkdirSync, existsSync, rmSync } from "fs";
import copyStatic from "./copyStatic";
import transformSrc from "./tranformSrc";

globalThis.dirs = {
  dist: Bun.env.DIST || `dist`,
  src: Bun.env.SRC || `src`,
  static: Bun.env.STATIC || `static`,
};

if (existsSync(globalThis.dirs.dist))
  rmSync(globalThis.dirs.dist, { recursive: true, force: true });
mkdirSync(globalThis.dirs.dist);

copyStatic();
transformSrc();
