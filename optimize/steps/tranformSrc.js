/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync } from "fs";
import cssMinifier from "../minifier/css";
import htmlMinifier from "../minifier/html";
import humanFileSize from "../utils/human";

const transformFile = (file) =>
  new Promise((resolve) => {
    const extension = file.split(".").pop();
    const srcFile = Bun.file(`./${globalThis.dirs.src}/${file}`);
    const originSize = srcFile.size;
    globalThis.sizes.origin += originSize;
    srcFile.text().then((text) => {
      let content = text;
      let time = performance.now();
      switch (extension) {
        case "xml":
          content = htmlMinifier(content);
          break;
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
        globalThis.sizes.final += destFile.size;
        resolve(
          `🗜️  ${file}: 
            from ${humanFileSize(originSize)} 
            to ${humanFileSize(destFile.size)} 
            in ${time.toFixed(3)} ms`
        );
      });
    });
  });

export default function transformSrc() {
  return new Promise((resolve, reject) => {
    try {
      const files = readdirSync(globalThis.dirs.src);
      const promises = [];
      for (let i = 0; i < files.length; i += 1) {
        promises.push(transformFile(files[i]));
      }
      Promise.all(promises).then((logs) => {
        console.log(logs.join("\n"));
        resolve();
      });
    } catch (e) {
      console.log(e);
      reject();
    }
  });
}
