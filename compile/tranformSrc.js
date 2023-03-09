/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync } from "fs";
import cssMinifier from "./minifier/css";
import htmlMinifier from "./minifier/html";

export default function transformSrc() {
  try {
    const files = readdirSync("src");
    files.forEach(async (file) => {
      const extension = file.split(".").pop();
      let content = await Bun.file(`./src/${file}`).text();
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
      await Bun.write(`./dist/${file}`, content);
      console.log(`🗜️  ${file} done`);
    });
  } catch (e) {
    console.log(e);
  }
}
