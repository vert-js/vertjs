/* eslint-disable no-undef */
import {
  mkdirSync,
  readdirSync,
  lstatSync,
  copyFileSync,
  existsSync,
} from "fs";
import path from "path";

function copyFolderSync(from, to) {
  if (!existsSync(to)) mkdirSync(to);
  readdirSync(from).map((element) => {
    if (lstatSync(path.join(from, element)).isFile()) {
      return copyFileSync(path.join(from, element), path.join(to, element));
    }
    return copyFolderSync(path.join(from, element), path.join(to, element));
  });
}

export default function copyStatic() {
  copyFolderSync(globalThis.dirs.static, globalThis.dirs.dist);
}
