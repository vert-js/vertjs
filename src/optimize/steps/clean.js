import { existsSync, rmSync, mkdirSync } from "fs";

export default function clean() {
  if (existsSync(globalThis.dirs.dest))
    rmSync(globalThis.dirs.dest, { recursive: true, force: true });
  mkdirSync(`${globalThis.dirs.dest}/public`, { recursive: true });
}
