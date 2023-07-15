/* eslint-disable no-undef */
import { readdirSync, lstatSync, mkdirSync } from "fs";
import path from "path";

function copyFolderSync(from, to) {
  readdirSync(from).forEach((element) => {
    if (lstatSync(path.join(from, element)).isFile()) {
      const input = Bun.file(`${from}/${element}`);
      const destDir = from.replace(
        new RegExp(`^${globalThis.dirs.static}/`, "g"),
        `${globalThis.dirs.dest}/`
      );
      const output = Bun.file(`${destDir}/${element}`);
      mkdirSync(destDir, {
        recursive: true,
      });
      Bun.write(output, input);
      return;
    }
    copyFolderSync(path.join(from, element), path.join(to, element));
  });
}

export default function copyStatic() {
  copyFolderSync(globalThis.dirs.static, globalThis.dirs.dist);
}
