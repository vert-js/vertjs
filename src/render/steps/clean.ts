import { existsSync, rmSync } from "fs";

export default function clean(path: string) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}
