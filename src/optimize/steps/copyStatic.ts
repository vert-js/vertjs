/* eslint-disable no-undef */
import { readdirSync, lstatSync, mkdirSync } from "fs";
import path from "path";

function copyFolderSync(
  from: string,
  to: string,
  staticPath: string,
  distPath: string
) {
  readdirSync(from).forEach((element) => {
    if (lstatSync(path.join(from, element)).isFile()) {
      const input = Bun.file(`${from}/${element}`);
      const destDir = from.replace(
        new RegExp(`^${staticPath}/`, "g"),
        `${distPath}/`
      );
      const output = Bun.file(`${destDir}/${element}`);
      mkdirSync(destDir, {
        recursive: true,
      });
      Bun.write(output, input);
      return;
    }
    copyFolderSync(
      path.join(from, element),
      path.join(to, element),
      staticPath,
      distPath
    );
  });
}

export default function copyStatic(staticPath: string, distPath: string) {
  copyFolderSync(staticPath, distPath, staticPath, distPath);
}
