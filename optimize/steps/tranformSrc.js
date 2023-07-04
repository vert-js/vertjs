/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync, mkdirSync } from "fs";
import cssMinifier from "../minifier/css";
import htmlMinifier from "../minifier/html";
import humanFileSize from "../utils/human";

const transformFile = (file) =>
  new Promise((resolve) => {
    const extension = file.split(".").pop();
    const srcFile = Bun.file(`./${file}`);
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
      const path = `./${file.replace(
        new RegExp(`^${globalThis.dirs.src}/`),
        `${globalThis.dirs.dist}/`
      )}`;
      // mkdir if needed
      mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
      const destFile = Bun.file(path);
      Bun.write(destFile, content).then(() => {
        time = performance.now() - time;
        globalThis.sizes.final += destFile.size;
        resolve(
          `🗜️  ${file}: from ${humanFileSize(originSize)} to ${humanFileSize(
            destFile.size
          )} in ${time.toFixed(3)} ms`
        );
      });
    });
  });

const recurseDir = async (dir) =>
  new Promise((resolve, reject) => {
    try {
      const files = readdirSync(dir, {
        withFileTypes: true,
      });
      const promises = [];
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].isFile()) {
          promises.push(transformFile(`${dir}/${files[i].name}`));
        } else promises.push(recurseDir(`${dir}/${files[i].name}`));
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

export default async function transformSrc() {
  await recurseDir(globalThis.dirs.src);
}
