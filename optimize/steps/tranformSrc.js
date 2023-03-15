/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync } from "fs";
import cssMinifier from "../minifier/css";
import htmlMinifier from "../minifier/html";
import humanFileSize from "../utils/human";

export default function transformSrc() {
  return new Promise((resolve, reject) => {
    try {
      const files = readdirSync(globalThis.dirs.src);
      const promises = [];
      files.forEach((file) =>
        promises.push(
          new Promise((resolveEach) => {
            const extension = file.split(".").pop();
            const srcFile = Bun.file(`./${globalThis.dirs.src}/${file}`);
            const originSize = srcFile.size;
            globalThis.sizes.origin += originSize;
            srcFile.text().then((text) => {
              let content = text;
              let time = performance.now();
              switch (extension) {
                case "xml":
                case "html":
                  content = htmlMinifier(content);
                  globalThis.files.html.push(file);
                  break;
                case "css":
                  content = cssMinifier(content);
                  globalThis.files.css.push(file);
                  break;
                default:
                  break;
              }
              const destFile = Bun.file(`./${globalThis.dirs.dist}/${file}`);
              Bun.write(destFile, content).then(() => {
                time = performance.now() - time;
                resolveEach(
                  `🗜️  ${file} : from ${humanFileSize(
                    originSize
                  )} to ${humanFileSize(destFile.size)} in ${time.toFixed(
                    3
                  )} ms`
                );
              });
            });
          })
        )
      );
      Promise.all(promises).then((logs) => {
        logs.forEach((log) => console.log(log));
        resolve();
      });
    } catch (e) {
      console.log(e);
      reject();
    }
  });
}
