/* eslint-disable no-undef */
import { existsSync, mkdirSync } from "fs";
import type { VertJsEnv } from "types";
import humanFileSize from "utils/human";
import loadEnv from "utils/loadEnv";
import type FakeConsole from "utils/FakeConsole";
import copyStatic from "./steps/copyStatic";
import clean from "./steps/clean";
import optimize from "./steps/optimize";
import calcSize from "./steps/calcSize";
import build from "./steps/build";
import organize from "./steps/organize";

const { log } = console;

type Dirs = {
  src: string;
  dist: string;
  static: string;
};

const stepClean = (dirs: Dirs, console: Console | typeof FakeConsole) => {
  console.log(`\n🧹 \x1b[1mClean\x1b[0m \n\t${dirs.dist}`);
  clean(dirs.dist);
};

const stepBuild = async (dirs: Dirs, console: Console | typeof FakeConsole) => {
  console.log(`\n🧱 \x1b[1mBuild\x1b[0m`);
  await build(dirs.src, dirs.dist);
};

const stepOrganize = async (
  dirs: Dirs,
  env: VertJsEnv,
  console: Console | typeof FakeConsole,
) => {
  console.log(`\n🪴  \x1b[1mRe-organization\x1b[0m`);
  ["public", "routes"].forEach((d) => {
    mkdirSync(`${dirs.dist}/${d}`, { recursive: true });
  });
  const organizeFiles = await organize(dirs.dist, env);
  console.table(organizeFiles);
};

const stepStatics = (
  dirs: Dirs,
  console: Console | typeof FakeConsole,
): number => {
  let size = 0;
  if (existsSync(dirs.static)) {
    console.log(`\n📑 \x1b[1mCopy statics files\x1b[0m`);
    const staticFiles = copyStatic(dirs.static, dirs.dist);
    console.log(staticFiles);
    size = calcSize(dirs.static);
  }
  return size;
};

const stepOptim = async (dirs: Dirs, console: Console | typeof FakeConsole) => {
  console.log(`\n🪓  \x1b[1mOptimization\x1b[0m`);
  const optimizedFiles = await optimize(dirs.dist);
  console.table(optimizedFiles);
};

const stepFinal = (
  dirs: Dirs,
  staticSize: number,
  console: Console | typeof FakeConsole,
) => {
  const srcSize = calcSize(dirs.src) + staticSize;
  const distSize = calcSize(dirs.dist);
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
};

export default async function Render(
  path: string,
  console: Console | typeof FakeConsole,
) {
  const env: VertJsEnv = (await loadEnv(path)) as VertJsEnv;
  const dirs: Dirs = {
    src: `${path}/${env.SRC}`,
    dist: `${path}/${env.DIST}`,
    static: `${path}/${env.STATIC}`,
  };
  let time = performance.now();
  stepClean(dirs, console);
  await stepBuild(dirs, console);
  const staticSize = stepStatics(dirs, console);
  await stepOrganize(dirs, env, console);
  await stepOptim(dirs, console);
  time = performance.now() - time;
  stepFinal(dirs, staticSize, console);
  log(`🌱 takes \x1b[1m\x1b[32m${time.toFixed(3)}\x1b[0m ms`);
}
