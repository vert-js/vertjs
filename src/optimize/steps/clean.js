import { existsSync, rmSync, mkdirSync } from "fs";

export default function clean() {
  if (existsSync(globalThis.dirs.dest))
    rmSync(globalThis.dirs.dest, { recursive: true, force: true });
  ["public", "routes"].forEach((d) =>
    mkdirSync(`${globalThis.dirs.dest}/${d}`, { recursive: true })
  );
}
