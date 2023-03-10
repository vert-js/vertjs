/* eslint-disable no-undef */
import { readdirSync } from "fs";

export default function copyStatic() {
  try {
    const files = readdirSync(globalThis.dirs.static);
    files.forEach(async (file) => {
      await Bun.write(
        Bun.file(`./${globalThis.dirs.dist}/${file}`),
        Bun.file(`./${globalThis.dirs.static}/${file}`)
      );
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}
