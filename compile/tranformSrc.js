/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync } from "fs";
import cssMinifier from "./minifier/css";
import htmlMinifier from "./minifier/html";

const humanFileSize = (bytes) => {
  const thresh = 1024;
  let res = bytes;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = ["kB", "MB"];
  let u = -1;
  const r = 10 ** 3;

  do {
    res /= thresh;
    u += 1;
  } while (Math.round(Math.abs(res) * r) / r >= thresh && u < units.length - 1);

  return `${res.toFixed(3)} ${units[u]}`;
};

export default function transformSrc() {
  try {
    const files = readdirSync("src");
    files.forEach(async (file) => {
      const extension = file.split(".").pop();
      const srcFile = Bun.file(`./src/${file}`);
      const originSize = srcFile.size;
      let content = await srcFile.text();
      let time = performance.now();
      switch (extension) {
        case "html":
          content = await htmlMinifier(content);
          break;
        case "css":
          content = await cssMinifier(content);
          break;
        default:
          break;
      }
      const destFile = Bun.file(`./dist/${file}`);
      await Bun.write(destFile, content);
      time = performance.now() - time;
      console.log(
        `🗜️ ${file} : from ${humanFileSize(originSize)} to ${humanFileSize(
          destFile.size
        )} in ${time.toFixed(3)} ms`
      );
    });
  } catch (e) {
    console.log(e);
  }
}
