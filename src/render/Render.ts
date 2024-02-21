/* eslint-disable no-undef */
import { existsSync } from "fs";
import humanFileSize from "utils/human";
import loadEnv from "utils/loadEnv";
import type FakeConsole from "utils/FakeConsole";
import type { RenderEnv } from "./Render.types";
import copyStatic from "./steps/copyStatic";
import clean from "./steps/clean";
import optimize from "./steps/optimize";
import calcSize from "./steps/calcSize";
import build from "./steps/build";
import assets from "./steps/assets";

export default async function Render(
  path: string,
  console: Console | typeof FakeConsole,
) {
  const env: RenderEnv = (await loadEnv(path)) as RenderEnv;
  const dirs = {
    src: `${path}/${env.SRC || "src"}`,
    dist: `${path}/${env.DIST || "dist"}`,
    static: `${path}/${env.STATIC || "static"}`,
  };
  let time = performance.now();
  console.log(`\n🧹 \x1b[1mClean\x1b[0m \n\t${path}`);
  clean(dirs.dist);
  let staticSize = 0;
  if (existsSync(dirs.static)) {
    console.log(`\n📑 \x1b[1mCopy statics files\x1b[0m`);
    const staticFiles = copyStatic(dirs.static, dirs.dist);
    console.log(staticFiles);
    staticSize = calcSize(dirs.static);
  }
  console.log(`\n🧱 \x1b[1mBuild\x1b[0m`);
  await build(dirs.src, dirs.dist);
  console.log(`\n🪄  \x1b[1mOptimization\x1b[0m`);
  const optimizedFiles = await optimize(dirs.dist);
  console.table(optimizedFiles);
  console.log(`\n🪴  \x1b[1mRe-organization\x1b[0m`);
  const assetsFiles = assets(dirs.dist);
  console.table(assetsFiles);
  const srcSize = calcSize(dirs.src) + staticSize;
  const distSize = calcSize(dirs.dist);
  time = performance.now() - time;
  console.log(`\n🎉 \x1b[1mFinish\x1b[0m`);
  console.table([
    {
      dir: "Source (+ Static)",
      size: humanFileSize(srcSize),
    },
    {
      dir: "Destination",
      size: humanFileSize(distSize),
    },
    {
      dir: "Gained",
      size: `${humanFileSize(srcSize - distSize)} (${(
        (100 * (srcSize - distSize)) /
        srcSize
      ).toFixed(0)}%)`,
    },
  ]);

  console.log(`🌱 renders in \x1b[1m\x1b[32m${time.toFixed(3)}\x1b[0m ms`);
}
