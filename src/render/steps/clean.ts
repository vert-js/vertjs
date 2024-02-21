import { existsSync, rmSync, mkdirSync } from "fs";

export default function clean(path: string) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  ["public", "routes"].forEach((d) =>
    mkdirSync(`${path}/${d}`, { recursive: true })
  );
}
