import { existsSync, rmSync } from "fs";

export default function clean() {
  if (existsSync(globalThis.dirs.dest))
    rmSync(globalThis.dirs.dest, { recursive: true, force: true });
}
